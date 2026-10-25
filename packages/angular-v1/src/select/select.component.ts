import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWtSelectBase } from './select.base';

/**
 * Choose one option from a list: `<wt-select [options]="provinces" optionLabel="name_th" optionValue="id"
 * [(ngModel)]="provinceId" placeholder="เลือกจังหวัด" [filter]="true">`. The list opens in the top layer (no appendTo
 * needed); the search matches Thai and English, Thai digits as 0–9. `wt-dropdown` is the same component.
 */
@Component({
  selector: 'wt-select, wt-dropdown',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet],
  templateUrl: './select.component.html',
  styleUrls: ['./select.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtSelect), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wt-select-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused || open',
    '[style]': 'style',
    '(focusout)': 'focusOut($event)',
  },
})
export class WtSelect extends ɵWtSelectBase {}
