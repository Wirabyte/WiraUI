import { NgModule } from '@angular/core';
import { WtTemplate } from 'wiratheme/config';
import { WtTimeline } from './timeline.component';

/** For NgModule apps (with `WtTemplate` for `pTemplate="content"` / `"opposite"` / `"marker"`). */
@NgModule({
  imports: [WtTimeline, WtTemplate],
  exports: [WtTimeline, WtTemplate],
})
export class WtTimelineModule {}
