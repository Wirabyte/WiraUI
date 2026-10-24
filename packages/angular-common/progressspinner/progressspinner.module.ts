import { NgModule } from '@angular/core';
import { WtProgressSpinner } from './progressspinner.component';

/** For NgModule apps. Standalone apps can import `WtProgressSpinner` directly. */
@NgModule({
  imports: [WtProgressSpinner],
  exports: [WtProgressSpinner],
})
export class WtProgressSpinnerModule {}
