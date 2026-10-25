import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtTimelineBase } from './timeline.base';

/** Events along a line: `<wt-timeline [value]="events"><ng-template pTemplate="content" let-e>{{ e.status }}</ng-template></wt-timeline>`. */
@Component({
  selector: 'wt-timeline',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  template: `
    <div [class]="rootClasses" [class.wt-timeline-no-opposite]="!oppositeTemplate" [ngClass]="styleClass || ''" [ngStyle]="style || null">
      <div *ngFor="let event of events; let i = index; let last = last; trackBy: trackIndex" class="wt-timeline-event p-timeline-event">
        <div class="wt-timeline-event-opposite p-timeline-event-opposite">
          <ng-container *ngIf="oppositeTemplate"><ng-container *ngTemplateOutlet="oppositeTemplate; context: context(event, i)"></ng-container></ng-container>
        </div>
        <div class="wt-timeline-event-separator p-timeline-event-separator">
          <ng-container *ngIf="markerTemplate; else dot"><ng-container *ngTemplateOutlet="markerTemplate; context: context(event, i)"></ng-container></ng-container>
          <ng-template #dot><div class="wt-timeline-event-marker p-timeline-event-marker"></div></ng-template>
          <div *ngIf="!last" class="wt-timeline-event-connector p-timeline-event-connector"></div>
        </div>
        <div class="wt-timeline-event-content p-timeline-event-content">
          <ng-container *ngIf="contentTemplate"><ng-container *ngTemplateOutlet="contentTemplate; context: context(event, i)"></ng-container></ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./timeline.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtTimeline extends ɵWtTimelineBase {}
