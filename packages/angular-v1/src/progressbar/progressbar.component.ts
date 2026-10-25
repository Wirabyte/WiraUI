import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  inject,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  WtTemplate,
} from 'wiratheme/config';
import { ɵprogressPercent, ɵprogressText, WtProgressBarContext, WtProgressBarMode } from './progressbar.types';

/**
 * Progress, or an endless bar while the length is unknown: `<wt-progressbar [value]="60">`.
 * Counting items instead: `<wt-progressbar [value]="1000" [max]="2500" unit="รายการ">` shows `1,000 / 2,500 รายการ`.
 */
@Component({
  selector: 'wt-progressbar, wt-progressBar, wt-progress-bar',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtProgressBar implements OnDestroy {
  @Input() set value(v: unknown) { this._value = Number(v) || 0; }
  get value(): number { return this._value; }
  /** What `value` counts up to. Default 100 (percent). */
  @Input() set max(v: unknown) { this._max = Number(v) > 0 ? Number(v) : 100; }
  get max(): number { return this._max; }
  /** Own words on the bar instead of the number: `text="อัปโหลด 3 จาก 10 ไฟล์"`. */
  @Input() text?: string;
  @Input() set showValue(v: unknown) { this._showValue = v === undefined || ɵtoBool(v); }
  get showValue(): boolean { return this._showValue; }
  @Input() unit = '%';
  @Input() mode: WtProgressBarMode = 'determinate';
  /** Bar colour, e.g. `var(--wt-success-color)`. */
  @Input() color?: string;
  /** Diagonal stripes on the bar. */
  @Input() set striped(v: unknown) { this._striped = ɵtoBool(v); }
  get striped(): boolean { return this._striped; }
  /** Stripes that move, for work in progress (shown still to people who ask for less motion). */
  @Input() set animated(v: unknown) { this._animated = ɵtoBool(v); }
  get animated(): boolean { return this._animated; }
  private _striped = false;
  private _animated = false;
  @Input() ariaLabel?: string;

  @ContentChild('content', { descendants: false }) private contentRef?: unknown;
  @ContentChildren(WtTemplate) private templates?: QueryList<WtTemplate>;

  private _value = 0;
  private _max = 100;
  private _showValue = true;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  /** Width of the bar, 0–100. */
  get percent(): number {
    return ɵprogressPercent(this._value, this._max);
  }
  get done(): number {
    return Math.min(this._max, Math.max(0, this._value));
  }
  get shown(): string {
    return this.text || ɵprogressText(this._value, this._max, this.unit);
  }
  /** `<ng-template #content let-value let-max="max" let-percent="percent">` (or `wtTemplate="content"`). */
  get contentTemplate(): TemplateRef<WtProgressBarContext> | null {
    const own = this.contentRef instanceof TemplateRef ? this.contentRef : null;
    return (own || ɵfindTemplate(this.templates, 'content')) as TemplateRef<WtProgressBarContext> | null;
  }
  get context(): WtProgressBarContext {
    return { $implicit: this._value, value: this._value, max: this._max, percent: this.percent };
  }

  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get classes(): string {
    return [this.baseClasses, this.styleClass].filter(Boolean).join(' ');
  }
  get baseClasses(): string {
    const stripes = this._striped || this._animated ? ' wt-progressbar-striped' : '';
    const moving = this._animated ? ' wt-progressbar-animated' : '';
    return `wt-progressbar p-progressbar p-component wt-progressbar-${this.mode} p-progressbar-${this.mode}${stripes}${moving}`;
  }

  get label(): string {
    return this.ariaLabel || this.config.translation.loading;
  }
}
