import { NgModule } from '@angular/core';
import { WtAlertDialog } from './alert-dialog.component';

/** For NgModule apps; nothing to declare in templates, as alerts are opened from code (`WtAlertService`, `WtAlert`). */
@NgModule({
  imports: [WtAlertDialog],
  exports: [WtAlertDialog],
})
export class WtAlertModule {}
