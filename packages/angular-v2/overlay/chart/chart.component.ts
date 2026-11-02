import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWuChartJsBase } from 'wiraui/chartjs';

/**
 * The Chart.js chart under the name older code uses: `<wu-chart type="bar" [data]="data" [options]="options">`, the
 * same component as `<wu-chartjs>` (wiraui/chartjs). The app installs chart.js 3 or 4. In wiraui v3 `wu-chart`
 * is WiraUI's own chart, which takes the same data and options.
 */
@Component({
  selector: 'wu-chart',
  standalone: true,
  exportAs: 'wuChart',
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
  styleUrl: '../chartjs/chartjs.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuChart extends ɵWuChartJsBase {}
