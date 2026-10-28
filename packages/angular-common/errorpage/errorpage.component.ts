import { DOCUMENT, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { httpErrorActions, httpErrorCode, httpErrorKind, httpErrorTextKey, TH_LOCALE, WtErrorAction, WtErrorKind } from 'wiratheme/core';

export type { WtErrorAction, WtErrorKind };

/** `'formal'` (default): a clean, plain page. `'kawaii'`: a little character holding up the code, and friendlier words. */
export type WtErrorPageLook = 'formal' | 'kawaii';

/** `(action)`: a built-in button was pressed. `originalEvent.preventDefault()` stops its own step (to route instead). */
export interface WtErrorPageActionEvent {
  action: WtErrorAction;
  originalEvent: Event;
}

/** The formal look's picture per kind: a 24 × 24 stroked icon. */
const ICONS: Record<WtErrorKind, string> = {
  request: 'M7 3h7l5 5v13H7ZM14 3v5h5M10 13l4 4M14 13l-4 4',
  auth: 'M10 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM3 21v-1a6 6 0 0 1 9-5.2M16 15v-1.5a2 2 0 1 1 4 0V15M14.5 15h7v5.5h-7Z',
  forbidden: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6ZM9.5 12v-1.5a2.5 2.5 0 0 1 5 0V12M8.5 12h7v4.5h-7Z',
  missing: 'M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15ZM21 21l-5.2-5.2M8.5 8.5l4 4M12.5 8.5l-4 4',
  time: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM12 7v5l3.5 2',
  busy: 'M4 16a8 8 0 1 1 16 0M12 16l4.5-5M3 20h18',
  server: 'M4 4h16v6H4ZM4 14h9v6H4ZM8 7h.01M8 17h.01M18.5 13.5l3 6h-6ZM18.5 16v1.2',
  gateway: 'M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0ZM12 16v5M3 3l18 18',
  down: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z',
};

/**
 * A page for an error status, ready to use: `<wt-error-page code="404"></wt-error-page>` or `look="kawaii"`. Any 4xx /
 * 5xx code works: the common ones (400, 401, 403, 404, 405, 408, 409, 410, 413, 415, 422, 429, 500, 501, 502, 503, 504)
 * have their own words in Thai and English, the rest read as a client or server error. The buttons fit the code (sign
 * in for 401, try again for timeouts and 5xx, back and home otherwise); `[actions]` picks them, `(action)` hears them,
 * elements marked `wtErrorAction` join them, and anything else inside goes in a box under them. `reference` shows an
 * error id people can quote to support. `fullPage` fills the screen (a route's page).
 */
@Component({
  selector: 'wt-error-page, wt-errorPage',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here: keep it off the host so the page gets no browser tooltip.
  host: { class: 'wt-error-page-host', '[attr.title]': 'null' },
})
export class WtErrorPage implements OnDestroy {
  /** The HTTP status, 400–599 (`'404'` or `404`). Anything else shows 500. */
  @Input() set code(v: number | string | null | undefined) {
    this._code = httpErrorCode(v);
  }
  get code(): number {
    return this._code;
  }
  /** `'formal'` (default) or `'kawaii'`. */
  @Input() set look(v: WtErrorPageLook | string | null | undefined) {
    this._look = v === 'kawaii' ? 'kawaii' : 'formal';
  }
  get look(): WtErrorPageLook {
    return this._look;
  }
  /** Default: the locale's words for the code (kawaii: for its kind). */
  @Input() title?: string | null;
  @Input() description?: string | null;
  /** An error or request id to quote to support, shown small under the buttons. */
  @Input() reference?: string | null;
  /** Built-in buttons, the main one first: `['retry', 'home']`; `false` for none. Default: what fits the code. */
  @Input() actions?: WtErrorAction[] | boolean | string | null;
  /** Where the home button goes. Default `'/'`. */
  @Input() homeLink: string | null = '/';
  /** Where the sign-in button goes (401). Default `'/login'`. */
  @Input() signInLink: string | null = '/login';
  /** Fill the screen's height, centred (the page of a route). */
  @Input() set fullPage(v: boolean | string | null | undefined) {
    this._full = v === '' || v === true || v === 'true';
  }
  get fullPage(): boolean {
    return this._full;
  }
  /** The title's heading level. Default 1. */
  @Input() headingLevel: number | string = 1;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  /** A built-in button was pressed (before its own step; `originalEvent.preventDefault()` stops that). */
  @Output() action = new EventEmitter<WtErrorPageActionEvent>();

  private _code = 404;
  private _look: WtErrorPageLook = 'formal';
  private _full = false;
  private readonly config = inject(WtConfig);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get kawaii(): boolean {
    return this._look === 'kawaii';
  }
  get kind(): WtErrorKind {
    return httpErrorKind(this._code);
  }
  get icon(): string {
    return ICONS[this.kind];
  }
  /** The locale's words (an app's own translation without them falls back to Thai). */
  get words(): (typeof TH_LOCALE)['errorPage'] {
    return this.config.translation.errorPage ?? TH_LOCALE.errorPage;
  }
  private get text(): { title: string; description: string } {
    const w = this.words;
    return this.kawaii ? w.kawaii[this.kind] : w.codes[httpErrorTextKey(this._code, w.codes)];
  }
  get titleText(): string {
    return this.title ?? this.text?.title ?? '';
  }
  get descriptionText(): string {
    return this.description ?? this.text?.description ?? '';
  }
  get buttons(): { action: WtErrorAction; label: string; href: string | null }[] {
    const own = this.actions;
    if (own === false || own === 'false') return [];
    const list = Array.isArray(own) ? own : httpErrorActions(this._code);
    const w = this.words;
    return list
      .filter((a) => (a === 'home' ? this.homeLink !== null : a === 'signIn' ? this.signInLink !== null : true))
      .map((a) => ({
        action: a,
        label: a === 'home' ? w.home : a === 'back' ? w.back : a === 'retry' ? w.retry : w.signIn,
        href: a === 'home' ? this.homeLink : a === 'signIn' ? this.signInLink : null,
      }));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }

  /** A button: tell the app, then (unless it said no) follow the link, go back or reload. */
  run(action: WtErrorAction, event: Event): void {
    this.action.emit({ action, originalEvent: event });
    if (event.defaultPrevented) return;
    const win = this.doc.defaultView;
    if (!win) return;
    if (action === 'back') {
      event.preventDefault();
      if (win.history.length > 1) win.history.back();
      else win.location.assign(this.homeLink || '/');
    } else if (action === 'retry') {
      event.preventDefault();
      win.location.reload();
    }
  }
}
