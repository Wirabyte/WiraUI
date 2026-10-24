import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';

/**
 * Joins fields, add-ons and buttons into one row with shared borders:
 * `<wt-inputgroup><wt-inputgroup-addon>฿</wt-inputgroup-addon><input wtInputText /><wt-button label="ค้นหา"></wt-button></wt-inputgroup>`.
 * The older `<div class="p-inputgroup">` / `<span class="p-inputgroup-addon">` markup is styled too.
 */
@Component({
  selector: 'wt-inputgroup',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputgroup p-inputgroup' },
})
export class WtInputGroup {
  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}

/** Text or icon attached to a field inside `wt-inputgroup`, e.g. a currency or unit. */
@Component({
  selector: 'wt-inputgroup-addon',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputgroup-addon p-inputgroup-addon' },
})
export class WtInputGroupAddon {}
