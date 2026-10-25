import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, HostBinding, HostListener, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵtoBool, WtConfig, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_CHECKBOX_CSS } from 'wiratheme/checkbox';
import { ɵWT_TABLE } from './table.types';

/** Re-renders a directive's host whenever its table sorts, selects or pages. */
@Directive()
abstract class TableChild implements OnDestroy {
  protected readonly table = inject(ɵWT_TABLE);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription = this.table.changes.subscribe(() => this.cdr.markForCheck());
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/**
 * Makes a header cell sort its column: `<th wtSortableColumn="name">ชื่อ <wt-sortIcon field="name" /></th>`.
 * The `pSortableColumn` attribute existing templates use works the same. Click, Enter or Space sorts; hold Ctrl / ⌘
 * to add a column in `sortMode="multiple"`.
 */
@Directive({
  selector: '[wtSortableColumn], [pSortableColumn]',
  standalone: true,
})
export class WtSortableColumn extends TableChild {
  @Input() set wtSortableColumn(v: string) { this.field = v; }
  @Input() set pSortableColumn(v: string) { this.field = v; }
  @Input() set wtSortableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pSortableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  field = '';
  private off = false;

  @HostBinding('class.wt-sortable-column') get sortable(): boolean {
    return !this.off;
  }
  @HostBinding('class.p-sortable-column') get v1Sortable(): boolean {
    return !this.off && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-sortable-column') get styledSortable(): boolean {
    return !this.off && this.table.major > 1;
  }
  @HostBinding('class.wt-sorted') get sorted(): boolean {
    return !!this.table.sortOrderOf(this.field);
  }
  @HostBinding('class.p-highlight') get v1Sorted(): boolean {
    return this.sorted && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-column-sorted') get styledSorted(): boolean {
    return this.sorted && this.table.major > 1;
  }
  @HostBinding('attr.aria-sort') get ariaSort(): string | null {
    if (this.off) return null;
    const o = this.table.sortOrderOf(this.field);
    return o > 0 ? 'ascending' : o < 0 ? 'descending' : 'none';
  }
  @HostBinding('attr.tabindex') get tabindex(): number | null {
    return this.off ? null : 0;
  }

  @HostListener('click', ['$event'])
  click(event: Event): void {
    if (this.off || !this.field) return;
    // Clicks on controls inside the header (a filter box, a checkbox) do not sort.
    const t = event.target as HTMLElement | null;
    if (t && t.closest('input, select, textarea, button, a, wt-select, wt-tableHeaderCheckbox, wt-tableheadercheckbox')) return;
    this.table.sortBy(this.field, event);
  }

