import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtBadgeSeverity, WtBadgeSize } from './badge.types';

/** Count or status pill: `<wt-badge value="8" severity="danger">`. Without a value it is a dot. */
@Component({
  selector: 'wt-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtBadge {
  @Input() value?: string | number | null;
  @Input() severity?: WtBadgeSeverity;
  @Input() size?: WtBadgeSize;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get hasValue(): boolean {
    return this.value !== undefined && this.value !== null && this.value !== '';
  }

  get classes(): string {
    const sev = ɵseverity(this.severity);
    const c = ['wt-badge', 'p-badge', 'p-component'];
    if (sev !== 'primary') c.push('wt-badge-' + sev, 'p-badge-' + (sev === 'warn' ? 'warning' : sev));
    if (this.size === 'small') c.push('wt-badge-sm', 'p-badge-sm');
    if (this.size === 'large') c.push('wt-badge-lg', 'p-badge-lg');
    if (this.size === 'xlarge') c.push('wt-badge-xl', 'p-badge-xl');
    if (!this.hasValue) c.push('wt-badge-dot', 'p-badge-dot');
    return c.join(' ');
  }
}
