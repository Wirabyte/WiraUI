import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuTimelineBase } from './timeline.base';

/** Events along a line: `<wu-timeline [value]="events"><ng-template pTemplate="content" let-e>{{ e.status }}</ng-template></wu-timeline>`. */
@Component({
  selector: 'wu-timeline',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  template: `
    <div [class]="rootClasses" [class.wu-timeline-no-opposite]="!oppositeTemplate" [ngClass]="styleClass || ''" [ngStyle]="style || null">
      <div *ngFor="let event of events; let i = index; let last = last; trackBy: trackIndex" class="wu-timeline-event p-timeline-event">
        <div class="wu-timeline-event-opposite p-timeline-event-opposite">
          <ng-container *ngIf="oppositeTemplate"><ng-container *ngTemplateOutlet="oppositeTemplate; context: context(event, i)"></ng-container></ng-container>
        </div>
        <div class="wu-timeline-event-separator p-timeline-event-separator">
          <ng-container *ngIf="markerTemplate; else dot"><ng-container *ngTemplateOutlet="markerTemplate; context: context(event, i)"></ng-container></ng-container>
          <ng-template #dot><div class="wu-timeline-event-marker p-timeline-event-marker"></div></ng-template>
          <div *ngIf="!last" class="wu-timeline-event-connector p-timeline-event-connector"></div>
        </div>
        <div class="wu-timeline-event-content p-timeline-event-content">
          <ng-container *ngIf="contentTemplate"><ng-container *ngTemplateOutlet="contentTemplate; context: context(event, i)"></ng-container></ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./timeline.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTimeline extends ɵWuTimelineBase {}
