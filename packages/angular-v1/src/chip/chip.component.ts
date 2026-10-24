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
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';

/**
 * Compact label with an optional icon or image: `<wt-chip label="แอดมิน" icon="pi pi-user" removable (onRemove)="…">`.
 * A removable chip hides itself when its remove button is pressed and emits `onRemove`.
 */
@Component({
  selector: 'wt-chip',
  standalone: true,
  imports: [NgIf],
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtChip implements OnDestroy {
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
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get classes(): string {
    const c = ['wt-chip', 'p-chip', 'p-component'];
    if (this.image) c.push('wt-chip-has-image', 'p-chip-image');
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
