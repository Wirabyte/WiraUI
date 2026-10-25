import { NgModule } from '@angular/core';
import { WtTreeSelect } from './treeselect.component';

/** For NgModule apps. Standalone apps can import `WtTreeSelect` directly. */
@NgModule({
  imports: [WtTreeSelect],
  exports: [WtTreeSelect],
})
export class WtTreeSelectModule {}
