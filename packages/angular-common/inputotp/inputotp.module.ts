import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuInputOtp } from './inputotp.component';

/** For NgModule apps. Standalone apps can import `WuInputOtp` directly. `wuTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WuInputOtp, WuTemplate],
  exports: [WuInputOtp, WuTemplate],
})
export class WuInputOtpModule {}
