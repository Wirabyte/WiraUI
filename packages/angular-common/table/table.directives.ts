import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, HostBinding, HostListener, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵtoBool, WuConfig, ɵWuStyleLoader } from 'wiraui/config';
import { ɵWU_CHECKBOX_CSS } from 'wiraui/checkbox';
import { ɵWU_RADIOBUTTON_CSS } from 'wiraui/radiobutton';
import { ɵWU_TABLE } from './table.types';

/** Re-renders a directive's host whenever its table sorts, selects or pages. */
@Directive()
abstract class TableChild implements OnDestroy {
  protected readonly table = inject(ɵWU_TABLE);
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly sub: Subscription = this.table.changes.subscribe(() => this.cdr.markForCheck());
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/**
 * Makes a header cell sort its column: `<th wuSortableColumn="name">ชื่อ <wu-sortIcon field="name" /></th>`.
 * The `pSortableColumn` attribute existing templates use works the same. Click, Enter or Space sorts; hold Ctrl / ⌘
 * to add a column in `sortMode="multiple"`.
 */
@Directive({
  selector: '[wuSortableColumn], [pSortableColumn]',
  standalone: true,
})
export class WuSortableColumn extends TableChild {
  @Input() set wuSortableColumn(v: string) { this.field = v; }
  @Input() set pSortableColumn(v: string) { this.field = v; }
  @Input() set wuSortableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pSortableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  field = '';
  private off = false;

