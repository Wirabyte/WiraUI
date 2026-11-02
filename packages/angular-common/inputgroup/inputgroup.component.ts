import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from 'wiraui/config';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';

/**
 * Joins fields, add-ons and buttons into one row with shared borders:
 * `<wu-inputgroup><wu-inputgroup-addon>฿</wu-inputgroup-addon><input wuInputText /><wu-button label="ค้นหา"></wu-button></wu-inputgroup>`.
 * The older `<div class="p-inputgroup">` / `<span class="p-inputgroup-addon">` markup is styled too.
 */
@Component({
  selector: 'wu-inputgroup, wu-inputGroup, wu-input-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-inputgroup p-inputgroup', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WuInputGroup {
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
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }
}

/** Text or icon attached to a field inside `wu-inputgroup`, e.g. a currency or unit. */
@Component({
  selector: 'wu-inputgroup-addon, wu-inputGroupAddon, wu-inputgroupaddon, wu-input-group-addon',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-inputgroup-addon p-inputgroup-addon', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WuInputGroupAddon {
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
