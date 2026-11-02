import { NgModule } from '@angular/core';
import { WuAlertDialog } from './alert-dialog.component';

/** For NgModule apps; nothing to declare in templates, as alerts are opened from code (`WuAlertService`, `WuAlert`). */
@NgModule({
  imports: [WuAlertDialog],
  exports: [WuAlertDialog],
})
export class WuAlertModule {}
