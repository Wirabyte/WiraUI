import { NgModule } from '@angular/core';
import { WuSignaturePad } from './signaturepad.component';

/** For NgModule apps. Standalone apps can import `WuSignaturePad` directly. */
@NgModule({
  imports: [WuSignaturePad],
  exports: [WuSignaturePad],
})
export class WuSignaturePadModule {}
