import { NgModule } from '@angular/core';
import { WuSkeleton } from './skeleton.component';

/** For NgModule apps. Standalone apps can import `WuSkeleton` directly. */
@NgModule({
  imports: [WuSkeleton],
  exports: [WuSkeleton],
})
export class WuSkeletonModule {}
