import { NgModule } from '@angular/core';
import { WuTree } from './tree.component';

/** For NgModule apps. Standalone apps can import `WuTree` directly. */
@NgModule({
  imports: [WuTree],
  exports: [WuTree],
})
export class WuTreeModule {}
