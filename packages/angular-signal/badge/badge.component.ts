import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtBadgeSeverity, WtBadgeSize } from './badge.types';

/** Count or status pill: `<wt-badge value="8" severity="danger">`. Without a value it is a dot. */
@Component({
  selector: 'wt-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtBadge {
  readonly value = input<string | number | null>();
  readonly severity = input<WtBadgeSeverity>();
  readonly size = input<WtBadgeSize>();

  readonly hasValue = computed(() => this.value() !== undefined && this.value() !== null && this.value() !== '');
  readonly classes = computed(() => {
    const sev = ɵseverity(this.severity());
    const c = ['wt-badge', 'p-badge', 'p-component'];
    if (sev !== 'primary') c.push('wt-badge-' + sev, 'p-badge-' + sev);
    const size = this.size();
    if (size === 'small') c.push('wt-badge-sm', 'p-badge-sm');
    if (size === 'large') c.push('wt-badge-lg', 'p-badge-lg');
    if (size === 'xlarge') c.push('wt-badge-xl', 'p-badge-xl');
    if (!this.hasValue()) c.push('wt-badge-dot', 'p-badge-dot');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
