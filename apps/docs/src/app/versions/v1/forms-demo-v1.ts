import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme-v1';

@Component({
  selector: 'docs-forms-demo-v1',
  templateUrl: '../shared/forms-demo.html',
  standalone: false,
})
export class FormsDemoV1 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '15–17';
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
