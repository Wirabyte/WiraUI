import { NgModule } from '@angular/core';
import { WtContextMenu } from './contextmenu.component';

/** For NgModule apps. Standalone apps can import `WtContextMenu` directly. */
@NgModule({
  imports: [WtContextMenu],
  exports: [WtContextMenu],
})
export class WtContextMenuModule {}
