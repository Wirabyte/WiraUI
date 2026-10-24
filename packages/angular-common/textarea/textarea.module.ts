import { NgModule } from '@angular/core';
import { WtTextarea } from './textarea.directive';

/** For NgModule apps. Standalone apps can import `WtTextarea` directly. */
@NgModule({
  imports: [WtTextarea],
  exports: [WtTextarea],
})
export class WtTextareaModule {}
