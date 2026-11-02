import { NgModule } from '@angular/core';
import { WuDivider } from './divider.component';

/** For NgModule apps. Standalone apps can import `WuDivider` directly. */
@NgModule({
  imports: [WuDivider],
  exports: [WuDivider],
})
export class WuDividerModule {}
