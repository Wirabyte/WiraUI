import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtPickListBase } from './picklist.base';

/**
 * Two lists to move items between: `<wt-picklist [source]="available" [target]="chosen" sourceHeader="ทั้งหมด"
 * targetHeader="ที่เลือก" filterBy="name" [dragdrop]="true">` with the app's `item` template. `wt-pickList` is the same.
 */
@Component({
  selector: 'wt-picklist, wt-pickList, wt-pick-list',
  standalone: true,
  exportAs: 'wtPickList',
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './picklist.component.html',
  styleUrl: './picklist.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPickList extends ɵWtPickListBase {}
