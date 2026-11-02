import { NgModule } from '@angular/core';
import { WuScrollPanel } from './scrollpanel.component';

/** For NgModule apps. Standalone apps can import `WuScrollPanel` directly. */
@NgModule({
  imports: [WuScrollPanel],
  exports: [WuScrollPanel],
})
export class WuScrollPanelModule {}
