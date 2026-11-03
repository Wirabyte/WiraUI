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
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WU_VERSION_INFO,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from '@wirabyte/ui/button';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import {
  FilterMatchMode,
  ListState,
  moveBottom,
  moveDown,
  moveItemsTo,
  moveTop,
  moveUp,
  optionField,
  transferItems,
  WuLocale,
} from '@wirabyte/ui/core';
import { ɵWuListDrag } from './list-drag';
import { WuPickListFilterEvent, WuPickListFilterOptions, WuPickListMoveEvent, WuPickListSelectEvent, WuPickListSide } from './picklist.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
type Reorder = 'up' | 'top' | 'down' | 'bottom';
const REORDER = { up: moveUp, top: moveTop, down: moveDown, bottom: moveBottom } as const;

/** The label shown for an item without an `item` template: `optionLabel`, else its `label` or `name`, else the item. */
export function ɵlistItemLabel(item: unknown, optionLabel?: string | null): string {
  if (item === null || item === undefined) return '';
  if (typeof item !== 'object') return String(item);
  if (optionLabel) return String(optionField(item, optionLabel) ?? '');
  const o = item as { label?: unknown; name?: unknown };
  return String(o.label ?? o.name ?? '');
}

/**
 * What wu-picklist does, shared by the v1 and v2/v3 templates: two lists, items move between them with the buttons in
 * the middle, by double click, or by dragging (`[dragdrop]="true"`); each list can be searched (`filterBy`) and put in
 * order with its own buttons. `source` and `target` are changed in place, as apps expect, and also emitted
 * (`sourceChange` / `targetChange`) for `[(source)]` bindings.
 */
