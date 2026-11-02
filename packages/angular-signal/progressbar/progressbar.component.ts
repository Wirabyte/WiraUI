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
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate } from 'wiraui/config';
import { ɵprogressPercent, ɵprogressText, WuProgressBarContext, WuProgressBarMode } from './progressbar.types';

/**
 * Progress, or an endless bar while the length is unknown: `<wu-progressbar [value]="60">`.
 * Counting items instead: `<wu-progressbar [value]="1000" [max]="2500" unit="รายการ">` shows `1,000 / 2,500 รายการ`.
 */
@Component({
  selector: 'wu-progressbar, wu-progressBar, wu-progress-bar',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuProgressBar {
  readonly value = input(0, { transform: numberAttribute });
  /** What `value` counts up to. Default 100 (percent). */
  readonly max = input(100, { transform: (v: unknown) => (Number(v) > 0 ? Number(v) : 100) });
  /** Own words on the bar instead of the number: `text="อัปโหลด 3 จาก 10 ไฟล์"`. */
  readonly text = input<string>();
  readonly showValue = input(true, { transform: booleanAttribute });
  readonly unit = input('%');
  readonly mode = input<WuProgressBarMode>('determinate');
  /** Bar colour, e.g. `var(--wu-success-color)`. */
  readonly color = input<string>();
  /** Diagonal stripes on the bar. */
  readonly striped = input(false, { transform: booleanAttribute });
  /** Stripes that move, for work in progress (shown still to people who ask for less motion). */
  readonly animated = input(false, { transform: booleanAttribute });
  /** A glossy bar with a band of light sweeping along it now and then, as desktop progress bars do (a still gloss for people who ask for less motion). */
  readonly shimmer = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input<string>();

  private readonly config = inject(WuConfig);
  private readonly contentRef = contentChild('content', { descendants: false });
  private readonly templates = contentChildren(WuTemplate);
  /** Width of the bar, 0–100. */
  readonly percent = computed(() => ɵprogressPercent(this.value() || 0, this.max()));
  readonly done = computed(() => Math.min(this.max(), Math.max(0, this.value() || 0)));
  readonly shown = computed(() => this.text() || ɵprogressText(this.value() || 0, this.max(), this.unit()));
  /** `<ng-template #content let-value let-max="max" let-percent="percent">` (or `wuTemplate="content"`). */
  readonly contentTemplate = computed(() => {
    const own = this.contentRef();
    return ((own instanceof TemplateRef ? own : null) || ɵfindTemplate(this.templates(), 'content')) as TemplateRef<WuProgressBarContext> | null;
  });
  readonly context = computed<WuProgressBarContext>(() => ({ $implicit: this.value() || 0, value: this.value() || 0, max: this.max(), percent: this.percent() }));
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly classes = computed(() => [this.baseClasses(), this.styleClass()].filter(Boolean).join(' '));
  readonly baseClasses = computed(() => {
    const stripes = this.striped() || this.animated() ? ' wu-progressbar-striped' : '';
    const moving = this.animated() ? ' wu-progressbar-animated' : '';
    const shimmer = this.shimmer() ? ' wu-progressbar-shimmer' : '';
    return `wu-progressbar p-progressbar p-component wu-progressbar-${this.mode()} p-progressbar-${this.mode()}${stripes}${moving}${shimmer}`;
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  label(): string {
    return this.ariaLabel() || this.config.translation.loading;
  }
}
