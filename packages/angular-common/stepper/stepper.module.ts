import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuStep, WuStepItem, WuStepList, WuStepPanel, WuStepPanels, WuStepper } from './stepper.component';

const ALL = [WuStepper, WuStepList, WuStep, WuStepPanels, WuStepPanel, WuStepItem, WuTemplate];

/** For NgModule apps: the stepper, its parts and `wuTemplate` (`pTemplate`). */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuStepperModule {}
