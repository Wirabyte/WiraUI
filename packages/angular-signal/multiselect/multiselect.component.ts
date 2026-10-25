import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWtMultiSelectBase } from './multiselect.base';

/**
 * Choose several options: `<wt-multiselect [options]="clubs" optionLabel="name" optionValue="id" [(ngModel)]="clubIds">`.
 * Check boxes in the list, a check-all box and a search in the header, chips with `display="chip"`; the list opens in
 * the top layer (no appendTo needed). Looks and themes like wt-select.
 */
@Component({
  selector: 'wt-multiselect, wt-multiSelect',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtMultiSelect), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wt-select-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused || open',
    '[style]': 'style',
    '(focusout)': 'focusOut($event)',
  },
})
export class WtMultiSelect extends ɵWtMultiSelectBase {}
