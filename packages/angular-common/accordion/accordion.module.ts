import { NgModule } from '@angular/core';
import { WtAccordion, WtAccordionContent, WtAccordionHeader, WtAccordionPanel, WtAccordionTab } from './accordion.component';

const ALL = [WtAccordion, WtAccordionTab, WtAccordionPanel, WtAccordionHeader, WtAccordionContent];

/** For NgModule apps. Standalone apps can import `WtAccordion` and `WtAccordionTab` (or the panel components) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtAccordionModule {}
