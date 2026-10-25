import { NgModule } from '@angular/core';
import { WtDraggable, WtDroppable } from './dragdrop.directive';

/** For NgModule apps. Standalone apps can import `WtDraggable` and `WtDroppable` directly. */
@NgModule({
  imports: [WtDraggable, WtDroppable],
  exports: [WtDraggable, WtDroppable],
})
export class WtDragDropModule {}
