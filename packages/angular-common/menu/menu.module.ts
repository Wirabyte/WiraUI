import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtMenu } from './menu.component';

/** For NgModule apps (with `WtTemplate` for `pTemplate="item"` and friends). Standalone apps can import `WtMenu` directly. */
@NgModule({
  imports: [WtMenu, WtTemplate],
  exports: [WtMenu, WtTemplate],
})
export class WtMenuModule {}
