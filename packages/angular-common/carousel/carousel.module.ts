import { NgModule } from '@angular/core';
import { WuFooter, WuHeader } from 'wiraui/card';
import { WuTemplate } from 'wiraui/config';
import { WuCarousel } from './carousel.component';

/** For NgModule apps. Standalone apps can import `WuCarousel` directly. `<wu-header>` / `<wu-footer>` and `wuTemplate` come with it. */
@NgModule({
  imports: [WuCarousel, WuHeader, WuFooter, WuTemplate],
  exports: [WuCarousel, WuHeader, WuFooter, WuTemplate],
})
export class WuCarouselModule {}
