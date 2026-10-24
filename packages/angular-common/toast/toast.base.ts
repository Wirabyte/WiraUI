import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵtoBool, ɵWT_SKIP_VERSION_CHECK, WtConfig, WtTemplate } from 'wiratheme/config';
import { WtLocale } from 'wiratheme/core';
import { WtMessageService } from './message.service';
import { WtToastCloseEvent, WtToastMessage, WtToastPosition } from './toast.types';

export interface ɵWtToastItem {
  uid: number;
  message: WtToastMessage;
  /** success, info, warn, error, secondary or contrast. */
  severity: string;
  leaving: boolean;
  /** For a headless template: closes this toast. */
  closeFn: () => void;
  /** Time on screen in ms (the message's own `life`, else the toast's). */
  life: number;
  /** When the running timer ends (ms since epoch), and what was left when the pointer paused it. */
  deadline?: number;
  remaining?: number;
}

type PopoverElement = HTMLElement & { showPopover(): void; hidePopover(): void };
const SEVERITY: Record<string, string> = { warning: 'warn', danger: 'error' };
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
let uid = 0;

/**
 * Shared logic of wt-toast (v1 and v2/v3 templates). The stack sits in the top layer (popover), so toasts show above
 * dialogs; on phones it spans the screen width.
 */
@Directive()
export abstract class ɵWtToastBase implements OnInit, AfterViewChecked, OnDestroy {
  /** Shows only messages with this key. */
  @Input() key?: string;
  @Input() position: WtToastPosition = 'top-right';
  /** Default time on screen in milliseconds. */
  @Input() set life(v: unknown) { this._life = Number(v) > 0 ? Number(v) : 3000; }
  get life(): number { return this._life; }
  /** A line along the bottom that runs down with the time left. Default true; sticky toasts never show it. */
  @Input() set showTimer(v: unknown) { this._showTimer = v === undefined || ɵtoBool(v); }
  get showTimer(): boolean { return this._showTimer; }
  /** Skip a message equal (summary, detail, severity) to any shown before. */
  @Input() set preventDuplicates(v: unknown) { this._preventDuplicates = ɵtoBool(v); }
  /** Skip a message equal to one still on screen. */
  @Input() set preventOpenDuplicates(v: unknown) { this._preventOpenDuplicates = ɵtoBool(v); }
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  /** Accepted for templates moving over; the toasts sit in the top layer. */
  @Input() baseZIndex: unknown;
  @Input() autoZIndex: unknown;
  @Input() breakpoints: unknown;
  @Input() showTransformOptions: unknown;
  @Input() hideTransformOptions: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly onClose = new EventEmitter<WtToastCloseEvent>();

  @ContentChildren(WtTemplate) templates?: QueryList<WtTemplate>;
  @ContentChild('message', { descendants: false }) messageRef?: unknown;
  @ContentChild('headless', { descendants: false }) headlessRef?: unknown;
  @ViewChild('container') containerRef?: ElementRef<HTMLElement>;

  items: ɵWtToastItem[] = [];
  readonly trackItem = (_: number, item: ɵWtToastItem) => item.uid;

  private _life = 3000;
  private _showTimer = true;
  private _preventDuplicates = false;
  private _preventOpenDuplicates = false;
  private readonly shown: WtToastMessage[] = [];
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private subs: Subscription[] = [];
  private raise = false;
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(WtMessageService);
  private readonly config = inject(WtConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get t(): WtLocale {
    return this.config.translation;
  }
  get messageTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.messageRef) || ɵfindTemplate(this.templates, 'message');
  }
  get headlessTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headlessRef) || ɵfindTemplate(this.templates, 'headless');
  }

  ngOnInit(): void {
    // A modal opened after the toasts would cover them: show the stack again so it is on top.
    const raise = () => {
      if (!this.items.length) return;
      this.raise = true;
      this.ngAfterViewChecked();
    };
    this.doc.addEventListener('wt-modal-open', raise);
    this.subs.push(new Subscription(() => this.doc.removeEventListener('wt-modal-open', raise)));
    this.subs.push(
      this.service.messageObserver.subscribe((m) => this.add(Array.isArray(m) ? m : [m])),
      this.service.clearObserver.subscribe((key) => {
        if (key === null || key === this.key) for (const item of this.items) this.close(item, false);
      }),
    );
  }

  ngAfterViewChecked(): void {
    const el = this.containerRef?.nativeElement as unknown as PopoverElement | undefined;
    if (!el || typeof el.showPopover !== 'function') return;
    const open = el.matches(':popover-open');
    try {
      if (this.items.length && (!open || this.raise)) {
        // Shown again so it sits above a modal dialog opened after it.
        if (open) el.hidePopover();
        el.showPopover();
      } else if (!this.items.length && open) {
        el.hidePopover();
      }
    } catch {
      // Not connected yet.
    }
    this.raise = false;
  }

  ngOnDestroy(): void {
    for (const s of this.subs) s.unsubscribe();
    for (const t of this.timers.values()) clearTimeout(t);
    this.i18n.unsubscribe();
  }

  close(item: ɵWtToastItem, byUser = true): void {
    if (item.leaving) return;
    item.leaving = true;
    this.stopTimer(item);
    this.cdr.markForCheck();
    const win = this.doc.defaultView;
    const reduce = !!win?.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      this.items = this.items.filter((i) => i !== item);
      this.cdr.markForCheck();
      this.onClose.emit({ message: item.message });
    }, reduce ? 0 : 200);
    if (byUser) this.cdr.markForCheck();
  }

  /** Hovering holds a toast (and its countdown line); leaving runs the time that was left. */
  pause(item: ɵWtToastItem): void {
    this.stopTimer(item);
    if (item.deadline) item.remaining = Math.max(0, item.deadline - Date.now());
  }
  resume(item: ɵWtToastItem): void {
    if (!item.leaving) this.startTimer(item);
  }

  private add(messages: WtToastMessage[]): void {
    let added = false;
    for (const m of messages) {
      if (!m || (m.key ?? undefined) !== (this.key ?? undefined)) continue;
      if (this._preventOpenDuplicates && this.items.some((i) => !i.leaving && same(i.message, m))) continue;
      if (this._preventDuplicates && this.shown.some((s) => same(s, m))) continue;
      this.shown.push(m);
      const severity = String(m.severity || 'info');
      const item: ɵWtToastItem = {
        uid: ++uid,
        message: m,
        severity: SEVERITY[severity] || severity,
        leaving: false,
        closeFn: () => this.close(item),
        life: Number(m.life) > 0 ? Number(m.life) : this._life,
      };
      this.items = [...this.items, item];
      this.startTimer(item);
      added = true;
    }
    if (!added) return;
    this.raise = modalOpen(this.doc);
    this.cdr.markForCheck();
  }

  private startTimer(item: ɵWtToastItem): void {
    if (item.message.sticky) return;
    this.stopTimer(item);
    const ms = item.remaining ?? item.life;
    item.deadline = Date.now() + ms;
    this.timers.set(item.uid, setTimeout(() => this.close(item, false), ms));
  }

  private stopTimer(item: ɵWtToastItem): void {
    const t = this.timers.get(item.uid);
    if (t) clearTimeout(t);
    this.timers.delete(item.uid);
  }
}

function modalOpen(doc: Document): boolean {
  try {
    return !!doc.querySelector('dialog:modal');
  } catch {
    return !!doc.querySelector('dialog[open]');
  }
}

function same(a: WtToastMessage, b: WtToastMessage): boolean {
  return a.summary === b.summary && a.detail === b.detail && a.severity === b.severity;
}
