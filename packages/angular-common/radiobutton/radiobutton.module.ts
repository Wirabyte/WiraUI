import { NgModule } from '@angular/core';
import { WtRadioButton } from './radiobutton.component';

/** For NgModule apps. Standalone apps can import `WtRadioButton` directly. */
@NgModule({
  imports: [WtRadioButton],
  exports: [WtRadioButton],
})
export class WtRadioButtonModule {}
