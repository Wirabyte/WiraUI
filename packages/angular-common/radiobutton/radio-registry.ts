import { Injectable } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

/** What the registry needs from a radio button. Implemented by WtRadioButton in every version. */
export interface ɵWtRadioAccessor {
  /** The NgControl on the same element, looked up lazily (null without forms). */
  readonly ngControlRef: NgControl | null;
  /** Re-reads the group value so this radio shows checked or unchecked. */
  writeValue(value: unknown): void;
}

/**
 * With reactive forms several radios share one FormControl, and a control only writes back to the
 * accessor that changed it. When one radio is picked, the registry tells the others in its group
 * (same FormControl) to uncheck. Template-driven ngModel does not need this: each radio has its own
 * NgModel bound to the same field.
 */
@Injectable({ providedIn: 'root' })
export class ɵWtRadioRegistry {
  private readonly accessors: ɵWtRadioAccessor[] = [];

  add(accessor: ɵWtRadioAccessor): void {
    this.accessors.push(accessor);
  }

  remove(accessor: ɵWtRadioAccessor): void {
    const i = this.accessors.indexOf(accessor);
    if (i >= 0) this.accessors.splice(i, 1);
  }

  select(accessor: ɵWtRadioAccessor, value: unknown): void {
    const control = controlOf(accessor);
    if (!control) return;
    for (const other of this.accessors) {
      if (other !== accessor && controlOf(other) === control) other.writeValue(value);
    }
  }
}

function controlOf(a: ɵWtRadioAccessor): AbstractControl | null {
  return (a.ngControlRef && a.ngControlRef.control) || null;
}
