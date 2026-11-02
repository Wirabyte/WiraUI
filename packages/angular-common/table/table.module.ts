import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuTable } from './table.component';
import { WuCellEditor } from './table-celleditor.component';
import { WuColumnFilter } from './table-filter.component';
import {
  WuCancelEditableRow,
  WuEditableColumn,
  WuEditableRow,
  WuFrozenColumn,
  WuInitEditableRow,
  WuReorderableColumn,
  WuResizableColumn,
  WuSaveEditableRow,
  WuReorderableRow,
  WuReorderableRowHandle,
  WuSelectableRowDblClick,
  WuContextMenuRow,
  WuTableRadioButton,
  WuRowGroupHeader,
  WuRowToggler,
  WuSelectableRow,
  WuSortableColumn,
  WuSortIcon,
  WuTableCheckbox,
  WuTableHeaderCheckbox,
} from './table.directives';

const ALL = [
  WuTable,
  WuSortableColumn,
  WuSortIcon,
  WuSelectableRow,
  WuTableCheckbox,
  WuTableHeaderCheckbox,
  WuFrozenColumn,
  WuRowToggler,
  WuRowGroupHeader,
  WuColumnFilter,
  WuTableRadioButton,
  WuSelectableRowDblClick,
  WuContextMenuRow,
  WuReorderableRow,
  WuReorderableRowHandle,
  WuEditableColumn,
  WuCellEditor,
  WuEditableRow,
  WuInitEditableRow,
  WuSaveEditableRow,
  WuCancelEditableRow,
  WuResizableColumn,
  WuReorderableColumn,
  WuTemplate,
];

/** For NgModule apps: the table, its column / row / checkbox / filter directives and `wuTemplate` (`pTemplate`). */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuTableModule {}
