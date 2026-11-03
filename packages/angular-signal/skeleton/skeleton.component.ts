import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK } from '@wirabyte/ui/config';
import { WuSkeletonAnimation, WuSkeletonShape } from './skeleton.types';

/** Placeholder while content loads: `<wu-skeleton width="10rem" height="1rem">`, `<wu-skeleton shape="circle" size="3rem">`. */
@Component({
  selector: 'wu-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuSkeleton {
  readonly shape = input<WuSkeletonShape>('rectangle');
  /** Width and height at once, e.g. `3rem` for an avatar placeholder. */
  readonly size = input<string>();
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly borderRadius = input<string>();
  readonly animation = input<WuSkeletonAnimation>('wave');

  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => { const s = this.style(); return s && typeof s === 'object' ? (s as Record<string, any>) : null; });
  readonly classes = computed(() => {
    const c = ['wu-skeleton', 'p-skeleton', 'p-component'];
    if (this.shape() === 'circle') c.push('wu-skeleton-circle', 'p-skeleton-circle');
    if (this.animation() === 'none') c.push('wu-skeleton-none', 'p-skeleton-none');
    const extra = this.styleClass();
    if (extra) c.push(extra);
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }
}
