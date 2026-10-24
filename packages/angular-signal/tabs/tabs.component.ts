import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { ɵnextTab, ɵpageTabs, ɵrevealTab, ɵtabEdges, WtTabsChangeEvent } from './tabs.types';

/**
 * Tabs: `<wt-tabs [(activeIndex)]="i"><wt-tab-panel header="ข้อมูล">…</wt-tab-panel></wt-tabs>`.
 * Arrow keys, Home and End move between tabs. A row that runs out of room scrolls sideways, with arrow
 * buttons at the edges that have more tabs behind them.
 */
@Component({
  selector: 'wt-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTabs {
  /** Two-way: `[(activeIndex)]`. */
  readonly activeIndex = model(0);
  readonly ariaLabel = input<string>();
  /** Accepted for templates written for scrollable tab views: the arrows appear on their own whenever tabs overflow. */
  readonly scrollable = input<unknown>();

  readonly onChange = output<WtTabsChangeEvent>();

  readonly panels = contentChildren(forwardRef(() => WtTabPanel));
  readonly baseId = ɵuniqueId('wt-tabs');
  readonly canPrev = signal(false);
  readonly canNext = signal(false);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    afterNextRender(() => {
      const list = this.list()?.nativeElement;
      if (!list || typeof ResizeObserver !== 'function') return;
      const resize = new ResizeObserver(() => this.updateArrows());
      resize.observe(list);
      this.destroyRef.onDestroy(() => resize.disconnect());
    });
    // Keep the selected tab in view, however it was chosen.
    effect(() => {
      const index = this.activeIndex();
      this.panels();
      if (typeof requestAnimationFrame !== 'function') return;
      requestAnimationFrame(() => {
        const list = this.list()?.nativeElement;
        if (!list) return;
        ɵrevealTab(list, list.querySelectorAll<HTMLElement>('.wt-tab')[index]);
        this.updateArrows();
      });
    });
  }

  /** Shows the arrow of each edge that has tabs behind it. */
  updateArrows(): void {
    const list = this.list()?.nativeElement;
    if (!list) return;
    const e = ɵtabEdges(list);
    this.canPrev.set(e.prev);
    this.canNext.set(e.next);
  }

  page(direction: -1 | 1): void {
    const list = this.list()?.nativeElement;
    if (list) ɵpageTabs(list, direction);
  }

  tabClasses(index: number): string {
    return index === this.activeIndex() ? 'wt-tab wt-tab-active p-tab p-tab-active' : 'wt-tab p-tab';
  }

  select(index: number, event: Event): void {
    const panel = this.panels()[index];
    if (!panel || panel.disabled() || index === this.activeIndex()) return;
    this.activeIndex.set(index);
    this.onChange.emit({ index, originalEvent: event });
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const next = ɵnextTab(event.key, index, this.panels().map((p) => p.disabled()));
    if (next === null) return;
    event.preventDefault();
    this.select(next, event);
    const tabs = this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wt-tab');
    tabs[next]?.focus();
  }
}

/** Content of one tab: `<wt-tab-panel header="ข้อมูล" leftIcon="pi pi-user" [disabled]="…">`. */
@Component({
  selector: 'wt-tab-panel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-tabpanel p-tabpanel',
    role: 'tabpanel',
    '[id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[hidden]': '!active()',
  },
})
export class WtTabPanel {
  readonly header = input<string>();
  /** Icon class before the header, e.g. `pi pi-user`. */
  readonly leftIcon = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly tabs = inject(WtTabs, { optional: true });
  readonly index = computed(() => (this.tabs ? this.tabs.panels().indexOf(this) : 0));
  readonly active = computed(() => !this.tabs || this.tabs.activeIndex() === this.index());
  readonly panelId = computed(() => (this.tabs ? `${this.tabs.baseId}-panel-${this.index()}` : null));
  readonly tabId = computed(() => (this.tabs ? `${this.tabs.baseId}-tab-${this.index()}` : null));
}
