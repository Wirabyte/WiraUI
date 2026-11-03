import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuChartJsBase } from './chartjs.base';

/**
 * A Chart.js chart: `<wu-chartjs type="bar" [data]="data" [options]="options" height="320px">`. The app installs
 * chart.js 3 or 4. WiraUI's own chart, with no library, is `<wu-chart>` (@wirabyte/ui/chart, v3).
 */
@Component({
  selector: 'wu-chartjs, wu-chartJs',
  standalone: true,
  exportAs: 'wuChartJs',
  imports: [NgClass, NgStyle],
  template: `
    <div class="wu-chartjs p-chart" [ngClass]="styleClass || ''" [ngStyle]="style || null" [style.width]="fixedWidth" [style.height]="fixedHeight">
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
  styleUrl: './chartjs.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuChartJs extends ɵWuChartJsBase {}
