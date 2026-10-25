import { NgModule } from '@angular/core';
import { WtBlockUI } from './blockui.component';

/** For NgModule apps. Standalone apps can import `WtBlockUI` directly. */
@NgModule({
  imports: [WtBlockUI],
  exports: [WtBlockUI],
})
export class WtBlockUIModule {}
