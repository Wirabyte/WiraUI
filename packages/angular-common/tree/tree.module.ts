import { NgModule } from '@angular/core';
import { WtTree } from './tree.component';

/** For NgModule apps. Standalone apps can import `WtTree` directly. */
@NgModule({
  imports: [WtTree],
  exports: [WtTree],
})
export class WtTreeModule {}
