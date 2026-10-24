import { NgModule } from '@angular/core';
import { WtAccordion, WtAccordionTab } from './accordion.component';

/** For NgModule apps. Standalone apps can import `WtAccordion` and `WtAccordionTab` directly. */
@NgModule({
  imports: [WtAccordion, WtAccordionTab],
  exports: [WtAccordion, WtAccordionTab],
})
export class WtAccordionModule {}
