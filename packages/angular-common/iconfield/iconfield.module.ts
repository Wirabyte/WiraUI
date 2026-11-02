import { NgModule } from '@angular/core';
import { WuIconField, WuInputIcon } from './iconfield.component';

/** For NgModule apps. Standalone apps can import `WuIconField` and `WuInputIcon` directly. */
@NgModule({
  imports: [WuIconField, WuInputIcon],
  exports: [WuIconField, WuInputIcon],
})
export class WuIconFieldModule {}
