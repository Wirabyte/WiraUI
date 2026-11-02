import { NgModule } from '@angular/core';
import { WuFieldError } from './field-error.component';
import { WuMatchValidator, WuThaiIdValidator, WuThaiPhoneValidator } from './validators';

const ALL = [WuFieldError, WuThaiIdValidator, WuThaiPhoneValidator, WuMatchValidator];

/** For NgModule apps: `wu-field-error` and the `wuThaiId`, `wuThaiPhone`, `wuMatch` validators. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuValidationModule {}
