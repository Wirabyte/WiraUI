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
  selector: 'wt-floatlabel',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-floatlabel p-floatlabel' },
})
export class WtFloatLabel {
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
