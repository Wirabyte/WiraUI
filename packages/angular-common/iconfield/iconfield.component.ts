import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';

/**
 * Field with an icon inside it. An icon before the input sits on the left, one after it on the right:
 * `<wt-iconfield><wt-inputicon icon="pi pi-search"></wt-inputicon><input wtInputText /></wt-iconfield>`.
 * The older `<span class="p-input-icon-left"><i class="pi pi-search"></i><input …></span>` markup is styled too.
 */
@Component({
  selector: 'wt-iconfield, wt-iconField, wt-icon-field',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-iconfield p-iconfield',
    '[class]': "styleClass || ''",
    '[style]': 'hostStyle',
    '[class.wt-iconfield-left]': "iconPosition === 'left'",
    '[class.wt-iconfield-right]': "iconPosition === 'right'",
  },
})
export class WtIconField {
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
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}

/** The icon inside a `wt-iconfield`: `icon="pi pi-search"`, or project an <svg>. */
@Component({
  selector: 'wt-inputicon, wt-inputIcon, wt-input-icon',
  standalone: true,
  imports: [NgIf],
  template: '<span *ngIf="icon" [class]="icon"></span><ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputicon p-inputicon', 'aria-hidden': 'true', '[class]': "styleClass || ''", '[style]': 'hostStyle' },
})
export class WtInputIcon {
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
