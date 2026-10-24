import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtPopoverBase } from './popover.base';

/**
 * A panel under whatever opened it: `<wt-popover #op>…</wt-popover>` + `(click)="op.toggle($event)"`.
 * In the top layer, so it shows above dialogs and is never clipped; flips above when there is no room below.
 */
@Component({
  selector: 'wt-popover, wt-overlaypanel, wt-overlayPanel',
  standalone: true,
  exportAs: 'wtPopover',
  imports: [NgClass, NgStyle],
  templateUrl: './popover.component.html',
  styleUrl: './popover.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPopover extends ɵWtPopoverBase {}
