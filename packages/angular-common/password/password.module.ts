import { NgModule } from '@angular/core';
import { WuPassword } from './password.component';

/** For NgModule apps. Standalone apps can import `WuPassword` directly. */
@NgModule({
  imports: [WuPassword],
  exports: [WuPassword],
})
export class WuPasswordModule {}
