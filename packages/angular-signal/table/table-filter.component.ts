import { NgTemplateOutlet } from '@angular/common';
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
  imports: [NgTemplateOutlet],
  template: `@if (display === 'menu') {
      <div class="wt-column-filter wt-column-filter-menu p-column-filter p-column-filter-menu">
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
        @if (menuOpen) {
          <div class="wt-column-filter-overlay p-column-filter-overlay" popover="manual" role="dialog" [id]="menuId" [attr.aria-label]="t.filter">
            @if (showOperator && rules.length > 1) {
              <div class="wt-column-filter-operator p-column-filter-operator">
                <select class="wt-inputtext p-inputtext wt-column-filter-select" [attr.aria-label]="t.matchAll + ' / ' + t.matchAny" (change)="setOperator($event)">
                  <option value="and" [selected]="operator === 'and'">{{ t.matchAll }}</option>
                  <option value="or" [selected]="operator === 'or'">{{ t.matchAny }}</option>
                </select>
              </div>
            }
            @for (rule of rules; track $index; let i = $index) {
              <div class="wt-column-filter-rule p-column-filter-constraint">
                @if (showMatchModes && type !== 'boolean') {
                  <select class="wt-inputtext p-inputtext wt-column-filter-select" [attr.aria-label]="t.filter" (change)="ruleMode(rule, $event)">
                    @for (o of modeOptions; track o.value) {
                      <option [value]="o.value" [selected]="rule.matchMode === o.value">{{ o.label }}</option>
                    }
                  </select>
                }
                @if (filterTemplate) {
                  <ng-container *ngTemplateOutlet="filterTemplate; context: ruleContext(rule)"></ng-container>
                } @else if (type === 'boolean') {
                  <button
                    type="button"
                    class="wt-column-filter-bool"
                    role="checkbox"
                    [class.wt-column-filter-bool-set]="rule.value === true || rule.value === false"
                    [attr.aria-checked]="rule.value === true ? 'true' : rule.value === false ? 'false' : 'mixed'"
                    [attr.aria-label]="ariaLabel || placeholder || field"
                    (click)="ruleBool(rule)"
                  >
                    @if (rule.value === true) {
                      ${CHECK_ICON}
                    } @else if (rule.value === false) {
                      ${X_ICON}
                    }
                  </button>
                } @else {
                  <input
                    class="wt-inputtext p-inputtext p-component wt-column-filter-input"
                    [attr.type]="inputType"
                    [value]="show(rule.value)"
                    [attr.placeholder]="placeholder || t.search"
                    [attr.aria-label]="ariaLabel || placeholder || t.search"
                    (input)="ruleInput(rule, $event)"
                    (keydown.enter)="applyMenu()"
                  />
                }
                @if (rules.length > 1) {
                  <button type="button" [class]="removeClass" (click)="removeRule(i)">{{ t.removeRule }}</button>
                }
              </div>
            }
            @if (showAddButton && rules.length < maxConstraints && type !== 'boolean') {
              <button type="button" [class]="addClass" (click)="addRule()">+ {{ t.addRule }}</button>
            }
            <div class="wt-column-filter-buttons p-column-filter-buttonbar">
              @if (showClearButton) {
                <button type="button" [class]="clearClass" (click)="clearMenu()">{{ t.clear }}</button>
              }
              @if (showApplyButton) {
                <button type="button" [class]="applyClass" (click)="applyMenu()">{{ t.apply }}</button>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="wt-column-filter p-column-filter p-column-filter-row">
        @if (filterTemplate) {
          <ng-container *ngTemplateOutlet="filterTemplate; context: context"></ng-container>
        } @else if (type === 'boolean') {
          <button
            type="button"
            class="wt-column-filter-bool"
            role="checkbox"
            [class.wt-column-filter-bool-set]="hasValue"
            [attr.aria-checked]="value === true ? 'true' : value === false ? 'false' : 'mixed'"
            [attr.aria-label]="ariaLabel || placeholder || field"
            [attr.title]="boolLabel || null"
            (click)="cycle()"
          >
            @if (value === true) {
              ${CHECK_ICON}
            } @else if (value === false) {
              ${X_ICON}
            }
          </button>
        } @else {
          <input
            class="wt-inputtext wt-column-filter-input p-inputtext p-component p-column-filter-input"
            [attr.type]="inputType"
            [value]="inputValue"
            [attr.placeholder]="placeholder || t.search"
            [attr.aria-label]="ariaLabel || placeholder || t.search"
            (input)="input($event)"
          />
        }
        @if (showClearButton && hasValue) {
          <button type="button" class="wt-column-filter-clear p-column-filter-clear-button" [attr.aria-label]="t.clear" (click)="clear()">${X_ICON}</button>
        }
      </div>
    }`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-column-filter-host' },
})
export class WtColumnFilter extends ɵWtColumnFilterBase {}
