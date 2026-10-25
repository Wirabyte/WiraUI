import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/** Busy indicator: `<wt-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and colours. */
@Component({
  selector: 'wt-progress-spinner, wt-progressspinner, wt-progressSpinner',
  standalone: true,
  templateUrl: './progressspinner.component.html',
  styleUrl: './progressspinner.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A size in the `[style]` object sizes the host too (the ring fills the host).
  host: { '[style.width]': 'hostSize().width', '[style.height]': 'hostSize().height' },
})
export class WtProgressSpinner {
  readonly strokeWidth = input('2');
  readonly fill = input('none');
  readonly animationDuration = input('2s');
  readonly ariaLabel = input<string>();
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });

  readonly hostSize = computed(() => {
    const s = this.rootStyle();
    return { width: (s?.['width'] as string | undefined) ?? null, height: (s?.['height'] as string | undefined) ?? null };
  });

  private readonly config = inject(WtConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  label(): string {
    return this.ariaLabel() || this.config.translation.loading;
  }
}
