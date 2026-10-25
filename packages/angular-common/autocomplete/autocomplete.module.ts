import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtAutoComplete } from './autocomplete.component';

/** For NgModule apps. Standalone apps can import `WtAutoComplete` directly. */
@NgModule({
  imports: [WtAutoComplete, WtTemplate],
  exports: [WtAutoComplete, WtTemplate],
})
export class WtAutoCompleteModule {}
