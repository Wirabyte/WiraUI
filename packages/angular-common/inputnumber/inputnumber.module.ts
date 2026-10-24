import { NgModule } from '@angular/core';
import { WtInputNumber } from './inputnumber.component';

/** For NgModule apps. Standalone apps can import `WtInputNumber` directly. */
@NgModule({
  imports: [WtInputNumber],
  exports: [WtInputNumber],
})
export class WtInputNumberModule {}
