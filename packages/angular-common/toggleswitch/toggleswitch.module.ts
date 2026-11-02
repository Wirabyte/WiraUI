import { NgModule } from '@angular/core';
import { WuToggleSwitch } from './toggleswitch.component';

/** For NgModule apps. Standalone apps can import `WuToggleSwitch` directly. */
@NgModule({
  imports: [WuToggleSwitch],
  exports: [WuToggleSwitch],
})
export class WuToggleSwitchModule {}
