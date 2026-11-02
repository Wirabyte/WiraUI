import { AfterViewInit, Directive, ElementRef, inject, Input, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { ɵassertSupportedAngular, ɵrippleAt, ɵsize, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig, ɵWuStyleLoader } from 'wiraui/config';
import { ɵbuttonExtras } from './button-class';
import { WU_BUTTON_CSS } from './button.styles';
import { WuButtonSeverity, WuButtonSize, WuButtonVariant } from './button.types';

/**
 * Draws a native `<button>` (or `<a>`) as a wu-button: `<button wuButton label="บันทึก" icon="pi pi-check" class="p-button-sm">`.
 * The `pButton` attribute existing templates use works the same, and so do their classic class names
 * (`p-button-sm`, `p-button-success`, `p-button-text`, `p-button-rounded` …).
 */
@Directive({
  selector: 'button[wuButton], a[wuButton], button[pButton], a[pButton]',
  standalone: true,
  host: { '(pointerdown)': 'press($event)' },
})
export class WuButtonDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() label?: string;
  /** Icon class, e.g. `pi pi-check`. */
  @Input() icon?: string;
  @Input() iconPos: 'left' | 'right' | 'top' | 'bottom' = 'left';
  @Input() severity?: WuButtonSeverity;
  @Input() variant?: WuButtonVariant;
  @Input() size?: WuButtonSize;
  @Input() set outlined(v: unknown) { this._outlined = ɵtoBool(v); }
  @Input() set text(v: unknown) { this._text = ɵtoBool(v); }
  @Input() set raised(v: unknown) { this._raised = ɵtoBool(v); }
  @Input() set rounded(v: unknown) { this._rounded = ɵtoBool(v); }
  /** A spinner instead of the icon, and the button cannot be pressed. */
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  @Input() badge?: string | number;

  private _outlined = false;
  private _text = false;
  private _raised = false;
  private _rounded = false;
  private _loading = false;
  private applied: string[] = [];
  private iconEl: HTMLElement | null = null;
  private labelEl: HTMLElement | null = null;
  private badgeEl: HTMLElement | null = null;
  private wasDisabled: boolean | null = null;
  private ready = false;
  private readonly el: HTMLButtonElement = inject(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly config = inject(WuConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', WU_BUTTON_CSS);
  }

  ngOnChanges(): void {
    if (this.ready) this.render();
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.applied = [];
  }

  /** Host listeners hand over a plain `Event` in newer Angular versions; it is a PointerEvent here. */
  press(event: Event): void {
    if (this.config.ripple && !this.el.hasAttribute('disabled')) ɵrippleAt(this.el, event as PointerEvent);
  }

  private render(): void {
    // Classes: ours for every state, plus our equivalents of the classic names already in the class attribute.
    for (const c of this.applied) this.el.classList.remove(c);
    const sev = this.severity === 'warning' ? 'warn' : this.severity;
    const variant = this._outlined ? 'outlined' : this._text ? 'text' : this.variant;
    const size = ɵsize(this.size);
    const c = ['wu-btn', 'p-button', 'p-component'];
    if (sev && sev !== 'primary') c.push('wu-btn-' + sev, 'p-button-' + sev);
    if (variant && variant !== 'solid') c.push('wu-btn-' + variant, 'p-button-' + variant);
    if (size) c.push('wu-btn-' + size, 'p-button-' + size);
    if (this._raised) c.push('wu-btn-raised', 'p-button-raised');
    if (this._rounded) c.push('wu-btn-rounded', 'p-button-rounded');
    if (this._loading) c.push('wu-btn-loading', 'p-button-loading');
    const own = Array.from(this.el.classList).filter((k) => !this.applied.includes(k)).join(' ');
    c.push(...ɵbuttonExtras(own).split(' ').filter((k) => k && !this.el.classList.contains(k)));
    this.applied = c.filter((k) => !this.el.classList.contains(k));
    for (const k of this.applied) this.el.classList.add(k);

    this.renderIcon();
    this.renderLabel();
    this.renderBadge();
    const iconOnly = !this.label && !!(this.icon || this._loading) && !this.ownText();
    this.toggle('wu-btn-icon-only', iconOnly);
    this.toggle('p-button-icon-only', iconOnly);
    this.toggle('p-button-vertical', this.iconPos === 'top' || this.iconPos === 'bottom');

    // Loading blocks presses without losing a disabled state the app set itself.
    if (this._loading && this.wasDisabled === null) {
      this.wasDisabled = this.el.hasAttribute('disabled');
      this.renderer.setAttribute(this.el, 'disabled', '');
      this.renderer.setAttribute(this.el, 'aria-busy', 'true');
    } else if (!this._loading && this.wasDisabled !== null) {
      if (!this.wasDisabled) this.renderer.removeAttribute(this.el, 'disabled');
      this.renderer.removeAttribute(this.el, 'aria-busy');
      this.wasDisabled = null;
    }
  }

  private renderIcon(): void {
    const want = this._loading || !!this.icon;
    if (!want) {
      this.iconEl?.remove();
      this.iconEl = null;
      return;
    }
    if (!this.iconEl) this.iconEl = this.renderer.createElement('span');
    const icon = this.iconEl as HTMLElement;
    icon.setAttribute('aria-hidden', 'true');
    icon.className = this._loading
      ? 'wu-btn-spinner p-button-loading-icon'
      : `wu-btn-icon p-button-icon p-button-icon-${this.iconPos} ${this.icon}`;
    const after = this.iconPos === 'right' || this.iconPos === 'bottom';
    if (after) this.el.appendChild(icon);
    else this.el.insertBefore(icon, this.el.firstChild);
  }

  private renderLabel(): void {
    if (!this.label) {
      this.labelEl?.remove();
      this.labelEl = null;
      return;
    }
    if (!this.labelEl) {
      this.labelEl = this.renderer.createElement('span');
      (this.labelEl as HTMLElement).className = 'wu-btn-label p-button-label';
    }
    const label = this.labelEl as HTMLElement;
    label.textContent = this.label;
    if (this.iconEl && this.iconEl.parentNode === this.el && this.iconPos !== 'right' && this.iconPos !== 'bottom') this.iconEl.after(label);
    else if (this.iconEl && this.iconEl.parentNode === this.el) this.el.insertBefore(label, this.iconEl);
    else this.el.appendChild(label);
  }

  private renderBadge(): void {
    const has = this.badge !== undefined && this.badge !== null && this.badge !== '';
    if (!has) {
      this.badgeEl?.remove();
      this.badgeEl = null;
      return;
    }
    if (!this.badgeEl) {
      this.badgeEl = this.renderer.createElement('span');
      (this.badgeEl as HTMLElement).className = 'wu-btn-badge p-badge p-component';
    }
    (this.badgeEl as HTMLElement).textContent = String(this.badge);
    this.el.appendChild(this.badgeEl as HTMLElement);
  }

  /** Text the app wrote inside the button, besides what this directive added. */
  private ownText(): boolean {
    return Array.from(this.el.childNodes).some((n) => n !== this.iconEl && n !== this.labelEl && n !== this.badgeEl && !!n.textContent?.trim());
  }

  private toggle(cls: string, on: boolean): void {
    this.el.classList.toggle(cls, on);
  }
}
