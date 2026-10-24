import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtAvatarShape, WtAvatarSize } from './avatar.types';

/**
 * Picture, initials or icon: `<wt-avatar image="…" label="สม" shape="circle">`.
 * If the image fails to load it falls back to `label`, then `icon`.
 */
@Component({
  selector: 'wt-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAvatar {
  readonly label = input<string>();
  /** Icon class, e.g. `pi pi-user`. */
  readonly icon = input<string>();
  readonly image = input<string>();
  readonly size = input<WtAvatarSize>('normal');
  readonly shape = input<WtAvatarShape>('square');
  readonly ariaLabel = input<string>();

  readonly onImageError = output<Event>();

  /** The image URL that failed; a different URL gets a fresh chance to load. */
  private readonly failedImage = signal<string | null>(null);
  readonly showImage = computed(() => !!this.image() && this.image() !== this.failedImage());
  readonly classes = computed(() => {
    const c = ['wt-avatar', 'p-avatar', 'p-component'];
    if (this.shape() === 'circle') c.push('wt-avatar-circle', 'p-avatar-circle');
    if (this.size() === 'large') c.push('wt-avatar-lg', 'p-avatar-lg');
    if (this.size() === 'xlarge') c.push('wt-avatar-xl', 'p-avatar-xl');
    if (this.showImage()) c.push('wt-avatar-image', 'p-avatar-image');
    return c.join(' ');
  });

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  imageError(event: Event): void {
    this.failedImage.set(this.image() ?? null);
    this.onImageError.emit(event);
  }
}

/** Overlapping row of avatars: `<wt-avatar-group><wt-avatar …></wt-avatar>…</wt-avatar-group>`. */
@Component({
  selector: 'wt-avatar-group',
  standalone: true,
  template: '<div class="wt-avatar-group p-avatar-group p-component"><ng-content></ng-content></div>',
  styleUrl: './avatar.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAvatarGroup {}
