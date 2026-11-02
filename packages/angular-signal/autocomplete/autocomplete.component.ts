import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWuAutoCompleteBase } from './autocomplete.base';

/**
 * Suggestions while typing: `<wu-autocomplete [(ngModel)]="school" [suggestions]="found" (completeMethod)="find($event)"
 * optionLabel="name">`. The list opens in the top layer; looks and themes like wu-select.
 */
@Component({
  selector: 'wu-autocomplete, wu-autoComplete, wu-auto-complete',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuAutoComplete), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wu-select-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused',
    '[style]': 'style',
  },
})
export class WuAutoComplete extends ɵWuAutoCompleteBase {}
