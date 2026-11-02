import { NgModule } from '@angular/core';
import { WuChip } from './chip.component';

/** For NgModule apps. Standalone apps can import `WuChip` directly. */
@NgModule({
  imports: [WuChip],
  exports: [WuChip],
})
export class WuChipModule {}
