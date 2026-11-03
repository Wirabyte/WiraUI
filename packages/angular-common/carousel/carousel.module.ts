import { NgModule } from '@angular/core';
import { WuFooter, WuHeader } from '@wirabyte/ui/card';
import { WuTemplate } from '@wirabyte/ui/config';
import { WuCarousel } from './carousel.component';

/** For NgModule apps. Standalone apps can import `WuCarousel` directly. `<wu-header>` / `<wu-footer>` and `wuTemplate` come with it. */
@NgModule({
  imports: [WuCarousel, WuHeader, WuFooter, WuTemplate],
  exports: [WuCarousel, WuHeader, WuFooter, WuTemplate],
})
export class WuCarouselModule {}
