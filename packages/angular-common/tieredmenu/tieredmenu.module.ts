import { NgModule } from '@angular/core';
import { WtTieredMenu } from './tieredmenu.component';

/** For NgModule apps. Standalone apps can import `WtTieredMenu` directly. */
@NgModule({
  imports: [WtTieredMenu],
  exports: [WtTieredMenu],
})
export class WtTieredMenuModule {}
