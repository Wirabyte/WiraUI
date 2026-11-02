import { NgModule } from '@angular/core';
import { WuBlockUI } from './blockui.component';

/** For NgModule apps. Standalone apps can import `WuBlockUI` directly. */
@NgModule({
  imports: [WuBlockUI],
  exports: [WuBlockUI],
})
export class WuBlockUIModule {}
