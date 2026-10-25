import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtTabMenu } from './tabmenu.component';

/** For NgModule apps. Standalone apps can import `WtTabMenu` directly. */
@NgModule({
  imports: [WtTabMenu, WtTemplate],
  exports: [WtTabMenu, WtTemplate],
})
export class WtTabMenuModule {}
