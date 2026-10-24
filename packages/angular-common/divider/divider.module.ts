import { NgModule } from '@angular/core';
import { WtDivider } from './divider.component';

/** For NgModule apps. Standalone apps can import `WtDivider` directly. */
@NgModule({
  imports: [WtDivider],
  exports: [WtDivider],
})
export class WtDividerModule {}
