import { Directive, ElementRef, forwardRef, HostListener, inject, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { ɵtoBool } from 'wiraui/config';

/** The named filters, as before, plus `thai` (Thai letters and spaces). */
export type WuKeyFilterPreset = 'pint' | 'int' | 'pnum' | 'money' | 'num' | 'hex' | 'email' | 'alpha' | 'alphanum' | 'thai';

export const WU_KEYFILTER_PRESETS: Record<WuKeyFilterPreset, RegExp> = {
  pint: /^[\d]$/,
  int: /^[\d-]$/,
  pnum: /^[\d.]$/,
  money: /^[\d.\s,]$/,
  num: /^[\d.-]$/,
  hex: /^[0-9a-f]$/i,
  email: /^[a-z0-9_.\-@]$/i,
  alpha: /^[a-z_]$/i,
  alphanum: /^[a-z0-9_]$/i,
  thai: /^[฀-๿\s]$/,
};

/**
 * Lets only some characters into a field: `<input wuInputText wuKeyFilter="pint">` (or `pKeyFilter`), a preset name
 * or a RegExp tested on each character (`[wuKeyFilter]="/[0-9a-z]/i"`). Typing, pasting and dropping are all checked.
 * With `wuValidateOnly` (`pValidateOnly`) nothing is blocked; the form control gets a `keyfilter` error instead, the
 * RegExp then testing the whole value.
 */
@Directive({
  selector: '[wuKeyFilter], [pKeyFilter]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => WuKeyFilter), multi: true }],
})
export class WuKeyFilter implements Validator {
  @Input() set wuKeyFilter(v: WuKeyFilterPreset | RegExp | string | null | undefined) {
    this.filter = v;
  }
  @Input() set pKeyFilter(v: WuKeyFilterPreset | RegExp | string | null | undefined) {
    this.filter = v;
  }
  @Input() set wuValidateOnly(v: unknown) {
    this.validateOnly = ɵtoBool(v);
  }
  @Input() set pValidateOnly(v: unknown) {
    this.validateOnly = ɵtoBool(v);
  }

  private filter: WuKeyFilterPreset | RegExp | string | null | undefined;
  private validateOnly = false;
  private readonly el: HTMLInputElement = inject(ElementRef).nativeElement;

  /** The test for one character. */
  get charRegex(): RegExp | null {
    const f = this.filter;
    if (!f) return null;
    if (f instanceof RegExp) return new RegExp(f.source, f.flags.replace('g', ''));
    if (f in WU_KEYFILTER_PRESETS) return WU_KEYFILTER_PRESETS[f as WuKeyFilterPreset];
    try {
      return new RegExp(f);
    } catch {
      return null;
    }
  }

  allows(text: string): boolean {
    const re = this.charRegex;
    if (!re) return true;
    for (const ch of text) if (!re.test(ch)) return false;
    return true;
  }

  @HostListener('beforeinput', ['$event'])
  beforeInput(event: InputEvent): void {
    if (this.validateOnly) return;
    const t = event.inputType || '';
    if (!t.startsWith('insert') || t === 'insertLineBreak' || t === 'insertParagraph') return;
    // Pastes and drops are handled below, with the whole text.
    if (t === 'insertFromPaste' || t === 'insertFromDrop') return;
    const data = event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
    if (data && !this.allows(data)) event.preventDefault();
  }

  @HostListener('paste', ['$event'])
  paste(event: ClipboardEvent): void {
    if (this.validateOnly) return;
    const text = event.clipboardData?.getData('text/plain') ?? '';
    if (text && !this.allows(text)) event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  drop(event: DragEvent): void {
    if (this.validateOnly) return;
    const text = event.dataTransfer?.getData('text/plain') ?? '';
    if (text && !this.allows(text)) event.preventDefault();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.validateOnly) return null;
    const v = control.value;
    if (v === null || v === undefined || v === '') return null;
    const f = this.filter;
    const whole = f instanceof RegExp ? f : null;
    const ok = whole ? new RegExp(whole.source, whole.flags.replace('g', '')).test(String(v)) : this.allows(String(v));
    return ok ? null : { keyfilter: true };
  }
}
