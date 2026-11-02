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
import { ɵassertSupportedAngular, ɵfindTemplate, ɵuniqueId, ɵWU_SKIP_VERSION_CHECK, WuMenuItem, WuTemplate } from 'wiraui/config';
import { menuFirst, menuFocusable, menuLast, menuStep, menuVisible } from 'wiraui/core';
import { ɵpageTabs, ɵrevealTab, ɵtabEdges } from './tabs.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * What wu-tabmenu does, shared by the v1 and v2/v3 templates. A row of tabs built from a menu model, for switching
 * views or routes: `[activeItem]` marks the current one (routed items without it follow the router). It looks like
 * wu-tabs and scrolls sideways the same way.
 */
@Directive()
export abstract class ɵWuTabMenuBase implements AfterViewInit, OnDestroy {
  @Input() set model(v: WuMenuItem[] | null | undefined) {
    this._model = v || [];
  }
  get model(): WuMenuItem[] {
    return this._model;
  }
  /** The current item. Two-way: `[(activeItem)]` or `(activeItemChange)`. */
  @Input() set activeItem(v: WuMenuItem | null | undefined) {
    this._active = v ?? null;
    this.revealSoon();
  }
  get activeItem(): WuMenuItem | null {
    return this._active;
  }
  /** Accepted for templates moving over: the arrows appear on their own whenever the tabs overflow. */
  @Input() scrollable: unknown;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;

  @Output() readonly activeItemChange = new EventEmitter<WuMenuItem>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ViewChild('list') protected listRef?: ElementRef<HTMLElement>;

  readonly baseId = ɵuniqueId('wu-tabmenu');
  readonly trackIndex = (i: number): number => i;
  canPrev = false;
  canNext = false;
  /** Classes routerLinkActive adds to routed tabs when no activeItem is given. */
  readonly routerActiveClasses = ['wu-tab-active'];

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  private _model: WuMenuItem[] = [];
  private _active: WuMenuItem | null = null;
  private focusIndex = -1;
  private resize?: ResizeObserver;
  private destroyed = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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

  get items(): WuMenuItem[] {
    return menuVisible(this._model);
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  isActive(item: WuMenuItem): boolean {
    return !!this._active && item === this._active;
  }
  itemId(index: number): string {
    return `${this.baseId}_${index}`;
  }
  hrefOf(item: WuMenuItem): string | null {
    return item.url && !item.disabled ? item.url : null;
  }
  routed(item: WuMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  /** One Tab stop: the current tab (or the first one); the arrows move between tabs. */
  tabindexOf(index: number): number {
    return index === this.tabStop() ? 0 : -1;
  }

  // ---------- events ----------

  itemClick(event: MouseEvent, item: WuMenuItem, index: number): void {
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
    const index = Number((event.target as HTMLElement | null)?.closest?.('[data-wu-index]')?.getAttribute('data-wu-index'));
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
      ɵrevealTab(list, list.querySelector<HTMLElement>('.wu-tab-active') ?? undefined);
      this.updateArrows(true);
    });
  }
}
