import { NgFor, NgIf } from '@angular/common';
import {
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
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵtoBool, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';

/** `(onChange)` and `(onSlideEnd)`: the value, and both ends of a range. */
export interface WtSliderChangeEvent {
  event?: Event;
  originalEvent?: Event;
  value?: number;
  values?: number[];
}

const toNumber = (v: unknown, fallback: number) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? fallback : Number(v));

/**
 * A value (or a range, `[range]="true"`) picked by dragging a handle along a track:
 * `<wt-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="5">`. Click the track to jump, drag a handle,
 * or use the keyboard (arrows, Page Up/Down, Home/End). `orientation="vertical"` stands it up.
 */
@Component({
  selector: 'wt-slider',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtSlider), multi: true }],
  host: { class: 'wt-slider-host', '[class.wt-slider-host-vertical]': "orientation === 'vertical'" },
})
export class WtSlider implements ControlValueAccessor, OnDestroy {
  @Input() set min(v: unknown) { this._min = toNumber(v, 0); }
  get min(): number { return this._min; }
  @Input() set max(v: unknown) { this._max = toNumber(v, 100); }
  get max(): number { return this._max; }
  /** Values snap to this step. Default 1; 0 or none means any value. */
  @Input() set step(v: unknown) { this._step = toNumber(v, 1); }
  get step(): number { return this._step; }
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  /** Two handles: the value is `[from, to]`. */
  @Input() set range(v: unknown) { this._range = ɵtoBool(v); }
  get range(): boolean { return this._range; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() tabindex: number | string = 0;
  /** Accepted for templates moving over. */
  @Input() animate: unknown;
  @Input() autofocus: unknown;

  @Output() readonly onChange = new EventEmitter<WtSliderChangeEvent>();
  @Output() readonly onSlideEnd = new EventEmitter<WtSliderChangeEvent>();

  values: number[] = [0, 0];
  private _min = 0;
  private _max = 100;
  private _step = 1;
  private _range = false;
  private _disabled = false;
  private formDisabled = false;
  private dragging = -1;
  private cleanup: (() => void) | null = null;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }

  // ---------- what the template reads ----------

  get vertical(): boolean {
    return this.orientation === 'vertical';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get handles(): number[] {
    return this._range ? [0, 1] : [0];
  }
  percent(v: number): number {
    const span = this._max - this._min;
    return span > 0 ? ((this.clamp(v) - this._min) * 100) / span : 0;
  }
  /** Where the filled part starts and how long it is, in %. */
  get rangeStart(): number {
    return this._range ? this.percent(Math.min(this.values[0], this.values[1])) : 0;
  }
  get rangeSize(): number {
    return this._range ? Math.abs(this.percent(this.values[1]) - this.percent(this.values[0])) : this.percent(this.values[0]);
  }

  // ---------- pointer ----------

  /** A press on the track moves the nearest handle there and keeps dragging it. */
  trackDown(event: PointerEvent): void {
    if (this.disabled || event.button !== 0) return;
    event.preventDefault();
    const v = this.valueAt(event);
    const i = this._range ? (Math.abs(v - this.values[0]) <= Math.abs(v - this.values[1]) ? 0 : 1) : 0;
    this.startDrag(i);
    this.setValue(i, v, event);
  }

  handleDown(event: PointerEvent, index: number): void {
    if (this.disabled || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    this.startDrag(index);
  }

  private startDrag(index: number): void {
    this.dragging = index;
    (this.host.querySelectorAll('.wt-slider-handle')[index] as HTMLElement | undefined)?.focus();
    const doc = this.host.ownerDocument;
    const move = (e: PointerEvent) => this.zone.run(() => this.setValue(this.dragging, this.valueAt(e), e));
    const up = (e: PointerEvent) =>
      this.zone.run(() => {
        this.cleanup?.();
        this.cleanup = null;
        this.dragging = -1;
        this.onTouched();
        this.onSlideEnd.emit(this.event(e));
        this.cdr.markForCheck();
      });
    this.zone.runOutsideAngular(() => {
      doc.addEventListener('pointermove', move);
      doc.addEventListener('pointerup', up);
      doc.addEventListener('pointercancel', up);
    });
    this.cleanup = () => {
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerup', up);
      doc.removeEventListener('pointercancel', up);
    };
  }

  // ---------- keyboard ----------

  keydown(event: KeyboardEvent, index: number): void {
    if (this.disabled) return;
    const step = this._step > 0 ? this._step : (this._max - this._min) / 100;
    const cur = this.values[index];
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = cur + step;
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = cur - step;
        break;
      case 'PageUp':
        next = cur + step * 10;
        break;
      case 'PageDown':
        next = cur - step * 10;
        break;
      case 'Home':
        next = this._min;
        break;
      case 'End':
        next = this._max;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.setValue(index, next, event);
    this.onSlideEnd.emit(this.event(event));
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    if (this._range) {
      const arr = Array.isArray(v) ? v : [this._min, this._max];
      this.values = [this.clamp(toNumber(arr[0], this._min)), this.clamp(toNumber(arr[1], this._max))];
    } else {
      this.values = [this.clamp(toNumber(v, this._min)), 0];
    }
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
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private clamp(v: number): number {
    return Math.min(this._max, Math.max(this._min, v));
  }

  private snap(v: number): number {
    const s = this._step;
    if (!(s > 0)) return this.clamp(v);
    const n = Math.round((v - this._min) / s) * s + this._min;
    // Keep decimals of fractional steps tidy (0.1 + 0.2).
    const decimals = (String(s).split('.')[1] || '').length;
    return this.clamp(Number(n.toFixed(decimals)));
  }

  private valueAt(event: PointerEvent): number {
    const track = this.host.querySelector('.wt-slider') as HTMLElement;
    const r = track.getBoundingClientRect();
    const ratio = this.vertical ? (r.bottom - event.clientY) / r.height : (event.clientX - r.left) / r.width;
    return this._min + Math.min(1, Math.max(0, ratio)) * (this._max - this._min);
  }

  private setValue(index: number, raw: number, event: Event): void {
    if (index < 0) return;
    let v = this.snap(raw);
    if (this._range) {
      // The handles do not cross.
      if (index === 0) v = Math.min(v, this.values[1]);
      else v = Math.max(v, this.values[0]);
    }
    if (v === this.values[index]) return;
    this.values = this.values.map((x, i) => (i === index ? v : x));
    const value = this._range ? [this.values[0], this.values[1]] : this.values[0];
    this.onModel(value);
    this.onChange.emit(this._range ? { event, values: [this.values[0], this.values[1]] } : { event, value: this.values[0] });
    this.cdr.markForCheck();
  }

  private event(e: Event): WtSliderChangeEvent {
    return this._range ? { originalEvent: e, values: [this.values[0], this.values[1]] } : { originalEvent: e, value: this.values[0] };
  }
}
