import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ɵtoBool } from '@wirabyte/ui/config';
import type { FlowHandleType, FlowPosition } from '@wirabyte/ui/core';
import { ɵWuFlowHost } from './flow-host';
import { WU_FLOW_NODE } from './flow.types';

const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : ɵtoBool(v));

/**
 * A place on a node where edges attach: `<wu-flow-handle type="source" position="right" id="out">` inside a node
 * template. Drag from it to connect (or click it, then another handle). Several per node are fine: give each an `id`
 * and name it in the edge (`sourceHandle` / `targetHandle`); move one along its side with a style
 * (`[style.left.%]="25"`). It shows as a dot; put content inside for a custom look.
 */
@Component({
  selector: 'wu-flow-handle',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-flow-handle nodrag',
    '[class.wu-flow-handle-top]': "side === 'top'",
    '[class.wu-flow-handle-right]': "side === 'right'",
    '[class.wu-flow-handle-bottom]': "side === 'bottom'",
    '[class.wu-flow-handle-left]': "side === 'left'",
    '[class.wu-flow-handle-source]': "type !== 'target'",
    '[class.wu-flow-handle-target]': "type === 'target'",
    '[class.wu-flow-handle-connectable]': 'isConnectable',
    '[class]': 'styleClass || ""',
    // The id is the handle's name inside its node, not a page-wide element id (every node of a type has the same one).
    '[attr.id]': 'null',
    '[attr.data-handleid]': 'handleName',
    '[attr.data-handletype]': "type === 'target' ? 'target' : 'source'",
    '[attr.data-handlepos]': 'side',
    '[attr.data-connectable]': 'isConnectable',
    '[attr.data-connectable-start]': 'isConnectableStart',
    '[attr.data-connectable-end]': 'isConnectableEnd',
    '[attr.data-limit]': 'limitValue',
    'aria-hidden': 'true',
  },
})
export class WuFlowHandle implements OnChanges, AfterViewInit, OnDestroy {
  /** `source` (edges start here, the default) or `target` (edges end here). */
  @Input() type: FlowHandleType = 'source';
  /** Side of the node. Default: top for a target, bottom for a source. */
  @Input() position: FlowPosition | null | undefined;
  /** The handle's name within its node (edges refer to it as `sourceHandle` / `targetHandle`). */
  @Input() id: string | null | undefined;
  /** The same as `id`. */
  @Input() handleId: string | null | undefined;
  /** Connections may start or end here. Default true. */
  @Input() set isConnectable(v: unknown) {
    this._connectable = bool(v, true);
  }
  get isConnectable(): boolean {
    return this._connectable;
  }
  /** A drag may start here. Default true. */
  @Input() set isConnectableStart(v: unknown) {
    this._start = bool(v, true);
  }
  get isConnectableStart(): boolean {
    return this._start;
  }
  /** A drag may end here. Default true. */
  @Input() set isConnectableEnd(v: unknown) {
    this._end = bool(v, true);
  }
  get isConnectableEnd(): boolean {
    return this._end;
  }
  /** Most edges this handle takes (0 / null = no limit). */
  @Input() connectionLimit: number | string | null | undefined;
  @Input() styleClass?: string | null;

  private _connectable = true;
  private _start = true;
  private _end = true;
  private viewInit = false;
  private nodeId: string | null = null;
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly host = inject(ɵWuFlowHost, { optional: true });
  private readonly nodeCtx = inject(WU_FLOW_NODE, { optional: true });

  get side(): FlowPosition {
    const p = this.position;
    return p === 'top' || p === 'right' || p === 'bottom' || p === 'left' ? p : this.type === 'target' ? 'top' : 'bottom';
  }
  get handleName(): string | null {
    const v = this.handleId ?? this.id;
    return v === undefined || v === null || v === '' ? null : String(v);
  }
  get limitValue(): number | null {
    const n = Number(this.connectionLimit);
    return isFinite(n) && n > 0 ? Math.floor(n) : null;
  }

  ngOnChanges(): void {
    if (this.viewInit) this.notify();
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    this.notify();
  }

  ngOnDestroy(): void {
    if (this.nodeId) this.host?.ɵhandlesChanged(this.nodeId);
  }

  private notify(): void {
    const id = this.nodeCtx?.id ?? this.el.closest?.('.wu-flow-node')?.getAttribute('data-id') ?? null;
    if (id) {
      this.nodeId = id;
      this.host?.ɵhandlesChanged(id);
    }
  }
}
