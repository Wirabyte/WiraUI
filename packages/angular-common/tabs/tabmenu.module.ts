import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuTabMenu } from './tabmenu.component';

/** For NgModule apps. Standalone apps can import `WuTabMenu` directly. */
@NgModule({
  imports: [WuTabMenu, WuTemplate],
  exports: [WuTabMenu, WuTemplate],
})
export class WuTabMenuModule {}
