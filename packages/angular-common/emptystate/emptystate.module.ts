import { NgModule } from '@angular/core';
import { WtEmptyState } from './emptystate.component';

/** For NgModule apps. Standalone apps can import `WtEmptyState` directly. */
@NgModule({
  imports: [WtEmptyState],
  exports: [WtEmptyState],
})
export class WtEmptyStateModule {}
