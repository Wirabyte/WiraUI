import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { WuPaginator } from 'wiraui/paginator';
import { ɵWuTableBase } from './table.base';
import { ɵWU_TABLE } from './table.types';

/**
 * Data table: `<wu-table [value]="students" [paginator]="true" [rows]="10" dataKey="id">` with the app's own
 * `header` / `body` / `caption` / `emptymessage` templates (`wuTemplate="body"`, `pTemplate="body"` or `#body`).
 * Sorting (`wuSortableColumn` + `wu-sortIcon`), global search (`dt.filterGlobal(...)`), column filters, row selection
 * (`wuSelectableRow`, `wu-tableCheckbox`), lazy loading and a Thai page report. `wu-datatable` is the same component.
 */
@Component({
  selector: 'wu-table, wu-datatable',
  standalone: true,
  exportAs: 'wuTable',
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, WuPaginator],
  templateUrl: './table.component.html',
  styleUrls: ['./table.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWU_TABLE, useExisting: forwardRef(() => WuTable) }],
  host: { class: 'wu-table-host' },
})
export class WuTable extends ɵWuTableBase {}
