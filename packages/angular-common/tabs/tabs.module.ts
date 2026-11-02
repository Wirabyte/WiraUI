import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuTabMenu } from './tabmenu.component';
import { WuTab, WuTabList, WuTabPanel, WuTabPanels, WuTabs } from './tabs.component';

const ALL = [WuTabs, WuTabPanel, WuTabList, WuTab, WuTabPanels, WuTabMenu, WuTemplate];

/** For NgModule apps. Standalone apps can import `WuTabs`, `WuTabPanel` (and `WuTabList`, `WuTab`, `WuTabPanels`) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuTabsModule {}
