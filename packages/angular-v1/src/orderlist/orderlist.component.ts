import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuOrderListBase } from './orderlist.base';

/**
 * A list to put in order: `<wu-orderlist [value]="steps" header="ลำดับ" dataKey="id" [dragdrop]="true"
 * (onReorder)="save()">` with the app's `item` template. `wu-orderList` is the same.
 */
@Component({
  selector: 'wu-orderlist, wu-orderList, wu-order-list',
  standalone: true,
  exportAs: 'wuOrderList',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuOrderList extends ɵWuOrderListBase {}
