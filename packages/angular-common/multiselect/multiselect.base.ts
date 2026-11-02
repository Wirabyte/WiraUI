import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
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
import { ControlValueAccessor } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵsize,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  ɵWuPopup,
  ɵWuStyleLoader,
  WuTemplate,
} from 'wiraui/config';
import { filterItems, firstIndex, lastIndex, sameValue, SelectItem, selectItems, stepIndex, typeaheadIndex, WuLocale } from 'wiraui/core';
import { ɵWU_CHECKBOX_CSS } from 'wiraui/checkbox';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';
import { ɵWU_SELECT_CSS, WuSelectMatchMode } from 'wiraui/select';
import { WuMultiSelectChangeEvent, WuMultiSelectFilterEvent, WuMultiSelectSelectAllChangeEvent, WuMultiSelectSelectedItemsContext } from './multiselect.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const TYPEAHEAD_MS = 600;

/**
 * What wu-multiselect does, shared by the v1 and v2/v3 templates. Like wu-select (same field, list and stylesheet),
 * but the value is an array: each row has a check box, the header ticks every row the search leaves, and the field
 * shows the chosen labels, chips, or "{0} items selected" once there are more than `maxSelectedLabels`.
 * Picking keeps the list open; Escape, Tab or a click outside closes it.
 */
@Directive()
export abstract class ɵWuMultiSelectBase implements ControlValueAccessor, AfterViewChecked, OnDestroy {
  // ---------- the options ----------
  @Input() set options(v: readonly unknown[] | null | undefined) { this._options = v || []; this.rebuild(); }
  get options(): readonly unknown[] { return this._options; }
  @Input() set optionLabel(v: string | undefined) { this._optionLabel = v; this.rebuild(); }
  @Input() set optionValue(v: string | undefined) { this._optionValue = v; this.rebuild(); }
  @Input() set optionDisabled(v: string | undefined) { this._optionDisabled = v; this.rebuild(); }
  @Input() set group(v: unknown) { this._group = ɵtoBool(v); this.rebuild(); }
  @Input() set optionGroupLabel(v: string | undefined) { this._groupLabel = v; this.rebuild(); }
  @Input() set optionGroupChildren(v: string | undefined) { this._groupChildren = v; this.rebuild(); }
  /** Compare object values by this field instead of their contents. */
  @Input() dataKey?: string;

