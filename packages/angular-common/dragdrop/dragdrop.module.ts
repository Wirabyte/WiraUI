import { NgModule } from '@angular/core';
import { WuDraggable, WuDroppable } from './dragdrop.directive';

/** For NgModule apps. Standalone apps can import `WuDraggable` and `WuDroppable` directly. */
@NgModule({
  imports: [WuDraggable, WuDroppable],
  exports: [WuDraggable, WuDroppable],
})
export class WuDragDropModule {}
