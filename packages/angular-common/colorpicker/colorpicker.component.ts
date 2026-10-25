import { DOCUMENT, NgIf } from '@angular/common';
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
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWT_SKIP_VERSION_CHECK,
  ɵWtPopup,
  ɵWtStyleLoader,
  WtConfig,
} from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { ColorFormat, ColorHsb, formatColor, hsbToHex, parseColor, WtLocale } from 'wiratheme/core';

/** `(onChange)`: the colour in the component's `format`. */
export interface WtColorPickerChangeEvent {
  originalEvent: Event;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Picks a colour: `<wt-colorPicker [(ngModel)]="color">`. A swatch opens a panel with a saturation/brightness
 * area, a hue strip and a hex field; `[inline]="true"` shows the panel on the page. The value is `'#rrggbb'`
 * (`format="hex"`, default), `{ r, g, b }` (`"rgb"`) or `{ h, s, b }` (`"hsb"`); any of those is read back.
 * Keyboard: arrows move the focused handle (Shift for bigger steps), Escape closes.
 */
@Component({
  selector: 'wt-colorpicker, wt-colorPicker, wt-color-picker',
  standalone: true,
  imports: [NgIf],
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtColorPicker), multi: true }],
})
export class WtColorPicker implements ControlValueAccessor, OnDestroy {
  @Input() format: ColorFormat = 'hex';
  /** The panel on the page instead of a swatch that opens it. */
  @Input() set inline(v: unknown) { this._inline = ɵtoBool(v); }
  get inline(): boolean { return this._inline; }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled || this.formDisabled; }
  /** Shown while there is no value. Default `'ff0000'`. */
  @Input() set defaultColor(v: string | null | undefined) {
    this._defaultColor = v || 'ff0000';
    if (this.empty) this.hsb = parseColor(this._defaultColor) || { h: 0, s: 100, b: 100 };
  }
  @Input() inputId?: string;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  @Input() ariaLabel?: string;
  @Input() tabindex: number | string = 0;
  /** Accepted for templates moving over: the panel opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;
  @Input() autofocus: unknown;

  @Output() readonly onChange = new EventEmitter<WtColorPickerChangeEvent>();
  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ViewChild('preview') protected previewRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') protected panelRef?: ElementRef<HTMLElement>;

  hsb: ColorHsb = { h: 0, s: 100, b: 100 };
  open = false;
  /** No value yet: the swatch shows the default colour. */
  empty = true;
  private _inline = false;
  private _disabled = false;
  private _defaultColor = 'ff0000';
  private formDisabled = false;
  private popup: ɵWtPopup | null = null;
  private stopDrag: (() => void) | null = null;
  private onModel: (v: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.stopDrag?.();
    this.popup?.close();
  }

  // ---------- what the template reads ----------

  get t(): WtLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get hex(): string {
    return hsbToHex(this.hsb);
  }
  /** The pure hue behind the saturation/brightness area. */
  get hueColor(): string {
    return hsbToHex({ h: this.hsb.h, s: 100, b: 100 });
  }
  get areaText(): string {
    return `${Math.round(this.hsb.s)}%, ${Math.round(this.hsb.b)}%`;
  }
  round(v: number): number {
    return Math.round(v);
  }

  // ---------- popup ----------

  toggle(): void {
    if (this.open) this.hide(true);
    else this.show();
  }

  show(): void {
    if (this._inline || this.open || this.disabled) return;
    this.open = true;
    this.cdr.detectChanges();
    const anchor = this.previewRef?.nativeElement;
    const panel = this.panelRef?.nativeElement;
    if (anchor && panel) {
      this.popup = new ɵWtPopup(anchor, panel, {
        sheet: false,
        sheetClass: 'wt-colorpicker-sheet',
        modalClass: 'wt-colorpicker-modal',
        onOutside: () => this.zone.run(() => this.hide()),
        onEscape: (e) => this.zone.run(() => {
          e.preventDefault();
          this.hide(true);
        }),
      });
      this.popup.open();
      (panel.querySelector('.wt-colorpicker-area') as HTMLElement | null)?.focus({ preventScroll: true });
    }
    this.onShow.emit();
  }

  /** `refocus`: put focus back on the swatch (after Escape). */
  hide(refocus = false): void {
    if (!this.open) return;
    this.stopDrag?.();
    this.popup?.close();
    this.popup = null;
    this.open = false;
    this.onTouched();
    this.cdr.markForCheck();
    if (refocus) this.previewRef?.nativeElement.focus();
    this.onHide.emit();
  }

  previewKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.show();
    }
  }

  // ---------- pointer ----------

  areaDown(event: PointerEvent): void {
    this.drag(event, (e, r) => {
      const s = ((e.clientX - r.left) / r.width) * 100;
      const b = 100 - ((e.clientY - r.top) / r.height) * 100;
      this.set({ h: this.hsb.h, s: clamp(s, 0, 100), b: clamp(b, 0, 100) }, e);
    });
  }

  hueDown(event: PointerEvent): void {
    this.drag(event, (e, r) => this.set({ ...this.hsb, h: clamp(((e.clientX - r.left) / r.width) * 360, 0, 360) }, e));
  }

  private drag(event: PointerEvent, apply: (e: PointerEvent, r: DOMRect) => void): void {
    if (this.disabled || event.button !== 0) return;
    event.preventDefault();
    const el = event.currentTarget as HTMLElement;
    el.focus({ preventScroll: true });
    const rect = () => el.getBoundingClientRect();
    apply(event, rect());
    this.stopDrag?.();
    const move = (e: PointerEvent) => this.zone.run(() => apply(e, rect()));
    const up = () => this.stopDrag?.();
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointermove', move);
      this.doc.addEventListener('pointerup', up);
      this.doc.addEventListener('pointercancel', up);
    });
    this.stopDrag = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
      this.doc.removeEventListener('pointercancel', up);
      this.stopDrag = null;
    };
  }

  // ---------- keyboard ----------

  areaKey(event: KeyboardEvent): void {
    if (this.disabled) return;
    const step = event.shiftKey ? 10 : 1;
    let { s, b } = this.hsb;
    switch (event.key) {
      case 'ArrowLeft':
        s -= step;
        break;
      case 'ArrowRight':
        s += step;
        break;
      case 'ArrowUp':
        b += step;
        break;
      case 'ArrowDown':
        b -= step;
        break;
      case 'Enter':
        if (this.open) {
          event.preventDefault();
          this.hide(true);
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    this.set({ h: this.hsb.h, s: clamp(s, 0, 100), b: clamp(b, 0, 100) }, event);
  }

  hueKey(event: KeyboardEvent): void {
    if (this.disabled) return;
    const step = event.shiftKey ? 10 : 1;
    let h = this.hsb.h;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        h -= step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        h += step;
        break;
      case 'Home':
        h = 0;
        break;
      case 'End':
        h = 360;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.set({ ...this.hsb, h: clamp(h, 0, 360) }, event);
  }

  /** A colour typed in the hex field (on Enter or leaving it). */
  hexInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const c = parseColor(input.value);
    if (c) this.set(c, event);
    else input.value = this.hex;
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    const c = parseColor(v);
    this.empty = !c;
    this.hsb = c || parseColor(this._defaultColor) || { h: 0, s: 100, b: 100 };
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
    if (disabled) this.hide();
    this.cdr.markForCheck();
  }

  // ---------- internals ----------

  private set(c: ColorHsb, event: Event): void {
    if (!this.empty && c.h === this.hsb.h && c.s === this.hsb.s && c.b === this.hsb.b) return;
    this.hsb = c;
    this.empty = false;
    const value = formatColor(c, this.format);
    this.onModel(value);
    this.onChange.emit({ originalEvent: event, value });
    this.cdr.markForCheck();
  }
}
