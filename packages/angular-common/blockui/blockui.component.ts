import { DOCUMENT, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵlockScroll, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/** The element a `target` stands for: an element, an ElementRef, or a component that has one. */
function targetElement(target: unknown): HTMLElement | null {
  if (!target) return null;
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) return target;
  const t = target as {
    nativeElement?: unknown;
    getBlockableElement?: () => unknown;
    el?: unknown;
    host?: unknown;
    elementRef?: unknown;
  };
  if (typeof t.getBlockableElement === 'function') return targetElement(t.getBlockableElement());
  if (t.nativeElement) return targetElement(t.nativeElement);
  return targetElement(t.el) || targetElement(t.elementRef) || targetElement(t.host);
}

/**
 * Covers the page, or one element (`[target]="panel"`), while something runs: `<wt-blockUI [blocked]="isApiSaving">`
 * with what to show in the middle (a spinner, a message) as its content. The page is inert under the cover: no
 * clicks, no Tab into it; covering the whole page also stops it scrolling.
 */
@Component({
  selector: 'wt-blockui, wt-blockUI, wt-block-ui',
  standalone: true,
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './blockui.component.html',
  styleUrls: ['./blockui.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtBlockUI implements AfterViewChecked, OnDestroy {
  @Input() set blocked(v: unknown) {
    const on = ɵtoBool(v);
    if (on === this._blocked) return;
    this._blocked = on;
    if (!on) this.release();
    this.pending = on;
    this.cdr.markForCheck();
  }
  get blocked(): boolean {
    return this._blocked;
  }
  /** Cover only this element (an element, an ElementRef or a component). Default: the whole page. */
  @Input() target: unknown;
  @Input() styleClass?: string | null;
  /** Read out while blocked. */
  @Input() ariaLabel?: string;
  /** Accepted for templates moving over: the page cover is in the top layer. */
  @Input() autoZIndex: unknown;
  @Input() baseZIndex: unknown;

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ViewChild('mask') protected maskRef?: ElementRef<HTMLElement>;

  private _blocked = false;
  private pending = false;
  private host: HTMLElement | null = null;
  private inerted: HTMLElement[] = [];
  private unlockScroll: (() => void) | null = null;
  private returnFocus: HTMLElement | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly doc = inject(DOCUMENT);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get onElement(): boolean {
    return !!targetElement(this.target);
  }

  ngAfterViewChecked(): void {
    if (!this.pending) return;
    const mask = this.maskRef?.nativeElement;
    if (!mask) return;
    this.pending = false;
    const active = this.doc.activeElement as HTMLElement | null;
    const el = targetElement(this.target);
    if (el) {
      this.host = el;
      if (this.doc.defaultView?.getComputedStyle(el).position === 'static') el.classList.add('wt-blockui-container');
      el.setAttribute('aria-busy', 'true');
      // What was there goes inert; the cover itself stays live.
      for (const child of Array.from(el.children) as HTMLElement[]) {
        if (child === mask || child.hasAttribute('inert')) continue;
        child.setAttribute('inert', '');
        this.inerted.push(child);
      }
      el.appendChild(mask);
      if (active && el.contains(active)) {
        this.returnFocus = active;
        mask.focus({ preventScroll: true });
      }
    } else {
      const dialog = mask as HTMLDialogElement;
      if (typeof dialog.showModal === 'function' && !dialog.open) {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute('open', '');
        }
      }
      this.unlockScroll = ɵlockScroll(this.doc);
      this.returnFocus = active && active !== this.doc.body ? active : null;
    }
  }

  ngOnDestroy(): void {
    this.release();
    // The cover was moved into the target; take it out with us.
    this.maskRef?.nativeElement.remove();
  }

  /** The browser's own close request (Escape): the cover stays until `blocked` is false. */
  cancel(event: Event): void {
    event.preventDefault();
  }

  private release(): void {
    this.pending = false;
    for (const el of this.inerted.splice(0)) el.removeAttribute('inert');
    if (this.host) {
      this.host.classList.remove('wt-blockui-container');
      this.host.removeAttribute('aria-busy');
      this.host = null;
    }
    const mask = this.maskRef?.nativeElement as HTMLDialogElement | undefined;
    if (mask && typeof mask.close === 'function' && mask.open) mask.close();
    this.unlockScroll?.();
    this.unlockScroll = null;
    const back = this.returnFocus;
    this.returnFocus = null;
    if (back?.isConnected) back.focus({ preventScroll: true });
  }
}
