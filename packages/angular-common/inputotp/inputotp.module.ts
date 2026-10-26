import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtInputOtp } from './inputotp.component';

/** For NgModule apps. Standalone apps can import `WtInputOtp` directly. `wtTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WtInputOtp, WtTemplate],
  exports: [WtInputOtp, WtTemplate],
})
export class WtInputOtpModule {}
