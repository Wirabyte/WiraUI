import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWT_SKIP_VERSION_CHECK, WtMenuItem, WtTemplate } from 'wiratheme/config';
import { dockScale } from 'wiratheme/core';

/** `(onItemClick)`: the item clicked (or chosen with Enter / Space). */
export interface WtDockItemClickEvent {
  originalEvent: Event;
  item: WtMenuItem;
}

/** Where the dock sits in its box. */
export type WtDockPosition = 'bottom' | 'top' | 'left' | 'right';

/** `'mac'`: a floating shelf whose icons swell under the pointer. `'windows'`: a full-width taskbar, icons centred. */
export type WtDockLook = 'mac' | 'windows';

const POSITIONS: WtDockPosition[] = ['bottom', 'top', 'left', 'right'];
const BOUNCE_MS = 1100;

/**
 * A row of launcher icons along an edge of its box, like a desktop's dock or taskbar:
 * `<wt-dock [model]="apps" position="bottom">`. Items are menu items (`label`, `icon`, `image`, `command`, `url`,
 * `routerLink`, `disabled`, `badge`); `active: true` marks a running app with a dot (Windows: a bar, wider for the
 * `current` one); `separator: true` draws a divider. `look="mac"` (default) swells the icons under the pointer and bounces
 * one when clicked; `look="windows"` is a full-width taskbar with `start` and `end` slots (start button, clock and tray).
 * `<ng-template wtTemplate="item" let-item>` (or `pTemplate="item"`) draws each icon. It sits absolutely in its nearest
 * positioned parent, like the dock it replaces. Arrow keys move along it, Home / End jump, Enter or Space opens.
 */
@Component({
  selector: 'wt-dock',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet, RouterLink],
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wt-dock-host' },
})
export class WtDock implements AfterViewInit, OnDestroy {
  @Input() model: WtMenuItem[] | null | undefined;
  /** `'bottom'` (default), `'top'`, `'left'` or `'right'`. */
  @Input() set position(v: WtDockPosition | string | null | undefined) {
    this._position = POSITIONS.includes(v as WtDockPosition) ? (v as WtDockPosition) : 'bottom';
  }
  get position(): WtDockPosition {
    return this._position;
  }
  /** `'mac'` (default) or `'windows'`. */
  @Input() set look(v: WtDockLook | string | null | undefined) {
    this._look = v === 'windows' ? 'windows' : 'mac';
  }
  get look(): WtDockLook {
    return this._look;
  }
  /** Icons swell under the pointer (the mac look). Default true. */
  @Input() magnify: boolean | string | null | undefined = true;
  /** How big the icon under the pointer gets. Default 1.8. */
  @Input() magnification: number | string | null | undefined = 1.8;
  /** Icon size, px. Default 48 (windows 40). */
  @Input() size: number | string | null | undefined;
  @Input() ariaLabel?: string | null;
  @Input() ariaLabelledBy?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onItemClick = new EventEmitter<WtDockItemClickEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ViewChild('list') private listRef?: ElementRef<HTMLElement>;

  /** The item the keys are on (the one in the tab order). */
  focusIndex = 0;
  /** The item bouncing after a click (mac). */
  bouncing = -1;

