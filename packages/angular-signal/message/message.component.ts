import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  OnInit,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵseverity, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { WtMessageSeverity, WtMessageSize, WtMessageVariant } from './message.types';

/**
 * Inline status message: `<wt-message severity="warn" text="กรุณาตรวจสอบข้อมูล" closable>`.
 * Projected content follows `text`. `life` (ms) closes it automatically; closing emits `onClose`.
 */
@Component({
  selector: 'wt-message',
  standalone: true,
  templateUrl: './message.component.html',
  styleUrl: './message.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[hidden]': '!visible()' },
})
export class WtMessage implements OnInit {
  readonly severity = input<WtMessageSeverity>('info');
  readonly text = input<string>();
  /** Icon class instead of the built-in icon, e.g. `pi pi-bell`. */
  readonly icon = input<string>();
  readonly closable = input(false, { transform: booleanAttribute });
  /** Close automatically after this many milliseconds. */
  readonly life = input(0, { transform: numberAttribute });
  readonly size = input<WtMessageSize>();
  readonly variant = input<WtMessageVariant>();

  readonly onClose = output<Event | null>();

  private readonly config = inject(WtConfig);
  private readonly destroyRef = inject(DestroyRef);
  readonly visible = signal(true);
  readonly sev = computed(() => ɵseverity(this.severity(), 'info'));
  readonly classes = computed(() => {
    const sev = this.sev();
    // The styled class names spell danger as error.
    const c = ['wt-message', 'p-message', 'p-component', 'wt-message-' + sev, 'p-message-' + (sev === 'danger' ? 'error' : sev)];
    if (this.size() === 'small') c.push('wt-message-sm', 'p-message-sm');
    if (this.size() === 'large') c.push('wt-message-lg', 'p-message-lg');
    if (this.variant()) c.push('wt-message-' + this.variant(), 'p-message-' + this.variant());
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  ngOnInit(): void {
    const life = this.life();
    if (life > 0) {
      const timer = setTimeout(() => this.close(null), life);
      this.destroyRef.onDestroy(() => clearTimeout(timer));
    }
  }

  closeLabel(): string {
    return this.config.translation.close;
  }

  close(event: Event | null): void {
    if (!this.visible()) return;
    this.visible.set(false);
    this.onClose.emit(event);
  }
}
