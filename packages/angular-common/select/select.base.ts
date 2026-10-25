import { DOCUMENT } from '@angular/common';
import {
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
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  ɵWtPopup,
  ɵWtStyleLoader,
  WtTemplate,
} from 'wiratheme/config';
import {
  filterItems,
  firstIndex,
  indexOfValue,
  lastIndex,
  sameValue,
  SelectItem,
  selectItems,
  stepIndex,
  typeaheadIndex,
  WtLocale,
} from 'wiratheme/core';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { WtSelectChangeEvent, WtSelectFilterEvent, WtSelectMatchMode } from './select.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const TYPEAHEAD_MS = 600;

/**
 * What wt-select does, shared by the v1 and v2/v3 templates (they differ only in control flow and era class names).
 *
 * A select-only combobox (ARIA): a hidden, focusable `<input role="combobox">` takes the keyboard and `<label for>`,
 * the visible label shows the choice or a `selectedItem` template, and the list opens in the top layer.
 * With `filter` the search box in the panel takes focus; with `editable` the visible field is the combobox itself.
 */
@Directive()
export abstract class ɵWtSelectBase implements ControlValueAccessor, OnDestroy {
  // ---------- the options ----------
  @Input() set options(v: readonly unknown[] | null | undefined) { this._options = v || []; this.rebuild(); }
  get options(): readonly unknown[] { return this._options; }
  /** Field (or dot path) shown for each option. Without it an option shows its `label`, or itself. */
  @Input() set optionLabel(v: string | undefined) { this._optionLabel = v; this.rebuild(); }
  /** Field (or dot path) used as the value. Without it the value is the whole option. */
  @Input() set optionValue(v: string | undefined) { this._optionValue = v; this.rebuild(); }
  @Input() set optionDisabled(v: string | undefined) { this._optionDisabled = v; this.rebuild(); }
  /** Options are groups: `[{ label: 'ภาคเหนือ', items: [...] }]`. */
  @Input() set group(v: unknown) { this._group = ɵtoBool(v); this.rebuild(); }
  @Input() set optionGroupLabel(v: string | undefined) { this._groupLabel = v; this.rebuild(); }
  @Input() set optionGroupChildren(v: string | undefined) { this._groupChildren = v; this.rebuild(); }
  /** Compare object values by this field instead of their contents. */
  @Input() set dataKey(v: string | undefined) { this._dataKey = v; this.syncSelected(); }

