import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuMultiSelect } from './multiselect.component';

/** For NgModule apps. Standalone apps can import `WuMultiSelect` directly. */
@NgModule({
  imports: [WuMultiSelect, WuTemplate],
  exports: [WuMultiSelect, WuTemplate],
})
export class WuMultiSelectModule {}
