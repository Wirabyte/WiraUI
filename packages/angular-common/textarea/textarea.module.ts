import { NgModule } from '@angular/core';
import { WuTextarea } from './textarea.directive';

/** For NgModule apps. Standalone apps can import `WuTextarea` directly. */
@NgModule({
  imports: [WuTextarea],
  exports: [WuTextarea],
})
export class WuTextareaModule {}
