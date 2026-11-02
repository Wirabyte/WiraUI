import { EditorSnapshot, safeEditorImage, safeEditorUrl } from 'wiraui/core';

/**
 * DOM helpers of wu-editor, free of Angular: selection save / restore, the HTML cleaner used for values, pastes and
 * drops, block lookups and the table operations.
 */

export const TEXT_BLOCKS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'LI', 'DIV', 'TD', 'TH'];
const BLOCK_SET = new Set([...TEXT_BLOCKS, 'UL', 'OL', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'HR', 'FIGURE']);

export function isBlock(node: Node | null | undefined): node is HTMLElement {
  return !!node && node.nodeType === 1 && BLOCK_SET.has((node as Element).tagName);
}

// ---------- selection ----------

export function nodePath(root: Node, node: Node): number[] | null {
  const path: number[] = [];
  let n: Node | null = node;
  while (n && n !== root) {
    const parent: Node | null = n.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, n));
    n = parent;
  }
  return n === root ? path : null;
}

export function nodeAt(root: Node, path: number[]): Node | null {
  let n: Node | null = root;
  for (const i of path) {
    if (!n || !n.childNodes[i]) return null;
    n = n.childNodes[i];
  }
  return n;
}

/** The selection's range when it is inside `root`. */
export function rangeIn(root: HTMLElement): Range | null {
  const sel = root.ownerDocument.getSelection();
  if (!sel || !sel.rangeCount) return null;
  const r = sel.getRangeAt(0);
  return root.contains(r.commonAncestorContainer) ? r : null;
}

export function saveSelection(root: HTMLElement): EditorSnapshot['selection'] {
  const r = rangeIn(root);
  if (!r) return null;
  const start = nodePath(root, r.startContainer);
  const end = nodePath(root, r.endContainer);
  return start && end ? { start, startOffset: r.startOffset, end, endOffset: r.endOffset } : null;
}

export function restoreSelection(root: HTMLElement, s: EditorSnapshot['selection']): boolean {
  if (!s) return false;
  const a = nodeAt(root, s.start);
  const b = nodeAt(root, s.end);
  if (!a || !b) return false;
  const len = (n: Node) => (n.nodeType === 3 ? (n as Text).length : n.childNodes.length);
  const range = root.ownerDocument.createRange();
  try {
    range.setStart(a, Math.min(s.startOffset, len(a)));
    range.setEnd(b, Math.min(s.endOffset, len(b)));
  } catch {
    return false;
  }
  selectRange(range);
  return true;
}

