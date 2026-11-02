import { NgModule } from '@angular/core';
import { WuToggleButton } from './togglebutton.component';

/** For NgModule apps. Standalone apps can import `WuToggleButton` directly. */
@NgModule({
  imports: [WuToggleButton],
  exports: [WuToggleButton],
})
export class WuToggleButtonModule {}
