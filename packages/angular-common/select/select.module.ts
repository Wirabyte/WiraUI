import { NgModule } from '@angular/core';
import { WuSelect } from './select.component';

/** For NgModule apps. Standalone apps can import `WuSelect` directly. */
@NgModule({
  imports: [WuSelect],
  exports: [WuSelect],
})
export class WuSelectModule {}
