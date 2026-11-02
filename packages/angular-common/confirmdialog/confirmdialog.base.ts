import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from 'wiraui/button';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate, ɵWuStyleLoader } from 'wiraui/config';
import { WuLocale } from 'wiraui/core';
import { WuConfirmationService } from './confirmation.service';
import { WuConfirmation, WuConfirmEventType } from './confirmdialog.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
/** Icon classes the built-in icons stand in for, so a page without an icon font still shows them. */
const BUILT_IN: [RegExp, string][] = [
  [/^(warning|warn)$|exclamation/, 'warning'],
  [/^(question|help)$|question/, 'question'],
  [/^info$|info-circle|pi-info/, 'info'],
  [/^success$|check-circle/, 'success'],
  [/^(error|danger)$|times-circle|ban/, 'error'],
];

/** Shared logic of wu-confirmdialog (v1 and v2/v3 templates). It draws a wu-dialog around the question. */
@Directive()
export abstract class ɵWuConfirmDialogBase implements OnInit, OnDestroy {
  /** Matches `confirm({ key })`, for pages with more than one. */
  /** Accepted for templates moving over: the dialog is always modal. */
  @Input() modal: unknown;
  @Input() key?: string;
  @Input() header?: string;
  @Input() message?: string;
  @Input() icon?: string;
  @Input() acceptLabel?: string;
  @Input() rejectLabel?: string;
  @Input() acceptIcon?: string;
  @Input() rejectIcon?: string;
  @Input() set acceptVisible(v: unknown) { this._acceptVisible = v === undefined || ɵtoBool(v); }
  @Input() set rejectVisible(v: unknown) { this._rejectVisible = v === undefined || ɵtoBool(v); }
  @Input() acceptButtonStyleClass?: string;
  @Input() rejectButtonStyleClass?: string;
  @Input() acceptAriaLabel?: string;
  @Input() rejectAriaLabel?: string;
  @Input() closeAriaLabel?: string;
  @Input() set closable(v: unknown) { this._closable = v === undefined || ɵtoBool(v); }
  @Input() set closeOnEscape(v: unknown) { this._closeOnEscape = v === undefined || ɵtoBool(v); }
  @Input() set dismissableMask(v: unknown) { this._dismissableMask = ɵtoBool(v); }
  @Input() set blockScroll(v: unknown) { this._blockScroll = v === undefined || ɵtoBool(v); }
  @Input() defaultFocus: 'accept' | 'reject' | 'close' | 'none' = 'accept';
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() maskStyleClass?: string;
  @Input() breakpoints?: Record<string, string> | null;
  @Input() position = 'center';
  /** Accepted for templates moving over; the dialog opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() baseZIndex: unknown;
  @Input() autoZIndex: unknown;
  @Input() draggable: unknown;
  @Input() rtl: unknown;
  @Input() transitionOptions: unknown;
  @Input() focusTrap: unknown;

  @Output() readonly onHide = new EventEmitter<WuConfirmEventType>();

  @ContentChildren(WuTemplate) templates?: QueryList<WuTemplate>;
  @ContentChild('header', { descendants: false }) headerRef?: unknown;
  @ContentChild('footer', { descendants: false }) footerRef?: unknown;
  @ContentChild('message', { descendants: false }) messageRef?: unknown;
  @ContentChild('headless', { descendants: false }) headlessRef?: unknown;

  visible = false;
  /** The confirmation on screen. */
  confirmation: WuConfirmation | null = null;

