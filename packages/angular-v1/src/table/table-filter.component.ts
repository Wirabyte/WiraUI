import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ɵWtColumnFilterBase } from './table.filter';

const X_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"></path></svg>';
const FILTER_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3h11L9.25 8.25v4.25l-2.5 1.25v-5.5z"></path></svg>';
const CHECK_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"></path></svg>';

/**
 * A filter for one column: `<wt-columnFilter field="name" />` (a box in a header row or the caption), or
 * `display="menu"` (a filter button with match modes, rules and Clear / Apply). A `filter` template
 * (`let-value let-filter="filterCallback"`) brings any control. `p-columnFilter` markup moves over by changing the prefix.
 */
@Component({
  selector: 'wt-columnFilter, wt-columnfilter, wt-column-filter',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet],
  template: `<div *ngIf="display === 'menu'; else rowDisplay" class="wt-column-filter wt-column-filter-menu p-column-filter p-column-filter-menu">
      <button
        type="button"
        [class]="buttonClasses"
        [class.wt-column-filter-active]="active"
        [class.p-column-filter-menu-button-active]="active"
        aria-haspopup="dialog"
        [attr.aria-expanded]="menuOpen"
        [attr.aria-controls]="menuOpen ? menuId : null"
        [attr.aria-label]="ariaLabel || t.filter"
        (click)="toggleMenu($event)"
      >${FILTER_ICON}</button>
      <div *ngIf="menuOpen" class="wt-column-filter-overlay p-column-filter-overlay" popover="manual" role="dialog" [id]="menuId" [attr.aria-label]="t.filter">
        <div *ngIf="showOperator && rules.length > 1" class="wt-column-filter-operator p-column-filter-operator">
          <select class="wt-inputtext p-inputtext wt-column-filter-select" [attr.aria-label]="t.matchAll + ' / ' + t.matchAny" (change)="setOperator($event)">
            <option value="and" [selected]="operator === 'and'">{{ t.matchAll }}</option>
            <option value="or" [selected]="operator === 'or'">{{ t.matchAny }}</option>
          </select>
        </div>
        <div *ngFor="let rule of rules; let i = index" class="wt-column-filter-rule p-column-filter-constraint">
          <select *ngIf="showMatchModes && type !== 'boolean'" class="wt-inputtext p-inputtext wt-column-filter-select" [attr.aria-label]="t.filter" (change)="ruleMode(rule, $event)">
            <option *ngFor="let o of modeOptions" [value]="o.value" [selected]="rule.matchMode === o.value">{{ o.label }}</option>
          </select>
          <ng-container *ngIf="filterTemplate; else builtInRule">
            <ng-container *ngTemplateOutlet="filterTemplate; context: ruleContext(rule)"></ng-container>
          </ng-container>
          <ng-template #builtInRule>
            <button
              *ngIf="type === 'boolean'; else ruleBox"
              type="button"
              class="wt-column-filter-bool"
              role="checkbox"
              [class.wt-column-filter-bool-set]="rule.value === true || rule.value === false"
              [attr.aria-checked]="rule.value === true ? 'true' : rule.value === false ? 'false' : 'mixed'"
              [attr.aria-label]="ariaLabel || placeholder || field"
              (click)="ruleBool(rule)"
            >
              <ng-container *ngIf="rule.value === true">${CHECK_ICON}</ng-container>
              <ng-container *ngIf="rule.value === false">${X_ICON}</ng-container>
            </button>
            <ng-template #ruleBox>
              <input
                class="wt-inputtext p-inputtext p-component wt-column-filter-input"
                [attr.type]="inputType"
                [value]="show(rule.value)"
                [attr.placeholder]="placeholder || t.search"
                [attr.aria-label]="ariaLabel || placeholder || t.search"
                (input)="ruleInput(rule, $event)"
                (keydown.enter)="applyMenu()"
              />
            </ng-template>
          </ng-template>
          <button *ngIf="rules.length > 1" type="button" [class]="removeClass" (click)="removeRule(i)">{{ t.removeRule }}</button>
        </div>
        <button *ngIf="showAddButton && rules.length < maxConstraints && type !== 'boolean'" type="button" [class]="addClass" (click)="addRule()">+ {{ t.addRule }}</button>
        <div class="wt-column-filter-buttons p-column-filter-buttonbar">
          <button *ngIf="showClearButton" type="button" [class]="clearClass" (click)="clearMenu()">{{ t.clear }}</button>
          <button *ngIf="showApplyButton" type="button" [class]="applyClass" (click)="applyMenu()">{{ t.apply }}</button>
        </div>
      </div>
    </div>
    <ng-template #rowDisplay>
      <div class="wt-column-filter p-column-filter p-column-filter-row">
        <ng-container *ngIf="filterTemplate; else builtIn">
          <ng-container *ngTemplateOutlet="filterTemplate; context: context"></ng-container>
        </ng-container>
        <ng-template #builtIn>
          <button
            *ngIf="type === 'boolean'; else box"
            type="button"
            class="wt-column-filter-bool"
            role="checkbox"
            [class.wt-column-filter-bool-set]="hasValue"
            [attr.aria-checked]="value === true ? 'true' : value === false ? 'false' : 'mixed'"
            [attr.aria-label]="ariaLabel || placeholder || field"
            [attr.title]="boolLabel || null"
            (click)="cycle()"
          >
            <ng-container *ngIf="value === true">${CHECK_ICON}</ng-container>
            <ng-container *ngIf="value === false">${X_ICON}</ng-container>
          </button>
          <ng-template #box>
            <input
              class="wt-inputtext wt-column-filter-input p-inputtext p-component p-column-filter-input"
              [attr.type]="inputType"
              [value]="inputValue"
              [attr.placeholder]="placeholder || t.search"
              [attr.aria-label]="ariaLabel || placeholder || t.search"
              (input)="input($event)"
            />
          </ng-template>
        </ng-template>
        <button *ngIf="showClearButton && hasValue" type="button" class="wt-column-filter-clear p-column-filter-clear-button" [attr.aria-label]="t.clear" (click)="clear()">${X_ICON}</button>
      </div>
    </ng-template>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-column-filter-host' },
})
export class WtColumnFilter extends ɵWtColumnFilterBase {}
