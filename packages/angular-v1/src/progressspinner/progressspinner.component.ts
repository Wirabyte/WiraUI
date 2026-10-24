import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/** Busy indicator: `<wt-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and colours. */
@Component({
  selector: 'wt-progress-spinner',
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
