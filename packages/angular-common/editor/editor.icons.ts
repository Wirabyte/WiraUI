import type { EditorTool } from 'wiraui/core';

const svg = (body: string, fill = false) =>
  `<svg class="wu-editor-icon" viewBox="0 0 20 20" ${fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true" focusable="false">${body}</svg>`;

/** The editor's built-in icons (inline SVG, they follow the text colour). */
export const ɵWU_EDITOR_ICONS: Record<string, string> = {
  undo: svg('<path d="M7.5 5 4 8.5 7.5 12"/><path d="M4 8.5h8a4 4 0 0 1 0 8h-2"/>'),
  redo: svg('<path d="M12.5 5 16 8.5 12.5 12"/><path d="M16 8.5H8a4 4 0 0 0 0 8h2"/>'),
  bold: svg('<path d="M6 4h5a3.25 3.25 0 0 1 0 6.5H6zM6 10.5h6a3.25 3.25 0 0 1 0 6.5H6z" stroke-width="2"/>'),
  italic: svg('<path d="M12.5 4h-5M12.5 16h-5M11.25 4 8.75 16"/>'),
  underline: svg('<path d="M6 3.5v6a4 4 0 0 0 8 0v-6M5 17h10"/>'),
  strike: svg('<path d="M4 10h12M13.5 6.25C13 4.9 11.7 4 10 4 8 4 6.5 5.1 6.5 6.6c0 1.2.8 2 2.5 2.6M7 13.6c.4 1.4 1.7 2.4 3.3 2.4 2.1 0 3.6-1.1 3.6-2.7 0-.7-.2-1.2-.6-1.7"/>'),
  subscript: svg('<path d="m3.5 5 7 9M10.5 5l-7 9M13.5 12.5c0-.9.7-1.5 1.6-1.5s1.6.6 1.6 1.4c0 1.4-3.2 2.4-3.2 4.1h3.3"/>'),
  superscript: svg('<path d="m3.5 6 7 9M10.5 6l-7 9M13.5 4.5c0-.9.7-1.5 1.6-1.5s1.6.6 1.6 1.4c0 1.4-3.2 2.4-3.2 4.1h3.3"/>'),
  code: svg('<path d="M7.5 6 3.5 10l4 4M12.5 6l4 4-4 4"/>'),
  color: svg('<path d="m5.5 13.5 4.5-10 4.5 10M7.2 10h5.6"/><path d="M4 16.75h12" stroke-width="2.5"/>'),
  highlight: svg('<path d="m11.5 4.5 4 4-6 6H5.5v-4z"/><path d="m9.5 6.5 4 4M3.5 17h13"/>'),
  bulletList: svg('<path d="M8 5.5h8.5M8 10h8.5M8 14.5h8.5"/><circle cx="4.25" cy="5.5" r=".9" fill="currentColor"/><circle cx="4.25" cy="10" r=".9" fill="currentColor"/><circle cx="4.25" cy="14.5" r=".9" fill="currentColor"/>'),
  orderedList: svg('<path d="M8.5 5.5h8M8.5 10h8M8.5 14.5h8M3.5 4.25l1-.75v4M3.25 12.5c.2-.6.7-1 1.3-1 .7 0 1.2.5 1.2 1.1 0 1-2.5 1.6-2.5 3h2.6" stroke-width="1.3"/>'),
  indent: svg('<path d="M9 5.5h7.5M9 10h7.5M9 14.5h7.5M3.5 7.5 6 10l-2.5 2.5"/>'),
  outdent: svg('<path d="M9 5.5h7.5M9 10h7.5M9 14.5h7.5M6 7.5 3.5 10 6 12.5"/>'),
  alignLeft: svg('<path d="M3.5 5h13M3.5 8.33h8.5M3.5 11.67h13M3.5 15h8.5"/>'),
  alignCenter: svg('<path d="M3.5 5h13M5.75 8.33h8.5M3.5 11.67h13M5.75 15h8.5"/>'),
  alignRight: svg('<path d="M3.5 5h13M8 8.33h8.5M3.5 11.67h13M8 15h8.5"/>'),
  alignJustify: svg('<path d="M3.5 5h13M3.5 8.33h13M3.5 11.67h13M3.5 15h13"/>'),
  link: svg('<path d="M8.5 11.5a3.25 3.25 0 0 0 4.6 0l2.3-2.3a3.25 3.25 0 0 0-4.6-4.6l-.9.9"/><path d="M11.5 8.5a3.25 3.25 0 0 0-4.6 0l-2.3 2.3a3.25 3.25 0 0 0 4.6 4.6l.9-.9"/>'),
  unlink: svg('<path d="M8.5 11.5a3.25 3.25 0 0 0 4.6 0l2.3-2.3a3.25 3.25 0 0 0-4.6-4.6l-.9.9M11.5 8.5a3.25 3.25 0 0 0-4.6 0l-2.3 2.3a3.25 3.25 0 0 0 4.6 4.6l.9-.9M3.5 3.5l13 13"/>'),
  external: svg('<path d="M11 4h5v5M16 4l-7 7M14 11.5V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3.5"/>'),
  edit: svg('<path d="m12.5 4.5 3 3L7 16H4v-3z"/>'),
  image: svg('<rect x="3" y="4" width="14" height="12" rx="1.5"/><circle cx="7.5" cy="8.25" r="1.25"/><path d="m3.5 14 4-4 3 3 2-2 4 4"/>'),
  table: svg('<rect x="3" y="4" width="14" height="12" rx="1.5"/><path d="M3 8h14M3 12h14M8 8v8M12.5 8v8"/>'),
  blockquote: svg('<path d="M4 10.5V14h3.5v-3.5H5.5c0-2 .7-3.2 2-4M11 10.5V14h3.5v-3.5h-2c0-2 .7-3.2 2-4"/>'),
  codeBlock: svg('<rect x="3" y="3.5" width="14" height="13" rx="1.5"/><path d="M8 8 6 10l2 2M12 8l2 2-2 2"/>'),
  hr: svg('<path d="M3 10h14M6 6h8M6 14h8" stroke-dasharray="0"/>'),
  clear: svg('<path d="M6 4h8M10 4l-3 12M4 16h5M12.5 11.5l4 4M16.5 11.5l-4 4"/>'),
  source: svg('<path d="M7 6 3.5 10 7 14M13 6l3.5 4-3.5 4M11 4.5l-2 11"/>'),
  fullscreen: svg('<path d="M4 8V4h4M12 4h4v4M16 12v4h-4M8 16H4v-4"/>'),
  exitFullscreen: svg('<path d="M8 4v4H4M16 8h-4V4M12 16v-4h4M4 12h4v4"/>'),
  heading: svg('<path d="M5 4v12M15 4v12M5 10h10"/>'),
  fontSize: svg('<path d="m2.5 15 4-10 4 10M4 11.5h5M12 15l2.75-6.5L17.5 15M12.9 13h3.7"/>'),
  fontFamily: svg('<path d="M5 15 9 4h2l4 11M6.5 11h7"/>'),
  chevron: '<svg class="wu-editor-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m4.5 6.5 3.5 3.5 3.5-3.5"/></svg>',
  trash: svg('<path d="M4 6h12M8 6V4h4v2M5.5 6l.7 10h7.6l.7-10M8.5 9v4.5M11.5 9v4.5"/>'),
  check: svg('<path d="m4.5 10.5 3.5 3.5 7.5-8"/>'),
  upload: svg('<path d="M10 13V4M6.5 7.5 10 4l3.5 3.5M4 13v3h12v-3"/>'),
  rowAbove: svg('<rect x="3" y="9" width="14" height="7" rx="1"/><path d="M10 2.5v5M7.5 5h5"/>'),
  rowBelow: svg('<rect x="3" y="4" width="14" height="7" rx="1"/><path d="M10 12.5v5M7.5 15h5"/>'),
  colLeft: svg('<rect x="9" y="3" width="7" height="14" rx="1"/><path d="M2.5 10h5M5 7.5v5"/>'),
  colRight: svg('<rect x="4" y="3" width="7" height="14" rx="1"/><path d="M12.5 10h5M15 7.5v5"/>'),
  deleteRow: svg('<rect x="3" y="7" width="14" height="6" rx="1"/><path d="m8 8.5 4 3M12 8.5l-4 3"/>'),
  deleteCol: svg('<rect x="7" y="3" width="6" height="14" rx="1"/><path d="m8.5 8 3 4M11.5 8l-3 4"/>'),
  headerRow: svg('<rect x="3" y="4" width="14" height="12" rx="1.5"/><path d="M3 8h14"/><path d="M3.75 4.75h12.5v2.5H3.75z" fill="currentColor" stroke="none"/>'),
  mergeRight: svg('<rect x="3" y="5" width="14" height="10" rx="1"/><path d="M6 10h8M11.5 7.5 14 10l-2.5 2.5"/>'),
  mergeDown: svg('<rect x="5" y="3" width="10" height="14" rx="1"/><path d="M10 6v8M7.5 11.5 10 14l2.5-2.5"/>'),
  splitCell: svg('<rect x="3" y="5" width="14" height="10" rx="1"/><path d="M10 5v10"/>'),
  imageInline: svg('<rect x="7" y="6" width="6" height="5" rx="1"/><path d="M3 8.5h2.5M14.5 8.5H17M3 14h14"/>'),
  imageLeft: svg('<rect x="3" y="5" width="7" height="6" rx="1"/><path d="M12 6h5M12 9h5M3 14h14"/>'),
  imageCenter: svg('<rect x="6.5" y="4" width="7" height="7" rx="1"/><path d="M3 14h14M5 17h10"/>'),
  imageRight: svg('<rect x="10" y="5" width="7" height="6" rx="1"/><path d="M3 6h5M3 9h5M3 14h14"/>'),
};

