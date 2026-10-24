import { NgModule } from '@angular/core';
import { WtInputGroup, WtInputGroupAddon } from './inputgroup.component';

/** For NgModule apps. Standalone apps can import `WtInputGroup` and `WtInputGroupAddon` directly. */
@NgModule({
  imports: [WtInputGroup, WtInputGroupAddon],
  exports: [WtInputGroup, WtInputGroupAddon],
})
export class WtInputGroupModule {}
