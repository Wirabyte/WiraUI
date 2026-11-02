import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
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
} from 'wiraui/config';
import { ɵWU_CHECKBOX_CSS } from 'wiraui/checkbox';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';
import { ɵWU_SELECT_CSS } from 'wiraui/select';
import { filterTree, sameNode, toggleTreeCheck, TreeCheckState, treeCheckStates, TreeFilterMode, TreeNode, WuLocale } from 'wiraui/core';

/** `(onNodeSelect)`, `(onNodeExpand)` and the like: the node and the event behind it. */
export interface WuTreeNodeEvent {
  originalEvent: Event;
  node: TreeNode;
}
export interface WuTreeFilterEvent {
  filter: string;
  filteredValue: TreeNode[];
}
/** One drawn row: a node at its depth. */
export interface WuTreeRow {
  node: TreeNode;
  key: string;
  level: number;
  pos: number;
  size: number;
  parent: TreeNode | null;
}

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A tree of nodes that open and close: `<wu-tree [value]="nodes" selectionMode="checkbox" [(selection)]="picked">`.
 * Nodes are TreeNode objects (`label`, `children`, `expanded`, `icon`, `leaf`, `selectable`, `type`). It can pick
 * one node, several, or tick boxes that spread to children and parents; search (`[filter]="true"`); load children
 * when a node opens (`leaf: false` + `(onNodeExpand)`). Keyboard: arrows move and open/close, Enter / Space pick.
 */
