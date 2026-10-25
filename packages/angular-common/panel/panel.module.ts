import { NgModule } from '@angular/core';
import { WtFooter, WtHeader } from 'wiratheme/card';
import { WtTemplate } from 'wiratheme/config';
import { WtPanel } from './panel.component';

/** For NgModule apps. Standalone apps can import `WtPanel` directly. `<wt-header>` / `<wt-footer>` slots come with it. */
@NgModule({
  imports: [WtPanel, WtHeader, WtFooter, WtTemplate],
  exports: [WtPanel, WtHeader, WtFooter, WtTemplate],
})
export class WtPanelModule {}
