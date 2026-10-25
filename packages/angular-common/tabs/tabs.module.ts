import { NgModule } from '@angular/core';
import { WtTab, WtTabList, WtTabPanel, WtTabPanels, WtTabs } from './tabs.component';

const ALL = [WtTabs, WtTabPanel, WtTabList, WtTab, WtTabPanels];

/** For NgModule apps. Standalone apps can import `WtTabs`, `WtTabPanel` (and `WtTabList`, `WtTab`, `WtTabPanels`) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtTabsModule {}
