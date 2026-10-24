import { ModuleWithProviders, NgModule } from '@angular/core';
import { WtAnimate } from './animate.directive';
import { provideWtAnimate } from './animate.service';
import { WtAnimateOptions } from './animate.types';

/** For NgModule apps: import it where templates use `wtAnimate` / `data-aos`; `forRoot()` once also animates the rest. */
@NgModule({
  imports: [WtAnimate],
  exports: [WtAnimate],
})
export class WtAnimateModule {
  static forRoot(options: WtAnimateOptions = {}): ModuleWithProviders<WtAnimateModule> {
    return { ngModule: WtAnimateModule, providers: [provideWtAnimate(options)] };
  }
}
