import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuPopup,
  ɵWuStyleLoader,
  WU_VERSION_INFO,
  WuConfig,
  WuTemplate,
} from '@wirabyte/ui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from '@wirabyte/ui/button';
import { ɵWU_INPUTTEXT_CSS } from '@wirabyte/ui/inputtext';
import {
  acceptsFile,
  EditorHistory,
  editorCounts,
  editorHtmlToText,
  EditorOption,
  EditorTool,
  EditorToolbar,
  editorToolbarGroups,
  editorToolOptions,
  EditorToolOptions,
  EDITOR_FONT_SIZES,
  formatFileSize,
  isEmptyEditorHtml,
  safeEditorImage,
  safeEditorUrl,
  TH_LOCALE,
  WuEditorMessages,
  WuLocale,
} from '@wirabyte/ui/core';
import {
  adjacentCell,
  blockOf,
  blocksIn,
  caretIn,
  cellRect,
  cellsInRect,
  cleanEditorHtml,
  closestIn,
  createTable,
  deleteColumn,
  deleteRow,
  ensureTableCols,
  insertColumn,
  insertRow,
  mergeCells,
  mergeRect,
  percent,
  prefixedClass,
  rangeIn,
  restoreSelection,
  saveSelection,
  selectRange,
  setPrefixedClass,
  splitCell,
  tableGrid,
  toggleHeaderRow,
} from './editor.dom';
import {
  WuEditorApi,
  WuEditorImageUpload,
  WuEditorImageUploadErrorEvent,
  WuEditorInitEvent,
  WuEditorPanel,
  WuEditorSelectionChangeEvent,
  WuEditorTextChangeEvent,
  WU_EDITOR_OPTIONS,
} from './editor.types';
import { ɵquillTool, ɵWU_EDITOR_ICONS } from './editor.icons';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const QUILL_SIZES: Record<string, string> = { '0.75em': 'small', '1.5em': 'large', '2.5em': 'huge' };
const ACCEPT_IMAGES = 'image/png,image/jpeg,image/gif,image/webp';
const MAX_INDENT = 8;

/** Header names and values from Angular's HttpHeaders or a plain object. */
function headerEntries(headers: unknown): Array<[string, string]> {
  if (!headers) return [];
  const h = headers as { keys?: () => string[]; get?: (k: string) => string | null };
  if (typeof h.keys === 'function' && typeof h.get === 'function') return h.keys().map((k) => [k, h.get!(k) || '']);
  return Object.entries(headers as Record<string, unknown>).map(([k, v]) => [k, String(v)]);
}

function pathValue(obj: unknown, path: string): unknown {
  let v: unknown = obj;
  for (const k of path.split('.')) {
    if (v === null || v === undefined || typeof v !== 'object') return undefined;
    v = (v as Record<string, unknown>)[k];
  }
  return v;
}

/** State of the toolbar at the caret. */
export interface ɵWuEditorState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  subscript: boolean;
  superscript: boolean;
  code: boolean;
  bulletList: boolean;
  orderedList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  link: boolean;
  table: boolean;
  /** 0 = paragraph, 1–6 = heading. */
  heading: number;
  align: 'left' | 'center' | 'right' | 'justify';
  fontSize: string;
  fontFamily: string;
}

const EMPTY_STATE: ɵWuEditorState = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  subscript: false,
  superscript: false,
  code: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
  link: false,
  table: false,
  heading: 0,
  align: 'left',
  fontSize: '',
  fontFamily: '',
};

/**
 * What wu-editor does, shared by the v1 and v2/v3 templates: a rich-text editor written for WiraUI (no third-party
 * editor inside). The value is HTML through `[(ngModel)]` / forms (null when empty, as before), with the class names
 * values saved earlier use (`ql-align-center`, `ql-indent-1`, `ql-size-large`) so stored content keeps its look.
 *
 * Toolbar: a preset (`toolbar="basic" | "standard" | "full"`), a list of tools, or the app's own `header` template with
 * the familiar `ql-bold` / `ql-header` markup; `[toolOptions]` sets heading levels, sizes, colours, table grid and more.
 * Tables (insert, rows, columns, merge, header row), links, pictures (uploaded to a URL or embedded as base64, resized,
 * aligned), undo / redo, paste clean-up, source view, full screen and a word count.
 */
