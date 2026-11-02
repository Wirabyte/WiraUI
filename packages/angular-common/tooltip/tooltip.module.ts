import { NgModule } from '@angular/core';
import { WuTooltip } from './tooltip.directive';

/** For NgModule apps. Standalone apps can import `WuTooltip` directly. */
@NgModule({
  imports: [WuTooltip],
  exports: [WuTooltip],
})
export class WuTooltipModule {}
