import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtToolbar } from './toolbar.component';

/** For NgModule apps. Standalone apps can import `WtToolbar` directly. */
@NgModule({
  imports: [WtToolbar, WtTemplate],
  exports: [WtToolbar, WtTemplate],
})
export class WtToolbarModule {}
