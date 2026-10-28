import { NgModule } from '@angular/core';
import { WtResult } from './result.component';

/** For NgModule apps. Standalone apps can import `WtResult` directly. */
@NgModule({
  imports: [WtResult],
  exports: [WtResult],
})
export class WtResultModule {}
