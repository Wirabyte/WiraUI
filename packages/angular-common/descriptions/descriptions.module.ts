import { NgModule } from '@angular/core';
import { WuDescriptions, WuDescriptionsItem } from './descriptions.component';

/** For NgModule apps. Standalone apps can import `WuDescriptions` and `WuDescriptionsItem` directly. */
@NgModule({
  imports: [WuDescriptions, WuDescriptionsItem],
  exports: [WuDescriptions, WuDescriptionsItem],
})
export class WuDescriptionsModule {}
