import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵtoBool } from '@wirabyte/ui/config';
import { resizeBox } from '@wirabyte/ui/core';
import type { FlowRect, FlowResizeDirection, FlowResizeLimits, FlowXY } from '@wirabyte/ui/core';
import { ɵWuFlowHost } from './flow-host';
import { WU_FLOW_NODE } from './flow.types';

/** `(resizeStart)` / `(resize)` / `(resizeEnd)`: the node's new box (position relative to its parent). */
export interface WuFlowResizeEvent {
  event: PointerEvent | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : ɵtoBool(v));
const CORNERS: FlowResizeDirection[] = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
const SIDES: FlowResizeDirection[] = ['top', 'right', 'bottom', 'left'];

/**
 * Resize handles on a node: `<wu-flow-node-resizer [minWidth]="120" [keepAspectRatio]="false">` inside a node
 * template. Drag a corner or a side; shown while the node is selected (or as `[isVisible]` says). With the keyboard,
 * Alt + arrow keys on the focused node resize it.
 */
@Component({
  selector: 'wu-flow-node-resizer',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <ng-container *ngIf="visible">
      <div
        *ngFor="let d of sides"
        class="wu-flow-resize-line nodrag"
        [class]="lineClass || ''"
        [attr.data-dir]="d"
        [style.border-color]="color || null"
        (pointerdown)="start($event, d)"
      ></div>
      <div
        *ngFor="let d of corners"
        class="wu-flow-resize-handle nodrag"
        [class]="handleClass || ''"
        [attr.data-dir]="d"
        [style.background-color]="color || null"
        (pointerdown)="start($event, d)"
      ></div>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-flow-resizer', '[class.wu-flow-resizer-active]': 'visible' },
})
export class WuFlowNodeResizer implements OnInit, OnChanges, OnDestroy {
  @Input() minWidth = 10;
  @Input() minHeight = 10;
  @Input() maxWidth: number | null | undefined;
  @Input() maxHeight: number | null | undefined;
  @Input() set keepAspectRatio(v: unknown) {
    this._ratio = bool(v, false);
  }
  get keepAspectRatio(): boolean {
    return this._ratio;
  }
  /** Force it shown / hidden; leave out to show it while the node is selected. */
  @Input() isVisible: boolean | string | null | undefined;
  /** Colour of the handles and lines (default: the `--wu-flow-resizer-color` token). */
  @Input() color: string | null | undefined;
  @Input() handleClass: string | null | undefined;
  @Input() lineClass: string | null | undefined;
  /** The node it resizes (default: the node whose template it is in). */
  @Input() nodeId: string | null | undefined;

  @Output() readonly resizeStart = new EventEmitter<WuFlowResizeEvent>();
  @Output() readonly resize = new EventEmitter<WuFlowResizeEvent>();
  @Output() readonly resizeEnd = new EventEmitter<WuFlowResizeEvent>();

  readonly corners = CORNERS;
  readonly sides = SIDES;
  visible = false;
  private _ratio = false;
  private stops: (() => void)[] = [];
  private unregister: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly host = inject(ɵWuFlowHost, { optional: true });
  private readonly nodeCtx = inject(WU_FLOW_NODE, { optional: true });

  ngOnInit(): void {
    this.sync();
    const stop = this.host?.ɵlisten((changes) => {
      if ((changes.has('selection') || changes.has('nodes')) && this.sync()) this.cdr.detectChanges();
    });
    if (stop) this.stops.push(stop);
    // Registered once the node id is known (after the first render puts the resizer in its node).
    Promise.resolve().then(() => this.register());
  }

  ngOnChanges(): void {
    this.sync();
  }

  ngOnDestroy(): void {
    for (const s of this.stops) s();
    this.stops = [];
    this.unregister?.();
  }

  private id(): string | null {
    return this.nodeId || this.nodeCtx?.id || this.el.closest?.('.wu-flow-node')?.getAttribute('data-id') || null;
  }

  private register(): void {
    const id = this.id();
    if (!id || !this.host) return;
    this.unregister?.();
    this.unregister = this.host.ɵregisterResizer(id, () => this.limits());
  }

  private limits(): FlowResizeLimits {
    return { minWidth: Number(this.minWidth) || 10, minHeight: Number(this.minHeight) || 10, maxWidth: Number(this.maxWidth) || 0, maxHeight: Number(this.maxHeight) || 0, keepAspectRatio: this._ratio };
  }

  private sync(): boolean {
    let next: boolean;
    if (this.isVisible !== undefined && this.isVisible !== null && this.isVisible !== '') next = ɵtoBool(this.isVisible);
    else {
      const id = this.id();
      next = !!id && !!this.host && this.host.ɵisNodeSelected(id) && this.host.ɵisInteractive();
    }
    const changed = next !== this.visible;
    this.visible = next;
    return changed;
  }

  start(e: PointerEvent, dir: FlowResizeDirection): void {
    const host = this.host;
    const id = this.id();
    if (!host || !id || (e.pointerType === 'mouse' && e.button !== 0) || !host.ɵisInteractive()) return;
    const box = host.ɵnodeBox(id);
    if (!box) return;
    // The flow must not start a node drag or a pan.
    e.stopPropagation();
    e.preventDefault();
    const zoom = host.getViewport().zoom || 1;
    const startRect: FlowRect = { x: box.position.x, y: box.position.y, width: box.width, height: box.height };
    const start: FlowXY = { x: e.clientX, y: e.clientY };
    const limits = this.limits();
    let last = startRect;
    host.ɵresizeNode(id, startRect, 'start', e);
    this.resizeStart.emit({ event: e, ...startRect });
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      ev.preventDefault();
      last = resizeBox(startRect, dir, (ev.clientX - start.x) / zoom, (ev.clientY - start.y) / zoom, limits);
      host.ɵresizeNode(id, last, 'move', ev);
      if (this.resize.observers.length) this.zone.run(() => this.resize.emit({ event: ev, ...last }));
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
      this.doc.removeEventListener('pointercancel', up);
      host.ɵresizeNode(id, last, 'end', ev);
      this.zone.run(() => this.resizeEnd.emit({ event: ev, ...last }));
    };
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointermove', move);
      this.doc.addEventListener('pointerup', up);
      this.doc.addEventListener('pointercancel', up);
    });
  }
}
