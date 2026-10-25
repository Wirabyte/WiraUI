import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtOrderListBase } from './orderlist.base';

/**
 * A list to put in order: `<wt-orderlist [value]="steps" header="ลำดับ" dataKey="id" [dragdrop]="true"
 * (onReorder)="save()">` with the app's `item` template. `wt-orderList` is the same.
 */
@Component({
  selector: 'wt-orderlist, wt-orderList, wt-order-list',
  standalone: true,
  exportAs: 'wtOrderList',
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './orderlist.component.html',
  styleUrl: './orderlist.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtOrderList extends ɵWtOrderListBase {}
