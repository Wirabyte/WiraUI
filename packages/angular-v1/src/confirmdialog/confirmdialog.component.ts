import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WtDialog } from 'wiratheme/dialog';
import { ɵWtConfirmDialogBase } from './confirmdialog.base';

/**
 * Asks before an action: place `<wt-confirmdialog>` once, then `confirmation.confirm({ message, accept })`.
 * Custom footers can call `cd.accept()` / `cd.reject()` on `#cd`.
 */
@Component({
  selector: 'wt-confirmdialog, wt-confirmDialog, wt-confirm-dialog',
  standalone: true,
  imports: [NgIf, NgClass, NgSwitch, NgSwitchCase, NgTemplateOutlet, WtDialog],
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtConfirmDialog extends ɵWtConfirmDialogBase {
  protected readonly rejectFallback = 'p-button-text';
}
