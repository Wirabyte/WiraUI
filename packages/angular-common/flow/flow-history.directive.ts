import { AfterViewInit, ChangeDetectorRef, Directive, EventEmitter, inject, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ɵtoBool } from '@wirabyte/ui/config';
import { FlowHistory, flowHistoryKey, isTypingTarget } from '@wirabyte/ui/core';
import { WuFlow } from './flow.component';

/** `(historyChange)`: what undo / redo can do now. */
export interface WuFlowHistoryState {
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Undo / redo for a flow: `<wu-flow wuFlowHistory #history="wuFlowHistory" …>`. Every finished change (a drag that
 * ended, a connection, a delete, a resize, the API) is a step; selecting and measuring are not. Ctrl / ⌘ + Z undoes,
 * Ctrl / ⌘ + Shift + Z and Ctrl + Y redo while the flow has focus; `history.undo()` / `history.redo()` for buttons
 * (`[disabled]="!history.canUndo"`). Undoing hands the earlier arrays to `[(nodes)]` / `[(edges)]` like any change.
 */
@Directive({
  selector: 'wu-flow[wuFlowHistory]',
  standalone: true,
  exportAs: 'wuFlowHistory',
})
export class WuFlowHistory implements OnInit, AfterViewInit, OnDestroy {
  /** Steps kept. Default 100. */
  @Input() historyLimit = 100;
  /** Ctrl / ⌘ + Z and friends. Default true. */
  @Input() set historyKeyboard(v: unknown) {
    this._keys = v === undefined || v === null ? true : ɵtoBool(v);
  }
  get historyKeyboard(): boolean {
    return this._keys;
  }

  @Output() readonly historyChange = new EventEmitter<WuFlowHistoryState>();

  private _keys = true;
  private history = new FlowHistory();
  private stops: (() => void)[] = [];
  private restoring = false;
  private readonly flow = inject(WuFlow);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  get canUndo(): boolean {
    return this.history.canUndo;
  }
  get canRedo(): boolean {
    return this.history.canRedo;
  }

  ngOnInit(): void {
    this.history = new FlowHistory({ limit: Number(this.historyLimit) || 100 });
    this.history.reset(this.flow.getNodes(), this.flow.getEdges());
    this.stops.push(
      this.flow.ɵonCommit((external) => {
        if (this.restoring) return;
        const nodes = this.flow.getNodes();
        const edges = this.flow.getEdges();
        // The first data the app loads is the starting point, not a step to undo.
        const blank = !this.history.canUndo && !this.history.canRedo && (!this.history.current || (!this.history.current.nodes.length && !this.history.current.edges.length));
        if (external && blank) this.history.reset(nodes, edges);
        else if (this.history.push(nodes, edges)) this.changed();
      })
    );
  }

  ngAfterViewInit(): void {
    const root = this.flow.ɵrootElement();
    if (!root) return;
    const key = (e: KeyboardEvent) => {
      if (!this._keys || isTypingTarget(e.target)) return;
      const what = flowHistoryKey(e);
      if (!what) return;
      e.preventDefault();
      this.zone.run(() => (what === 'undo' ? this.undo() : this.redo()));
    };
    this.zone.runOutsideAngular(() => root.addEventListener('keydown', key));
    this.stops.push(() => root.removeEventListener('keydown', key));
  }

  ngOnDestroy(): void {
    for (const s of this.stops) s();
    this.stops = [];
  }

  /** Goes one step back; false when there is nothing to undo. */
  undo(): boolean {
    const s = this.history.undo();
    if (!s) return false;
    this.apply(s.nodes, s.edges);
    this.flow.ɵannounce(this.flow.text('flowUndo'));
    return true;
  }

  redo(): boolean {
    const s = this.history.redo();
    if (!s) return false;
    this.apply(s.nodes, s.edges);
    this.flow.ɵannounce(this.flow.text('flowRedo'));
    return true;
  }

  /** Forgets every step; the diagram as it is now becomes the start. */
  clear(): void {
    this.history.reset(this.flow.getNodes(), this.flow.getEdges());
    this.changed();
  }

  private apply(nodes: ReturnType<WuFlow['getNodes']>, edges: ReturnType<WuFlow['getEdges']>): void {
    this.restoring = true;
    try {
      this.flow.ɵrestore(nodes, edges);
    } finally {
      this.restoring = false;
    }
    this.changed();
  }

  private changed(): void {
    // Buttons bound to canUndo / canRedo refresh, zoneless apps included.
    this.cdr.markForCheck();
    this.historyChange.emit({ canUndo: this.history.canUndo, canRedo: this.history.canRedo });
  }
}
