import { NgModule } from '@angular/core';
import { WuProgressSpinner } from './progressspinner.component';

/** For NgModule apps. Standalone apps can import `WuProgressSpinner` directly. */
@NgModule({
  imports: [WuProgressSpinner],
  exports: [WuProgressSpinner],
})
export class WuProgressSpinnerModule {}
