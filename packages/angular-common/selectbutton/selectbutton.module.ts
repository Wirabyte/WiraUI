import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtSelectButton } from './selectbutton.component';

/** For NgModule apps. Standalone apps can import `WtSelectButton` directly. */
@NgModule({
  imports: [WtSelectButton, WtTemplate],
  exports: [WtSelectButton, WtTemplate],
})
export class WtSelectButtonModule {}
