import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWtAutoCompleteBase } from './autocomplete.base';

/**
 * Suggestions while typing: `<wt-autocomplete [(ngModel)]="school" [suggestions]="found" (completeMethod)="find($event)"
 * optionLabel="name">`. The list opens in the top layer; looks and themes like wt-select.
 */
@Component({
  selector: 'wt-autocomplete, wt-autoComplete',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtAutoComplete), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wt-select-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused',
    '[style]': 'style',
  },
})
export class WtAutoComplete extends ɵWtAutoCompleteBase {}
