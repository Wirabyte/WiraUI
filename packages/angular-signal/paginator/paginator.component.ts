import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WtSelect } from 'wiratheme/select';
import { ɵWtPaginatorBase } from './paginator.base';

/**
 * Page buttons for any list: `<wt-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="...">`.
 * wt-table has one built in (`[paginator]="true"`).
 */
@Component({
  selector: 'wt-paginator',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, FormsModule, WtSelect],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtPaginator extends ɵWtPaginatorBase {}