export function selectRange(range: Range): void {
  const sel = range.startContainer.ownerDocument?.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

/** Puts the caret at the start (or end) of a node. */
export function caretIn(node: Node, atEnd = false): void {
  const doc = node.ownerDocument;
  if (!doc) return;
  const r = doc.createRange();
  r.selectNodeContents(node);
  r.collapse(!atEnd);
  selectRange(r);
}

export function closestIn(node: Node | null, root: HTMLElement, selector: string): HTMLElement | null {
  let el: Element | null = node ? (node.nodeType === 1 ? (node as Element) : node.parentElement) : null;
  while (el && el !== root) {
    if (el.matches(selector)) return el as HTMLElement;
    el = el.parentElement;
  }
  return null;
}

/** The innermost text block holding a node (paragraph, heading, list item, cell …). */
export function blockOf(node: Node | null, root: HTMLElement): HTMLElement | null {
  let el: Element | null = node ? (node.nodeType === 1 ? (node as Element) : node.parentElement) : null;
  while (el && el !== root) {
    if (TEXT_BLOCKS.includes(el.tagName)) return el as HTMLElement;
    el = el.parentElement;
  }
  return null;
}

/** Text blocks the range touches, in document order (cells and list items count; their wrappers do not). */
export function blocksIn(root: HTMLElement, range: Range): HTMLElement[] {
  const out: HTMLElement[] = [];
  const add = (b: HTMLElement | null) => {
    if (b && !out.includes(b)) out.push(b);
  };
  add(blockOf(range.startContainer, root));
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let n = walker.nextNode() as HTMLElement | null;
  while (n) {
    if (TEXT_BLOCKS.includes(n.tagName) && range.intersectsNode(n) && !n.querySelector(TEXT_BLOCKS.join(','))) add(n);
    n = walker.nextNode() as HTMLElement | null;
  }
  add(blockOf(range.endContainer, root));
  return out.filter((b) => !(range.collapsed && b !== blockOf(range.startContainer, root)));
}

// ---------- class helpers (Quill-compatible class names, so saved HTML keeps working) ----------

/** Replaces the class matching `prefix` (e.g. `ql-align-`) with `prefix + value`, or removes it when value is empty. */
export function setPrefixedClass(el: Element, prefix: string, value: string | null): void {
  for (const c of Array.from(el.classList)) if (c.startsWith(prefix)) el.classList.remove(c);
  if (value) el.classList.add(prefix + value);
  if (!el.classList.length) el.removeAttribute('class');
}

export function prefixedClass(el: Element | null, prefix: string): string | null {
  if (!el) return null;
  for (const c of Array.from(el.classList)) if (c.startsWith(prefix)) return c.slice(prefix.length);
  return null;
}

// ---------- the cleaner ----------

const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'META', 'LINK', 'TITLE', 'HEAD', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'OPTION', 'NOSCRIPT', 'TEMPLATE', 'CANVAS', 'VIDEO', 'AUDIO', 'SOURCE', 'XML']);
const ALLOWED: Record<string, string[]> = {
  P: ['class', 'style'],
  H1: ['class', 'style'],
  H2: ['class', 'style'],
  H3: ['class', 'style'],
  H4: ['class', 'style'],
  H5: ['class', 'style'],
  H6: ['class', 'style'],
  BLOCKQUOTE: ['class', 'style'],
  PRE: ['class', 'spellcheck'],
  CODE: [],
  STRONG: [],
  EM: [],
  U: [],
  S: [],
  SUB: [],
  SUP: [],
  BR: [],
  HR: [],
  SPAN: ['class', 'style'],
  A: ['href', 'target', 'rel', 'title'],
  UL: ['class'],
  OL: ['class', 'start', 'type'],
  LI: ['class', 'style'],
  IMG: ['src', 'alt', 'width', 'height', 'class', 'title'],
  TABLE: ['class', 'style'],
  THEAD: [],
  TBODY: [],
  TFOOT: [],
  TR: [],
  TH: ['colspan', 'rowspan', 'class', 'style'],
  TD: ['colspan', 'rowspan', 'class', 'style'],
  COLGROUP: [],
  COL: ['width', 'span', 'style'],
  CAPTION: [],
  FIGURE: ['class'],
  FIGCAPTION: [],
};
const RENAME: Record<string, string> = { B: 'STRONG', I: 'EM', STRIKE: 'S', DEL: 'S', INS: 'U', DIV: 'P', H7: 'P', ARTICLE: 'P', SECTION: 'P' };
const INLINE_TAGS = new Set(['STRONG', 'EM', 'U', 'S', 'SUB', 'SUP', 'CODE', 'A']);
const STYLE_PROPS = ['color', 'background-color', 'text-align', 'font-size', 'font-family', 'width', 'margin-left', 'padding-left'];
const CLASS_OK = /^(ql-(align|indent|size|font|direction)-[\w-]+|ql-syntax|wu-image-(left|center|right|inline)|wu-editor-table)$/;

export interface CleanOptions {
  /** Extra link protocols to keep besides http(s), mailto and tel. */
  protocols?: readonly string[];
}

/**
 * Cleans HTML for the editor: only the tags and attributes it understands, safe links and images, a few inline styles
 * (colours, alignment, size, font, image width). Pastes from Word, Google Docs and web pages lose their own markup;
 * values saved by Quill keep their `ql-*` classes. Returns the clean HTML.
 */
