import { NgModule } from '@angular/core';
import { WtPopover } from './popover.component';

/** For NgModule apps. Standalone apps can import `WtPopover` directly. */
@NgModule({
  imports: [WtPopover],
  exports: [WtPopover],
})
export class WtPopoverModule {}