  @HostBinding('class.wu-sortable-column') get sortable(): boolean {
    return !this.off;
  }
  @HostBinding('class.p-sortable-column') get v1Sortable(): boolean {
    return !this.off && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-sortable-column') get styledSortable(): boolean {
    return !this.off && this.table.major > 1;
  }
  @HostBinding('class.wu-sorted') get sorted(): boolean {
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
    if (t && t.closest('input, select, textarea, button, a, wu-select, wu-tableHeaderCheckbox, wu-tableheadercheckbox')) return;
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

/** The arrow of a sortable column: `<wu-sortIcon field="name" />`. Shows the order and, in multi-sort, its rank. */
@Component({
  selector: 'wu-sortIcon, wu-sorticon',
  standalone: true,
  template: `<svg class="wu-sorticon-svg p-sortable-column-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path class="wu-sorticon-up" d="m5 6 3-3 3 3"></path>
      <path class="wu-sorticon-down" d="m5 10 3 3 3-3"></path></svg
    ><span class="wu-sorticon-badge p-sortable-column-badge" [hidden]="rank < 1">{{ rank }}</span>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-sorticon',
    '[class.wu-sorticon-asc]': 'order > 0',
    '[class.wu-sorticon-desc]': 'order < 0',
  },
})
export class WuSortIcon extends TableChild {
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
 * Makes a row selectable by click, Enter or Space: `<tr [wuSelectableRow]="row" [wuSelectableRowIndex]="i">`.
 * The `pSelectableRow` attribute existing templates use works the same.
 */
@Directive({
  selector: '[wuSelectableRow], [pSelectableRow]',
  standalone: true,
})
export class WuSelectableRow extends TableChild {
  @Input() set wuSelectableRow(v: unknown) { this.row = v; }
  @Input() set pSelectableRow(v: unknown) { this.row = v; }
  @Input() set wuSelectableRowIndex(v: number) { this.index = v; }
  @Input() set pSelectableRowIndex(v: number) { this.index = v; }
  @Input() set wuSelectableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pSelectableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  row: unknown;
  index?: number;
  private off = false;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wu-selectable-row') get selectable(): boolean {
    return !this.off;
  }
  @HostBinding('class.p-selectable-row') get v1Selectable(): boolean {
    return !this.off && this.table.major === 1;
  }
  @HostBinding('class.p-datatable-selectable-row') get styledSelectable(): boolean {
    return !this.off && this.table.major > 1;
  }
  @HostBinding('class.wu-row-selected') get selected(): boolean {
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
    if (t && t !== this.el && t.closest('button, a, input, select, textarea, wu-select, wu-checkbox, wu-tableCheckbox, wu-tablecheckbox, [contenteditable]')) return;
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

const CHECK_SVG = '<svg class="wu-checkbox-icon p-checkbox-icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>';

/** A row's checkbox in `selectionMode="multiple"` tables: `<td><wu-tableCheckbox [value]="row" /></td>`. */
@Component({
  selector: 'wu-tableCheckbox, wu-tablecheckbox',
  standalone: true,
  template: `<label class="wu-checkbox" [class.wu-checkbox-checked]="checked" [class.wu-checkbox-disabled]="disabled">
    <input type="checkbox" class="wu-checkbox-input" [checked]="checked" [disabled]="disabled" [attr.aria-label]="ariaLabel || t.selectRow" (change)="toggle($event)" />
    <span class="wu-checkbox-control p-checkbox p-component" [class.p-checkbox-checked]="checked" aria-hidden="true">
      <span class="wu-checkbox-box p-checkbox-box" [class.p-highlight]="checked">${CHECK_SVG}</span>
    </span>
  </label>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-table-checkbox p-element' },
})
export class WuTableCheckbox extends TableChild {
  @Input() value: unknown;
  @Input() index?: number;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  @Input() ariaLabel?: string;
  private _disabled = false;
  private readonly config = inject(WuConfig);

  constructor() {
    super();
    inject(ɵWuStyleLoader).load('checkbox', ɵWU_CHECKBOX_CSS);
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

/** Select or clear every row (every row the search leaves): `<th><wu-tableHeaderCheckbox /></th>`. */
@Component({
  selector: 'wu-tableHeaderCheckbox, wu-tableheadercheckbox',
  standalone: true,
  template: `<label class="wu-checkbox" [class.wu-checkbox-checked]="checked" [class.wu-checkbox-disabled]="disabled">
    <input
      type="checkbox"
      class="wu-checkbox-input"
      [checked]="checked"
      [indeterminate]="mixed"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || t.selectAll"
      (change)="toggle($event)"
    />
    <span class="wu-checkbox-control p-checkbox p-component" [class.p-checkbox-checked]="checked" aria-hidden="true">
      <span class="wu-checkbox-box p-checkbox-box" [class.p-highlight]="checked" [class.wu-checkbox-mixed]="mixed">${CHECK_SVG}</span>
    </span>
  </label>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-table-checkbox p-element' },
})
export class WuTableHeaderCheckbox extends TableChild {
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || !this.table.hasRows; }
  @Input() ariaLabel?: string;
  private _disabled = false;
  private readonly config = inject(WuConfig);

  constructor() {
    super();
    inject(ɵWuStyleLoader).load('checkbox', ɵWU_CHECKBOX_CSS);
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

/**
 * Keeps a column in view while the table scrolls sideways: `<th wuFrozenColumn>` / `<td wuFrozenColumn>` (or the
 * `pFrozenColumn` attribute). `alignFrozen="right"` pins it to the right edge instead; `[frozen]="false"` lets it go.
 * Each frozen cell sits after the frozen cells before it in its row.
 */
@Directive({
  selector: '[wuFrozenColumn], [pFrozenColumn]',
  standalone: true,
})
export class WuFrozenColumn extends TableChild implements AfterViewInit {
  @Input() set frozen(v: unknown) {
    this._frozen = v === undefined || v === '' || ɵtoBool(v);
    this.schedule();
  }
  get frozen(): boolean {
    return this._frozen;
  }
  @Input() set alignFrozen(v: 'left' | 'right' | null | undefined) {
    this._align = v === 'right' ? 'right' : 'left';
    this.schedule();
  }
  private _frozen = true;
  private _align: 'left' | 'right' = 'left';
  private frame = 0;
  private resize: ResizeObserver | null = null;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly onChange: Subscription = this.table.changes.subscribe(() => this.schedule());

  @HostBinding('class.wu-frozen-column') get isFrozen(): boolean {
    return this._frozen;
  }
  @HostBinding('class.p-frozen-column') get v1Frozen(): boolean {
    return this._frozen;
  }
  @HostBinding('class.p-datatable-frozen-column') get styledFrozen(): boolean {
    return this._frozen && this.table.major > 1;
  }
  @HostBinding('class.wu-frozen-column-right') get right(): boolean {
    return this._frozen && this._align === 'right';
  }

  ngAfterViewInit(): void {
    this.schedule();
    const table = this.el.closest('table');
    const win = this.el.ownerDocument.defaultView as (Window & typeof globalThis) | null;
    if (table && win?.ResizeObserver) {
      this.resize = new win.ResizeObserver(() => this.schedule());
      this.resize.observe(table);
    }
  }

  override ngOnDestroy(): void {
    this.onChange.unsubscribe();
    this.resize?.disconnect();
    const win = this.el.ownerDocument.defaultView;
    if (this.frame && win) win.cancelAnimationFrame(this.frame);
    super.ngOnDestroy();
  }

  /** Offsets: the widths of the frozen cells before (or after, when right-aligned) this one in its row. */
  updateStickyPosition(): void {
    const style = this.el.style;
    if (!this._frozen) {
      style.left = '';
      style.right = '';
      return;
    }
    let offset = 0;
    if (this._align === 'right') {
      for (let n = this.el.nextElementSibling as HTMLElement | null; n; n = n.nextElementSibling as HTMLElement | null) {
        if (n.classList.contains('wu-frozen-column-right')) offset += n.offsetWidth;
      }
      style.left = '';
      style.right = `${offset}px`;
    } else {
      for (let n = this.el.previousElementSibling as HTMLElement | null; n; n = n.previousElementSibling as HTMLElement | null) {
        if (n.classList.contains('wu-frozen-column') && !n.classList.contains('wu-frozen-column-right')) offset += n.offsetWidth;
      }
      style.right = '';
      style.left = `${offset}px`;
    }
  }

  private schedule(): void {
    const win = this.el.ownerDocument?.defaultView;
    if (!win || this.frame) return;
    this.frame = win.requestAnimationFrame(() => {
      this.frame = 0;
      this.updateStickyPosition();
    });
  }
}

/**
 * Opens and closes a row's `rowexpansion` template: `<button type="button" [wuRowToggler]="row">` (or
 * `[pRowToggler]`). Sets `aria-expanded`; read `let-expanded="expanded"` in the body template to turn its icon.
 */
@Directive({
  selector: '[wuRowToggler], [pRowToggler]',
  standalone: true,
})
export class WuRowToggler extends TableChild {
  @Input() set wuRowToggler(v: unknown) { this.row = v; }
  @Input() set pRowToggler(v: unknown) { this.row = v; }
  @Input() set wuRowTogglerDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pRowTogglerDisabled(v: unknown) { this.off = ɵtoBool(v); }
  row: unknown;
  private off = false;

  @HostBinding('class.wu-row-toggler') readonly cls = true;
  @HostBinding('attr.aria-expanded') get expanded(): boolean {
    return this.table.isRowExpanded(this.row);
  }

  @HostListener('click', ['$event'])
  click(event: Event): void {
    if (this.off) return;
    event.preventDefault();
    this.table.toggleRowExpansion(this.row, event);
  }
}

/** The row a `groupheader` template draws: `<tr wuRowGroupHeader>` (or `pRowGroupHeader`). Stays under the header while a scrollable table scrolls. */
@Directive({
  selector: '[wuRowGroupHeader], [pRowGroupHeader]',
  standalone: true,
  host: { class: 'wu-rowgroup-header p-rowgroup-header' },
})
export class WuRowGroupHeader {}

const RADIO_DOT = '<span class="wu-radiobutton-dot p-radiobutton-icon"></span>';

/** A row's radio button in `selectionMode="single"` tables: `<td><wu-tableRadioButton [value]="row" /></td>`. */
@Component({
  selector: 'wu-tableRadioButton, wu-tableradiobutton',
  standalone: true,
  template: `<label class="wu-radiobutton" [class.wu-radiobutton-checked]="checked" [class.wu-radiobutton-disabled]="disabled">
    <input type="radio" class="wu-radiobutton-input" [checked]="checked" [disabled]="disabled" [attr.aria-label]="ariaLabel || t.selectRow" (change)="pick($event)" />
    <span class="wu-radiobutton-control p-radiobutton p-component" [class.p-radiobutton-checked]="checked" aria-hidden="true">
      <span class="wu-radiobutton-box p-radiobutton-box" [class.p-highlight]="checked">${RADIO_DOT}</span>
    </span>
  </label>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-table-radiobutton p-element' },
})
export class WuTableRadioButton extends TableChild {
  @Input() value: unknown;
  @Input() index?: number;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || !this.table.isRowSelectable(this.value, this.index); }
  @Input() ariaLabel?: string;
  private _disabled = false;
  private readonly config = inject(WuConfig);

  constructor() {
    super();
    inject(ɵWuStyleLoader).load('radiobutton', ɵWU_RADIOBUTTON_CSS);
  }
  get t() {
    return this.config.translation;
  }
  get checked(): boolean {
    return this.table.isSelected(this.value);
  }
  pick(event: Event): void {
    this.table.toggleRow(this.value, event, this.index, 'radio');
  }
}

/** Selects a row on double click: `<tr [wuSelectableRowDblClick]="row">` (or `pSelectableRowDblClick`). */
@Directive({
  selector: '[wuSelectableRowDblClick], [pSelectableRowDblClick]',
  standalone: true,
})
export class WuSelectableRowDblClick extends TableChild {
  @Input() set wuSelectableRowDblClick(v: unknown) { this.row = v; }
  @Input() set pSelectableRowDblClick(v: unknown) { this.row = v; }
  @Input() set wuSelectableRowIndex(v: number) { this.index = v; }
  @Input() set pSelectableRowIndex(v: number) { this.index = v; }
  row: unknown;
  index?: number;

  @HostBinding('class.wu-row-selected') get selected(): boolean {
    return this.table.isSelected(this.row);
  }
  @HostBinding('class.p-highlight') get v1Selected(): boolean {
    return this.selected && this.table.major === 1;
  }

  @HostListener('dblclick', ['$event'])
  dblclick(event: Event): void {
    this.table.toggleRow(this.row, event, this.index, 'row');
  }
}

/**
 * Opens the table's context menu on a right-click of this row: `<tr [wuContextMenuRow]="row">` (or `pContextMenuRow`)
 * with `<wu-table [contextMenu]="cm" [(contextMenuSelection)]="picked">`. The row gets an outline while it is the one.
 */
@Directive({
  selector: '[wuContextMenuRow], [pContextMenuRow]',
  standalone: true,
})
export class WuContextMenuRow extends TableChild {
  @Input() set wuContextMenuRow(v: unknown) { this.row = v; }
  @Input() set pContextMenuRow(v: unknown) { this.row = v; }
  @Input() set wuContextMenuRowIndex(v: number) { this.index = v; }
  @Input() set pContextMenuRowIndex(v: number) { this.index = v; }
  @Input() set wuContextMenuRowDisabled(v: unknown) { this.disabled = ɵtoBool(v); }
  @Input() set pContextMenuRowDisabled(v: unknown) { this.disabled = ɵtoBool(v); }
  row: unknown;
  index?: number;
  private disabled = false;

  @HostBinding('class.wu-row-contextmenu') get current(): boolean {
    return this.table.isContextMenuRow(this.row);
  }
  @HostBinding('class.p-highlight-contextmenu') get v1Current(): boolean {
    return this.current;
  }

  @HostListener('contextmenu', ['$event'])
  contextmenu(event: Event): void {
    if (!this.disabled) this.table.rowContextMenu(event, this.row, this.index);
  }
}

/**
 * A row that can be dragged to a new place: `<tr [wuReorderableRow]="i">` (or `pReorderableRow`), dragged by an element
 * inside it marked `wuReorderableRowHandle` (`pReorderableRowHandle`). The table changes `value` in place and emits
 * `(onRowReorder)`. The handle also answers ↑ / ↓ from the keyboard.
 */
@Directive({
  selector: '[wuReorderableRow], [pReorderableRow]',
  standalone: true,
})
export class WuReorderableRow {
  @Input() set wuReorderableRow(v: number) { this.index = Number(v); }
  @Input() set pReorderableRow(v: number) { this.index = Number(v); }
  @Input() set wuReorderableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pReorderableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  index = -1;
  off = false;

  @HostBinding('attr.data-wu-row-index') get dataIndex(): number | null {
    return this.off ? null : this.index;
  }
  @HostBinding('class.wu-reorderable-row') get reorderable(): boolean {
    return !this.off;
  }
}

/** The grip of a reorderable row. */
@Directive({
  selector: '[wuReorderableRowHandle], [pReorderableRowHandle]',
  standalone: true,
  host: { class: 'wu-reorderable-row-handle p-datatable-reorderable-row-handle', role: 'button', tabindex: '0' },
})
export class WuReorderableRowHandle {
  private readonly table = inject(ɵWU_TABLE);
  private readonly row = inject(WuReorderableRow, { optional: true });
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);

  @HostBinding('attr.aria-label') get label(): string {
    return `${this.config.translation.moveUp} / ${this.config.translation.moveDown}`;
  }

  private get rowEl(): HTMLElement | null {
    return this.el.closest('tr[data-wu-row-index]') as HTMLElement | null;
  }
  private get index(): number {
    return this.row ? this.row.index : Number(this.rowEl?.getAttribute('data-wu-row-index') ?? -1);
  }

  @HostListener('pointerdown', ['$event'])
  down(event: PointerEvent): void {
    const tr = this.rowEl;
    if (!tr || (this.row && this.row.off)) return;
    this.table.startRowDrag(tr, this.index, event);
  }

  @HostListener('keydown', ['$event'])
  key(event: KeyboardEvent): void {
    const i = this.index;
    if (i < 0 || (this.row && this.row.off)) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.table.reorderRows(i, i - 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.table.reorderRows(i, i + 2);
    } else return;
    // Keep the keyboard on the handle of the row that moved.
    const doc = this.el.ownerDocument;
    const target = event.key === 'ArrowUp' ? i - 1 : i + 1;
    setTimeout(() => (doc.querySelector(`tr[data-wu-row-index="${target}"] .wu-reorderable-row-handle`) as HTMLElement | null)?.focus());
  }
}

/**
 * A cell that edits on click: `<td [wuEditableColumn]="row" wuEditableColumnField="name">` (or `pEditableColumn` /
 * `pEditableColumnField`) holding a `wu-cellEditor`. Enter or a click elsewhere keeps the value, Escape drops it,
 * Tab keeps it and opens the next editable cell; Enter or F2 on a focused cell opens it.
 */
@Directive({
  selector: '[wuEditableColumn], [pEditableColumn]',
  standalone: true,
  host: { class: 'wu-editable-column p-editable-column', tabindex: '0' },
})
export class WuEditableColumn extends TableChild {
  @Input() set wuEditableColumn(v: unknown) { this.data = v; }
  @Input() set pEditableColumn(v: unknown) { this.data = v; }
  @Input() set wuEditableColumnField(v: string) { this.field = v; }
  @Input() set pEditableColumnField(v: string) { this.field = v; }
  @Input() set wuEditableColumnRowIndex(v: number) { this.index = v; }
  @Input() set pEditableColumnRowIndex(v: number) { this.index = v; }
  @Input() set wuEditableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pEditableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  data: unknown;
  field = '';
  index?: number;
  off = false;
  readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wu-cell-editing') get editing(): boolean {
    return this.table.isCellEditing(this.el);
  }
  @HostBinding('class.p-cell-editing') get v1Editing(): boolean {
    return this.editing;
  }

  @HostListener('click', ['$event'])
  click(event: Event): void {
    if (this.off || this.table.editMode !== 'cell' || this.editing) return;
    this.table.startCellEdit(this.el, this.data, this.field, this.index, event);
  }

  @HostListener('keydown', ['$event'])
  key(event: KeyboardEvent): void {
    if (this.off || this.table.editMode !== 'cell') return;
    if (!this.editing) {
      if ((event.key === 'Enter' || event.key === 'F2') && event.target === this.el) {
        event.preventDefault();
        this.table.startCellEdit(this.el, this.data, this.field, this.index, event);
      }
      return;
    }
    if (event.key === 'Enter' && !(event.target as HTMLElement).closest('textarea')) {
      event.preventDefault();
      this.table.completeCellEdit(event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.table.cancelCellEdit(event);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.table.completeCellEdit(event, event.shiftKey ? -1 : 1);
    }
  }
}

/** Marks the row a row editor works on: `<tr [wuEditableRow]="row">` (or `pEditableRow`). */
@Directive({
  selector: '[wuEditableRow], [pEditableRow]',
  standalone: true,
})
export class WuEditableRow extends TableChild {
  @Input() set wuEditableRow(v: unknown) { this.data = v; }
  @Input() set pEditableRow(v: unknown) { this.data = v; }
  @Input() set wuEditableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pEditableRowDisabled(v: unknown) { this.off = ɵtoBool(v); }
  data: unknown;
  off = false;
  readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wu-row-editing') get editing(): boolean {
    return this.table.isRowEditing(this.data);
  }
  @HostBinding('class.p-row-editing') get v1Editing(): boolean {
    return this.editing;
  }
}

/** Starts editing the row (`pInitEditableRow` on a button inside a `wuEditableRow`). */
@Directive({
  selector: '[wuInitEditableRow], [pInitEditableRow]',
  standalone: true,
})
export class WuInitEditableRow {
  private readonly table = inject(ɵWU_TABLE);
  private readonly row = inject(WuEditableRow);
  @HostListener('click', ['$event'])
  click(event: Event): void {
    event.preventDefault();
    if (!this.row.off) this.table.initRowEdit(this.row.data);
  }
}

/** Keeps the row's edits (`pSaveEditableRow`); stays in edit mode while a field is invalid. */
@Directive({
  selector: '[wuSaveEditableRow], [pSaveEditableRow]',
  standalone: true,
})
export class WuSaveEditableRow {
  private readonly table = inject(ɵWU_TABLE);
  private readonly row = inject(WuEditableRow);
  @HostListener('click', ['$event'])
  click(event: Event): void {
    event.preventDefault();
    this.table.saveRowEdit(this.row.data, this.row.el);
  }
}

/** Leaves row editing (`pCancelEditableRow`). */
@Directive({
  selector: '[wuCancelEditableRow], [pCancelEditableRow]',
  standalone: true,
})
export class WuCancelEditableRow {
  private readonly table = inject(ɵWU_TABLE);
  private readonly row = inject(WuEditableRow);
  @HostListener('click', ['$event'])
  click(event: Event): void {
    event.preventDefault();
    this.table.cancelRowEdit(this.row.data);
  }
}

/**
 * A header cell whose width can be dragged (`wuResizableColumn` / `pResizableColumn`) when the table has
 * `[resizableColumns]="true"`.
 */
@Directive({
  selector: '[wuResizableColumn], [pResizableColumn]',
  standalone: true,
})
export class WuResizableColumn extends TableChild implements AfterViewInit {
  @Input() set wuResizableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pResizableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  private off = false;
  private grip: HTMLSpanElement | null = null;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wu-resizable-column') get resizable(): boolean {
    return !this.off && this.table.resizableColumns;
  }
  @HostBinding('class.p-resizable-column') get v1Resizable(): boolean {
    return this.resizable;
  }

