import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtChartBase } from './chart.base';

/** A Chart.js chart: `<wt-chart type="bar" [data]="data" [options]="options" height="320px">`. */
@Component({
  selector: 'wt-chart',
  standalone: true,
  exportAs: 'wtChart',
  imports: [NgClass, NgStyle],
  template: `
    <div class="wt-chart p-chart" [ngClass]="styleClass || ''" [ngStyle]="style || null" [style.width]="fixedWidth" [style.height]="fixedHeight">
      <canvas
        #canvas
        role="img"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-labelledby]="ariaLabelledBy || null"
        [attr.width]="fixedWidth"
        [attr.height]="fixedHeight"
        (click)="onCanvasClick($event)"
      ></canvas>
    </div>
  `,
  styleUrl: './chart.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtChart extends ɵWtChartBase {}
