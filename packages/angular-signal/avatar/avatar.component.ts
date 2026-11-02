import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWU_SKIP_VERSION_CHECK } from 'wiraui/config';
import { WuAvatarShape, WuAvatarSize } from './avatar.types';

/**
 * Picture, initials or icon: `<wu-avatar image="…" label="สม" shape="circle">`.
 * If the image fails to load it falls back to `label`, then `icon`.
 */
@Component({
  selector: 'wu-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuAvatar {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-user`. */
  readonly icon = input<string>();
  readonly image = input<string>();
  readonly size = input<WuAvatarSize>('normal');
  readonly shape = input<WuAvatarShape>('square');
  readonly ariaLabel = input<string>();

  readonly onImageError = output<Event>();

  /** The image URL that failed; a different URL gets a fresh chance to load. */
  private readonly failedImage = signal<string | null>(null);
  readonly showImage = computed(() => !!this.image() && this.image() !== this.failedImage());
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
    const c = ['wu-avatar', 'p-avatar', 'p-component'];
    if (this.shape() === 'circle') c.push('wu-avatar-circle', 'p-avatar-circle');
    if (this.size() === 'large') c.push('wu-avatar-lg', 'p-avatar-lg');
    if (this.size() === 'xlarge') c.push('wu-avatar-xl', 'p-avatar-xl');
    if (this.showImage()) c.push('wu-avatar-image', 'p-avatar-image');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  imageError(event: Event): void {
    this.failedImage.set(this.image() ?? null);
    this.onImageError.emit(event);
  }
}

/** Overlapping row of avatars: `<wu-avatar-group><wu-avatar …></wu-avatar>…</wu-avatar-group>`. */
@Component({
  selector: 'wu-avatar-group, wu-avatarGroup, wu-avatargroup',
  standalone: true,
  template: '<div class="wu-avatar-group p-avatar-group p-component"><ng-content></ng-content></div>',
  styleUrl: './avatar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuAvatarGroup {}
