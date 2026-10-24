import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtDialogBase } from './dialog.base';

/**
 * Dialog: `<wt-dialog header="แก้ไขข้อมูล" [(visible)]="open" [style]="{ width: '50vw' }">…</wt-dialog>`.
 * A native modal <dialog> in the top layer, so no appendTo or z-index; focus stays inside and returns on close.
 * Slots: `<ng-template #footer>` (or `wtTemplate="footer"`, also header, content, headless), or `<wt-footer>`.
 */
@Component({
  selector: 'wt-dialog',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtDialog extends ɵWtDialogBase {}
