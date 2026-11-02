import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWuMultiSelectBase } from './multiselect.base';

/**
 * Choose several options: `<wu-multiselect [options]="clubs" optionLabel="name" optionValue="id" [(ngModel)]="clubIds">`.
 * Check boxes in the list, a check-all box and a search in the header, chips with `display="chip"`; the list opens in
 * the top layer (no appendTo needed). Looks and themes like wu-select.
 */
@Component({
  selector: 'wu-multiselect, wu-multiSelect, wu-multi-select',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuMultiSelect), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wu-select-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused || open',
    '[style]': 'style',
    '(focusout)': 'focusOut($event)',
  },
})
export class WuMultiSelect extends ɵWuMultiSelectBase {}
