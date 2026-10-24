import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtSkeletonAnimation, WtSkeletonShape } from './skeleton.types';

/** Placeholder while content loads: `<wt-skeleton width="10rem" height="1rem">`, `<wt-skeleton shape="circle" size="3rem">`. */
@Component({
  selector: 'wt-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtSkeleton {
  readonly shape = input<WtSkeletonShape>('rectangle');
  /** Width and height at once, e.g. `3rem` for an avatar placeholder. */
  readonly size = input<string>();
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly borderRadius = input<string>();
  readonly animation = input<WtSkeletonAnimation>('wave');

  readonly classes = computed(() => {
    const c = ['wt-skeleton', 'p-skeleton', 'p-component'];
    if (this.shape() === 'circle') c.push('wt-skeleton-circle', 'p-skeleton-circle');
    if (this.animation() === 'none') c.push('wt-skeleton-none', 'p-skeleton-none');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
