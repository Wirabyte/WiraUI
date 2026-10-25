import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWT_SKIP_VERSION_CHECK,
  ɵWtStyleLoader,
  WT_VERSION_INFO,
  WtConfig,
  WtTemplate,
} from 'wiratheme/config';
import { ɵbuttonClass, ɵWT_BUTTON_CSS } from 'wiratheme/button';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { ɵlistItemLabel, ɵWT_PICKLIST_CSS, ɵWtListDrag, WtPickListFilterOptions } from 'wiratheme/picklist';
import { FilterMatchMode, ListState, moveBottom, moveDown, moveItemsTo, moveTop, moveUp, WtLocale } from 'wiratheme/core';
import { WtOrderListFilterEvent, WtOrderListSelectionChangeEvent } from './orderlist.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
type Reorder = 'up' | 'top' | 'down' | 'bottom';
const REORDER = { up: moveUp, top: moveTop, down: moveDown, bottom: moveBottom } as const;

/**
 * What wt-orderlist does, shared by the v1 and v2/v3 templates: one list the user puts in order with the buttons
 * beside it or by dragging (`[dragdrop]="true"`). `value` is reordered in place, as apps expect, and emitted as
 * `valueChange`; `(onReorder)` gives the items that moved.
 */
@Directive()
export abstract class ɵWtOrderListBase implements AfterContentInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set value(v: any[] | null | undefined) {
    this._value = Array.isArray(v) ? v : [];
    this.list.touch();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any[] {
    return this._value;
  }
  /** Two-way: `[(selection)]`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set selection(v: any[] | null | undefined) {
    this.list.selection = Array.isArray(v) ? [...v] : [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get selection(): any[] {
    return this.list.selection;
  }
  @Input() header?: string;
  /** Fields the search box looks in, comma separated. The box shows when this is set. */
  @Input() filterBy?: string;
  @Input() filterMatchMode: FilterMatchMode = 'contains';
  @Input() filterPlaceholder?: string;
  @Input() ariaFilterLabel?: string;
  @Input() optionLabel?: string;
  @Input() dataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() trackBy?: TrackByFunction<any>;
  @Input() set dragdrop(v: unknown) { this._dragdrop = ɵtoBool(v); }
  get dragdrop(): boolean { return this._dragdrop; }
  /** See wt-picklist: true in v1, false in v2 / v3 unless set. */
  @Input() set metaKeySelection(v: unknown) {
    this._metaKey = v === undefined || v === null ? WT_VERSION_INFO.major === 1 : ɵtoBool(v);
  }
  get metaKeySelection(): boolean { return this._metaKey; }
  /** Side of the order buttons: `'left'` (default) or `'right'`. */
  @Input() controlsPosition: 'left' | 'right' = 'left';
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set stripedRows(v: unknown) { this._striped = ɵtoBool(v); }
  get stripedRows(): boolean { return this._striped; }
  /** Width at and below which the buttons go above the list. Default `960px`. */
  @Input() set breakpoint(v: string | null | undefined) {
    this._breakpoint = v || '960px';
    this.watchWidth();
  }
  get breakpoint(): string { return this._breakpoint; }
  @Input() scrollHeight?: string;
  @Input() listStyle?: Record<string, string | number> | null;
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() id?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex: number | string = 0;
  @Input() upButtonAriaLabel?: string;
  @Input() topButtonAriaLabel?: string;
  @Input() downButtonAriaLabel?: string;
  @Input() bottomButtonAriaLabel?: string;
  /** Accepted for templates moving over: the buttons always move above the list on narrow screens. */
  @Input() responsive: unknown;
  @Input() filterLocale: unknown;
  @Input() autoOptionFocus: unknown;

