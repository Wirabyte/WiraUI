import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuPickListBase } from './picklist.base';

/**
 * Two lists to move items between: `<wu-picklist [source]="available" [target]="chosen" sourceHeader="ทั้งหมด"
 * targetHeader="ที่เลือก" filterBy="name" [dragdrop]="true">` with the app's `item` template. `wu-pickList` is the same.
 */
@Component({
  selector: 'wu-picklist, wu-pickList, wu-pick-list',
  standalone: true,
  exportAs: 'wuPickList',
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './picklist.component.html',
  styleUrl: './picklist.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuPickList extends ɵWuPickListBase {}
