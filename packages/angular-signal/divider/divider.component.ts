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
