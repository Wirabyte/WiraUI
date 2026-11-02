import { NgModule } from '@angular/core';
import { WuRadioButton } from './radiobutton.component';

/** For NgModule apps. Standalone apps can import `WuRadioButton` directly. */
@NgModule({
  imports: [WuRadioButton],
  exports: [WuRadioButton],
})
export class WuRadioButtonModule {}
