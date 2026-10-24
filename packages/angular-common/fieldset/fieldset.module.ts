import { NgModule } from '@angular/core';
import { WtFieldset } from './fieldset.component';

/** For NgModule apps. Standalone apps can import `WtFieldset` directly. */
@NgModule({
  imports: [WtFieldset],
  exports: [WtFieldset],
})
export class WtFieldsetModule {}
