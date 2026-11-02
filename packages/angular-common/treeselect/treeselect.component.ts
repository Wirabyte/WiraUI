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
  ɵWuPopup,
  ɵWuStyleLoader,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { ɵWU_SELECT_CSS } from 'wiraui/select';
import { ɵWU_MULTISELECT_CSS } from 'wiraui/multiselect';
import { WuTree, WuTreeFilterEvent, WuTreeNodeEvent } from 'wiraui/tree';
import { sameNode, treeParents, TreeFilterMode, TreeNode, WuLocale } from 'wiraui/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A field that opens a tree to pick from: `<wu-treeSelect [options]="nodes" [(ngModel)]="node" placeholder="เลือก">`.
 * One node by default; `selectionMode="multiple"` or `"checkbox"` picks several (shown as text or chips,
 * `display="chip"`). It can search (`[filter]="true"`) and be cleared (`[showClear]="true"`); opening it shows the
 * picked nodes with their parents open.
 */
@Component({
  selector: 'wu-treeselect, wu-treeSelect, wu-tree-select',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, WuTree],
  templateUrl: './treeselect.component.html',
  styleUrls: ['./treeselect.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuTreeSelect), multi: true }],
})
export class WuTreeSelect implements ControlValueAccessor, OnDestroy {
  @Input() options: TreeNode[] | null | undefined;
  @Input() selectionMode: 'single' | 'multiple' | 'checkbox' = 'single';
  @Input() placeholder?: string;
  @Input() set filter(v: unknown) { this._filter = ɵtoBool(v); }
  get filter(): boolean { return this._filter; }
  @Input() filterBy = 'label';
  @Input() filterMode: TreeFilterMode = 'lenient';
  @Input() filterPlaceholder?: string;
  /** Clear the search when the panel closes. Default true. */
  @Input() set resetFilterOnHide(v: unknown) { this._resetFilter = v === undefined || ɵtoBool(v); }
  @Input() set showClear(v: unknown) { this._showClear = ɵtoBool(v); }
  get showClear(): boolean { return this._showClear; }
  /** How several picks show: `'comma'` (text) or `'chip'`. */
  @Input() display: 'comma' | 'chip' = 'comma';
  @Input() set metaKeySelection(v: unknown) { this._meta = ɵtoBool(v); }
  get metaKeySelection(): boolean { return this._meta; }
  @Input() set propagateSelectionUp(v: unknown) { this._up = v === undefined || ɵtoBool(v); }
  get propagateSelectionUp(): boolean { return this._up; }
  @Input() set propagateSelectionDown(v: unknown) { this._down = v === undefined || ɵtoBool(v); }
  get propagateSelectionDown(): boolean { return this._down; }
  @Input() dataKey?: string;
  @Input() emptyMessage?: string;
  @Input() emptyFilterMessage?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  /** Height of the tree before it scrolls. Default 400px. */
  @Input() scrollHeight = '400px';
  @Input() variant?: 'outlined' | 'filled' | null;
  @Input() size?: 'small' | 'large' | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() containerStyleClass?: string;
  @Input() labelStyleClass?: string;
  @Input() panelClass?: string;
  @Input() panelStyleClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() panelStyle?: Record<string, any> | null;
  @Input() inputId?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex: number | string = 0;
  /** Accepted for templates moving over: the panel opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() fluid: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;
  @Input() virtualScroll: unknown;
  @Input() filterLocale: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();
  @Output() readonly onClear = new EventEmitter<void>();
  @Output() readonly onFilter = new EventEmitter<WuTreeFilterEvent>();
  @Output() readonly onNodeSelect = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeUnselect = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeExpand = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeCollapse = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('value', { descendants: false }) protected valueRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ViewChild('root') protected rootRef?: ElementRef<HTMLElement>;
  @ViewChild('focusInput') protected focusRef?: ElementRef<HTMLInputElement>;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;
  @ViewChild(WuTree) protected tree?: WuTree;

  readonly baseId = ɵuniqueId('wu-treeselect');
  open = false;
  focused = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any = null;
  private _filter = false;
  private _resetFilter = true;
  private _showClear = false;
  private _meta = false;
  private _up = true;
  private _down = true;
  private _disabled = false;
  private _loading = false;
  private formDisabled = false;
  private popup: ɵWuPopup | null = null;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    // The field and panel are drawn by wu-select's stylesheet, the chips by wu-multiSelect's.
    styles.load('select', ɵWU_SELECT_CSS);
    styles.load('multiselect', ɵWU_MULTISELECT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.popup?.close();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get valueTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.valueRef) || ɵfindTemplate(this.templates, 'value');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get single(): boolean {
    return this.selectionMode !== 'multiple' && this.selectionMode !== 'checkbox';
  }
  /** The picked nodes, in tree order for several. */
  get picked(): TreeNode[] {
    if (this.single) return this.value ? [this.value] : [];
    return Array.isArray(this.value) ? this.value : [];
  }
  get filled(): boolean {
    return this.picked.length > 0;
  }
  get labelText(): string {
    return this.picked.map((n) => n?.label ?? '').filter(Boolean).join(', ');
  }
  get chips(): boolean {
    return !this.single && this.display === 'chip' && this.filled;
  }
  get clearable(): boolean {
    return this._showClear && this.filled && !this.disabled;
  }
  get sizeKey(): string {
    return this.size === 'small' ? 'sm' : this.size === 'large' ? 'lg' : '';
  }
  get treeId(): string {
    return `${this.baseId}-tree`;
  }

