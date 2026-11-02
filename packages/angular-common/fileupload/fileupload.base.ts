import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WU_VERSION_INFO,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from 'wiraui/button';
import { checkFile, formatFileSize, isImageFile, sameFile, WuLocale } from 'wiraui/core';
import {
  WuFileBeforeUploadEvent,
  WuFileProgressEvent,
  WuFileRemoveEvent,
  WuFileSelectEvent,
  WuFileSendEvent,
  WuFileUploadContentContext,
  WuFileUploadErrorEvent,
  WuFileUploadEvent,
  WuFileUploadHandlerEvent,
  WuFileUploadMode,
  WuFileValidationFailEvent,
} from './fileupload.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
type WithUrl = File & { objectURL?: string };

/** Header names and values from Angular's HttpHeaders or a plain object. */
function headerEntries(headers: unknown): Array<[string, string]> {
  if (!headers) return [];
  const h = headers as { keys?: () => string[]; getAll?: (k: string) => string[] | null; get?: (k: string) => string | null };
  if (typeof h.keys === 'function' && (typeof h.getAll === 'function' || typeof h.get === 'function')) {
    const out: Array<[string, string]> = [];
    for (const k of h.keys()) {
      const values = h.getAll ? h.getAll(k) || [] : [h.get!(k) || ''];
      for (const v of values) out.push([k, v]);
    }
    return out;
  }
  return Object.entries(headers as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
}

/**
 * What wu-fileupload does, shared by the v1 and v2/v3 templates. Files come from the Choose button or are dropped on
 * the content area; each is checked against `accept`, `maxFileSize` and `fileLimit` (turned-away files get a message
 * and `(onValidationFail)`). Upload posts them to `url` as `FormData` under `name`, or with `[customUpload]="true"`
 * hands them to `(uploadHandler)`; `[auto]="true"` uploads as soon as they are chosen. `mode="basic"` is a single
 * button.
 */
@Directive()
export abstract class ɵWuFileUploadBase implements OnDestroy {
  /** Form field name of each file in the request. */
  @Input() name?: string;
  @Input() url?: string;
  @Input() method: 'post' | 'put' = 'post';
  @Input() set multiple(v: unknown) { this._multiple = ɵtoBool(v); }
  get multiple(): boolean { return this._multiple; }
  /** File types the chooser offers and the check allows: `.xlsx,.xls`, `image/*,application/pdf`. */
  @Input() accept?: string;
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Upload right after choosing; the upload and cancel buttons step aside. */
  @Input() set auto(v: unknown) { this._auto = ɵtoBool(v); }
  get auto(): boolean { return this._auto; }
  @Input() set withCredentials(v: unknown) { this._credentials = ɵtoBool(v); }
  /** Largest file in bytes (`10485760` = 10 MB). */
  @Input() set maxFileSize(v: unknown) {
    const n = Number(v);
    this._maxFileSize = v === null || v === undefined || v === '' || !Number.isFinite(n) ? null : n;
  }
  get maxFileSize(): number | null { return this._maxFileSize; }
  /** Most files, counting the ones already uploaded. */
  @Input() set fileLimit(v: unknown) {
    const n = Number(v);
    this._fileLimit = v === null || v === undefined || v === '' || !Number.isFinite(n) || n <= 0 ? null : Math.floor(n);
  }
  get fileLimit(): number | null { return this._fileLimit; }
  @Input() invalidFileSizeMessageSummary?: string;
  @Input() invalidFileSizeMessageDetail?: string;
  @Input() invalidFileTypeMessageSummary?: string;
  @Input() invalidFileTypeMessageDetail?: string;
  @Input() invalidFileLimitMessageSummary?: string;
  @Input() invalidFileLimitMessageDetail?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  /** Width of image thumbnails, in px. */
  @Input() previewWidth: number | string = 50;
  @Input() chooseLabel?: string;
  @Input() uploadLabel?: string;
  @Input() cancelLabel?: string;
  /** Icon classes instead of the built-in icons, e.g. `pi pi-file-excel`. */
  @Input() chooseIcon?: string;
  @Input() uploadIcon?: string;
  @Input() cancelIcon?: string;
  @Input() set showUploadButton(v: unknown) { this._showUpload = v === undefined || ɵtoBool(v); }
  get showUploadButton(): boolean { return this._showUpload; }
  @Input() set showCancelButton(v: unknown) { this._showCancel = v === undefined || ɵtoBool(v); }
  get showCancelButton(): boolean { return this._showCancel; }
  @Input() mode: WuFileUploadMode = 'advanced';
  /** Request headers: Angular `HttpHeaders` or a plain object. */
  @Input() headers: unknown;
  /** The app uploads: Upload (or `auto`) emits `(uploadHandler)` with the files instead of posting to `url`. */
  @Input() set customUpload(v: unknown) { this._custom = ɵtoBool(v); }
  get customUpload(): boolean { return this._custom; }
  /** Classic button classes for each button: `p-button-sm p-button-secondary` … */
  @Input() chooseStyleClass?: string;
  @Input() uploadStyleClass?: string;
  @Input() cancelStyleClass?: string;
  @Input() removeStyleClass?: string;
  @Input() tabindex?: number | string;
  /** The files chosen so far. Settable, as some apps filter it from code. */
  @Input() set files(v: File[] | null | undefined) {
    this._files = Array.isArray(v) ? v : [];
    this.cdr.markForCheck();
  }
  get files(): File[] {
    return this._files;
  }
  /** Accepted for templates moving over. */
  @Input() chooseButtonProps: unknown;
  @Input() uploadButtonProps: unknown;
  @Input() cancelButtonProps: unknown;

  @Output() readonly onBeforeUpload = new EventEmitter<WuFileBeforeUploadEvent>();
  @Output() readonly onSend = new EventEmitter<WuFileSendEvent>();
  @Output() readonly onUpload = new EventEmitter<WuFileUploadEvent>();
  @Output() readonly onError = new EventEmitter<WuFileUploadErrorEvent>();
  @Output() readonly onClear = new EventEmitter<void>();
  @Output() readonly onRemove = new EventEmitter<WuFileRemoveEvent>();
  @Output() readonly onSelect = new EventEmitter<WuFileSelectEvent>();
  @Output() readonly onProgress = new EventEmitter<WuFileProgressEvent>();
  @Output() readonly uploadHandler = new EventEmitter<WuFileUploadHandlerEvent>();
  @Output() readonly onImageError = new EventEmitter<Event>();
  @Output() readonly onRemoveUploadedFile = new EventEmitter<{ file: File; index: number }>();
  @Output() readonly onValidationFail = new EventEmitter<WuFileValidationFailEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('file', { descendants: false }) protected fileRef?: unknown;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ContentChild('toolbar', { descendants: false }) protected toolbarRef?: unknown;
  @ContentChild('empty', { descendants: false }) protected emptyRef?: unknown;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;

  readonly major: number = WU_VERSION_INFO.major;
  /** Files uploaded by this component (to `url`), shown as completed. */
  uploadedFiles: File[] = [];
  uploadedFileCount = 0;
  /** Upload progress, 0–100. */
  progress = 0;
  uploading = false;
  /** Messages about files that were turned away. */
  msgs: string[] = [];
  dragHighlight = false;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly i18n = ɵrefreshOnTranslation();
  private _files: File[] = [];
  private _multiple = false;
  private _disabled = false;
  private _auto = false;
  private _credentials = false;
  private _maxFileSize: number | null = null;
  private _fileLimit: number | null = null;
  private _showUpload = true;
  private _showCancel = true;
  private _custom = false;
  private dragDepth = 0;
  private xhr: XMLHttpRequest | null = null;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', ɵWU_BUTTON_CSS);
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.xhr?.abort();
    for (const f of [...this._files, ...this.uploadedFiles]) this.revoke(f);
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get basic(): boolean {
    return this.mode === 'basic';
  }
  get fileTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.fileRef) || ɵfindTemplate(this.templates, 'file');
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get toolbarTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.toolbarRef) || ɵfindTemplate(this.templates, 'toolbar');
  }
  get emptyTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.emptyRef) || ɵfindTemplate(this.templates, 'empty');
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  /** v1 lists the chosen files and then the `content` template (the classic order); v2 / v3 let `content` replace the list. */
  get showFileList(): boolean {
    return this.hasFiles() && (!this.contentTemplate || this.major === 1);
  }
  get showUploaded(): boolean {
    return this.uploadedFiles.length > 0 && (!this.contentTemplate || this.major === 1);
  }
  get showEmpty(): boolean {
    return !this.hasFiles() && !this.showUploaded && (!!this.emptyTemplate || !this.contentTemplate);
  }
  get chooseText(): string {
    return this.chooseLabel ?? this.t.choose;
  }
  get uploadText(): string {
    return this.uploadLabel ?? this.t.upload;
  }
  get cancelText(): string {
    return this.cancelLabel ?? this.t.cancel;
  }
  /** Basic mode: the chosen files' names next to the button (until they upload). */
  get chosenText(): string {
    return this._files.map((f) => f.name).join(', ');
  }
  get canChoose(): boolean {
    return !this._disabled && !this.uploading && !this.isFileLimitExceeded();
  }
  get canUpload(): boolean {
    return !this._disabled && !this.uploading && this.hasFiles() && !this.isFileLimitExceeded();
  }
  get canCancel(): boolean {
    return !this._disabled && !this.uploading && this.hasFiles();
  }
  get context(): WuFileUploadContentContext {
    return {
      $implicit: this._files,
      files: this._files,
      uploadedFiles: this.uploadedFiles,
      chooseCallback: () => this.choose(),
      clearCallback: () => this.clear(),
      uploadCallback: () => this.upload(),
      removeFileCallback: (event, index) => this.remove(event, index),
      removeUploadedFileCallback: (index) => this.removeUploadedFile(index),
      progress: this.progress,
      messages: this.msgs,
    };
  }
  buttonClass(styleClass: string | undefined, extra: string): string {
    return ɵbuttonClass(styleClass) + ' ' + extra;
  }
  removeClass(): string {
    return ɵbuttonClass(this.removeStyleClass, 'p-button-danger p-button-text p-button-rounded') + ' wu-btn-icon-only wu-fileupload-remove';
  }
  hasFiles(): boolean {
    return this._files.length > 0;
  }
  isImage(file: File): boolean {
    return isImageFile(file) && !!(file as WithUrl).objectURL;
  }
  urlOf(file: File): string | null {
    return (file as WithUrl).objectURL || null;
  }
  formatSize(bytes: number): string {
    return formatFileSize(bytes, this.t.fileSizeTypes);
  }
  isFileLimitExceeded(): boolean {
    return this._fileLimit !== null && this._fileLimit <= this._files.length + this.uploadedFileCount;
  }

  // ---------- actions ----------

  /** Opens the file chooser. */
  choose(): void {
    if (!this.canChoose) return;
    const input = this.host.querySelector('input.wu-fileupload-input') as HTMLInputElement | null;
    input?.click();
  }

  /** The chooser's change event, or a drop on the content area. */
  onFileSelect(event: Event): void {
    if (this._disabled || this.uploading) return;
    const dt = (event as DragEvent).dataTransfer;
    const list = dt ? dt.files : (event.target as HTMLInputElement | null)?.files;
    const picked = Array.from(list || []);
    this.msgs = [];
    if (!this._multiple) {
      for (const f of this._files) this.revoke(f);
      this._files = [];
    }
    const added: File[] = [];
    for (const file of picked) {
      if (!this._multiple && added.length) break;
      if (this._files.some((f) => sameFile(f, file)) || added.some((f) => sameFile(f, file))) continue;
      const problem = checkFile(file, { accept: this.accept, maxFileSize: this._maxFileSize });
      if (problem) {
        this.fail(file, problem);
        continue;
      }
      if (this._fileLimit !== null && this._files.length + added.length + this.uploadedFileCount >= this._fileLimit) {
        this.fail(null, 'limit');
        break;
      }
      if (isImageFile(file)) {
        const win = this.doc.defaultView as (Window & typeof globalThis) | null;
        const url = win?.URL?.createObjectURL ? win.URL.createObjectURL(file) : '';
        if (url) (file as WithUrl).objectURL = url;
      }
      added.push(file);
    }
    this._files.push(...added);
    this.clearInput();
    if (added.length) this.onSelect.emit({ originalEvent: event, files: added, currentFiles: this._files });
    if (added.length && this._auto) this.upload();
    this.cdr.markForCheck();
  }

  /** Uploads the chosen files: to `url`, or through `(uploadHandler)` with `customUpload`. */
  upload(): void {
    if (!this.hasFiles() || this.uploading) return;
    if (this._custom) {
      if (this._fileLimit !== null) this.uploadedFileCount += this._files.length;
      this.uploadHandler.emit({ files: this._files });
      this.cdr.markForCheck();
      return;
    }
    if (!this.url) return;
    const files = this._files;
    const formData = new FormData();
    this.msgs = [];
    this.onBeforeUpload.emit({ formData });
    for (const f of files) formData.append(this.name || 'file', f, f.name);
    const xhr = new XMLHttpRequest();
    this.xhr = xhr;
    this.uploading = true;
    this.progress = 0;
    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) this.progress = Math.round((e.loaded * 100) / e.total);
      this.onProgress.emit({ originalEvent: e, progress: this.progress });
      this.cdr.markForCheck();
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      this.xhr = null;
      this.uploading = false;
      this.progress = 0;
      if (xhr.status >= 200 && xhr.status < 300) {
        if (this._fileLimit !== null) this.uploadedFileCount += files.length;
        this.uploadedFiles.push(...files);
        this.onUpload.emit({ originalEvent: xhr, files });
        this._files = [];
      } else {
        this.onError.emit({ xhr, files });
      }
      this.clearInput();
      this.cdr.markForCheck();
    };
    xhr.open(this.method.toUpperCase(), this.url, true);
    for (const [k, v] of headerEntries(this.headers)) xhr.setRequestHeader(k, v);
    xhr.withCredentials = this._credentials;
    this.onSend.emit({ xhr, formData });
    xhr.send(formData);
    this.cdr.markForCheck();
  }

  /** Removes every chosen file (and any message). */
  clear(): void {
    for (const f of this._files) this.revoke(f);
    this._files = [];
    this.msgs = [];
    this.clearInput();
    this.onClear.emit();
    this.cdr.markForCheck();
  }

  /** Removes one chosen file. */
  remove(event: Event, index: number): void {
    const file = this._files[index];
    if (!file || this.uploading) return;
    this._files.splice(index, 1);
    this.revoke(file);
    this.clearInput();
    if (!this.isFileLimitExceeded()) {
      const limit = this.messageFor(null, 'limit');
      this.msgs = this.msgs.filter((m) => m !== limit);
    }
    this.onRemove.emit({ originalEvent: event, file });
    this.cdr.markForCheck();
  }

  removeUploadedFile(index: number): void {
    const file = this.uploadedFiles[index];
    if (!file) return;
    this.uploadedFiles.splice(index, 1);
    this.revoke(file);
    if (this.uploadedFileCount > 0) this.uploadedFileCount--;
    this.onRemoveUploadedFile.emit({ file, index });
    this.cdr.markForCheck();
  }

  dismissMessage(index: number): void {
    this.msgs = this.msgs.filter((_, i) => i !== index);
    this.cdr.markForCheck();
  }

  imageError(event: Event): void {
    this.onImageError.emit(event);
  }

  // ---------- dropping files on the content area ----------

  dragEnter(event: DragEvent): void {
    if (!this.acceptsDrag(event)) return;
    event.preventDefault();
    this.dragDepth++;
    this.dragHighlight = true;
  }
  dragOver(event: DragEvent): void {
    if (!this.acceptsDrag(event)) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    this.dragHighlight = true;
  }
  dragLeave(): void {
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (!this.dragDepth) this.dragHighlight = false;
  }
  drop(event: DragEvent): void {
    this.dragDepth = 0;
    this.dragHighlight = false;
    if (!this.acceptsDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    // Without `multiple` only the first file that passes the checks is taken, as the chooser would.
    this.onFileSelect(event);
  }

  // ---------- internals ----------

  private acceptsDrag(event: DragEvent): boolean {
    if (this._disabled || this.uploading || this.basic) return false;
    const types = event.dataTransfer?.types;
    return !!types && Array.from(types).includes('Files');
  }

  private fail(file: File | null, reason: 'type' | 'size' | 'limit'): void {
    const message = this.messageFor(file, reason);
    if (!this.msgs.includes(message)) this.msgs = [...this.msgs, message];
    this.onValidationFail.emit({ file, reason, message });
  }

  private messageFor(file: File | null, reason: 'type' | 'size' | 'limit'): string {
    const name = file?.name ?? '';
    const t = this.t;
    if (reason === 'size') {
      const size = this.formatSize(this._maxFileSize || 0);
      const s = this.invalidFileSizeMessageSummary;
      const d = this.invalidFileSizeMessageDetail;
      return s || d ? (s || '').replace('{0}', name) + (d || '').replace('{0}', size) : t.invalidFileSize.replace('{0}', name).replace('{1}', size);
    }
    if (reason === 'type') {
      const types = (this.accept || '').split(',').map((x) => x.trim()).filter(Boolean).join(', ');
      const s = this.invalidFileTypeMessageSummary;
      const d = this.invalidFileTypeMessageDetail;
      return s || d ? (s || '').replace('{0}', name) + (d || '').replace('{0}', types) : t.invalidFileType.replace('{0}', name).replace('{1}', types);
    }
    const limit = String(this._fileLimit ?? '');
    const s = this.invalidFileLimitMessageSummary;
    const d = this.invalidFileLimitMessageDetail;
    return s || d ? (s || '').replace('{0}', limit) + (d || '').replace('{0}', limit) : t.invalidFileLimit.replace('{0}', limit);
  }

  private clearInput(): void {
    const input = this.host.querySelector('input.wu-fileupload-input') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  private revoke(file: File): void {
    const url = (file as WithUrl).objectURL;
    if (!url) return;
    const win = this.doc.defaultView as (Window & typeof globalThis) | null;
    win?.URL?.revokeObjectURL?.(url);
    delete (file as WithUrl).objectURL;
  }
}
