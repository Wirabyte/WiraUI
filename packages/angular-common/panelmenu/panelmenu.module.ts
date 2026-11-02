import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuPanelMenu } from './panelmenu.component';

/** For NgModule apps. Standalone apps can import `WuPanelMenu` directly. */
@NgModule({
  imports: [WuPanelMenu, WuTemplate],
  exports: [WuPanelMenu, WuTemplate],
})
export class WuPanelMenuModule {}