  @Output() readonly onReorder = new EventEmitter<unknown[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly selectionChange = new EventEmitter<any[]>();
  @Output() readonly onSelectionChange = new EventEmitter<WtOrderListSelectionChangeEvent>();
  @Output() readonly onFilterEvent = new EventEmitter<WtOrderListFilterEvent>();
  @Output() readonly onFocus = new EventEmitter<Event>();
  @Output() readonly onBlur = new EventEmitter<Event>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly valueChange = new EventEmitter<any[]>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('filter', { descendants: false }) protected filterRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('emptyfilter', { descendants: false }) protected emptyFilterRef?: unknown;

  readonly baseId = ɵuniqueId('wt-orderlist');
  readonly major: number = WT_VERSION_INFO.major;
  stacked = false;
  focused = false;
  readonly list = new ListState(() => this._value, () => ({ filterBy: this.filterBy, matchMode: this.filterMatchMode, dataKey: this.dataKey }));
  readonly drag: ɵWtListDrag;
  readonly filterOptions: WtPickListFilterOptions = { filter: (v) => this.setFilter(v), reset: () => this.setFilter('') };
  readonly trackAny: TrackByFunction<unknown> = (i, item) => (this.trackBy ? this.trackBy(i, item) : item);

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WtConfig);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly i18n = ɵrefreshOnTranslation();
  private _value: unknown[] = [];
  private _dragdrop = false;
  private _metaKey = WT_VERSION_INFO.major === 1;
  private _disabled = false;
  private _striped = false;
  private _breakpoint = '960px';
  private pointerType = 'mouse';
  private widthQuery: MediaQueryList | null = null;
  private initialized = false;
  private readonly onWidth = () => {
    this.stacked = !!this.widthQuery?.matches;
    this.cdr.markForCheck();
  };

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWtStyleLoader);
    styles.load('button', ɵWT_BUTTON_CSS);
    styles.load('inputtext', ɵWT_INPUTTEXT_CSS);
    styles.load('picklist', ɵWT_PICKLIST_CSS);
    const el = this.host;
    this.drag = new ɵWtListDrag(
      {
        get root() {
          return el.querySelector('.wt-orderlist') as HTMLElement | null;
        },
        canDrag: () => this._dragdrop && !this._disabled && !this.list.query.trim(),
        itemsFor: (_list, index) => this.dragItems(index),
        accepts: (from, to) => from === to,
        drop: (_from, items, _to, index) => this.dropItems(items, index),
      },
      inject(NgZone, { optional: true })
    );
  }

  ngAfterContentInit(): void {
    this.initialized = true;
    this.watchWidth();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.drag.destroy();
    this.widthQuery?.removeEventListener?.('change', this.onWidth);
  }

  // ---------- what the templates read ----------

  get t(): WtLocale {
    return this.config.translation;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get filterTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.filterRef) || ɵfindTemplate(this.templates, 'filter');
  }
  get emptyTemplate(): TemplateRef<unknown> | null {
    return this.list.query.trim()
      ? asTemplate(this.emptyFilterRef) || ɵfindTemplate(this.templates, 'emptyfilter')
      : asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty');
  }
  get hasHeader(): boolean {
    return !!this.header || !!this.headerTemplate;
  }
  get showFilter(): boolean {
    return !!this.filterBy || !!this.filterTemplate;
  }
  get isEmpty(): boolean {
    return !this.list.query.trim() ? !this._value.length : !this.list.visible().length;
  }
  get emptyText(): string {
    return this.list.query.trim() ? this.t.emptyFilterMessage : '';
  }
  get listId(): string {
    return `${this.id || this.baseId}_list`;
  }
  get headerId(): string {
    return `${this.listId}_header`;
  }
  get activeId(): string | null {
    const f = this.list.focus;
    return this.focused && f >= 0 && f < this._value.length ? this.itemId(f) : null;
  }
  get listStyles(): Record<string, string | number> | null {
    if (!this.scrollHeight) return this.listStyle || null;
    return { height: this.scrollHeight, ...(this.listStyle || {}) };
  }
  get canReorder(): boolean {
    return !this._disabled && !this.list.query.trim() && this.list.selection.length > 0;
  }
  itemId(index: number): string {
    return `${this.listId}_${index}`;
  }
  isVisible(item: unknown): boolean {
    return this.list.isVisible(item);
  }
  isSelected(item: unknown): boolean {
    return this.list.isSelected(item);
  }
  isFocused(index: number): boolean {
    return this.focused && this.list.focus === index;
  }
  label(item: unknown): string {
    return ɵlistItemLabel(item, this.optionLabel);
  }
  itemContext(item: unknown, index: number): Record<string, unknown> {
    return { $implicit: item, index, selected: this.isSelected(item) };
  }
  buttonClass(extra: string): string {
    return ɵbuttonClass(this.major === 1 ? '' : 'p-button-secondary') + ' wt-btn-icon-only ' + extra;
  }

  // ---------- actions ----------

  reorder(how: Reorder): void {
    if (!this.canReorder) return;
    if (!REORDER[how](this._value, this.list.selection, this.list.same)) return;
    this.list.touch();
    this.onReorder.emit(this.list.selectedVisible());
    this.valueChange.emit(this._value);
    this.cdr.detectChanges();
    const first = this._value.findIndex((it) => this.list.isSelected(it));
    if (first >= 0) this.doc.getElementById(this.itemId(first))?.scrollIntoView?.({ block: 'nearest' });
  }

  /** Clears the search box. */
  resetFilter(): void {
    this.setFilter('');
  }

  pointerDown(event: PointerEvent, index: number): void {
    this.pointerType = event.pointerType || 'mouse';
    this.drag.down(event, 'list', index);
  }

  itemClick(event: MouseEvent, item: unknown, index: number): void {
    if (this._disabled || this.drag.swallowClick) return;
    const touch = this.pointerType === 'touch';
    this.list.pick(item, { metaKeySelection: this._metaKey && !touch, meta: event.metaKey || event.ctrlKey, shift: event.shiftKey });
    this.list.focus = index;
    this.emitSelection(event);
  }

  listFocus(event: FocusEvent): void {
    this.focused = true;
    this.list.enter();
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  listBlur(event: FocusEvent): void {
    this.focused = false;
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  /** The same keys as each list of wt-picklist; Alt + ↑ / ↓ moves the selected items. */
  listKeydown(event: KeyboardEvent): void {
    const st = this.list;
    const list = this._value;
    const key = event.key;
    if ((key === 'ArrowDown' || key === 'ArrowUp') && event.altKey) {
      event.preventDefault();
      this.reorder(key === 'ArrowDown' ? 'down' : 'up');
      const first = list.findIndex((it) => st.isSelected(it));
      if (first >= 0) st.focus = first;
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      const before = st.focus;
      st.step(key === 'ArrowDown' ? 1 : -1);
      if (event.shiftKey && !this._disabled && st.focus >= 0 && st.focus !== before && !st.isSelected(list[st.focus])) {
        st.selection = [...st.selection, list[st.focus]];
        this.emitSelection(event);
      }
    } else if (key === 'Home' || key === 'End') {
      event.preventDefault();
      st.focus = st.edge(key === 'Home' ? 1 : -1);
    } else if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      if (this._disabled || st.focus < 0 || st.focus >= list.length) return;
      st.pick(list[st.focus], { metaKeySelection: false });
      this.emitSelection(event);
    } else if ((key === 'a' || key === 'A') && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (this._disabled) return;
      st.toggleAll();
      this.emitSelection(event);
    } else {
      return;
    }
    this.cdr.detectChanges();
    if (st.focus >= 0) this.doc.getElementById(this.itemId(st.focus))?.scrollIntoView?.({ block: 'nearest' });
  }

  filterInput(event: Event): void {
    this.setFilter((event.target as HTMLInputElement).value, event);
  }

  // ---------- internals ----------

  private setFilter(value: unknown, event?: Event): void {
    this.list.query = value === null || value === undefined ? '' : String(value);
    this.list.focus = -1;
    this.onFilterEvent.emit({ originalEvent: event, value: this.list.visible() });
    this.cdr.markForCheck();
  }

  private emitSelection(event: Event): void {
    const value = [...this.list.selection];
    this.selectionChange.emit(value);
    this.onSelectionChange.emit({ originalEvent: event, value });
    this.cdr.markForCheck();
  }

  private dragItems(index: number): unknown[] {
    const item = this._value[index];
    if (item === undefined) return [];
    return this.list.isSelected(item) ? this.list.selectedVisible() : [item];
  }

  private dropItems(items: unknown[], index: number): void {
    if (this._disabled || !moveItemsTo(this._value, items, index, this.list.same)) return;
    this.list.touch();
    this.onReorder.emit(items);
    this.valueChange.emit(this._value);
    this.cdr.markForCheck();
  }

  private watchWidth(): void {
    if (!this.initialized) return;
    this.widthQuery?.removeEventListener?.('change', this.onWidth);
    const win = this.doc.defaultView;
    this.widthQuery = win?.matchMedia ? win.matchMedia(`(max-width: ${this._breakpoint})`) : null;
    this.widthQuery?.addEventListener?.('change', this.onWidth);
    this.onWidth();
  }
}
