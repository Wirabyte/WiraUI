import { NgModule } from '@angular/core';
import { WtToggleSwitch } from './toggleswitch.component';

/** For NgModule apps. Standalone apps can import `WtToggleSwitch` directly. */
@NgModule({
  imports: [WtToggleSwitch],
  exports: [WtToggleSwitch],
})
export class WtToggleSwitchModule {}
