import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK } from '@wirabyte/ui/config';
import { WuDividerAlign, WuDividerLayout, WuDividerType } from './divider.types';

/** Line between sections, horizontal or vertical, with optional content on it: `<wu-divider align="center">หรือ</wu-divider>`. */
@Component({
  selector: 'wu-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuDivider {
  @Input() layout: WuDividerLayout = 'horizontal';
  @Input() type: WuDividerType = 'solid';
  @Input() align?: WuDividerAlign;

  @HostBinding('class.wu-divider-host-vertical') get vertical(): boolean {
    return this.layout === 'vertical';
  }

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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
    const align = this.align || (this.layout === 'horizontal' ? 'left' : 'center');
    return [
      'wu-divider',
      'p-divider',
      'p-component',
      `wu-divider-${this.layout}`,
      `p-divider-${this.layout}`,
      `wu-divider-${this.type}`,
      `p-divider-${this.type}`,
      `wu-divider-${align}`,
      `p-divider-${align}`,
    ].join(' ');
  }
}
