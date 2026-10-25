import { NgModule } from '@angular/core';
import { WtSteps } from './steps.component';

/** For NgModule apps. Standalone apps can import `WtSteps` directly. */
@NgModule({
  imports: [WtSteps],
  exports: [WtSteps],
})
export class WtStepsModule {}
