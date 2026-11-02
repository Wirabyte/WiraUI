import { ChangeDetectorRef, ContentChild, ContentChildren, Directive, ElementRef, inject, Input, NgZone, OnDestroy, QueryList, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵfindTemplate, ɵtoBool, ɵWuPopup, ɵWuStyleLoader, WuConfig, WuTemplate } from 'wiraui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from 'wiraui/button';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';
import { FilterMatchMode, FilterMeta, WuLocale } from 'wiraui/core';
import { ɵWU_TABLE } from './table.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/** Context of a column filter's `filter` template: `let-value let-filter="filterCallback"`. */
export interface WuColumnFilterContext {
  $implicit: unknown;
  filterCallback: (value: unknown) => void;
  field: string;
  type: string;
  placeholder?: string;
}

/**
 * What wu-columnFilter does: a filter box for one column, usually in a header row or the caption. Without a template
 * it is a text box (or a number / date box, or a yes–no–any button for `type="boolean"`); a `filter` template brings
 * any control, which calls `filterCallback(value)`. The table filters by `field` with `matchMode` (contains for text,
 * the same day for dates, equals otherwise). `display="menu"` puts a filter button in the header instead: its menu
 * has match modes, several rules joined by "match all" / "match any", and Clear / Apply.
 */
@Directive()
export abstract class ɵWuColumnFilterBase implements OnDestroy {
  @Input() field = '';
  @Input() type: 'text' | 'numeric' | 'date' | 'boolean' = 'text';
  @Input() display: 'row' | 'menu' = 'row';
  @Input() placeholder?: string;
  @Input() matchMode?: FilterMatchMode;
  @Input() ariaLabel?: string;
  @Input() set showClearButton(v: unknown) {
    this._showClear = v === undefined || ɵtoBool(v);
  }
  get showClearButton(): boolean {
    return this._showClear;
  }
  /** Wait this long after typing before filtering, in ms. `0` filters at once. Default: the table's `filterDelay`. */
  @Input() set delay(v: unknown) {
    const n = Number(v);
    this._delay = v === null || v === undefined || v === '' || !Number.isFinite(n) ? null : Math.max(0, n);
  }
  /** Menu display: the "match all / any" choice (default true), the add-rule button, Apply, and match modes. */
  @Input() set showOperator(v: unknown) { this._showOperator = v === undefined || ɵtoBool(v); }
  get showOperator(): boolean { return this._showOperator; }
  @Input() set showAddButton(v: unknown) { this._showAdd = v === undefined || ɵtoBool(v); }
  get showAddButton(): boolean { return this._showAdd; }
  @Input() set showApplyButton(v: unknown) { this._showApply = v === undefined || ɵtoBool(v); }
  get showApplyButton(): boolean { return this._showApply; }
  @Input() set showMatchModes(v: unknown) { this._showModes = v === undefined || ɵtoBool(v); }
  get showMatchModes(): boolean { return this._showModes; }
  /** `[{ label: 'มีคำว่า', value: 'contains' }, …]`: the match modes to offer. Default: by `type`. */
  @Input() matchModeOptions?: Array<{ label: string; value: FilterMatchMode }> | null;
  /** Most rules in the menu. Default 2. */
  @Input() set maxConstraints(v: unknown) { const n = Number(v); this._max = Number.isFinite(n) && n > 0 ? n : 2; }
  get maxConstraints(): number { return this._max; }
  /** Close the menu after Clear. */
  @Input() set hideOnClear(v: unknown) { this._hideOnClear = ɵtoBool(v); }
  /** Accepted for templates moving over (the row display has no menu button). */
  @Input() showMenu: unknown;
  @Input() minFractionDigits: unknown;
  @Input() maxFractionDigits: unknown;
  @Input() locale: unknown;
  @Input() currency: unknown;
  @Input() useGrouping: unknown;
  @Input() showButtons: unknown;

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('filter', { descendants: false }) protected filterRef?: unknown;

