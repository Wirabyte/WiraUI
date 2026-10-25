import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtPopover } from './popover.component';

/** For NgModule apps. Standalone apps can import `WtPopover` directly. */
@NgModule({
  imports: [WtPopover, WtTemplate],
  exports: [WtPopover, WtTemplate],
})
export class WtPopoverModule {}
