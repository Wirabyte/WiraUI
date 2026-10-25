import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtFieldset } from './fieldset.component';

/** For NgModule apps. Standalone apps can import `WtFieldset` directly. */
@NgModule({
  imports: [WtFieldset, WtTemplate],
  exports: [WtFieldset, WtTemplate],
})
export class WtFieldsetModule {}
