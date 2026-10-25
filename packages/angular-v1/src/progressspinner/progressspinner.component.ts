import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/** Busy indicator: `<wt-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and colours. */
@Component({
  selector: 'wt-progress-spinner, wt-progressspinner, wt-progressSpinner',
  standalone: true,
  templateUrl: './progressspinner.component.html',
  styleUrls: ['./progressspinner.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtProgressSpinner implements OnDestroy {
  @Input() strokeWidth = '2';
  @Input() fill = 'none';
  @Input() animationDuration = '2s';
  @Input() ariaLabel?: string;
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
  /** A size in the `[style]` object sizes the host too (the ring fills the host). */
  @HostBinding('style.width') get hostWidth(): string | null {
    return this.rootStyle?.['width'] ?? null;
  }
  @HostBinding('style.height') get hostHeight(): string | null {
    return this.rootStyle?.['height'] ?? null;
  }

  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get label(): string {
    return this.ariaLabel || this.config.translation.loading;
  }
}
