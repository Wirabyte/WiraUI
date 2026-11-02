import { NgModule } from '@angular/core';
import { WuTag } from './tag.component';

/** For NgModule apps. Standalone apps can import `WuTag` directly. */
@NgModule({
  imports: [WuTag],
  exports: [WuTag],
})
export class WuTagModule {}
