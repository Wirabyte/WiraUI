import { NgModule } from '@angular/core';
import { WtRipple } from './ripple.directive';

/** For NgModule apps. Standalone apps can import `WtRipple` directly. */
@NgModule({
  imports: [WtRipple],
  exports: [WtRipple],
})
export class WtRippleModule {}
