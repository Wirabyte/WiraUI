import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuAsideMenu } from './asidemenu.component';

/** For NgModule apps (with `WuTemplate` for `wuTemplate="start"` / `"end"` / `"item"`). Standalone apps can import `WuAsideMenu` directly. */
@NgModule({
  imports: [WuAsideMenu, WuTemplate],
  exports: [WuAsideMenu, WuTemplate],
})
export class WuAsideMenuModule {}
