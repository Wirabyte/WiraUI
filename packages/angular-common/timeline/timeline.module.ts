import { NgModule } from '@angular/core';
import { WuTemplate } from 'wiraui/config';
import { WuTimeline } from './timeline.component';

/** For NgModule apps (with `WuTemplate` for `pTemplate="content"` / `"opposite"` / `"marker"`). */
@NgModule({
  imports: [WuTimeline, WuTemplate],
  exports: [WuTimeline, WuTemplate],
})
export class WuTimelineModule {}
