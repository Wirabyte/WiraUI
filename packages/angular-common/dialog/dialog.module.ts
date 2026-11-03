import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuDialogFooter } from './dialog.base';
import { WuDialog } from './dialog.component';

/** For NgModule apps. Also exports `WuTemplate` (`<ng-template wuTemplate="footer">`) and `wu-footer`. */
@NgModule({
  imports: [WuDialog, WuDialogFooter, WuTemplate],
  exports: [WuDialog, WuDialogFooter, WuTemplate],
})
export class WuDialogModule {}
