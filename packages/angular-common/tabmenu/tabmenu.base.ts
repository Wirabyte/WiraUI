import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader, WtMenuItem, WtTemplate } from 'wiratheme/config';
import { menuFirst, menuFocusable, menuLast, menuStep, menuVisible } from 'wiratheme/core';
import { ɵpageTabs, ɵrevealTab, ɵtabEdges, ɵWT_TABS_CSS } from 'wiratheme/tabs';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * What wt-tabmenu does, shared by the v1 and v2/v3 templates. A row of tabs built from a menu model, for switching
 * views or routes: `[activeItem]` marks the current one (routed items without it follow the router). It looks like
 * wt-tabs and scrolls sideways the same way.
 */
@Directive()
export abstract class ɵWtTabMenuBase implements AfterViewInit, OnDestroy {
  @Input() set model(v: WtMenuItem[] | null | undefined) {
    this._model = v || [];
  }
  get model(): WtMenuItem[] {
    return this._model;
  }
  /** The current item. Two-way: `[(activeItem)]` or `(activeItemChange)`. */
  @Input() set activeItem(v: WtMenuItem | null | undefined) {
    this._active = v ?? null;
    this.revealSoon();
  }
  get activeItem(): WtMenuItem | null {
    return this._active;
  }
  /** Accepted for templates moving over: the arrows appear on their own whenever the tabs overflow. */
  @Input() scrollable: unknown;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;

  @Output() readonly activeItemChange = new EventEmitter<WtMenuItem>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ViewChild('list') protected listRef?: ElementRef<HTMLElement>;

  readonly baseId = ɵuniqueId('wt-tabmenu');
  readonly trackIndex = (i: number): number => i;
  canPrev = false;
  canNext = false;
  /** Classes routerLinkActive adds to routed tabs when no activeItem is given. */
  readonly routerActiveClasses = ['wt-tab-active'];

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  private _model: WtMenuItem[] = [];
  private _active: WtMenuItem | null = null;
  private focusIndex = -1;
  private resize?: ResizeObserver;
  private destroyed = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    // The tab row is drawn by wt-tabs' stylesheet.
    inject(ɵWtStyleLoader).load('tabs', ɵWT_TABS_CSS);
  }

  ngAfterViewInit(): void {
    const list = this.listRef?.nativeElement;
    if (list && typeof ResizeObserver === 'function') {
      this.resize = new ResizeObserver(() => this.updateArrows(true));
      this.resize.observe(list);
    }
    this.revealSoon();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.resize?.disconnect();
  }

  // ---------- what the templates read ----------

  get items(): WtMenuItem[] {
    return menuVisible(this._model);
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  isActive(item: WtMenuItem): boolean {
    return !!this._active && item === this._active;
  }
  itemId(index: number): string {
    return `${this.baseId}_${index}`;
  }
  hrefOf(item: WtMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  routed(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  /** One Tab stop: the current tab (or the first one); the arrows move between tabs. */
  tabindexOf(index: number): number {
    return index === this.tabStop() ? 0 : -1;
  }

  // ---------- events ----------

  itemClick(event: MouseEvent, item: WtMenuItem, index: number): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.focusIndex = index;
    if (item !== this._active) {
      this._active = item;
      this.activeItemChange.emit(item);
      this.revealSoon();
    }
    item.command?.({ originalEvent: event, item, index });
    this.cdr.markForCheck();
  }

  /** Arrows, Home and End move between tabs; Enter or Space opens one (a link follows it, a command runs). */
  keydown(event: KeyboardEvent): void {
    const index = Number((event.target as HTMLElement | null)?.closest?.('[data-wt-index]')?.getAttribute('data-wt-index'));
    if (!Number.isFinite(index)) return;
    const items = this.items;
    let next = -1;
    if (event.key === 'ArrowRight') next = menuStep(items, index, 1);
    else if (event.key === 'ArrowLeft') next = menuStep(items, index, -1);
    else if (event.key === 'Home') next = menuFirst(items);
    else if (event.key === 'End') next = menuLast(items);
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.doc.getElementById(this.itemId(index))?.click();
      return;
    } else return;
    event.preventDefault();
    if (next < 0) return;
    this.focusIndex = next;
    this.cdr.detectChanges();
    const el = this.doc.getElementById(this.itemId(next));
    el?.focus();
    const list = this.listRef?.nativeElement;
    if (list && el) ɵrevealTab(list, el);
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

  private tabStop(): number {
    const items = this.items;
    if (menuFocusable(items[this.focusIndex])) return this.focusIndex;
    const active = this._active ? items.indexOf(this._active) : -1;
    return menuFocusable(items[active]) ? active : menuFirst(items);
  }

  /** Keeps the current tab in view. */
  private revealSoon(): void {
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(() => {
      const list = this.listRef?.nativeElement;
      if (!list || this.destroyed) return;
      ɵrevealTab(list, list.querySelector<HTMLElement>('.wt-tab-active') ?? undefined);
      this.updateArrows(true);
    });
  }
}