export function cleanEditorHtml(html: string, doc: Document, o: CleanOptions = {}): string {
  const tpl = doc.createElement('template');
  tpl.innerHTML = html || '';
  const root = tpl.content;
  // Quill 2 writes bullet lists as <ol><li data-list="bullet">.
  root.querySelectorAll('ol').forEach((ol) => {
    const items = Array.from(ol.children);
    if (items.length && items.every((li) => li.getAttribute('data-list') === 'bullet')) {
      const ul = doc.createElement('ul');
      while (ol.firstChild) ul.appendChild(ol.firstChild);
      ol.replaceWith(ul);
    }
  });
  cleanChildren(root, doc, o);
  wrapLoose(root, doc);
  const div = doc.createElement('div');
  div.appendChild(root);
  return div.innerHTML;
}

function cleanChildren(parent: ParentNode, doc: Document, o: CleanOptions): void {
  const inPre = !!(parent as Element).closest?.('pre');
  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === 8) {
      node.remove();
      continue;
    }
    if (node.nodeType === 3) {
      // Source formatting (newlines, indentation) is not content, except inside code blocks.
      if (!inPre) node.nodeValue = (node.nodeValue || '').replace(/[\t\n\r ]+/g, ' ');
      continue;
    }
    if (node.nodeType !== 1) continue;
    let el = node as HTMLElement;
    const tag = el.tagName.toUpperCase();
    if (DROP.has(tag) || tag.includes(':')) {
      // Word's <o:p> and friends hold nothing worth keeping.
      el.remove();
      continue;
    }
    // Google Docs wraps everything in <b style="font-weight:normal">.
    if (tag === 'B' && /font-weight\s*:\s*(normal|400)/i.test(el.getAttribute('style') || '')) {
      cleanChildren(el, doc, o);
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }
    if (tag === 'FONT') {
      const span = doc.createElement('span');
      const color = el.getAttribute('color');
      if (color) span.style.color = color;
      const face = el.getAttribute('face');
      if (face) span.style.fontFamily = face;
      while (el.firstChild) span.appendChild(el.firstChild);
      el.replaceWith(span);
      el = span;
    } else if (RENAME[tag]) {
      const target = RENAME[tag];
      // A div holding blocks is just a wrapper: keep its children.
      if (tag === 'DIV' && Array.from(el.children).some((c) => isBlock(c))) {
        cleanChildren(el, doc, o);
        el.replaceWith(...Array.from(el.childNodes));
        continue;
      }
      const renamed = doc.createElement(target);
      for (const a of Array.from(el.attributes)) renamed.setAttribute(a.name, a.value);
      while (el.firstChild) renamed.appendChild(el.firstChild);
      el.replaceWith(renamed);
      el = renamed;
    }
    const name = el.tagName.toUpperCase();
    // Browsers put colours straight on <strong>, <em> …; colours live on spans, as before.
    if (INLINE_TAGS.has(name) && el.getAttribute('style')) {
      const span = doc.createElement('span');
      span.setAttribute('style', el.getAttribute('style') || '');
      el.removeAttribute('style');
      while (el.firstChild) span.appendChild(el.firstChild);
      el.appendChild(span);
    }
    const allowed = ALLOWED[name];
    if (!allowed) {
      // Unknown wrappers (section, label, …) give way to their content.
      cleanChildren(el, doc, o);
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }
    for (const a of Array.from(el.attributes)) {
      const n = a.name.toLowerCase();
      if (!allowed.includes(n)) el.removeAttribute(a.name);
    }
    if (el.hasAttribute('class')) {
      const keep = Array.from(el.classList).filter((c) => CLASS_OK.test(c));
      if (keep.length) el.setAttribute('class', keep.join(' '));
      else el.removeAttribute('class');
    }
    if (el.hasAttribute('style')) {
      const kept: string[] = [];
      for (const prop of STYLE_PROPS) {
        const v = el.style.getPropertyValue(prop);
        // Safari copies the page's own styles (theme variables, inherit) onto what it pastes; those are not content.
        if (v && !/expression|url\(|javascript|var\(|^(inherit|initial|unset|normal)$/i.test(v.trim())) kept.push(`${prop}: ${v}`);
      }
      // Width only on tables, their columns and cells.
      const out = kept.filter((d) => !d.startsWith('width') || ['TABLE', 'COL', 'TD', 'TH'].includes(name));
      if (out.length) el.setAttribute('style', out.join('; '));
      else el.removeAttribute('style');
    }
    if (name === 'A') {
      const href = el.getAttribute('href');
      if (!href || !safeEditorUrl(href, o.protocols)) {
        // A link that goes nowhere is just its text.
        cleanChildren(el, doc, o);
        el.replaceWith(...Array.from(el.childNodes));
        continue;
      }
      if (el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
      else el.removeAttribute('target');
    }
    if (name === 'IMG') {
      const src = el.getAttribute('src') || '';
      if (!safeEditorImage(src)) {
        el.remove();
        continue;
      }
    }
    if (name === 'SPAN' && !el.attributes.length) {
      cleanChildren(el, doc, o);
      el.replaceWith(...Array.from(el.childNodes));
      continue;
    }
    cleanChildren(el, doc, o);
  }
}

/** Text and inline content directly in the root goes into paragraphs. */
function wrapLoose(root: DocumentFragment, doc: Document): void {
  let p: HTMLElement | null = null;
  for (const node of Array.from(root.childNodes)) {
    const inline = node.nodeType === 3 ? !!node.textContent?.trim() || !!p : node.nodeType === 1 && !isBlock(node);
    if (inline) {
      if (!p) {
        p = doc.createElement('p');
        root.insertBefore(p, node);
      }
      p.appendChild(node);
    } else {
      if (node.nodeType === 3) node.remove();
      p = null;
    }
  }
}

// ---------- tables ----------

export interface TableGrid {
  /** grid[row][col] = the cell covering that slot (a merged cell appears in several slots). */
  grid: HTMLTableCellElement[][];
  rows: HTMLTableRowElement[];
  cols: number;
}

export function tableGrid(table: HTMLTableElement): TableGrid {
  const rows = Array.from(table.rows);
  const grid: HTMLTableCellElement[][] = rows.map(() => []);
  rows.forEach((tr, r) => {
    let c = 0;
    for (const cell of Array.from(tr.cells)) {
      while (grid[r][c]) c++;
      const rs = Math.max(1, cell.rowSpan || 1);
      const cs = Math.max(1, cell.colSpan || 1);
      for (let i = 0; i < rs && r + i < rows.length; i++) for (let j = 0; j < cs; j++) grid[r + i][c + j] = cell;
      c += cs;
    }
  });
  const cols = Math.max(0, ...grid.map((row) => row.length));
  return { grid, rows, cols };
}

/** Row and column of a cell's top-left slot. */
export function cellSlot(g: TableGrid, cell: HTMLTableCellElement): { row: number; col: number } {
  for (let r = 0; r < g.grid.length; r++) {
    const c = g.grid[r].indexOf(cell);
    if (c >= 0) return { row: r, col: c };
  }
  return { row: -1, col: -1 };
}

/** Sets a row / column span; a span of 1 leaves no attribute behind. */
function setSpan(cell: HTMLTableCellElement, kind: 'row' | 'col', n: number): void {
  const attr = kind === 'row' ? 'rowspan' : 'colspan';
  if (n > 1) cell.setAttribute(attr, String(n));
  else cell.removeAttribute(attr);
}

function newCell(doc: Document, tag: 'td' | 'th'): HTMLTableCellElement {
  const cell = doc.createElement(tag);
  cell.appendChild(doc.createElement('br'));
  return cell;
}

/** A new table, `rows` × `cols`, with a header row when asked. */
export function createTable(doc: Document, rows: number, cols: number, headerRow: boolean): HTMLTableElement {
  const table = doc.createElement('table');
  table.className = 'wu-editor-table';
  if (headerRow) {
    const thead = table.createTHead();
    const tr = thead.insertRow();
    for (let c = 0; c < cols; c++) tr.appendChild(newCell(doc, 'th'));
  }
  const tbody = table.createTBody();
  for (let r = 0; r < (headerRow ? rows - 1 : rows); r++) {
    const tr = tbody.insertRow();
    for (let c = 0; c < cols; c++) tr.appendChild(newCell(doc, 'td'));
  }
  // The full width of the text, with even columns in %, so it follows the page on any screen.
  table.style.width = '100%';
  const group = doc.createElement('colgroup');
  for (let c = 0; c < cols; c++) {
    const col = doc.createElement('col');
    col.style.width = percent(100 / cols);
    group.appendChild(col);
  }
  table.insertBefore(group, table.firstChild);
  return table;
}

/** A width in % with at most two decimals. */
export function percent(n: number): string {
  return `${Math.round(Math.max(0, n) * 100) / 100}%`;
}

/** The <col>s of the table's <colgroup>, one per column; null when it has none or they do not match the columns. */
export function tableCols(table: HTMLTableElement): HTMLTableColElement[] | null {
  const group = Array.from(table.children).find((c) => c.tagName === 'COLGROUP');
  if (!group) return null;
  const cols = Array.from(group.children).filter((c) => c.tagName === 'COL') as HTMLTableColElement[];
  return cols.length && cols.length === tableGrid(table).cols ? cols : null;
}

/** Gives the table one <col> per column with its width in % of the table, measured from how it is drawn now. */
export function ensureTableCols(table: HTMLTableElement): HTMLTableColElement[] {
  const have = tableCols(table);
  if (have) return have;
  const g = tableGrid(table);
  const doc = table.ownerDocument;
  const widths: number[] = [];
  for (let c = 0; c < g.cols; c++) {
    let w = 0;
    for (const row of g.grid) {
      const cell = row[c];
      if (cell && (cell.colSpan || 1) === 1) {
        w = cell.getBoundingClientRect().width;
        break;
      }
    }
    widths.push(w);
  }
  const known = widths.filter((w) => w > 0);
  const fallback = known.length ? known.reduce((a, b) => a + b, 0) / known.length : 1;
  const full = widths.map((w) => w || fallback);
  const sum = full.reduce((a, b) => a + b, 0) || 1;
  Array.from(table.children)
    .filter((c) => c.tagName === 'COLGROUP')
    .forEach((c) => c.remove());
  const group = doc.createElement('colgroup');
  const cols = full.map((w) => {
    const col = doc.createElement('col');
    col.style.width = percent((w / sum) * 100);
    group.appendChild(col);
    return col;
  });
  table.insertBefore(group, table.firstChild);
  if (!table.style.width) table.style.width = percent((table.getBoundingClientRect().width / Math.max(1, table.parentElement?.clientWidth || 1)) * 100);
  return cols;
}

/** The rectangle of grid slots from cell `a` to cell `b`, grown until no merged cell sticks out of it. */
export function cellRect(table: HTMLTableElement, a: HTMLTableCellElement, b: HTMLTableCellElement): { r1: number; c1: number; r2: number; c2: number } {
  const g = tableGrid(table);
  const sa = cellSlot(g, a);
  const sb = cellSlot(g, b);
  let r1 = Math.min(sa.row, sb.row);
  let c1 = Math.min(sa.col, sb.col);
  let r2 = Math.max(sa.row + (a.rowSpan || 1) - 1, sb.row + (b.rowSpan || 1) - 1);
  let c2 = Math.max(sa.col + (a.colSpan || 1) - 1, sb.col + (b.colSpan || 1) - 1);
  for (let grown = true; grown; ) {
    grown = false;
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const cell = g.grid[r]?.[c];
        if (!cell) continue;
        const s = cellSlot(g, cell);
        const er = s.row + (cell.rowSpan || 1) - 1;
        const ec = s.col + (cell.colSpan || 1) - 1;
        if (s.row < r1 || s.col < c1 || er > r2 || ec > c2) {
          r1 = Math.min(r1, s.row);
          c1 = Math.min(c1, s.col);
          r2 = Math.max(r2, er);
          c2 = Math.max(c2, ec);
          grown = true;
        }
      }
    }
  }
  return { r1, c1, r2, c2 };
}