  private _position: WtDockPosition = 'bottom';
  private _look: WtDockLook = 'mac';
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private stop: (() => void) | null = null;
  private bounceTimer: ReturnType<typeof setTimeout> | null = null;
  /** Item centres along the dock with every icon at its own size, measured as the pointer comes in. */
  private centres: number[] = [];
  /** The icon size that fits the box (0: no limit), like a dock that shrinks when its screen is narrow. */
  private fit = 0;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    const list = this.listRef?.nativeElement;
    if (!list || typeof window === 'undefined') return;
    const root = this.host.querySelector<HTMLElement>('.wt-dock');
    if (root && typeof ResizeObserver !== 'undefined') {
      // Shrink the icons when the box is too short for them all (on the next frame: changing them inside the observer's
      // callback would trip its loop warning).
      let frame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => this.fitTo(root));
      });
      this.zone.runOutsideAngular(() => observer.observe(root));
      const stopObserver = () => observer.disconnect();
      const before = this.stop;
      this.stop = () => {
        before?.();
        stopObserver();
      };
    }
    // The pointer moves often: keep it out of change detection, setting each icon's scale directly.
    this.zone.runOutsideAngular(() => {
      const move = (e: PointerEvent) => this.swell(e);
      const enter = () => this.measure();
      const leave = () => this.settle();
      list.addEventListener('pointerenter', enter);
      list.addEventListener('pointermove', move);
      list.addEventListener('pointerleave', leave);
      const before = this.stop;
      this.stop = () => {
        before?.();
        list.removeEventListener('pointerenter', enter);
        list.removeEventListener('pointermove', move);
        list.removeEventListener('pointerleave', leave);
      };
    });
  }

  ngOnDestroy(): void {
    this.stop?.();
    if (this.bounceTimer) clearTimeout(this.bounceTimer);
  }

  // ---------- what the template reads ----------

  get items(): WtMenuItem[] {
    return (this.model || []).filter((i) => i && i.visible !== false);
  }
  get vertical(): boolean {
    return this._position === 'left' || this._position === 'right';
  }
  get itemSize(): number {
    const n = Number(this.size);
    const own = n > 0 ? n : this._look === 'windows' ? 40 : 48;
    return this.fit > 0 ? Math.min(own, this.fit) : own;
  }
  get itemTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'item');
  }
  get startTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'start');
  }
  get endTemplate() {
    return ɵfindTemplate(this.templates?.toArray(), 'end');
  }
  get classes(): string[] {
    return ['wt-dock', 'p-dock', `wt-dock-${this._position}`, `p-dock-${this._position}`, `wt-dock-look-${this._look}`, this.styleClass || ''];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  hasRoute(item: WtMenuItem): boolean {
    return item.routerLink !== undefined && item.routerLink !== null && !item.disabled;
  }
  /** The index among the items that take focus (no separators). */
  tabIndexOf(i: number): number {
    return i === this.focusIndex ? 0 : -1;
  }

  // ---------- events ----------

  pick(item: WtMenuItem, index: number, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    if (!item.url && !this.hasRoute(item)) event.preventDefault();
    this.focusIndex = index;
    if (this._look === 'mac') this.bounce(index);
    item.command?.({ originalEvent: event, item, index });
    this.onItemClick.emit({ originalEvent: event, item });
  }

  focusIn(event: FocusEvent): void {
    const li = (event.target as HTMLElement | null)?.closest?.('[data-index]');
    if (li) this.focusIndex = Number(li.getAttribute('data-index'));
    this.onFocus.emit(event);
  }

  focusOut(event: FocusEvent): void {
    this.onBlur.emit(event);
  }

  /** Along the dock: arrows (either way), Home / End; Enter and Space follow the link as they do. */
  key(event: KeyboardEvent): void {
    const items = this.items;
    const usable = items.map((it, i) => (!it.separator && !it.disabled ? i : -1)).filter((i) => i >= 0);
    if (!usable.length) return;
    const at = usable.indexOf(this.focusIndex);
    const back = this.vertical ? 'ArrowUp' : 'ArrowLeft';
    const fwd = this.vertical ? 'ArrowDown' : 'ArrowRight';
    let next: number | null = null;
    if (event.key === fwd) next = usable[(at + 1) % usable.length];
    else if (event.key === back) next = usable[(at - 1 + usable.length) % usable.length];
    else if (event.key === 'Home') next = usable[0];
    else if (event.key === 'End') next = usable[usable.length - 1];
    else if (event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
      return;
    }
    if (next === null) return;
    event.preventDefault();
    this.focusIndex = next;
    this.cdr.markForCheck();
    this.host.querySelector<HTMLElement>(`.wt-dock-item[data-index="${next}"] .wt-dock-action`)?.focus();
  }

  // ---------- magnification ----------

  private get magnifies(): boolean {
    return this._look === 'mac' && this.magnify !== false && this.magnify !== 'false' && !matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  private icons(): HTMLElement[] {
    return Array.from(this.listRef?.nativeElement.querySelectorAll<HTMLElement>('.wt-dock-item') ?? []);
  }

  private measure(): void {
    if (!this.magnifies) return;
    this.centres = this.icons().map((el) => {
      const r = el.getBoundingClientRect();
      return this.vertical ? r.top + r.height / 2 : r.left + r.width / 2;
    });
  }

  private swell(e: PointerEvent): void {
    if (!this.magnifies || e.pointerType === 'touch') return;
    if (!this.centres.length) this.measure();
    const at = this.vertical ? e.clientY : e.clientX;
    const max = Number(this.magnification) > 1 ? Number(this.magnification) : 1.8;
    const reach = this.itemSize * 2.6;
    this.icons().forEach((el, i) => el.style.setProperty('--wt-dock-scale', dockScale(at - (this.centres[i] ?? at), reach, max).toFixed(3)));
  }

  private settle(): void {
    this.centres = [];
    for (const el of this.icons()) el.style.removeProperty('--wt-dock-scale');
  }

  private fitTo(root: HTMLElement): void {
    const length = this.vertical ? root.clientHeight : root.clientWidth;
    if (!length) return;
    const items = this.items;
    const icons = items.filter((i) => !i.separator).length;
    if (!icons) return;
    const separators = items.length - icons;
    // What the shelf and its gaps take (the windows look keeps room for its start and end slots).
    const room = this._look === 'windows' ? length - 220 : length - 48;
    const size = Math.floor((room - (items.length - 1) * 6 - separators * 10) / icons);
    const fit = Math.max(24, size);
    const own = Number(this.size) > 0 ? Number(this.size) : this._look === 'windows' ? 40 : 48;
    const next = fit < own ? fit : 0;
    if (next === this.fit) return;
    this.fit = next;
    this.zone.run(() => this.cdr.markForCheck());
  }

  private bounce(index: number): void {
    if (this.bounceTimer) clearTimeout(this.bounceTimer);
    this.bouncing = index;
    this.bounceTimer = setTimeout(() => {
      this.bouncing = -1;
      this.cdr.markForCheck();
    }, BOUNCE_MS);
  }
}
