import { Injectable } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';

/** What the registry needs from a radio button. Implemented by WuRadioButton in every version. */
export interface ɵWuRadioAccessor {
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
export class ɵWuRadioRegistry {
  private readonly accessors: ɵWuRadioAccessor[] = [];

  add(accessor: ɵWuRadioAccessor): void {
    this.accessors.push(accessor);
  }

  remove(accessor: ɵWuRadioAccessor): void {
    const i = this.accessors.indexOf(accessor);
    if (i >= 0) this.accessors.splice(i, 1);
  }

  select(accessor: ɵWuRadioAccessor, value: unknown): void {
    const control = controlOf(accessor);
    if (!control) return;
    for (const other of this.accessors) {
      if (other !== accessor && controlOf(other) === control) other.writeValue(value);
    }
  }
}

function controlOf(a: ɵWuRadioAccessor): AbstractControl | null {
  return (a.ngControlRef && a.ngControlRef.control) || null;
}
