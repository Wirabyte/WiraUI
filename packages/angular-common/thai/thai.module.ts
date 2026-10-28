import { NgModule } from '@angular/core';
import { WtBahtTextPipe, WtDatePipe, WtThaiDigitsPipe, WtThaiIdPipe, WtThaiPhonePipe, WtTimeAgoPipe } from './thai.pipes';

const PIPES = [WtDatePipe, WtTimeAgoPipe, WtBahtTextPipe, WtThaiPhonePipe, WtThaiIdPipe, WtThaiDigitsPipe];

/** For NgModule apps: every Thai pipe. Standalone apps import the pipes they use (`WtDatePipe` …). */
@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class WtThaiModule {}
