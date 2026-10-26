import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtImageCompare } from './imagecompare.component';

/** For NgModule apps. Standalone apps can import `WtImageCompare` directly. `wtTemplate` (`pTemplate`) comes with it. */
@NgModule({
  imports: [WtImageCompare, WtTemplate],
  exports: [WtImageCompare, WtTemplate],
})
export class WtImageCompareModule {}
