/**
 * Framework-free parts of wu-editor: the toolbar vocabulary and its presets, per-tool options, the undo history,
 * and helpers for the HTML value. The editing itself (DOM, selection) lives in the Angular entry.
 */

/** Every tool the toolbar can show. */
export type EditorTool =
  | 'undo'
  | 'redo'
  | 'heading'
  | 'fontSize'
  | 'fontFamily'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'subscript'
  | 'superscript'
  | 'code'
  | 'color'
  | 'highlight'
  | 'bulletList'
  | 'orderedList'
  | 'indent'
  | 'outdent'
  | 'align'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'link'
  | 'image'
  | 'table'
  | 'blockquote'
  | 'codeBlock'
  | 'hr'
  | 'clear'
  | 'source'
  | 'fullscreen';

export const EDITOR_TOOLS: readonly EditorTool[] = [
  'undo',
  'redo',
  'heading',
  'fontSize',
  'fontFamily',
  'bold',
  'italic',
  'underline',
  'strike',
  'subscript',
  'superscript',
  'code',
  'color',
  'highlight',
  'bulletList',
  'orderedList',
  'indent',
  'outdent',
  'align',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  'link',
  'image',
  'table',
  'blockquote',
  'codeBlock',
  'hr',
  'clear',
  'source',
  'fullscreen',
];

export type EditorToolbarPreset = 'basic' | 'standard' | 'full' | 'none';

/**
 * What the `toolbar` input takes: a preset name, a flat list with `'|'` between groups
 * (`['bold', 'italic', '|', 'bulletList', 'orderedList']`), or a list of groups (`[['bold', 'italic'], ['link']]`).
 */
export type EditorToolbar = EditorToolbarPreset | ReadonlyArray<EditorTool | '|'> | ReadonlyArray<ReadonlyArray<EditorTool>>;

export const EDITOR_TOOLBARS: Record<Exclude<EditorToolbarPreset, 'none'>, EditorTool[][]> = {
  basic: [['bold', 'italic', 'underline'], ['bulletList', 'orderedList'], ['link'], ['clear']],
  standard: [
    ['undo', 'redo'],
    ['heading'],
    ['bold', 'italic', 'underline', 'strike'],
    ['color', 'highlight'],
    ['bulletList', 'orderedList', 'align'],
    ['link', 'image', 'table', 'blockquote'],
    ['clear'],
  ],
  full: [
    ['undo', 'redo'],
    ['heading', 'fontSize', 'fontFamily'],
    ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'code'],
    ['color', 'highlight'],
    ['bulletList', 'orderedList', 'outdent', 'indent', 'align'],
    ['link', 'image', 'table', 'blockquote', 'codeBlock', 'hr'],
    ['clear', 'source', 'fullscreen'],
  ],
};

const isTool = (t: unknown): t is EditorTool => typeof t === 'string' && (EDITOR_TOOLS as readonly string[]).includes(t);

/** The toolbar as groups of known tools: presets expanded, `'|'` splitting groups, unknown names and empty groups left out. */
export function editorToolbarGroups(toolbar: EditorToolbar | null | undefined, fallback: EditorToolbarPreset = 'standard'): EditorTool[][] {
  const t = toolbar ?? fallback;
  if (t === 'none') return [];
  if (typeof t === 'string') return (EDITOR_TOOLBARS[t as Exclude<EditorToolbarPreset, 'none'>] || EDITOR_TOOLBARS.standard).map((g) => g.slice());
  const groups: EditorTool[][] = [];
  let current: EditorTool[] = [];
  for (const entry of t as ReadonlyArray<unknown>) {
    if (Array.isArray(entry)) {
      if (current.length) groups.push(current);
      current = [];
      const g = entry.filter(isTool);
      if (g.length) groups.push(g);
    } else if (entry === '|') {
      if (current.length) groups.push(current);
      current = [];
    } else if (isTool(entry)) {
      current.push(entry);
    }
  }
  if (current.length) groups.push(current);
  return groups;
}

export interface EditorOption {
  label: string;
  value: string;
}