@Component({
  selector: 'wu-tree',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTree implements DoCheck, OnDestroy {
  @Input() value: TreeNode[] | null | undefined;
  @Input() selectionMode?: 'single' | 'multiple' | 'checkbox' | null;
  /** Two-way: `[(selection)]`. A node (single) or an array of nodes. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() selection: any;
  /** Ticking a box ticks its children. Default true. */
  @Input() set propagateSelectionDown(v: unknown) { this._down = v === undefined || ɵtoBool(v); }
  /** A parent is ticked when all its children are. Default true. */
  @Input() set propagateSelectionUp(v: unknown) { this._up = v === undefined || ɵtoBool(v); }
  /** `true`: a plain click picks only that node in a multiple tree (Ctrl / ⌘ + click adds). Default false. */
  @Input() set metaKeySelection(v: unknown) { this._meta = ɵtoBool(v); }
  /** Compare nodes by this field (`'key'`) instead of by object. */
  @Input() dataKey?: string;
  @Input() set filter(v: unknown) { this._filter = ɵtoBool(v); }
  get filter(): boolean { return this._filter; }
  /** Fields to search, comma separated. Default `'label'`. */
  @Input() filterBy = 'label';
  @Input() filterMode: TreeFilterMode = 'lenient';
  @Input() filterPlaceholder?: string;
  @Input() emptyMessage?: string;
  /** Shown when a search finds nothing. Default: the locale's no-results text. */
  @Input() emptyFilterMessage?: string;
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  /** Height before the tree scrolls. */
  @Input() scrollHeight?: string;
  /** A wu-contextMenu to open on right-click. */
  @Input() contextMenu?: { show(event: Event): void } | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() togglerAriaLabel?: string;
  /** Accepted for templates moving over. */
  @Input() layout: unknown;
  @Input() lazy: unknown;
  @Input() virtualScroll: unknown;
  @Input() virtualScrollItemSize: unknown;
  @Input() draggableNodes: unknown;
  @Input() droppableNodes: unknown;
  @Input() validateDrop: unknown;
  @Input() filterLocale: unknown;
  @Input() trackBy: unknown;
  @Input() indentation: unknown;

  /** Typed loosely, as before: `[(selection)]` binds to a node or an array field. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly selectionChange = new EventEmitter<any>();
  @Output() readonly onNodeSelect = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeUnselect = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeExpand = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeCollapse = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeDoubleClick = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onNodeContextMenuSelect = new EventEmitter<WuTreeNodeEvent>();
  @Output() readonly onFilter = new EventEmitter<WuTreeFilterEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) protected footerRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('togglericon', { descendants: false }) protected togglerIconRef?: unknown;

  readonly treeId = ɵuniqueId('wu-tree');
  rows: WuTreeRow[] = [];
  query = '';
  focusedKey: string | null = null;
  private _down = true;
  private _up = true;
  private _meta = false;
  private _filter = false;
  private _loading = false;
  private filterSet: Set<TreeNode> | null = null;
  /** Nodes closed by hand while searching (searching opens everything that has matches). */
  private filterClosed = new Set<TreeNode>();
  private checks = new Map<TreeNode, TreeCheckState>();
  private lastSelection: unknown = undefined;
  private lastValue: unknown = undefined;
  private signature = '';
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    // The search box is drawn by wu-select's stylesheet, the check boxes by wu-checkbox's.
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    styles.load('select', ɵWU_SELECT_CSS);
    styles.load('checkbox', ɵWU_CHECKBOX_CSS);
  }

  /** Nodes are changed in place by apps (`expanded`, lazy `children`), so the rows are rebuilt on every check. */
  ngDoCheck(): void {
    if (this.selection !== this.lastSelection || this.value !== this.lastValue) {
      this.lastSelection = this.selection;
      this.lastValue = this.value;
      this.recheck();
    }
    this.rebuild();
    // Labels and icons may have changed on the nodes too.
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get checkbox(): boolean {
    return this.selectionMode === 'checkbox';
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
  get togglerIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.togglerIconRef) || ɵfindTemplate(this.templates, 'togglericon');
  }
  get emptyText(): string {
    return this.query ? this.emptyFilterMessage || this.t.emptyFilterMessage : this.emptyMessage || this.t.emptyMessage;
  }
  nodeTemplate(node: TreeNode): TemplateRef<unknown> | null {
    return ɵfindTemplate(this.templates, node.type || 'default') || ɵfindTemplate(this.templates, 'default');
  }
  rowId(row: WuTreeRow): string {
    return `${this.treeId}-${row.key}`;
  }
  trackRow(_: number, row: WuTreeRow): string {
    return row.key;
  }
  hasChildren(node: TreeNode): boolean {
    return !!node.children?.length || node.leaf === false;
  }
  isLeaf(node: TreeNode): boolean {
    return !this.hasChildren(node);
  }
  isOpen(node: TreeNode): boolean {
    return this.filterSet ? !this.filterClosed.has(node) : !!node.expanded;
  }
  iconOf(node: TreeNode): string | null {
    if (this.hasChildren(node) && (node.expandedIcon || node.collapsedIcon)) return (this.isOpen(node) ? node.expandedIcon : node.collapsedIcon) || node.icon || null;
    return node.icon || null;
  }
  selectable(node: TreeNode): boolean {
    return !!this.selectionMode && node.selectable !== false;
  }
  isSelected(node: TreeNode): boolean {
    if (this.checkbox) return this.checks.get(node) === 'checked';
    if (this.selectionMode === 'single') return sameNode(this.selection, node, this.dataKey);
    if (this.selectionMode === 'multiple') return Array.isArray(this.selection) && this.selection.some((s: TreeNode) => sameNode(s, node, this.dataKey));
    return false;
  }
  isPartial(node: TreeNode): boolean {
    return this.checks.get(node) === 'partial';
  }
  /** Roving tab stop: the focused row, else the first picked row, else the first row. */
  get tabKey(): string | null {
    if (this.focusedKey && this.rows.some((r) => r.key === this.focusedKey)) return this.focusedKey;
    return this.firstSelectedKey() ?? this.rows[0]?.key ?? null;
  }

  // ---------- pointer ----------

  toggle(event: Event, row: WuTreeRow): void {
    event.stopPropagation();
    const node = row.node;
    if (this.isLeaf(node)) return;
    const open = !this.isOpen(node);
    if (this.filterSet) {
      if (open) this.filterClosed.delete(node);
      else this.filterClosed.add(node);
    } else {
      node.expanded = open;
    }
    (open ? this.onNodeExpand : this.onNodeCollapse).emit({ originalEvent: event, node });
    this.focusedKey = row.key;
    this.rebuild();
    this.cdr.markForCheck();
  }

  nodeClick(event: MouseEvent | KeyboardEvent, row: WuTreeRow): void {
    this.focusedKey = row.key;
    const node = row.node;
    if (!this.selectable(node)) {
      this.cdr.markForCheck();
      return;
    }
    const meta = event.metaKey || event.ctrlKey;
    const selected = this.isSelected(node);
    if (this.checkbox) {
      const next = toggleTreeCheck(this.value, Array.isArray(this.selection) ? this.selection : [], node, !selected, { up: this._up, down: this._down, dataKey: this.dataKey });
      this.commit(next);
      (selected ? this.onNodeUnselect : this.onNodeSelect).emit({ originalEvent: event, node });
    } else if (this.selectionMode === 'single') {
      if (selected) {
        if (meta) {
          this.commit(null);
          this.onNodeUnselect.emit({ originalEvent: event, node });
        }
      } else {
        this.commit(node);
        this.onNodeSelect.emit({ originalEvent: event, node });
      }
    } else {
      const current: TreeNode[] = Array.isArray(this.selection) ? this.selection : [];
      if (this._meta && !meta) {
        this.commit([node]);
        this.onNodeSelect.emit({ originalEvent: event, node });
      } else if (selected) {
        this.commit(current.filter((s) => !sameNode(s, node, this.dataKey)));
        this.onNodeUnselect.emit({ originalEvent: event, node });
      } else {
        this.commit([...current, node]);
        this.onNodeSelect.emit({ originalEvent: event, node });
      }
    }
  }

  nodeDblClick(event: MouseEvent, row: WuTreeRow): void {
    this.onNodeDoubleClick.emit({ originalEvent: event, node: row.node });
  }

  nodeContextMenu(event: MouseEvent, row: WuTreeRow): void {
    if (!this.contextMenu) return;
    event.preventDefault();
    this.focusedKey = row.key;
    this.onNodeContextMenuSelect.emit({ originalEvent: event, node: row.node });
    this.contextMenu.show(event);
  }

  // ---------- search ----------

  search(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.filterClosed.clear();
    this.rebuild();
    this.onFilter.emit({ filter: this.query, filteredValue: this.filterSet ? this.rows.filter((r) => r.level === 0).map((r) => r.node) : this.value || [] });
    this.cdr.markForCheck();
  }

  /** Clears the search box. */
  resetFilter(): void {
    this.query = '';
    this.filterClosed.clear();
    this.rebuild();
    this.cdr.markForCheck();
  }

  // ---------- keyboard ----------

  focusIn(event: FocusEvent): void {
    const key = (event.target as HTMLElement).getAttribute?.('data-wu-key');
    if (key) this.focusedKey = key;
  }

  keydown(event: KeyboardEvent): void {
    const el = event.target as HTMLElement;
    const key = el.getAttribute('data-wu-key');
    if (!key) return;
    const i = this.rows.findIndex((r) => r.key === key);
    const row = this.rows[i];
    if (!row) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusRow(this.rows[i + 1]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusRow(this.rows[i - 1]);
        break;
      case 'Home':
        event.preventDefault();
        this.focusRow(this.rows[0]);
        break;
      case 'End':
        event.preventDefault();
        this.focusRow(this.rows[this.rows.length - 1]);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.isLeaf(row.node)) break;
        if (!this.isOpen(row.node)) this.toggle(event, row);
        else this.focusRow(this.rows[i + 1]?.level > row.level ? this.rows[i + 1] : undefined);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (!this.isLeaf(row.node) && this.isOpen(row.node)) this.toggle(event, row);
        else if (row.parent) this.focusRow(this.rows.slice(0, i).reverse().find((r) => r.level === row.level - 1));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.nodeClick(event, row);
        break;
    }
  }

  // ---------- internals ----------

  private focusRow(row: WuTreeRow | undefined): void {
    if (!row) return;
    this.focusedKey = row.key;
    this.cdr.detectChanges();
    (this.host.ownerDocument.getElementById(this.rowId(row)) as HTMLElement | null)?.focus();
  }

  private firstSelectedKey(): string | null {
    const r = this.rows.find((x) => this.isSelected(x.node));
    return r ? r.key : null;
  }

  private commit(value: TreeNode | TreeNode[] | null): void {
    this.selection = value;
    this.lastSelection = value;
    this.recheck();
    this.selectionChange.emit(value);
    this.cdr.markForCheck();
  }

  private recheck(): void {
    this.checks = this.checkbox ? treeCheckStates(this.value, Array.isArray(this.selection) ? this.selection : [], this.dataKey) : new Map();
    // Older apps read `partialSelected` off the nodes.
    if (this.checkbox) {
      const visit = (nodes: TreeNode[] | undefined) => {
        for (const n of nodes || []) {
          if (!n) continue;
          const partial = this.checks.get(n) === 'partial';
          if (n.partialSelected !== partial && (partial || n.partialSelected !== undefined)) n.partialSelected = partial;
          visit(n.children);
        }
      };
      visit(this.value || undefined);
    }
  }

  private rebuild(): void {
    this.filterSet = this._filter && this.query ? filterTree(this.value, this.query, this.filterBy, this.filterMode) : null;
    const out: WuTreeRow[] = [];
    const visit = (nodes: TreeNode[] | undefined, level: number, parent: TreeNode | null, prefix: string) => {
      const list = (nodes || []).filter((n) => n && (!this.filterSet || this.filterSet.has(n)));
      list.forEach((node, idx) => {
        const key = prefix ? `${prefix}_${idx}` : String(idx);
        out.push({ node, key, level, pos: idx + 1, size: list.length, parent });
        if (node.children?.length && this.isOpen(node)) visit(node.children, level + 1, node, key);
      });
    };
    visit(this.value || undefined, 0, null, '');
    const sig = out.map((r) => r.key + (r.node.loading ? '*' : '')).join('|');
    const sameRows = sig === this.signature && out.every((r, i) => this.rows[i]?.node === r.node);
    if (!sameRows) {
      this.signature = sig;
      this.rows = out;
      this.cdr.markForCheck();
    }
  }
}
