import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK } from 'wiraui/config';
import { WuDividerAlign, WuDividerLayout, WuDividerType } from './divider.types';

/** Line between sections, horizontal or vertical, with optional content on it: `<wu-divider align="center">หรือ</wu-divider>`. */
@Component({
  selector: 'wu-divider',
  standalone: true,
  templateUrl: './divider.component.html',
  styleUrl: './divider.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.wu-divider-host-vertical]': "layout() === 'vertical'" },
})
export class WuDivider {
  readonly layout = input<WuDividerLayout>('horizontal');
  readonly type = input<WuDividerType>('solid');
  readonly align = input<WuDividerAlign>();

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
      'wu-divider',
      'p-divider',
      'p-component',
      `wu-divider-${layout}`,
      `p-divider-${layout}`,
      `wu-divider-${this.type()}`,
      `p-divider-${this.type()}`,
      `wu-divider-${align}`,
      `p-divider-${align}`,
    ].join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }
}
