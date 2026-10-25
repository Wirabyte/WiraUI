import { NgModule } from '@angular/core';
import { WtListbox } from './listbox.component';

/** For NgModule apps. Standalone apps can import `WtListbox` directly. */
@NgModule({
  imports: [WtListbox],
  exports: [WtListbox],
})
export class WtListboxModule {}