  readonly filterCallback = (value: unknown): void => this.apply(value);
  protected readonly table = inject(ɵWU_TABLE);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly sub: Subscription = this.table.changes.subscribe(() => this.cdr.markForCheck());
  private _showClear = true;
  private _delay: number | null = null;
  private _showOperator = true;
  private _showAdd = true;
  private _showApply = true;
  private _showModes = true;
  private _max = 2;
  private _hideOnClear = false;
  private popup: ɵWuPopup | null = null;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  /** The menu is open, and the rules being edited in it. */
  menuOpen = false;
  rules: FilterMeta[] = [];
  operator: 'and' | 'or' = 'and';
  readonly menuId = `wu-colfilter-${Math.random().toString(36).slice(2, 9)}`;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const styles = inject(ɵWuStyleLoader);
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    styles.load('button', ɵWU_BUTTON_CSS);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.popup?.close();
    if (this.timer) clearTimeout(this.timer);
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get filterTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.filterRef) || ɵfindTemplate(this.templates, 'filter');
  }
  /** The column's current filter value (the first rule's, when there are several). */
  get value(): unknown {
    const f = this.table.filters[this.field];
    if (!f) return null;
    return Array.isArray(f) ? (f[0] ? f[0].value : null) : f.value;
  }
  /** The menu button shows a filter is on. */
  get active(): boolean {
    const f = this.table.filters[this.field];
    if (!f) return false;
    return (Array.isArray(f) ? f : [f]).some((x) => x.value !== null && x.value !== undefined && x.value !== '');
  }
  get hasValue(): boolean {
    const v = this.value;
    return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && !v.length);
  }
  get mode(): FilterMatchMode {
    return this.matchMode || (this.type === 'text' ? 'contains' : this.type === 'date' ? 'dateIs' : 'equals');
  }
  get inputType(): string {
    return this.type === 'numeric' ? 'number' : this.type === 'date' ? 'date' : 'text';
  }
  /** The value as the box shows it. */
  get inputValue(): string {
    const v = this.value;
    if (v === null || v === undefined) return '';
    if (v instanceof Date) {
      const p = (n: number) => String(n).padStart(2, '0');
      return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}`;
    }
    return String(v);
  }
  get boolLabel(): string {
    const v = this.value;
    return v === true ? this.t.yes : v === false ? this.t.no : '';
  }
  get context(): WuColumnFilterContext {
    return { $implicit: this.value, filterCallback: this.filterCallback, field: this.field, type: this.type, placeholder: this.placeholder };
  }

  /** Text from a box as the value of this column's type. */
  parse(raw: string): unknown {
    if (this.type === 'numeric') return raw === '' ? null : Number(raw);
    if (this.type === 'date') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
      return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
    }
    return raw;
  }

  /** A value as a box shows it. */
  show(v: unknown): string {
    if (v === null || v === undefined) return '';
    if (v instanceof Date) {
      const p = (n: number) => String(n).padStart(2, '0');
      return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}`;
    }
    return String(v);
  }

  input(event: Event): void {
    const value = this.parse((event.target as HTMLInputElement).value);
    if (this.timer) clearTimeout(this.timer);
    const wait = this._delay ?? this.table.filterDelay;
    if (this.type === 'text' && wait) this.timer = setTimeout(() => this.apply(value), wait);
    else this.apply(value);
  }

  /** Boolean filter: any → yes → no → any. */
  cycle(): void {
    const v = this.value;
    this.apply(v === true ? false : v === false ? null : true);
  }

  clear(): void {
    if (this.timer) clearTimeout(this.timer);
    this.apply(null);
  }

  // ---------- menu display ----------

  /** The match modes the menu offers for this column's type. */
  get modeOptions(): Array<{ label: string; value: FilterMatchMode }> {
    if (this.matchModeOptions && this.matchModeOptions.length) return this.matchModeOptions;
    const t = this.t as unknown as Record<string, string>;
    const modes: FilterMatchMode[] =
      this.type === 'numeric'
        ? ['equals', 'notEquals', 'lt', 'lte', 'gt', 'gte']
        : this.type === 'date'
          ? ['dateIs', 'dateIsNot', 'dateBefore', 'dateAfter']
          : this.type === 'boolean'
            ? ['equals']
            : ['startsWith', 'contains', 'notContains', 'endsWith', 'equals', 'notEquals'];
    return modes.map((value) => ({ value, label: t[value] || value }));
  }
  get buttonClasses(): string {
    return ɵbuttonClass('p-button-text p-button-rounded p-button-sm') + ' wu-btn-icon-only wu-column-filter-menu-button';
  }
  get clearClass(): string {
    return ɵbuttonClass('p-button-outlined p-button-sm') + ' wu-column-filter-menu-clear';
  }
  get applyClass(): string {
    return ɵbuttonClass('p-button-sm') + ' wu-column-filter-menu-apply';
  }
  get addClass(): string {
    return ɵbuttonClass('p-button-text p-button-sm') + ' wu-column-filter-add';
  }
  get removeClass(): string {
    return ɵbuttonClass('p-button-text p-button-danger p-button-sm') + ' wu-column-filter-remove';
  }
  ruleContext(rule: FilterMeta): WuColumnFilterContext {
    return { $implicit: rule.value, filterCallback: (v: unknown) => this.setRuleValue(rule, v), field: this.field, type: this.type, placeholder: this.placeholder };
  }

  toggleMenu(event: Event): void {
    if (this.menuOpen) this.closeMenu(true);
    else this.openMenu(event.currentTarget as HTMLElement);
  }

  openMenu(anchor: HTMLElement): void {
    const f = this.table.filters[this.field];
    const list = f ? (Array.isArray(f) ? f : [f]) : [];
    this.rules = list.length ? list.map((x) => ({ value: x.value, matchMode: x.matchMode || this.mode })) : [{ value: null, matchMode: this.mode }];
    this.operator = (Array.isArray(f) && f[0]?.operator) || 'and';
    this.menuOpen = true;
    this.cdr.detectChanges();
    const panel = this.host.querySelector(`#${this.menuId}`) as HTMLElement | null;
    if (!panel) return;
    this.popup = new ɵWuPopup(anchor, panel, {
      onOutside: () => this.zone.run(() => this.closeMenu(false)),
      onEscape: (e) => this.zone.run(() => {
        e.preventDefault();
        this.closeMenu(true);
      }),
      sheetClass: 'wu-column-filter-sheet',
      modalClass: 'wu-column-filter-modal',
      sheet: false,
    });
    this.popup.open();
    (panel.querySelector('input, select, button') as HTMLElement | null)?.focus();
  }

  closeMenu(returnFocus: boolean): void {
    if (!this.menuOpen) return;
    this.popup?.close();
    this.popup = null;
    this.menuOpen = false;
    this.cdr.markForCheck();
    if (returnFocus) (this.host.querySelector('.wu-column-filter-menu-button') as HTMLElement | null)?.focus();
  }

  setRuleValue(rule: FilterMeta, v: unknown): void {
    rule.value = v;
    // Without an Apply button the rule takes effect at once.
    if (!this._showApply) this.applyMenu(false);
    this.cdr.markForCheck();
  }
  ruleInput(rule: FilterMeta, event: Event): void {
    this.setRuleValue(rule, this.parse((event.target as HTMLInputElement).value));
  }
  ruleMode(rule: FilterMeta, event: Event): void {
    rule.matchMode = (event.target as HTMLSelectElement).value as FilterMatchMode;
    if (!this._showApply) this.applyMenu(false);
  }
  ruleBool(rule: FilterMeta): void {
    this.setRuleValue(rule, rule.value === true ? false : rule.value === false ? null : true);
  }
  setOperator(event: Event): void {
    this.operator = (event.target as HTMLSelectElement).value === 'or' ? 'or' : 'and';
    if (!this._showApply) this.applyMenu(false);
  }
  addRule(): void {
    if (this.rules.length >= this._max) return;
    this.rules = [...this.rules, { value: null, matchMode: this.mode }];
    this.cdr.markForCheck();
  }
  removeRule(index: number): void {
    this.rules = this.rules.filter((_, i) => i !== index);
    if (!this._showApply) this.applyMenu(false);
    this.cdr.markForCheck();
  }

  applyMenu(close = true): void {
    this.table.filterRules(this.field, this.rules.map((x) => ({ ...x })), this.operator);
    if (close) this.closeMenu(true);
  }

  clearMenu(): void {
    this.rules = [{ value: null, matchMode: this.mode }];
    this.operator = 'and';
    this.table.filterRules(this.field, null);
    if (this._hideOnClear) this.closeMenu(true);
    this.cdr.markForCheck();
  }

  private apply(value: unknown): void {
    this.timer = null;
    this.table.filter(value, this.field, this.mode);
    this.cdr.markForCheck();
  }
}