/** Fine-grained settings of each tool (`[toolOptions]`), all optional. */
export interface EditorToolOptions {
  /** Block styles of the heading menu: 0 = paragraph, 1–6 = heading levels. Default all: [0, 1, 2, 3, 4, 5, 6]. */
  headings?: number[];
  /** Other block styles at the end of the same menu. Default both: `['blockquote', 'codeBlock']`; `[]` for none. */
  blocks?: Array<'blockquote' | 'codeBlock'>;
  /** Font sizes (CSS sizes). Default small / normal / large / huge as 0.75em, 1em, 1.5em, 2.5em. */
  fontSizes?: EditorOption[];
  /** Font families (CSS font-family values). */
  fontFamilies?: EditorOption[];
  /** Text colours offered by the colour tool. */
  colors?: string[];
  /** Highlight colours. */
  highlights?: string[];
  /** Alignment choices of the align menu. Default all four. */
  alignments?: Array<'left' | 'center' | 'right' | 'justify'>;
  /** Table insert grid size and whether new tables get a header row. */
  table?: { rows?: number; cols?: number; headerRow?: boolean };
  /** Links: open in a new tab by default; extra protocols allowed besides http(s), mailto, tel. */
  link?: { newTab?: boolean; protocols?: string[] };
}

export const EDITOR_COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#cccccc',
  '#ffffff',
  '#e03131',
  '#f08c00',
  '#f5c400',
  '#2f9e44',
  '#1971c2',
  '#6741d9',
  '#c2255c',
  '#0c8599',
  '#5c940d',
  '#862e9c',
  '#a61e4d',
  '#364fc7',
];

export const EDITOR_HIGHLIGHTS = ['#fff3bf', '#ffec99', '#d3f9d8', '#c5f6fa', '#d0ebff', '#e5dbff', '#ffdeeb', '#ffe8cc', '#f1f3f5'];

/** Options with every default filled in. */
export function editorToolOptions(o: EditorToolOptions | null | undefined): Required<Omit<EditorToolOptions, 'table' | 'link'>> & {
  table: { rows: number; cols: number; headerRow: boolean };
  link: { newTab: boolean; protocols: string[] };
} {
  const v = o || {};
  return {
    headings: v.headings && v.headings.length ? v.headings.filter((h) => h >= 0 && h <= 6) : [0, 1, 2, 3, 4, 5, 6],
    blocks: Array.isArray(v.blocks) ? v.blocks.filter((b) => b === 'blockquote' || b === 'codeBlock') : ['blockquote', 'codeBlock'],
    fontSizes: v.fontSizes && v.fontSizes.length ? v.fontSizes : [],
    fontFamilies: v.fontFamilies && v.fontFamilies.length ? v.fontFamilies : [],
    colors: v.colors && v.colors.length ? v.colors : EDITOR_COLORS,
    highlights: v.highlights && v.highlights.length ? v.highlights : EDITOR_HIGHLIGHTS,
    alignments: v.alignments && v.alignments.length ? v.alignments : ['left', 'center', 'right', 'justify'],
    table: { rows: v.table?.rows ?? 8, cols: v.table?.cols ?? 8, headerRow: v.table?.headerRow ?? true },
    link: { newTab: v.link?.newTab ?? true, protocols: v.link?.protocols ?? [] },
  };
}

/** Font sizes Quill offered (`ql-size-small` …), the defaults of the font-size tool. */
export const EDITOR_FONT_SIZES: EditorOption[] = [
  { label: 'small', value: '0.75em' },
  { label: 'normal', value: '' },
  { label: 'large', value: '1.5em' },
  { label: 'huge', value: '2.5em' },
];

/**
 * Whether a link is safe to keep: http(s), mailto, tel, relative paths and anchors, plus any extra protocols the
 * app allows. `javascript:` and the like are not.
 */
export function safeEditorUrl(url: string, extra: readonly string[] = []): boolean {
  const u = String(url || '').trim();
  if (!u) return false;
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(u.replace(/[\u0000-\u001f\s]/g, ''));
  if (!m) return true;
  const scheme = m[1].toLowerCase();
  return ['http', 'https', 'mailto', 'tel'].includes(scheme) || extra.map((p) => p.toLowerCase().replace(/:$/, '')).includes(scheme);
}

