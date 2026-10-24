import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/** Busy indicator: `<wt-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and colours. */
@Component({
  selector: 'wt-progress-spinner',
  standalone: true,
  templateUrl: './progressspinner.component.html',
  styleUrl: './progressspinner.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtProgressSpinner {
  readonly strokeWidth = input('2');
  readonly fill = input('none');
  readonly animationDuration = input('2s');
  readonly ariaLabel = input<string>();

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
