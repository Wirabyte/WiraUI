import { NgModule } from '@angular/core';
import { WuInputNumber } from './inputnumber.component';

/** For NgModule apps. Standalone apps can import `WuInputNumber` directly. */
@NgModule({
  imports: [WuInputNumber],
  exports: [WuInputNumber],
})
export class WuInputNumberModule {}
