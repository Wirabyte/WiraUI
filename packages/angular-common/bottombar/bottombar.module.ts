import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtBottomBar } from './bottombar.component';

/** For NgModule apps (with `WtTemplate` for the `item` slot). Standalone apps can import `WtBottomBar` directly. */
@NgModule({
  imports: [WtBottomBar, WtTemplate],
  exports: [WtBottomBar, WtTemplate],
})
export class WtBottomBarModule {}
