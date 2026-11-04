import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
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
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { datePattern, formatDate, toDateValue, WuChatMessages } from '@wirabyte/ui/core';
import { WuChatAttachment, WuChatAttachmentClickEvent, WuChatMessage, WuChatSendEvent, ɵWuChatRow } from './chat.types';

const IMAGE = /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i;
const NEAR_BOTTOM = 80;
/** Thai vowels written before their consonant: an initial is the consonant, not these. */
const LEADING_VOWEL = /[\u0E40-\u0E44]/;
const TYPING_EVERY = 2000;
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

/** A file waiting in the composer, with a preview URL when it is a picture. */
interface Pending {
  file: File;
  preview: string | null;
}

/**
 * A conversation: `<wu-chat [messages]="messages" [currentUserId]="me.id" (onSend)="send($event)">`. Bubbles on the
 * left for others and on the right for you, grouped by sender and time, day separators (วันนี้, เมื่อวาน, then the date
 * in the app's calendar), pictures and file cards, read marks, who is typing, and a message box that grows with the
 * text: Enter sends, Shift+Enter starts a new line, pasted pictures are attached. New messages scroll into view unless
 * the reader has scrolled up to read older ones. The component only shows and emits; sending is the app's job.
 */
@Component({
  selector: 'wu-chat',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-chat-host' },
})
export class WuChat implements AfterViewChecked, OnDestroy {
  @Input() set messages(v: WuChatMessage[] | null | undefined) {
    const list = Array.isArray(v) ? v : [];
    const grew = list.length > this._messages.length;
    const last = list[list.length - 1];
    // Follow new messages while the reader is at the bottom, and always after sending one yourself.
    if (grew && (this.atBottom || (last && this.isMine(last)))) this.scrollPending = true;
    this._messages = list;
    this.rows = null;
  }
  get messages(): WuChatMessage[] {
    return this._messages;
  }
  /** Your user id: messages whose `sender.id` matches are drawn on the right. `mine` on a message wins. */
  @Input() currentUserId?: string | number | null;
  /** Names of the people typing right now. */
  @Input() typing?: string[] | string | null;
  /** No message box: a closed conversation. `readonlyMessage` replaces the default line. */
  @Input() set readonly(v: unknown) { this._readonly = ɵtoBool(v); }
  get readonly(): boolean { return this._readonly; }
  @Input() readonlyMessage?: string | null;
  @Input() placeholder?: string | null;
  /** A spinner instead of the messages while they load. */
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  /** The send button shows a spinner and the box waits. */
  @Input() set sending(v: unknown) { this._sending = ɵtoBool(v); }
  get sending(): boolean { return this._sending; }
  /** `false` hides the attach button (pasting files then does nothing either). */
  @Input() set attach(v: unknown) { this._attach = v === undefined ? true : ɵtoBool(v); }
  get attach(): boolean { return this._attach; }
  /** File types the attach button offers: `'image/*,.pdf'`. */
  @Input() accept?: string | null;
  /** Largest file in bytes; bigger ones are left out and emitted in `(onFileRejected)`. */
  @Input() maxFileSize?: number | null;
  /** Messages from the same sender within this many minutes join one group (one name, one avatar). Default 5. */
  @Input() groupMinutes = 5;
  /** A button above the oldest message that emits `(onLoadMore)`. */
  @Input() set hasMore(v: unknown) { this._hasMore = ɵtoBool(v); }
  get hasMore(): boolean { return this._hasMore; }
  /** `false` leaves out the avatars beside other people's messages. */
  @Input() set showAvatars(v: unknown) { this._avatars = v === undefined ? true : ɵtoBool(v); }
  get showAvatars(): boolean { return this._avatars; }
  /** Height of the whole chat. Default: the theme's (`--wu-chat-height`). `'100%'` fills a sized parent. */
  @Input() height?: string | number | null;
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onSend = new EventEmitter<WuChatSendEvent>();
  /** While the reader types, at most every 2 seconds: send "is typing" to the others. */
  @Output() readonly onTyping = new EventEmitter<void>();
  @Output() readonly onAttachmentClick = new EventEmitter<WuChatAttachmentClickEvent>();
  @Output() readonly onRetry = new EventEmitter<WuChatMessage>();
  @Output() readonly onLoadMore = new EventEmitter<void>();
  @Output() readonly onFileRejected = new EventEmitter<File>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('message', { descendants: false }) protected messageRef?: unknown;
  @ViewChild('scroller') private scroller?: ElementRef<HTMLElement>;
  @ViewChild('box') private box?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  draft = '';
  pending: Pending[] = [];
  private _messages: WuChatMessage[] = [];
  private rows: ɵWuChatRow[] | null = null;
  private _readonly = false;
  private _loading = false;
  private _sending = false;
  private _attach = true;
  private _hasMore = false;
  private _avatars = true;
  private atBottom = true;
  private scrollPending = true;
  private lastTyping = 0;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly translated = this.config.translationChange.subscribe(() => (this.rows = null));

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngAfterViewChecked(): void {
    if (!this.scrollPending || !this.scroller) return;
    this.scrollPending = false;
    const el = this.scroller.nativeElement;
    el.scrollTop = el.scrollHeight;
    this.atBottom = true;
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.translated.unsubscribe();
    for (const p of this.pending) if (p.preview) URL.revokeObjectURL(p.preview);
  }

