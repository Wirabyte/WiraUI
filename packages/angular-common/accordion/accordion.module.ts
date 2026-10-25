import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtAccordion, WtAccordionContent, WtAccordionHeader, WtAccordionPanel, WtAccordionTab } from './accordion.component';

const ALL = [WtAccordion, WtAccordionTab, WtAccordionPanel, WtAccordionHeader, WtAccordionContent, WtTemplate];

/** For NgModule apps. Standalone apps can import `WtAccordion` and `WtAccordionTab` (or the panel components) directly. */
@NgModule({
  imports: ALL,
  exports: ALL,
})
export class WtAccordionModule {}
