import { NgModule } from '@angular/core';
import { WtGalleria } from './galleria.component';

/** For NgModule apps. Standalone apps can import `WtGalleria` directly. */
@NgModule({
  imports: [WtGalleria],
  exports: [WtGalleria],
})
export class WtGalleriaModule {}
