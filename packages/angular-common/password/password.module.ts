import { NgModule } from '@angular/core';
import { WtPassword } from './password.component';

/** For NgModule apps. Standalone apps can import `WtPassword` directly. */
@NgModule({
  imports: [WtPassword],
  exports: [WtPassword],
})
export class WtPasswordModule {}
