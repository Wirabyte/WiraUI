import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuSplitterPanel } from './splitter-panel.component';
import { WuSplitter } from './splitter.component';

/** For NgModule apps. Standalone apps can import `WuSplitter` and `WuSplitterPanel` directly. `wuTemplate` comes with it. */
@NgModule({
  imports: [WuSplitter, WuSplitterPanel, WuTemplate],
  exports: [WuSplitter, WuSplitterPanel, WuTemplate],
})
export class WuSplitterModule {}
