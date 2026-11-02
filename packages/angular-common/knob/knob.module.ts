import { NgModule } from '@angular/core';
import { WuKnob } from './knob.component';

/** For NgModule apps. Standalone apps can import `WuKnob` directly. */
@NgModule({
  imports: [WuKnob],
  exports: [WuKnob],
})
export class WuKnobModule {}
