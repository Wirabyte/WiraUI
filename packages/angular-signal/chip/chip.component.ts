import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig } from 'wiraui/config';

/**
 * Compact label with an optional icon or image: `<wu-chip label="แอดมิน" icon="pi pi-user" removable (onRemove)="…">`.
 * A removable chip hides itself when its remove button is pressed and emits `onRemove`.
 */
@Component({
  selector: 'wu-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[hidden]': '!visible()' },
})
export class WuChip {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-user`. Ignored when `image` is set. */
  readonly icon = input<string>();
  readonly image = input<string>();
  readonly alt = input<string>();
  readonly removable = input(false, { transform: booleanAttribute });

  readonly onRemove = output<Event>();
  readonly onImageError = output<Event>();

  private readonly config = inject(WuConfig);
  readonly visible = signal(true);
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
    const c = ['wu-chip', 'p-chip', 'p-component'];
    if (this.image()) c.push('wu-chip-has-image');
    if (this.removable()) c.push('p-chip-removable');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  removeLabel(): string {
    return this.config.translation.remove;
  }

  remove(event: Event): void {
    this.visible.set(false);
    this.onRemove.emit(event);
  }
}
