import { NgModule } from '@angular/core';
import { WtCheckbox } from './checkbox.component';

/** For NgModule apps. Standalone apps can import `WtCheckbox` directly. */
@NgModule({
  imports: [WtCheckbox],
  exports: [WtCheckbox],
})
export class WtCheckboxModule {}