  // ---------- the field ----------
  @Input() placeholder?: string;
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  get showClear(): boolean { return this._showClear; }
  /** Type any text; a typed label picks its option. */
  @Input() set editable(v: unknown) { this._editable = ɵtoBool(v); }
  get editable(): boolean { return this._editable; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); if (this._disabled) this.hide(); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  /** Shows a spinner in place of the arrow; until it is false again the list stays shut and the value cannot change. */
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); if (this._loading) this.hide(); }
  get loading(): boolean { return this._loading; }
  /** A check mark beside the chosen option. */
  @Input() set checkmark(v: unknown) { this._checkmark = ɵtoBool(v); }
  get checkmark(): boolean { return this._checkmark; }
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex: number | string = 0;
  /** `'small'` / `'large'` (or `sm` / `lg`). */
  @Input() size?: string;
  /** Full width of its container. */
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid || /(^|\s)w-full(\s|$)/.test(this.styleClass || ''); }
  @Input() variant?: 'outlined' | 'filled';
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  /** Classes and styles for the field (`styleClass="w-full"`, `[style]="{ width: '20rem' }"`). */
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() panelStyleClass?: string;
  @Input() panelStyle?: Record<string, string | number> | null;
  /** Height of the list before it scrolls. Default `14rem`. */
  @Input() scrollHeight = '14rem';

  // ---------- filtering ----------
  @Input() set filter(v: unknown) { this._filter = ɵtoBool(v); }
  get filter(): boolean { return this._filter; }
  /** Fields to search, comma separated (`filterBy="name_th,code"`). Default: the label. */
  @Input() set filterBy(v: string | undefined) { this._filterBy = v; this.applyFilter(); }
  @Input() set filterMatchMode(v: WtSelectMatchMode | undefined) { this._matchMode = v || 'contains'; this.applyFilter(); }
  @Input() filterPlaceholder?: string;
  @Input() ariaFilterLabel?: string;
  /** Start with this search text. */
  @Input() set filterValue(v: string | null | undefined) { this.filterText = v || ''; this.applyFilter(); }
  /** Clear the search each time the list closes. */
  @Input() set resetFilterOnHide(v: unknown) { this._resetFilter = ɵtoBool(v); }
  @Input() emptyMessage?: string;
  @Input() emptyFilterMessage?: string;

  /** Accepted for templates moving over: the list opens in the top layer, so nothing needs appending or a z-index. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() lazy: unknown;
  @Input() autoDisplayFirst: unknown;
  @Input() autofocusFilter: unknown;

  @Output() readonly onChange = new EventEmitter<WtSelectChangeEvent>();
  @Output() readonly onFilter = new EventEmitter<WtSelectFilterEvent>();
  /** Accepted for templates moving over (lists are not loaded lazily). */
  @Output() readonly onLazyLoad = new EventEmitter<unknown>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();
  @Output() readonly onClear = new EventEmitter<Event>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('selectedItem', { descendants: false }) protected selectedItemRef?: unknown;
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

  /** Every row (groups flattened) and the rows the search leaves. */
  items: SelectItem[] = [];
  visible: SelectItem[] = [];
  value: unknown = null;
  open = false;
  focused = false;
  filterText = '';
  /** Row under the keyboard / pointer in `visible`, -1 for none. */
  activeIndex = -1;
  readonly baseId = ɵuniqueId('wt-select');
  readonly listId = `${this.baseId}-list`;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _options: readonly unknown[] = [];
  private _optionLabel?: string;
  private _optionValue?: string;
  private _optionDisabled?: string;
  private _group = false;
  private _groupLabel?: string;
  private _groupChildren?: string;
  private _dataKey?: string;
  private _showClear = false;
  private _editable = false;
  private _disabled = false;
  private _readonly = false;
  private _loading = false;
  private _checkmark = false;
  private _fluid = false;
  private _invalid = false;
  private _filter = false;
  private _filterBy?: string;
  private _matchMode: WtSelectMatchMode = 'contains';
  private _resetFilter = false;
  private formDisabled = false;
  private selectedIndex = -1;
  private popup: ɵWtPopup | null = null;
  private typed = '';
  private typedAt = 0;
  private onModelChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.popup?.close();
  }

  // ---------- what the templates read ----------

  get t(): WtLocale {
    return this.config.translation;
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get selectedItem(): SelectItem | null {
    return this.selectedIndex >= 0 ? this.items[this.selectedIndex] : null;
  }
  get filled(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }
  /** Text of the visible field: the chosen option, typed text (editable) or the placeholder. */
  get labelText(): string {
    const s = this.selectedItem;
    if (s) return s.label;
    if (this._editable && this.filled) return String(this.value);
    return this.placeholder || '';
  }
  get showPlaceholder(): boolean {
    return !this.selectedItem && !(this._editable && this.filled);
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
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
  }
  get selectedItemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.selectedItemRef) || ɵfindTemplate(this.templates, 'selectedItem') || ɵfindTemplate(this.templates, 'value');
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
  /** Rows keep their DOM while the list re-renders (v1 *ngFor). */
  readonly trackIndex = (i: number): number => i;
  optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }
  isSelected(item: SelectItem): boolean {
    return !item.group && this.selectedIndex >= 0 && this.items[this.selectedIndex] === item;
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
    const sel = this.visibleIndexOf(this.value);
    this.activeIndex = sel >= 0 ? sel : -1;
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    const anchor = this.rootRef?.nativeElement;
    if (!panel || !anchor) return;
    this.popup = new ɵWtPopup(anchor, panel, {
      sheet: false,
      sheetClass: 'wt-select-sheet',
      modalClass: 'wt-select-modal',
      onOutside: () => this.hide(),
      onPosition: (_, box) => (panel.style.minWidth = `${Math.round(box.width)}px`),
    });
    this.popup.open();
    this.scrollToActive();
    if (this._filter) this.filterRef?.nativeElement.focus({ preventScroll: true });
    else if (event?.type !== 'keydown') this.focusField();
    this.onShow.emit();
  }

  /** `refocus`: put focus back on the field (after a pick, Escape or the arrow button). */
  hide(refocus = false): void {
    if (!this.open) return;
    this.popup?.close();
    this.popup = null;
    this.open = false;
    this.activeIndex = -1;
    if (this._resetFilter) this.filterText = '';
    this.cdr.markForCheck();
    if (refocus) this.focusField();
    this.onHide.emit();
  }

  // ---------- picking ----------

  pick(item: SelectItem, event: Event): void {
    if (item.group || item.disabled) return;
    this.setValue(item.value, event);
    this.hide(true);
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.setValue(null, event);
    this.filterText = '';
    this.applyFilter();
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

  /** Keys on the field and on the search box. */
  keydown(event: KeyboardEvent): void {
    if (this.disabled || this._readonly) return;
    // While loading only Tab works (the browser moves focus); keys that would open or change the value do nothing.
    if (this._loading) {
      if (event.key !== 'Tab') event.preventDefault();
      return;
    }
    const inSearch = event.target === this.filterRef?.nativeElement;
    const inEditable = this._editable && !inSearch;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) this.show(event);
        else this.moveActive(this.activeIndex < 0 ? firstIndex(this.visible) : stepIndex(this.visible, this.activeIndex, 1));
        return;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey && this.open) {
          this.pickActive(event);
          return;
        }
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
        if (!this.open || inSearch || inEditable) return;
        event.preventDefault();
        this.moveActive(event.key === 'Home' ? firstIndex(this.visible) : lastIndex(this.visible));
        return;
      case 'Enter':
        event.preventDefault();
        if (this.open) this.pickActive(event);
        else this.show(event);
        return;
      case ' ':
        if (inSearch || inEditable) return;
        event.preventDefault();
        if (this.open && this.activeIndex >= 0) this.pickActive(event);
        else if (!this.open) this.show(event);
        return;
      case 'Escape':
        if (!this.open) return;
        event.preventDefault();
        event.stopPropagation();
        this.hide(true);
        return;
      case 'Tab':
        // Tab keeps the row the keyboard was on, as native selects do, then lets focus move on.
        if (this.open) {
          const it = this.visible[this.activeIndex];
          if (it && !it.group && !it.disabled) this.setValue(it.value, event);
          this.hide();
        }
        return;
      default:
        if (!inSearch && !inEditable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          this.typeahead(event.key, event);
        }
    }
  }

  /** The search box. */
  search(event: Event): void {
    this.filterText = (event.target as HTMLInputElement).value;
    this.applyFilter();
    this.activeIndex = this.filterText ? firstIndex(this.visible) : this.visibleIndexOf(this.value);
    this.popup?.position();
    this.scrollToActive();
    this.onFilter.emit({ originalEvent: event, filter: this.filterText });
    this.cdr.markForCheck();
  }

  /** The editable field: the text is the value, unless it is the label of an option. */
  editInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    const lower = text.trim().toLocaleLowerCase();
    const match = lower ? this.items.find((it) => !it.group && !it.disabled && it.label.toLocaleLowerCase() === lower) : undefined;
    this.setValue(match ? match.value : text, event);
  }

  // ---------- focus ----------

  fieldFocus(event: FocusEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.onFocus.emit(event);
      this.cdr.markForCheck();
    }
  }

  /** Leaving the whole control (the panel sits inside it in the DOM) closes the list and marks it touched. */
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

  /** Clicks in the panel keep focus where it is (Safari does not focus clicked buttons); the search box takes it. */
  panelMousedown(event: MouseEvent): void {
    if (event.target !== this.filterRef?.nativeElement) event.preventDefault();
  }

  /**
   * Pressing on the field keeps focus where it is. Otherwise the focused input blurs on mousedown, the list closes
   * before the click arrives, and the click opens it again instead of closing it. The editable input takes focus as usual.
   */
  fieldMousedown(event: MouseEvent): void {
    if (this._editable && event.target === this.focusRef?.nativeElement) return;
    event.preventDefault();
  }

  /** A click on the field toggles the list (not on the clear button, which stops the event). */
  fieldClick(event: MouseEvent): void {
    if (this.disabled || this._readonly || this._loading) return;
    if (event.target === this.focusRef?.nativeElement) {
      // The editable field opens on click. The hidden input only gets clicks relayed from its <label>: like a native
      // select, a label click focuses the field and leaves the list closed.
      if (this._editable && !this.open) this.show(event);
      return;
    }
    this.toggle(event);
  }

  focusField(): void {
    this.focusRef?.nativeElement.focus({ preventScroll: true });
  }

  // ---------- forms ----------

  writeValue(value: unknown): void {
    this.value = value === undefined ? null : value;
    this.syncSelected();
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

  private setValue(value: unknown, event: Event | null): void {
    if (sameValue(value, this.value, this._dataKey)) return;
    this.value = value;
    this.syncSelected();
    this.onModelChange(value);
    this.onChange.emit({ originalEvent: event, value });
    this.cdr.markForCheck();
  }

  private pickActive(event: Event): void {
    const it = this.visible[this.activeIndex];
    if (it) this.pick(it, event);
    else this.hide(true);
  }

  private moveActive(index: number): void {
    if (index < 0) return;
    this.activeIndex = index;
    this.cdr.markForCheck();
    this.scrollToActive();
  }

  /** Closed: a letter picks the next option starting with it (as native selects do). Open: it moves the highlight. */
  private typeahead(key: string, event: Event): void {
    const now = Date.now();
    this.typed = now - this.typedAt > TYPEAHEAD_MS ? key : this.typed + key;
    this.typedAt = now;
    if (this.open) {
      const i = typeaheadIndex(this.visible, this.typed, this.activeIndex);
      if (i >= 0) this.moveActive(i);
    } else {
      const i = typeaheadIndex(this.items, this.typed, this.selectedIndex);
      if (i >= 0) this.setValue(this.items[i].value, event);
    }
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
    this.syncSelected();
    this.applyFilter();
    if (this.open) this.popup?.position();
    this.cdr.markForCheck();
  }

  private syncSelected(): void {
    this.selectedIndex = indexOfValue(this.items, this.value, this._dataKey);
  }

  private applyFilter(): void {
    this.visible = this._filter && this.filterText ? filterItems(this.items, this.filterText, this._filterBy, this._matchMode) : this.items;
  }

  private visibleIndexOf(value: unknown): number {
    return indexOfValue(this.visible, value, this._dataKey);
  }

  /** Keeps the highlighted row in view inside the list (not the page). */
  private scrollToActive(): void {
    const list = this.listRef?.nativeElement;
    if (!list || this.activeIndex < 0) return;
    const run = () => {
      const el = this.doc.getElementById(this.optionId(this.activeIndex));
      const box = list.parentElement;
      if (!el || !box) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (bottom > box.scrollTop + box.clientHeight) box.scrollTop = bottom - box.clientHeight;
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else run();
  }
}
