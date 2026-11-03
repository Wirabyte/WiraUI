import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK, ɵWuStyleLoader } from '@wirabyte/ui/config';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import { ɵWuAlertDialogBase } from './alert-dialog.base';

/** The popup `WuAlert.fire()` shows. Created by `WuAlertService`; apps do not place it in templates. */
@Component({
  selector: 'wu-alertdialog',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase],
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuAlertDialog extends ɵWuAlertDialogBase {
  constructor() {
    super();
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('inputtext', ɵWU_INPUTTEXT_CSS);
  }
}
