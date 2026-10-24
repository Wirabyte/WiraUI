import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK, ɵWtStyleLoader } from 'wiratheme/config';
import { ɵWT_INPUTTEXT_CSS } from 'wiratheme/inputtext';
import { ɵWtAlertDialogBase } from './alert-dialog.base';

/** The popup `WtAlert.fire()` shows. Created by `WtAlertService`; apps do not place it in templates. */
@Component({
  selector: 'wt-alertdialog',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAlertDialog extends ɵWtAlertDialogBase {
  constructor() {
    super();
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWtStyleLoader).load('inputtext', ɵWT_INPUTTEXT_CSS);
  }
}
