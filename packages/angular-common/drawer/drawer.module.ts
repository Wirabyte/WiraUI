import { NgModule } from '@angular/core';
import { WuDrawer } from './drawer.component';

/** For NgModule apps. Standalone apps can import `WuDrawer` directly. */
@NgModule({
  imports: [WuDrawer],
  exports: [WuDrawer],
})
export class WuDrawerModule {}
