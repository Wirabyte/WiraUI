import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuPopoverBase } from './popover.base';

/**
 * A panel under whatever opened it: `<wu-popover #op>…</wu-popover>` + `(click)="op.toggle($event)"`.
 * In the top layer, so it shows above dialogs and is never clipped; flips above when there is no room below.
 */
@Component({
  selector: 'wu-popover, wu-overlaypanel, wu-overlayPanel',
  standalone: true,
  exportAs: 'wuPopover',
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './popover.component.html',
  styleUrl: './popover.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuPopover extends ɵWuPopoverBase {}