  // ---------- the field ----------
  @Input() placeholder?: string;
  /** The placeholder's older name. */
  @Input() defaultLabel?: string;
  /** `'comma'` (default): labels separated by commas; `'chip'`: a removable chip for each. */
  @Input() display: 'comma' | 'chip' = 'comma';
  /** Past this many choices the field shows `selectedItemsLabel` instead. Default 3. */
  @Input() set maxSelectedLabels(v: number | string | null | undefined) {
    const n = Number(v);
    this._maxLabels = v === null || v === undefined || v === '' || !Number.isFinite(n) ? 3 : n;
  }
  /** `{0}` is the count. Default: the locale's text (`เลือกแล้ว {0} รายการ`). */
  @Input() selectedItemsLabel?: string;
  /** At most this many choices; the header checkbox is hidden. */
  @Input() selectionLimit?: number | null;
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); if (this._disabled) this.hide(); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  /** A spinner in place of the arrow; until it is false again the list stays shut and the value cannot change. */
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); if (this._loading) this.hide(); }
  get loading(): boolean { return this._loading; }
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex: number | string = 0;
  @Input() size?: string;
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid || /(^|\s)w-full(\s|$)/.test(this.styleClass || ''); }
  @Input() variant?: 'outlined' | 'filled';
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() panelStyleClass?: string;
  @Input() panelStyle?: Record<string, string | number> | null;
  @Input() scrollHeight = '14rem';

  // ---------- the panel ----------
  /** The header row (check-all box, search, close button). Default true. */
  @Input() set showHeader(v: unknown) { this._showHeader = v === undefined || ɵtoBool(v); }
  get showHeader(): boolean { return this._showHeader; }
  @Input() set showToggleAll(v: unknown) { this._showToggleAll = v === undefined || ɵtoBool(v); }
  get showToggleAll(): boolean { return this._showToggleAll && !this.selectionLimit; }
  /** A search box in the header. Default true. */
  @Input() set filter(v: unknown) { this._filter = v === undefined || ɵtoBool(v); }
  get filter(): boolean { return this._filter; }
  @Input() set filterBy(v: string | undefined) { this._filterBy = v; this.applyFilter(); }
  @Input() set filterMatchMode(v: WuSelectMatchMode | undefined) { this._matchMode = v || 'contains'; this.applyFilter(); }
  @Input() filterPlaceholder?: string;
  /** The older spelling of `filterPlaceholder`. */
  @Input() set filterPlaceHolder(v: string | undefined) {
    this.filterPlaceholder = v;
  }
  @Input() ariaFilterLabel?: string;
  @Input() set filterValue(v: string | null | undefined) { this.filterText = v || ''; this.applyFilter(); }
  @Input() set resetFilterOnHide(v: unknown) { this._resetFilter = ɵtoBool(v); }
  @Input() emptyMessage?: string;
  @Input() emptyFilterMessage?: string;

  /** Accepted for templates moving over: the list opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() lazy: unknown;
  @Input() autofocusFilter: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly onChange = new EventEmitter<WuMultiSelectChangeEvent>();
  @Output() readonly onFilter = new EventEmitter<WuMultiSelectFilterEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onPanelShow = new EventEmitter<void>();
  @Output() readonly onPanelHide = new EventEmitter<void>();
  @Output() readonly onClear = new EventEmitter<Event>();
  @Output() readonly onSelectAllChange = new EventEmitter<WuMultiSelectSelectAllChangeEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('selectedItems', { descendants: false }) protected selectedItemsRef?: unknown;
  @ContentChild('group', { descendants: false }) protected groupRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('emptyfilter', { descendants: false }) protected emptyFilterRef?: unknown;
  @ContentChild('dropdownicon', { descendants: false }) protected dropdownIconRef?: unknown;

  @ViewChild('root') protected rootRef?: ElementRef<HTMLElement>;
  @ViewChild('focusInput') protected focusRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;
  @ViewChild('filterInput') protected filterRef?: ElementRef<HTMLInputElement>;
  @ViewChild('listBox') protected listRef?: ElementRef<HTMLElement>;

  items: SelectItem[] = [];
  visible: SelectItem[] = [];
  value: unknown[] = [];
  open = false;
  focused = false;
  filterText = '';
  activeIndex = -1;
  readonly baseId = ɵuniqueId('wu-multiselect');
  readonly listId = `${this.baseId}-list`;
  readonly trackIndex = (i: number): number => i;
  /** For the `selectedItems` template. */
  readonly removeChip = (value: unknown, event?: Event): void => this.remove(value, event);

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private chipKey = '';
  private chipObserver: ResizeObserver | null = null;
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _options: readonly unknown[] = [];
  private _optionLabel?: string;
  private _optionValue?: string;
  private _optionDisabled?: string;
  private _group = false;
  private _groupLabel?: string;
  private _groupChildren?: string;
  private _maxLabels = 3;
  private _showClear = false;
  private _disabled = false;
  private _readonly = false;
  private _loading = false;
  private _fluid = false;
  private _invalid = false;
  private _showHeader = true;
  private _showToggleAll = true;
  private _filter = true;
  private _filterBy?: string;
  private _matchMode: WuSelectMatchMode = 'contains';
  private _resetFilter = false;
  private formDisabled = false;
  private popup: ɵWuPopup | null = null;
  private typed = '';
  private typedAt = 0;
  private onModelChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    // The field and the list are drawn by wu-select's stylesheet, the rows' check boxes by wu-checkbox's.
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    styles.load('select', ɵWU_SELECT_CSS);
    styles.load('checkbox', ɵWU_CHECKBOX_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.popup?.close();
    this.chipObserver?.disconnect();
  }

  /** Chips that do not fit the field hide behind a "+N" chip. Measured after each check, only when something changed. */
  ngAfterViewChecked(): void {
    this.fitChips();
  }

  private fitChips(force = false): void {
    if (!this.chips) {
      this.chipKey = '';
      return;
    }
    const label = this.host.querySelector('.wu-multiselect-label') as HTMLElement | null;
    const more = label?.querySelector('.wu-multiselect-more') as HTMLElement | null;
    if (!label || !more) return;
    const chips = Array.from(label.querySelectorAll<HTMLElement>('.wu-multiselect-chip'));
    const key = `${label.clientWidth}|${chips.map((c) => c.textContent).join('\u0001')}`;
    if (!force && key === this.chipKey) return;
    this.chipKey = key;
    const win = this.doc.defaultView;
    if (!this.chipObserver && win && 'ResizeObserver' in win) {
      this.chipObserver = new win.ResizeObserver(() => this.fitChips(true));
      this.chipObserver.observe(label);
    }
    for (const c of chips) c.hidden = false;
    more.hidden = true;
    const style = win?.getComputedStyle(label);
    const limit = label.clientWidth - (parseFloat(style?.paddingRight || '0') || 0);
    const fits = (el: HTMLElement) => el.offsetLeft + el.offsetWidth <= limit + 0.5;
    let shown = chips.findIndex((c) => !fits(c));
    if (shown < 0) return;
    // Drop chips until the "+N" chip fits after the last one shown; the first chip always shows (it can shrink).
    shown = Math.max(1, shown);
    more.hidden = false;
    for (;;) {
      chips.forEach((c, i) => (c.hidden = i >= shown));
      more.textContent = `+${chips.length - shown}`;
      if (shown <= 1 || fits(more)) break;
      shown--;
    }
    more.title = chips
      .slice(shown)
      .map((c) => (c.textContent || '').trim())
      .join(', ');
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get filled(): boolean {
    return this.value.length > 0;
  }
  get placeholderText(): string {
    return this.placeholder || this.defaultLabel || '';
  }
  /** The chosen options, in the order of the list. */
  get selectedItems(): SelectItem[] {
    return this.items.filter((it) => !it.group && this.isSelected(it));
  }
  /** Over the limit: the field shows the count instead of labels or chips. */
  get overLimit(): boolean {
    return this._maxLabels >= 0 && this.value.length > this._maxLabels;
  }
  get countText(): string {
    return (this.selectedItemsLabel || this.t.selectedItemsLabel).replace('{0}', String(this.value.length));
  }
  get labelText(): string {
    if (!this.filled) return this.placeholderText;
    if (this.overLimit) return this.countText;
    return this.selectedItems.map((it) => it.label).join(', ');
  }
  get chips(): boolean {
    return this.display === 'chip' && this.filled && !this.overLimit;
  }
  get clearable(): boolean {
    return this._showClear && this.filled && !this.disabled && !this._readonly && !this._loading;
  }
  get activeId(): string | null {
    return this.open && this.activeIndex >= 0 ? this.optionId(this.activeIndex) : null;
  }
  get emptyText(): string {
    return this.filterText ? this.emptyFilterMessage || this.t.emptyFilterMessage : this.emptyMessage || this.t.emptyMessage;
  }
  /** Every row the search leaves (and may be ticked) is ticked. */
  get allSelected(): boolean {
    const rows = this.pickable();
    return rows.length > 0 && rows.every((it) => this.isSelected(it));
  }
  get someSelected(): boolean {
    return !this.allSelected && this.pickable().some((it) => this.isSelected(it));
  }
  get selectedItemsContext(): WuMultiSelectSelectedItemsContext {
    return { $implicit: this.value, removeChip: this.removeChip };
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get selectedItemsTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.selectedItemsRef) || ɵfindTemplate(this.templates, 'selectedItems') || ɵfindTemplate(this.templates, 'selecteditems');
  }
  get groupTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.groupRef) || ɵfindTemplate(this.templates, 'group');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get emptyTemplate(): TemplateRef<unknown> | null {
    return this.filterText
      ? asTemplate(this.emptyFilterRef) || ɵfindTemplate(this.templates, 'emptyfilter') || ɵfindTemplate(this.templates, 'empty')
      : asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty');
  }
  get dropdownIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.dropdownIconRef) || ɵfindTemplate(this.templates, 'dropdownicon');
  }
  optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }
  isSelected(item: SelectItem): boolean {
    return !item.group && this.value.some((v) => sameValue(v, item.value, this.dataKey));
  }
  /** A row that cannot be ticked because the limit is reached. */
  isBlocked(item: SelectItem): boolean {
    return !!this.selectionLimit && this.value.length >= this.selectionLimit && !this.isSelected(item);
  }
  removeLabel(item: SelectItem): string {
    return `${this.t.remove} ${item.label}`;
  }

  // ---------- opening and closing ----------

  toggle(event?: Event): void {
    if (this.open) this.hide(true);
    else this.show(event);
  }

  show(event?: Event): void {
    if (this.open || this.disabled || this._readonly || this._loading) return;
    this.open = true;
    this.applyFilter();
    this.activeIndex = -1;
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    const anchor = this.rootRef?.nativeElement;
    if (!panel || !anchor) return;
    this.popup = new ɵWuPopup(anchor, panel, {
      sheet: false,
      sheetClass: 'wu-select-sheet',
      modalClass: 'wu-select-modal',
      onOutside: () => this.hide(),
      onPosition: (_, box) => (panel.style.minWidth = `${Math.round(box.width)}px`),
    });
    this.popup.open();
    if (this._filter && this._showHeader) this.filterRef?.nativeElement.focus({ preventScroll: true });
    else if (event?.type !== 'keydown') this.focusField();
    this.onPanelShow.emit();
  }

  hide(refocus = false): void {
    if (!this.open) return;
    this.popup?.close();
    this.popup = null;
    this.open = false;
    this.activeIndex = -1;
    if (this._resetFilter) {
      this.filterText = '';
      this.applyFilter();
    }
    this.cdr.markForCheck();
    if (refocus) this.focusField();
    this.onPanelHide.emit();
  }

  // ---------- picking ----------

  /** Ticks or unticks a row; the list stays open. */
  toggleItem(item: SelectItem, event: Event): void {
    if (item.group || item.disabled || this.disabled || this._readonly || this._loading) return;
    const selected = this.isSelected(item);
    if (!selected && this.isBlocked(item)) return;
    const next = selected ? this.value.filter((v) => !sameValue(v, item.value, this.dataKey)) : [...this.value, item.value];
    this.setValue(next, event, item.value);
    this.activeIndex = this.visible.indexOf(item);
  }

  /** The header check box: ticks every row the search leaves, or unticks them all. */
  toggleAll(event: Event): void {
    if (this.disabled || this._readonly || this._loading) return;
    const rows = this.pickable();
    const checked = !this.allSelected;
    let next: unknown[];
    if (checked) {
      next = [...this.value];
      for (const it of rows) if (!next.some((v) => sameValue(v, it.value, this.dataKey))) next.push(it.value);
    } else {
      next = this.value.filter((v) => !rows.some((it) => sameValue(v, it.value, this.dataKey)));
    }
    this.setValue(next, event);
    this.onSelectAllChange.emit({ originalEvent: event, checked });
  }

  remove(value: unknown, event?: Event): void {
    event?.stopPropagation();
    if (this.disabled || this._readonly || this._loading) return;
    this.setValue(
      this.value.filter((v) => !sameValue(v, value, this.dataKey)),
      event || new Event('remove'),
      value,
    );
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.setValue([], event);
    this.onClear.emit(event);
    this.focusField();
  }

  hover(index: number): void {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.cdr.markForCheck();
    }
  }

  // ---------- typing ----------

  keydown(event: KeyboardEvent): void {
    if (this.disabled || this._readonly) return;
    if (this._loading) {
      if (event.key !== 'Tab') event.preventDefault();
      return;
    }
    const inSearch = event.target === this.filterRef?.nativeElement;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) this.show(event);
        else this.moveActive(this.activeIndex < 0 ? firstIndex(this.visible) : stepIndex(this.visible, this.activeIndex, 1));
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open) this.show(event);
        else this.moveActive(this.activeIndex < 0 ? lastIndex(this.visible) : stepIndex(this.visible, this.activeIndex, -1));
        return;
      case 'PageDown':
      case 'PageUp':
        if (!this.open) return;
        event.preventDefault();
        this.moveActive(stepIndex(this.visible, Math.max(this.activeIndex, 0), event.key === 'PageDown' ? 10 : -10));
        return;
      case 'Home':
      case 'End':
        if (!this.open || inSearch) return;
        event.preventDefault();
        this.moveActive(event.key === 'Home' ? firstIndex(this.visible) : lastIndex(this.visible));
        return;
      case 'Enter':
        event.preventDefault();
        if (!this.open) this.show(event);
        else if (this.activeIndex >= 0) this.toggleItem(this.visible[this.activeIndex], event);
        return;
      case ' ':
        if (inSearch) return;
        event.preventDefault();
        if (!this.open) this.show(event);
        else if (this.activeIndex >= 0) this.toggleItem(this.visible[this.activeIndex], event);
        return;
      case 'Escape':
        if (!this.open) return;
        event.preventDefault();
        event.stopPropagation();
        this.hide(true);
        return;
      case 'Tab':
        this.hide();
        return;
      default:
        if (!inSearch && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && this.open) {
          event.preventDefault();
          if (!this.allSelected) this.toggleAll(event);
          return;
        }
        if (!inSearch && this.open && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          const now = Date.now();
          this.typed = now - this.typedAt > TYPEAHEAD_MS ? event.key : this.typed + event.key;
          this.typedAt = now;
          const i = typeaheadIndex(this.visible, this.typed, this.activeIndex);
          if (i >= 0) this.moveActive(i);
        }
    }
  }

  search(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value;
    this.applyFilter();
    this.activeIndex = this.filterText ? firstIndex(this.visible) : -1;
    this.popup?.position();
    this.onFilter.emit({ originalEvent: event, filter: this.filterText });
    this.cdr.markForCheck();
  }

  // ---------- focus ----------

  fieldFocus(event: FocusEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.onFocus.emit(event);
      this.cdr.markForCheck();
    }
  }

  focusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.host.contains(next)) return;
    setTimeout(() => {
      if (this.host.contains(this.doc.activeElement)) return;
      this.focused = false;
      this.onTouched();
      this.onBlur.emit(event);
      this.hide();
      this.cdr.markForCheck();
    });
  }

  /** Clicks in the panel keep focus where it is; the search box takes it. */
  panelMousedown(event: MouseEvent): void {
    if (event.target !== this.filterRef?.nativeElement) event.preventDefault();
  }

  /** Pressing on the field keeps focus where it is, so a second click closes the list instead of reopening it. */
  fieldMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  /** A click on the field toggles the list (chip × buttons and the clear button stop the event). */
  fieldClick(event: MouseEvent): void {
    if (this.disabled || this._readonly || this._loading) return;
    // A click relayed from a <label for> focuses the field and leaves the list closed.
    if (event.target === this.focusRef?.nativeElement) return;
    this.toggle(event);
  }

  focusField(): void {
    this.focusRef?.nativeElement.focus({ preventScroll: true });
  }

  // ---------- forms ----------

  writeValue(value: unknown): void {
    this.value = Array.isArray(value) ? [...value] : [];
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    if (disabled) this.hide();
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  /** Rows the header check box acts on: what the search leaves, not groups, not disabled. */
  private pickable(): SelectItem[] {
    return this.visible.filter((it) => !it.group && !it.disabled);
  }

  private setValue(value: unknown[], event: Event, itemValue?: unknown): void {
    this.value = value;
    this.onModelChange(value);
    this.onChange.emit({ originalEvent: event, value, itemValue });
    this.popup?.position();
    this.cdr.markForCheck();
  }

  private moveActive(index: number): void {
    if (index < 0) return;
    this.activeIndex = index;
    this.cdr.markForCheck();
    const list = this.listRef?.nativeElement;
    const run = () => {
      const el = this.doc.getElementById(this.optionId(index));
      const box = list?.parentElement;
      if (!el || !box) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight;
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else run();
  }

  private rebuild(): void {
    this.items = selectItems(this._options, {
      label: this._optionLabel,
      value: this._optionValue,
      disabled: this._optionDisabled,
      group: this._group,
      groupLabel: this._groupLabel,
      groupChildren: this._groupChildren,
    });
    this.applyFilter();
    if (this.open) this.popup?.position();
    this.cdr.markForCheck();
  }

  private applyFilter(): void {
    this.visible = this._filter && this.filterText ? filterItems(this.items, this.filterText, this._filterBy, this._matchMode) : this.items;
  }
}
