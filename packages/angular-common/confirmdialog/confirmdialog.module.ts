import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuConfirmDialog } from './confirmdialog.component';

/** For NgModule apps. Also exports `WuTemplate` for the header, message and footer slots. */
@NgModule({
  imports: [WuConfirmDialog, WuTemplate],
  exports: [WuConfirmDialog, WuTemplate],
})
export class WuConfirmDialogModule {}
