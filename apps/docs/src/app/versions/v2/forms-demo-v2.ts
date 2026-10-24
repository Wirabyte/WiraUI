import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme-v2';

@Component({
  selector: 'docs-forms-demo-v2',
  templateUrl: '../shared/forms-demo.html',
  standalone: false,
})
export class FormsDemoV2 {
  readonly major = WIRATHEME_MAJOR;
  readonly range = '18–20';
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
