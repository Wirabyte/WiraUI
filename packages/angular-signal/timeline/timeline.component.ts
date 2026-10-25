import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtTimelineBase } from './timeline.base';

/** Events along a line: `<wt-timeline [value]="events"><ng-template #content let-e>{{ e.status }}</ng-template></wt-timeline>`. */
@Component({
  selector: 'wt-timeline',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  template: `
    <div [class]="rootClasses" [class.wt-timeline-no-opposite]="!oppositeTemplate" [ngClass]="styleClass || ''" [ngStyle]="style || null">
      @for (event of events; track $index; let i = $index, last = $last) {
        <div class="wt-timeline-event p-timeline-event">
          <div class="wt-timeline-event-opposite p-timeline-event-opposite">
            @if (oppositeTemplate) {
              <ng-container *ngTemplateOutlet="oppositeTemplate; context: context(event, i)"></ng-container>
            }
          </div>
          <div class="wt-timeline-event-separator p-timeline-event-separator">
            @if (markerTemplate) {
              <ng-container *ngTemplateOutlet="markerTemplate; context: context(event, i)"></ng-container>
            } @else {
              <div class="wt-timeline-event-marker p-timeline-event-marker"></div>
            }
            @if (!last) {
              <div class="wt-timeline-event-connector p-timeline-event-connector"></div>
            }
          </div>
          <div class="wt-timeline-event-content p-timeline-event-content">
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
export class WtTimeline extends ɵWtTimelineBase {}
