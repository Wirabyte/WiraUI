import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtMenubar } from './menubar.component';

/** For NgModule apps (with `WtTemplate` for `pTemplate="start"` / `"end"` slots). Standalone apps can import `WtMenubar` directly. */
@NgModule({
  imports: [WtMenubar, WtTemplate],
  exports: [WtMenubar, WtTemplate],
})
export class WtMenubarModule {}