/** The cells inside a rectangle of slots, each once, in reading order. */
export function cellsInRect(table: HTMLTableElement, rect: { r1: number; c1: number; r2: number; c2: number }): HTMLTableCellElement[] {
  const g = tableGrid(table);
  const out: HTMLTableCellElement[] = [];
  for (let r = rect.r1; r <= rect.r2; r++) {
    for (let c = rect.c1; c <= rect.c2; c++) {
      const cell = g.grid[r]?.[c];
      if (cell && !out.includes(cell)) out.push(cell);
    }
  }
  return out;
}

/** Joins every cell of the rectangle into its top-left one (their content kept, one after another). */
export function mergeRect(table: HTMLTableElement, rect: { r1: number; c1: number; r2: number; c2: number }): HTMLTableCellElement | null {
  const cells = cellsInRect(table, rect);
  if (cells.length < 2) return null;
  const target = cells[0];
  const filled = (c: HTMLTableCellElement) => !!(c.textContent?.trim() || c.querySelector('img, table'));
  if (!filled(target)) target.innerHTML = '';
  for (const cell of cells.slice(1)) {
    if (filled(cell)) {
      if (target.childNodes.length) target.appendChild(table.ownerDocument.createElement('br'));
      while (cell.firstChild) target.appendChild(cell.firstChild);
    }
    cell.remove();
  }
  if (!target.childNodes.length) target.appendChild(table.ownerDocument.createElement('br'));
  setSpan(target, 'row', rect.r2 - rect.r1 + 1);
  setSpan(target, 'col', rect.c2 - rect.c1 + 1);
  return target;
}

