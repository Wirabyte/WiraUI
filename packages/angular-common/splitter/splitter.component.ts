import { DOCUMENT, NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ɵassertSupportedAngular,
  ɵrefreshOnTranslation,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { splitterBasis, splitterPercent, splitterReadState, splitterResize, splitterSizes, WuLocale } from 'wiraui/core';
import { WuSplitterPanel } from './splitter-panel.component';
import { WuSplitterResizeEndEvent, WuSplitterResizeStartEvent } from './splitter.types';

/** A panel to draw: its content and what its wu-splitter-panel says about it. */
interface PanelEntry {
  template: TemplateRef<unknown>;
  size?: unknown;
  minSize?: unknown;
  styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: Record<string, any> | null;
}

interface Drag {
  index: number;
  id: number;
  start: number;
  total: number;
  sizes: number[];
  rtl: boolean;
}

const RESIZE_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

/**
 * Panels side by side (or stacked, `layout="vertical"`) with a gutter to drag between each pair:
 * `<wu-splitter [panelSizes]="[25, 75]" [minSizes]="[10, 0]" [style]="{ height: '300px' }">` with one
 * `<ng-template wuTemplate="panel">` (or `#panel`, or a `<wu-splitter-panel>`) per panel. Sizes are in %. A gutter takes
 * the keyboard too (arrows by `step` px, Home / End to a panel's minimum). `stateKey` remembers the sizes in session
 * (or `stateStorage="local"`) storage. A splitter inside a panel fills it.
 */
@Component({
  selector: 'wu-splitter',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './splitter.component.html',
  styleUrls: ['./splitter.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-splitter-host' },
})
export class WuSplitter implements AfterContentInit, OnDestroy {
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Classes and styles of every panel box. */
  @Input() panelStyleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() panelStyle?: Record<string, any> | null;
  /** Where `stateKey` keeps the sizes: `'session'` (default) or `'local'`. */
  @Input() stateStorage: 'session' | 'local' | string | null | undefined = 'session';
  /** Remember the sizes under this key. */
  @Input() stateKey: string | null | undefined = null;
  @Input() layout: 'horizontal' | 'vertical' | string | null | undefined = 'horizontal';
  /** Gutter thickness in px. Default 4. */
  @Input() set gutterSize(v: unknown) {
    const n = Number(v);
    this._gutterSize = v === null || v === undefined || v === '' || !Number.isFinite(n) || n < 0 ? 4 : n;
  }
  get gutterSize(): number { return this._gutterSize; }
  /** How far an arrow key moves a gutter, in px. Default 5. */
  @Input() set step(v: unknown) {
    const n = Number(v);
    this._step = Number.isFinite(n) && n > 0 ? n : 5;
  }
  get step(): number { return this._step; }
  /** Smallest size of each panel, in %. */
  @Input() set minSizes(v: unknown[] | null | undefined) { this._minSizes = Array.isArray(v) ? v : []; }
  get minSizes(): unknown[] { return this._minSizes; }
  /** Starting size of each panel, in %; panels without one share the rest equally. Two-way: `[(panelSizes)]`. */
  @Input() set panelSizes(v: unknown[] | null | undefined) {
    this._panelSizes = Array.isArray(v) ? v : [];
    if (!this.ready) return;
    const next = splitterSizes(this.panels.length, this.givenSizes());
    if (next.join() !== this.sizes.join()) {
      this.sizes = next;
      this.cdr.markForCheck();
    }
  }
  get panelSizes(): number[] { return this.sizes; }

  @Output() readonly onResizeStart = new EventEmitter<WuSplitterResizeStartEvent>();
  @Output() readonly onResizeEnd = new EventEmitter<WuSplitterResizeEndEvent>();
  /** The sizes after each resize, for `[(panelSizes)]`. */
  @Output() readonly panelSizesChange = new EventEmitter<number[]>();

  @ContentChildren(WuSplitterPanel) protected panelComponents?: QueryList<WuSplitterPanel>;
  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChildren('panel', { read: TemplateRef }) protected panelRefs?: QueryList<TemplateRef<unknown>>;
  @ViewChild('root') protected rootRef?: ElementRef<HTMLElement>;

  panels: PanelEntry[] = [];
  /** Each panel's size in %. */
  sizes: number[] = [];
  resizing = false;
  /** The gutter being dragged or moved with the keys. */
  activeGutter = -1;
  readonly splitterId = ɵuniqueId('wu-splitter');
  private _gutterSize = 4;
  private _step = 5;
  private _minSizes: unknown[] = [];
  private _panelSizes: unknown[] = [];
  private ready = false;
  private drag: Drag | null = null;
  private keyResizing = false;
  private warned = false;
  private readonly subscriptions: Subscription[] = [];
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterContentInit(): void {
    this.collect();
    this.ready = true;
    for (const q of [this.panelComponents, this.templates, this.panelRefs]) {
      if (q) this.subscriptions.push(q.changes.subscribe(() => {
        this.collect();
        this.cdr.markForCheck();
      }));
    }
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    for (const s of this.subscriptions) s.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  horizontal(): boolean {
    return this.layout !== 'vertical';
  }
  basis(i: number): string {
    return splitterBasis(this.sizes[i] ?? 0, this.panels.length, this._gutterSize);
  }
  panelId(i: number): string {
    return `${this.splitterId}-panel-${i}`;
  }
  panelClass(p: PanelEntry): string {
    return `${this.panelStyleClass || ''} ${p.styleClass || ''}`.trim();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  panelStyleOf(p: PanelEntry): Record<string, any> | null {
    return p.style || this.panelStyle ? { ...(this.panelStyle || {}), ...(p.style || {}) } : null;
  }
  valueNow(i: number): number {
    return Math.round(this.sizes[i] ?? 0);
  }
  valueMin(i: number): number {
    return Math.round(this.minOf(i));
  }
  valueMax(i: number): number {
    return Math.round((this.sizes[i] ?? 0) + (this.sizes[i + 1] ?? 0) - this.minOf(i + 1));
  }
  trackPanel(i: number): number {
    return i;
  }

  // ---------- gutters: pointer ----------

  gutterDown(event: PointerEvent, index: number): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const root = this.rootRef?.nativeElement;
    if (!root) return;
    event.preventDefault();
    const gutter = event.currentTarget as HTMLElement;
    gutter.focus({ preventScroll: true });
    try {
      gutter.setPointerCapture(event.pointerId);
    } catch {
      // Older engines: the drag then ends when the pointer leaves the gutter.
    }
    const h = this.horizontal();
    this.drag = {
      index,
      id: event.pointerId,
      start: h ? event.clientX : event.clientY,
      total: h ? root.clientWidth : root.clientHeight,
      sizes: [...this.sizes],
      rtl: this.isRtl(),
    };
    this.startResize(index, event);
  }

  gutterMove(event: PointerEvent): void {
    const d = this.drag;
    if (!d || event.pointerId !== d.id) return;
    let px = (this.horizontal() ? event.clientX : event.clientY) - d.start;
    if (d.rtl && this.horizontal()) px = -px;
    const delta = splitterPercent(px, d.total, this.panels.length, this._gutterSize);
    this.sizes = splitterResize(d.sizes, d.index, delta, this.mins());
    this.cdr.markForCheck();
  }

  gutterUp(event: PointerEvent): void {
    const d = this.drag;
    if (!d || event.pointerId !== d.id) return;
    this.drag = null;
    this.endResize(event);
  }

  // ---------- gutters: keyboard ----------

  gutterKeydown(event: KeyboardEvent, index: number): void {
    if (RESIZE_KEYS.indexOf(event.key) < 0) return;
    event.preventDefault();
    const h = this.horizontal();
    let delta: number | null = null;
    if (event.key === 'Home') delta = -100;
    else if (event.key === 'End') delta = 100;
    else {
      let px = 0;
      if (h && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) px = event.key === 'ArrowRight' ? this._step : -this._step;
      if (!h && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) px = event.key === 'ArrowDown' ? this._step : -this._step;
      if (!px) return;
      if (h && this.isRtl()) px = -px;
      const root = this.rootRef?.nativeElement;
      const total = root ? (h ? root.clientWidth : root.clientHeight) : 0;
      delta = splitterPercent(px, total, this.panels.length, this._gutterSize);
    }
    if (!this.keyResizing) {
      this.keyResizing = true;
      this.startResize(index, event);
    }
    this.sizes = splitterResize(this.sizes, index, delta, this.mins());
    this.cdr.markForCheck();
  }

  gutterKeyup(event: KeyboardEvent): void {
    if (!this.keyResizing || RESIZE_KEYS.indexOf(event.key) < 0) return;
    this.keyResizing = false;
    this.endResize(event);
  }

  gutterBlur(event: FocusEvent): void {
    if (!this.keyResizing) return;
    this.keyResizing = false;
    this.endResize(event);
  }

  // ---------- state, as before ----------

  isStateful(): boolean {
    return this.stateKey !== null && this.stateKey !== undefined && this.stateKey !== '';
  }

  getStorage(): Storage | null {
    const win = this.doc.defaultView;
    if (!win) return null;
    try {
      if (this.stateStorage === 'local') return win.localStorage;
      if (this.stateStorage && this.stateStorage !== 'session' && !this.warned) {
        this.warned = true;
        console.warn(`wu-splitter: stateStorage "${this.stateStorage}" is not "local" or "session"; using session storage.`);
      }
      return win.sessionStorage;
    } catch {
      // Storage switched off (private mode, blocked cookies).
      return null;
    }
  }

  saveState(): void {
    if (!this.isStateful()) return;
    try {
      this.getStorage()?.setItem(String(this.stateKey), JSON.stringify(this.sizes));
    } catch {
      // Full or blocked: the sizes are simply not remembered.
    }
  }

  /** Applies the remembered sizes; false when there are none that fit. */
  restoreState(): boolean {
    const saved = this.readState();
    if (!saved) return false;
    this.sizes = saved;
    this.cdr.markForCheck();
    return true;
  }

  // ---------- internals ----------

  private startResize(index: number, event: Event): void {
    this.resizing = true;
    this.activeGutter = index;
    this.onResizeStart.emit({ originalEvent: event, sizes: [...this.sizes] });
    this.cdr.markForCheck();
  }

  private endResize(event: Event): void {
    this.resizing = false;
    this.activeGutter = -1;
    this.saveState();
    const sizes = [...this.sizes];
    this.onResizeEnd.emit({ originalEvent: event, sizes });
    this.panelSizesChange.emit(sizes);
    this.cdr.markForCheck();
  }

  private readState(): number[] | null {
    if (!this.isStateful()) return null;
    try {
      return splitterReadState(this.getStorage()?.getItem(String(this.stateKey)), this.panels.length);
    } catch {
      return null;
    }
  }

  private collect(): void {
    const components = this.panelComponents?.toArray() || [];
    let list: PanelEntry[];
    if (components.length) {
      list = components.map((c) => ({
        template: c.content,
        size: c.size,
        minSize: c.minSize,
        styleClass: c.styleClass,
        style: c.style && typeof c.style === 'object' ? c.style : null,
      }));
    } else {
      const seen: TemplateRef<unknown>[] = [];
      for (const t of this.templates?.toArray() || []) if (seen.indexOf(t.template) < 0) seen.push(t.template);
      for (const t of this.panelRefs?.toArray() || []) if (t && seen.indexOf(t) < 0) seen.push(t);
      list = seen.map((template) => ({ template }));
    }
    const recount = list.length !== this.panels.length;
    this.panels = list;
    if (recount || !this.sizes.length) this.sizes = this.readState() ?? splitterSizes(list.length, this.givenSizes());
  }

  private givenSizes(): unknown[] {
    return this._panelSizes.length ? this._panelSizes : this.panels.map((p) => p.size);
  }

  private mins(): unknown[] {
    return this._minSizes.length ? this._minSizes : this.panels.map((p) => p.minSize);
  }

  private minOf(i: number): number {
    const n = Number(this.mins()[i]);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  private isRtl(): boolean {
    const root = this.rootRef?.nativeElement;
    const win = this.doc.defaultView;
    return !!root && !!win && win.getComputedStyle(root).direction === 'rtl';
  }
}
