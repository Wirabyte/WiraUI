import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ɵseverity, ɵtoBool, ɵWuStyleLoader } from 'wiraui/config';
import { WU_BADGE_CSS } from './badge.styles';
import { WuBadgeSeverity, WuBadgeSize } from './badge.types';

/**
 * A badge on the corner of any element: `<i class="pi pi-bell" wuBadge value="3" severity="danger"></i>`
 * (or `pBadge`). Without a value it is a dot; `[badgeDisabled]="true"` hides it.
 */
@Directive({
  selector: '[wuBadge], [pBadge]',
  standalone: true,
  host: { class: 'wu-overlay-badge p-overlay-badge' },
})
export class WuBadgeDirective implements OnInit, OnDestroy {
  @Input() set value(v: string | number | null | undefined) {
    this._value = v;
    this.render();
  }
  @Input() set severity(v: WuBadgeSeverity | null | undefined) {
    this._severity = v;
    this.render();
  }
  /** `'small'`, `'large'` or `'xlarge'`; `badgeSize` is the same. */
  @Input() set size(v: WuBadgeSize | null | undefined) {
    this._size = v;
    this.render();
  }
  @Input() set badgeSize(v: WuBadgeSize | null | undefined) {
    this.size = v;
  }
  @Input() set badgeDisabled(v: unknown) {
    this._disabled = ɵtoBool(v);
    this.render();
  }
  @Input() set badgeStyleClass(v: string | null | undefined) {
    this._styleClass = v;
    this.render();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() set badgeStyle(v: Record<string, any> | null | undefined) {
    this._style = v;
    this.render();
  }

  private _value: string | number | null | undefined;
  private _severity: WuBadgeSeverity | null | undefined;
  private _size: WuBadgeSize | null | undefined;
  private _disabled = false;
  private _styleClass: string | null | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _style: Record<string, any> | null | undefined;
  private badge: HTMLSpanElement | null = null;
  private ready = false;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;

  constructor() {
    inject(ɵWuStyleLoader).load('badge', WU_BADGE_CSS);
  }

  ngOnInit(): void {
    this.ready = true;
    this.render();
  }

  ngOnDestroy(): void {
    this.badge?.remove();
  }

  private render(): void {
    if (!this.ready) return;
    if (this._disabled) {
      this.badge?.remove();
      this.badge = null;
      return;
    }
    if (!this.badge) {
      this.badge = this.host.ownerDocument.createElement('span');
      this.host.appendChild(this.badge);
    }
    const sev = ɵseverity(this._severity || undefined);
    const has = this._value !== undefined && this._value !== null && this._value !== '';
    const c = ['wu-badge', 'p-badge', 'p-component'];
    if (sev !== 'primary') c.push('wu-badge-' + sev, 'p-badge-' + sev);
    if (this._size === 'small') c.push('wu-badge-sm', 'p-badge-sm');
    if (this._size === 'large') c.push('wu-badge-lg', 'p-badge-lg');
    if (this._size === 'xlarge') c.push('wu-badge-xl', 'p-badge-xl');
    if (!has) c.push('wu-badge-dot', 'p-badge-dot');
    if (this._styleClass) c.push(this._styleClass);
    this.badge.className = c.join(' ');
    this.badge.textContent = has ? String(this._value) : '';
    this.badge.removeAttribute('style');
    for (const [k, v] of Object.entries(this._style || {})) this.badge.style.setProperty(k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), String(v));
  }
}
