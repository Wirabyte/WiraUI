import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtAsideMenu } from './asidemenu.component';

/** For NgModule apps (with `WtTemplate` for `wtTemplate="start"` / `"end"` / `"item"`). Standalone apps can import `WtAsideMenu` directly. */
@NgModule({
  imports: [WtAsideMenu, WtTemplate],
  exports: [WtAsideMenu, WtTemplate],
})
export class WtAsideMenuModule {}
