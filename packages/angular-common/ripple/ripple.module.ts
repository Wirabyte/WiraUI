import { NgModule } from '@angular/core';
import { WuRipple } from './ripple.directive';

/** For NgModule apps. Standalone apps can import `WuRipple` directly. */
@NgModule({
  imports: [WuRipple],
  exports: [WuRipple],
})
export class WuRippleModule {}
