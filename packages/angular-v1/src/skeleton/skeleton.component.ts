import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtSkeletonAnimation, WtSkeletonShape } from './skeleton.types';

/** Placeholder while content loads: `<wt-skeleton width="10rem" height="1rem">`, `<wt-skeleton shape="circle" size="3rem">`. */
@Component({
  selector: 'wt-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtSkeleton {
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
  @Input() shape: WtSkeletonShape = 'rectangle';
  /** Width and height at once, e.g. `3rem` for an avatar placeholder. */
  @Input() size?: string;
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() borderRadius?: string;
  @Input() animation: WtSkeletonAnimation = 'wave';

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get classes(): string {
    const c = ['wt-skeleton', 'p-skeleton', 'p-component'];
    if (this.shape === 'circle') c.push('wt-skeleton-circle', 'p-skeleton-circle');
    if (this.animation === 'none') c.push('wt-skeleton-none', 'p-skeleton-none');
    if (this.styleClass) c.push(this.styleClass);
    return c.join(' ');
  }
}
