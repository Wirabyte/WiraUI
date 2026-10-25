import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtMultiSelect } from './multiselect.component';

/** For NgModule apps. Standalone apps can import `WtMultiSelect` directly. */
@NgModule({
  imports: [WtMultiSelect, WtTemplate],
  exports: [WtMultiSelect, WtTemplate],
})
export class WtMultiSelectModule {}
