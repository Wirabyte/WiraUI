import { NgModule } from '@angular/core';
import { WtKeyFilter } from './keyfilter.directive';

/** For NgModule apps. Standalone apps can import `WtKeyFilter` directly. */
@NgModule({
  imports: [WtKeyFilter],
  exports: [WtKeyFilter],
})
export class WtKeyFilterModule {}
