import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtConfirmDialog } from './confirmdialog.component';

/** For NgModule apps. Also exports `WtTemplate` for the header, message and footer slots. */
@NgModule({
  imports: [WtConfirmDialog, WtTemplate],
  exports: [WtConfirmDialog, WtTemplate],
})
export class WtConfirmDialogModule {}
