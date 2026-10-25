import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { ɵWT_STEP_ITEM, ɵWT_STEPPER, ɵWtStepBase, ɵWtStepItemBase, ɵWtStepListBase, ɵWtStepPanelBase, ɵWtStepperBase } from './stepper.base';

/**
 * Steps of a process by value: `<wt-stepper [(value)]="step" [linear]="true">` holding a `wt-step-list` of
 * `wt-step [value]="1"` headers and `wt-step-panels` of `wt-step-panel [value]="1"` contents (a `#content` template
 * whose `activateCallback(2)` moves on). For a vertical stepper, put each `wt-step` + `wt-step-panel` pair in a
 * `wt-step-item [value]="1"`.
 *
 * It also draws a Steps bar from a menu model: `<wt-stepper [model]="steps" [(activeIndex)]="i">` (items with
 * `label`, `subtitle`, `disabled`, `command`), with `[readonly]="true"` to only show where the process is.
 * `labelPosition="bottom"` puts each title (and `subtitle`) under its number.
 */
@Component({
  selector: 'wt-stepper',
  standalone: true,
  exportAs: 'wtStepper',
  imports: [NgFor, NgIf, forwardRef(() => WtStepList), forwardRef(() => WtStep)],
  template: `<wt-step-list *ngIf="model">
      <wt-step *ngFor="let item of model; let i = index" [value]="i" [disabled]="!!item.disabled" [subtitle]="subtitleOf(item)">{{ item.label }}</wt-step>
    </wt-step-list>
    <ng-content></ng-content>`,
  styleUrls: ['./stepper.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWT_STEPPER, useExisting: forwardRef(() => WtStepper) }],
  host: {
    class: 'wt-stepper p-stepper p-component',
    '[class.wt-stepper-linear]': 'linear',
    '[class.wt-stepper-readonly]': 'readonly',
    '[class.wt-stepper-label-bottom]': "labelPosition === 'bottom'",
  },
})
export class WtStepper extends ɵWtStepperBase {}

/** The row of step headers. */
@Component({
  selector: 'wt-step-list',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-step-list p-steplist', role: 'tablist', '(keydown)': 'keydown($event)' },
})
export class WtStepList extends ɵWtStepListBase {}

/** One step header: `<wt-step [value]="1">ข้อมูลพื้นฐาน</wt-step>`. */
@Component({
  selector: 'wt-step',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<ng-container *ngIf="contentTemplate; else header">
      <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
    </ng-container>
    <ng-template #header>
      <button
        type="button"
        class="wt-step-header p-step-header"
        role="tab"
        [id]="headerId"
        [attr.aria-controls]="panelId"
        [attr.aria-selected]="active"
        [attr.aria-current]="active ? 'step' : null"
        [attr.tabindex]="tabStop ? 0 : -1"
        [disabled]="locked || readonly"
        (click)="pick($event)"
      >
        <span class="wt-step-number p-step-number" aria-hidden="true">{{ number }}</span>
        <span class="wt-step-text">
          <span class="wt-step-title p-step-title"><ng-content></ng-content></span>
          <span *ngIf="subtitle" class="wt-step-subtitle p-step-subtitle">{{ subtitle }}</span>
        </span>
      </button>
    </ng-template>
    <span *ngIf="showSeparator" class="wt-stepper-separator p-stepper-separator" aria-hidden="true"></span>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-step p-step',
    '[class.wt-step-active]': 'active',
    '[class.p-step-active]': 'active',
    '[class.wt-step-complete]': 'complete',
    '[class.wt-step-locked]': 'locked',
    '[class.p-disabled]': 'locked',
    '[class.wt-step-last]': '!showSeparator',
  },
})
export class WtStep extends ɵWtStepBase {}

/** Holds the step panels of a horizontal stepper. */
@Component({
  selector: 'wt-step-panels',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-step-panels p-steppanels' },
})
export class WtStepPanels {}

/** One step's content: `<wt-step-panel [value]="1"><ng-template #content let-activateCallback="activateCallback">…`. */
@Component({
  selector: 'wt-step-panel',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  template: `<span *ngIf="showSeparator" class="wt-stepper-separator p-stepper-separator" [class.wt-stepper-separator-done]="complete" aria-hidden="true"></span>
    <div class="wt-step-panel-content p-steppanel-content" [class.wt-step-panel-content-hidden]="!active">
      <ng-container *ngIf="active && contentTemplate">
        <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
      </ng-container>
      <ng-content></ng-content>
    </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wt-step-panel p-steppanel',
    role: 'tabpanel',
    '[id]': 'panelId',
    '[attr.aria-labelledby]': 'headerId',
    '[class.wt-step-panel-active]': 'active',
    '[class.p-steppanel-active]': 'active',
    '[class.wt-step-panel-vertical]': 'vertical',
  },
})
export class WtStepPanel extends ɵWtStepPanelBase {}

/** A step of a vertical stepper: `<wt-step-item [value]="1"><wt-step>…</wt-step><wt-step-panel>…</wt-step-panel></wt-step-item>`. */
@Component({
  selector: 'wt-step-item',
  standalone: true,
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ɵWT_STEP_ITEM, useExisting: forwardRef(() => WtStepItem) }],
  host: { class: 'wt-step-item p-stepitem', '[class.wt-step-item-active]': 'active', '[class.p-stepitem-active]': 'active' },
})
export class WtStepItem extends ɵWtStepItemBase {}
