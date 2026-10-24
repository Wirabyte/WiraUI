import { NgModule } from '@angular/core';
import { WtInputText } from './inputtext.directive';

/** For NgModule apps. Standalone apps can import `WtInputText` directly. */
@NgModule({
  imports: [WtInputText],
  exports: [WtInputText],
})
export class WtInputTextModule {}
