import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuTabMenu } from './tabmenu.component';

/** For NgModule apps. Standalone apps can import `WuTabMenu` directly. */
@NgModule({
  imports: [WuTabMenu, WuTemplate],
  exports: [WuTabMenu, WuTemplate],
})
export class WuTabMenuModule {}
