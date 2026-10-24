import { NgModule } from '@angular/core';
import { WtPanel } from './panel.component';

/** For NgModule apps. Standalone apps can import `WtPanel` directly. */
@NgModule({
  imports: [WtPanel],
  exports: [WtPanel],
})
export class WtPanelModule {}