  @HostListener('keydown', ['$event'])
  key(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    this.click(event);
  }
}

/** The arrow of a sortable column: `<wt-sortIcon field="name" />`. Shows the order and, in multi-sort, its rank. */
@Component({
  selector: 'wt-sortIcon, wt-sorticon',
  standalone: true,
  template: `<svg class="wt-sorticon-svg p-sortable-column-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path class="wt-sorticon-up" d="m5 6 3-3 3 3"></path>
      <path class="wt-sorticon-down" d="m5 10 3 3 3-3"></path></svg
    ><span class="wt-sorticon-badge p-sortable-column-badge" [hidden]="rank < 1">{{ rank }}</span>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-sorticon',
    '[class.wt-sorticon-asc]': 'order > 0',
    '[class.wt-sorticon-desc]': 'order < 0',
  },
})
export class WtSortIcon extends TableChild {
  @Input() field = '';
  get order(): number {
    return this.table.sortOrderOf(this.field);
  }
  /** Rank in a multi-column sort (1, 2, …), 0 when there is only one level. */
  get rank(): number {
    return this.table.sortIndexOf(this.field);
  }
}

/**
 * Makes a row selectable by click, Enter or Space: `<tr [wtSelectableRow]="row" [wtSelectableRowIndex]="i">`.
 * The `pSelectableRow` attribute existing templates use works the same.
 */
@Directive({
  selector: '[wtSelectableRow], [pSelectableRow]',
  standalone: true,
})
export class WtSelectableRow extends TableChild {
  @Input() set wtSelectableRow(v: unknown) { this.row = v; }
  @Input() set pSelectableRow(v: unknown) { this.row = v; }
  @Input() set wtSelectableRowIndex(v: number) { this.index = v; }
  @Input() set pSelectableRowIndex(v: number) { this.index = v; }
  @Input() set wtSelectableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pSelectableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  row: unknown;
  index?: number;
  private off = false;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wt-selectable-row') get selectable(): boolean {
    return !this.off;
  }
  @HostBinding('class.p-selectable-row') get v1Selectable(): boolean {
    return !this.off && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-selectable-row') get styledSelectable(): boolean {
    return !this.off && this.table.major > 1;
  }
  @HostBinding('class.wt-row-selected') get selected(): boolean {
    return this.table.isSelected(this.row);
  }
  @HostBinding('class.p-highlight') get v1Selected(): boolean {
    return this.selected && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-row-selected') get styledSelected(): boolean {
    return this.selected && this.table.major > 1;
  }
  @HostBinding('attr.aria-selected') get ariaSelected(): boolean | null {
    return this.off ? null : this.selected;
  }
  @HostBinding('attr.tabindex') get tabindex(): number | null {
    return this.off ? null : 0;
  }

  @HostListener('click', ['$event'])
  click(event: Event): void {
    if (this.off) return;
    const t = event.target as HTMLElement | null;
    // Buttons, links and fields inside the row do their own thing.
    if (t && t !== this.el && t.closest('button, a, input, select, textarea, wt-select, wt-checkbox, wt-tableCheckbox, wt-tablecheckbox, [contenteditable]')) return;
    this.table.toggleRow(this.row, event, this.index, 'row');
  }

  @HostListener('keydown', ['$event'])
  key(event: KeyboardEvent): void {
    if (event.target !== this.el) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.table.toggleRow(this.row, event, this.index, 'row');
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const sib = (event.key === 'ArrowDown' ? this.el.nextElementSibling : this.el.previousElementSibling) as HTMLElement | null;
      if (sib && sib.tabIndex >= 0) sib.focus();
    }
  }
}

const CHECK_SVG = '<svg class="wt-checkbox-icon p-checkbox-icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>';

/** A row's checkbox in `selectionMode="multiple"` tables: `<td><wt-tableCheckbox [value]="row" /></td>`. */
@Component({
  selector: 'wt-tableCheckbox, wt-tablecheckbox',
  standalone: true,
  template: `<label class="wt-checkbox" [class.wt-checkbox-checked]="checked" [class.wt-checkbox-disabled]="disabled">
    <input type="checkbox" class="wt-checkbox-input" [checked]="checked" [disabled]="disabled" [attr.aria-label]="ariaLabel || t.selectRow" (change)="toggle($event)" />
    <span class="wt-checkbox-control p-checkbox p-component" [class.p-checkbox-checked]="checked" aria-hidden="true">
      <span class="wt-checkbox-box p-checkbox-box" [class.p-highlight]="checked">${CHECK_SVG}</span>
    </span>
  </label>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-table-checkbox p-element' },
})
export class WtTableCheckbox extends TableChild {
  @Input() value: unknown;
  @Input() index?: number;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() ariaLabel?: string;
  private _disabled = false;
  private readonly config = inject(WtConfig);

  constructor() {
    super();
    inject(ɵWtStyleLoader).load('checkbox', ɵWT_CHECKBOX_CSS);
  }
  get t() {
    return this.config.translation;
  }
  get checked(): boolean {
    return this.table.isSelected(this.value);
  }
  toggle(event: Event): void {
    this.table.toggleRow(this.value, event, this.index, 'checkbox');
  }
}

/** Select or clear every row (every row the search leaves): `<th><wt-tableHeaderCheckbox /></th>`. */
@Component({
  selector: 'wt-tableHeaderCheckbox, wt-tableheadercheckbox',
  standalone: true,
  template: `<label class="wt-checkbox" [class.wt-checkbox-checked]="checked" [class.wt-checkbox-disabled]="disabled">
    <input
      type="checkbox"
      class="wt-checkbox-input"
      [checked]="checked"
      [indeterminate]="mixed"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || t.selectAll"
      (change)="toggle($event)"
    />
    <span class="wt-checkbox-control p-checkbox p-component" [class.p-checkbox-checked]="checked" aria-hidden="true">
      <span class="wt-checkbox-box p-checkbox-box" [class.p-highlight]="checked" [class.wt-checkbox-mixed]="mixed">${CHECK_SVG}</span>
    </span>
  </label>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-table-checkbox p-element' },
})
export class WtTableHeaderCheckbox extends TableChild {
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || !this.table.hasRows; }
  @Input() ariaLabel?: string;
  private _disabled = false;
  private readonly config = inject(WtConfig);

  constructor() {
    super();
    inject(ɵWtStyleLoader).load('checkbox', ɵWT_CHECKBOX_CSS);
  }
  get t() {
    return this.config.translation;
  }
  get checked(): boolean {
    return this.table.allSelected;
  }
  get mixed(): boolean {
    return !this.table.allSelected && this.table.someSelected;
  }
  toggle(event: Event): void {
    this.table.toggleAll(event);
  }
}
