import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuPopover } from './popover.component';

/** For NgModule apps. Standalone apps can import `WuPopover` directly. */
@NgModule({
  imports: [WuPopover, WuTemplate],
  exports: [WuPopover, WuTemplate],
})
export class WuPopoverModule {}
