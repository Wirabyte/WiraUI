import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuFieldset } from './fieldset.component';

/** For NgModule apps. Standalone apps can import `WuFieldset` directly. */
@NgModule({
  imports: [WuFieldset, WuTemplate],
  exports: [WuFieldset, WuTemplate],
})
export class WuFieldsetModule {}
