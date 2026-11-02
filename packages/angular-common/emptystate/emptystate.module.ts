import { NgModule } from '@angular/core';
import { WuEmptyState } from './emptystate.component';

/** For NgModule apps. Standalone apps can import `WuEmptyState` directly. */
@NgModule({
  imports: [WuEmptyState],
  exports: [WuEmptyState],
})
export class WuEmptyStateModule {}
