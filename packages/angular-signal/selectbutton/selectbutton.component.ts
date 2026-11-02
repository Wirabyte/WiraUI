import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  forwardRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵoptionDisabled, ɵoptionLabel, ɵoptionValue, ɵsameValue, ɵsize, ɵWU_SKIP_VERSION_CHECK, WuSize, WuTemplate } from 'wiraui/config';
import { WuSelectButtonChangeEvent, WuSelectButtonOptionClickEvent } from './selectbutton.types';

/**
 * Pick one option (or several with `multiple`) from a row of buttons:
 * `<wu-selectbutton [options]="plans" optionLabel="name" optionValue="id" [(ngModel)]="plan">`.
 */
@Component({
  selector: 'wu-selectbutton, wu-selectButton, wu-select-button',
  host: {
    '[class.wu-selectbutton-sm]': "sizeKey() === 'sm'",
    '[class.p-selectbutton-sm]': "sizeKey() === 'sm'",
    '[class.wu-selectbutton-lg]': "sizeKey() === 'lg'",
    '[class.p-selectbutton-lg]': "sizeKey() === 'lg'",
  },
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './selectbutton.component.html',
  styleUrl: './selectbutton.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WuSelectButton), multi: true }],
})
export class WuSelectButton implements ControlValueAccessor {
  private readonly slotTemplates = contentChildren(WuTemplate);
  private readonly itemRef = contentChild('item', { read: TemplateRef });
  readonly itemTemplate = computed(() => this.itemRef() || ɵfindTemplate(this.slotTemplates(), 'item'));
  readonly options = input<readonly unknown[] | null | undefined>([]);
  readonly optionLabel = input<string>();
  readonly optionValue = input<string>();
  readonly optionDisabled = input<string>();
  /** Compare object values by this property instead of identity. */
  readonly dataKey = input<string>();
  readonly multiple = input(false, { transform: booleanAttribute });
  /** Clicking the chosen option again clears it. Default true. */
  readonly allowEmpty = input(true, { transform: booleanAttribute });
  /** `[unselectable]="true"`: a click on the chosen option keeps it (the older opposite of `allowEmpty`). */
  readonly unselectable = input<boolean | undefined, unknown>(undefined, { transform: (v: unknown) => (v === undefined ? undefined : booleanAttribute(v)) });
  private readonly canEmpty = computed(() => (this.unselectable() === undefined ? this.allowEmpty() : !this.unselectable()));
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  /** `small` or `large` (also `sm` / `lg`). */
  readonly size = input<WuSize>();
  readonly sizeKey = computed(() => ɵsize(this.size()));
  readonly ariaLabelledBy = input<string>();

  readonly onChange = output<WuSelectButtonChangeEvent>();
  readonly onOptionClick = output<WuSelectButtonOptionClickEvent>();

  private readonly model = signal<unknown>(null);
  private readonly formDisabled = signal(false);
  private onModelChange: (value: unknown) => void = () => {};
  onTouched: () => void = () => {};

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly classes = computed(() => [this.baseClasses(), this.styleClass()].filter(Boolean).join(' '));
  readonly baseClasses = computed(() => {
    const c = ['wu-selectbutton', 'p-selectbutton', 'p-component'];
    if (this.invalid()) c.push('wu-invalid', 'p-invalid');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  labelOf(option: unknown): string {
    return ɵoptionLabel(option, this.optionLabel());
  }
  isOptionDisabled(option: unknown): boolean {
    return ɵoptionDisabled(option, this.optionDisabled());
  }
  isSelected(option: unknown): boolean {
    const value = ɵoptionValue(option, this.optionValue());
    const m = this.model();
    if (this.multiple()) return Array.isArray(m) && m.some((v) => ɵsameValue(v, value, this.dataKey()));
    return ɵsameValue(m, value, this.dataKey());
  }
  optionClasses(option: unknown): string {
    return this.isSelected(option)
      ? 'wu-selectbutton-option wu-selectbutton-option-checked p-togglebutton p-togglebutton-checked'
      : 'wu-selectbutton-option p-togglebutton';
  }

  select(option: unknown, index: number, event: Event): void {
    if (this.isDisabled() || this.isOptionDisabled(option)) return;
    const value = ɵoptionValue(option, this.optionValue());
    const selected = this.isSelected(option);
    let next: unknown;
    if (this.multiple()) {
      const current = Array.isArray(this.model()) ? (this.model() as unknown[]) : [];
      if (selected && !this.canEmpty() && current.length === 1) return;
      next = selected ? current.filter((v) => !ɵsameValue(v, value, this.dataKey())) : [...current, value];
    } else {
      if (selected && !this.canEmpty()) return;
      next = selected ? null : value;
    }
    this.model.set(next);
    this.onModelChange(next);
    this.onOptionClick.emit({ option, index, originalEvent: event });
    this.onChange.emit({ value: next, originalEvent: event });
  }

  writeValue(value: unknown): void {
    this.model.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
