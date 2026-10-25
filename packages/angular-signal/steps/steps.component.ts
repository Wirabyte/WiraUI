import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ɵWtStepsBase } from './steps.base';

/** Numbered steps of a process: `<wt-steps [model]="steps" [(activeIndex)]="step" [readonly]="false">`. */
@Component({
  selector: 'wt-steps',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, RouterLink],
  templateUrl: './steps.component.html',
  styleUrl: './steps.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtSteps extends ɵWtStepsBase {}
