import { NgModule } from '@angular/core';
import { WtTag } from './tag.component';

/** For NgModule apps. Standalone apps can import `WtTag` directly. */
@NgModule({
  imports: [WtTag],
  exports: [WtTag],
})
export class WtTagModule {}
