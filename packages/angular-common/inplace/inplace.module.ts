import { NgModule } from '@angular/core';
import { WtInplace } from './inplace.component';

/** For NgModule apps. Standalone apps can import `WtInplace` directly. */
@NgModule({
  imports: [WtInplace],
  exports: [WtInplace],
})
export class WtInplaceModule {}
