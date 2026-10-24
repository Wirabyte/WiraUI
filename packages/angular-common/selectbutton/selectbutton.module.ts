import { NgModule } from '@angular/core';
import { WtSelectButton } from './selectbutton.component';

/** For NgModule apps. Standalone apps can import `WtSelectButton` directly. */
@NgModule({
  imports: [WtSelectButton],
  exports: [WtSelectButton],
})
export class WtSelectButtonModule {}
