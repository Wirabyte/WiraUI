import { NgModule } from '@angular/core';
import { WtDrawer } from './drawer.component';

/** For NgModule apps. Standalone apps can import `WtDrawer` directly. */
@NgModule({
  imports: [WtDrawer],
  exports: [WtDrawer],
})
export class WtDrawerModule {}