/** Inserts a row above or below the cell's row; cells merged across the spot grow. Returns the new row's first cell. */
export function insertRow(cell: HTMLTableCellElement, below: boolean): HTMLTableCellElement | null {
  const table = cell.closest('table') as HTMLTableElement;
  const doc = cell.ownerDocument;
  const g = tableGrid(table);
  const { row } = cellSlot(g, cell);
  const at = below ? row + (cell.rowSpan || 1) - 1 : row;
  const ref = g.rows[at];
  const tr = doc.createElement('tr');
  const tag = ref.parentElement?.tagName === 'THEAD' && !below ? 'th' : 'td';
  const seen = new Set<HTMLTableCellElement>();
  for (let c = 0; c < g.cols; c++) {
    const covering = g.grid[at][c];
    const spansAcross = covering && (below ? cellSlot(g, covering).row + (covering.rowSpan || 1) - 1 > at : cellSlot(g, covering).row < at);
    if (spansAcross) {
      if (!seen.has(covering)) {
        setSpan(covering, 'row', (covering.rowSpan || 1) + 1);
        seen.add(covering);
      }
      c += (covering.colSpan || 1) - 1;
    } else {
      tr.appendChild(newCell(doc, tag === 'th' && below ? 'td' : tag));
    }
  }
  // A row added under the header row goes into the body.
  if (below && ref.parentElement?.tagName === 'THEAD') {
    const body = table.tBodies[0] || table.createTBody();
    body.insertBefore(tr, body.firstChild);
  } else {
    ref.parentElement!.insertBefore(tr, below ? ref.nextSibling : ref);
  }
  return tr.cells[0] || null;
}

