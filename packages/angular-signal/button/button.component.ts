import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { isObservable } from 'rxjs';
import { ɵassertSupportedAngular, ɵrippleAt, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { WtButtonAction, WtButtonSeverity, WtButtonSize, WtButtonVariant } from './button.types';

/**
 * Button with PrimeNG-style inputs (`label`, `icon`, `severity`, `outlined`, `text`, `loading`, `(onClick)`)
 * plus `[action]`: pass a function returning a Promise or Observable and the button shows a spinner
 * and ignores repeat clicks until it settles.
 */
@Component({
  selector: 'wt-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.wt-button-fluid]': 'fluid()' },
})
export class WtButton {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-check` or `fa-solid fa-floppy-disk`. */
  readonly icon = input<string>();
  readonly iconPos = input<'left' | 'right'>('left');
  readonly severity = input<WtButtonSeverity>('primary');
  readonly variant = input<WtButtonVariant>('solid');
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly text = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly size = input<WtButtonSize>();
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly badge = input<string | number>();
  readonly ariaLabel = input<string>();
  readonly action = input<WtButtonAction>();

  readonly onClick = output<MouseEvent>();

  private readonly config = inject(WtConfig);
  private readonly pending = signal(false);

  readonly busy = computed(() => this.loading() || this.pending());
  readonly showIcon = computed(() => !!this.icon() && !this.busy());
  readonly classes = computed(() => {
    const sev = this.severity() === 'warning' ? 'warn' : this.severity();
    const variant = this.outlined() ? 'outlined' : this.text() ? 'text' : this.variant();
    const c = ['wt-btn'];
    if (sev !== 'primary') c.push('wt-btn-' + sev);
    if (variant !== 'solid') c.push('wt-btn-' + variant);
    if (this.size() === 'small') c.push('wt-btn-sm');
    if (this.size() === 'large') c.push('wt-btn-lg');
    if (this.raised()) c.push('wt-btn-raised');
    if (this.rounded()) c.push('wt-btn-rounded');
    if (this.busy()) c.push('wt-btn-loading');
    if (!this.label() && (this.icon() || this.busy())) c.push('wt-btn-icon-only');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  handleClick(event: MouseEvent): void {
    if (this.busy()) return;
    this.onClick.emit(event);
    const fn = this.action();
    if (!fn) return;
    const result = fn();
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      this.pending.set(true);
      (result as Promise<unknown>).then(
        () => this.pending.set(false),
        () => this.pending.set(false)
      );
    } else if (isObservable(result)) {
      this.pending.set(true);
      result.subscribe({ error: () => this.pending.set(false), complete: () => this.pending.set(false) });
    }
  }

  handlePointerDown(event: PointerEvent): void {
    if (this.config.ripple && !this.disabled() && !this.busy()) ɵrippleAt(event.currentTarget as HTMLElement, event);
  }
}
