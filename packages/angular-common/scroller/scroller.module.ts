import { NgModule } from '@angular/core';
import { WuScroller } from './scroller.component';

/** For NgModule apps. Standalone apps can import `WuScroller` directly. */
@NgModule({
  imports: [WuScroller],
  exports: [WuScroller],
})
export class WuScrollerModule {}
