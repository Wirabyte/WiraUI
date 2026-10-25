import { NgModule } from '@angular/core';
import { WtScroller } from './scroller.component';

/** For NgModule apps. Standalone apps can import `WtScroller` directly. */
@NgModule({
  imports: [WtScroller],
  exports: [WtScroller],
})
export class WtScrollerModule {}
