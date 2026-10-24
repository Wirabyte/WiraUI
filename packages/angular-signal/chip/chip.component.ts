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
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/**
 * Compact label with an optional icon or image: `<wt-chip label="แอดมิน" icon="pi pi-user" removable (onRemove)="…">`.
 * A removable chip hides itself when its remove button is pressed and emits `onRemove`.
 */
@Component({
  selector: 'wt-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[hidden]': '!visible()' },
})
export class WtChip {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-user`. Ignored when `image` is set. */
  readonly icon = input<string>();
  readonly image = input<string>();
  readonly alt = input<string>();
  readonly removable = input(false, { transform: booleanAttribute });

  readonly onRemove = output<Event>();
  readonly onImageError = output<Event>();

  private readonly config = inject(WtConfig);
  readonly visible = signal(true);
  readonly classes = computed(() => {
    const c = ['wt-chip', 'p-chip', 'p-component'];
    if (this.image()) c.push('wt-chip-has-image');
    if (this.removable()) c.push('p-chip-removable');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
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
