import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';

/**
 * Joins fields, add-ons and buttons into one row with shared borders:
 * `<wt-inputgroup><wt-inputgroup-addon>฿</wt-inputgroup-addon><input wtInputText /><wt-button label="ค้นหา"></wt-button></wt-inputgroup>`.
 * The older `<div class="p-inputgroup">` / `<span class="p-inputgroup-addon">` markup is styled too.
 */
@Component({
  selector: 'wt-inputgroup, wt-inputGroup, wt-input-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputgroup p-inputgroup', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WtInputGroup {
  /** Classes for the element, as before. */
  @Input() styleClass?: string | null;
  /** Inline styles as an object: `[style]="{ width: '20rem' }"` (a plain style attribute works as it is). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get hostStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}

/** Text or icon attached to a field inside `wt-inputgroup`, e.g. a currency or unit. */
@Component({
  selector: 'wt-inputgroup-addon, wt-inputGroupAddon, wt-inputgroupaddon, wt-input-group-addon',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputgroup-addon p-inputgroup-addon', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WtInputGroupAddon {
  /** Classes for the element, as before. */
  @Input() styleClass?: string | null;
  /** Inline styles as an object: `[style]="{ width: '20rem' }"` (a plain style attribute works as it is). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get hostStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
}
