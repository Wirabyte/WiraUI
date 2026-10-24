import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtToast } from './toast.component';

/** For NgModule apps. Also exports `WtTemplate` for the message and headless slots. */
@NgModule({
  imports: [WtToast, WtTemplate],
  exports: [WtToast, WtTemplate],
})
export class WtToastModule {}
