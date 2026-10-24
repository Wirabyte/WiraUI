import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, WT_VERSION_INFO } from 'wiratheme/config';
import { WtCardVariant } from './card.types';

/**
 * Card with `header` / `subheader` inputs and projected slots:
 * `[wtCardHeader]` (top media), `[wtCardActions]` (right of the title), default content, `[wtCardFooter]`.
 * Extras: `variant` (outlined, elevated, and glass from v3 on) and `loading` (skeleton lines instead of content).
 */
@Component({
  selector: 'wt-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtCard {
  readonly header = input<string>();
  readonly subheader = input<string>();
  readonly variant = input<WtCardVariant>('default');
  readonly loading = input(false, { transform: booleanAttribute });

  readonly classes = computed(() => {
    const c = ['wt-card', 'p-card', 'p-component'];
    const variant = this.variant();
    // Glass is a v3 look; v2 shows a plain card.
    if (variant !== 'default' && (variant !== 'glass' || WT_VERSION_INFO.major >= 3)) c.push('wt-card-' + variant);
    if (this.loading()) c.push('wt-card-loading');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
