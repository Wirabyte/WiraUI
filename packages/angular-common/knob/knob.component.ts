import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵtoBool, ɵWU_SKIP_VERSION_CHECK } from '@wirabyte/ui/config';
import { knobPaths, knobText, knobValueAt, rangeKeyValue } from '@wirabyte/ui/core';

const toNumber = (v: unknown, fallback: number): number =>
  v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? fallback : Number(v);

/**
 * A round dial for a number: `<wu-knob [(ngModel)]="volume" [min]="0" [max]="100" [step]="5" valueTemplate="{value}%">`.
 * Press or drag on the dial (mouse, pen, touch), or focus it and use the keys: arrows ± step, Page Up / Page Down ± 10
 * steps, Home / End. Works with ngModel and reactive forms. Colours come from the theme (`--wu-knob-*`) unless
 * `valueColor` / `rangeColor` / `textColor` are given.
 */
@Component({
  selector: 'wu-knob',
  standalone: true,
  imports: [NgIf],
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuKnob), multi: true }],
  // A tabindex written on the tag goes to the dial only, so the page gets one tab stop.
  host: { class: 'wu-knob-host', '[attr.tabindex]': 'null' },
})
export class WuKnob implements ControlValueAccessor {
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string | null;
  @Input() ariaLabelledBy?: string | null;
  @Input() set tabindex(v: unknown) { this._tabindex = toNumber(v, 0); }
  get tabindex(): number { return this._tabindex; }
  /** Colour of the filled arc. Default: the theme's primary colour. */
  @Input() valueColor?: string | null;
  /** Colour of the track. */
  @Input() rangeColor?: string | null;
  /** Colour of the value text. */
  @Input() textColor?: string | null;
  /** The text in the middle; `{value}` is replaced: `'{value}%'`. */
  @Input() valueTemplate: string | null | undefined = '{value}';
  /** Width and height in px. Default 100. */
  @Input() set size(v: unknown) { this._size = Math.max(1, toNumber(v, 100)); }
  get size(): number { return this._size; }
  @Input() set min(v: unknown) { this._min = toNumber(v, 0); }
  get min(): number { return this._min; }
  @Input() set max(v: unknown) { this._max = toNumber(v, 100); }
  get max(): number { return this._max; }
  /** Values snap to this step. Default 1. */
  @Input() set step(v: unknown) { this._step = toNumber(v, 1); }
  get step(): number { return this._step; }
  /** Width of the arcs in viewBox units (the dial is 100 wide). Default 14. */
  @Input() set strokeWidth(v: unknown) { this._strokeWidth = Math.max(0, toNumber(v, 14)); }
  get strokeWidth(): number { return this._strokeWidth; }
  @Input() set showValue(v: unknown) { this._showValue = v === undefined || v === null ? true : ɵtoBool(v); }
  get showValue(): boolean { return this._showValue; }
  /** Shows the value, but it cannot be changed (and is out of the tab order). */
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  @Input() set required(v: unknown) { this._required = ɵtoBool(v); }
  get required(): boolean { return this._required; }
  @Input() set invalid(v: unknown) { this._invalid = ɵtoBool(v); }
  get invalid(): boolean { return this._invalid; }
  /** Accepted for templates moving over (there is no native field to name). */
  @Input() name?: string | null;

  /** The new value, after every change by the user. */
  @Output() readonly onChange = new EventEmitter<number>();

  /** The model value; `null` shows `min`. */
  value: number | null = null;
  private _tabindex = 0;
  private _size = 100;
  private _min = 0;
  private _max = 100;
  private _step = 1;
  private _strokeWidth = 14;
  private _showValue = true;
  private _readonly = false;
  private _disabled = false;
  private _required = false;
  private _invalid = false;
  private formDisabled = false;
  private dragId: number | null = null;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  // ---------- what the template reads ----------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  /** The value shown: the model, or `min` when there is none. */
  get current(): number {
    return this.value ?? this._min;
  }
  get paths(): { range: string; value: string } {
    return knobPaths(this.current, this._min, this._max);
  }
  get text(): string {
    return knobText(this.valueTemplate, this.current);
  }
  get locked(): boolean {
    return this.disabled || this._readonly;
  }

  // ---------- pointer ----------

  pointerdown(event: PointerEvent): void {
    if (this.locked || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const svg = event.currentTarget as SVGSVGElement;
    event.preventDefault();
    svg.focus({ preventScroll: true });
    this.dragId = event.pointerId;
    try {
      svg.setPointerCapture(event.pointerId);
    } catch {
      // Older engines: the drag then ends at the dial's edge.
    }
    this.moveTo(event, svg, false);
  }

  pointermove(event: PointerEvent): void {
    if (this.dragId === null || event.pointerId !== this.dragId) return;
    this.moveTo(event, event.currentTarget as SVGSVGElement, true);
  }

  pointerup(event: PointerEvent): void {
    if (this.dragId === null || event.pointerId !== this.dragId) return;
    this.dragId = null;
    this.onTouched();
  }

  // ---------- keyboard ----------

  keydown(event: KeyboardEvent): void {
    if (this.locked) return;
    const next = rangeKeyValue(event.key, this.current, this._min, this._max, this._step);
    if (next === null) return;
    event.preventDefault();
    this.setValue(next);
  }

  blurred(): void {
    this.onTouched();
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    this.value = v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v);
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

  private moveTo(event: PointerEvent, svg: SVGSVGElement, dragging: boolean): void {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = ((event.clientX - r.left) / r.width) * 100;
    const y = ((event.clientY - r.top) / r.height) * 100;
    const v = knobValueAt(x, y, this._min, this._max, this._step, dragging);
    if (v !== null) this.setValue(v);
  }

  private setValue(v: number): void {
    if (v === this.value) return;
    this.value = v;
    this.onModel(v);
    this.onChange.emit(v);
    this.cdr.markForCheck();
  }
}