  ngAfterViewInit(): void {
    const grip = this.el.ownerDocument.createElement('span');
    grip.className = 'wu-column-resizer p-column-resizer';
    grip.setAttribute('aria-hidden', 'true');
    grip.addEventListener('pointerdown', (e) => {
      if (this.resizable) this.table.startColumnResize(this.el, e);
    });
    grip.addEventListener('click', (e) => e.stopPropagation());
    this.el.appendChild(grip);
    this.grip = grip;
  }

  override ngOnDestroy(): void {
    this.grip?.remove();
    super.ngOnDestroy();
  }
}

/**
 * A header cell that can be dragged to move its column (`wuReorderableColumn` / `pReorderableColumn`) when the table
 * has `[reorderableColumns]="true"`; the table moves the item in `columns`.
 */
@Directive({
  selector: '[wuReorderableColumn], [pReorderableColumn]',
  standalone: true,
})
export class WuReorderableColumn extends TableChild {
  @Input() set wuReorderableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  @Input() set pReorderableColumnDisabled(v: unknown) { this.off = ɵtoBool(v); }
  private off = false;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;

  @HostBinding('class.wu-reorderable-column') get reorderable(): boolean {
    return !this.off && this.table.reorderableColumns;
  }

  @HostListener('pointerdown', ['$event'])
  down(event: PointerEvent): void {
    if (!this.reorderable) return;
    const t = event.target as HTMLElement;
    if (t.closest('.wu-column-resizer, input, select, textarea, button, a, wu-columnfilter')) return;
    this.table.startColumnDrag(this.el, event);
  }
}
