import { NgModule } from '@angular/core';
import { WuGalleria } from './galleria.component';

/** For NgModule apps. Standalone apps can import `WuGalleria` directly. */
@NgModule({
  imports: [WuGalleria],
  exports: [WuGalleria],
})
export class WuGalleriaModule {}
