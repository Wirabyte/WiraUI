import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵWU_SKIP_VERSION_CHECK } from 'wiraui/config';
import { WuBadgeSeverity, WuBadgeSize } from './badge.types';

/** Count or status pill: `<wu-badge value="8" severity="danger">`. Without a value it is a dot. */
@Component({
  selector: 'wu-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuBadge {
  @Input() value?: string | number | null;
  @Input() severity?: WuBadgeSeverity;
  @Input() size?: WuBadgeSize;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get hasValue(): boolean {
    return this.value !== undefined && this.value !== null && this.value !== '';
  }

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
  get classes(): string {
    return [this.baseClasses, this.styleClass].filter(Boolean).join(' ');
  }
  get baseClasses(): string {
    const sev = ɵseverity(this.severity);
    const c = ['wu-badge', 'p-badge', 'p-component'];
    if (sev !== 'primary') c.push('wu-badge-' + sev, 'p-badge-' + (sev === 'warn' ? 'warning' : sev));
    if (this.size === 'small') c.push('wu-badge-sm', 'p-badge-sm');
    if (this.size === 'large') c.push('wu-badge-lg', 'p-badge-lg');
    if (this.size === 'xlarge') c.push('wu-badge-xl', 'p-badge-xl');
    if (!this.hasValue) c.push('wu-badge-dot', 'p-badge-dot');
    return c.join(' ');
  }
}
