import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { WtFloatLabelVariant } from './floatlabel.types';

/**
 * Label that sits in the field and moves out of the way on focus or once there is a value:
 * `<wt-floatlabel><input wtInputText id="name" [(ngModel)]="name" /><label for="name">ชื่อ</label></wt-floatlabel>`.
 * The label must come after the field. The older `<span class="p-float-label">` markup is styled too.
 */
@Component({
  selector: 'wt-floatlabel, wt-floatLabel, wt-float-label',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-floatlabel p-floatlabel', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WtFloatLabel {
  /** Classes for the element, as before. */
  @Input() styleClass?: string | null;
  /** Inline styles as an object: `[style]="{ width: '20rem' }"` (a plain style attribute works as it is). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get hostStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  /** over: above the field; on: on its top border; in: inside the field, which grows to fit. */
  @Input() variant: WtFloatLabelVariant = 'over';

  @HostBinding('class.wt-floatlabel-on') get onBorder(): boolean {
    return this.variant === 'on';
  }
  @HostBinding('class.wt-floatlabel-in') get inside(): boolean {
    return this.variant === 'in';
  }

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}
