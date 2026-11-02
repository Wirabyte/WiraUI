import { NgModule } from '@angular/core';
import { WuFooter, WuHeader } from 'wiraui/card';
import { WuTemplate } from 'wiraui/config';
import { WuPanel } from './panel.component';

/** For NgModule apps. Standalone apps can import `WuPanel` directly. `<wu-header>` / `<wu-footer>` slots come with it. */
@NgModule({
  imports: [WuPanel, WuHeader, WuFooter, WuTemplate],
  exports: [WuPanel, WuHeader, WuFooter, WuTemplate],
})
export class WuPanelModule {}
