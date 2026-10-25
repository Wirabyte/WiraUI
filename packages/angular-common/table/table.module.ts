import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtTable } from './table.component';
import { WtSelectableRow, WtSortableColumn, WtSortIcon, WtTableCheckbox, WtTableHeaderCheckbox } from './table.directives';

const ALL = [WtTable, WtSortableColumn, WtSortIcon, WtSelectableRow, WtTableCheckbox, WtTableHeaderCheckbox, WtTemplate];

/** For NgModule apps: the table, its column / row / checkbox directives and `wtTemplate` (`pTemplate`). */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtTableModule {}
