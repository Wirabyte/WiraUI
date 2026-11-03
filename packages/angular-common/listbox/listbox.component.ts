import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { ɵWU_CHECKBOX_CSS } from '@wirabyte/ui/checkbox';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import { ɵWU_SELECT_CSS } from '@wirabyte/ui/select';
import {
  filterItems,
  firstIndex,
  lastIndex,
  sameValue,
  SelectItem,
  selectItems,
  SelectMatchMode,
  stepIndex,
  typeaheadIndex,
  WuLocale,
} from '@wirabyte/ui/core';

/** `(onChange)`: the new value. */
export interface WuListboxChangeEvent {
  originalEvent: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
/** `(onClick)` / `(onDblClick)`: the option under the pointer and the value after the click. */
export interface WuListboxClickEvent {
  originalEvent: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
export interface WuListboxFilterEvent {
  originalEvent: Event;
  filter: string;
}
export interface WuListboxSelectAllChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A list that stays open on the page, for picking one option or several (`[multiple]="true"`, with check boxes
 * via `[checkbox]="true"`): `<wu-listbox [options]="rooms" [(ngModel)]="room" optionLabel="name">`. It takes the
 * same option fields as wu-select (`optionLabel`, `optionValue`, `optionDisabled`, groups) and can search
 * (`[filter]="true"`). Keyboard: arrows move, Enter / Space pick, Home / End, typing jumps to a label;
 * in a multiple list Shift + arrows extend and Ctrl + A picks all.
 */
@Component({
  selector: 'wu-listbox, wu-listBox',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuListbox), multi: true }],
})
export class WuListbox implements ControlValueAccessor, OnDestroy {
  @Input() set options(v: readonly unknown[] | null | undefined) { this._options = v || []; this.rebuild(); }
  get options(): readonly unknown[] { return this._options; }
  @Input() set optionLabel(v: string | undefined) { this._label = v; this.rebuild(); }
  @Input() set optionValue(v: string | undefined) { this._value = v; this.rebuild(); }
  @Input() set optionDisabled(v: string | undefined) { this._disabledField = v; this.rebuild(); }
  /** Options are groups: `[{ label: 'ชั้น ม.1', items: [...] }]`. */
  @Input() set group(v: unknown) { this._group = ɵtoBool(v); this.rebuild(); }
  @Input() set optionGroupLabel(v: string | undefined) { this._groupLabel = v; this.rebuild(); }
  @Input() set optionGroupChildren(v: string | undefined) { this._groupChildren = v; this.rebuild(); }
  /** Compare object values by this field instead of by contents. */
  @Input() dataKey?: string;
  /** Pick several; the value is an array. */
  @Input() set multiple(v: unknown) { this._multiple = ɵtoBool(v); }
  get multiple(): boolean { return this._multiple; }
  /** Check boxes in a multiple list. */
  @Input() set checkbox(v: unknown) { this._checkbox = ɵtoBool(v); }
  get checkbox(): boolean { return this._checkbox; }
  /** The check-all box in the header of a multiple list with check boxes. Default true. */
  @Input() set showToggleAll(v: unknown) { this._toggleAll = v === undefined || ɵtoBool(v); }
  get showToggleAll(): boolean { return this._toggleAll; }
  /**
   * `true`: a plain click picks only that option (Ctrl / ⌘ + click adds or removes in a multiple list). Default false:
   * a click adds or removes in a multiple list. In a single list Ctrl / ⌘ + click clears the pick either way.
   */
  @Input() set metaKeySelection(v: unknown) { this._meta = ɵtoBool(v); }
  /** Moving with the arrows also picks (single lists). */
  @Input() set selectOnFocus(v: unknown) { this._selectOnFocus = ɵtoBool(v); }
  @Input() set filter(v: unknown) { this._filter = ɵtoBool(v); this.applyFilter(); }
  get filter(): boolean { return this._filter; }
  /** Fields to search, comma separated (`"name,code"`). Default: the label. */
  @Input() filterBy?: string;
  @Input() filterMatchMode: SelectMatchMode = 'contains';
  @Input() filterPlaceholder?: string;
  @Input() set filterValue(v: string | null | undefined) { this.query = v || ''; this.applyFilter(); }
  get filterValue(): string { return this.query; }
  @Input() emptyMessage?: string;
  @Input() emptyFilterMessage?: string;
  /** Height before the list scrolls. Default 14rem. */
  @Input() scrollHeight = '14rem';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() listStyle?: Record<string, any> | null;
  @Input() listStyleClass?: string;
  /** Alternate row shading. */
  @Input() set striped(v: unknown) { this._striped = ɵtoBool(v); }
  get striped(): boolean { return this._striped; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaFilterLabel?: string;
  @Input() tabindex: number | string = 0;
  /** Accepted for templates moving over: every option is rendered (lists here stay short). */
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() virtualScrollOptions: unknown;
  @Input() lazy: unknown;
  @Input() filterLocale: unknown;
  @Input() autoOptionFocus: unknown;
  @Input() focusOnHover: unknown;
  @Input() highlightOnSelect: unknown;

  @Output() readonly onChange = new EventEmitter<WuListboxChangeEvent>();
  @Output() readonly onClick = new EventEmitter<WuListboxClickEvent>();
  @Output() readonly onDblClick = new EventEmitter<WuListboxClickEvent>();
  @Output() readonly onFilter = new EventEmitter<WuListboxFilterEvent>();
  @Output() readonly onSelectAllChange = new EventEmitter<WuListboxSelectAllChangeEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('item', { descendants: false }) protected itemRef?: unknown;
  @ContentChild('group', { descendants: false }) protected groupRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('emptyfilter', { descendants: false }) protected emptyFilterRef?: unknown;
  @ViewChild('list') protected listRef?: ElementRef<HTMLUListElement>;

  readonly listId = ɵuniqueId('wu-listbox');
  /** Every row (groups flattened) and the rows the search leaves. */
  items: SelectItem[] = [];
  visible: SelectItem[] = [];
  activeIndex = -1;
  focused = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any = null;
  query = '';
  private _options: readonly unknown[] = [];
  private _label?: string;
  private _value?: string;
  private _disabledField?: string;
  private _group = false;
  private _groupLabel?: string;
  private _groupChildren?: string;
  private _multiple = false;
  private _checkbox = false;
  private _toggleAll = true;
  private _meta = false;
  private _selectOnFocus = false;
  private _filter = false;
  private _striped = false;
  private _disabled = false;
  private _readonly = false;
  private formDisabled = false;
  private anchorIndex = -1;
  private typed = '';
  private typedTimer: ReturnType<typeof setTimeout> | null = null;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    // The rows are drawn by wu-select's stylesheet, the check boxes by wu-checkbox's.
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    styles.load('select', ɵWU_SELECT_CSS);
    styles.load('checkbox', ɵWU_CHECKBOX_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    if (this.typedTimer) clearTimeout(this.typedTimer);
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
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
    return this.query
      ? asTemplate(this.emptyFilterRef) || ɵfindTemplate(this.templates, 'emptyfilter') || asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty')
      : asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty');
  }
  get emptyText(): string {
    return this.query ? this.emptyFilterMessage || this.emptyMessage || this.t.emptyFilterMessage : this.emptyMessage || this.t.emptyMessage;
  }
  get showCheckAll(): boolean {
    return this._multiple && this._checkbox && this._toggleAll;
  }
  get hasHeader(): boolean {
    return this._filter || this.showCheckAll;
  }
  get activeId(): string | null {
    return this.activeIndex >= 0 && this.visible[this.activeIndex] ? this.optionId(this.activeIndex) : null;
  }
  optionId(i: number): string {
    return `${this.listId}-${i}`;
  }
  isSelected(item: SelectItem): boolean {
    if (item.group) return false;
    if (this._multiple) return Array.isArray(this.value) && this.value.some((v) => sameValue(v, item.value, this.dataKey));
    return this.value !== null && this.value !== undefined && sameValue(this.value, item.value, this.dataKey);
  }
  private get pickable(): SelectItem[] {
    return this.visible.filter((it) => !it.group && !it.disabled);
  }
  get allSelected(): boolean {
    const p = this.pickable;
    return p.length > 0 && p.every((it) => this.isSelected(it));
  }
  get someSelected(): boolean {
    return !this.allSelected && this.pickable.some((it) => this.isSelected(it));
  }

  // ---------- pointer ----------

  optionClick(event: MouseEvent, item: SelectItem, index: number): void {
    if (item.group || item.disabled || this.disabled) return;
    this.activeIndex = index;
    if (!this._readonly) {
      const meta = event.metaKey || event.ctrlKey;
      if (this._multiple) {
        if (event.shiftKey && this.anchorIndex >= 0) this.selectRange(this.anchorIndex, index, event, meta || !this._meta);
        else if (this._meta && !meta && !this._checkbox) this.commit([item.value], event);
        else this.toggle(item, event);
        if (!event.shiftKey) this.anchorIndex = index;
      } else if (this.isSelected(item)) {
        if (meta) this.commit(null, event);
      } else {
        this.commit(item.value, event);
      }
    }
    this.onClick.emit({ originalEvent: event, option: item.option, value: this.value });
    this.listRef?.nativeElement.focus({ preventScroll: true });
    this.cdr.markForCheck();
  }

  optionDblClick(event: MouseEvent, item: SelectItem): void {
    if (item.group || item.disabled || this.disabled) return;
    this.onDblClick.emit({ originalEvent: event, option: item.option, value: this.value });
  }

  /** Keeps focus where it is while pressing an option (the list takes it on click). */
  optionPointerdown(event: PointerEvent): void {
    if (event.shiftKey) event.preventDefault();
  }

  toggleAll(event: Event): void {
    if (this.disabled || this._readonly) return;
    const checked = !this.allSelected;
    const current: unknown[] = Array.isArray(this.value) ? [...this.value] : [];
    const p = this.pickable;
    let next: unknown[];
    if (checked) {
      next = [...current];
      for (const it of p) if (!next.some((v) => sameValue(v, it.value, this.dataKey))) next.push(it.value);
    } else {
      next = current.filter((v) => !p.some((it) => sameValue(v, it.value, this.dataKey)));
    }
    this.commit(next, event);
    this.onSelectAllChange.emit({ originalEvent: event, checked });
  }

  // ---------- search ----------

  search(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.applyFilter();
    this.activeIndex = firstIndex(this.visible);
    this.onFilter.emit({ originalEvent: event, filter: this.query });
    this.cdr.markForCheck();
  }

  /** Clears the search box and shows every option again. */
  resetFilter(): void {
    this.query = '';
    this.applyFilter();
    this.cdr.markForCheck();
  }

  // ---------- keyboard ----------

  listFocus(event: FocusEvent): void {
    this.focused = true;
    if (this.activeIndex < 0 || !this.visible[this.activeIndex]) {
      const sel = this.visible.findIndex((it) => this.isSelected(it));
      this.activeIndex = sel >= 0 ? sel : firstIndex(this.visible);
    }
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  listBlur(event: FocusEvent): void {
    this.focused = false;
    this.onTouched();
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  keydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    const items = this.visible;
    const fromFilter = (event.target as HTMLElement).tagName === 'INPUT';
    let next = -1;
    switch (event.key) {
      case 'ArrowDown':
        next = this.activeIndex < 0 ? firstIndex(items) : stepIndex(items, this.activeIndex, 1);
        break;
      case 'ArrowUp':
        next = this.activeIndex < 0 ? lastIndex(items) : stepIndex(items, this.activeIndex, -1);
        break;
      case 'PageDown':
        next = stepIndex(items, Math.max(this.activeIndex, 0), 10);
        break;
      case 'PageUp':
        next = stepIndex(items, Math.max(this.activeIndex, 0), -10);
        break;
      case 'Home':
        if (fromFilter) return;
        next = firstIndex(items);
        break;
      case 'End':
        if (fromFilter) return;
        next = lastIndex(items);
        break;
      case 'Enter':
      case ' ': {
        if (fromFilter && event.key === ' ') return;
        event.preventDefault();
        const it = items[this.activeIndex];
        if (it && !it.group && !it.disabled && !this._readonly) {
          if (this._multiple) this.toggle(it, event);
          else if (!this.isSelected(it)) this.commit(it.value, event);
          this.anchorIndex = this.activeIndex;
        }
        return;
      }
      case 'a':
      case 'A':
        if ((event.ctrlKey || event.metaKey) && this._multiple && !fromFilter) {
          event.preventDefault();
          if (!this._readonly) this.commit(this.pickable.map((it) => it.value), event);
          return;
        }
        break;
    }
    if (next >= 0) {
      event.preventDefault();
      this.moveTo(next, event);
      return;
    }
    if (!fromFilter && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this.typed += event.key;
      if (this.typedTimer) clearTimeout(this.typedTimer);
      this.typedTimer = setTimeout(() => (this.typed = ''), 500);
      const i = typeaheadIndex(items, this.typed, this.activeIndex);
      if (i >= 0) this.moveTo(i, event);
    }
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    this.value = this._multiple ? (Array.isArray(v) ? [...v] : []) : v ?? null;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: (v: unknown) => void): void {
    this.onModel = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private moveTo(index: number, event: KeyboardEvent): void {
    this.activeIndex = index;
    const it = this.visible[index];
    if (it && !this._readonly) {
      if (this._multiple && event.shiftKey) {
        if (this.anchorIndex < 0) this.anchorIndex = index;
        this.selectRange(this.anchorIndex, index, event, false);
      } else if (!this._multiple && this._selectOnFocus && !this.isSelected(it)) {
        this.commit(it.value, event);
      }
    }
    this.cdr.markForCheck();
    // After the view shows the new active row.
    Promise.resolve().then(() => {
      const row = this.listRef?.nativeElement.querySelector(`#${CSS.escape(this.optionId(index))}`) as HTMLElement | null;
      row?.scrollIntoView({ block: 'nearest' });
    });
  }

  private toggle(item: SelectItem, event: Event): void {
    const current: unknown[] = Array.isArray(this.value) ? this.value : [];
    const next = this.isSelected(item) ? current.filter((v) => !sameValue(v, item.value, this.dataKey)) : [...current, item.value];
    this.commit(next, event);
  }

  /** Picks the rows from `a` to `b`; `add` keeps what was picked outside them. */
  private selectRange(a: number, b: number, event: Event, add: boolean): void {
    const [from, to] = a <= b ? [a, b] : [b, a];
    const range = this.visible.slice(from, to + 1).filter((it) => !it.group && !it.disabled);
    const next: unknown[] = add && Array.isArray(this.value) ? [...this.value] : [];
    for (const it of range) if (!next.some((v) => sameValue(v, it.value, this.dataKey))) next.push(it.value);
    this.commit(next, event);
  }

  private commit(value: unknown, event: Event): void {
    this.value = value;
    this.onModel(value);
    this.onChange.emit({ originalEvent: event, value });
    this.cdr.markForCheck();
  }

  private rebuild(): void {
    this.items = selectItems(this._options, {
      label: this._label,
      value: this._value,
      disabled: this._disabledField,
      group: this._group,
      groupLabel: this._groupLabel,
      groupChildren: this._groupChildren,
    });
    this.applyFilter();
  }

  private applyFilter(): void {
    this.visible = this._filter && this.query ? filterItems(this.items, this.query, this.filterBy, this.filterMatchMode) : this.items;
    if (this.activeIndex >= this.visible.length) this.activeIndex = -1;
  }
}
