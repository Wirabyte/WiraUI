import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtDialogFooter } from './dialog.base';
import { WtDialog } from './dialog.component';

/** For NgModule apps. Also exports `WtTemplate` (`<ng-template wtTemplate="footer">`) and `wt-footer`. */
@NgModule({
  imports: [WtDialog, WtDialogFooter, WtTemplate],
  exports: [WtDialog, WtDialogFooter, WtTemplate],
})
export class WtDialogModule {}
