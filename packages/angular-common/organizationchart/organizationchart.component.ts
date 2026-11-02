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
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import {
  orgChartIsLeaf,
  orgChartIsOpen,
  orgChartIsSelected,
  orgChartKey,
  orgChartToggleSelection,
  orgChartVisible,
  TreeNode,
  WuLocale,
} from 'wiraui/core';
import { WuOrganizationChartNodeEvent } from './organizationchart.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * A tree drawn from the top down, boxes joined by lines: `<wu-organizationChart [value]="chart" selectionMode="single"
 * [(selection)]="picked" [collapsible]="true">`. `value` holds the root node (TreeNode: `label`, `children`, `expanded`,
 * `type`, `styleClass`, `selectable`); a node's children show while it is `expanded`. Templates by node `type`
 * (`<ng-template wuTemplate="person" let-node>`, `default` for the rest) and `togglericon`. Keys: Tab reaches the chart,
 * ↓ opens a node or goes to its first child, ↑ closes it or goes to the parent, ← / → move along a row, Home / End,
 * Enter / Space pick. A chart wider than its place scrolls inside its own box.
 */
@Component({
  selector: 'wu-organizationChart, wu-organization-chart, wu-organizationchart',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './organizationchart.component.html',
  styleUrls: ['./organizationchart.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-organizationchart-host' },
})
export class WuOrganizationChart implements DoCheck, OnDestroy {
  /** The chart: the first node is the root. */
  @Input() value: TreeNode[] | null | undefined;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() selectionMode?: 'single' | 'multiple' | null;
  /** Two-way: `[(selection)]`. A node (single) or an array of nodes (multiple). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() selection: any;
  /** Nodes with children get a button that opens and closes them. */
  @Input() set collapsible(v: unknown) { this._collapsible = ɵtoBool(v); }
  get collapsible(): boolean { return this._collapsible; }
  /** Closed nodes keep the room their children take (default), so the chart does not jump; false folds it away. */
  @Input() set preserveSpace(v: unknown) { this._preserveSpace = v === undefined || v === null ? true : ɵtoBool(v); }
  get preserveSpace(): boolean { return this._preserveSpace; }
  /** Label of the chart. Default: the locale's "organization chart". */
  @Input() ariaLabel?: string | null;
  @Input() ariaLabelledBy?: string | null;

  /** Typed loosely, as before: `[(selection)]` binds to a node or an array field. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() readonly selectionChange = new EventEmitter<any>();
  @Output() readonly onNodeSelect = new EventEmitter<WuOrganizationChartNodeEvent>();
  @Output() readonly onNodeUnselect = new EventEmitter<WuOrganizationChartNodeEvent>();
  @Output() readonly onNodeExpand = new EventEmitter<WuOrganizationChartNodeEvent>();
  @Output() readonly onNodeCollapse = new EventEmitter<WuOrganizationChartNodeEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('togglericon', { descendants: false }) protected togglerIconRef?: unknown;

  readonly chartId = ɵuniqueId('wu-organizationchart');
  /** The box that takes Tab (one tab stop for the whole chart). */
  tabTarget: TreeNode | null = null;
  private focused: TreeNode | null = null;
  private ids = new WeakMap<TreeNode, string>();
  private nextId = 0;
  private _collapsible = false;
  private _preserveSpace = true;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  /** Apps open, close and relabel nodes in place, so the chart is checked every time its parent is. */
  ngDoCheck(): void {
    const visible = orgChartVisible(this.root);
    const has = (n: TreeNode | null) => !!n && visible.some((e) => e.node === n);
    const picked = visible.find((e) => this.isSelected(e.node));
    this.tabTarget = has(this.focused) ? this.focused : picked ? picked.node : visible[0]?.node ?? null;
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
  get root(): TreeNode | null {
    return this.value && this.value.length ? this.value[0] : null;
  }
  get togglerIconTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.togglerIconRef) || this.templates?.find((t) => t.name === 'togglericon')?.template || null;
  }
  get chartLabel(): string | null {
    return this.ariaLabelledBy ? null : this.ariaLabel || this.t.organizationChart;
  }
  /** The template for a node: by its `type`, else `default`; none draws the label. */
  templateFor(node: TreeNode): TemplateRef<unknown> | null {
    const list = this.templates?.filter((t) => t.name !== 'togglericon') || [];
    if (!list.length) return null;
    const want = node.type ? node.type : 'default';
    return list.find((t) => t.name === want)?.template || null;
  }
  idOf(node: TreeNode): string {
    let id = this.ids.get(node);
    if (!id) {
      id = `${this.chartId}-node-${++this.nextId}`;
      this.ids.set(node, id);
    }
    return id;
  }
  isLeaf(node: TreeNode): boolean {
    return orgChartIsLeaf(node);
  }
  isOpen(node: TreeNode): boolean {
    return orgChartIsOpen(node);
  }
  hasChildren(node: TreeNode): boolean {
    return !!(node.children && node.children.length);
  }
  isSelected(node: TreeNode): boolean {
    return orgChartIsSelected(this.selection, node, this.selectionMode);
  }
  isSelectable(node: TreeNode): boolean {
    return !!this.selectionMode && node.selectable !== false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeStyle(node: TreeNode): Record<string, any> | null {
    return node.style && typeof node.style === 'object' ? node.style : null;
  }

  // ---------- events ----------

  onNodeClick(event: Event, node: TreeNode): void {
    this.focused = node;
    const r = orgChartToggleSelection(this.selection, node, this.selectionMode);
    if (!r) return;
    this.selection = r.selection;
    this.selectionChange.emit(r.selection);
    (r.selected ? this.onNodeSelect : this.onNodeUnselect).emit({ originalEvent: event, node });
    this.cdr.markForCheck();
  }

  toggleNode(event: Event, node: TreeNode): void {
    event.preventDefault();
    event.stopPropagation();
    node.expanded = !node.expanded;
    (node.expanded ? this.onNodeExpand : this.onNodeCollapse).emit({ originalEvent: event, node });
    this.cdr.markForCheck();
  }

  focusin(node: TreeNode): void {
    this.focused = node;
  }

  keydown(event: KeyboardEvent, node: TreeNode): void {
    // Keys pressed inside a box's own content, or bubbling up from a child box, are not this box's.
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.isSelectable(node)) this.onNodeClick(event, node);
      else if (event.key === 'Enter' && this._collapsible && !this.isLeaf(node)) this.toggleNode(event, node);
      return;
    }
    const move = orgChartKey(event.key, node, this.root, this._collapsible);
    if (!move) return;
    event.preventDefault();
    if ('focus' in move) this.focusNode(move.focus);
    else if ('expand' in move && !move.expand.expanded) this.toggleNode(event, move.expand);
    else if ('collapse' in move && move.collapse.expanded) this.toggleNode(event, move.collapse);
  }

  // ---------- internals ----------

  private focusNode(node: TreeNode): void {
    this.focused = node;
    this.tabTarget = node;
    this.cdr.markForCheck();
    const label = this.host.ownerDocument.getElementById(this.idOf(node));
    (label?.closest('.wu-organizationchart-branch') as HTMLElement | null)?.focus();
  }
}
