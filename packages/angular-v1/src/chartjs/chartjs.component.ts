import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtChartJsBase } from './chartjs.base';

/**
 * A Chart.js chart: `<wt-chartjs type="bar" [data]="data" [options]="options" height="320px">`. The app installs
 * chart.js 3 or 4. WiraTheme's own chart, with no library, is `<wt-chart>` (wiratheme/chart, v3).
 */
@Component({
  selector: 'wt-chartjs, wt-chartJs',
  standalone: true,
  exportAs: 'wtChartJs',
  imports: [NgClass, NgStyle],
  template: `
    <div class="wt-chartjs p-chart" [ngClass]="styleClass || ''" [ngStyle]="style || null" [style.width]="fixedWidth" [style.height]="fixedHeight">
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
  styleUrls: ['./chartjs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtChartJs extends ɵWtChartJsBase {}
