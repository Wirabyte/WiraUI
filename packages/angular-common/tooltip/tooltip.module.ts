import { NgModule } from '@angular/core';
import { WtTooltip } from './tooltip.directive';

/** For NgModule apps. Standalone apps can import `WtTooltip` directly. */
@NgModule({
  imports: [WtTooltip],
  exports: [WtTooltip],
})
export class WtTooltipModule {}
