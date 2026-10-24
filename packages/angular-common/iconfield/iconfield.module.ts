import { NgModule } from '@angular/core';
import { WtIconField, WtInputIcon } from './iconfield.component';

/** For NgModule apps. Standalone apps can import `WtIconField` and `WtInputIcon` directly. */
@NgModule({
  imports: [WtIconField, WtInputIcon],
  exports: [WtIconField, WtInputIcon],
})
export class WtIconFieldModule {}