/** Whether an image source is allowed: http(s), relative, blob, or an image data URL. */
export function safeEditorImage(src: string): boolean {
  const u = String(src || '').trim();
  if (!u) return false;
  if (/^data:/i.test(u)) return /^data:image\/(png|jpe?g|gif|webp|svg\+xml|bmp|avif);/i.test(u);
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(u);
  return !m || ['http', 'https', 'blob'].includes(m[1].toLowerCase());
}

/** An editor value that holds nothing a reader would see: no text, no image, table or rule. */
export function isEmptyEditorHtml(html: string | null | undefined): boolean {
  if (!html) return true;
  if (/<(img|table|hr|iframe|video)\b/i.test(html)) return false;
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/[\s​﻿]+/g, '');
  return text.length === 0;
}

/** Plain text of an HTML value, blocks on their own lines (for `textValue`, counters and search). */
export function editorHtmlToText(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|blockquote|pre|tr)>/gi, '\n')
    .replace(/<\/(td|th)>/gi, '\t')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Words and characters of a text, counting Thai runs (which have no spaces) by character. */
export function editorCounts(text: string): { characters: number; words: number } {
  const t = text.replace(/\s+/g, ' ').trim();
  if (!t) return { characters: 0, words: 0 };
  const words = t.split(' ').filter(Boolean).length;
  return { characters: [...t.replace(/\s/g, '')].length, words };
}

/** One step of the undo history: the HTML and where the caret was (paths of node indexes from the root). */
export interface EditorSnapshot {
  html: string;
  selection?: { start: number[]; startOffset: number; end: number[]; endOffset: number } | null;
}

/**
 * Undo / redo for wu-editor. Typing is grouped: snapshots pushed within `mergeMs` of each other with `merge: true`
 * replace the newest step instead of adding one, so one undo removes a burst of typing.
 */
export class EditorHistory {
  private stack: EditorSnapshot[] = [];
  private index = -1;
  private lastPush = 0;

  constructor(
    private readonly limit = 200,
    private readonly mergeMs = 800
  ) {}

  get canUndo(): boolean {
    return this.index > 0;
  }
  get canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }
  get current(): EditorSnapshot | null {
    return this.stack[this.index] ?? null;
  }

  /** Starts over from one state (a new value from the app). */
  reset(s: EditorSnapshot): void {
    this.stack = [s];
    this.index = 0;
    this.lastPush = 0;
  }

  /** Records a state after a change. Returns false when nothing changed. */
  push(s: EditorSnapshot, opts: { merge?: boolean; now?: number } = {}): boolean {
    const now = opts.now ?? Date.now();
    const cur = this.stack[this.index];
    if (cur && cur.html === s.html) {
      cur.selection = s.selection;
      return false;
    }
    this.stack = this.stack.slice(0, this.index + 1);
    if (opts.merge && this.index > 0 && now - this.lastPush < this.mergeMs && this.mergeable) {
      this.stack[this.index] = s;
    } else {
      this.stack.push(s);
      this.index = this.stack.length - 1;
    }
    this.mergeable = !!opts.merge;
    this.lastPush = now;
    if (this.stack.length > this.limit) {
      const drop = this.stack.length - this.limit;
      this.stack.splice(0, drop);
      this.index -= drop;
    }
    return true;
  }

  /** Updates the caret of the current step (so undo returns to where the user was). */
  touch(selection: EditorSnapshot['selection']): void {
    const cur = this.stack[this.index];
    if (cur) cur.selection = selection;
  }

  undo(): EditorSnapshot | null {
    if (!this.canUndo) return null;
    this.index--;
    this.mergeable = false;
    return this.stack[this.index];
  }

  redo(): EditorSnapshot | null {
    if (!this.canRedo) return null;
    this.index++;
    this.mergeable = false;
    return this.stack[this.index];
  }

  private mergeable = false;
}
