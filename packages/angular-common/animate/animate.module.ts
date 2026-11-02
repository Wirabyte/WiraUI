import { ModuleWithProviders, NgModule } from '@angular/core';
import { WuAnimate } from './animate.directive';
import { provideWuAnimate } from './animate.service';
import { WuAnimateOptions } from './animate.types';

/** For NgModule apps: import it where templates use `wuAnimate` / `data-aos`; `forRoot()` once also animates the rest. */
@NgModule({
  imports: [WuAnimate],
  exports: [WuAnimate],
})
export class WuAnimateModule {
  static forRoot(options: WuAnimateOptions = {}): ModuleWithProviders<WuAnimateModule> {
    return { ngModule: WuAnimateModule, providers: [provideWuAnimate(options)] };
  }
}
