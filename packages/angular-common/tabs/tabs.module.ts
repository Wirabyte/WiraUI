import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtTabMenu } from './tabmenu.component';
import { WtTab, WtTabList, WtTabPanel, WtTabPanels, WtTabs } from './tabs.component';

const ALL = [WtTabs, WtTabPanel, WtTabList, WtTab, WtTabPanels, WtTabMenu, WtTemplate];

/** For NgModule apps. Standalone apps can import `WtTabs`, `WtTabPanel` (and `WtTabList`, `WtTab`, `WtTabPanels`) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtTabsModule {}
