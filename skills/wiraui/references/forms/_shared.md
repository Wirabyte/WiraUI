# Shared rules: forms

## Form: text inputs and field helpers

Common to all form controls here: use with `FormsModule` (`[(ngModel)]`, needs a `name` inside a `<form>`) or `ReactiveFormsModule` (`formControlName`). `size`/`wuSize` accept `small` | `large`. `[fluid]="true"` = full width. `[invalid]="true"` forces the red style; inside a form a control turns red by itself once invalid and touched (`ng-invalid.ng-touched`). All text fields share the `--wu-field-*` tokens and `overrides: components.input` (e.g. `input: { radius: '10px' }`).

## Form: choosing values

All are form controls (ControlValueAccessor): `[(ngModel)]` with `FormsModule`, or `formControlName` with `ReactiveFormsModule`. Import pattern per component: `WuXxxModule` (NgModule) or `WuXxx` (standalone) from `@wirabyte/ui/<entry>`; entry = lowercase name.

Shared by the five list-style fields (Select, MultiSelect, AutoComplete, Listbox, SelectButton): `options` + `optionLabel` + `optionValue` + `optionDisabled` + `dataKey`.
- `optionLabel` / `optionValue` / `optionDisabled` name an object field (dot paths are accepted on Select, MultiSelect, AutoComplete).
- Leave `optionValue` out and the model holds the whole option object. Then use `dataKey="id"` to compare by that field, so data re-fetched from an API still matches the chosen one.
- Groups (Select, MultiSelect, AutoComplete, Listbox): `[group]="true"`, options become `{ label, items }`; rename with `optionGroupLabel` / `optionGroupChildren`.

## Form: dates, files, editor and other rich inputs

All of these implement ControlValueAccessor except FileUpload (it emits events and exposes `files`). Import pattern: `WuXxxModule` (NgModule) or `WuXxx` (standalone) from `@wirabyte/ui/<entry>`.
