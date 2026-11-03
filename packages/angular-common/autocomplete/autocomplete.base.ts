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
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  ɵWuPopup,
  ɵWuStyleLoader,
  WuTemplate,
} from '@wirabyte/ui/config';
import { firstIndex, lastIndex, optionField, sameValue, searchText, SelectItem, selectItems, stepIndex, WuLocale } from '@wirabyte/ui/core';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import { ɵWU_SELECT_CSS } from '@wirabyte/ui/select';
import { WuAutoCompleteCompleteEvent, WuAutoCompleteSelectEvent } from './autocomplete.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * What wu-autocomplete does, shared by the v1 and v2/v3 templates. A text field that asks the page for suggestions
 * (`(completeMethod)`, after `delay` ms and `minLength` characters) and lists them under it in the top layer.
 * Picking one makes it the value (the whole option); typing without picking keeps the text, unless `forceSelection`.
 * The field and list look and theme like wu-select.
 */
@Directive()
export abstract class ɵWuAutoCompleteBase implements ControlValueAccessor, OnDestroy {
  /** The suggestions for the last query. */
  @Input() set suggestions(v: readonly unknown[] | null | undefined) {
    this._suggestions = v || [];
    this.rebuild();
    this.loading = false;
    // Opening renders the panel, so it waits until the change detection that set this input has finished.
    if (this.searching && this.focused) queueMicrotask(() => this.focused && this.showResults());
    this.searching = false;
    this.cdr.markForCheck();
  }
  get suggestions(): readonly unknown[] {
    return this._suggestions;
  }
  /** Field (or dot path) shown for each suggestion. `field` is its older name. */
  @Input() set optionLabel(v: string | undefined) { this._optionLabel = v; this.rebuild(); }
  @Input() set field(v: string | undefined) { this._optionLabel = v; this.rebuild(); }
  @Input() set optionDisabled(v: string | undefined) { this._optionDisabled = v; this.rebuild(); }
  @Input() set group(v: unknown) { this._group = ɵtoBool(v); this.rebuild(); }
  @Input() set optionGroupLabel(v: string | undefined) { this._groupLabel = v; this.rebuild(); }
  @Input() set optionGroupChildren(v: string | undefined) { this._groupChildren = v; this.rebuild(); }
  @Input() dataKey?: string;
  /** Milliseconds after the last key before asking. `0` asks at once. Default: the app's `delays.autoComplete` (0). */
  @Input() set delay(v: unknown) { this._delay = v === null || v === undefined || v === '' ? null : Math.max(0, Number(v) || 0); }
  get delay(): number { return this._delay ?? this.config.delays.autoComplete; }
  /** Characters needed before asking. Default 1. */
  @Input() minLength = 1;
  /** On leaving the field, text that is not a picked suggestion is cleared. */
  @Input() set forceSelection(v: unknown) { this._force = ɵtoBool(v); }
  /** A button that asks for every suggestion (query `''`, or the current text with `dropdownMode="current"`). */
  @Input() set dropdown(v: unknown) { this._dropdown = ɵtoBool(v); }
  get dropdown(): boolean { return this._dropdown; }
  @Input() dropdownMode: 'blank' | 'current' = 'blank';
  @Input() set autoHighlight(v: unknown) { this._autoHighlight = ɵtoBool(v); }
  @Input() set showEmptyMessage(v: unknown) { this._showEmpty = v === undefined || ɵtoBool(v); }
  @Input() emptyMessage?: string;
  @Input() placeholder?: string;
  @Input() inputId?: string;
  @Input() name?: string;
  @Input() inputStyleClass?: string;
  @Input() inputStyle?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() panelStyleClass?: string;
  @Input() panelStyle?: Record<string, string | number> | null;
  @Input() scrollHeight = '14rem';
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); if (this._disabled) this.hide(); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set required(v: unknown) { this._required = ɵtoBool(v); }
  get required(): boolean { return this._required; }
  @Input() maxlength?: number | null;
  @Input() tabindex?: number | string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() size?: string;
  @Input() variant?: 'outlined' | 'filled';
  @Input() set fluid(v: unknown) { this._fluid = ɵtoBool(v); }
  get fluid(): boolean { return this._fluid || /(^|\s)w-full(\s|$)/.test(this.styleClass || ''); }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  /** Accepted for templates moving over: the list opens in the top layer. Several values (`multiple`) are not built yet. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() multiple: unknown;
  @Input() completeOnFocus: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly completeMethod = new EventEmitter<WuAutoCompleteCompleteEvent>();
  @Output() readonly onSelect = new EventEmitter<WuAutoCompleteSelectEvent>();
  @Output() readonly onUnselect = new EventEmitter<WuAutoCompleteSelectEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onDropdownClick = new EventEmitter<WuAutoCompleteCompleteEvent>();
  @Output() readonly onClear = new EventEmitter<Event | undefined>();
  @Output() readonly onKeyUp = new EventEmitter<KeyboardEvent>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('group', { descendants: false }) protected groupRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;

  @ViewChild('root') protected rootRef?: ElementRef<HTMLElement>;
  @ViewChild('field', { static: true }) protected inputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;
  @ViewChild('listBox') protected listRef?: ElementRef<HTMLElement>;

  items: SelectItem[] = [];
  /** The model: a picked suggestion, or the typed text. */
  value: unknown = null;
  open = false;
  focused = false;
  /** Waiting for suggestions after asking. */
  loading = false;
  activeIndex = -1;
  readonly baseId = ɵuniqueId('wu-autocomplete');
  readonly listId = `${this.baseId}-list`;
  readonly trackIndex = (i: number): number => i;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  private _delay: number | null = null;
  private readonly i18n = ɵrefreshOnTranslation();
  private _suggestions: readonly unknown[] = [];
  private _optionLabel?: string;
  private _optionDisabled?: string;
  private _group = false;
  private _groupLabel?: string;
  private _groupChildren?: string;
  private _force = false;
  private _dropdown = false;
  private _autoHighlight = false;
  private _showEmpty = true;
  private _disabled = false;
  private _readonly = false;
  private _required = false;
  private _fluid = false;
  private _invalid = false;
  private _showClear = false;
  private formDisabled = false;
  /** A query was sent and its suggestions have not arrived yet. */
  private searching = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private popup: ɵWuPopup | null = null;
  private onModelChange: (v: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    // The field and the list are drawn by wu-select's stylesheet.
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    styles.load('select', ɵWU_SELECT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
    this.popup?.close();
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get sizeKey(): 'sm' | 'lg' | null {
    return ɵsize(this.size);
  }
  get filled(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }
  get clearable(): boolean {
    return this._showClear && this.filled && !this.disabled && !this._readonly;
  }
  get activeId(): string | null {
    return this.open && this.activeIndex >= 0 ? this.optionId(this.activeIndex) : null;
  }
  get emptyText(): string {
    return this.emptyMessage || this.t.emptyFilterMessage;
  }
  get itemTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.itemRef) || ɵfindTemplate(this.templates, 'item');
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
    return asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty');
  }
  optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }
  isSelected(item: SelectItem): boolean {
    return !item.group && this.value !== null && typeof this.value === 'object' && sameValue(this.value, item.option, this.dataKey);
  }

  // ---------- typing ----------

  input(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    // Typed text is the value until a suggestion is picked.
    this.setValue(text || null);
    if (this.timer) clearTimeout(this.timer);
    if (text.length < this.minLength) {
      this.hide();
      this.searching = false;
      this.loading = false;
      return;
    }
    // No wait: ask on this key, not a task later.
    const wait = this.delay;
    if (wait > 0) this.timer = setTimeout(() => this.ask(event, text), wait);
    else this.ask(event, text);
  }

  keydown(event: KeyboardEvent): void {
    if (this.disabled || this._readonly) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open) {
          if (this.items.length) this.showResults();
          return;
        }
        this.moveActive(this.activeIndex < 0 ? firstIndex(this.items) : stepIndex(this.items, this.activeIndex, 1));
        return;
      case 'ArrowUp':
        if (!this.open) return;
        event.preventDefault();
        this.moveActive(this.activeIndex < 0 ? lastIndex(this.items) : stepIndex(this.items, this.activeIndex, -1));
        return;
      case 'Enter':
        if (!this.open) return;
        event.preventDefault();
        if (this.activeIndex >= 0) this.pick(this.items[this.activeIndex], event);
        else this.hide();
        return;
      case 'Escape':
        if (!this.open) return;
        event.preventDefault();
        event.stopPropagation();
        this.hide();
        return;
      case 'Tab':
        if (this.open && this.activeIndex >= 0) this.pick(this.items[this.activeIndex], event);
        this.hide();
        return;
    }
  }

  keyup(event: KeyboardEvent): void {
    this.onKeyUp.emit(event);
  }

  dropdownClick(event: Event): void {
    if (this.disabled || this._readonly) return;
    this.inputRef?.nativeElement.focus();
    if (this.open) {
      this.hide();
      return;
    }
    const query = this.dropdownMode === 'current' ? this.inputRef?.nativeElement.value || '' : '';
    this.onDropdownClick.emit({ originalEvent: event, query });
    this.ask(event, query);
  }

  /** Keeps focus in the field while the dropdown button or the list is pressed. */
  keepFocus(event: MouseEvent): void {
    if (event.target !== this.inputRef?.nativeElement) event.preventDefault();
  }

  // ---------- picking ----------

  pick(item: SelectItem | undefined, event: Event): void {
    if (!item || item.group || item.disabled) return;
    this.setValue(item.option);
    this.writeText();
    this.hide();
    this.onSelect.emit({ originalEvent: event, value: item.option });
  }

  clear(event?: Event): void {
    this.setValue(null);
    this.writeText();
    this.hide();
    this.onClear.emit(event);
    this.inputRef?.nativeElement.focus();
  }

  hover(index: number): void {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.cdr.markForCheck();
    }
  }

  // ---------- focus ----------

  fieldFocus(event: FocusEvent): void {
    this.focused = true;
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  fieldBlur(event: FocusEvent): void {
    this.focused = false;
    if (this._force && this.filled && typeof this.value !== 'object') {
      // Text that matches a suggestion's label picks it; anything else is cleared.
      const text = searchText(String(this.value));
      const match = this.items.find((it) => !it.group && !it.disabled && searchText(it.label) === text);
      if (match) this.setValue(match.option);
      else this.setValue(null);
      this.writeText();
    }
    this.hide();
    this.onTouched();
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  // ---------- forms ----------

  writeValue(value: unknown): void {
    this.value = value === undefined ? null : value;
    this.writeText();
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

  /** The text for the current value: a picked option shows its label, typed text shows itself. */
  private writeText(): void {
    const el = this.inputRef?.nativeElement;
    if (!el) return;
    const v = this.value;
    const text = v === null || v === undefined ? '' : typeof v === 'object' ? String(optionField(v, this._optionLabel) ?? '') : String(v);
    if (el.value !== text) el.value = text;
  }

  private ask(event: Event, query: string): void {
    this.searching = true;
    this.loading = true;
    this.cdr.markForCheck();
    this.completeMethod.emit({ originalEvent: event, query });
  }

  /** Opens the list with the current suggestions, as `ac.show()` did. */
  show(): void {
    this.showResults();
  }

  private showResults(): void {
    if (this.disabled || this._readonly) return;
    if (!this.items.length && !this._showEmpty) {
      this.hide();
      return;
    }
    this.activeIndex = this._autoHighlight ? firstIndex(this.items) : -1;
    if (this.open) {
      this.popup?.position();
      return;
    }
    this.open = true;
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
    this.onShow.emit();
  }

  /** Closing (Escape, a pick, leaving the field, a click outside) also drops a search still on its way, so a late answer
   *  does not open the list again. */
  /** Closes the list. */
  hide(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.searching = false;
    this.loading = false;
    if (!this.open) return;
    this.popup?.close();
    this.popup = null;
    this.open = false;
    this.activeIndex = -1;
    this.cdr.markForCheck();
    this.onHide.emit();
  }

  private setValue(value: unknown): void {
    if (value === this.value) return;
    const previous = this.value;
    this.value = value;
    this.onModelChange(value);
    if (previous !== null && typeof previous === 'object' && value !== previous) {
      this.onUnselect.emit({ originalEvent: new Event('change'), value: previous });
    }
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
    this.items = selectItems(this._suggestions, {
      label: this._optionLabel,
      disabled: this._optionDisabled,
      group: this._group,
      groupLabel: this._groupLabel,
      groupChildren: this._groupChildren,
    });
  }
}
