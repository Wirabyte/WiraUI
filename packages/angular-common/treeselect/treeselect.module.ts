import { NgModule } from '@angular/core';
import { WuTreeSelect } from './treeselect.component';

/** For NgModule apps. Standalone apps can import `WuTreeSelect` directly. */
@NgModule({
  imports: [WuTreeSelect],
  exports: [WuTreeSelect],
})
export class WuTreeSelectModule {}
