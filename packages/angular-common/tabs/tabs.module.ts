import { NgModule } from '@angular/core';
import { WtTabPanel, WtTabs } from './tabs.component';

/** For NgModule apps. Standalone apps can import `WtTabs` and `WtTabPanel` directly. */
@NgModule({
  imports: [WtTabs, WtTabPanel],
  exports: [WtTabs, WtTabPanel],
})
export class WtTabsModule {}