@Directive()
export abstract class ɵWuEditorBase implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /** Tools to show: a preset, a list with `'|'` between groups, or a list of groups. Default `'standard'`. */
  @Input() set toolbar(v: EditorToolbar | null | undefined) {
    this._toolbar = v ?? null;
    this.groups = editorToolbarGroups(this._toolbar ?? this.defaults.toolbar, 'standard');
  }
  /** Fine settings of the tools: heading levels, font sizes and families, colours, alignments, table grid, links. */
  @Input() set toolOptions(v: EditorToolOptions | null | undefined) {
    this._toolOptions = v ?? null;
    this.opts = editorToolOptions({ ...(this.defaults.toolOptions || {}), ...(v || {}) });
  }
  /** Pictures: `{ mode: 'base64' }`, or `{ url: '/api/upload', responseUrl: 'data.url' }`, or `{ upload: file => … }`. */
  @Input() imageUpload?: WuEditorImageUpload | null;
  @Input() placeholder?: string;
  @Input() set readonly(v: unknown) {
    this._readonly = ɵtoBool(v);
    this.syncEditable();
  }
  get readonly(): boolean {
    return this._readonly;
  }
  /** Style of the content area (e.g. `{ height: '320px' }`), as before. */
  @Input() style?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  /** Show the word and character count under the content. */
  @Input() set showCount(v: unknown) {
    this._showCount = ɵtoBool(v);
  }
  get showCount(): boolean {
    return this._showCount;
  }
  /** Keep the toolbar in view while a tall editor scrolls the page. Default true. */
  @Input() set stickyToolbar(v: unknown) {
    this._sticky = v === undefined || ɵtoBool(v);
  }
  get stickyToolbar(): boolean {
    return this._sticky;
  }
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() id?: string;
  /** Accepted for templates moving over: the formats follow the toolbar here. */
  @Input() formats: unknown;
  @Input() modules: unknown;
  @Input() bounds: unknown;
  @Input() scrollingContainer: unknown;
  @Input() debug: unknown;

  @Output() readonly onTextChange = new EventEmitter<WuEditorTextChangeEvent>();
  @Output() readonly onSelectionChange = new EventEmitter<WuEditorSelectionChangeEvent>();
  @Output() readonly onInit = new EventEmitter<WuEditorInitEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onImageUpload = new EventEmitter<{ file: File; url: string }>();
  @Output() readonly onImageUploadError = new EventEmitter<WuEditorImageUploadErrorEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('header', { descendants: false }) protected headerRef?: unknown;
  @ViewChild('area') protected areaRef?: ElementRef<HTMLElement>;
  @ViewChild('toolbarEl') protected toolbarRef?: ElementRef<HTMLElement>;
  @ViewChild('panelEl') protected panelRef?: ElementRef<HTMLElement>;
  @ViewChild('imageInput') protected imageInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('frameEl') protected frameRef?: ElementRef<HTMLElement>;

  readonly major: number = WU_VERSION_INFO.major;
  readonly icons = ɵWU_EDITOR_ICONS;
  readonly baseId = ɵuniqueId('wu-editor');
  groups: EditorTool[][] = editorToolbarGroups(null);
  opts = editorToolOptions(null);
  state: ɵWuEditorState = { ...EMPTY_STATE };
  focused = false;
  empty = true;
  disabled = false;
  sourceMode = false;
  sourceText = '';
  fullscreen = false;
  counts = { characters: 0, words: 0 };
  canUndo = false;
  canRedo = false;
  /** The open panel and what it is about. */
  panel: WuEditorPanel | null = null;
  panelAnchor: HTMLElement | null = null;
  /** Table grid picker: rows × cols under the pointer. */
  gridHover = { rows: 0, cols: 0 };
  /** The insert panel's own size fields. */
  tableForm = { rows: 3, cols: 3, header: true };
  /** Cells picked by dragging across them (or Shift + click), for merging. */
  cellPick: { table: HTMLTableElement; from: HTMLTableCellElement; to: HTMLTableCellElement } | null = null;
  /** Link form fields. */
  linkForm = { url: '', text: '', newTab: true, showText: false, error: '' };
  /** Image form. */
  imageForm = { tab: 'upload' as 'upload' | 'url', url: '', alt: '', error: '' };
  /** Picture selected in the content (shows the frame and the picture menu). */
  selectedImage: HTMLImageElement | null = null;
  frame = { top: 0, left: 0, width: 0, height: 0 };
  /** Messages shown under the content (upload failures …), cleared after a while. */
  notices: string[] = [];
  readonly api: WuEditorApi;
  readonly imageAligns: Array<'inline' | 'left' | 'center' | 'right'> = ['inline', 'left', 'center', 'right'];
  readonly imageWidths = [25, 50, 75, 100];
  readonly tableInserts: Array<'rowAbove' | 'rowBelow' | 'colLeft' | 'colRight'> = ['rowAbove', 'rowBelow', 'colLeft', 'colRight'];

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly zone = inject(NgZone);
  protected readonly config = inject(WuConfig);
  protected readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly defaults = inject(WU_EDITOR_OPTIONS, { optional: true }) || {};
  private readonly i18n = ɵrefreshOnTranslation();
  private readonly history = new EditorHistory();
  private _toolbar: EditorToolbar | null = null;
  private _toolOptions: EditorToolOptions | null = null;
  private _readonly = false;
  private _showCount = false;
  private _sticky = true;
  private value: string | null = null;
  private lastEmitted: string | null = null;
  private savedRange: Range | null = null;
  private lastSelection: { index: number; length: number } | null = null;
  private popup: ɵWuPopup | null = null;
  private unlockScroll: (() => void) | null = null;
  private cleanups: Array<() => void> = [];
  private stateFrame = 0;
  private quillObserver: MutationObserver | null = null;
  private onChange: (v: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private viewReady = false;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const styles = inject(ɵWuStyleLoader);
    styles.load('button', ɵWU_BUTTON_CSS);
    styles.load('inputtext', ɵWU_INPUTTEXT_CSS);
    this.groups = editorToolbarGroups(this.defaults.toolbar ?? null, 'standard');
    this.opts = editorToolOptions(this.defaults.toolOptions);
    const self = this;
    this.api = {
      get root() {
        return self.area;
      },
      getHTML: () => this.html(),
      getSemanticHTML: () => this.html(),
      getText: () => editorHtmlToText(this.html()),
      getLength: () => editorHtmlToText(this.html()).length + 1,
      setHTML: (html) => this.setContent(html, true),
      insertHTML: (html) => this.insertHtml(cleanEditorHtml(html, this.doc, this.cleanOpts)),
      insertText: (text) => this.exec(() => this.doc.execCommand('insertText', false, text)),
      focus: () => this.focus(),
      blur: () => this.area.blur(),
      hasFocus: () => this.doc.activeElement === this.area,
      enable: (on = true) => this.setDisabledState(!on),
      disable: () => this.setDisabledState(true),
      undo: () => this.undo(),
      redo: () => this.redo(),
      clipboard: {
        dangerouslyPasteHTML: (a: number | string, b?: string) => this.setContent(typeof a === 'string' ? a : b || '', true),
      },
    };
  }

  // ---------- lifecycle ----------

  ngAfterViewInit(): void {
    this.viewReady = true;
    const area = this.area;
    area.innerHTML = this.toEditable(this.value);
    this.history.reset({ html: area.innerHTML, selection: null });
    this.syncEditable();
    this.refreshMeta();
    this.zone.runOutsideAngular(() => {
      const onSel = () => this.selectionChanged();
      this.doc.addEventListener('selectionchange', onSel);
      this.cleanups.push(() => this.doc.removeEventListener('selectionchange', onSel));
      const onBeforeInput = (e: Event) => this.beforeInput(e as InputEvent);
      area.addEventListener('beforeinput', onBeforeInput);
      this.cleanups.push(() => area.removeEventListener('beforeinput', onBeforeInput));
      const onScroll = () => this.placeFrame();
      area.addEventListener('scroll', onScroll, { passive: true });
      this.cleanups.push(() => area.removeEventListener('scroll', onScroll));
      // Tables: drag across cells to pick them, drag a column's edge to resize it.
      const onMove = (e: PointerEvent) => this.tablePointerMove(e);
      const onDown = (e: PointerEvent) => this.tablePointerDown(e);
      area.addEventListener('pointermove', onMove);
      area.addEventListener('pointerdown', onDown);
      this.cleanups.push(() => area.removeEventListener('pointermove', onMove), () => area.removeEventListener('pointerdown', onDown));
    });
    if (this.headerTemplate) this.wireQuillToolbar();
    this.syncToolbarTabStops();
    this.cdr.detectChanges();
    this.onInit.emit({ editor: this.api });
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.closePanel(false);
    this.unlockScroll?.();
    this.quillObserver?.disconnect();
    for (const off of this.cleanups.splice(0)) off();
    const win = this.doc.defaultView;
    if (this.stateFrame && win) win.cancelAnimationFrame(this.stateFrame);
  }

  /** The calls apps make on the editor from code (the same object `(onInit)` hands over). */
  getEditor(): WuEditorApi {
    return this.api;
  }

  /** The same as getEditor(), for code moving over. */
  getQuill(): WuEditorApi {
    return this.api;
  }

  // ---------- forms ----------

  writeValue(v: unknown): void {
    this.value = v === null || v === undefined ? null : String(v);
    this.lastEmitted = this.value;
    if (this.viewReady) {
      this.area.innerHTML = this.toEditable(this.value);
      this.history.reset({ html: this.area.innerHTML, selection: null });
      this.selectImage(null);
      this.refreshMeta();
      this.cdr.markForCheck();
    }
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.syncEditable();
    this.cdr.markForCheck();
  }

  // ---------- what the templates read ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  get m(): WuEditorMessages {
    return this.config.translation.editor || TH_LOCALE.editor;
  }
  get headerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.headerRef) || ɵfindTemplate(this.templates, 'header');
  }
  get locked(): boolean {
    return this.disabled || this._readonly;
  }
  get area(): HTMLElement {
    return this.areaRef!.nativeElement;
  }
  get areaLabel(): string {
    return this.ariaLabel || this.placeholder || this.m.content;
  }
  headingLabel(level: number): string {
    return level ? this.m.heading.replace('{0}', String(level)) : this.m.paragraph;
  }
  get currentHeadingLabel(): string {
    if (this.state.codeBlock) return this.m.codeBlock;
    if (this.state.blockquote) return this.m.blockquote;
    return this.headingLabel(this.state.heading);
  }
  get fontSizes(): EditorOption[] {
    if (this.opts.fontSizes.length) return this.opts.fontSizes;
    const m = this.m;
    return EDITOR_FONT_SIZES.map((s) => ({
      value: s.value,
      label: s.label === 'small' ? m.sizeSmall : s.label === 'large' ? m.sizeLarge : s.label === 'huge' ? m.sizeHuge : m.sizeNormal,
    }));
  }
  get fontFamilies(): EditorOption[] {
    if (this.opts.fontFamilies.length) return this.opts.fontFamilies;
    return [
      { label: this.m.defaultFont, value: '' },
      { label: 'Serif', value: 'serif' },
      { label: 'Monospace', value: 'monospace' },
    ];
  }
  get currentSizeLabel(): string {
    return this.fontSizes.find((s) => s.value === this.state.fontSize)?.label || this.m.fontSize;
  }
  get currentFontLabel(): string {
    return this.fontFamilies.find((s) => s.value === this.state.fontFamily)?.label || this.m.fontFamily;
  }
  /** Label and icon of one tool. */
  toolLabel(tool: EditorTool): string {
    const m = this.m as unknown as Record<string, string>;
    if (tool === 'fullscreen' && this.fullscreen) return this.m.exitFullscreen;
    if (tool === 'table' && this.state.table) return this.m.table;
    return m[tool] || tool;
  }
  isOn(tool: EditorTool): boolean {
    const s = this.state as unknown as Record<string, unknown>;
    if (tool === 'source') return this.sourceMode;
    if (tool === 'fullscreen') return this.fullscreen;
    if (tool === 'alignLeft' || tool === 'alignCenter' || tool === 'alignRight' || tool === 'alignJustify') return this.state.align === tool.slice(5).toLowerCase();
    return s[tool] === true;
  }
  isDisabled(tool: EditorTool): boolean {
    if (tool === 'fullscreen') return false;
    if (this.locked) return true;
    if (this.sourceMode) return tool !== 'source';
    if (tool === 'undo') return !this.canUndo;
    if (tool === 'redo') return !this.canRedo;
    return false;
  }
  /** Tools that open a menu (aria-haspopup). */
  hasMenu(tool: EditorTool): boolean {
    return ['heading', 'fontSize', 'fontFamily', 'color', 'highlight', 'align', 'link', 'image', 'table'].includes(tool);
  }
  /** Tools drawn as a labelled dropdown rather than an icon. */
  isDropdown(tool: EditorTool): boolean {
    return tool === 'heading' || tool === 'fontSize' || tool === 'fontFamily';
  }
  dropdownLabel(tool: EditorTool): string {
    return tool === 'heading' ? this.currentHeadingLabel : tool === 'fontSize' ? this.currentSizeLabel : this.currentFontLabel;
  }
  /** Name of the icon a tool shows (the align tool shows the current alignment). */
  toolIcon(tool: EditorTool): string {
    if (tool === 'align') return 'align' + this.state.align[0].toUpperCase() + this.state.align.slice(1);
    if (tool === 'fullscreen' && this.fullscreen) return 'exitFullscreen';
    return tool;
  }
  /** Whether the menu of a tool is the one open. */
  panelOpenFor(tool: EditorTool): boolean {
    return tool === 'table' ? this.panel === 'table' || this.panel === 'tableMenu' : this.panel === tool;
  }
  get areaId(): string {
    return `${this.id || this.baseId}_content`;
  }
  buttonClass(styleClass: string, extra = ''): string {
    return ɵbuttonClass(styleClass) + (extra ? ' ' + extra : '');
  }
  alignLabel(a: string): string {
    return a === 'center' ? this.m.alignCenter : a === 'right' ? this.m.alignRight : a === 'justify' ? this.m.alignJustify : this.m.alignLeft;
  }
  alignIcon(a: string): string {
    return 'align' + a[0].toUpperCase() + a.slice(1);
  }
  gridRows(): number[] {
    return Array.from({ length: this.opts.table.rows }, (_, i) => i + 1);
  }
  gridCols(): number[] {
    return Array.from({ length: this.opts.table.cols }, (_, i) => i + 1);
  }
  get gridLabel(): string {
    const { rows, cols } = this.gridHover;
    return rows && cols ? this.m.tableSize.replace('{0}', String(rows)).replace('{1}', String(cols)) : this.m.insertTable;
  }
  get countText(): string {
    return `${this.m.words.replace('{0}', String(this.counts.words))} · ${this.m.characters.replace('{0}', String(this.counts.characters))}`;
  }
  get acceptImages(): string {
    return this.uploadConfig.accept || ACCEPT_IMAGES;
  }
  get imageWidthLabel(): string {
    const img = this.selectedImage;
    return img && img.getAttribute('width') ? `${img.getAttribute('width')}px` : this.m.imageOriginal;
  }
  imageAlignLabel(a: string): string {
    const m = this.m;
    return a === 'left' ? m.imageLeft : a === 'center' ? m.imageCenter : a === 'right' ? m.imageRight : m.imageInline;
  }
  imageAlignIs(a: string): boolean {
    const img = this.selectedImage;
    if (!img) return false;
    const cur = prefixedClass(img, 'wu-image-') || 'inline';
    return cur === a;
  }

  // ---------- toolbar actions ----------

  /** Keeps the content's selection when a toolbar button is pressed. */
  toolbarMouseDown(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    if (t.closest('select, input, textarea')) return;
    if (t.closest('button')) event.preventDefault();
  }

  /** A toolbar button. */
  runTool(tool: EditorTool, event: Event): void {
    if (this.isDisabled(tool)) return;
    const anchor = (event.currentTarget as HTMLElement) || null;
    switch (tool) {
      case 'undo':
        return this.undo();
      case 'redo':
        return this.redo();
      case 'bold':
      case 'italic':
      case 'underline':
        return this.exec(() => this.doc.execCommand(tool, false));
      case 'strike':
        return this.exec(() => this.doc.execCommand('strikeThrough', false));
      case 'subscript':
      case 'superscript':
        return this.exec(() => this.doc.execCommand(tool, false));
      case 'code':
        return this.exec(() => this.toggleInlineCode());
      case 'bulletList':
        return this.exec(() => this.doc.execCommand('insertUnorderedList', false));
      case 'orderedList':
        return this.exec(() => this.doc.execCommand('insertOrderedList', false));
      case 'indent':
        return this.exec(() => this.indent(1));
      case 'outdent':
        return this.exec(() => this.indent(-1));
      case 'alignLeft':
      case 'alignCenter':
      case 'alignRight':
      case 'alignJustify':
        return this.exec(() => this.setAlign(tool.slice(5).toLowerCase()));
      case 'blockquote':
        return this.exec(() => this.formatBlock(this.state.blockquote ? 'p' : 'blockquote'));
      case 'codeBlock':
        return this.exec(() => this.formatBlock(this.state.codeBlock ? 'p' : 'pre'));
      case 'hr':
        return this.exec(() => this.doc.execCommand('insertHorizontalRule', false));
      case 'clear':
        return this.exec(() => this.clearFormatting());
      case 'source':
        return this.toggleSource();
      case 'fullscreen':
        return this.toggleFullscreen();
      case 'table':
        return this.openPanel(this.state.table ? 'tableMenu' : 'table', anchor);
      case 'align':
      case 'heading':
      case 'fontSize':
      case 'fontFamily':
      case 'color':
      case 'highlight':
      case 'link':
      case 'image':
        return this.openPanel(tool, anchor);
    }
  }

  /** ← / → / Home / End move along the toolbar (one Tab stop), as toolbars do. */
  toolbarKeydown(event: KeyboardEvent): void {
    const bar = this.toolbarRef?.nativeElement;
    if (!bar || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const items = this.toolbarItems();
    const at = items.indexOf(event.target as HTMLElement);
    if (at < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (at + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    items.forEach((el, i) => el.setAttribute('tabindex', i === next ? '0' : '-1'));
    items[next].focus();
  }

  pickHeading(level: number): void {
    this.closePanel(false);
    this.exec(() => this.formatBlock(level ? `h${level}` : 'p'));
  }
  /** Quote or code block from the block menu; picking the current one turns it back into a paragraph. */
  pickBlock(kind: 'blockquote' | 'codeBlock'): void {
    this.closePanel(false);
    const on = kind === 'blockquote' ? this.state.blockquote : this.state.codeBlock;
    this.exec(() => this.formatBlock(on ? 'p' : kind === 'blockquote' ? 'blockquote' : 'pre'));
  }
  pickSize(value: string): void {
    this.closePanel(false);
    this.exec(() => this.applyInlineStyle('fontSize', value));
  }
  pickFont(value: string): void {
    this.closePanel(false);
    this.exec(() => this.applyInlineStyle('fontFamily', value));
  }
  pickAlign(a: string): void {
    this.closePanel(false);
    this.exec(() => this.setAlign(a));
  }
  pickColor(kind: 'color' | 'highlight', value: string | null): void {
    this.closePanel(false);
    this.exec(() => {
      if (!value) return this.removeInlineStyle(kind === 'color' ? 'color' : 'background-color');
      this.doc.execCommand('styleWithCSS', false, 'true');
      if (kind === 'color') this.doc.execCommand('foreColor', false, value);
      else if (!this.doc.execCommand('hiliteColor', false, value)) this.doc.execCommand('backColor', false, value);
      this.doc.execCommand('styleWithCSS', false, 'false');
    });
  }
  customColor(kind: 'color' | 'highlight', event: Event): void {
    this.pickColor(kind, (event.target as HTMLInputElement).value);
  }

  gridMove(rows: number, cols: number): void {
    this.gridHover = { rows, cols };
  }
  /** Arrow keys over the grid picker; Enter inserts. */
  gridKeydown(event: KeyboardEvent): void {
    const g = this.gridHover;
    let { rows, cols } = g.rows ? g : { rows: 1, cols: 1 };
    if (event.key === 'ArrowRight') cols = Math.min(this.opts.table.cols, cols + 1);
    else if (event.key === 'ArrowLeft') cols = Math.max(1, cols - 1);
    else if (event.key === 'ArrowDown') rows = Math.min(this.opts.table.rows, rows + 1);
    else if (event.key === 'ArrowUp') rows = Math.max(1, rows - 1);
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      return this.insertTable(rows, cols);
    } else return;
    event.preventDefault();
    this.gridHover = { rows, cols };
    this.cdr.markForCheck();
  }
  /** The insert panel's size fields: rows and columns typed in, then Insert. */
  insertCustomTable(): void {
    const n = (v: unknown, max: number) => Math.min(max, Math.max(1, Math.floor(Number(v)) || 1));
    this.insertTable(n(this.tableForm.rows, 100), n(this.tableForm.cols, 30), this.tableForm.header);
  }
  setTableForm(field: 'rows' | 'cols', event: Event): void {
    this.tableForm = { ...this.tableForm, [field]: (event.target as HTMLInputElement).value };
  }
  setTableHeader(event: Event): void {
    this.tableForm = { ...this.tableForm, header: (event.target as HTMLInputElement).checked };
  }
  insertTable(rows: number, cols: number, header = this.opts.table.headerRow): void {
    this.closePanel(false);
    this.exec(() => {
      const table = createTable(this.doc, Math.max(1, rows), Math.max(1, cols), header && rows > 1);
      const html = table.outerHTML + '<p><br></p>';
      this.doc.execCommand('insertHTML', false, html);
      // Put the caret in the first cell of the new table.
      const tables = this.area.querySelectorAll('table');
      const r = rangeIn(this.area);
      let target: HTMLTableElement | null = null;
      tables.forEach((t) => {
        if (!target && r && t.compareDocumentPosition(r.startContainer) & 4) target = t;
      });
      const placed = (target || tables[tables.length - 1]) as HTMLTableElement | undefined;
      const first = placed?.querySelector('td, th');
      if (first) caretIn(first);
    });
  }

  /** Table menu actions. */
  tableAction(
    action: 'rowAbove' | 'rowBelow' | 'colLeft' | 'colRight' | 'deleteRow' | 'deleteCol' | 'deleteTable' | 'headerRow' | 'mergeRight' | 'mergeDown' | 'splitCell' | 'mergeCells',
  ): void {
    const pick = this.cellPick;
    const cell = pick?.from || this.currentCell();
    const fromBar = this.panel === 'tableBar';
    this.closePanel(false);
    if (!cell) return;
    this.exec(() => {
      const table = cell.closest('table') as HTMLTableElement;
      let caret: Element | null = cell;
      this.clearCellPick();
      switch (action) {
        case 'mergeCells':
          if (pick && pick.table === table) caret = mergeRect(table, cellRect(table, pick.from, pick.to)) || cell;
          else mergeCells(cell, 'right');
          break;
        case 'rowAbove':
          insertRow(cell, false);
          break;
        case 'rowBelow':
          caret = insertRow(cell, true);
          break;
        case 'colLeft':
          insertColumn(cell, false);
          break;
        case 'colRight':
          insertColumn(cell, true);
          break;
        case 'deleteRow':
          caret = deleteRow(cell);
          break;
        case 'deleteCol':
          caret = deleteColumn(cell);
          break;
        case 'deleteTable': {
          const after = table.nextElementSibling;
          table.remove();
          caret = after || null;
          break;
        }
        case 'headerRow':
          toggleHeaderRow(table);
          break;
        case 'mergeRight':
          mergeCells(cell, 'right');
          break;
        case 'mergeDown':
          mergeCells(cell, 'down');
          break;
        case 'splitCell':
          splitCell(cell);
          break;
      }
      if (caret && caret.isConnected) caretIn(caret);
      else if (!this.area.firstChild) this.area.innerHTML = '<p><br></p>';
    }, true);
    // The table's own toolbar stays while the table does.
    const still = (cell.isConnected ? cell : this.currentCell())?.closest('table') as HTMLTableElement | null;
    if (fromBar && still && this.area.contains(still)) setTimeout(() => this.openPanel('tableBar', still));
  }
  /** Two or more cells picked (merge them), else the cell can join its right neighbour. */
  get canMergePicked(): boolean {
    if (this.cellPick) return cellsInRect(this.cellPick.table, cellRect(this.cellPick.table, this.cellPick.from, this.cellPick.to)).length > 1;
    return this.canMerge('right');
  }

  // ---------- tables: picking cells, resizing columns ----------

  private resizeHover: { table: HTMLTableElement; col: number } | null = null;

  /** Over a column's right edge the pointer becomes a resize arrow. */
  private tablePointerMove(event: PointerEvent): void {
    if (this.locked || event.buttons) return;
    const hit = this.columnEdgeAt(event);
    if (!!hit !== !!this.resizeHover || hit?.col !== this.resizeHover?.col) this.area.classList.toggle('wu-editor-col-resize', !!hit);
    this.resizeHover = hit;
  }

  private tablePointerDown(event: PointerEvent): void {
    if (this.locked || event.button !== 0) return;
    const hit = this.columnEdgeAt(event);
    if (hit) {
      event.preventDefault();
      this.zone.run(() => this.startColumnResize(hit.table, hit.col, event));
      return;
    }
    const cell = (event.target as HTMLElement).closest?.('td, th') as HTMLTableCellElement | null;
    if (!cell || !this.area.contains(cell)) {
      if (this.cellPick) this.zone.run(() => this.clearCellPick());
      return;
    }
    const table = cell.closest('table') as HTMLTableElement;
    // Shift + click: from the cell with the caret to this one.
    const caretCell = this.currentCell();
    if (event.shiftKey && caretCell && caretCell !== cell && caretCell.closest('table') === table) {
      event.preventDefault();
      this.zone.run(() => this.pickCells(table, this.cellPick?.from || caretCell, cell));
      return;
    }
    if (this.cellPick) this.zone.run(() => this.clearCellPick());
    const doc = this.doc;
    const move = (e: PointerEvent) => {
      const over = (doc.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest?.('td, th') as HTMLTableCellElement | null;
      if (!over || over.closest('table') !== table) return;
      if (over === cell && !this.cellPick) return;
      this.zone.run(() => this.pickCells(table, cell, over));
    };
    const up = () => {
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerup', up);
      if (this.cellPick) {
        // The caret goes back to the first cell; the picked cells stay marked.
        caretIn(this.cellPick.from);
        this.area.classList.remove('wu-editor-picking');
      }
    };
    doc.addEventListener('pointermove', move);
    doc.addEventListener('pointerup', up);
  }

  private pickCells(table: HTMLTableElement, from: HTMLTableCellElement, to: HTMLTableCellElement): void {
    this.cellPick = { table, from, to };
    const picked = new Set(cellsInRect(table, cellRect(table, from, to)));
    table.querySelectorAll('td, th').forEach((c) => c.classList.toggle('wu-editor-cell-picked', picked.has(c as HTMLTableCellElement)));
    this.area.classList.add('wu-editor-picking');
    if (this.panel !== 'tableBar' || this.panelAnchor !== table) this.openPanel('tableBar', table);
    this.cdr.markForCheck();
  }

  private clearCellPick(): void {
    if (!this.cellPick) return;
    this.cellPick.table.querySelectorAll('.wu-editor-cell-picked').forEach((c) => c.classList.remove('wu-editor-cell-picked'));
    this.area.classList.remove('wu-editor-picking');
    this.cellPick = null;
    this.cdr.markForCheck();
  }

  /** The column whose right edge is under the pointer (within 4px), or null. */
  private columnEdgeAt(event: PointerEvent): { table: HTMLTableElement; col: number } | null {
    const cell = (event.target as HTMLElement).closest?.('td, th') as HTMLTableCellElement | null;
    if (!cell || !this.area.contains(cell)) return null;
    const r = cell.getBoundingClientRect();
    const rtl = this.doc.defaultView?.getComputedStyle(cell).direction === 'rtl';
    const edge = rtl ? r.left : r.right;
    if (Math.abs(event.clientX - edge) > 4) return null;
    const table = cell.closest('table') as HTMLTableElement;
    const g = tableGrid(table);
    let col = -1;
    for (const row of g.grid) {
      const i = row.lastIndexOf(cell);
      if (i >= 0) {
        col = i;
        break;
      }
    }
    return col >= 0 ? { table, col } : null;
  }

  /** Drags a column's edge: the column and its right neighbour share the width; the last edge resizes the table. */
  private startColumnResize(table: HTMLTableElement, col: number, event: PointerEvent): void {
    const cols = ensureTableCols(table);
    const tableWidth = table.getBoundingClientRect().width || 1;
    const host = Math.max(1, table.parentElement?.clientWidth || tableWidth);
    const start = event.clientX;
    const startW = cols.map((c) => ((parseFloat(c.style.width) || 100 / cols.length) / 100) * tableWidth);
    const startTable = tableWidth;
    const min = 24;
    const last = col >= cols.length - 1;
    const doc = this.doc;
    this.area.classList.add('wu-editor-resizing');
    const move = (e: PointerEvent) => {
      const dx = e.clientX - start;
      if (last) {
        // The table itself: as wide as the text at most.
        const w = Math.min(host, Math.max(min * cols.length, startTable + dx));
        table.style.width = percent((w / host) * 100);
        const total = startW.reduce((a, b) => a + b, 0) - startW[col] + Math.max(min, startW[col] + (w - startTable));
        cols.forEach((c, i) => (c.style.width = percent(((i === col ? Math.max(min, startW[col] + (w - startTable)) : startW[i]) / total) * 100)));
        return;
      }
      const pair = startW[col] + startW[col + 1];
      const a = Math.min(pair - min, Math.max(min, startW[col] + dx));
      const widths = startW.slice();
      widths[col] = a;
      widths[col + 1] = pair - a;
      const sum = widths.reduce((x, y) => x + y, 0) || 1;
      cols.forEach((c, i) => (c.style.width = percent((widths[i] / sum) * 100)));
    };
    const up = () => {
      doc.removeEventListener('pointermove', move);
      doc.removeEventListener('pointerup', up);
      this.area.classList.remove('wu-editor-resizing');
      this.zone.run(() => this.afterTableResize());
    };
    doc.addEventListener('pointermove', move);
    doc.addEventListener('pointerup', up);
  }

  private afterTableResize(): void {
    this.pushHistory(false);
    this.emit('user');
  }
  canMerge(direction: 'right' | 'down'): boolean {
    const cell = this.currentCell();
    if (!cell) return false;
    const clone = cell.closest('table')!.cloneNode(true) as HTMLTableElement;
    const path: number[] = [];
    // Try the merge on a copy so the menu can say whether it would work.
    const rows = Array.from(cell.closest('table')!.rows);
    const r = rows.indexOf(cell.parentElement as HTMLTableRowElement);
    const c = Array.from((cell.parentElement as HTMLTableRowElement).cells).indexOf(cell);
    path.push(r, c);
    const copy = clone.rows[r]?.cells[c];
    return !!copy && mergeCells(copy, direction);
  }
  canSplit(): boolean {
    const cell = this.currentCell();
    return !!cell && ((cell.rowSpan || 1) > 1 || (cell.colSpan || 1) > 1);
  }
  get inHeaderRow(): boolean {
    const cell = this.currentCell();
    return !!cell?.closest('thead');
  }

  // ---------- links ----------

  applyLink(): void {
    const url = this.linkForm.url.trim();
    if (!url) return this.unlink();
    const href = /^[a-z][a-z0-9+.-]*:|^[/#?.]/i.test(url) ? url : `https://${url}`;
    if (!safeEditorUrl(href, this.opts.link.protocols)) {
      this.linkForm.error = this.m.invalidUrl;
      this.cdr.markForCheck();
      return;
    }
    const newTab = this.linkForm.newTab;
    const text = this.linkForm.text.trim();
    this.closePanel(false);
    this.exec(() => {
      const r = rangeIn(this.area);
      const existing = r ? closestIn(r.startContainer, this.area, 'a') : null;
      if (existing && (!r || r.collapsed)) {
        existing.setAttribute('href', href);
        if (text && text !== existing.textContent) existing.textContent = text;
        this.setLinkTarget(existing, newTab);
        return;
      }
      if (!r || r.collapsed) {
        const a = this.doc.createElement('a');
        a.setAttribute('href', href);
        a.textContent = text || url;
        this.setLinkTarget(a, newTab);
        this.doc.execCommand('insertHTML', false, a.outerHTML + '&nbsp;');
        return;
      }
      this.doc.execCommand('createLink', false, href);
      const sel = rangeIn(this.area);
      const anchors = new Set<HTMLAnchorElement>();
      this.area.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
        if (a.getAttribute('href') === href && sel && sel.intersectsNode(a)) anchors.add(a);
      });
      anchors.forEach((a) => this.setLinkTarget(a, newTab));
    });
  }
  unlink(): void {
    this.closePanel(false);
    this.exec(() => {
      const r = rangeIn(this.area);
      const a = r ? closestIn(r.startContainer, this.area, 'a') : null;
      if (a && r?.collapsed) {
        a.replaceWith(...Array.from(a.childNodes));
        return;
      }
      this.doc.execCommand('unlink', false);
    });
  }
  currentLinkHref(): string {
    const r = this.savedRange;
    const a = r ? closestIn(r.startContainer, this.area, 'a') : null;
    return a?.getAttribute('href') || '';
  }

  // ---------- images ----------

  chooseImage(): void {
    this.imageInputRef?.nativeElement.click();
  }
  imageFilesChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    input.value = '';
    this.closePanel(false);
    this.restore();
    void this.insertImageFiles(files);
  }
  insertImageUrl(): void {
    const url = this.imageForm.url.trim();
    if (!url || !safeEditorImage(url)) {
      this.imageForm.error = this.m.invalidUrl;
      this.cdr.markForCheck();
      return;
    }
    const alt = this.imageForm.alt.trim();
    this.closePanel(false);
    this.exec(() => {
      const img = this.doc.createElement('img');
      img.setAttribute('src', url);
      img.setAttribute('alt', alt);
      this.doc.execCommand('insertHTML', false, img.outerHTML);
    });
  }
  imagePanelDrop(event: DragEvent): void {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    this.closePanel(false);
    this.restore();
    void this.insertImageFiles(files);
  }

  /** Picture menu: alignment, width, alternative text, remove. */
  setImageAlign(a: 'inline' | 'left' | 'center' | 'right'): void {
    const img = this.selectedImage;
    if (!img) return;
    setPrefixedClass(img, 'wu-image-', a === 'inline' ? null : a);
    this.afterDomChange();
    this.placeFrame();
  }
  setImageWidth(percent: number | null): void {
    const img = this.selectedImage;
    if (!img) return;
    if (percent === null) img.removeAttribute('width');
    else {
      const box = this.area.clientWidth - 32;
      img.setAttribute('width', String(Math.round((box * percent) / 100)));
    }
    img.removeAttribute('height');
    this.afterDomChange();
    this.placeFrame();
  }
  setImageAlt(event: Event): void {
    const img = this.selectedImage;
    if (!img) return;
    img.setAttribute('alt', (event.target as HTMLInputElement).value);
    this.afterDomChange();
  }
  removeImage(): void {
    const img = this.selectedImage;
    if (!img) return;
    this.closePanel(false);
    this.selectImage(null);
    img.remove();
    this.afterDomChange();
    this.area.focus();
  }

  /** Drag on the frame's corner handle resizes the picture, keeping its proportions. */
  resizeStart(event: PointerEvent): void {
    const img = this.selectedImage;
    if (!img || this.locked) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture?.(event.pointerId);
    const startX = event.clientX;
    const startW = img.getBoundingClientRect().width;
    const max = this.area.clientWidth - 16;
    const move = (e: PointerEvent) => {
      const w = Math.max(24, Math.min(max, Math.round(startW + (e.clientX - startX))));
      img.setAttribute('width', String(w));
      img.removeAttribute('height');
      this.placeFrame();
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      this.zone.run(() => this.afterDomChange());
    };
    this.zone.runOutsideAngular(() => {
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });
  }

  /** Uploads or embeds pictures and puts them at the caret. */
  async insertImageFiles(files: File[]): Promise<void> {
    const cfg = this.uploadConfig;
    for (const file of files) {
      if (!acceptsFile(file, cfg.accept || ACCEPT_IMAGES)) {
        this.fail(file, 'type', this.m.imageWrongType.replace('{0}', file.name));
        continue;
      }
      if (cfg.maxSize && file.size > cfg.maxSize) {
        this.fail(file, 'size', this.m.imageTooLarge.replace('{0}', file.name).replace('{1}', formatFileSize(cfg.maxSize, this.t.fileSizeTypes)));
        continue;
      }
      if (this.uploadMode === 'base64') {
        const data = await this.readAsDataUrl(file);
        this.exec(() => this.doc.execCommand('insertHTML', false, `<img src="${data}" alt="">`));
        continue;
      }
      // Show the picture at once, from memory, while it uploads.
      const win = this.doc.defaultView as (Window & typeof globalThis) | null;
      const temp = win?.URL?.createObjectURL ? win.URL.createObjectURL(file) : await this.readAsDataUrl(file);
      const marker = `wu-up-${Math.random().toString(36).slice(2)}`;
      this.exec(() => this.doc.execCommand('insertHTML', false, `<img src="${temp}" alt="" class="wu-image-uploading" data-wu-upload="${marker}">`));
      try {
        const url = await this.upload(file);
        const img = this.area.querySelector(`img[data-wu-upload="${marker}"]`);
        if (img) {
          img.setAttribute('src', url);
          img.classList.remove('wu-image-uploading');
          if (!img.classList.length) img.removeAttribute('class');
          img.removeAttribute('data-wu-upload');
        }
        this.onImageUpload.emit({ file, url });
        this.afterDomChange();
      } catch (error) {
        this.area.querySelector(`img[data-wu-upload="${marker}"]`)?.remove();
        this.fail(file, 'upload', this.m.uploadFailed, error);
        this.afterDomChange();
      } finally {
        if (temp.startsWith('blob:')) win?.URL?.revokeObjectURL?.(temp);
      }
    }
  }

  /** Puts the keyboard in the content, where the caret last was. */
  focus(): void {
    if (this.sourceMode) return;
    this.restore();
  }

  // ---------- content events ----------

  areaInput(): void {
    this.normalizeEmpty();
    this.pushHistory(true);
    this.emit('user');
  }

  areaFocus(event: FocusEvent): void {
    this.focused = true;
    this.onFocus.emit(event);
    this.cdr.markForCheck();
  }

  areaBlur(event: FocusEvent): void {
    this.focused = false;
    this.onTouched();
    this.onBlur.emit(event);
    this.cdr.markForCheck();
  }

  areaKeydown(event: KeyboardEvent): void {
    if (this.locked) return;
    if (this.cellPick && !['Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) {
      const pick = this.cellPick;
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        this.exec(() => {
          for (const c of cellsInRect(pick.table, cellRect(pick.table, pick.from, pick.to))) c.innerHTML = '<br>';
          caretIn(pick.from);
        });
      }
      this.clearCellPick();
      if (event.defaultPrevented) return;
    }
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    if (mod && !event.altKey) {
      if (key === 'z') {
        event.preventDefault();
        return event.shiftKey ? this.redo() : this.undo();
      }
      if (key === 'y') {
        event.preventDefault();
        return this.redo();
      }
      if (key === 'k') {
        event.preventDefault();
        return this.openPanel('link', this.toolbarButton('link') || this.area);
      }
      if (key === 'b' || key === 'i' || key === 'u') {
        event.preventDefault();
        return this.runTool(key === 'b' ? 'bold' : key === 'i' ? 'italic' : 'underline', event);
      }
    }
    if (event.key === 'Tab' && !mod && !event.altKey) {
      const cell = this.currentCell();
      if (cell) {
        event.preventDefault();
        const next = adjacentCell(cell, event.shiftKey);
        if (next) caretIn(next, true);
        else if (!event.shiftKey) this.exec(() => {
          const added = insertRow(cell, true);
          if (added) caretIn(added);
        }, true);
        return;
      }
      if (this.state.bulletList || this.state.orderedList) {
        event.preventDefault();
        return this.exec(() => this.doc.execCommand(event.shiftKey ? 'outdent' : 'indent', false));
      }
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && this.selectedImage) {
      event.preventDefault();
      return this.removeImage();
    }
    if (event.key === 'Escape' && this.fullscreen) {
      event.preventDefault();
      this.toggleFullscreen();
    }
  }

  areaClick(event: MouseEvent): void {
    const t = event.target as HTMLElement;
    if (t.tagName === 'IMG' && this.area.contains(t)) {
      this.selectImage(t as HTMLImageElement);
      if (!this.locked) this.openPanel('imageMenu', t);
      return;
    }
    this.selectImage(null);
    const table = t.closest('table');
    if (table && this.area.contains(table) && !this.locked && !t.closest('a')) {
      if (this.panel !== 'tableBar' || this.panelAnchor !== table) this.openPanel('tableBar', table);
      return;
    }
    const a = t.closest('a');
    if (a && this.area.contains(a) && !this.locked) {
      // Ctrl / ⌘ + click opens the link, as in other editors.
      if (event.ctrlKey || event.metaKey) {
        const href = a.getAttribute('href');
        if (href) this.doc.defaultView?.open(href, '_blank', 'noopener');
        return;
      }
      this.saveRange();
      this.openPanel('linkMenu', a);
    }
  }

  areaPaste(event: ClipboardEvent): void {
    if (this.locked) return;
    const dt = event.clipboardData;
    if (!dt) return;
    const files = Array.from(dt.files || []).filter((f) => /^image\//.test(f.type));
    const html = dt.getData('text/html');
    if (files.length && !html) {
      event.preventDefault();
      void this.insertImageFiles(files);
      return;
    }
    event.preventDefault();
    if (html) {
      this.insertHtml(cleanEditorHtml(html.replace(/<!--StartFragment-->|<!--EndFragment-->/g, ''), this.doc, this.cleanOpts));
      return;
    }
    const text = dt.getData('text/plain');
    if (!text) return;
    if (this.state.codeBlock || !/\r?\n/.test(text)) {
      this.exec(() => this.doc.execCommand('insertText', false, text));
      return;
    }
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const paragraphs = text.replace(/\r\n/g, '\n').split(/\n/).map((line) => `<p>${line ? esc(line) : '<br>'}</p>`);
    this.insertHtml(paragraphs.join(''));
  }

  areaDragOver(event: DragEvent): void {
    if (!this.locked && Array.from(event.dataTransfer?.types || []).includes('Files')) event.preventDefault();
  }

  areaDrop(event: DragEvent): void {
    const files = Array.from(event.dataTransfer?.files || []).filter((f) => /^image\//.test(f.type));
    if (!files.length || this.locked) return;
    event.preventDefault();
    const d = this.doc as Document & { caretRangeFromPoint?(x: number, y: number): Range | null; caretPositionFromPoint?(x: number, y: number): { offsetNode: Node; offset: number } | null };
    let r: Range | null = null;
    if (d.caretRangeFromPoint) r = d.caretRangeFromPoint(event.clientX, event.clientY);
    else if (d.caretPositionFromPoint) {
      const p = d.caretPositionFromPoint(event.clientX, event.clientY);
      if (p) {
        r = this.doc.createRange();
        r.setStart(p.offsetNode, p.offset);
      }
    }
    this.area.focus();
    if (r && this.area.contains(r.startContainer)) selectRange(r);
    void this.insertImageFiles(files);
  }

  sourceInput(event: Event): void {
    this.sourceText = (event.target as HTMLTextAreaElement).value;
  }

  dismissNotice(i: number): void {
    this.notices = this.notices.filter((_, k) => k !== i);
    this.cdr.markForCheck();
  }

  // ---------- panels ----------

  openPanel(kind: WuEditorPanel, anchor: HTMLElement | null): void {
    if (this.panel === kind && this.panelAnchor === anchor) return this.closePanel(true);
    this.closePanel(false);
    if (!['imageMenu', 'linkMenu', 'tableBar'].includes(kind)) this.saveRange();
    this.panel = kind;
    this.panelAnchor = anchor || this.area;
    if (kind === 'link') {
      const r = this.savedRange;
      const a = r ? closestIn(r.startContainer, this.area, 'a') : null;
      this.linkForm = {
        url: a?.getAttribute('href') || '',
        text: a ? a.textContent || '' : '',
        newTab: a ? a.getAttribute('target') === '_blank' : this.opts.link.newTab,
        showText: !!a || !r || r.collapsed,
        error: '',
      };
    } else if (kind === 'image') {
      this.imageForm = { tab: 'upload', url: '', alt: '', error: '' };
    } else if (kind === 'table') {
      this.gridHover = { rows: 0, cols: 0 };
    }
    this.cdr.detectChanges();
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    this.popup = new ɵWuPopup(this.panelAnchor, panel, {
      onOutside: () => this.zone.run(() => this.closePanel(false)),
      onEscape: (e) =>
        this.zone.run(() => {
          e.preventDefault();
          this.closePanel(true);
        }),
      sheetClass: 'wu-editor-panel-sheet',
      modalClass: 'wu-editor-panel-modal',
      sheet: false,
      gap: 6,
    });
    this.popup.open();
    // Menus get the keyboard; balloons over the content leave it in the text.
    if (kind !== 'linkMenu' && kind !== 'tableBar') {
      const first = panel.querySelector<HTMLElement>('input:not([type="checkbox"]):not([type="color"]):not([type="file"]), [role="menuitemradio"][aria-checked="true"], [role="menuitem"], [role="menuitemradio"], button, [tabindex="0"]');
      first?.focus();
    }
  }

  closePanel(returnFocus: boolean): void {
    if (!this.panel) return;
    const was = this.panel;
    const anchor = this.panelAnchor;
    this.popup?.close();
    this.popup = null;
    this.panel = null;
    this.panelAnchor = null;
    this.cdr.markForCheck();
    if (returnFocus) {
      if (was === 'imageMenu' || was === 'linkMenu' || was === 'tableBar' || !anchor || anchor === this.area || !this.host.contains(anchor)) this.restore();
      else anchor.focus();
    }
  }

  /** ↑ / ↓ inside a menu panel. */
  panelKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const panel = this.panelRef?.nativeElement;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemradio"]')).filter((el) => !(el as HTMLButtonElement).disabled);
    if (!items.length) return;
    const at = items.indexOf(this.doc.activeElement as HTMLElement);
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (at + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  }

  // ---------- internals: commands ----------

  /** Runs a change on the content with the selection back in place, then records and reports it. */
  protected exec(change: () => void, structural = false): void {
    if (this.locked || this.sourceMode) return;
    this.restore();
    change();
    if (structural) this.normalizeEmpty();
    this.afterDomChange();
  }

  private afterDomChange(): void {
    this.normalizeMarkup();
    this.normalizeEmpty();
    this.pushHistory(false);
    this.emit('user');
    this.updateState();
  }

  private undo(): void {
    const s = this.history.undo();
    if (s) this.applySnapshot(s.html, s.selection);
  }

  private redo(): void {
    const s = this.history.redo();
    if (s) this.applySnapshot(s.html, s.selection);
  }

  private applySnapshot(html: string, selection: Parameters<typeof restoreSelection>[1]): void {
    this.selectImage(null);
    this.area.innerHTML = html;
    this.area.focus();
    if (!restoreSelection(this.area, selection)) caretIn(this.area, true);
    this.canUndo = this.history.canUndo;
    this.canRedo = this.history.canRedo;
    this.emit('user');
    this.updateState();
  }

  private beforeInput(event: InputEvent): void {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault();
      this.zone.run(() => (event.inputType === 'historyUndo' ? this.undo() : this.redo()));
    }
  }

  private formatBlock(tag: string): void {
    this.doc.execCommand('formatBlock', false, `<${tag}>`);
  }

  private setAlign(a: string): void {
    const r = rangeIn(this.area);
    if (!r) return;
    const blocks = blocksIn(this.area, r);
    for (const b of blocks) {
      setPrefixedClass(b, 'ql-align-', a === 'left' ? null : a);
      b.style.removeProperty('text-align');
      if (!b.getAttribute('style')) b.removeAttribute('style');
    }
  }

  /** Indent for paragraphs (Quill's `ql-indent-N` classes); lists nest instead. */
  private indent(step: 1 | -1): void {
    if (this.state.bulletList || this.state.orderedList) {
      this.doc.execCommand(step > 0 ? 'indent' : 'outdent', false);
      return;
    }
    const r = rangeIn(this.area);
    if (!r) return;
    for (const b of blocksIn(this.area, r)) {
      if (b.tagName === 'TD' || b.tagName === 'TH') continue;
      const cur = Number(prefixedClass(b, 'ql-indent-') || 0);
      const next = Math.max(0, Math.min(MAX_INDENT, cur + step));
      setPrefixedClass(b, 'ql-indent-', next ? String(next) : null);
    }
  }

  private toggleInlineCode(): void {
    const r = rangeIn(this.area);
    if (!r) return;
    const code = closestIn(r.startContainer, this.area, 'code');
    if (code && !closestIn(code, this.area, 'pre')) {
      code.replaceWith(...Array.from(code.childNodes));
      return;
    }
    if (r.collapsed) return;
    const el = this.doc.createElement('code');
    el.appendChild(r.extractContents());
    el.querySelectorAll('code').forEach((c) => c.replaceWith(...Array.from(c.childNodes)));
    r.insertNode(el);
    const after = this.doc.createRange();
    after.selectNodeContents(el);
    selectRange(after);
  }

  /** Font size / family: Quill's classes for its own sizes and fonts, an inline style for anything else. */
  private applyInlineStyle(kind: 'fontSize' | 'fontFamily', value: string): void {
    const r = rangeIn(this.area);
    if (!r || r.collapsed) return;
    // The browser wraps the selection in <font>; each one becomes a span with our class or style.
    this.doc.execCommand('styleWithCSS', false, 'false');
    this.doc.execCommand(kind === 'fontSize' ? 'fontSize' : 'fontName', false, kind === 'fontSize' ? '7' : 'wu-marker');
    const fonts = Array.from(this.area.querySelectorAll<HTMLElement>(kind === 'fontSize' ? 'font[size="7"]' : 'font[face="wu-marker"]'));
    for (const f of fonts) {
      // Inner spans carrying the same property give way to the new value.
      f.querySelectorAll<HTMLElement>('span').forEach((s) => {
        if (kind === 'fontSize') {
          setPrefixedClass(s, 'ql-size-', null);
          s.style.removeProperty('font-size');
        } else {
          setPrefixedClass(s, 'ql-font-', null);
          s.style.removeProperty('font-family');
        }
        if (!s.attributes.length) s.replaceWith(...Array.from(s.childNodes));
      });
      if (!value) {
        f.replaceWith(...Array.from(f.childNodes));
        continue;
      }
      const span = this.doc.createElement('span');
      if (kind === 'fontSize') {
        if (QUILL_SIZES[value]) span.className = `ql-size-${QUILL_SIZES[value]}`;
        else span.style.fontSize = value;
      } else if (value === 'serif' || value === 'monospace') span.className = `ql-font-${value}`;
      else span.style.fontFamily = value;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
    }
  }

  private removeInlineStyle(prop: 'color' | 'background-color'): void {
    const r = rangeIn(this.area);
    if (!r) return;
    const spans = new Set<HTMLElement>();
    const start = closestIn(r.startContainer, this.area, 'span');
    if (start) spans.add(start);
    this.area.querySelectorAll<HTMLElement>('span[style], font').forEach((s) => {
      if (r.intersectsNode(s)) spans.add(s);
    });
    for (const s of spans) {
      if (s.tagName === 'FONT') {
        s.removeAttribute('color');
        continue;
      }
      s.style.removeProperty(prop);
      if (!s.getAttribute('style')) s.removeAttribute('style');
      if (!s.attributes.length) s.replaceWith(...Array.from(s.childNodes));
    }
  }

  private clearFormatting(): void {
    const r = rangeIn(this.area);
    if (!r) return;
    this.doc.execCommand('removeFormat', false);
    this.doc.execCommand('unlink', false);
    const r2 = rangeIn(this.area) || r;
    this.area.querySelectorAll<HTMLElement>('code, span').forEach((el) => {
      if (r2.intersectsNode(el) && !closestIn(el, this.area, 'pre')) el.replaceWith(...Array.from(el.childNodes));
    });
    for (const b of blocksIn(this.area, r2)) {
      setPrefixedClass(b, 'ql-align-', null);
      setPrefixedClass(b, 'ql-indent-', null);
      b.removeAttribute('style');
    }
  }

  private setLinkTarget(a: Element, newTab: boolean): void {
    if (newTab) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  }

  private insertHtml(html: string): void {
    this.exec(() => this.doc.execCommand('insertHTML', false, html), true);
  }

  private toggleSource(): void {
    if (!this.sourceMode) {
      this.closePanel(false);
      this.selectImage(null);
      this.sourceText = this.prettyHtml(this.html());
      this.sourceMode = true;
    } else {
      this.sourceMode = false;
      this.cdr.detectChanges();
      this.area.innerHTML = this.toEditable(cleanEditorHtml(this.sourceText, this.doc, this.cleanOpts));
      this.pushHistory(false);
      this.emit('user');
    }
    this.cdr.markForCheck();
  }

  /**
   * Full screen in the top layer, so no parent with a transform, filter or container query can trap it, and it stays
   * above dialogs. Browsers without popovers get a fixed overlay.
   */
  private toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    const root = this.host.querySelector('.wu-editor') as (HTMLElement & { showPopover?: () => void; hidePopover?: () => void }) | null;
    if (this.fullscreen) {
      this.unlockScroll = ɵlockScroll(this.doc);
      if (root && typeof root.showPopover === 'function') {
        root.setAttribute('popover', 'manual');
        try {
          root.showPopover();
        } catch {
          root.removeAttribute('popover');
        }
      }
    } else {
      this.unlockScroll?.();
      this.unlockScroll = null;
      if (root?.hasAttribute('popover')) {
        try {
          root.hidePopover?.();
        } catch {
          /* not shown */
        }
        root.removeAttribute('popover');
      }
    }
    this.cdr.markForCheck();
    setTimeout(() => {
      this.placeFrame();
      if (this.fullscreen) this.restore();
    });
  }

  // ---------- internals: state ----------

  private selectionChanged(): void {
    const r = rangeIn(this.area);
    if (r) this.savedRange = r.cloneRange();
    const win = this.doc.defaultView;
    if (!win || this.stateFrame) return;
    this.stateFrame = win.requestAnimationFrame(() => {
      this.stateFrame = 0;
      if (!rangeIn(this.area)) {
        if (this.lastSelection && this.doc.activeElement !== this.area) {
          const old = this.lastSelection;
          this.lastSelection = null;
          this.zone.run(() => this.onSelectionChange.emit({ range: null, oldRange: old, source: 'user' }));
        }
        return;
      }
      this.zone.run(() => {
        if (this.panel === 'tableBar' && this.panelAnchor) {
          const r2 = rangeIn(this.area);
          if (r2 && !this.panelAnchor.contains(r2.startContainer)) this.closePanel(false);
        }
        this.updateState();
        this.reportSelection();
      });
    });
  }

  private reportSelection(): void {
    if (!this.onSelectionChange.observed) return;
    const r = rangeIn(this.area);
    if (!r) return;
    const pre = this.doc.createRange();
    pre.selectNodeContents(this.area);
    pre.setEnd(r.startContainer, r.startOffset);
    const range = { index: pre.toString().length, length: r.toString().length };
    const old = this.lastSelection;
    if (old && old.index === range.index && old.length === range.length) return;
    this.lastSelection = range;
    this.onSelectionChange.emit({ range, oldRange: old, source: 'user' });
  }

  private updateState(): void {
    const r = rangeIn(this.area);
    if (!r) return;
    const q = (cmd: string) => {
      try {
        return this.doc.queryCommandState(cmd);
      } catch {
        return false;
      }
    };
    const node = r.startContainer;
    const block = blockOf(node, this.area);
    const headingEl = closestIn(node, this.area, 'h1, h2, h3, h4, h5, h6');
    const sizeSpan = closestIn(node, this.area, '[class*="ql-size-"], span[style*="font-size"]');
    const fontSpan = closestIn(node, this.area, '[class*="ql-font-"], span[style*="font-family"]');
    const size = prefixedClass(sizeSpan, 'ql-size-');
    const font = prefixedClass(fontSpan, 'ql-font-');
    this.state = {
      bold: q('bold'),
      italic: q('italic'),
      underline: q('underline'),
      strike: q('strikeThrough'),
      subscript: q('subscript'),
      superscript: q('superscript'),
      code: !!closestIn(node, this.area, 'code') && !closestIn(node, this.area, 'pre'),
      bulletList: !!closestIn(node, this.area, 'ul'),
      orderedList: !!closestIn(node, this.area, 'ol') && !closestIn(node, this.area, 'ul'),
      blockquote: !!closestIn(node, this.area, 'blockquote'),
      codeBlock: !!closestIn(node, this.area, 'pre'),
      link: !!closestIn(node, this.area, 'a'),
      table: !!closestIn(node, this.area, 'td, th'),
      heading: headingEl ? Number(headingEl.tagName.slice(1)) : 0,
      align: ((block && (prefixedClass(block, 'ql-align-') || block.style.textAlign)) || 'left') as ɵWuEditorState['align'],
      fontSize: size ? Object.keys(QUILL_SIZES).find((k) => QUILL_SIZES[k] === size) || '' : sizeSpan?.style.fontSize || '',
      fontFamily: font || fontSpan?.style.fontFamily || '',
    };
    this.syncQuillToolbar();
    this.cdr.markForCheck();
  }

  private refreshMeta(): void {
    const html = this.area.innerHTML;
    this.empty = isEmptyEditorHtml(html);
    this.canUndo = this.history.canUndo;
    this.canRedo = this.history.canRedo;
    if (this._showCount) this.counts = editorCounts(editorHtmlToText(html));
  }

  private pushHistory(merge: boolean): void {
    this.history.push({ html: this.area.innerHTML, selection: saveSelection(this.area) }, { merge });
    this.refreshMeta();
  }

  private emit(source: 'user' | 'api'): void {
    const html = this.html();
    const value = isEmptyEditorHtml(html) ? null : html;
    this.refreshMeta();
    if (value === this.lastEmitted) {
      this.cdr.markForCheck();
      return;
    }
    this.lastEmitted = value;
    this.value = value;
    this.onChange(value);
    this.onTextChange.emit({ htmlValue: value, textValue: editorHtmlToText(value), delta: null, source });
    this.cdr.markForCheck();
  }

  /** The value: the content cleaned, without the editor's own marks (pictures still uploading are left out). */
  private html(): string {
    if (!this.viewReady) return this.value || '';
    if (this.sourceMode) return cleanEditorHtml(this.sourceText, this.doc, this.cleanOpts);
    const copy = this.area.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('img.wu-image-uploading').forEach((i) => i.remove());
    copy.querySelectorAll('.wu-image-selected').forEach((i) => i.classList.remove('wu-image-selected'));
    const html = cleanEditorHtml(copy.innerHTML, this.doc, this.cleanOpts);
    return html === '<p><br></p>' ? '' : html;
  }

  private toEditable(html: string | null): string {
    const clean = cleanEditorHtml(html || '', this.doc, this.cleanOpts);
    return clean.trim() ? clean : '<p><br></p>';
  }

  private setContent(html: string, emit: boolean): void {
    if (!this.viewReady) {
      this.value = html;
      return;
    }
    this.area.innerHTML = this.toEditable(html);
    this.pushHistory(false);
    if (emit) this.emit('api');
  }

  /** `<b>` from the browser becomes `<strong>`, `<font>` from colours a span, and so on. */
  private normalizeMarkup(): void {
    const area = this.area;
    const rename = (from: string, to: string) =>
      area.querySelectorAll(from).forEach((el) => {
        const n = this.doc.createElement(to);
        for (const a of Array.from(el.attributes)) n.setAttribute(a.name, a.value);
        while (el.firstChild) n.appendChild(el.firstChild);
        el.replaceWith(n);
      });
    const sel = saveSelection(area);
    let changed = false;
    const renameAll = (from: string, to: string) => {
      if (area.querySelector(from)) {
        changed = true;
        rename(from, to);
      }
    };
    renameAll('b', 'strong');
    renameAll('i', 'em');
    renameAll('strike', 's');
    area.querySelectorAll<HTMLElement>('font').forEach((f) => {
      changed = true;
      const span = this.doc.createElement('span');
      const color = f.getAttribute('color');
      if (color) span.style.color = color;
      const face = f.getAttribute('face');
      if (face && face !== 'wu-marker') span.style.fontFamily = face;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
      if (!span.attributes.length) span.replaceWith(...Array.from(span.childNodes));
    });
    // Chrome's formatBlock and Enter can leave <div>s at the top level.
    Array.from(area.children).forEach((el) => {
      if (el.tagName === 'DIV') {
        changed = true;
        const p = this.doc.createElement('p');
        for (const a of Array.from(el.attributes)) p.setAttribute(a.name, a.value);
        while (el.firstChild) p.appendChild(el.firstChild);
        el.replaceWith(p);
      }
    });
    // Setting the selection again (when nothing moved) would drop a pending bold / italic at the caret.
    if (changed) restoreSelection(area, sel);
  }

  /** An empty editor holds one empty paragraph, so typing starts in a paragraph. */
  private normalizeEmpty(): void {
    const area = this.area;
    if (!area.firstChild || (area.childNodes.length === 1 && area.firstChild.nodeName === 'BR')) {
      area.innerHTML = '<p><br></p>';
      caretIn(area.firstChild!);
    }
    this.empty = isEmptyEditorHtml(area.innerHTML);
  }

  private saveRange(): void {
    const r = rangeIn(this.area);
    if (r) this.savedRange = r.cloneRange();
  }

  /** Focus back in the content with the selection it had. */
  private restore(): void {
    const area = this.area;
    // Still in the content (a toolbar press keeps focus there): use the selection as it is now. selectionchange fires
    // a task later, so the saved range may be one step behind (a shortcut right after Shift + arrow).
    const live = this.doc.activeElement === area ? rangeIn(area) : null;
    if (live) {
      this.savedRange = live.cloneRange();
      return;
    }
    if (this.doc.activeElement !== area) area.focus({ preventScroll: true });
    const r = this.savedRange;
    if (r && area.contains(r.startContainer) && area.contains(r.endContainer)) selectRange(r);
    else if (!rangeIn(area)) caretIn(area, true);
  }

  private currentCell(): HTMLTableCellElement | null {
    const r = rangeIn(this.area) || this.savedRange;
    return r ? (closestIn(r.startContainer, this.area, 'td, th') as HTMLTableCellElement | null) : null;
  }

  private syncEditable(): void {
    if (!this.viewReady) return;
    const editable = !this.locked;
    this.area.setAttribute('contenteditable', editable ? 'true' : 'false');
    if (!editable) this.selectImage(null);
  }

  private selectImage(img: HTMLImageElement | null): void {
    if (this.selectedImage === img) return;
    this.selectedImage?.classList.remove('wu-image-selected');
    this.selectedImage = img;
    img?.classList.add('wu-image-selected');
    this.placeFrame();
  }

  /** The resize frame follows the selected picture. */
  protected placeFrame(): void {
    const img = this.selectedImage;
    const frame = this.frameRef?.nativeElement;
    if (!frame) return;
    if (!img || !img.isConnected) {
      frame.style.display = 'none';
      return;
    }
    const body = frame.parentElement!.getBoundingClientRect();
    const r = img.getBoundingClientRect();
    frame.style.display = '';
    frame.style.top = `${r.top - body.top}px`;
    frame.style.left = `${r.left - body.left}px`;
    frame.style.width = `${r.width}px`;
    frame.style.height = `${r.height}px`;
  }

  private toolbarItems(): HTMLElement[] {
    const bar = this.toolbarRef?.nativeElement;
    if (!bar) return [];
    return Array.from(bar.querySelectorAll<HTMLElement>('button, select')).filter(
      (el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null && !el.closest('.wu-editor-hidden')
    );
  }

  private syncToolbarTabStops(): void {
    const items = this.toolbarItems();
    if (!items.length) return;
    const current = items.find((el) => el.getAttribute('tabindex') === '0') || items[0];
    items.forEach((el) => el.setAttribute('tabindex', el === current ? '0' : '-1'));
  }

  private toolbarButton(tool: EditorTool): HTMLElement | null {
    return this.toolbarRef?.nativeElement.querySelector(`[data-wu-tool="${tool}"]`) || null;
  }

  private fail(file: File, reason: WuEditorImageUploadErrorEvent['reason'], message: string, error?: unknown): void {
    this.onImageUploadError.emit({ file, reason, message, error });
    this.notices = [...this.notices, message];
    this.cdr.markForCheck();
    setTimeout(() => {
      this.notices = this.notices.filter((n) => n !== message);
      this.cdr.markForCheck();
    }, 6000);
  }

  private get uploadConfig(): WuEditorImageUpload {
    return { ...(this.defaults.imageUpload || {}), ...(this.imageUpload || {}) };
  }

  private get uploadMode(): 'base64' | 'upload' {
    const c = this.uploadConfig;
    return c.mode || (c.url || c.upload ? 'upload' : 'base64');
  }

  private get cleanOpts() {
    return { protocols: this.opts.link.protocols };
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  /** Sends a picture to the configured endpoint (or the app's own `upload`) and resolves with its URL. */
  private upload(file: File): Promise<string> {
    const c = this.uploadConfig;
    if (c.upload) return c.upload(file);
    if (!c.url) return Promise.reject(new Error('imageUpload.url is not set'));
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const form = new FormData();
      form.append(c.fieldName || 'file', file, file.name);
      xhr.open(c.method || 'POST', c.url!, true);
      for (const [k, v] of headerEntries(c.headers)) xhr.setRequestHeader(k, v);
      xhr.withCredentials = !!c.withCredentials;
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) return reject(new Error(`HTTP ${xhr.status}`));
        let body: unknown = xhr.responseText;
        try {
          body = JSON.parse(xhr.responseText);
        } catch {
          /* a plain-text URL */
        }
        let url: unknown;
        if (typeof c.responseUrl === 'function') url = c.responseUrl(body);
        else if (c.responseUrl) url = pathValue(body, c.responseUrl);
        else if (typeof body === 'string') url = body.trim();
        else for (const p of ['url', 'data.url', 'location', 'path', 'data.path', 'file.url']) if (!url) url = pathValue(body, p);
        if (typeof url !== 'string' || !url) return reject(new Error('No image URL in the response'));
        const full = c.baseUrl && !/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url) ? c.baseUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '') : url;
        resolve(full);
      };
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(form);
    });
  }

  private prettyHtml(html: string): string {
    return html.replace(/(<\/(p|h[1-6]|li|ul|ol|blockquote|pre|table|thead|tbody|tr)>)/g, '$1\n').replace(/(<(ul|ol|table|thead|tbody|tr)>)/g, '$1\n').trim();
  }

  // ---------- the app's own header template (Quill toolbar markup) ----------

  /** Gives `ql-*` buttons and selects of a `header` template their icons, labels and actions. */
  private wireQuillToolbar(): void {
    const bar = this.toolbarRef?.nativeElement;
    if (!bar) return;
    const wire = () => {
      bar.querySelectorAll<HTMLElement>('button[class*="ql-"], select[class*="ql-"]').forEach((el) => {
        if (el.dataset['wuWired']) return;
        el.dataset['wuWired'] = '1';
        const info = ɵquillTool(el);
        if (!info) {
          el.classList.add('wu-editor-hidden');
          return;
        }
        if (el.tagName === 'SELECT') {
          // A Quill select becomes one of our dropdown buttons; the select stays hidden.
          el.classList.add('wu-editor-hidden');
          const btn = this.doc.createElement('button');
          btn.type = 'button';
          btn.className = 'wu-editor-tool wu-editor-tool-quill' + (info.dropdown ? ' wu-editor-dropdown' : '');
          btn.setAttribute('aria-haspopup', 'true');
          btn.setAttribute('aria-label', this.toolLabel(info.tool));
          btn.title = this.toolLabel(info.tool);
          btn.dataset['wuTool'] = info.tool;
          btn.innerHTML = info.dropdown
            ? `<span class="wu-editor-dropdown-label"></span>${this.icons['chevron']}`
            : this.icons[this.toolIcon(info.tool)] || '';
          if (info.tool === 'align') btn.dataset['wuAlignIcon'] = this.toolIcon('align');
          el.insertAdjacentElement('afterend', btn);
          const values = Array.from((el as HTMLSelectElement).options).map((o) => o.value);
          btn.addEventListener('mousedown', (e) => e.preventDefault());
          btn.addEventListener('click', () =>
            this.zone.run(() => {
              // The header's select lists the blocks it offers (quotes and code have their own ql-* buttons).
              if (info.tool === 'heading') this.opts = { ...this.opts, headings: values.map((v) => Number(v) || 0), blocks: [] };
              if ((info.tool === 'color' || info.tool === 'highlight') && values.some(Boolean)) {
                const palette = values.filter(Boolean);
                this.opts = info.tool === 'color' ? { ...this.opts, colors: palette } : { ...this.opts, highlights: palette };
              }
              if (info.tool === 'align') this.opts = { ...this.opts, alignments: values.map((v) => (v || 'left') as 'left') };
              this.runTool(info.tool, { currentTarget: btn } as unknown as Event);
            })
          );
          return;
        }
        const b = el as HTMLButtonElement;
        b.type = 'button';
        b.classList.add('wu-editor-tool');
        b.dataset['wuTool'] = info.tool;
        if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', this.toolLabel(info.tool));
        if (!b.title) b.title = this.toolLabel(info.tool);
        if (info.heading) {
          b.dataset['wuHeading'] = String(info.heading);
          if (!b.innerHTML.trim()) b.innerHTML = `<span class="wu-editor-heading-mark">H${info.heading}</span>`;
          b.setAttribute('aria-label', this.headingLabel(info.heading));
        }
        if (!b.innerHTML.trim()) b.innerHTML = this.icons[info.tool] || '';
        b.addEventListener('mousedown', (e) => e.preventDefault());
        b.addEventListener('click', () =>
          this.zone.run(() => {
            if (info.heading) this.pickHeading(this.state.heading === info.heading ? 0 : info.heading);
            else this.runTool(info.tool, { currentTarget: b } as unknown as Event);
          })
        );
      });
      this.syncQuillToolbar();
      this.syncToolbarTabStops();
    };
    wire();
    // Templates with *ngIf inside re-render: wire new buttons as they appear.
    const win = this.doc.defaultView as (Window & typeof globalThis) | null;
    if (win?.MutationObserver) {
      // Only new, unwired controls matter; our own label updates must not set it off again.
      this.quillObserver = new win.MutationObserver(() => {
        if (bar.querySelector('button[class*="ql-"]:not([data-wu-wired]), select[class*="ql-"]:not([data-wu-wired])')) wire();
      });
      this.quillObserver.observe(bar, { childList: true, subtree: true });
    }
  }

  private syncQuillToolbar(): void {
    const bar = this.toolbarRef?.nativeElement;
    if (!bar || !this.headerTemplate) return;
    bar.querySelectorAll<HTMLElement>('[data-wu-tool]').forEach((el) => {
      const tool = el.dataset['wuTool'] as EditorTool;
      const level = Number(el.dataset['wuHeading'] || 0);
      const on = level ? this.state.heading === level : this.isOn(tool);
      el.classList.toggle('ql-active', on);
      el.classList.toggle('wu-editor-tool-on', on);
      if (el.tagName === 'BUTTON' && (level || !this.hasMenu(tool))) el.setAttribute('aria-pressed', String(on));
      const off = this.isDisabled(tool);
      if ((el as HTMLButtonElement).disabled !== off) (el as HTMLButtonElement).disabled = off;
      // The align button shows the current alignment.
      const alignIcon = el.dataset['wuAlignIcon'];
      if (alignIcon && alignIcon !== this.toolIcon('align')) {
        el.dataset['wuAlignIcon'] = this.toolIcon('align');
        el.innerHTML = this.icons[this.toolIcon('align')] || '';
      }
      const label = el.querySelector('.wu-editor-dropdown-label');
      const text = this.dropdownLabel(tool);
      if (label && label.textContent !== text) label.textContent = text;
    });
  }
}
