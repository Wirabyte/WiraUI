import { NgModule } from '@angular/core';
import { WtKnob } from './knob.component';

/** For NgModule apps. Standalone apps can import `WtKnob` directly. */
@NgModule({
  imports: [WtKnob],
  exports: [WtKnob],
})
export class WtKnobModule {}
