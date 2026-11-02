import { NgModule } from '@angular/core';
import { WuInputText } from './inputtext.directive';

/** For NgModule apps. Standalone apps can import `WuInputText` directly. */
@NgModule({
  imports: [WuInputText],
  exports: [WuInputText],
})
export class WuInputTextModule {}
