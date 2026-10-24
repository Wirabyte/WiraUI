import { NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtToastBase } from './toast.base';

/**
 * Toast stack: place `<wt-toast>` once (per key), then `messages.add({ severity: 'success', summary, detail })`.
 * Shows above dialogs, pauses while hovered, and spans the screen on phones.
 */
@Component({
  selector: 'wt-toast',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtToast extends ɵWtToastBase {}
