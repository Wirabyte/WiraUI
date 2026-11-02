import { NgModule } from '@angular/core';
import { WuListbox } from './listbox.component';

/** For NgModule apps. Standalone apps can import `WuListbox` directly. */
@NgModule({
  imports: [WuListbox],
  exports: [WuListbox],
})
export class WuListboxModule {}
