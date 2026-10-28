import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtDock } from './dock.component';

/** For NgModule apps (with `WtTemplate` for `pTemplate="item"`, `start` and `end`). Standalone apps can import `WtDock` directly. */
@NgModule({
  imports: [WtDock, WtTemplate],
  exports: [WtDock, WtTemplate],
})
export class WtDockModule {}