@Directive()
export abstract class ɵWuPickListBase implements AfterContentInit, OnDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set source(v: any[] | null | undefined) {
    this._source = Array.isArray(v) ? v : [];
    this.lists.source.touch();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get source(): any[] {
    return this._source;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set target(v: any[] | null | undefined) {
    this._target = Array.isArray(v) ? v : [];
    this.lists.target.touch();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get target(): any[] {
    return this._target;
  }
  @Input() sourceHeader?: string;
  @Input() targetHeader?: string;
  /** Fields the search boxes look in, comma separated (`"name,code"`). The boxes show when this is set. */
  @Input() filterBy?: string;
  @Input() filterMatchMode: FilterMatchMode = 'contains';
  @Input() set showSourceFilter(v: unknown) { this._showSourceFilter = v === undefined || ɵtoBool(v); }
  get showSourceFilter(): boolean { return this._showSourceFilter; }
  @Input() set showTargetFilter(v: unknown) { this._showTargetFilter = v === undefined || ɵtoBool(v); }
  get showTargetFilter(): boolean { return this._showTargetFilter; }
  @Input() sourceFilterPlaceholder?: string;
  @Input() targetFilterPlaceholder?: string;
  @Input() ariaSourceFilterLabel?: string;
  @Input() ariaTargetFilterLabel?: string;
  /** Field shown for items when there is no `item` template. Default: `label`, then `name`. */
  @Input() optionLabel?: string;
  /** Field that identifies an item, for selections that survive the app replacing its objects. */
  @Input() dataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() trackBy?: TrackByFunction<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() sourceTrackBy?: TrackByFunction<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() targetTrackBy?: TrackByFunction<any>;
  /** Drag items between and within the lists. */
  @Input() set dragdrop(v: unknown) { this._dragdrop = ɵtoBool(v); }
  get dragdrop(): boolean { return this._dragdrop; }
  /**
   * A click picks only that item and Ctrl / ⌘ + click adds (true), or each click toggles an item (false).
   * Default: true in v1, false in v2 / v3, as each era did. Touch always toggles.
   */
  @Input() set metaKeySelection(v: unknown) {
    this._metaKey = v === undefined || v === null ? WU_VERSION_INFO.major === 1 : ɵtoBool(v);
  }
  get metaKeySelection(): boolean { return this._metaKey; }
  @Input() set showSourceControls(v: unknown) { this._showSourceControls = v === undefined || ɵtoBool(v); }
  get showSourceControls(): boolean { return this._showSourceControls; }
  @Input() set showTargetControls(v: unknown) { this._showTargetControls = v === undefined || ɵtoBool(v); }
  get showTargetControls(): boolean { return this._showTargetControls; }
  /** Items stay selected after moving to the other list. */
  @Input() set keepSelection(v: unknown) { this._keepSelection = ɵtoBool(v); }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() set stripedRows(v: unknown) { this._striped = ɵtoBool(v); }
  get stripedRows(): boolean { return this._striped; }
  /** Width at and below which the lists stack, with the buttons between them. Default `960px`. */
  @Input() set breakpoint(v: string | null | undefined) {
    this._breakpoint = v || '960px';
    this.watchWidth();
  }
  get breakpoint(): string { return this._breakpoint; }
  /** Height of both lists (`'20rem'`). `sourceStyle` / `targetStyle` can set each list's own. */
  @Input() scrollHeight?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() sourceStyle?: Record<string, string | number> | null;
  @Input() targetStyle?: Record<string, string | number> | null;
  @Input() id?: string;
  @Input() tabindex: number | string = 0;
  @Input() upButtonAriaLabel?: string;
  @Input() topButtonAriaLabel?: string;
  @Input() downButtonAriaLabel?: string;
  @Input() bottomButtonAriaLabel?: string;
  @Input() rightButtonAriaLabel?: string;
  @Input() allRightButtonAriaLabel?: string;
  @Input() leftButtonAriaLabel?: string;
  @Input() allLeftButtonAriaLabel?: string;
  /** Accepted for templates moving over: lists always stack on narrow screens. */
  @Input() responsive: unknown;
  @Input() filterLocale: unknown;
  @Input() autoOptionFocus: unknown;

  @Output() readonly onMoveToTarget = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onMoveAllToTarget = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onMoveToSource = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onMoveAllToSource = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onSourceReorder = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onTargetReorder = new EventEmitter<WuPickListMoveEvent>();
  @Output() readonly onSourceSelect = new EventEmitter<WuPickListSelectEvent>();
  @Output() readonly onTargetSelect = new EventEmitter<WuPickListSelectEvent>();
  @Output() readonly onSourceFilter = new EventEmitter<WuPickListFilterEvent>();
  @Output() readonly onTargetFilter = new EventEmitter<WuPickListFilterEvent>();
  @Output() readonly onFocus = new EventEmitter<Event>();
  @Output() readonly onBlur = new EventEmitter<Event>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly sourceChange = new EventEmitter<any[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly targetChange = new EventEmitter<any[]>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('sourceHeader', { descendants: false }) protected sourceHeaderRef?: unknown;
  @ContentChild('targetHeader', { descendants: false }) protected targetHeaderRef?: unknown;
  @ContentChild('sourceFilter', { descendants: false }) protected sourceFilterRef?: unknown;
  @ContentChild('targetFilter', { descendants: false }) protected targetFilterRef?: unknown;
  @ContentChild('emptymessagesource', { descendants: false }) protected emptySourceRef?: unknown;
  @ContentChild('emptyfiltermessagesource', { descendants: false }) protected emptyFilterSourceRef?: unknown;
  @ContentChild('emptymessagetarget', { descendants: false }) protected emptyTargetRef?: unknown;
  @ContentChild('emptyfiltermessagetarget', { descendants: false }) protected emptyFilterTargetRef?: unknown;

  readonly baseId = ɵuniqueId('wu-picklist');
  readonly major: number = WU_VERSION_INFO.major;
  /** The lists are stacked (narrow screen). */
  stacked = false;
  /** The list the keyboard is in. */
  focusedList: WuPickListSide | null = null;
  readonly lists: Record<WuPickListSide, ListState> = {
    source: new ListState(() => this._source, () => this.listOptions),
    target: new ListState(() => this._target, () => this.listOptions),
  };
  readonly drag: ɵWuListDrag;
  readonly filterOptions: Record<WuPickListSide, WuPickListFilterOptions> = {
    source: { filter: (v) => this.setFilter('source', v), reset: () => this.setFilter('source', '') },
    target: { filter: (v) => this.setFilter('target', v), reset: () => this.setFilter('target', '') },
  };

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly i18n = ɵrefreshOnTranslation();
  private _source: unknown[] = [];
  private _target: unknown[] = [];
  private _showSourceFilter = true;
  private _showTargetFilter = true;
  private _dragdrop = false;
  private _metaKey = WU_VERSION_INFO.major === 1;
  private _showSourceControls = true;
  private _showTargetControls = true;
  private _keepSelection = false;
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
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    styles.load('button', ɵWU_BUTTON_CSS);
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    const el = this.host;
    this.drag = new ɵWuListDrag(
      {
        get root() {
          return el.querySelector('.wu-picklist') as HTMLElement | null;
        },
        canDrag: () => this._dragdrop && !this._disabled,
        itemsFor: (list, index) => this.dragItems(list as WuPickListSide, index),
        accepts: () => true,
        drop: (from, items, to, index, event) => this.dropItems(from as WuPickListSide, items, to as WuPickListSide, index, event),
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

  get t(): WuLocale {
    return this.config.translation;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  headerTemplate(side: WuPickListSide): TemplateRef<unknown> | null {
    return side === 'source'
      ? asTemplate(this.sourceHeaderRef) || ɵfindTemplate(this.templates, 'sourceHeader') || ɵfindTemplate(this.templates, 'sourceheader')
      : asTemplate(this.targetHeaderRef) || ɵfindTemplate(this.templates, 'targetHeader') || ɵfindTemplate(this.templates, 'targetheader');
  }
  filterTemplate(side: WuPickListSide): TemplateRef<unknown> | null {
    return side === 'source'
      ? asTemplate(this.sourceFilterRef) || ɵfindTemplate(this.templates, 'sourceFilter')
      : asTemplate(this.targetFilterRef) || ɵfindTemplate(this.templates, 'targetFilter');
  }
  emptyTemplate(side: WuPickListSide): TemplateRef<unknown> | null {
    const filtered = !!this.lists[side].query.trim();
    if (side === 'source') {
      return filtered
        ? asTemplate(this.emptyFilterSourceRef) || ɵfindTemplate(this.templates, 'emptyfiltermessagesource')
        : asTemplate(this.emptySourceRef) || ɵfindTemplate(this.templates, 'emptymessagesource');
    }
    return filtered
      ? asTemplate(this.emptyFilterTargetRef) || ɵfindTemplate(this.templates, 'emptyfiltermessagetarget')
      : asTemplate(this.emptyTargetRef) || ɵfindTemplate(this.templates, 'emptymessagetarget');
  }
  headerText(side: WuPickListSide): string {
    return (side === 'source' ? this.sourceHeader : this.targetHeader) || '';
  }
  hasHeader(side: WuPickListSide): boolean {
    return !!this.headerText(side) || !!this.headerTemplate(side);
  }
  showFilter(side: WuPickListSide): boolean {
    return (!!this.filterBy || !!this.filterTemplate(side)) && (side === 'source' ? this._showSourceFilter : this._showTargetFilter);
  }
  /** The search box hint: the app's text, else the locale's "search". */
  filterPlaceholder(side: WuPickListSide): string {
    return (side === 'source' ? this.sourceFilterPlaceholder : this.targetFilterPlaceholder) || this.t.search;
  }
  filterAriaLabel(side: WuPickListSide): string {
    return (side === 'source' ? this.ariaSourceFilterLabel : this.ariaTargetFilterLabel) || this.filterPlaceholder(side);
  }
  filterOptionsOf(side: WuPickListSide): WuPickListFilterOptions {
    return this.filterOptions[side];
  }
  queryOf(side: WuPickListSide): string {
    return this.lists[side].query;
  }
  listOf(side: WuPickListSide): unknown[] {
    return side === 'source' ? this._source : this._target;
  }
  listStyle(side: WuPickListSide): Record<string, string | number> | null {
    const own = side === 'source' ? this.sourceStyle : this.targetStyle;
    if (!this.scrollHeight) return own || null;
    return { height: this.scrollHeight, ...(own || {}) };
  }
  listId(side: WuPickListSide): string {
    return `${this.id || this.baseId}_${side}`;
  }
  headerId(side: WuPickListSide): string {
    return `${this.listId(side)}_header`;
  }
  itemId(side: WuPickListSide, index: number): string {
    return `${this.listId(side)}_${index}`;
  }
  activeId(side: WuPickListSide): string | null {
    const f = this.lists[side].focus;
    return this.focusedList === side && f >= 0 && f < this.listOf(side).length ? this.itemId(side, f) : null;
  }
  isVisible(side: WuPickListSide, item: unknown): boolean {
    return this.lists[side].isVisible(item);
  }
  isSelected(side: WuPickListSide, item: unknown): boolean {
    return this.lists[side].isSelected(item);
  }
  isFocused(side: WuPickListSide, index: number): boolean {
    return this.focusedList === side && this.lists[side].focus === index;
  }
  /** Nothing to show: the list is empty, or the search left nothing. */
  isEmpty(side: WuPickListSide): boolean {
    const st = this.lists[side];
    return !st.query.trim() ? !this.listOf(side).length : !st.visible().length;
  }
  /** The text shown in an empty list when there is no template: only when a search found nothing. */
  emptyText(side: WuPickListSide): string {
    return this.lists[side].query.trim() ? this.t.emptyFilterMessage : '';
  }
  label(item: unknown): string {
    return ɵlistItemLabel(item, this.optionLabel);
  }
  itemContext(side: WuPickListSide, item: unknown, index: number): Record<string, unknown> {
    return { $implicit: item, index, selected: this.isSelected(side, item), side };
  }
  headerContext(side: WuPickListSide): Record<string, unknown> {
    return { $implicit: this.listOf(side), side };
  }
  trackItem(side: WuPickListSide): TrackByFunction<unknown> {
    const fn = (side === 'source' ? this.sourceTrackBy : this.targetTrackBy) || this.trackBy;
    return fn || this.trackAny;
  }
  /** `@for` tracking, which cannot see the list: `trackBy`, else the item itself. */
  readonly trackAny: TrackByFunction<unknown> = (i, item) => {
    const fn = this.trackBy || this.sourceTrackBy || this.targetTrackBy;
    return fn ? fn(i, item) : item;
  };
  get selectedItemsSource(): unknown[] {
    return this.lists.source.selection;
  }
  set selectedItemsSource(v: unknown[]) {
    this.lists.source.selection = v || [];
  }
  get selectedItemsTarget(): unknown[] {
    return this.lists.target.selection;
  }
  set selectedItemsTarget(v: unknown[]) {
    this.lists.target.selection = v || [];
  }

  // ---------- buttons ----------

  buttonClass(extra: string): string {
    return ɵbuttonClass(this.major === 1 ? '' : 'p-button-secondary') + ' wu-btn-icon-only ' + extra;
  }
  canTransfer(side: WuPickListSide): boolean {
    return !this._disabled && this.lists[side].selectedVisible().length > 0;
  }
  canTransferAll(side: WuPickListSide): boolean {
    return !this._disabled && this.lists[side].visible().length > 0;
  }
  /** Reordering works on the whole list, so it waits while a search hides part of it. */
  canReorder(side: WuPickListSide): boolean {
    const st = this.lists[side];
    return !this._disabled && !st.query.trim() && st.selection.length > 0;
  }

  /** Moves the selected source items to the end of the target. */
  moveRight(event?: Event): void {
    this.transfer('source', this.lists.source.selectedVisible(), this._target.length, event, false);
  }
  moveAllRight(event?: Event): void {
    this.transfer('source', this.lists.source.visible(), this._target.length, event, true);
  }
  moveLeft(event?: Event): void {
    this.transfer('target', this.lists.target.selectedVisible(), this._source.length, event, false);
  }
  moveAllLeft(event?: Event): void {
    this.transfer('target', this.lists.target.visible(), this._source.length, event, true);
  }

  reorder(side: WuPickListSide, how: Reorder, event?: Event): void {
    if (!this.canReorder(side)) return;
    const st = this.lists[side];
    const list = this.listOf(side);
    if (!REORDER[how](list, st.selection, st.same)) return;
    st.touch();
    const items = st.selectedVisible();
    (side === 'source' ? this.onSourceReorder : this.onTargetReorder).emit({ originalEvent: event, items });
    this.emitLists(side);
    this.cdr.detectChanges();
    this.revealSelection(side);
  }

  /** Clears both search boxes. */
  resetFilter(): void {
    this.lists.source.query = '';
    this.lists.target.query = '';
    this.cdr.markForCheck();
  }
  /** Clears the search box of one list. */
  resetSourceFilter(): void {
    this.setFilter('source', '');
  }
  resetTargetFilter(): void {
    this.setFilter('target', '');
  }

  // ---------- items ----------

  pointerDown(event: PointerEvent, side: WuPickListSide, index: number): void {
    this.pointerType = event.pointerType || 'mouse';
    this.drag.down(event, side, index);
  }

  itemClick(event: MouseEvent, side: WuPickListSide, item: unknown, index: number): void {
    if (this._disabled || this.drag.swallowClick) return;
    const st = this.lists[side];
    const touch = this.pointerType === 'touch';
    st.pick(item, { metaKeySelection: this._metaKey && !touch, meta: event.metaKey || event.ctrlKey, shift: event.shiftKey });
    st.focus = index;
    (side === 'source' ? this.onSourceSelect : this.onTargetSelect).emit({ originalEvent: event, items: [...st.selection] });
    this.cdr.markForCheck();
  }

  /** A double click sends the item across. */
  itemDblClick(event: MouseEvent, side: WuPickListSide, item: unknown): void {
    if (this._disabled) return;
    const other = side === 'source' ? this._target : this._source;
    this.transfer(side, [item], other.length, event, false);
  }

  listFocus(event: FocusEvent, side: WuPickListSide): void {
    this.focusedList = side;
    this.lists[side].enter();
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  listBlur(event: FocusEvent, side: WuPickListSide): void {
    if (this.focusedList === side) this.focusedList = null;
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  /**
   * Listbox keys: ↑ / ↓ / Home / End move, Shift + arrow also selects, Space or Enter toggles the item,
   * Ctrl / ⌘ + A selects every item the search shows.
   */
  listKeydown(event: KeyboardEvent, side: WuPickListSide): void {
    const st = this.lists[side];
    const list = this.listOf(side);
    const key = event.key;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      const before = st.focus;
      st.step(key === 'ArrowDown' ? 1 : -1);
      if (event.shiftKey && !this._disabled && st.focus >= 0 && st.focus !== before && !st.isSelected(list[st.focus])) {
        st.selection = [...st.selection, list[st.focus]];
        this.emitSelect(side, event);
      }
    } else if (key === 'Home' || key === 'End') {
      event.preventDefault();
      st.focus = st.edge(key === 'Home' ? 1 : -1);
    } else if (key === ' ' || key === 'Enter') {
      event.preventDefault();
      if (this._disabled || st.focus < 0 || st.focus >= list.length) return;
      st.pick(list[st.focus], { metaKeySelection: false });
      this.emitSelect(side, event);
    } else if ((key === 'a' || key === 'A') && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (this._disabled) return;
      st.toggleAll();
      this.emitSelect(side, event);
    } else {
      return;
    }
    this.cdr.detectChanges();
    this.revealFocus(side);
  }

  filterInput(event: Event, side: WuPickListSide): void {
    this.setFilter(side, (event.target as HTMLInputElement).value);
  }

  // ---------- internals ----------

  private get listOptions() {
    return { filterBy: this.filterBy, matchMode: this.filterMatchMode, dataKey: this.dataKey };
  }

  private setFilter(side: WuPickListSide, value: unknown): void {
    const st = this.lists[side];
    st.query = value === null || value === undefined ? '' : String(value);
    st.focus = -1;
    (side === 'source' ? this.onSourceFilter : this.onTargetFilter).emit({ query: st.query, value: st.visible() });
    this.cdr.markForCheck();
  }

  private emitSelect(side: WuPickListSide, event: Event): void {
    (side === 'source' ? this.onSourceSelect : this.onTargetSelect).emit({ originalEvent: event, items: [...this.lists[side].selection] });
  }

  private transfer(from: WuPickListSide, items: unknown[], at: number, event: Event | undefined, all: boolean): void {
    if (this._disabled || !items.length) return;
    const to: WuPickListSide = from === 'source' ? 'target' : 'source';
    const fromState = this.lists[from];
    const toState = this.lists[to];
    const moved = transferItems(this.listOf(from), this.listOf(to), items, at, fromState.same);
    if (!moved.length) return;
    fromState.selection = fromState.selection.filter((s) => !moved.includes(s));
    if (this._keepSelection) toState.selection = [...toState.selection, ...moved];
    fromState.touch();
    toState.touch();
    fromState.prune();
    const payload = { originalEvent: event, items: moved };
    if (from === 'source') (all ? this.onMoveAllToTarget : this.onMoveToTarget).emit(payload);
    else (all ? this.onMoveAllToSource : this.onMoveToSource).emit(payload);
    this.sourceChange.emit(this._source);
    this.targetChange.emit(this._target);
    this.cdr.markForCheck();
  }

  private dragItems(side: WuPickListSide, index: number): unknown[] {
    const list = this.listOf(side);
    const item = list[index];
    if (item === undefined) return [];
    const st = this.lists[side];
    return st.isSelected(item) ? st.selectedVisible() : [item];
  }

  private dropItems(from: WuPickListSide, items: unknown[], to: WuPickListSide, index: number, event: Event): void {
    if (this._disabled) return;
    if (from === to) {
      const st = this.lists[from];
      if (!moveItemsTo(this.listOf(from), items, index, st.same)) return;
      st.touch();
      (from === 'source' ? this.onSourceReorder : this.onTargetReorder).emit({ originalEvent: event, items });
      this.emitLists(from);
      this.cdr.markForCheck();
      return;
    }
    this.transfer(from, items, index, event, false);
  }

  private emitLists(side: WuPickListSide): void {
    if (side === 'source') this.sourceChange.emit(this._source);
    else this.targetChange.emit(this._target);
  }

  private revealFocus(side: WuPickListSide): void {
    const f = this.lists[side].focus;
    if (f >= 0) this.doc.getElementById(this.itemId(side, f))?.scrollIntoView?.({ block: 'nearest' });
  }

  private revealSelection(side: WuPickListSide): void {
    const st = this.lists[side];
    const first = this.listOf(side).findIndex((it) => st.isSelected(it));
    if (first >= 0) this.doc.getElementById(this.itemId(side, first))?.scrollIntoView?.({ block: 'nearest' });
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
