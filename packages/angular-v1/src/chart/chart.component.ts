import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtChartJsBase } from 'wiratheme/chartjs';

/**
 * The Chart.js chart under the name PrimeNG code uses: `<wt-chart type="bar" [data]="data" [options]="options">`, the
 * same component as `<wt-chartjs>` (wiratheme/chartjs). The app installs chart.js 3 or 4. In wiratheme v3 `wt-chart`
 * is WiraTheme's own chart, which takes the same data and options.
 */
@Component({
  selector: 'wt-chart',
  standalone: true,
  exportAs: 'wtChart',
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
  styleUrls: ['../chartjs/chartjs.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtChart extends ɵWtChartJsBase {}
