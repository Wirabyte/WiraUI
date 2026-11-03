import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate } from '@wirabyte/ui/config';
import { ɵspinnerColors, ɵspinnerMulticolor, WuProgressSpinnerLabelPosition } from './progressspinner.types';

/**
 * Busy indicator: `<wu-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and
 * colours; `[multicolor]` / `[colors]` change the colours it cycles through. With `label` (or a `label` template) the
 * text sits under the ring (or beside it, `labelPosition="right"`), centred for you.
 */
@Component({
  selector: 'wu-progress-spinner, wu-progressspinner, wu-progressSpinner',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './progressspinner.component.html',
  styleUrls: ['./progressspinner.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuProgressSpinner implements OnDestroy {
  @Input() strokeWidth = '2';
  @Input() fill = 'none';
  @Input() animationDuration = '2s';
  @Input() ariaLabel?: string;
  /** Size of the ring, e.g. `size="3rem"` (with a label the host grows to hold the text). */
  @Input() size?: string | number | null;
  /** true: cycle through the theme's colours (primary, info, success, warn); false: the primary colour only. */
  @Input() set multicolor(v: unknown) { this._multicolor = ɵspinnerMulticolor(v); }
  get multicolor(): boolean | undefined { return this._multicolor; }
  /** Own colours to cycle through: `[colors]="['#e8668e', '#3b6fd8', '#ff9a2e']"` (up to four are used). */
  @Input() colors?: readonly string[] | null;
  /** Text under the ring (or beside it), centred: `label="กำลังโหลด…"`. A `label` template takes its place. */
  @Input() label?: string | null;
  @Input() labelPosition: WuProgressSpinnerLabelPosition = 'bottom';
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @ContentChild('label', { descendants: false }) protected labelRef?: unknown;
  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;

  private _multicolor: boolean | undefined;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get ringSize(): string | null {
    const v = this.size;
    return v === null || v === undefined || v === '' ? null : typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v);
  }
  /** `<ng-template #label>` (or `wuTemplate="label"`): own content under the ring. */
  get labelTemplate(): TemplateRef<unknown> | null {
    return (this.labelRef instanceof TemplateRef ? this.labelRef : null) || ɵfindTemplate(this.templates, 'label');
  }
  @HostBinding('class.wu-progress-spinner-host-labelled') get labelled(): boolean {
    return !!this.label || !!this.labelTemplate;
  }
  @HostBinding('class.wu-progress-spinner-host-right') get beside(): boolean {
    return this.labelled && this.labelPosition === 'right';
  }
  /** A size in the `[style]` object (or `size`) sizes the host too (the ring fills the host) — unless there is a label. */
  @HostBinding('style.width') get hostWidth(): string | null {
    return this.labelled ? null : this.rootStyle?.['width'] ?? this.ringSize;
  }
  @HostBinding('style.height') get hostHeight(): string | null {
    return this.labelled ? null : this.rootStyle?.['height'] ?? this.ringSize;
  }
  @HostBinding('style') get colorVars(): Record<string, string> | null {
    return ɵspinnerColors(this._multicolor, this.colors);
  }

  get ariaText(): string {
    return this.ariaLabel || this.label || this.config.translation.loading;
  }
}
