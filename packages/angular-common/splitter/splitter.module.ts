import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtSplitterPanel } from './splitter-panel.component';
import { WtSplitter } from './splitter.component';

/** For NgModule apps. Standalone apps can import `WtSplitter` and `WtSplitterPanel` directly. `wtTemplate` comes with it. */
@NgModule({
  imports: [WtSplitter, WtSplitterPanel, WtTemplate],
  exports: [WtSplitter, WtSplitterPanel, WtTemplate],
})
export class WtSplitterModule {}
