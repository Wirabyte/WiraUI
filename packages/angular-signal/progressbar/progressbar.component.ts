import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtTemplate } from 'wiratheme/config';
import { ɵprogressPercent, ɵprogressText, WtProgressBarContext, WtProgressBarMode } from './progressbar.types';

/**
 * Progress, or an endless bar while the length is unknown: `<wt-progressbar [value]="60">`.
 * Counting items instead: `<wt-progressbar [value]="1000" [max]="2500" unit="รายการ">` shows `1,000 / 2,500 รายการ`.
 */
@Component({
  selector: 'wt-progressbar',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtProgressBar {
  readonly value = input(0, { transform: numberAttribute });
  /** What `value` counts up to. Default 100 (percent). */
  readonly max = input(100, { transform: (v: unknown) => (Number(v) > 0 ? Number(v) : 100) });
  /** Own words on the bar instead of the number: `text="อัปโหลด 3 จาก 10 ไฟล์"`. */
  readonly text = input<string>();
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly unit = input('%');
  readonly mode = input<WtProgressBarMode>('determinate');
  /** Bar colour, e.g. `var(--wt-success-color)`. */
  readonly color = input<string>();
  readonly ariaLabel = input<string>();

  private readonly config = inject(WtConfig);
  private readonly contentRef = contentChild('content', { descendants: false });
  private readonly templates = contentChildren(WtTemplate);
  /** Width of the bar, 0–100. */
  readonly percent = computed(() => ɵprogressPercent(this.value() || 0, this.max()));
  readonly done = computed(() => Math.min(this.max(), Math.max(0, this.value() || 0)));
  readonly shown = computed(() => this.text() || ɵprogressText(this.value() || 0, this.max(), this.unit()));
  /** `<ng-template #content let-value let-max="max" let-percent="percent">` (or `wtTemplate="content"`). */
  readonly contentTemplate = computed(() => {
    const own = this.contentRef();
    return ((own instanceof TemplateRef ? own : null) || ɵfindTemplate(this.templates(), 'content')) as TemplateRef<WtProgressBarContext> | null;
  });
  readonly context = computed<WtProgressBarContext>(() => ({ $implicit: this.value() || 0, value: this.value() || 0, max: this.max(), percent: this.percent() }));
  readonly classes = computed(() => `wt-progressbar p-progressbar p-component wt-progressbar-${this.mode()} p-progressbar-${this.mode()}`);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  label(): string {
    return this.ariaLabel() || this.config.translation.loading;
  }
}
