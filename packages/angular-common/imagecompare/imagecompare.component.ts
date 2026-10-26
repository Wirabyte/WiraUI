import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵWT_SKIP_VERSION_CHECK,
  WtConfig,
  WtTemplate,
} from 'wiratheme/config';
import { imageCompareAt, imageCompareClamp, imageCompareKey, WtLocale } from 'wiratheme/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/**
 * Two pictures in one box with a divider to drag between them (before / after):
 * `<wt-imageCompare><ng-template wtTemplate="left"><img src="before.jpg" /></ng-template>
 * <ng-template wtTemplate="right"><img src="after.jpg" /></ng-template></wt-imageCompare>`.
 * As before, the `left` picture fills the box and the `right` one shows from the start edge up to the divider. Drag
 * anywhere on it (a sideways swipe on phones; up and down still scrolls the page), or focus the round handle and use
 * the arrows, Page Up / Page Down, Home / End. `[(value)]` reads or sets where the divider is (0–100, default 50).
 */
@Component({
  selector: 'wt-imageCompare, wt-imagecompare, wt-image-compare',
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet],
  templateUrl: './imagecompare.component.html',
  styleUrls: ['./imagecompare.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A tabindex written on the tag goes to the handle only, so the page gets one tab stop.
  host: { class: 'wt-imagecompare-host', '[attr.tabindex]': 'null' },
})
export class WtImageCompare implements OnInit, OnDestroy {
  /** Tab order of the handle. Default 0. */
  @Input() set tabindex(v: unknown) {
    const n = Number(v);
    this._tabindex = v === null || v === undefined || v === '' || !Number.isFinite(n) ? 0 : n;
  }
  get tabindex(): number { return this._tabindex; }
  @Input() ariaLabel?: string | null;
  @Input() ariaLabelledby?: string | null;
  /** The same as `ariaLabelledby`, in the spelling other components use. */
  @Input() set ariaLabelledBy(v: string | null | undefined) { this.ariaLabelledby = v; }
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Where the divider is, in % from the start edge (0–100). Two-way: `[(value)]`. Default 50. */
  @Input() set value(v: unknown) { this._value = imageCompareClamp(v); }
  get value(): number { return this._value; }
  /** How far an arrow key moves the divider, in %. Default 1. */
  @Input() set step(v: unknown) {
    const n = Number(v);
    this._step = Number.isFinite(n) && n > 0 ? n : 1;
  }
  get step(): number { return this._step; }

  @Output() readonly valueChange = new EventEmitter<number>();

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('left', { descendants: false }) protected leftRef?: unknown;
  @ContentChild('right', { descendants: false }) protected rightRef?: unknown;

  dragging = false;
  rtl = false;
  private _value = 50;
  private _step = 1;
  private _tabindex = 0;
  /** A touch waits for a sideways move (or a tap) before it moves the divider, so a scroll does not. */
  private press: { id: number; touch: boolean; moved: boolean } | null = null;
  private dirObserver: MutationObserver | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly config = inject(WtConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnInit(): void {
    this.rtl = this.readRtl();
    // Follow a page that switches direction (the dir attribute on <html>), as before.
    const doc = this.host.ownerDocument;
    if (doc?.documentElement && typeof MutationObserver !== 'undefined') {
      this.dirObserver = new MutationObserver(() => {
        const rtl = this.readRtl();
        if (rtl !== this.rtl) {
          this.rtl = rtl;
          this.cdr.markForCheck();
        }
      });
      this.dirObserver.observe(doc.documentElement, { attributes: true, attributeFilter: ['dir'] });
    }
  }

  ngOnDestroy(): void {
    this.dirObserver?.disconnect();
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get t(): WtLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get leftTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.leftRef) || ɵfindTemplate(this.templates, 'left');
  }
  get rightTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.rightRef) || ɵfindTemplate(this.templates, 'right');
  }
  /** The divider's distance from the left edge, in %. */
  get edge(): number {
    return this.rtl ? 100 - this._value : this._value;
  }
  /** The `right` picture shows from the start edge to the divider. */
  get clip(): string {
    const rest = 100 - this._value;
    return this.rtl ? `inset(0 0 0 ${rest}%)` : `inset(0 ${rest}% 0 0)`;
  }
  get valueText(): string {
    return `${Math.round(this._value)}%`;
  }
  get label(): string | null {
    return this.ariaLabelledby ? null : this.ariaLabel || this.t.imageCompare;
  }

  // ---------- pointer ----------

  pointerdown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.rtl = this.readRtl();
    const touch = event.pointerType === 'touch';
    this.press = { id: event.pointerId, touch, moved: false };
    const root = event.currentTarget as HTMLElement;
    (root.querySelector('.wt-imagecompare-handle') as HTMLElement | null)?.focus({ preventScroll: true });
    if (touch) return;
    event.preventDefault();
    try {
      root.setPointerCapture(event.pointerId);
    } catch {
      // Older engines: the drag then ends at the box's edge.
    }
    this.dragging = true;
    this.moveTo(event);
  }

  pointermove(event: PointerEvent): void {
    const p = this.press;
    if (!p || p.id !== event.pointerId) return;
    p.moved = true;
    this.dragging = true;
    this.moveTo(event);
  }

  pointerup(event: PointerEvent): void {
    const p = this.press;
    if (!p || p.id !== event.pointerId) return;
    this.press = null;
    // A tap moves the divider to where it landed.
    if (event.type === 'pointerup' && p.touch && !p.moved) this.moveTo(event);
    if (this.dragging) {
      this.dragging = false;
      this.cdr.markForCheck();
    }
  }

  // ---------- keyboard ----------

  keydown(event: KeyboardEvent): void {
    this.rtl = this.readRtl();
    const next = imageCompareKey(event.key, this._value, this._step, this.rtl);
    if (next === null) return;
    event.preventDefault();
    this.setValue(next);
  }

  // ---------- internals ----------

  private moveTo(event: PointerEvent): void {
    const root = this.host.querySelector('.wt-imagecompare') as HTMLElement | null;
    if (!root) return;
    const r = root.getBoundingClientRect();
    this.setValue(imageCompareAt(event.clientX, r.left, r.width, this.rtl));
  }

  private setValue(v: number): void {
    if (v === this._value) return;
    this._value = v;
    this.valueChange.emit(v);
    this.cdr.markForCheck();
  }

  private readRtl(): boolean {
    return this.host.closest('[dir]')?.getAttribute('dir') === 'rtl';
  }
}
