import { NgModule } from '@angular/core';
import { WuCheckbox } from './checkbox.component';

/** For NgModule apps. Standalone apps can import `WuCheckbox` directly. */
@NgModule({
  imports: [WuCheckbox],
  exports: [WuCheckbox],
})
export class WuCheckboxModule {}
