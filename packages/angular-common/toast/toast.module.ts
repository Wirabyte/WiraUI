import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuToast } from './toast.component';

/** For NgModule apps. Also exports `WuTemplate` for the message and headless slots. */
@NgModule({
  imports: [WuToast, WuTemplate],
  exports: [WuToast, WuTemplate],
})
export class WuToastModule {}