  private _acceptVisible = true;
  private _rejectVisible = true;
  private _closable = true;
  private _closeOnEscape = true;
  private _dismissableMask = false;
  private _blockScroll = true;
  private lastResult: WuConfirmEventType = WuConfirmEventType.CANCEL;
  private sub: Subscription | null = null;
  private stopListening: (() => void) | null = null;
  protected readonly cdr = inject(ChangeDetectorRef);
  private readonly service = inject(WuConfirmationService);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', ɵWU_BUTTON_CSS);
  }

  ngOnInit(): void {
    this.stopListening = this.service.ɵlisten(this.key);
    this.sub = this.service.requireConfirmation$.subscribe((c) => {
      if (!c) {
        if (this.visible) this.hide(WuConfirmEventType.CANCEL);
        return;
      }
      if ((c.key ?? undefined) !== (this.key ?? undefined)) return;
      this.confirmation = c;
      this.lastResult = WuConfirmEventType.CANCEL;
      this.visible = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.stopListening?.();
    this.i18n.unsubscribe();
  }

  // ---------- what the template shows (the confirmation wins over the inputs) ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get c(): WuConfirmation {
    return this.confirmation || {};
  }
  get headerText(): string | undefined {
    return this.c.header ?? this.header;
  }
  get messageText(): string | undefined {
    return this.c.message ?? this.message;
  }
  get iconClass(): string | undefined {
    return this.c.icon ?? this.icon;
  }
  /** A built-in icon name for a known icon class, else null (the class is drawn as given). */
  get builtInIcon(): string | null {
    const icon = this.iconClass;
    if (!icon) return null;
    return BUILT_IN.find(([re]) => re.test(icon))?.[1] ?? null;
  }
  get acceptText(): string {
    return this.c.acceptLabel ?? this.acceptLabel ?? this.t.accept;
  }
  get rejectText(): string {
    return this.c.rejectLabel ?? this.rejectLabel ?? this.t.reject;
  }
  get acceptIconClass(): string | undefined {
    return this.c.acceptIcon ?? this.acceptIcon;
  }
  get rejectIconClass(): string | undefined {
    return this.c.rejectIcon ?? this.rejectIcon;
  }
  get showAccept(): boolean {
    return this.c.acceptVisible ?? this._acceptVisible;
  }
  get showReject(): boolean {
    return this.c.rejectVisible ?? this._rejectVisible;
  }
  get isClosable(): boolean {
    return this.c.closable ?? this._closable;
  }
  get escapeCloses(): boolean {
    return this.c.closeOnEscape ?? this._closeOnEscape;
  }
  get maskCloses(): boolean {
    return this.c.dismissableMask ?? this._dismissableMask;
  }
  get scrollBlocked(): boolean {
    return this.c.blockScroll ?? this._blockScroll;
  }
  get focus(): string {
    return this.c.defaultFocus ?? this.defaultFocus;
  }
  get dialogStyle(): Record<string, string | number> | null {
    return this.c.style ?? this.style ?? null;
  }
  get dialogPosition(): string {
    return this.c.position ?? this.position;
  }
  /** Reject is a quiet button by default: text in the classic look, secondary outlined in the styled one. */
  protected abstract readonly rejectFallback: string;
  get acceptClasses(): string {
    return ɵbuttonClass(this.c.acceptButtonStyleClass ?? this.acceptButtonStyleClass) + ' wu-confirmdialog-accept p-confirm-dialog-accept p-confirmdialog-accept-button';
  }
  get rejectClasses(): string {
    return ɵbuttonClass(this.c.rejectButtonStyleClass ?? this.rejectButtonStyleClass, this.rejectFallback) + ' wu-confirmdialog-reject p-confirm-dialog-reject p-confirmdialog-reject-button';
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get footerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.footerRef) || ɵfindTemplate(this.templates, 'footer');
  }
  get messageTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.messageRef) || ɵfindTemplate(this.templates, 'message');
  }
  get headlessTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headlessRef) || ɵfindTemplate(this.templates, 'headless');
  }

  // ---------- actions (also called from custom footers: `cd.accept()`, `cd.reject()`) ----------

  /** The same as `accept()` (the name custom footers call). */
  onAccept(): void {
    this.accept();
  }
  /** The same as `reject()`. */
  onReject(): void {
    this.reject();
  }

  accept(): void {
    const c = this.confirmation;
    c?.accept?.();
    this.service.onAccept();
    this.hide(WuConfirmEventType.ACCEPT);
  }

  reject(type: WuConfirmEventType = WuConfirmEventType.REJECT): void {
    this.confirmation?.reject?.(type);
    this.hide(type);
  }

  close(): void {
    this.reject(WuConfirmEventType.CANCEL);
  }

  /** The dialog closed itself (×, Escape, the mask). */
  dialogVisible(v: boolean): void {
    if (!v && this.visible) this.reject(WuConfirmEventType.CANCEL);
  }

  dialogHidden(): void {
    this.onHide.emit(this.lastResult);
  }

  private hide(result: WuConfirmEventType): void {
    if (!this.visible) return;
    this.lastResult = result;
    this.visible = false;
    this.cdr.markForCheck();
  }
}
