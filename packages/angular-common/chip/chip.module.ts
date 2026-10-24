import { NgModule } from '@angular/core';
import { WtChip } from './chip.component';

/** For NgModule apps. Standalone apps can import `WtChip` directly. */
@NgModule({
  imports: [WtChip],
  exports: [WtChip],
})
export class WtChipModule {}
