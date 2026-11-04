import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';

interface Point {
  x: number;
  y: number;
  /** 0–1 pen pressure; a mouse gives 0.5. */
  p: number;
}
type Stroke = Point[];

const toNumber = (v: unknown, fallback: number): number =>
  v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? fallback : Number(v);

/**
 * A box to sign in, for forms: `<wu-signature-pad [(ngModel)]="signature">`. Draw with a mouse, a pen (pressure makes
 * the line thicker) or a finger. The value is a PNG data URL of the drawing (`null` while empty), so it can be shown in
 * an `<img>` or sent as it is; a data URL written into the control is drawn back. Clear and undo buttons sit in the
 * corner, a line shows where to sign, and the drawing survives the box being resized.
 */
@Component({
  selector: 'wu-signature-pad, wu-signaturePad, wu-signature',
  standalone: true,
  imports: [NgIf],
  templateUrl: './signaturepad.component.html',
  styleUrls: ['./signaturepad.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuSignaturePad), multi: true }],
  host: { class: 'wu-signature-pad-host' },
})
export class WuSignaturePad implements AfterViewInit, ControlValueAccessor, OnDestroy {
  /** Height of the box in px. Default: the theme's (`--wu-signature-height`, 12rem). */
  @Input() height?: number | string | null;
  /** Ink colour. Default: the theme's text colour. */
  @Input() penColor?: string | null;
  /** Line width in px at normal pressure. Default 2.5. */
  @Input() set penWidth(v: unknown) { this._penWidth = Math.max(0.5, toNumber(v, 2.5)); }
  get penWidth(): number { return this._penWidth; }
  /** A background painted into the exported PNG, e.g. `'#ffffff'` for documents. Default: transparent. */
  @Input() exportBackground?: string | null;
  /** The text inside the empty box. Default: the locale's "Sign in the box". */
  @Input() placeholder?: string | null;
  /** `false` hides the line to sign on. */
  @Input() set showGuide(v: unknown) { this._guide = v === undefined ? true : ɵtoBool(v); }
  get showGuide(): boolean { return this._guide; }
  /** `false` hides the clear and undo buttons (call `clear()` / `undo()` yourself). */
  @Input() set showButtons(v: unknown) { this._buttons = v === undefined ? true : ɵtoBool(v); }
  get showButtons(): boolean { return this._buttons; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); this.cdr.markForCheck(); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  /** A stroke began. */
  @Output() readonly onBegin = new EventEmitter<PointerEvent>();
  /** A stroke ended; the value has been updated. */
  @Output() readonly onEnd = new EventEmitter<string | null>();
  @Output() readonly onClear = new EventEmitter<void>();

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  /** True while nothing is drawn. */
  empty = true;
  private strokes: Stroke[] = [];
  private current: Stroke | null = null;
  /** A drawing that came in as a value; strokes are drawn over it. */
  private base: HTMLImageElement | null = null;
  private _penWidth = 2.5;
  private _guide = true;
  private _buttons = true;
  private _disabled = false;
  private _invalid = false;
  private formDisabled = false;
  private width = 0;
  private observer?: ResizeObserver;
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    this.fit();
    if (typeof ResizeObserver === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => {
        if (this.canvas.clientWidth !== this.width) this.fit();
      });
      this.observer.observe(this.canvas);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t() {
    return this.config.translation.signaturePad;
  }
  get rootClass(): string {
    return ['wu-signature-pad', this.disabled ? 'wu-signature-pad-disabled' : '', this._invalid ? 'wu-invalid' : '', this.styleClass || '']
      .filter(Boolean)
      .join(' ');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> {
    const own = this.style && typeof this.style === 'object' ? this.style : {};
    const h = this.height;
    const height = h === null || h === undefined || h === '' ? undefined : typeof h === 'number' || /^\d+(\.\d+)?$/.test(String(h)) ? `${h}px` : String(h);
    return height ? { ...own, '--wu-signature-height': height } : own;
  }
  get hint(): string {
    return this.placeholder ?? this.t?.hint ?? '';
  }

  // ---------- public API ----------

  /** Removes the whole drawing. */
  clear(): void {
    this.strokes = [];
    this.base = null;
    this.redraw();
    this.commit(false);
    this.onClear.emit();
  }
  /** Removes the last stroke. */
  undo(): void {
    if (this.strokes.length) this.strokes.pop();
    else if (this.base) this.base = null;
    else return;
    this.redraw();
    this.commit(false);
  }
  /** The drawing as a data URL (`'image/png'` by default), or `null` while empty. */
  toDataURL(type = 'image/png', quality?: number): string | null {
    if (this.empty) return null;
    const bg = this.exportBackground || (type === 'image/jpeg' ? '#ffffff' : null);
    if (!bg) return this.canvas.toDataURL(type, quality);
    const out = document.createElement('canvas');
    out.width = this.canvas.width;
    out.height = this.canvas.height;
    const ctx = out.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(this.canvas, 0, 0);
    return out.toDataURL(type, quality);
  }

  // ---------- drawing ----------

  down(event: PointerEvent): void {
    if (this.disabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    this.canvas.setPointerCapture?.(event.pointerId);
    this.current = [this.point(event)];
    this.strokes.push(this.current);
    this.redraw();
    this.onBegin.emit(event);
  }
  move(event: PointerEvent): void {
    if (!this.current) return;
    event.preventDefault();
    const events = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
    for (const e of events.length ? events : [event]) this.current.push(this.point(e));
    this.redraw();
  }
  up(): void {
    if (!this.current) return;
    this.current = null;
    this.commit();
    this.onTouched();
  }

  private point(e: PointerEvent): Point {
    const r = this.canvas.getBoundingClientRect();
    const p = e.pointerType === 'pen' && e.pressure > 0 ? e.pressure : 0.5;
    return { x: e.clientX - r.left, y: e.clientY - r.top, p };
  }

  /** Sizes the bitmap to the box at the screen's pixel density, then draws everything again. */
  private fit(): void {
    const c = this.canvas;
    const ratio = Math.max(1, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
    this.width = c.clientWidth;
    c.width = Math.round(c.clientWidth * ratio);
    c.height = Math.round(c.clientHeight * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.redraw();
  }

  private redraw(): void {
    const c = this.canvas;
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    if (this.base) ctx.drawImage(this.base, 0, 0, c.clientWidth, c.clientHeight);
    const ink = this.penColor || getComputedStyle(c).getPropertyValue('--wu-signature-ink').trim() || '#000';
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const s of this.strokes) this.drawStroke(s);
    const empty = !this.base && !this.strokes.length;
    if (empty !== this.empty) {
      this.empty = empty;
      this.zone.run(() => this.cdr.markForCheck());
    }
  }

  /** A smooth line through the points (quadratic curves through the midpoints), thicker where the pen pressed harder. */
  private drawStroke(s: Stroke): void {
    const ctx = this.ctx;
    const w = (p: Point) => this._penWidth * (0.6 + p.p * 0.8);
    if (s.length === 1) {
      ctx.beginPath();
      ctx.arc(s[0].x, s[0].y, w(s[0]) / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    for (let i = 1; i < s.length; i++) {
      const a = s[i - 1];
      const b = s[i];
      const prev = i > 1 ? s[i - 2] : a;
      ctx.beginPath();
      ctx.lineWidth = w(b);
      ctx.moveTo((prev.x + a.x) / 2, (prev.y + a.y) / 2);
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      ctx.stroke();
    }
  }

  /** Updates the form value; `(onEnd)` only when a stroke finished, not on undo or clear. */
  private commit(strokeEnded = true): void {
    const value = this.toDataURL();
    this.onChange(value);
    if (strokeEnded) this.onEnd.emit(value);
    this.cdr.markForCheck();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  // ---------- ControlValueAccessor ----------

  writeValue(value: unknown): void {
    this.strokes = [];
    this.current = null;
    this.base = null;
    if (typeof value === 'string' && value.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        this.base = img;
        this.redraw();
      };
      img.src = value;
    }
    this.redraw();
  }
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled = disabled;
    this.cdr.markForCheck();
  }
}