/** Inserts a column left or right of the cell's column. */
export function insertColumn(cell: HTMLTableCellElement, right: boolean): void {
  const table = cell.closest('table') as HTMLTableElement;
  const doc = cell.ownerDocument;
  const g = tableGrid(table);
  const { col } = cellSlot(g, cell);
  const at = right ? col + (cell.colSpan || 1) - 1 : col;
  // The new column takes half of the one it sits beside.
  const cols = tableCols(table);
  if (cols) {
    const ref = cols[at];
    const half = (parseFloat(ref.style.width) || 100 / (cols.length + 1)) / 2;
    const fresh = doc.createElement('col');
    ref.style.width = percent(half);
    fresh.style.width = percent(half);
    ref.parentElement!.insertBefore(fresh, right ? ref.nextSibling : ref);
  }
  const grown = new Set<HTMLTableCellElement>();
  g.rows.forEach((tr, r) => {
    const covering = g.grid[r][at];
    if (!covering) {
      tr.appendChild(newCell(doc, tr.parentElement?.tagName === 'THEAD' ? 'th' : 'td'));
      return;
    }
    const slot = cellSlot(g, covering);
    const inside = right ? slot.col + (covering.colSpan || 1) - 1 > at : slot.col < at;
    if (inside) {
      if (!grown.has(covering)) {
        setSpan(covering, 'col', (covering.colSpan || 1) + 1);
        grown.add(covering);
      }
      return;
    }
    if (slot.row !== r) return; // a cell merged down from above already covers this row's slot
    const fresh = newCell(doc, covering.tagName === 'TH' ? 'th' : 'td');
    if ((covering.rowSpan || 1) > 1) setSpan(fresh, 'row', covering.rowSpan);
    covering.parentElement!.insertBefore(fresh, right ? covering.nextSibling : covering);
  });
}