/** What a Quill toolbar control in an app's `header` template stands for. */
export interface ɵWuQuillTool {
  tool: EditorTool;
  /** Drawn as a labelled dropdown (block style, size, font). */
  dropdown?: boolean;
  /** A heading button with a fixed level (`<button class="ql-header" value="2">`). */
  heading?: number;
}

/** Reads `ql-bold`, `ql-list` + value, `select.ql-header` and the rest; null for controls the editor does not offer. */
export function ɵquillTool(el: HTMLElement): ɵWuQuillTool | null {
  const has = (c: string) => el.classList.contains(c);
  const value = (el.getAttribute('value') || '').trim();
  const select = el.tagName === 'SELECT';
  if (has('ql-bold')) return { tool: 'bold' };
  if (has('ql-italic')) return { tool: 'italic' };
  if (has('ql-underline')) return { tool: 'underline' };
  if (has('ql-strike')) return { tool: 'strike' };
  if (has('ql-script')) return { tool: value === 'super' ? 'superscript' : 'subscript' };
  if (has('ql-header')) return select ? { tool: 'heading', dropdown: true } : { tool: 'heading', heading: Number(value) || 1 };
  if (has('ql-size')) return { tool: 'fontSize', dropdown: true };
  if (has('ql-font')) return { tool: 'fontFamily', dropdown: true };
  if (has('ql-color')) return { tool: 'color' };
  if (has('ql-background')) return { tool: 'highlight' };
  if (has('ql-list')) return { tool: value === 'ordered' ? 'orderedList' : 'bulletList' };
  if (has('ql-indent')) return { tool: value === '-1' ? 'outdent' : 'indent' };
  if (has('ql-align')) {
    if (select) return { tool: 'align' };
    return { tool: value === 'center' ? 'alignCenter' : value === 'right' ? 'alignRight' : value === 'justify' ? 'alignJustify' : 'alignLeft' };
  }
  if (has('ql-blockquote')) return { tool: 'blockquote' };
  if (has('ql-code-block')) return { tool: 'codeBlock' };
  if (has('ql-code')) return { tool: 'code' };
  if (has('ql-link')) return { tool: 'link' };
  if (has('ql-image')) return { tool: 'image' };
  if (has('ql-clean')) return { tool: 'clear' };
  return null;
}
