import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { WtPaginator } from 'wiratheme/paginator';
import { ɵWtTableBase } from './table.base';
import { ɵWT_TABLE } from './table.types';

/**
 * Data table: `<wt-table [value]="students" [paginator]="true" [rows]="10" dataKey="id">` with the app's own
 * `header` / `body` / `caption` / `emptymessage` templates (`wtTemplate="body"`, `pTemplate="body"` or `#body`).
 * Sorting (`wtSortableColumn` + `wt-sortIcon`), global search (`dt.filterGlobal(...)`), column filters, row selection
 * (`wtSelectableRow`, `wt-tableCheckbox`), lazy loading and a Thai page report. `wt-datatable` is the same component.
 */
@Component({
  selector: 'wt-table, wt-datatable',
  standalone: true,
  exportAs: 'wtTable',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, WtPaginator],
  templateUrl: './table.component.html',
  styleUrls: ['./table.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWT_TABLE, useExisting: forwardRef(() => WtTable) }],
  host: { class: 'wt-table-host' },
})
export class WtTable extends ɵWtTableBase {}
