import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';

/**
 * Compact label with an optional icon or image: `<wu-chip label="แอดมิน" icon="pi pi-user" removable (onRemove)="…">`.
 * A removable chip hides itself when its remove button is pressed and emits `onRemove`.
 */
@Component({
  selector: 'wu-chip',
  standalone: true,
  imports: [NgIf],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuChip implements OnDestroy {
  @Input() label?: string;
  /** Icon class, e.g. `pi pi-user`. Ignored when `image` is set. */
  @Input() icon?: string;
  @Input() image?: string;
  @Input() alt?: string;
  @Input() set removable(v: unknown) { this._removable = ɵtoBool(v); }
  get removable(): boolean { return this._removable; }

  @Output() readonly onRemove = new EventEmitter<Event>();
  @Output() readonly onImageError = new EventEmitter<Event>();

  @HostBinding('hidden') get hidden(): boolean {
    return !this.visible;
  }

  visible = true;
  private _removable = false;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  /** Classes for the root element, as before (`styleClass="w-full"`). */
  @Input() styleClass?: string | null;
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The `style` object for the root (a plain style attribute already styles the host). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get classes(): string {
    return [this.baseClasses, this.styleClass].filter(Boolean).join(' ');
  }
  get baseClasses(): string {
    const c = ['wu-chip', 'p-chip', 'p-component'];
    if (this.image) c.push('wu-chip-has-image', 'p-chip-image');
    return c.join(' ');
  }

  get removeLabel(): string {
    return this.config.translation.remove + (this.label ? ' ' + this.label : '');
  }

  remove(event: Event): void {
    this.visible = false;
    this.onRemove.emit(event);
  }
}
