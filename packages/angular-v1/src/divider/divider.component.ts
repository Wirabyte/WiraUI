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

  get classes(): string {
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
