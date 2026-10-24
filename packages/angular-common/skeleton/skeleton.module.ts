import { NgModule } from '@angular/core';
import { WtSkeleton } from './skeleton.component';

/** For NgModule apps. Standalone apps can import `WtSkeleton` directly. */
@NgModule({
  imports: [WtSkeleton],
  exports: [WtSkeleton],
})
export class WtSkeletonModule {}
