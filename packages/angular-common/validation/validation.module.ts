import { NgModule } from '@angular/core';
import { WtFieldError } from './field-error.component';
import { WtMatchValidator, WtThaiIdValidator, WtThaiPhoneValidator } from './validators';

const ALL = [WtFieldError, WtThaiIdValidator, WtThaiPhoneValidator, WtMatchValidator];

/** For NgModule apps: `wt-field-error` and the `wtThaiId`, `wtThaiPhone`, `wtMatch` validators. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtValidationModule {}
