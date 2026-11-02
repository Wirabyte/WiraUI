import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuTimelineBase } from './timeline.base';

/** Events along a line: `<wu-timeline [value]="events"><ng-template #content let-e>{{ e.status }}</ng-template></wu-timeline>`. */
@Component({
  selector: 'wu-timeline',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  template: `
    <div [class]="rootClasses" [class.wu-timeline-no-opposite]="!oppositeTemplate" [ngClass]="styleClass || ''" [ngStyle]="style || null">
      @for (event of events; track $index; let i = $index, last = $last) {
        <div class="wu-timeline-event p-timeline-event">
          <div class="wu-timeline-event-opposite p-timeline-event-opposite">
            @if (oppositeTemplate) {
              <ng-container *ngTemplateOutlet="oppositeTemplate; context: context(event, i)"></ng-container>
            }
          </div>
          <div class="wu-timeline-event-separator p-timeline-event-separator">
            @if (markerTemplate) {
              <ng-container *ngTemplateOutlet="markerTemplate; context: context(event, i)"></ng-container>
            } @else {
              <div class="wu-timeline-event-marker p-timeline-event-marker"></div>
            }
            @if (!last) {
              <div class="wu-timeline-event-connector p-timeline-event-connector"></div>
            }
          </div>
          <div class="wu-timeline-event-content p-timeline-event-content">
            @if (contentTemplate) {
              <ng-container *ngTemplateOutlet="contentTemplate; context: context(event, i)"></ng-container>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './timeline.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuTimeline extends ɵWuTimelineBase {}
