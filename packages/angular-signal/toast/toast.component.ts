import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuToastBase } from './toast.base';

/**
 * Toast stack: place `<wu-toast>` once (per key), then `messages.add({ severity: 'success', summary, detail })`.
 * Shows above dialogs, pauses while hovered, and spans the screen on phones.
 */
@Component({
  selector: 'wu-toast',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './toast.component.html',
  styleUrl: './toast.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuToast extends ɵWuToastBase {}
