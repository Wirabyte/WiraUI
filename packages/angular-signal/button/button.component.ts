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
import { ɵassertSupportedAngular, ɵrippleAt, ɵsize, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';
import { ɵbuttonExtras } from './button-class';
import { WuButtonAction, WuButtonSeverity, WuButtonSize, WuButtonVariant } from './button.types';

/**
 * Button with the familiar inputs (`label`, `icon`, `severity`, `outlined`, `text`, `loading`, `(onClick)`)
 * plus `[action]`: pass a function returning a Promise or Observable and the button shows a spinner
 * and ignores repeat clicks until it settles.
 */
@Component({
  selector: 'wu-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.wu-button-fluid]': 'fluid()' },
})
export class WuButton {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-check` or `fa-solid fa-floppy-disk`. */
  readonly icon = input<string>();
  readonly iconPos = input<'left' | 'right'>('left');
  readonly severity = input<WuButtonSeverity>('primary');
  readonly variant = input<WuButtonVariant>('solid');
  readonly outlined = input(false, { transform: booleanAttribute });
  readonly text = input(false, { transform: booleanAttribute });
  readonly raised = input(false, { transform: booleanAttribute });
  /** Drawn as a link. */
  readonly link = input(false, { transform: booleanAttribute });
  /** Colour of the badge: `danger`, `success` … */
  readonly badgeSeverity = input<string | null | undefined>();
  readonly rounded = input(false, { transform: booleanAttribute });
  readonly fluid = input(false, { transform: booleanAttribute });
  readonly size = input<WuButtonSize>();
  /** Extra classes for the <button>; the classic names (`p-button-sm`, `p-button-danger p-button-text`) work as they did. */
  readonly styleClass = input<string>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly badge = input<string | number>();
  readonly ariaLabel = input<string>();
  readonly action = input<WuButtonAction>();

  readonly onClick = output<MouseEvent>();

  private readonly config = inject(WuConfig);
  private readonly pending = signal(false);

  readonly busy = computed(() => this.loading() || this.pending());
  readonly showIcon = computed(() => !!this.icon() && !this.busy());
  /** Our classes plus the styled-era `p-*` names for the same state, so app CSS written for `.p-button` keeps working. */
  readonly classes = computed(() => {
    const sev = this.severity() === 'warning' ? 'warn' : this.severity();
    const variant = this.link() ? 'link' : this.outlined() ? 'outlined' : this.text() ? 'text' : this.variant();
    const c = ['wu-btn', 'p-button', 'p-component'];
    if (sev !== 'primary') c.push('wu-btn-' + sev, 'p-button-' + sev);
    if (variant !== 'solid') c.push('wu-btn-' + variant, 'p-button-' + variant);
    const size = ɵsize(this.size());
    if (size === 'sm') c.push('wu-btn-sm', 'p-button-sm');
    if (size === 'lg') c.push('wu-btn-lg', 'p-button-lg');
    if (this.raised()) c.push('wu-btn-raised', 'p-button-raised');
    if (this.rounded()) c.push('wu-btn-rounded', 'p-button-rounded');
    if (this.fluid()) c.push('p-button-fluid');
    if (this.busy()) c.push('wu-btn-loading', 'p-button-loading');
    if (!this.label() && (this.icon() || this.busy())) c.push('wu-btn-icon-only', 'p-button-icon-only');
    const extra = this.styleClass();
    if (extra) c.push(ɵbuttonExtras(extra));
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
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
