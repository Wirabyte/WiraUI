import { NgModule } from '@angular/core';
import { WtToggleButton } from './togglebutton.component';

/** For NgModule apps. Standalone apps can import `WtToggleButton` directly. */
@NgModule({
  imports: [WtToggleButton],
  exports: [WtToggleButton],
})
export class WtToggleButtonModule {}
