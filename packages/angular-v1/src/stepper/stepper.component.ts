import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { ɵWU_STEP_ITEM, ɵWU_STEPPER, ɵWuStepBase, ɵWuStepItemBase, ɵWuStepListBase, ɵWuStepPanelBase, ɵWuStepperBase } from './stepper.base';

/**
 * Steps of a process by value: `<wu-stepper [(value)]="step" [linear]="true">` holding a `wu-step-list` of
 * `wu-step [value]="1"` headers and `wu-step-panels` of `wu-step-panel [value]="1"` contents (a `#content` template
 * whose `activateCallback(2)` moves on). For a vertical stepper, put each `wu-step` + `wu-step-panel` pair in a
 * `wu-step-item [value]="1"`.
 *
 * It also draws a Steps bar from a menu model: `<wu-stepper [model]="steps" [(activeIndex)]="i">` (items with
 * `label`, `subtitle`, `disabled`, `command`), with `[readonly]="true"` to only show where the process is.
 * `labelPosition="bottom"` puts each title (and `subtitle`) under its number.
 */
@Component({
  selector: 'wu-stepper',
  standalone: true,
  exportAs: 'wuStepper',
  imports: [NgFor, NgIf, forwardRef(() => WuStepList), forwardRef(() => WuStep)],
  template: `<wu-step-list *ngIf="model">
      <wu-step *ngFor="let item of model; let i = index" [value]="i" [disabled]="!!item.disabled" [subtitle]="subtitleOf(item)">{{ item.label }}</wu-step>
    </wu-step-list>
    <ng-content></ng-content>`,
  styleUrls: ['./stepper.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWU_STEPPER, useExisting: forwardRef(() => WuStepper) }],
  host: {
    class: 'wu-stepper p-stepper p-component',
    '[class.wu-stepper-linear]': 'linear',
    '[class.wu-stepper-readonly]': 'readonly',
    '[class.wu-stepper-label-bottom]': "labelPosition === 'bottom'",
  },
})
export class WuStepper extends ɵWuStepperBase {}

/** The row of step headers. */
@Component({
  selector: 'wu-step-list',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-step-list p-steplist', role: 'tablist', '(keydown)': 'keydown($event)' },
})
export class WuStepList extends ɵWuStepListBase {}

/** One step header: `<wu-step [value]="1">ข้อมูลพื้นฐาน</wu-step>`. */
@Component({
  selector: 'wu-step',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<ng-container *ngIf="contentTemplate; else header">
      <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
    </ng-container>
    <ng-template #header>
      <button
        type="button"
        class="wu-step-header p-step-header"
        role="tab"
        [id]="headerId"
        [attr.aria-controls]="panelId"
        [attr.aria-selected]="active"
        [attr.aria-current]="active ? 'step' : null"
        [attr.tabindex]="tabStop ? 0 : -1"
        [disabled]="locked || readonly"
        (click)="pick($event)"
      >
        <span class="wu-step-number p-step-number" aria-hidden="true">{{ number }}</span>
        <span class="wu-step-text">
          <span class="wu-step-title p-step-title"><ng-content></ng-content></span>
          <span *ngIf="subtitle" class="wu-step-subtitle p-step-subtitle">{{ subtitle }}</span>
        </span>
      </button>
    </ng-template>
    <span *ngIf="showSeparator" class="wu-stepper-separator p-stepper-separator" aria-hidden="true"></span>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-step p-step',
    '[class.wu-step-active]': 'active',
    '[class.p-step-active]': 'active',
    '[class.wu-step-complete]': 'complete',
    '[class.wu-step-locked]': 'locked',
    '[class.p-disabled]': 'locked',
    '[class.wu-step-last]': '!showSeparator',
  },
})
export class WuStep extends ɵWuStepBase {}

/** Holds the step panels of a horizontal stepper. */
@Component({
  selector: 'wu-step-panels',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-step-panels p-steppanels' },
})
export class WuStepPanels {}

/** One step's content: `<wu-step-panel [value]="1"><ng-template #content let-activateCallback="activateCallback">…`. */
@Component({
  selector: 'wu-step-panel',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<span *ngIf="showSeparator" class="wu-stepper-separator p-stepper-separator" [class.wu-stepper-separator-done]="complete" aria-hidden="true"></span>
    <div class="wu-step-panel-content p-steppanel-content" [class.wu-step-panel-content-hidden]="!active">
      <ng-container *ngIf="active && contentTemplate">
        <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
      </ng-container>
      <ng-content></ng-content>
    </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-step-panel p-steppanel',
    role: 'tabpanel',
    '[id]': 'panelId',
    '[attr.aria-labelledby]': 'headerId',
    '[class.wu-step-panel-active]': 'active',
    '[class.p-steppanel-active]': 'active',
    '[class.wu-step-panel-vertical]': 'vertical',
  },
})
export class WuStepPanel extends ɵWuStepPanelBase {}

/** A step of a vertical stepper: `<wu-step-item [value]="1"><wu-step>…</wu-step><wu-step-panel>…</wu-step-panel></wu-step-item>`. */
@Component({
  selector: 'wu-step-item',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWU_STEP_ITEM, useExisting: forwardRef(() => WuStepItem) }],
  host: { class: 'wu-step-item p-stepitem', '[class.wu-step-item-active]': 'active', '[class.p-stepitem-active]': 'active' },
})
export class WuStepItem extends ɵWuStepItemBase {}
