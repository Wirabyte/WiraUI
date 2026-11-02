import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuAutoComplete } from './autocomplete.component';

/** For NgModule apps. Standalone apps can import `WuAutoComplete` directly. */
@NgModule({
  imports: [WuAutoComplete, WuTemplate],
  exports: [WuAutoComplete, WuTemplate],
})
export class WuAutoCompleteModule {}
