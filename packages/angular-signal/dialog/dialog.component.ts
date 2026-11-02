import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuDialogBase } from './dialog.base';

/**
 * Dialog: `<wu-dialog header="แก้ไขข้อมูล" [(visible)]="open" [style]="{ width: '50vw' }">…</wu-dialog>`.
 * A native modal <dialog> in the top layer, so no appendTo or z-index; focus stays inside and returns on close.
 * Slots: `<ng-template #footer>` (or `wuTemplate="footer"`, also header, content, headless), or `<wu-footer>`.
 */
@Component({
  selector: 'wu-dialog',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuDialog extends ɵWuDialogBase {}
