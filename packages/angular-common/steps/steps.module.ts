import { NgModule } from '@angular/core';
import { WuSteps } from './steps.component';

/** For NgModule apps. Standalone apps can import `WuSteps` directly. */
@NgModule({
  imports: [WuSteps],
  exports: [WuSteps],
})
export class WuStepsModule {}
