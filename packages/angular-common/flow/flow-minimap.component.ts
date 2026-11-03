import { DOCUMENT, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵtoBool } from '@wirabyte/ui/config';
import { getBoundsOfRects, minimapLayout, minimapMaskPath, minimapToFlow, viewRect } from '@wirabyte/ui/core';
import type { FlowMinimapLayout, FlowNode, FlowXY } from '@wirabyte/ui/core';
import { ɵWuFlowHost } from './flow-host';
import type { WuFlowPanelPosition } from './flow.types';

interface MiniNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string | null;
  stroke: string | null;
  className: string;
}

const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : ɵtoBool(v));

/**
 * A small map of the whole diagram with the part in view outlined: `<wu-flow-minimap position="bottom-right">`.
 * Drag it to pan, click to jump there, wheel over it to zoom (`[pannable]` / `[zoomable]`). Nodes take
 * `[nodeColor]` (a colour or a function of the node), else the `--wu-flow-minimap-node-bg` token.
 */
@Component({
  selector: 'wu-flow-minimap',
  standalone: true,
  imports: [NgFor],
  template: `
    <svg
      #svg
      class="wu-flow-minimap-svg"
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="viewBox"
      role="img"
      [attr.aria-label]="ariaLabel || label"
      [style.background-color]="bgColor || null"
    >
      <svg:rect
        *ngFor="let n of items; trackBy: trackById"
        class="wu-flow-minimap-node"
        [attr.class]="n.className"
        [attr.x]="n.x"
        [attr.y]="n.y"
        [attr.width]="n.width"
        [attr.height]="n.height"
        [attr.rx]="nodeBorderRadius"
        [attr.ry]="nodeBorderRadius"
        [style.fill]="n.fill"
        [style.stroke]="n.stroke"
        [style.stroke-width]="nodeStrokeWidth"
      ></svg:rect>
      <svg:path
        class="wu-flow-minimap-mask"
        [attr.d]="mask"
        fill-rule="evenodd"
        [style.fill]="maskColor || null"
        [style.stroke]="maskStrokeColor || null"
        [style.stroke-width]="maskStrokeWidth ? maskStrokeWidth * scale : null"
      ></svg:path>
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-flow-panel wu-flow-minimap nowheel',
    '[class.wu-flow-minimap-pannable]': 'pannable',
    '[class.wu-flow-panel-top-left]': "position === 'top-left'",
    '[class.wu-flow-panel-top-center]': "position === 'top-center'",
    '[class.wu-flow-panel-top-right]': "position === 'top-right'",
    '[class.wu-flow-panel-bottom-left]': "position === 'bottom-left'",
    '[class.wu-flow-panel-bottom-center]': "position === 'bottom-center'",
    '[class.wu-flow-panel-bottom-right]': "!position || position === 'bottom-right'",
    '[class.wu-flow-panel-center-left]': "position === 'center-left'",
    '[class.wu-flow-panel-center-right]': "position === 'center-right'",
  },
})
export class WuFlowMinimap implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() position: WuFlowPanelPosition = 'bottom-right';
  /** Size in px. Default 200 × 150 (smaller on narrow screens through the CSS). */
  @Input() width = 200;
  @Input() height = 150;
  /** Fill of each node: a colour, or a function of the node. */
  @Input() nodeColor: string | ((node: FlowNode) => string | null | undefined) | null | undefined;
  @Input() nodeStrokeColor: string | ((node: FlowNode) => string | null | undefined) | null | undefined;
  /** Extra class of each node rectangle: text, or a function of the node. */
  @Input() nodeClassName: string | ((node: FlowNode) => string | null | undefined) | null | undefined;
  @Input() nodeBorderRadius = 5;
  @Input() nodeStrokeWidth: number | null | undefined;
  /** Colour over what is out of view. */
  @Input() maskColor: string | null | undefined;
  @Input() maskStrokeColor: string | null | undefined;
  @Input() maskStrokeWidth: number | null | undefined;
  @Input() bgColor: string | null | undefined;
  /** Drag to pan and click to jump. Default true. */
  @Input() set pannable(v: unknown) {
    this._pannable = bool(v, true);
  }
  get pannable(): boolean {
    return this._pannable;
  }
  /** Wheel to zoom. Default true. */
  @Input() set zoomable(v: unknown) {
    this._zoomable = bool(v, true);
  }
  get zoomable(): boolean {
    return this._zoomable;
  }
  /** Drag the other way (move the diagram rather than the view rectangle). */
  @Input() set inversePan(v: unknown) {
    this._inverse = bool(v, false);
  }
  get inversePan(): boolean {
    return this._inverse;
  }
  /** Room around the content, in minimap px. Default 5. */
  @Input() offsetScale = 5;
  @Input() ariaLabel: string | null | undefined;

  @ViewChild('svg') protected svgRef?: ElementRef<SVGSVGElement>;

  items: MiniNode[] = [];
  viewBox = '0 0 200 150';
  mask = '';
  scale = 1;
  private layout: FlowMinimapLayout = { viewBox: { x: 0, y: 0, width: 200, height: 150 }, scale: 1 };
  private _pannable = true;
  private _zoomable = true;
  private _inverse = false;
  private stops: (() => void)[] = [];
  private drag: { pointerId: number; start: FlowXY; startVp: { x: number; y: number; zoom: number }; moved: boolean } | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject(ɵWuFlowHost, { optional: true });

  get label(): string {
    return this.host ? this.host.ɵtext('flowMiniMap') : '';
  }

  trackById(_: number, n: MiniNode): string {
    return n.id;
  }

  ngOnInit(): void {
    this.update();
    const stop = this.host?.ɵlisten(() => {
      this.update();
      this.cdr.detectChanges();
    });
    if (stop) this.stops.push(stop);
  }

  ngOnChanges(): void {
    this.update();
  }

  ngAfterViewInit(): void {
    const svg = this.svgRef?.nativeElement;
    if (!svg) return;
    this.zone.runOutsideAngular(() => {
      const down = (e: PointerEvent) => this.pointerDown(e);
      const wheel = (e: WheelEvent) => this.wheel(e);
      svg.addEventListener('pointerdown', down);
      svg.addEventListener('wheel', wheel, { passive: false });
      this.stops.push(() => {
        svg.removeEventListener('pointerdown', down);
        svg.removeEventListener('wheel', wheel);
      });
    });
  }

  ngOnDestroy(): void {
    for (const s of this.stops) s();
    this.stops = [];
  }

  private pick(v: string | ((node: FlowNode) => string | null | undefined) | null | undefined, node: FlowNode): string | null {
    if (!v) return null;
    if (typeof v === 'function') return v(node) || null;
    return v;
  }

  private update(): void {
    const host = this.host;
    if (!host) return;
    const rects = host.ɵnodeRects().filter((r) => r.width > 0 && r.height > 0);
    const pane = host.ɵpaneSize();
    const view = viewRect(host.getViewport(), pane.width && pane.height ? pane : { width: 1, height: 1 });
    const w = Math.max(1, Number(this.width) || 200);
    const h = Math.max(1, Number(this.height) || 150);
    // While dragging on the map its scale holds still, so the view follows the pointer evenly.
    if (!this.drag) this.layout = minimapLayout(getBoundsOfRects(rects), view, w, h, Number(this.offsetScale) || 0);
    const b = this.layout.viewBox;
    this.viewBox = `${b.x} ${b.y} ${b.width} ${b.height}`;
    this.scale = this.layout.scale;
    this.mask = minimapMaskPath(b, view);
    this.items = rects.map((r) => {
      const extra = this.pick(this.nodeClassName, r.node);
      return {
        id: r.id,
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        fill: this.pick(this.nodeColor, r.node),
        stroke: this.pick(this.nodeStrokeColor, r.node),
        className: 'wu-flow-minimap-node' + (r.selected ? ' wu-flow-minimap-node-selected' : '') + (r.node.type === 'group' ? ' wu-flow-minimap-node-group' : '') + (extra ? ' ' + extra : ''),
      };
    });
  }

  /** A pointer position to flow coordinates on the map. */
  private toFlow(e: { clientX: number; clientY: number }): FlowXY {
    const svg = this.svgRef?.nativeElement;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    // The SVG may be drawn smaller than its width / height attributes (narrow screens).
    const sx = r.width ? (Number(this.width) || 200) / r.width : 1;
    const sy = r.height ? (Number(this.height) || 150) / r.height : 1;
    return minimapToFlow({ x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }, this.layout);
  }

  private pointerDown(e: PointerEvent): void {
    const host = this.host;
    if (!host || !this._pannable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    e.stopPropagation();
    this.drag = { pointerId: e.pointerId, start: this.toFlow(e), startVp: host.getViewport(), moved: false };
    const move = (ev: PointerEvent) => {
      const d = this.drag;
      if (!d || ev.pointerId !== d.pointerId) return;
      const p = this.toFlow(ev);
      const dx = p.x - d.start.x;
      const dy = p.y - d.start.y;
      if (!d.moved && Math.hypot(dx / this.layout.scale, dy / this.layout.scale) < 3) return;
      d.moved = true;
      const k = this._inverse ? 1 : -1;
      void host.setViewport({ x: d.startVp.x + k * dx * d.startVp.zoom, y: d.startVp.y + k * dy * d.startVp.zoom, zoom: d.startVp.zoom });
    };
    const up = (ev: PointerEvent) => {
      const d = this.drag;
      if (!d || ev.pointerId !== d.pointerId) return;
      this.drag = null;
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
      this.doc.removeEventListener('pointercancel', up);
      // A click moves the view's middle there.
      if (!d.moved && ev.type === 'pointerup') {
        const p = this.toFlow(ev);
        void host.setCenter(p.x, p.y, { duration: 200 });
      }
    };
    this.doc.addEventListener('pointermove', move);
    this.doc.addEventListener('pointerup', up);
    this.doc.addEventListener('pointercancel', up);
  }

  private wheel(e: WheelEvent): void {
    const host = this.host;
    if (!host || !this._zoomable) return;
    e.preventDefault();
    e.stopPropagation();
    const factor = Math.exp(-Math.max(-100, Math.min(100, e.deltaY)) * 0.003);
    void host.ɵzoomBy(factor);
  }
}