/** Removes the cell's row (merged cells shrink). Returns a cell to put the caret in, or null when the table is empty. */
export function deleteRow(cell: HTMLTableCellElement): HTMLTableCellElement | null {
  const table = cell.closest('table') as HTMLTableElement;
  const g = tableGrid(table);
  const { row } = cellSlot(g, cell);
  const tr = g.rows[row];
  const done = new Set<HTMLTableCellElement>();
  for (let c = 0; c < g.cols; c++) {
    const covering = g.grid[row][c];
    if (!covering || done.has(covering)) continue;
    done.add(covering);
    const slot = cellSlot(g, covering);
    const rs = covering.rowSpan || 1;
    if (rs > 1) {
      if (slot.row === row) {
        // Move the merged cell down into the next row.
        const next = g.rows[row + 1];
        setSpan(covering, 'row', rs - 1);
        const after = g.grid[row + 1].slice(0, c).reverse().find((x) => x && x.parentElement === next);
        next.insertBefore(covering, after ? after.nextSibling : next.firstChild);
      } else {
        setSpan(covering, 'row', rs - 1);
      }
    }
  }
  const target = (g.rows[row + 1] || g.rows[row - 1])?.cells[0] || null;
  tr.remove();
  if (!table.rows.length) {
    table.remove();
    return null;
  }
  return target && target.isConnected ? target : table.rows[0].cells[0] || null;
}

/** Removes the cell's column. */
export function deleteColumn(cell: HTMLTableCellElement): HTMLTableCellElement | null {
  const table = cell.closest('table') as HTMLTableElement;
  const cols = tableCols(table);
  const g = tableGrid(table);
  const { row, col } = cellSlot(g, cell);
  // Its width goes to the neighbour.
  if (cols) {
    const gone = cols[col];
    const next = cols[col + 1] || cols[col - 1];
    if (next) next.style.width = percent((parseFloat(next.style.width) || 0) + (parseFloat(gone.style.width) || 0));
    gone.remove();
  }
  const done = new Set<HTMLTableCellElement>();
  g.rows.forEach((_, r) => {
    const covering = g.grid[r][col];
    if (!covering || done.has(covering)) return;
    done.add(covering);
    if ((covering.colSpan || 1) > 1) setSpan(covering, 'col', covering.colSpan - 1);
    else covering.remove();
  });
  if (!table.querySelector('td, th')) {
    table.remove();
    return null;
  }
  const g2 = tableGrid(table);
  const r = Math.min(row, g2.grid.length - 1);
  return g2.grid[r][Math.min(col, g2.grid[r].length - 1)] || table.querySelector('td, th');
}