  // ---------- open / close ----------

  toggle(event?: Event): void {
    if (this.open) this.hide(true);
    else this.show(event);
  }

  show(event?: Event): void {
    if (this.open || this.disabled || this._loading) return;
    this.expandToPicked();
    this.open = true;
    this.cdr.detectChanges();
    const anchor = this.rootRef?.nativeElement;
    const panel = this.panelRef?.nativeElement;
    if (anchor && panel) {
      this.popup = new ɵWuPopup(anchor, panel, {
        sheet: false,
        sheetClass: 'wu-select-sheet',
        modalClass: 'wu-select-modal',
        onOutside: () => this.hide(),
        onEscape: () => this.hide(true),
        onPosition: (_, box) => (panel.style.minWidth = `${Math.round(box.width)}px`),
      });
      this.popup.open();
      // Into the tree: the search box, else the picked (or first) node.
      const target = (panel.querySelector('.wu-tree-filter-container input') || panel.querySelector('[role="treeitem"][tabindex="0"]')) as HTMLElement | null;
      if (target && event?.type !== 'mousedown') target.focus({ preventScroll: true });
      const row = panel.querySelector('[role="treeitem"][tabindex="0"]') as HTMLElement | null;
      row?.scrollIntoView({ block: 'nearest' });
    }
    this.onShow.emit();
  }

  /** `refocus`: put focus back on the field. */
  hide(refocus = false): void {
    if (!this.open) return;
    this.popup?.close();
    this.popup = null;
    if (this._resetFilter) this.tree?.resetFilter();
    this.open = false;
    this.cdr.markForCheck();
    if (refocus) this.focusField();
    this.onTouched();
    this.onHide.emit();
  }

  // ---------- field ----------

  fieldMousedown(event: MouseEvent): void {
    event.preventDefault();
  }

  fieldClick(event: MouseEvent): void {
    if (this.disabled) return;
    if (event.target === this.focusRef?.nativeElement) return;
    this.focusField();
    this.toggle(event);
  }

  fieldKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open) this.show(event);
      else (this.panelRef?.nativeElement.querySelector('[role="treeitem"][tabindex="0"]') as HTMLElement | null)?.focus();
    } else if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.hide(true);
    } else if (event.key === 'Tab' && this.open) {
      this.hide();
    }
  }

  /** Keys in the panel: Tab leaves and closes it. */
  panelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.hide(true);
    }
  }

  fieldFocus(event: FocusEvent): void {
    this.focused = true;
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  fieldBlur(event: FocusEvent): void {
    this.focused = false;
    if (!this.open) this.onTouched();
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.commit(this.single ? null : []);
    this.onClear.emit();
    this.focusField();
  }

  removeChip(node: TreeNode, event: Event): void {
    event.stopPropagation();
    this.commit(this.picked.filter((n) => !sameNode(n, node, this.dataKey)));
  }

  focusField(): void {
    this.focusRef?.nativeElement.focus({ preventScroll: true });
  }

  // ---------- the tree ----------

  treeSelectionChange(value: TreeNode | TreeNode[] | null): void {
    this.commit(value);
    if (this.single && value) this.hide(true);
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    this.value = this.single ? v ?? null : Array.isArray(v) ? v : [];
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
    if (disabled) this.hide();
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private commit(value: unknown): void {
    this.value = value;
    this.onModel(value);
    this.cdr.markForCheck();
  }

  /** Opens the parents of the picked nodes, so they are in view. */
  private expandToPicked(): void {
    const picked = this.picked;
    if (!picked.length || !this.options) return;
    const parents = treeParents(this.options);
    for (const [node] of parents) {
      if (!picked.some((p) => sameNode(p, node, this.dataKey))) continue;
      let p = parents.get(node) ?? null;
      while (p) {
        p.expanded = true;
        p = parents.get(p) ?? null;
      }
    }
  }
}
