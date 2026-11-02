import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from 'wiraui/config';
import { ɵWU_INPUTTEXT_CSS } from 'wiraui/inputtext';

/**
 * Field with an icon inside it. An icon before the input sits on the left, one after it on the right:
 * `<wu-iconfield><wu-inputicon icon="pi pi-search"></wu-inputicon><input wuInputText /></wu-iconfield>`.
 * The older `<span class="p-input-icon-left"><i class="pi pi-search"></i><input …></span>` markup is styled too.
 */
@Component({
  selector: 'wu-iconfield, wu-iconField, wu-icon-field',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-iconfield p-iconfield',
    '[class]': "styleClass || ''",
    '[style]': 'hostStyle',
    '[class.wu-iconfield-left]': "iconPosition === 'left'",
    '[class.wu-iconfield-right]': "iconPosition === 'right'",
  },
})
export class WuIconField {
  /** Side of the icon. Default: from the markup (an icon before the input sits on the left, after it on the right). */
  @Input() iconPosition?: 'left' | 'right';
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

/** The icon inside a `wu-iconfield`: `icon="pi pi-search"`, or project an <svg>. */
@Component({
  selector: 'wu-inputicon, wu-inputIcon, wu-input-icon',
  standalone: true,
  imports: [NgIf],
  template: '<span *ngIf="icon" [class]="icon"></span><ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-inputicon p-inputicon', 'aria-hidden': 'true', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WuInputIcon {
  /** Classes for the element, as before. */
  @Input() styleClass?: string | null;
  /** Inline styles as an object: `[style]="{ width: '20rem' }"` (a plain style attribute works as it is). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get hostStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  /** Icon class, e.g. `pi pi-search`. */
  @Input() icon?: string;
}
