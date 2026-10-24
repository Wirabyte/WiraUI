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
  selector: 'wt-iconfield',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-iconfield p-iconfield' },
})
export class WtIconField {
  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}

/** The icon inside a `wt-iconfield`: `icon="pi pi-search"`, or project an <svg>. */
@Component({
  selector: 'wt-inputicon',
  standalone: true,
  imports: [NgIf],
  template: '<span *ngIf="icon" [class]="icon"></span><ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-inputicon p-inputicon', 'aria-hidden': 'true' },
})
export class WtInputIcon {
  /** Icon class, e.g. `pi pi-search`. */
  @Input() icon?: string;
}
