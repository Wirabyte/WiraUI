import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtTable } from './table.component';
import { WtCellEditor } from './table-celleditor.component';
import { WtColumnFilter } from './table-filter.component';
import {
  WtCancelEditableRow,
  WtEditableColumn,
  WtEditableRow,
  WtFrozenColumn,
  WtInitEditableRow,
  WtReorderableColumn,
  WtResizableColumn,
  WtSaveEditableRow,
  WtReorderableRow,
  WtReorderableRowHandle,
  WtSelectableRowDblClick,
  WtContextMenuRow,
  WtTableRadioButton,
  WtRowGroupHeader,
  WtRowToggler,
  WtSelectableRow,
  WtSortableColumn,
  WtSortIcon,
  WtTableCheckbox,
  WtTableHeaderCheckbox,
} from './table.directives';

const ALL = [
  WtTable,
  WtSortableColumn,
  WtSortIcon,
  WtSelectableRow,
  WtTableCheckbox,
  WtTableHeaderCheckbox,
  WtFrozenColumn,
  WtRowToggler,
  WtRowGroupHeader,
  WtColumnFilter,
  WtTableRadioButton,
  WtSelectableRowDblClick,
  WtContextMenuRow,
  WtReorderableRow,
  WtReorderableRowHandle,
  WtEditableColumn,
  WtCellEditor,
  WtEditableRow,
  WtInitEditableRow,
  WtSaveEditableRow,
  WtCancelEditableRow,
  WtResizableColumn,
  WtReorderableColumn,
  WtTemplate,
];

/** For NgModule apps: the table, its column / row / checkbox / filter directives and `wtTemplate` (`pTemplate`). */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtTableModule {}
