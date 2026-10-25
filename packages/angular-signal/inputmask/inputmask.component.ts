import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵWtInputMaskBase } from './inputmask.base';

/**
 * A text field with a pattern: `<wt-inputmask mask="9-9999-99999-99-9" [(ngModel)]="idCard" [unmask]="true">`.
 * The mask types its literals for the user; `(onComplete)` fires once every slot is filled.
 */
@Component({
  selector: 'wt-inputmask, wt-inputMask, wt-input-mask',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './inputmask.component.html',
  styleUrl: './inputmask.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WtInputMask), multi: true }],
  host: {
    class: 'p-inputwrapper',
    '[class.wt-inputmask-fluid]': 'fluid',
    '[class.p-inputwrapper-filled]': 'filled',
    '[class.p-inputwrapper-focus]': 'focused',
  },
})
export class WtInputMask extends ɵWtInputMaskBase {}
