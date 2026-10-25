import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
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
import { ɵnextTab, ɵpageTabs, ɵrevealTab, ɵtabEdges, ɵtabKey, WtTabsChangeEvent, WtTabValue } from './tabs.types';

/**
 * Tabs, written either way apps already write them:
 * - by index: `<wt-tabs [(activeIndex)]="i"><wt-tab-panel header="ข้อมูล">…</wt-tab-panel></wt-tabs>`
 *   (`wt-tabview` / `wt-tabpanel` are the same components);
 * - by value: `<wt-tabs [(value)]="tab"><wt-tablist><wt-tab value="info">ข้อมูล</wt-tab></wt-tablist>
 *   <wt-tabpanels><wt-tabpanel value="info">…</wt-tabpanel></wt-tabpanels></wt-tabs>`.
 * Arrow keys, Home and End move between tabs. A row that runs out of room scrolls sideways, with arrow
 * buttons at the edges that have more tabs behind them.
 */
@Component({
  selector: 'wt-tabs, wt-tabview, wt-tabView',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTabs {
  /** Two-way: `[(activeIndex)]` (tabs by index). */
  readonly activeIndex = model(0);
  /**
   * Two-way: `[(value)]` (tabs by value, with `wt-tablist` / `wt-tab`). Unset: the first tab. Typed `any` so the field
   * it binds to can be a string, a number or a union of the app's own tab names.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(undefined);
  readonly ariaLabel = input<string>();
  /** Accepted for templates written for scrollable tab views: the arrows appear on their own whenever tabs overflow. */
  readonly scrollable = input<unknown>();
  /** Accepted for templates moving over: panels are always rendered, hidden ones with `hidden`. */
  readonly lazy = input<unknown>();
  readonly selectOnFocus = input<unknown>();
  readonly showNavigators = input<unknown>();

  readonly onChange = output<WtTabsChangeEvent>();

  readonly panels = contentChildren(forwardRef(() => WtTabPanel));
  readonly tabList = contentChild(forwardRef(() => WtTabList));
  readonly tabItems = contentChildren(forwardRef(() => WtTab), { descendants: true });
  /** Written with `wt-tablist` / `wt-tab` / `wt-tabpanels` instead of panel headers. */
  readonly valueMode = computed(() => !!this.tabList());
  readonly activeValue = computed(() => this.value() ?? this.tabItems()[0]?.value());
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

  /** Tabs by value: `wt-tab` calls this when it is clicked or reached with the keyboard. */
  selectValue(value: WtTabValue | undefined, event: Event): void {
    if (value === undefined || value === this.activeValue()) return;
    this.value.set(value);
    this.onChange.emit({ index: this.tabItems().findIndex((t) => t.value() === value), value, originalEvent: event });
  }

  idOf(kind: 'tab' | 'panel', value: WtTabValue | undefined): string {
    return `${this.baseId}-${kind}-${ɵtabKey(value)}`;
  }
}

/** The row of `wt-tab`s when tabs are written by value. Scrolls sideways with edge arrows, like the index form. */
@Component({
  selector: 'wt-tablist',
  standalone: true,
  template: `
    <div class="wt-tabs-nav p-tablist">
      @if (canPrev()) {
        <button type="button" class="wt-tabs-nav-btn wt-tabs-prev p-tablist-prev-button" tabindex="-1" aria-hidden="true" (click)="page(-1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      }
      <div #list class="wt-tablist p-tablist-tab-list" role="tablist" [attr.aria-label]="tabs?.ariaLabel() || null" (scroll)="updateArrows()">
        <ng-content></ng-content>
      </div>
      @if (canNext()) {
        <button type="button" class="wt-tabs-nav-btn wt-tabs-next p-tablist-next-button" tabindex="-1" aria-hidden="true" (click)="page(1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTabList {
  readonly tabs = inject(WtTabs, { optional: true });
  readonly canPrev = signal(false);
  readonly canNext = signal(false);
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const list = this.list()?.nativeElement;
      if (!list || typeof ResizeObserver !== 'function') return;
      const resize = new ResizeObserver(() => this.updateArrows());
      resize.observe(list);
      this.destroyRef.onDestroy(() => resize.disconnect());
    });
    effect(() => {
      this.tabs?.activeValue();
      if (typeof requestAnimationFrame !== 'function') return;
      requestAnimationFrame(() => {
        const list = this.list()?.nativeElement;
        if (!list) return;
        ɵrevealTab(list, list.querySelector<HTMLElement>('.wt-tab-active') ?? undefined);
        this.updateArrows();
      });
    });
  }

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
}

/** One tab when tabs are written by value: `<wt-tab value="info">ข้อมูล</wt-tab>`. */
@Component({
  selector: 'wt-tab',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-tab p-tab',
    role: 'tab',
    '[class.wt-tab-active]': 'active()',
    '[class.p-tab-active]': 'active()',
    '[id]': 'tabId()',
    '[attr.aria-selected]': 'active()',
    '[attr.aria-controls]': 'panelId()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.data-p-disabled]': 'disabled()',
    '[attr.tabindex]': 'active() && !disabled() ? 0 : -1',
    '(click)': 'select($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class WtTab {
  readonly value = input<WtTabValue>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly tabs = inject(WtTabs, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly active = computed(() => !!this.tabs && this.tabs.activeValue() === this.value());
  readonly tabId = computed(() => (this.tabs ? this.tabs.idOf('tab', this.value()) : null));
  readonly panelId = computed(() => (this.tabs ? this.tabs.idOf('panel', this.value()) : null));

  select(event: Event): void {
    if (this.disabled()) return;
    this.tabs?.selectValue(this.value(), event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.tabs) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(event);
      return;
    }
    const items = this.tabs.tabItems();
    const next = ɵnextTab(event.key, items.indexOf(this), items.map((t) => t.disabled()));
    if (next === null) return;
    event.preventDefault();
    items[next].select(event);
    items[next].el.nativeElement.focus();
  }
}

/** The panels when tabs are written by value: `<wt-tabpanels><wt-tabpanel value="info">…</wt-tabpanel></wt-tabpanels>`. */
@Component({
  selector: 'wt-tabpanels',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-tabpanels p-tabpanels' },
})
export class WtTabPanels {}

/**
 * Content of one tab: `<wt-tab-panel header="ข้อมูล" leftIcon="pi pi-user" [disabled]="…">` by index, or
 * `<wt-tabpanel value="info">` inside `wt-tabpanels` by value.
 */
@Component({
  selector: 'wt-tab-panel, wt-tabpanel, wt-tabPanel',
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
  /** Tabs by value: the `value` of the `wt-tab` that shows this panel. */
  readonly value = input<WtTabValue>();

  private readonly tabs = inject(WtTabs, { optional: true });
  readonly index = computed(() => (this.tabs ? this.tabs.panels().indexOf(this) : 0));
  readonly active = computed(() => {
    if (!this.tabs) return true;
    return this.tabs.valueMode() ? this.tabs.activeValue() === this.value() : this.tabs.activeIndex() === this.index();
  });
  readonly panelId = computed(() => {
    if (!this.tabs) return null;
    return this.tabs.valueMode() ? this.tabs.idOf('panel', this.value()) : `${this.tabs.baseId}-panel-${this.index()}`;
  });
  readonly tabId = computed(() => {
    if (!this.tabs) return null;
    return this.tabs.valueMode() ? this.tabs.idOf('tab', this.value()) : `${this.tabs.baseId}-tab-${this.index()}`;
  });
}
