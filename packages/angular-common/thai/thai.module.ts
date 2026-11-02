import { NgModule } from '@angular/core';
import { WuBahtTextPipe, WuDatePipe, WuThaiDigitsPipe, WuThaiIdPipe, WuThaiPhonePipe, WuTimeAgoPipe } from './thai.pipes';

const PIPES = [WuDatePipe, WuTimeAgoPipe, WuBahtTextPipe, WuThaiPhonePipe, WuThaiIdPipe, WuThaiDigitsPipe];

/** For NgModule apps: every Thai pipe. Standalone apps import the pipes they use (`WuDatePipe` …). */
@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class WuThaiModule {}
