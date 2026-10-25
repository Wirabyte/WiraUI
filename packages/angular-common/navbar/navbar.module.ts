import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtNavbar } from './navbar.component';

/** For NgModule apps (with `WtTemplate` for `wtTemplate="start"` / `"end"` / `"item"`). Standalone apps can import `WtNavbar` directly. */
@NgModule({
  imports: [WtNavbar, WtTemplate],
  exports: [WtNavbar, WtTemplate],
})
export class WtNavbarModule {}
