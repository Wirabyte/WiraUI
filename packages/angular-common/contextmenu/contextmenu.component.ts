import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtMenuItem } from 'wiratheme/config';
import { WtTieredMenu } from 'wiratheme/tieredmenu';

/** The element a `target` stands for: an element, an ElementRef, an element id, or a component that has one. */
function targetElement(target: unknown, doc: Document): HTMLElement | null {
  if (!target) return null;
  if (typeof target === 'string') return doc.getElementById(target);
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) return target;
  const t = target as { nativeElement?: unknown; el?: unknown };
  return targetElement(t.nativeElement, doc) || targetElement(t.el, doc);
}

/**
 * A menu at the pointer on right-click: `<wt-contextMenu [model]="items" [target]="box">`, or for the whole page
 * `[global]="true"`, or opened from code with `menu.show($event)`. Items may have submenus (as in wt-tieredMenu).
 * The keyboard's context-menu key (or Shift + F10) opens it at the focused element.
 */
@Component({
  selector: 'wt-contextmenu, wt-contextMenu, wt-context-menu',
  standalone: true,
  exportAs: 'wtContextMenu',
  imports: [WtTieredMenu],
  template: `
    <span #anchor class="wt-contextmenu-anchor" aria-hidden="true"></span>
    <wt-tieredMenu
      #menu
      [model]="model"
      [popup]="true"
      [styleClass]="'wt-contextmenu p-contextmenu ' + (styleClass || '')"
      [style]="style || null"
      [ariaLabel]="ariaLabel"
      (onShow)="onShow.emit()"
      (onHide)="onHide.emit()"
    ></wt-tieredMenu>
  `,
  styles: [
    `
      :is(wt-contextmenu, wt-context-menu) {
        display: contents;
      }
      .wt-contextmenu-anchor {
        position: fixed;
        width: 0;
        height: 0;
        pointer-events: none;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtContextMenu implements AfterViewInit, OnDestroy {
  @Input() model: WtMenuItem[] | null | undefined;
  /** Right-clicks on this element open the menu (an element, an ElementRef, an id or a component). */
  @Input() set target(v: unknown) { this._target = v; this.listen(); }
  /** Right-clicks anywhere on the page open it. */
  @Input() set global(v: unknown) { this._global = ɵtoBool(v); this.listen(); }
  /** The event that opens it on the target. Default `'contextmenu'`. */
  @Input() set triggerEvent(v: string | null | undefined) { this._trigger = v || 'contextmenu'; this.listen(); }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | null;
  @Input() ariaLabel?: string;
  /** Accepted for templates moving over: the menu opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();

  @ViewChild('menu') protected menu?: WtTieredMenu;
  @ViewChild('anchor') protected anchorRef?: ElementRef<HTMLElement>;

  private _target: unknown;
  private _global = false;
  private _trigger = 'contextmenu';
  private ready = false;
  private stop: (() => void) | null = null;
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.listen();
  }

  ngOnDestroy(): void {
    this.stop?.();
  }

  get visible(): boolean {
    return !!this.menu?.visible;
  }

  /** Opens the menu at the pointer of a mouse event (at the event's element for the keyboard). */
  show(event?: Event): void {
    const anchor = this.anchorRef?.nativeElement;
    if (!anchor || !this.menu) return;
    event?.preventDefault();
    event?.stopPropagation?.();
    let x = 0;
    let y = 0;
    const m = event as MouseEvent | undefined;
    if (m && typeof m.clientX === 'number' && (m.clientX || m.clientY)) {
      x = m.clientX;
      y = m.clientY;
    } else {
      const el = (event?.target as HTMLElement | null) || (this.doc.activeElement as HTMLElement | null);
      const r = el?.getBoundingClientRect();
      x = r ? r.left + Math.min(16, r.width / 2) : 0;
      y = r ? r.top + Math.min(16, r.height / 2) : 0;
    }
    anchor.style.left = `${x}px`;
    anchor.style.top = `${y}px`;
    if (this.menu.visible) this.menu.hide();
    this.menu.show({ currentTarget: anchor } as unknown as Event);
  }

  hide(): void {
    this.menu?.hide();
  }

  toggle(event?: Event): void {
    if (this.visible) this.hide();
    else this.show(event);
  }

  private listen(): void {
    if (!this.ready) return;
    this.stop?.();
    this.stop = null;
    const el = this._global ? this.doc : targetElement(this._target, this.doc);
    if (!el) return;
    const open = (e: Event) => this.zone.run(() => this.show(e));
    this.zone.runOutsideAngular(() => el.addEventListener(this._trigger, open));
    const trigger = this._trigger;
    this.stop = () => el.removeEventListener(trigger, open);
  }
}
