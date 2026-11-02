import { NgModule } from '@angular/core';
import { WuContextMenu } from './contextmenu.component';

/** For NgModule apps. Standalone apps can import `WuContextMenu` directly. */
@NgModule({
  imports: [WuContextMenu],
  exports: [WuContextMenu],
})
export class WuContextMenuModule {}
