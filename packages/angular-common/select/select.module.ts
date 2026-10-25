import { NgModule } from '@angular/core';
import { WtSelect } from './select.component';

/** For NgModule apps. Standalone apps can import `WtSelect` directly. */
@NgModule({
  imports: [WtSelect],
  exports: [WtSelect],
})
export class WtSelectModule {}
