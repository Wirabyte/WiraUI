import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme/config';
import { WtAvatarShape, WtAvatarSize } from './avatar.types';

/**
 * Picture, initials or icon: `<wt-avatar image="…" label="สม" shape="circle">`.
 * If the image fails to load it falls back to `label`, then `icon`.
 */
@Component({
  selector: 'wt-avatar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAvatar {
  @Input() label?: string;
  /** Icon class, e.g. `pi pi-user`. */
  @Input() icon?: string;
  @Input() image?: string;
  @Input() size: WtAvatarSize = 'normal';
  @Input() shape: WtAvatarShape = 'square';
  @Input() ariaLabel?: string;

  @Output() readonly onImageError = new EventEmitter<Event>();

  /** The image URL that failed; a different URL gets a fresh chance to load. */
  private failedImage: string | null = null;
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get showImage(): boolean {
    return !!this.image && this.image !== this.failedImage;
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
    const c = ['wt-avatar', 'p-avatar', 'p-component'];
    if (this.shape === 'circle') c.push('wt-avatar-circle', 'p-avatar-circle');
    if (this.size === 'large') c.push('wt-avatar-lg', 'p-avatar-lg');
    if (this.size === 'xlarge') c.push('wt-avatar-xl', 'p-avatar-xl');
    if (this.showImage) c.push('wt-avatar-image', 'p-avatar-image');
    return c.join(' ');
  }

  imageError(event: Event): void {
    this.failedImage = this.image ?? null;
    this.onImageError.emit(event);
    this.cdr.markForCheck();
  }
}

/** Overlapping row of avatars: `<wt-avatar-group><wt-avatar …></wt-avatar>…</wt-avatar-group>`. */
@Component({
  selector: 'wt-avatar-group, wt-avatarGroup, wt-avatargroup',
  standalone: true,
  template: '<div class="wt-avatar-group p-avatar-group p-component"><ng-content></ng-content></div>',
  styleUrls: ['./avatar.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtAvatarGroup {}
