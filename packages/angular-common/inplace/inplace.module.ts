import { NgModule } from '@angular/core';
import { WuInplace } from './inplace.component';

/** For NgModule apps. Standalone apps can import `WuInplace` directly. */
@NgModule({
  imports: [WuInplace],
  exports: [WuInplace],
})
export class WuInplaceModule {}
