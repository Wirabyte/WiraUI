import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtDividerAlign, WtDividerLayout, WtDividerType } from './divider.types';

/** Line between sections, horizontal or vertical, with optional content on it: `<wt-divider align="center">หรือ</wt-divider>`. */
@Component({
  selector: 'wt-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrl: './divider.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.wt-divider-host-vertical]': "layout() === 'vertical'" },
})
export class WtDivider {
  readonly layout = input<WtDividerLayout>('horizontal');
  readonly type = input<WtDividerType>('solid');
  readonly align = input<WtDividerAlign>();

  readonly classes = computed(() => {
    const layout = this.layout();
    const align = this.align() || (layout === 'horizontal' ? 'left' : 'center');
    return [
      'wt-divider',
      'p-divider',
      'p-component',
      `wt-divider-${layout}`,
      `p-divider-${layout}`,
      `wt-divider-${this.type()}`,
      `p-divider-${this.type()}`,
      `wt-divider-${align}`,
      `p-divider-${align}`,
    ].join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }
}
