import { NgModule } from '@angular/core';
import { WtFooter, WtHeader } from 'wiratheme/card';
import { WtTemplate } from 'wiratheme/config';
import { WtCarousel } from './carousel.component';

/** For NgModule apps. Standalone apps can import `WtCarousel` directly. `<wt-header>` / `<wt-footer>` and `wtTemplate` come with it. */
@NgModule({
  imports: [WtCarousel, WtHeader, WtFooter, WtTemplate],
  exports: [WtCarousel, WtHeader, WtFooter, WtTemplate],
})
export class WtCarouselModule {}
