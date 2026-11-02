import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WuDialog } from 'wiraui/dialog';
import { ɵWuConfirmDialogBase } from './confirmdialog.base';

/**
 * Asks before an action: place `<wu-confirmdialog>` once, then `confirmation.confirm({ message, accept })`.
 * Custom footers can call `cd.accept()` / `cd.reject()` on `#cd`.
 */
@Component({
  selector: 'wu-confirmdialog, wu-confirmDialog, wu-confirm-dialog',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, WuDialog],
  templateUrl: './confirmdialog.component.html',
  styleUrl: './confirmdialog.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuConfirmDialog extends ɵWuConfirmDialogBase {
  protected readonly rejectFallback = 'p-button-secondary p-button-outlined';
}
