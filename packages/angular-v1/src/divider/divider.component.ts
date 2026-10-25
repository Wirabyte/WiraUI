import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtDividerAlign, WtDividerLayout, WtDividerType } from './divider.types';

/** Line between sections, horizontal or vertical, with optional content on it: `<wt-divider align="center">หรือ</wt-divider>`. */
@Component({
  selector: 'wt-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtDivider {
  @Input() layout: WtDividerLayout = 'horizontal';
  @Input() type: WtDividerType = 'solid';
  @Input() align?: WtDividerAlign;

  @HostBinding('class.wt-divider-host-vertical') get vertical(): boolean {
    return this.layout === 'vertical';
  }

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
      'wt-divider',
      'p-divider',
      'p-component',
      `wt-divider-${this.layout}`,
      `p-divider-${this.layout}`,
      `wt-divider-${this.type}`,
      `p-divider-${this.type}`,
      `wt-divider-${align}`,
      `p-divider-${align}`,
    ].join(' ');
  }
}
