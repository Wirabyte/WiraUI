import { NgModule } from '@angular/core';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuAccordion, WuAccordionContent, WuAccordionHeader, WuAccordionPanel, WuAccordionTab } from './accordion.component';

const ALL = [WuAccordion, WuAccordionTab, WuAccordionPanel, WuAccordionHeader, WuAccordionContent, WuTemplate];

/** For NgModule apps. Standalone apps can import `WuAccordion` and `WuAccordionTab` (or the panel components) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WuAccordionModule {}
