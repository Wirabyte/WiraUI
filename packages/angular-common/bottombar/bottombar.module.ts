import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuBottomBar } from './bottombar.component';

/** For NgModule apps (with `WuTemplate` for the `item` slot). Standalone apps can import `WuBottomBar` directly. */
@NgModule({
  imports: [WuBottomBar, WuTemplate],
  exports: [WuBottomBar, WuTemplate],
})
export class WuBottomBarModule {}
