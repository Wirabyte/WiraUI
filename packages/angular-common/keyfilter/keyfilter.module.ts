import { NgModule } from '@angular/core';
import { WuKeyFilter } from './keyfilter.directive';

/** For NgModule apps. Standalone apps can import `WuKeyFilter` directly. */
@NgModule({
  imports: [WuKeyFilter],
  exports: [WuKeyFilter],
})
export class WuKeyFilterModule {}
