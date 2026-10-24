import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme';

@Component({
  selector: 'docs-forms-demo-v3',
  templateUrl: '../shared/forms-demo.html',
  standalone: false,
})
export class FormsDemoV3 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '21+';
  model = { name: '', note: '', agree: false, plan: '', notify: false };
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    plan: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notify: new FormControl(false, { nonNullable: true }),
  });

  patch(): void {
    this.form.patchValue({ name: 'กัญญาณัฐ', agree: true, plan: 'art', notify: true });
  }
}
