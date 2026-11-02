import { NgModule } from '@angular/core';
import { WuTieredMenu } from './tieredmenu.component';

/** For NgModule apps. Standalone apps can import `WuTieredMenu` directly. */
@NgModule({
  imports: [WuTieredMenu],
  exports: [WuTieredMenu],
})
export class WuTieredMenuModule {}
