import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtPanelMenu } from './panelmenu.component';

/** For NgModule apps. Standalone apps can import `WtPanelMenu` directly. */
@NgModule({
  imports: [WtPanelMenu, WtTemplate],
  exports: [WtPanelMenu, WtTemplate],
})
export class WtPanelMenuModule {}