  // ---------- what the template reads ----------

  get t(): WuChatMessages | undefined {
    return this.config.translation.chat;
  }
  /** `<ng-template #message let-message>`: the inside of a bubble. */
  get messageTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.messageRef) || ɵfindTemplate(this.templates, 'message');
  }
  get rootClass(): string {
    return ['wu-chat', this.styleClass || ''].filter(Boolean).join(' ');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> {
    const own = this.style && typeof this.style === 'object' ? this.style : {};
    const h = this.height;
    const height = h === null || h === undefined || h === '' ? undefined : typeof h === 'number' || /^\d+(\.\d+)?$/.test(String(h)) ? `${h}px` : String(h);
    return height ? { ...own, '--wu-chat-height': height } : own;
  }
  get view(): ɵWuChatRow[] {
    if (!this.rows) this.rows = this.build();
    return this.rows;
  }
  get typingText(): string {
    const names = (Array.isArray(this.typing) ? this.typing : this.typing ? [this.typing] : []).filter(Boolean);
    if (!names.length) return '';
    const t = this.t;
    if (names.length === 1) return (t?.typing ?? '{name} is typing').replace('{name}', names[0]);
    return (t?.typingMany ?? '{count} people are typing').replace('{count}', String(names.length));
  }
  get canSend(): boolean {
    return !this._sending && (!!this.draft.trim() || this.pending.length > 0);
  }
  trackRow(_: number, row: ɵWuChatRow): string {
    return row.key;
  }
  initials(name: string | undefined): string {
    const words = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    const first = (word: string) => Array.from(word).find((ch) => !LEADING_VOWEL.test(ch)) || word[0];
    return first(words[0]) + (words.length > 1 ? first(words[words.length - 1]) : '');
  }
  isImage(a: WuChatAttachment): boolean {
    return a.type ? a.type === 'image' : IMAGE.test(a.name) || IMAGE.test(a.url || '');
  }
  sizeText(bytes: number | undefined): string {
    if (bytes === undefined || bytes === null || !Number.isFinite(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} kB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  readText(m: WuChatMessage): string {
    if (!m.read) return '';
    if (typeof m.read === 'number' && m.read > 1) return (this.t?.readBy ?? 'Read by {count}').replace('{count}', String(m.read));
    return this.t?.read ?? 'Read';
  }

  // ---------- events ----------

  onScroll(): void {
    const el = this.scroller?.nativeElement;
    if (el) this.atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
  }
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.send();
  }
  onInput(): void {
    this.grow();
    const now = Date.now();
    if (this.draft && now - this.lastTyping > TYPING_EVERY) {
      this.lastTyping = now;
      this.onTyping.emit();
    }
  }
  onPaste(event: ClipboardEvent): void {
    if (!this._attach) return;
    const files = Array.from(event.clipboardData?.files || []);
    if (!files.length) return;
    event.preventDefault();
    this.add(files);
  }
  openFiles(): void {
    this.fileInput?.nativeElement.click();
  }
  onFilesChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.add(Array.from(input.files || []));
    input.value = '';
  }
  removePending(index: number): void {
    const [p] = this.pending.splice(index, 1);
    if (p?.preview) URL.revokeObjectURL(p.preview);
    this.pending = [...this.pending];
  }
  send(): void {
    if (!this.canSend || this._readonly) return;
    const files = this.pending.map((p) => p.file);
    for (const p of this.pending) if (p.preview) URL.revokeObjectURL(p.preview);
    this.onSend.emit({ text: this.draft.trim(), files });
    this.draft = '';
    this.pending = [];
    this.scrollPending = true;
    setTimeout(() => this.grow());
    this.cdr.markForCheck();
  }
  attachmentClick(event: Event, attachment: WuChatAttachment, message: WuChatMessage): void {
    this.onAttachmentClick.emit({ originalEvent: event, attachment, message });
  }

  // ---------- internals ----------

  private isMine(m: WuChatMessage): boolean {
    if (m.mine !== undefined) return m.mine;
    return this.currentUserId !== null && this.currentUserId !== undefined && m.sender?.id === this.currentUserId;
  }

  private add(files: File[]): void {
    const max = this.maxFileSize;
    const kept: Pending[] = [];
    for (const file of files) {
      if (max && file.size > max) {
        this.onFileRejected.emit(file);
        continue;
      }
      kept.push({ file, preview: file.type.startsWith('image/') && typeof URL !== 'undefined' ? URL.createObjectURL(file) : null });
    }
    this.pending = [...this.pending, ...kept];
    this.cdr.markForCheck();
  }

  /** The box grows with its text up to a few lines, then scrolls. */
  private grow(): void {
    const t = this.box?.nativeElement;
    if (!t || !t.getClientRects().length) return;
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight, 160) + 'px';
  }

  private build(): ɵWuChatRow[] {
    const rows: ɵWuChatRow[] = [];
    const lang = this.config.translation.code || 'th';
    const calendar = this.config.calendarFor(lang);
    const locale = this.config.translation;
    const timeOf = (d: Date) => formatDate(d, datePattern('time', lang, calendar), { locale, calendar });
    const today = startOfDay(this.config.now());
    let day = '';
    let prev: { mine: boolean; sender: unknown; at: number } | null = null;
    this._messages.forEach((m, i) => {
      const at = toDateValue(m.time) || new Date(NaN);
      const dayKey = Number.isNaN(at.getTime()) ? '' : `${at.getFullYear()}-${at.getMonth()}-${at.getDate()}`;
      if (dayKey && dayKey !== day) {
        day = dayKey;
        const diff = Math.round((today - startOfDay(at)) / 86400000);
        const label =
          diff === 0
            ? this.t?.today ?? 'Today'
            : diff === 1
              ? this.t?.yesterday ?? 'Yesterday'
              : formatDate(at, datePattern('long', lang, calendar), { locale, calendar });
        rows.push({ kind: 'day', key: 'd' + dayKey, label });
        prev = null;
      }
      const key = 'm' + (m.id ?? i);
      const time = Number.isNaN(at.getTime()) ? '' : timeOf(at);
      if (m.system) {
        rows.push({ kind: 'system', key, message: m, time });
        prev = null;
        return;
      }
      const mine = this.isMine(m);
      const sender = m.sender?.id ?? m.sender?.name ?? null;
      const first =
        !prev || prev.mine !== mine || prev.sender !== sender || at.getTime() - prev.at > Math.max(0, this.groupMinutes) * 60000;
      if (first && rows.length) {
        const before = rows[rows.length - 1];
        if (before.kind === 'message') before.last = true;
      }
      rows.push({ kind: 'message', key, message: m, mine, first, last: false, time });
      prev = { mine, sender, at: at.getTime() };
    });
    const tail = rows[rows.length - 1];
    if (tail && tail.kind === 'message') tail.last = true;
    for (let i = 0; i < rows.length - 1; i++) {
      const r = rows[i];
      if (r.kind === 'message' && rows[i + 1].kind !== 'message') r.last = true;
    }
    return rows;
  }
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
