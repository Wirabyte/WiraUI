import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵtoBool, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuMenuItem, WuTemplate } from '@wirabyte/ui/config';
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
  imports: [NgFor, NgIf, NgTemplateOutlet, WuTabMenu],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTabs implements AfterContentInit, AfterViewInit, OnDestroy {
  /** Two-way: `[(activeIndex)]` (tabs by index). */
  @Input() set activeIndex(v: number) {
    this._activeIndex = Number(v) || 0;
    this.cdr.markForCheck();
    this.revealSoon();
  }
  get activeIndex(): number { return this._activeIndex; }
  /** Two-way: `[(value)]` (tabs by value, with `wu-tablist` / `wu-tab`). Unset: the first tab. */
  @Input() set value(v: WuTabValue | undefined) {
    this._value = v;
    this.cdr.markForCheck();
  }
  get value(): WuTabValue | undefined { return this._value; }
  /** Tabs as links from a menu model (no panels): `[model]="pages"` + `[(activeItem)]`, like wu-tabmenu. */
  @Input() model?: WuMenuItem[] | null;
  /** With `[model]`: the current item. Two-way: `[(activeItem)]`. Unset with router links: the active route. */
  @Input() activeItem?: WuMenuItem | null;
  @Input() ariaLabel?: string;
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  /** Accepted for templates written for scrollable tab views: the arrows appear on their own whenever tabs overflow. */
  @Input() scrollable?: unknown;
  /** Accepted for templates moving over: panels are always rendered, hidden ones with `hidden`. */
  @Input() lazy?: unknown;
  @Input() selectOnFocus?: unknown;
  @Input() showNavigators?: unknown;

  @Output() readonly activeIndexChange = new EventEmitter<number>();
  // Typed `any` so the field `[(value)]` binds to can be a string, a number or a union of the app's own tab names.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any>();
  @Output() readonly onChange = new EventEmitter<WuTabsChangeEvent>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly activeItemChange = new EventEmitter<any>();

  @ContentChildren(forwardRef(() => WuTabPanel)) panelList?: QueryList<WuTabPanel>;
  @ContentChild(forwardRef(() => WuTabList)) tabList?: WuTabList;
  @ContentChildren(forwardRef(() => WuTab), { descendants: true }) tabItemList?: QueryList<WuTab>;

  @ViewChild('list') private listRef?: ElementRef<HTMLElement>;

  panels: WuTabPanel[] = [];
  tabItems: WuTab[] = [];
  readonly baseId = ɵuniqueId('wu-tabs');
  canPrev = false;
  canNext = false;
  private _activeIndex = 0;
  private _value: WuTabValue | undefined;
  private subs: Subscription[] = [];
  private resize?: ResizeObserver;
  private destroyed = false;
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  /** Written with `wu-tablist` / `wu-tab` / `wu-tabpanels` instead of panel headers. */
  get valueMode(): boolean {
    return !!this.tabList;
  }
  get activeValue(): WuTabValue | undefined {
    return this._value ?? this.tabItems[0]?.value;
  }

  ngAfterContentInit(): void {
    const update = () => {
      this.panels = this.panelList ? this.panelList.toArray() : [];
      this.tabItems = this.tabItemList ? this.tabItemList.toArray() : [];
      this.cdr.markForCheck();
    };
    update();
    if (this.panelList) this.subs.push(this.panelList.changes.subscribe(update));
    if (this.tabItemList) this.subs.push(this.tabItemList.changes.subscribe(update));
  }

  ngAfterViewInit(): void {
    const list = this.listRef?.nativeElement;
    if (!list || typeof ResizeObserver !== 'function') return;
    this.resize = new ResizeObserver(() => this.updateArrows(true));
    this.resize.observe(list);
    this.revealSoon();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.subs.forEach((s) => s.unsubscribe());
    this.resize?.disconnect();
  }

  /** Shows the arrow of each edge that has tabs behind it. */
  updateArrows(render = false): void {
    const list = this.listRef?.nativeElement;
    if (!list || this.destroyed) return;
    const e = ɵtabEdges(list);
    if (e.prev === this.canPrev && e.next === this.canNext) return;
    this.canPrev = e.prev;
    this.canNext = e.next;
    if (render) this.cdr.detectChanges();
    else this.cdr.markForCheck();
  }

  page(direction: -1 | 1): void {
    const list = this.listRef?.nativeElement;
    if (list) ɵpageTabs(list, direction);
  }

  private revealSoon(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(() => {
      const list = this.listRef?.nativeElement;
      if (!list || this.destroyed) return;
      ɵrevealTab(list, list.querySelectorAll<HTMLElement>('.wu-tab')[this._activeIndex]);
      this.updateArrows(true);
    });
  }

  /** Our classes plus the classic-era names (`p-tabview-nav-link`, `p-highlight`). */
  tabClasses(index: number): string {
    return index === this._activeIndex ? 'wu-tab wu-tab-active p-tabview-nav-link p-highlight' : 'wu-tab p-tabview-nav-link';
  }

  /** With `[model]`: wu-tabmenu reports the item that was picked. */
  pickItem(item: WuMenuItem): void {
    this.activeItem = item;
    this.activeItemChange.emit(item);
  }

  select(index: number, event: Event): void {
    const panel = this.panels[index];
    if (!panel || panel.disabled || index === this._activeIndex) return;
    this._activeIndex = index;
    this.revealSoon();
    this.activeIndexChange.emit(index);
    this.onChange.emit({ index, originalEvent: event });
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const next = ɵnextTab(event.key, index, this.panels.map((p) => p.disabled));
    if (next === null) return;
    event.preventDefault();
    this.select(next, event);
    const tabs = this.el.nativeElement.querySelectorAll<HTMLButtonElement>('.wu-tab');
    tabs[next]?.focus();
  }

  /** Tabs by value: `wu-tab` calls this when it is clicked or reached with the keyboard. */
  selectValue(value: WuTabValue | undefined, event: Event): void {
    if (value === undefined || value === this.activeValue) return;
    this._value = value;
    this.cdr.markForCheck();
    this.tabList?.refresh();
    this.valueChange.emit(value);
    this.onChange.emit({ index: this.tabItems.findIndex((t) => t.value === value), value, originalEvent: event });
  }

  idOf(kind: 'tab' | 'panel', value: WuTabValue | undefined): string {
    return `${this.baseId}-${kind}-${ɵtabKey(value)}`;
  }
}

