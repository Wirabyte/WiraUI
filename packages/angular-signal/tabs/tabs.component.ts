import { NgTemplateOutlet } from '@angular/common';
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
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuMenuItem, WuTemplate } from '@wirabyte/ui/config';
import { WuTabMenu } from './tabmenu.component';
import { ɵnextTab, ɵpageTabs, ɵrevealTab, ɵtabEdges, ɵtabKey, WuTabsChangeEvent, WuTabValue } from './tabs.types';

/**
 * Tabs, written either way apps already write them:
 * - by index: `<wu-tabs [(activeIndex)]="i"><wu-tab-panel header="ข้อมูล">…</wu-tab-panel></wu-tabs>`
 *   (`wu-tabview` / `wu-tabpanel` are the same components);
 * - by value: `<wu-tabs [(value)]="tab"><wu-tablist><wu-tab value="info">ข้อมูล</wu-tab></wu-tablist>
 *   <wu-tabpanels><wu-tabpanel value="info">…</wu-tabpanel></wu-tabpanels></wu-tabs>`.
 * - from a menu model, as links to views or routes: `<wu-tabs [model]="pages" [(activeItem)]="page">` (items take
 *   `routerLink`, `url`, `command`, `icon`, `badge`, `disabled`; the same as wu-tabmenu).
 * Arrow keys, Home and End move between tabs. A row that runs out of room scrolls sideways, with arrow
 * buttons at the edges that have more tabs behind them.
 */
@Component({
  selector: 'wu-tabs, wu-tabview, wu-tabView',
  standalone: true,
  imports: [NgTemplateOutlet, WuTabMenu],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTabs {
  /** Two-way: `[(activeIndex)]` (tabs by index). */
  readonly activeIndex = model(0);
  /**
   * Two-way: `[(value)]` (tabs by value, with `wu-tablist` / `wu-tab`). Unset: the first tab. Typed `any` so the field
   * it binds to can be a string, a number or a union of the app's own tab names.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly value = model<any>(undefined);
  /** Tabs as links from a menu model (no panels): `[model]="pages"` + `[(activeItem)]`, like wu-tabmenu. */
  readonly model = input<WuMenuItem[] | null | undefined>();
  /** With `[model]`: the current item. Two-way: `[(activeItem)]`. Unset with router links: the active route. */
  readonly activeItem = model<WuMenuItem | null | undefined>(undefined);
  readonly ariaLabel = input<string>();
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  /** Accepted for templates written for scrollable tab views: the arrows appear on their own whenever tabs overflow. */
  readonly scrollable = input<unknown>();
  /** Accepted for templates moving over: panels are always rendered, hidden ones with `hidden`. */
  readonly lazy = input<unknown>();
  readonly selectOnFocus = input<unknown>();
  readonly showNavigators = input<unknown>();

  readonly onChange = output<WuTabsChangeEvent>();

  readonly panels = contentChildren(forwardRef(() => WuTabPanel));
  readonly tabList = contentChild(forwardRef(() => WuTabList));
  readonly tabItems = contentChildren(forwardRef(() => WuTab), { descendants: true });
  /** Written with `wu-tablist` / `wu-tab` / `wu-tabpanels` instead of panel headers. */
  readonly valueMode = computed(() => !!this.tabList());
  readonly activeValue = computed(() => this.value() ?? this.tabItems()[0]?.value());
  readonly baseId = ɵuniqueId('wu-tabs');
  readonly canPrev = signal(false);
  readonly canNext = signal(false);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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
        ɵrevealTab(list, list.querySelectorAll<HTMLElement>('.wu-tab')[index]);
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
    return index === this.activeIndex() ? 'wu-tab wu-tab-active p-tab p-tab-active' : 'wu-tab p-tab';
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
    const tabs = this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wu-tab');
    tabs[next]?.focus();
  }

  /** Tabs by value: `wu-tab` calls this when it is clicked or reached with the keyboard. */
  selectValue(value: WuTabValue | undefined, event: Event): void {
    if (value === undefined || value === this.activeValue()) return;
    this.value.set(value);
    this.onChange.emit({ index: this.tabItems().findIndex((t) => t.value() === value), value, originalEvent: event });
  }

  idOf(kind: 'tab' | 'panel', value: WuTabValue | undefined): string {
    return `${this.baseId}-${kind}-${ɵtabKey(value)}`;
  }
}

/** The row of `wu-tab`s when tabs are written by value. Scrolls sideways with edge arrows, like the index form. */
@Component({
  selector: 'wu-tablist',
  standalone: true,
  template: `
    <div class="wu-tabs-nav p-tablist">
      @if (canPrev()) {
        <button type="button" class="wu-tabs-nav-btn wu-tabs-prev p-tablist-prev-button" tabindex="-1" aria-hidden="true" (click)="page(-1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      }
      <div #list class="wu-tablist p-tablist-tab-list" role="tablist" [attr.aria-label]="tabs?.ariaLabel() || null" (scroll)="updateArrows()">
        <ng-content></ng-content>
      </div>
      @if (canNext()) {
        <button type="button" class="wu-tabs-nav-btn wu-tabs-next p-tablist-next-button" tabindex="-1" aria-hidden="true" (click)="page(1)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTabList {
  readonly tabs = inject(WuTabs, { optional: true });
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
        ɵrevealTab(list, list.querySelector<HTMLElement>('.wu-tab-active') ?? undefined);
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

/** One tab when tabs are written by value: `<wu-tab value="info">ข้อมูล</wu-tab>`. */
@Component({
  selector: 'wu-tab',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-tab p-tab',
    role: 'tab',
    '[class.wu-tab-active]': 'active()',
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
export class WuTab {
  readonly value = input<WuTabValue>();
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly tabs = inject(WuTabs, { optional: true });
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

/** The panels when tabs are written by value: `<wu-tabpanels><wu-tabpanel value="info">…</wu-tabpanel></wu-tabpanels>`. */
@Component({
  selector: 'wu-tabpanels',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-tabpanels p-tabpanels' },
})
export class WuTabPanels {}

/**
 * Content of one tab: `<wu-tab-panel header="ข้อมูล" leftIcon="pi pi-user" [disabled]="…">` by index, or
 * `<wu-tabpanel value="info">` inside `wu-tabpanels` by value.
 */
@Component({
  selector: 'wu-tab-panel, wu-tabpanel, wu-tabPanel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-tabpanel p-tabpanel',
    role: 'tabpanel',
    '[id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[hidden]': '!active()',
  },
})
export class WuTabPanel {
  private readonly slotTemplates = contentChildren(WuTemplate);
  private readonly headerRef = contentChild('header', { read: TemplateRef });
  readonly headerTemplate = computed(() => this.headerRef() || ɵfindTemplate(this.slotTemplates(), 'header'));
  readonly header = input<string>();
  /** Icon class before the header, e.g. `pi pi-user`. */
  readonly leftIcon = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Tabs by value: the `value` of the `wu-tab` that shows this panel. */
  readonly value = input<WuTabValue>();

  private readonly tabs = inject(WuTabs, { optional: true });
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
