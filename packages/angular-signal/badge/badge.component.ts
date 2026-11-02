import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵseverity, ɵWU_SKIP_VERSION_CHECK } from 'wiraui/config';
import { WuBadgeSeverity, WuBadgeSize } from './badge.types';

/** Count or status pill: `<wu-badge value="8" severity="danger">`. Without a value it is a dot. */
@Component({
  selector: 'wu-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuBadge {
  readonly value = input<string | number | null>();
  readonly severity = input<WuBadgeSeverity>();
  readonly size = input<WuBadgeSize>();

  readonly hasValue = computed(() => this.value() !== undefined && this.value() !== null && this.value() !== '');
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
    const sev = ɵseverity(this.severity());
    const c = ['wu-badge', 'p-badge', 'p-component'];
    if (sev !== 'primary') c.push('wu-badge-' + sev, 'p-badge-' + sev);
    const size = this.size();
    if (size === 'small') c.push('wu-badge-sm', 'p-badge-sm');
    if (size === 'large') c.push('wu-badge-lg', 'p-badge-lg');
    if (size === 'xlarge') c.push('wu-badge-xl', 'p-badge-xl');
    if (!this.hasValue()) c.push('wu-badge-dot', 'p-badge-dot');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }
}
