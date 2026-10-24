import { NgModule } from '@angular/core';
import { WtToolbar } from './toolbar.component';

/** For NgModule apps. Standalone apps can import `WtToolbar` directly. */
@NgModule({
  imports: [WtToolbar],
  exports: [WtToolbar],
})
export class WtToolbarModule {}
