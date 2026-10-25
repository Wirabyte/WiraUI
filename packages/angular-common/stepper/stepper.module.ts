import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtStep, WtStepItem, WtStepList, WtStepPanel, WtStepPanels, WtStepper } from './stepper.component';

const ALL = [WtStepper, WtStepList, WtStep, WtStepPanels, WtStepPanel, WtStepItem, WtTemplate];

/** For NgModule apps: the stepper, its parts and `wtTemplate` (`pTemplate`). */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtStepperModule {}
