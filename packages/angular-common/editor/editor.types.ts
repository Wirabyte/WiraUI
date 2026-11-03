import { InjectionToken, Provider } from '@angular/core';
import type { EditorTool, EditorToolbar, EditorToolOptions } from '@wirabyte/ui/core';

export type { EditorTool, EditorToolbar, EditorToolOptions };

/** `(onTextChange)`: the value as HTML (null when empty, as before) and as plain text. */
export interface WuEditorTextChangeEvent {
  htmlValue: string | null;
  textValue: string;
  /** Kept for templates moving over; there is no delta model. */
  delta: null;
  source: 'user' | 'api';
}

/** `(onSelectionChange)`: character offsets of the selection in the text, null when the editor lost it. */
export interface WuEditorSelectionChangeEvent {
  range: { index: number; length: number } | null;
  oldRange: { index: number; length: number } | null;
  source: 'user';
}

export interface WuEditorInitEvent {
  editor: WuEditorApi;
}

export interface WuEditorImageUploadErrorEvent {
  file: File;
  reason: 'size' | 'type' | 'upload';
  message: string;
  error?: unknown;
}

/**
 * How pictures get into the content: embedded as base64 data URLs, or uploaded and linked by URL.
 * With neither `url` nor `upload` set, pictures are embedded.
 */
export interface WuEditorImageUpload {
  /** `'base64'` embeds the picture in the HTML; `'upload'` sends it to `url` (or `upload`) and links it. */
  mode?: 'base64' | 'upload';
  /** Endpoint that takes the file as multipart form data and answers with JSON holding the picture's URL. */
  url?: string;
  /** Form field of the file. Default `file`. */
  fieldName?: string;
  method?: 'POST' | 'PUT';
  /** Request headers: Angular `HttpHeaders` or a plain object. */
  headers?: unknown;
  withCredentials?: boolean;
  /** Where the URL is in the JSON answer: a path (`'url'`, `'data.url'`, `'file.path'`) or a function. Default tries `url`, `data.url`, `location`, `path`. */
  responseUrl?: string | ((response: unknown) => string | null | undefined);
  /** Joined in front of a relative URL from the server (`https://cdn.example.com/`). */
  baseUrl?: string;
  /** Largest picture in bytes. */
  maxSize?: number;
  /** Picture types allowed. Default `image/png, image/jpeg, image/gif, image/webp`. */
  accept?: string;
  /** The app uploads the file itself and resolves with its URL. Wins over `url`. */
  upload?: (file: File) => Promise<string>;
}

/** App-wide defaults for every wu-editor: `provideEditorOptions({ imageUpload: { url: '/api/upload' } })`. */
export interface WuEditorOptions {
  toolbar?: EditorToolbar;
  toolOptions?: EditorToolOptions;
  imageUpload?: WuEditorImageUpload;
}

export const WU_EDITOR_OPTIONS = new InjectionToken<WuEditorOptions>('WU_EDITOR_OPTIONS');

export function provideEditorOptions(options: WuEditorOptions): Provider {
  return { provide: WU_EDITOR_OPTIONS, useValue: options };
}

/**
 * What `getEditor()` (and `getQuill()`, for code moving over) returns: the calls apps make on the editor from code.
 */
export interface WuEditorApi {
  readonly root: HTMLElement;
  getHTML(): string;
  getSemanticHTML(): string;
  getText(): string;
  getLength(): number;
  setHTML(html: string): void;
  insertHTML(html: string): void;
  insertText(text: string): void;
  focus(): void;
  blur(): void;
  hasFocus(): boolean;
  enable(enabled?: boolean): void;
  disable(): void;
  undo(): void;
  redo(): void;
  /** `editor.clipboard.dangerouslyPasteHTML(html)` as before; the HTML is cleaned all the same. */
  readonly clipboard: { dangerouslyPasteHTML(indexOrHtml: number | string, html?: string): void };
}

/** The panels a tool opens. */
export type WuEditorPanel = 'heading' | 'fontSize' | 'fontFamily' | 'color' | 'highlight' | 'align' | 'link' | 'image' | 'table' | 'tableMenu' | 'tableBar' | 'imageMenu' | 'linkMenu';