/** The row of `wu-tab`s when tabs are written by value. Scrolls sideways with edge arrows, like the index form. */
@Component({
  selector: 'wu-tablist',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="wu-tabs-nav p-tablist">
      <button *ngIf="canPrev" type="button" class="wu-tabs-nav-btn wu-tabs-prev p-tablist-prev-button" tabindex="-1" aria-hidden="true" (click)="page(-1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div #list class="wu-tablist p-tablist-tab-list" role="tablist" [attr.aria-label]="tabs?.ariaLabel || null" (scroll)="updateArrows()">
        <ng-content></ng-content>
      </div>
      <button *ngIf="canNext" type="button" class="wu-tabs-nav-btn wu-tabs-next p-tablist-next-button" tabindex="-1" aria-hidden="true" (click)="page(1)">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTabList implements AfterViewInit, OnDestroy {
  readonly tabs = inject(WuTabs, { optional: true });
  canPrev = false;
  canNext = false;
  @ViewChild('list') private listRef?: ElementRef<HTMLElement>;
  private resize?: ResizeObserver;
  private destroyed = false;
  private readonly cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    const list = this.listRef?.nativeElement;
    if (list && typeof ResizeObserver === 'function') {
      this.resize = new ResizeObserver(() => this.updateArrows(true));
      this.resize.observe(list);
    }
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.resize?.disconnect();
  }

  /** Keeps the selected tab in view. */
  refresh(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(() => {
      const list = this.listRef?.nativeElement;
      if (!list || this.destroyed) return;
      ɵrevealTab(list, list.querySelector<HTMLElement>('.wu-tab-active') ?? undefined);
      this.updateArrows(true);
    });
  }

  updateArrows(render = false): void {
    const list = this.listRef?.nativeElement;
    if (!list || this.destroyed) return;
    const e = ɵtabEdges(list);
    if (e.prev === this.canPrev && e.next === this.canNext) return;
    this.canPrev = e.prev;
    this.canNext = e.next;
    if (render) this.cdr.detectChanges();
    else this.cdr.markForCheck();
  }

  page(direction: -1 | 1): void {
    const list = this.listRef?.nativeElement;
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
  host: { class: 'wu-tab p-tab', role: 'tab' },
})
export class WuTab {
  @Input() value?: WuTabValue;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }

  private _disabled = false;
  private readonly tabs = inject(WuTabs, { optional: true });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @HostBinding('class.wu-tab-active') @HostBinding('class.p-tab-active') @HostBinding('attr.aria-selected')
  get active(): boolean {
    return !!this.tabs && this.tabs.activeValue === this.value;
  }
  @HostBinding('attr.id') get tabId(): string | null {
    return this.tabs ? this.tabs.idOf('tab', this.value) : null;
  }
  @HostBinding('attr.aria-controls') get panelId(): string | null {
    return this.tabs ? this.tabs.idOf('panel', this.value) : null;
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled(): true | null {
    return this._disabled || null;
  }
  @HostBinding('attr.tabindex') get tabIndex(): number {
    return this.active && !this._disabled ? 0 : -1;
  }

  @HostListener('click', ['$event'])
  select(event: Event): void {
    if (this._disabled) return;
    this.tabs?.selectValue(this.value, event);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.tabs) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(event);
      return;
    }
    const items = this.tabs.tabItems;
    const next = ɵnextTab(event.key, items.indexOf(this), items.map((t) => t.disabled));
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
  host: { class: 'wu-tabpanel p-tabview-panel', role: 'tabpanel' },
})
export class WuTabPanel {
  @ContentChildren(WuTemplate) protected slotTemplates?: QueryList<WuTemplate>;
  @ContentChild('header', { read: TemplateRef }) protected headerRef?: TemplateRef<unknown>;
  get headerTemplate(): TemplateRef<unknown> | null {
    return this.headerRef || ɵfindTemplate(this.slotTemplates, 'header');
  }
  @Input() header?: string;
  /** Icon class before the header, e.g. `pi pi-user`. */
  @Input() leftIcon?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Tabs by value: the `value` of the `wu-tab` that shows this panel. */
  @Input() value?: WuTabValue;

  private _disabled = false;
  private readonly tabs = inject(WuTabs, { optional: true });

  private get index(): number {
    return this.tabs ? this.tabs.panels.indexOf(this) : 0;
  }
  @HostBinding('hidden') get hidden(): boolean {
    if (!this.tabs) return false;
    return this.tabs.valueMode ? this.tabs.activeValue !== this.value : this.tabs.activeIndex !== this.index;
  }
  @HostBinding('attr.id') get panelId(): string | null {
    if (!this.tabs) return null;
    return this.tabs.valueMode ? this.tabs.idOf('panel', this.value) : `${this.tabs.baseId}-panel-${this.index}`;
  }
  @HostBinding('attr.aria-labelledby') get tabId(): string | null {
    if (!this.tabs) return null;
    return this.tabs.valueMode ? this.tabs.idOf('tab', this.value) : `${this.tabs.baseId}-tab-${this.index}`;
  }
}