/** Joins the cell with the one to its right (same height), or below (same width). Returns whether it merged. */
export function mergeCells(cell: HTMLTableCellElement, direction: 'right' | 'down'): boolean {
  const table = cell.closest('table') as HTMLTableElement;
  const g = tableGrid(table);
  const { row, col } = cellSlot(g, cell);
  const rs = cell.rowSpan || 1;
  const cs = cell.colSpan || 1;
  const other = direction === 'right' ? g.grid[row]?.[col + cs] : g.grid[row + rs]?.[col];
  if (!other || other === cell) return false;
  const o = cellSlot(g, other);
  if (direction === 'right' && (o.row !== row || (other.rowSpan || 1) !== rs)) return false;
  if (direction === 'down' && (o.col !== col || (other.colSpan || 1) !== cs)) return false;
  if (other.textContent?.trim() || other.querySelector('img')) {
    if (!cell.textContent?.trim()) cell.innerHTML = '';
    else cell.appendChild(cell.ownerDocument.createElement('br'));
    while (other.firstChild) cell.appendChild(other.firstChild);
  }
  if (direction === 'right') setSpan(cell, 'col', cs + (other.colSpan || 1));
  else setSpan(cell, 'row', rs + (other.rowSpan || 1));
  other.remove();
  return true;
}

/** Splits a merged cell back into single cells. */
export function splitCell(cell: HTMLTableCellElement): boolean {
  const rs = cell.rowSpan || 1;
  const cs = cell.colSpan || 1;
  if (rs === 1 && cs === 1) return false;
  const table = cell.closest('table') as HTMLTableElement;
  const doc = cell.ownerDocument;
  const g = tableGrid(table);
  const { row, col } = cellSlot(g, cell);
  const tag = cell.tagName === 'TH' ? 'th' : 'td';
  setSpan(cell, 'row', 1);
  setSpan(cell, 'col', 1);
  for (let r = row; r < row + rs; r++) {
    const tr = g.rows[r];
    // Insert after the last cell of this row that sits left of the split area.
    let after: HTMLTableCellElement | null = r === row ? cell : null;
    if (r !== row) {
      for (let c = col - 1; c >= 0; c--) {
        const x = g.grid[r][c];
        if (x && x.parentElement === tr) {
          after = x;
          break;
        }
      }
    }
    for (let c = r === row ? 1 : 0; c < cs; c++) {
      const fresh = newCell(doc, tag);
      tr.insertBefore(fresh, after ? after.nextSibling : tr.firstChild);
      after = fresh;
    }
  }
  return true;
}

/** Turns the first row into a header row (`<thead>` with `<th>`), or back into a body row. */
export function toggleHeaderRow(table: HTMLTableElement): void {
  const doc = table.ownerDocument;
  const swap = (cell: HTMLTableCellElement, tag: 'td' | 'th') => {
    const n = doc.createElement(tag);
    for (const a of Array.from(cell.attributes)) n.setAttribute(a.name, a.value);
    while (cell.firstChild) n.appendChild(cell.firstChild);
    cell.replaceWith(n);
  };
  if (table.tHead && table.tHead.rows.length) {
    const body = table.tBodies[0] || table.createTBody();
    for (const tr of Array.from(table.tHead.rows).reverse()) {
      Array.from(tr.cells).forEach((c) => swap(c, 'td'));
      body.insertBefore(tr, body.firstChild);
    }
    table.tHead.remove();
  } else {
    const first = table.rows[0];
    if (!first) return;
    const thead = table.createTHead();
    Array.from(first.cells).forEach((c) => swap(c, 'th'));
    thead.appendChild(first);
  }
}

/** The next (or previous) cell for Tab / Shift+Tab, or null at the end. */
export function adjacentCell(cell: HTMLTableCellElement, back: boolean): HTMLTableCellElement | null {
  const table = cell.closest('table') as HTMLTableElement;
  const cells = Array.from(table.querySelectorAll<HTMLTableCellElement>('td, th')).filter((c) => c.closest('table') === table);
  const i = cells.indexOf(cell);
  return cells[back ? i - 1 : i + 1] || null;
}
