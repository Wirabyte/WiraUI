import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { WtButton } from 'wiratheme/button';
import { WtCard } from 'wiratheme/card';
import { WtCheckbox } from 'wiratheme/checkbox';
import { definePreset, palette, Siam, WtThemeService } from 'wiratheme/config';
import { WtInputText } from 'wiratheme/inputtext';
import { WtRadioButton } from 'wiratheme/radiobutton';
import { WtTextarea } from 'wiratheme/textarea';
import { WtToggleSwitch } from 'wiratheme/toggleswitch';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    WtButton,
    WtCard,
    WtInputText,
    WtTextarea,
    WtCheckbox,
    WtRadioButton,
    WtToggleSwitch,
  ],
  templateUrl: './app.component.html',
})
export class App {
  readonly major = WIRATHEME_MAJOR;
  readonly ngVersion = VERSION.full;
  saved = 0;

  /** Template-driven form (ngModel). */
  tdf = { name: '', note: '', agree: false, docs: [] as string[], plan: '', notify: false };

  /** Reactive form. */
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    note: new FormControl('', { nonNullable: true }),
    agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    plan: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notify: new FormControl(false, { nonNullable: true }),
  });

  private readonly theme = inject(WtThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        this.cdr.markForCheck();
        resolve();
      }, 600)
    );

  useBlue(): void {
    this.theme.setPrimary('#2563eb');
  }

  /** A whole theme from TypeScript; it replaces the SCSS/CSS theme values in the tokens layer. */
  useSiam(): void {
    this.theme.setPreset(definePreset(Siam, { semantic: { primary: palette('#e11d48') } }));
  }

  toggleDark(): void {
    this.theme.setDarkMode(!this.theme.isDarkMode());
  }

  submit(): void {
    this.form.markAllAsTouched();
  }

  patch(): void {
    this.form.patchValue({ name: 'กัญญาณัฐ', note: 'บรรทัด 1\nบรรทัด 2', agree: true, plan: 'art', notify: true });
  }

  toggleDisabled(): void {
    if (this.form.enabled) this.form.disable();
    else this.form.enable();
  }
}
