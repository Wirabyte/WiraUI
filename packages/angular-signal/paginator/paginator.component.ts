import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WuSelect } from 'wiraui/select';
import { ɵWuPaginatorBase } from './paginator.base';

/**
 * Page buttons for any list: `<wu-paginator [first]="first" [rows]="10" [totalRecords]="120" (onPageChange)="...">`.
 * wu-table has one built in (`[paginator]="true"`).
 */
@Component({
  selector: 'wu-paginator',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, FormsModule, WuSelect],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuPaginator extends ɵWuPaginatorBase {}
