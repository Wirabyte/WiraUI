import { NgClass, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWuInputMaskBase } from './inputmask.base';

/**
 * A text field with a pattern: `<wu-inputmask mask="9-9999-99999-99-9" [(ngModel)]="idCard" [unmask]="true">`.
 * The mask types its literals for the user; `(onComplete)` fires once every slot is filled.
 */
@Component({
  selector: 'wu-inputmask, wu-inputMask, wu-input-mask',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle],
  templateUrl: './inputmask.component.html',
  styleUrls: ['./inputmask.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuInputMask), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wu-inputmask-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused',
  },
})
export class WuInputMask extends ɵWuInputMaskBase {}
