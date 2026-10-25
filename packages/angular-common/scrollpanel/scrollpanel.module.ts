import { NgModule } from '@angular/core';
import { WtScrollPanel } from './scrollpanel.component';

/** For NgModule apps. Standalone apps can import `WtScrollPanel` directly. */
@NgModule({
  imports: [WtScrollPanel],
  exports: [WtScrollPanel],
})
export class WtScrollPanelModule {}
