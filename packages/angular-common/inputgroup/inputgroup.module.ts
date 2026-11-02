import { NgModule } from '@angular/core';
import { WuInputGroup, WuInputGroupAddon } from './inputgroup.component';

/** For NgModule apps. Standalone apps can import `WuInputGroup` and `WuInputGroupAddon` directly. */
@NgModule({
  imports: [WuInputGroup, WuInputGroupAddon],
  exports: [WuInputGroup, WuInputGroupAddon],
})
export class WuInputGroupModule {}
