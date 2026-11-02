/**
 * Excel files (.xlsx) without a dependency. A workbook is plain objects: sheets of rows of cells, each cell a value or
 * `{ value, formula, style, link, colSpan, rowSpan }`, plus column widths, merged ranges, frozen panes, a filter and print
 * settings. `buildExcel()` writes it as Office Open XML and zips it. Used by wu-table's `exportExcel()` and the
 * `wiraui/excel` entry point.
 *
 * Strings stay text (leading zeros of phone numbers and Thai IDs survive, nothing turns into a formula), numbers stay
 * numbers, dates become Excel dates, and formulas are calculated by Excel when the file opens.
 */

export type ExcelValue = string | number | boolean | Date | null | undefined;

export type ExcelBorderStyle =
  | 'thin'
  | 'medium'
  | 'thick'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'hair'
  | 'mediumDashed'
  | 'dashDot'
  | 'mediumDashDot'
  | 'dashDotDot'
  | 'mediumDashDotDot'
  | 'slantDashDot';

/** One border line: `{ style: 'thin', color: '#cbd5e1' }`. */
export interface ExcelBorderLine {
  style?: ExcelBorderStyle;
  color?: string;
}

/** Lines per side; a side left out (or `null`) has none. */
export interface ExcelBorders {
  top?: ExcelBorderStyle | ExcelBorderLine | null;
  right?: ExcelBorderStyle | ExcelBorderLine | null;
  bottom?: ExcelBorderStyle | ExcelBorderLine | null;
  left?: ExcelBorderStyle | ExcelBorderLine | null;
}

/** `'thin'` or `{ style, color }` draws all four sides; `{ top, bottom, … }` picks sides. */
export type ExcelBorder = ExcelBorderStyle | ExcelBorderLine | ExcelBorders;

/**
 * How a cell looks, flat so it is quick to write: `{ bold: true, color: '#ffffff', fill: '#0f766e', align: 'center' }`.
 * Colours are `#rgb` or `#rrggbb`. `format` is an Excel number format: `'#,##0.00'`, `'0%'`, `'dd/mm/yyyy'`, `'@'` (text).
 */
export interface ExcelStyle {
  fontName?: string;
  /** Points. */
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  /** Text colour. */
  color?: string;
  /** Background colour. */
  fill?: string;
  border?: ExcelBorder;
  align?: 'left' | 'center' | 'right' | 'justify' | 'fill' | 'centerContinuous' | 'distributed';
  valign?: 'top' | 'middle' | 'bottom' | 'justify' | 'distributed';
  /** Wrap long text onto more lines. */
  wrap?: boolean;
  /** Shrink the text to fit the cell. */
  shrink?: boolean;
  indent?: number;
  /** Degrees, -90 … 90. */
  rotate?: number;
  format?: string;
}

/**
 * A cell with more than a value. `formula` is written without or with the leading `=` (`'SUM(B2:B9)'`) and Excel
 * calculates it on open; `value` is then the result shown until it does. `colSpan` / `rowSpan` merge it with the cells to
 * its right / below, like an HTML table: the next cells of the row continue after the span. `link` is a URL, or
 * `'#Sheet 2!A1'` for a place in the workbook.
 */
export interface ExcelCell {
  value?: ExcelValue;
  formula?: string;
  style?: ExcelStyle;
  link?: string;
  colSpan?: number;
  rowSpan?: number;
}

export type ExcelCellInput = ExcelValue | ExcelCell;

/** A row with options; a plain array is a row of cells. `height` is in points. */
export interface ExcelRow {
  cells: ExcelCellInput[];
  height?: number;
  style?: ExcelStyle;
  hidden?: boolean;
}

/** `width` is in characters (Excel's unit). `style` applies to the cells written in the column. */
export interface ExcelColumn {
  width?: number;
  style?: ExcelStyle;
  hidden?: boolean;
}

export interface ExcelSheet {
  /** Tab name (made valid: at most 31 characters, none of `[]:*?/\`, unique in the workbook). */
  name?: string;
  /** From A1 down. */
  rows: (ExcelCellInput[] | ExcelRow)[];
  /** Per column from A: options, or just the width. */
  columns?: (ExcelColumn | number | null | undefined)[];
  /** More merged ranges: `['A1:D1']`. */
  merges?: string[];
  /** The first cell that scrolls: `'A2'` keeps row 1 in view, `'B3'` rows 1–2 and column A. */
  freeze?: string;
  /** Filter buttons on a range: `'A1:F20'`. */
  autoFilter?: string;
  /** Give columns without a width one from their content. Default true. */
  autoWidth?: boolean;
  tabColor?: string;
  /** Show the grid lines. Default true. */
  gridLines?: boolean;
  /** Print across rather than down. */
  landscape?: boolean;
  /** Print all columns on one page width. */
  fitToWidth?: boolean;
  paper?: 'A4' | 'A3' | 'A5' | 'letter' | 'legal';
  /** Rows printed at the top of every page: `'1:1'`. */
  repeatRows?: string;
}

export interface ExcelWorkbook {
  sheets: ExcelSheet[];
  /** Font of the whole workbook. Default Calibri 11. */
  fontName?: string;
  fontSize?: number;
  /** Number format of dates without a time. Default `dd/mm/yyyy`. */
  dateFormat?: string;
  /** Number format of dates with a time. Default `dd/mm/yyyy hh:mm`. */
  dateTimeFormat?: string;
  /** `'buddhist'` shows the years of the default date formats in พ.ศ. (the cells stay real dates). */
  calendar?: 'gregorian' | 'buddhist';
}

/** MIME type of .xlsx files. */
export const EXCEL_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// ---------------------------------------------------------------- cell references

/** `0` → `A`, `25` → `Z`, `26` → `AA`. */
export function excelColumnName(index: number): string {
  let n = Math.floor(index) + 1;
  let s = '';
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Zero-based row and column → `'B3'`. */
export function excelRef(row: number, column: number): string {
  return `${excelColumnName(column)}${row + 1}`;
}

/** `'B3'` → `{ row: 2, column: 1 }` (zero-based); `null` when it is not a cell reference. */
export function excelParseRef(ref: string): { row: number; column: number } | null {
  const m = /^\$?([A-Za-z]{1,3})\$?(\d+)$/.exec(String(ref).trim());
  if (!m) return null;
  let column = 0;
  for (const ch of m[1].toUpperCase()) column = column * 26 + (ch.charCodeAt(0) - 64);
  const row = Number(m[2]);
  return row >= 1 ? { row: row - 1, column: column - 1 } : null;
}

/** `'A1:D1'` → zero-based corners, in order; a single cell is a range of one. */
export function excelParseRange(range: string): { top: number; left: number; bottom: number; right: number } | null {
  const [a, b = a] = String(range).split(':');
  const p = excelParseRef(a);
  const q = excelParseRef(b);
  if (!p || !q) return null;
  return { top: Math.min(p.row, q.row), left: Math.min(p.column, q.column), bottom: Math.max(p.row, q.row), right: Math.max(p.column, q.column) };
}

/** Days since 1899-12-30 in local time, as Excel stores dates. */
export function excelDateNumber(date: Date): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  return utc / 86400000 + 25569;
}

// ---------------------------------------------------------------- text and colour

const xml = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Control characters XML 1.0 does not allow, and surrogate halves (checked in pairs below: no look-behind, which
// Safari before 16.4 cannot parse).
// eslint-disable-next-line no-control-regex
const SUSPECT = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF￾￿]/;

/** Text XML can carry, at most the 32,767 characters a cell holds. */
function cleanText(s: string): string {
  if (!SUSPECT.test(s)) return s.length > 32767 ? s.slice(0, 32767) : s;
  let out = '';
  for (let i = 0; i < s.length && out.length < 32767; i++) {
    const c = s.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff && out.length < 32766) out += s[i] + s[++i];
      continue;
    }
    if ((c >= 0xdc00 && c <= 0xdfff) || (c < 0x20 && c !== 9 && c !== 10 && c !== 13) || c === 0xfffe || c === 0xffff) continue;
    out += s[i];
  }
  return out;
}

/** The same text for equal values, whatever order their keys were written in. */
function stableKey(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'undefined';
  if (Array.isArray(v)) return `[${v.map(stableKey).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o)
    .filter((k) => o[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableKey(o[k])}`)
    .join(',')}}`;
}

const isDate = (v: unknown): v is Date => Object.prototype.toString.call(v) === '[object Date]';

/** `#rgb`, `#rrggbb`, `rrggbb` or `rgb(r, g, b)` → Excel's `FFRRGGBB`; anything else → undefined. */
export function excelColor(color: string | null | undefined): string | undefined {
  if (!color) return undefined;
  const c = String(color).trim();
  let m = /^#?([0-9a-f]{3})$/i.exec(c);
  if (m) return ('FF' + m[1].replace(/./g, (x) => x + x)).toUpperCase();
  m = /^#?([0-9a-f]{6})$/i.exec(c);
  if (m) return ('FF' + m[1]).toUpperCase();
  m = /^#?([0-9a-f]{6})[0-9a-f]{2}$/i.exec(c);
  if (m) return ('FF' + m[1]).toUpperCase();
  m = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(c);
  if (m) return 'FF' + [m[1], m[2], m[3]].map((x) => Math.min(255, Number(x)).toString(16).padStart(2, '0')).join('').toUpperCase();
  return undefined;
}

// ---------------------------------------------------------------- styles

const BUILT_IN_FORMATS: Record<string, number> = {
  General: 0,
  '0': 1,
  '0.00': 2,
  '#,##0': 3,
  '#,##0.00': 4,
  '0%': 9,
  '0.00%': 10,
  '0.00E+00': 11,
  '@': 49,
};

interface Line {
  style: ExcelBorderStyle;
  color?: string;
}
type Sides = Partial<Record<'top' | 'right' | 'bottom' | 'left', Line | null>>;

function line(v: ExcelBorderStyle | ExcelBorderLine | null | undefined): Line | null {
  if (!v) return null;
  if (typeof v === 'string') return { style: v };
  return { style: v.style || 'thin', color: v.color };
}

function sides(border: ExcelBorder | undefined): Sides {
  if (!border) return {};
  if (typeof border === 'string' || 'style' in border || 'color' in border) {
    const l = line(border as ExcelBorderStyle | ExcelBorderLine);
    return { top: l, right: l, bottom: l, left: l };
  }
  const b = border as ExcelBorders;
  const out: Sides = {};
  for (const k of ['top', 'right', 'bottom', 'left'] as const) if (k in b) out[k] = line(b[k]);
  return out;
}

/** Later styles win, key by key; borders merge side by side. */
export function mergeExcelStyles(...styles: (ExcelStyle | null | undefined)[]): ExcelStyle {
  const out: ExcelStyle = {};
  let border: Sides | null = null;
  for (const s of styles) {
    if (!s) continue;
    for (const key of Object.keys(s) as (keyof ExcelStyle)[]) {
      if (key === 'border' || s[key] === undefined) continue;
      (out as Record<string, unknown>)[key] = s[key];
    }
    if (s.border !== undefined) border = { ...(border || {}), ...sides(s.border) };
  }
  if (border) out.border = border as ExcelBorders;
  return out;
}

class StyleBook {
  private readonly fonts: string[] = [];
  private readonly fills = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>'];
  private readonly borders = ['<border><left/><right/><top/><bottom/><diagonal/></border>'];
  private readonly formats = new Map<string, number>();
  private readonly xfs: string[] = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
  private readonly index = new Map<string, number>();

  constructor(private readonly fontName: string, private readonly fontSize: number) {
    this.fonts.push(this.fontXml({}));
  }

  /** The cellXfs index of a style (0 for none), shared between equal styles. */
  id(style: ExcelStyle): number {
    const key = stableKey(style);
    const known = this.index.get(key);
    if (known !== undefined) return known;
    const numFmt = this.formatId(style.format);
    const font = this.add(this.fonts, this.fontXml(style));
    const fillColor = excelColor(style.fill);
    const fill = fillColor ? this.add(this.fills, `<fill><patternFill patternType="solid"><fgColor rgb="${fillColor}"/><bgColor indexed="64"/></patternFill></fill>`) : 0;
    const border = this.add(this.borders, this.borderXml(sides(style.border)));
    const align = this.alignXml(style);
    const attrs =
      `numFmtId="${numFmt}" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0"` +
      (numFmt ? ' applyNumberFormat="1"' : '') +
      (font ? ' applyFont="1"' : '') +
      (fill ? ' applyFill="1"' : '') +
      (border ? ' applyBorder="1"' : '') +
      (align ? ' applyAlignment="1"' : '');
    const id = this.add(this.xfs, align ? `<xf ${attrs}>${align}</xf>` : `<xf ${attrs}/>`);
    this.index.set(key, id);
    return id;
  }

  xml(): string {
    const fmts = [...this.formats].map(([code, id]) => `<numFmt numFmtId="${id}" formatCode="${xml(code)}"/>`);
    return (
      XML_HEAD +
      `<styleSheet xmlns="${NS_MAIN}">` +
      (fmts.length ? `<numFmts count="${fmts.length}">${fmts.join('')}</numFmts>` : '') +
      `<fonts count="${this.fonts.length}">${this.fonts.join('')}</fonts>` +
      `<fills count="${this.fills.length}">${this.fills.join('')}</fills>` +
      `<borders count="${this.borders.length}">${this.borders.join('')}</borders>` +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      `<cellXfs count="${this.xfs.length}">${this.xfs.join('')}</cellXfs>` +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
      '</styleSheet>'
    );
  }

  private add(list: string[], item: string): number {
    const i = list.indexOf(item);
    if (i >= 0) return i;
    list.push(item);
    return list.length - 1;
  }

  private formatId(code: string | undefined): number {
    if (!code) return 0;
    if (code in BUILT_IN_FORMATS) return BUILT_IN_FORMATS[code];
    let id = this.formats.get(code);
    if (id === undefined) {
      id = 164 + this.formats.size;
      this.formats.set(code, id);
    }
    return id;
  }

  // CT_Font wants its children in this order: b, i, strike, u, sz, color, name.
  private fontXml(s: ExcelStyle): string {
    const color = excelColor(s.color);
    return (
      '<font>' +
      (s.bold ? '<b/>' : '') +
      (s.italic ? '<i/>' : '') +
      (s.strike ? '<strike/>' : '') +
      (s.underline ? '<u/>' : '') +
      `<sz val="${s.fontSize && s.fontSize > 0 ? s.fontSize : this.fontSize}"/>` +
      (color ? `<color rgb="${color}"/>` : '') +
      `<name val="${xml(s.fontName || this.fontName)}"/>` +
      '</font>'
    );
  }

  private borderXml(b: Sides): string {
    const side = (tag: string, l: Line | null | undefined) => {
      if (!l) return `<${tag}/>`;
      const color = excelColor(l.color);
      return `<${tag} style="${l.style}">${color ? `<color rgb="${color}"/>` : '<color auto="1"/>'}</${tag}>`;
    };
    return `<border>${side('left', b.left)}${side('right', b.right)}${side('top', b.top)}${side('bottom', b.bottom)}<diagonal/></border>`;
  }

  private alignXml(s: ExcelStyle): string {
    const a: string[] = [];
    if (s.align) a.push(`horizontal="${s.align}"`);
    if (s.valign) a.push(`vertical="${s.valign === 'middle' ? 'center' : s.valign}"`);
    if (s.rotate) a.push(`textRotation="${Math.round(s.rotate < 0 ? 90 - s.rotate : s.rotate) % 181}"`);
    if (s.wrap) a.push('wrapText="1"');
    if (s.indent) a.push(`indent="${Math.max(0, Math.round(s.indent))}"`);
    if (s.shrink) a.push('shrinkToFit="1"');
    return a.length ? `<alignment ${a.join(' ')}/>` : '';
  }
}

// ---------------------------------------------------------------- layout

interface Placed {
  row: number;
  col: number;
  cell: ExcelCell;
  style: ExcelStyle;
  /** Part of a merged range, written only for its border and fill. */
  covered?: boolean;
}

const isCellObject = (v: ExcelCellInput): v is ExcelCell => typeof v === 'object' && v !== null && !isDate(v);
const toCell = (v: ExcelCellInput): ExcelCell => (isCellObject(v) ? v : { value: v });
const toColumn = (c: ExcelColumn | number | null | undefined): ExcelColumn => (typeof c === 'number' ? { width: c } : c || {});

/** Where every cell lands (spans push later cells right and down, as in HTML tables) and the merged ranges. */
function layout(sheet: ExcelSheet): { cells: Map<number, Map<number, Placed>>; merges: string[]; rows: Map<number, ExcelRow> } {
  const cells = new Map<number, Map<number, Placed>>();
  const rows = new Map<number, ExcelRow>();
  const taken = new Set<string>();
  const merges: string[] = [];
  const columns = (sheet.columns || []).map(toColumn);
  const put = (p: Placed) => {
    let r = cells.get(p.row);
    if (!r) cells.set(p.row, (r = new Map()));
    if (!p.covered || !r.has(p.col)) r.set(p.col, p);
  };

  sheet.rows.forEach((raw, r) => {
    const row: ExcelRow = Array.isArray(raw) ? { cells: raw } : raw || { cells: [] };
    rows.set(r, row);
    let c = 0;
    for (const input of row.cells || []) {
      while (taken.has(`${r}:${c}`)) c++;
      const cell = toCell(input);
      const colSpan = Math.max(1, Math.floor(cell.colSpan || 1));
      const rowSpan = Math.max(1, Math.floor(cell.rowSpan || 1));
      const style = mergeExcelStyles(columns[c]?.style, row.style, cell.style);
      put({ row: r, col: c, cell, style });
      if (colSpan > 1 || rowSpan > 1) {
        merges.push(`${excelRef(r, c)}:${excelRef(r + rowSpan - 1, c + colSpan - 1)}`);
        for (let dr = 0; dr < rowSpan; dr++) {
          for (let dc = 0; dc < colSpan; dc++) {
            if (!dr && !dc) continue;
            taken.add(`${r + dr}:${c + dc}`);
            put({ row: r + dr, col: c + dc, cell: {}, style, covered: true });
          }
        }
      }
      c += colSpan;
    }
  });

  // Ranges merged by address get the top-left cell's border and fill across them too.
  for (const range of sheet.merges || []) {
    const box = excelParseRange(range);
    if (!box || (box.top === box.bottom && box.left === box.right)) continue;
    merges.push(`${excelRef(box.top, box.left)}:${excelRef(box.bottom, box.right)}`);
    const anchor = cells.get(box.top)?.get(box.left);
    if (!anchor) continue;
    for (let r = box.top; r <= box.bottom; r++) {
      for (let c = box.left; c <= box.right; c++) {
        if (r !== box.top || c !== box.left) put({ row: r, col: c, cell: {}, style: anchor.style, covered: true });
      }
    }
  }
  return { cells, merges, rows };
}

/** Rough width of what a cell shows, in characters: Thai vowel and tone marks take no room, wide scripts two. */
function textWidth(v: unknown, style: ExcelStyle): number {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'boolean') return 5;
  if (isDate(v)) return (style.format || 'dd/mm/yyyy hh:mm').length;
  if (typeof v === 'number') {
    const text = Number.isInteger(v) ? String(v) : v.toFixed(2);
    return text.length + (style.format && style.format.includes(',') ? Math.floor(Math.max(0, text.split('.')[0].length - 1) / 3) : 0);
  }
  let widest = 0;
  for (const part of String(v).split(/\r?\n/)) {
    let w = 0;
    for (const ch of part) {
      const code = ch.codePointAt(0) || 0;
      if ((code >= 0x0e31 && code <= 0x0e3a && code !== 0x0e32 && code !== 0x0e33) || (code >= 0x0e47 && code <= 0x0e4e)) continue;
      if (code >= 0x0300 && code <= 0x036f) continue;
      w += code >= 0x1100 && (code <= 0x115f || (code >= 0x2e80 && code <= 0xa4cf) || (code >= 0xac00 && code <= 0xd7a3) || (code >= 0xf900 && code <= 0xfaff) || (code >= 0xff00 && code <= 0xff60)) ? 2 : 1;
    }
    widest = Math.max(widest, w);
  }
  return widest;
}

// ---------------------------------------------------------------- XML parts

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS_MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const NS_REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const NS_PKG_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';
const PAPER: Record<string, number> = { letter: 1, legal: 5, A3: 8, A4: 9, A5: 11 };

/** Valid, unique tab names: `[]:*?/\` removed, at most 31 characters, `Sheet1` … when empty. */
export function excelSheetNames(names: (string | undefined)[]): string[] {
  const used = new Set<string>();
  return names.map((name, i) => {
    let base = String(name ?? '')
      .replace(/[[\]:*?/\\]/g, ' ')
      .replace(/^'+|'+$/g, '')
      .trim()
      .slice(0, 31);
    if (!base) base = `Sheet${i + 1}`;
    let out = base;
    for (let n = 2; used.has(out.toLowerCase()); n++) out = `${base.slice(0, 31 - String(n).length - 1)} ${n}`;
    used.add(out.toLowerCase());
    return out;
  });
}

const quoteSheet = (name: string) => `'${name.replace(/'/g, "''")}'`;
const absolute = (range: string) => {
  const box = excelParseRange(range);
  if (!box) return null;
  return `$${excelColumnName(box.left)}$${box.top + 1}:$${excelColumnName(box.right)}$${box.bottom + 1}`;
};

/**
 * The XML files of a workbook, by path inside the zip. `buildExcel()` zips them; they are separate for tests and for
 * tools that want to look inside.
 */
export function excelParts(source: ExcelWorkbook | ExcelSheet): Record<string, string> {
  const book: ExcelWorkbook = 'sheets' in source ? source : { sheets: [source] };
  const sheets = book.sheets.length ? book.sheets : [{ rows: [] }];
  const names = excelSheetNames(sheets.map((s) => s.name));
  const fontSize = book.fontSize && book.fontSize > 0 ? book.fontSize : 11;
  const styles = new StyleBook(book.fontName || 'Calibri', fontSize);
  const strings = new Map<string, number>();
  let stringCount = 0;
  const stringId = (s: string) => {
    stringCount++;
    let id = strings.get(s);
    if (id === undefined) strings.set(s, (id = strings.size));
    return id;
  };
  const buddhist = book.calendar === 'buddhist' ? '[$-th-TH,107]' : '';
  const dateFormat = book.dateFormat || buddhist + 'dd/mm/yyyy';
  const dateTimeFormat = book.dateTimeFormat || buddhist + 'dd/mm/yyyy hh:mm';

  const parts: Record<string, string> = {};
  const definedNames: string[] = [];

  sheets.forEach((sheet, index) => {
    const { cells, merges, rows } = layout(sheet);
    const columns = (sheet.columns || []).map(toColumn);
    const links: string[] = [];
    const rels: string[] = [];
    const widths: number[] = [];
    let maxRow = -1;
    let maxCol = -1;
    const sheetData: string[] = [];
    const rowIndexes = [...new Set([...cells.keys(), ...rows.keys()])].sort((a, b) => a - b);

    for (const r of rowIndexes) {
      const row = rows.get(r);
      const placed = [...(cells.get(r)?.values() || [])].sort((a, b) => a.col - b.col);
      const out: string[] = [];
      for (const p of placed) {
        const { cell } = p;
        let style = p.style;
        let value = cell.value;
        if (typeof value === 'number' && !Number.isFinite(value)) value = null;
        if (isDate(value) && isNaN(value.getTime())) value = null;
        if (isDate(value) && !style.format) {
          const hasTime = value.getHours() || value.getMinutes() || value.getSeconds();
          style = { ...style, format: hasTime ? dateTimeFormat : dateFormat };
        }
        if (cell.link && !p.covered) style = mergeExcelStyles({ color: '#0563c1', underline: true }, style);
        const s = Object.keys(style).length ? styles.id(style) : 0;
        const ref = excelRef(r, p.col);
        const attr = `r="${ref}"${s ? ` s="${s}"` : ''}`;
        const formula = cell.formula ? cleanText(String(cell.formula).replace(/^\s*=/, '')) : '';
        let body = '';
        let type = '';
        if (formula) {
          // The cached result, shown until Excel calculates.
          body = `<f>${xml(formula)}</f>`;
          if (typeof value === 'number') {
            body += `<v>${value}</v>`;
          } else if (typeof value === 'boolean') {
            type = 'b';
            body += `<v>${value ? 1 : 0}</v>`;
          } else if (typeof value === 'string') {
            type = 'str';
            body += `<v>${xml(cleanText(value))}</v>`;
          }
        } else if (typeof value === 'number') {
          body = `<v>${value}</v>`;
        } else if (typeof value === 'boolean') {
          type = 'b';
          body = `<v>${value ? 1 : 0}</v>`;
        } else if (isDate(value)) {
          body = `<v>${excelDateNumber(value)}</v>`;
        } else if (typeof value === 'string' && value !== '') {
          type = 's';
          body = `<v>${stringId(cleanText(value))}</v>`;
        }
        if (!body && !s) continue;
        out.push(`<c ${attr}${type ? ` t="${type}"` : ''}${body ? `>${body}</c>` : '/>'}`);
        maxCol = Math.max(maxCol, p.col);
        if (!p.covered && (cell.colSpan || 1) <= 1) widths[p.col] = Math.max(widths[p.col] || 0, textWidth(formula && value === undefined ? '' : value, style) * (style.bold ? 1.1 : 1) * ((style.fontSize || fontSize) / fontSize));
        if (cell.link && !p.covered) {
          if (cell.link.startsWith('#')) links.push(`<hyperlink ref="${ref}" location="${xml(cleanText(cell.link.slice(1)))}" display="${xml(cleanText(String(value ?? cell.link)))}"/>`);
          else {
            const id = `rId${rels.length + 1}`;
            rels.push(`<Relationship Id="${id}" Type="${NS_REL}/hyperlink" Target="${xml(cleanText(cell.link))}" TargetMode="External"/>`);
            links.push(`<hyperlink ref="${ref}" r:id="${id}"/>`);
          }
        }
      }
      const attrs =
        (row?.height && row.height > 0 ? ` ht="${row.height}" customHeight="1"` : '') + (row?.hidden ? ' hidden="1"' : '');
      if (!out.length && !attrs) continue;
      maxRow = Math.max(maxRow, r);
      sheetData.push(`<row r="${r + 1}"${attrs}${out.length ? `>${out.join('')}</row>` : '/>'}`);
    }

    const name = names[index];
    const colsXml: string[] = [];
    const colCount = Math.max(columns.length, widths.length);
    for (let c = 0; c < colCount; c++) {
      const col = columns[c] || {};
      const auto = sheet.autoWidth !== false && widths[c] ? Math.min(60, Math.max(6, Math.ceil(widths[c] + 2))) : undefined;
      const width = col.width && col.width > 0 ? col.width : auto;
      if (!width && !col.hidden) continue;
      colsXml.push(`<col min="${c + 1}" max="${c + 1}"${width ? ` width="${width}" customWidth="1"` : ' width="9.140625"'}${col.hidden ? ' hidden="1"' : ''}/>`);
    }

    const freeze = sheet.freeze ? excelParseRef(sheet.freeze) : null;
    let pane = '';
    if (freeze && (freeze.row || freeze.column)) {
      const activePane = freeze.row && freeze.column ? 'bottomRight' : freeze.row ? 'bottomLeft' : 'topRight';
      pane =
        `<pane${freeze.column ? ` xSplit="${freeze.column}"` : ''}${freeze.row ? ` ySplit="${freeze.row}"` : ''} topLeftCell="${excelRef(freeze.row, freeze.column)}" activePane="${activePane}" state="frozen"/>` +
        `<selection pane="${activePane}" activeCell="${excelRef(freeze.row, freeze.column)}" sqref="${excelRef(freeze.row, freeze.column)}"/>`;
    }
    const tab = excelColor(sheet.tabColor);
    const fit = !!sheet.fitToWidth;
    const sheetPr = tab || fit ? `<sheetPr>${tab ? `<tabColor rgb="${tab}"/>` : ''}${fit ? '<pageSetUpPr fitToPage="1"/>' : ''}</sheetPr>` : '';
    const filter = sheet.autoFilter ? absolute(sheet.autoFilter) : null;
    if (filter) definedNames.push(`<definedName name="_xlnm._FilterDatabase" localSheetId="${index}" hidden="1">${xml(quoteSheet(name))}!${filter}</definedName>`);
    const repeat = sheet.repeatRows ? /^\$?(\d+)(?::\$?(\d+))?$/.exec(sheet.repeatRows.trim()) : null;
    if (repeat) definedNames.push(`<definedName name="_xlnm.Print_Titles" localSheetId="${index}">${xml(quoteSheet(name))}!$${repeat[1]}:$${repeat[2] || repeat[1]}</definedName>`);
    const pageSetup: string[] = [];
    if (sheet.paper && PAPER[sheet.paper]) pageSetup.push(`paperSize="${PAPER[sheet.paper]}"`);
    if (sheet.landscape) pageSetup.push('orientation="landscape"');
    if (fit) pageSetup.push('fitToWidth="1" fitToHeight="0"');
    const dimension = maxRow >= 0 && maxCol >= 0 ? `A1:${excelRef(maxRow, maxCol)}` : 'A1';
    const uniqueMerges = [...new Set(merges)];

    parts[`xl/worksheets/sheet${index + 1}.xml`] =
      XML_HEAD +
      `<worksheet xmlns="${NS_MAIN}" xmlns:r="${NS_REL}">` +
      sheetPr +
      `<dimension ref="${dimension}"/>` +
      `<sheetViews><sheetView workbookViewId="0"${index === 0 ? ' tabSelected="1"' : ''}${sheet.gridLines === false ? ' showGridLines="0"' : ''}>${pane}</sheetView></sheetViews>` +
      `<sheetFormatPr defaultRowHeight="${Math.round(fontSize * 1.364 * 100) / 100}"/>` +
      (colsXml.length ? `<cols>${colsXml.join('')}</cols>` : '') +
      (sheetData.length ? `<sheetData>${sheetData.join('')}</sheetData>` : '<sheetData/>') +
      (filter ? `<autoFilter ref="${filter.replace(/\$/g, '')}"/>` : '') +
      (uniqueMerges.length ? `<mergeCells count="${uniqueMerges.length}">${uniqueMerges.map((m) => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : '') +
      (links.length ? `<hyperlinks>${links.join('')}</hyperlinks>` : '') +
      '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>' +
      (pageSetup.length ? `<pageSetup ${pageSetup.join(' ')}/>` : '') +
      '</worksheet>';
    if (rels.length) parts[`xl/worksheets/_rels/sheet${index + 1}.xml.rels`] = XML_HEAD + `<Relationships xmlns="${NS_PKG_REL}">${rels.join('')}</Relationships>`;
  });

  const n = sheets.length;
  parts['[Content_Types].xml'] =
    XML_HEAD +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>' +
    '</Types>';
  parts['_rels/.rels'] =
    XML_HEAD + `<Relationships xmlns="${NS_PKG_REL}"><Relationship Id="rId1" Type="${NS_REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  parts['xl/workbook.xml'] =
    XML_HEAD +
    `<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_REL}">` +
    '<bookViews><workbookView/></bookViews>' +
    `<sheets>${names.map((name, i) => `<sheet name="${xml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>` +
    (definedNames.length ? `<definedNames>${definedNames.join('')}</definedNames>` : '') +
    '<calcPr calcId="191029" fullCalcOnLoad="1"/>' +
    '</workbook>';
  parts['xl/_rels/workbook.xml.rels'] =
    XML_HEAD +
    `<Relationships xmlns="${NS_PKG_REL}">` +
    names.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${NS_REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') +
    `<Relationship Id="rId${n + 1}" Type="${NS_REL}/styles" Target="styles.xml"/>` +
    `<Relationship Id="rId${n + 2}" Type="${NS_REL}/sharedStrings" Target="sharedStrings.xml"/>` +
    '</Relationships>';
  parts['xl/styles.xml'] = styles.xml();
  parts['xl/sharedStrings.xml'] =
    XML_HEAD +
    `<sst xmlns="${NS_MAIN}" count="${stringCount}" uniqueCount="${strings.size}">` +
    [...strings.keys()].map((s) => `<si><t${/^\s|\s$|\n/.test(s) ? ' xml:space="preserve"' : ''}>${xml(s)}</t></si>`).join('') +
    '</sst>';
  return parts;
}

// ---------------------------------------------------------------- zip

let crcTable: Uint32Array | null = null;

/** CRC-32 as ZIP files use it. */
export function crc32(data: Uint8Array): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = crcTable[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** Raw deflate through the platform's CompressionStream; null where there is none (the file is then stored). */
async function deflateRaw(data: Uint8Array): Promise<Uint8Array | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (typeof g.CompressionStream !== 'function' || typeof g.Response !== 'function' || typeof g.Blob !== 'function') return null;
  try {
    const stream = new g.Blob([data]).stream().pipeThrough(new g.CompressionStream('deflate-raw'));
    return new Uint8Array(await new g.Response(stream).arrayBuffer());
  } catch {
    return null;
  }
}

/** A ZIP archive of the entries, deflated where the platform can (and it helps), else stored. */
export async function zipFiles(entries: ZipEntry[], options: { compress?: boolean; date?: Date } = {}): Promise<Uint8Array> {
  const packed: { entry: ZipEntry; body: Uint8Array; method: number }[] = [];
  for (const entry of entries) {
    const deflated = options.compress === false ? null : await deflateRaw(entry.data);
    if (deflated && deflated.length < entry.data.length) packed.push({ entry, body: deflated, method: 8 });
    else packed.push({ entry, body: entry.data, method: 0 });
  }
  return zipPacked(packed, options.date);
}

/** A ZIP archive of the entries, stored without compression. */
export function zipFilesSync(entries: ZipEntry[], options: { date?: Date } = {}): Uint8Array {
  return zipPacked(
    entries.map((entry) => ({ entry, body: entry.data, method: 0 })),
    options.date
  );
}

function zipPacked(packed: { entry: ZipEntry; body: Uint8Array; method: number }[], date = new Date()): Uint8Array {
  const enc = new TextEncoder();
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = (Math.max(0, date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const { entry, body, method } of packed) {
    const name = enc.encode(entry.name);
    const crc = crc32(entry.data);
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, method, true);
    lv.setUint16(10, time, true);
    lv.setUint16(12, day, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, body.length, true);
    lv.setUint32(22, entry.data.length, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);
    const central = new Uint8Array(46 + name.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, method, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, day, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, body.length, true);
    cv.setUint32(24, entry.data.length, true);
    cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    central.set(name, 46);
    locals.push(local, body);
    centrals.push(central);
    offset += local.length + body.length;
  }
  const centralSize = centrals.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, packed.length, true);
  ev.setUint16(10, packed.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + centralSize + 22);
  let at = 0;
  for (const part of [...locals, ...centrals, end]) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

const partEntries = (parts: Record<string, string>): ZipEntry[] => {
  const enc = new TextEncoder();
  // [Content_Types].xml first, as Office writes it.
  return Object.keys(parts)
    .sort((a, b) => (a === '[Content_Types].xml' ? -1 : b === '[Content_Types].xml' ? 1 : 0))
    .map((name) => ({ name, data: enc.encode(parts[name]) }));
};

/** The .xlsx file of a workbook (or of one sheet), compressed where the platform can. */
export function buildExcel(source: ExcelWorkbook | ExcelSheet): Promise<Uint8Array> {
  return zipFiles(partEntries(excelParts(source)));
}

/** The .xlsx file without compression, without waiting (bigger; for tools and tests). */
export function buildExcelSync(source: ExcelWorkbook | ExcelSheet): Uint8Array {
  return zipFilesSync(partEntries(excelParts(source)));
}

// ---------------------------------------------------------------- rows of objects → a styled sheet

export type ExcelTotal = 'sum' | 'average' | 'count' | 'min' | 'max';

/** A column of `excelSheetFromRows()`. */
export interface ExcelTableColumn {
  /** Dot path into each row: `'name'`, `'address.province'`. */
  field: string;
  header?: string;
  /** Characters. Default: from the content. */
  width?: number;
  /** Number format of the cells: `'#,##0.00'`, `'0%'`, `'dd/mm/yyyy'`. */
  format?: string;
  /** Style of the column's body cells. */
  style?: ExcelStyle;
  /** What the total row shows here: a function over the column, a fixed value or a cell. */
  total?: ExcelTotal | ExcelCell | ExcelValue;
}

/** What `cellStyle` gets for each body cell. */
export interface ExcelTableCellContext<T = unknown> {
  row: T;
  /** Zero-based position among the exported rows. */
  rowIndex: number;
  field: string;
  value: unknown;
}

/** Where things landed, for `customize` and for formulas of your own (rows are Excel's, from 1). */
export interface ExcelTableLayout {
  headerRow: number;
  /** First and last data row; `lastRow < firstRow` when there are none. */
  firstRow: number;
  lastRow: number;
  totalRow: number | null;
  /** The column letter of a field: `layout.column('amount')` → `'D'`. */
  column(field: string): string;
}

export interface ExcelTableOptions<T = unknown> {
  sheetName?: string;
  /** A title above the table, merged across it. */
  title?: string | ExcelCell;
  /** A second line under the title. */
  subtitle?: string | ExcelCell;
  headerStyle?: ExcelStyle;
  /** Style of every body cell (before column and `cellStyle` styles). */
  bodyStyle?: ExcelStyle;
  /** Shade every other row; a colour picks the shade. */
  striped?: boolean | string;
  /** Thin lines around every cell; a colour picks it. Default true. */
  borders?: boolean | string;
  /** Style of one body cell, e.g. red text for a negative amount. */
  cellStyle?: (cell: ExcelTableCellContext<T>) => ExcelStyle | null | undefined | void;
  /** Style of one body row. */
  rowStyle?: (row: T, rowIndex: number) => ExcelStyle | null | undefined | void;
  /** Totals by field, added to the columns' own `total`: `{ amount: 'sum', qty: 'sum' }`. */
  totals?: Record<string, ExcelTotal | ExcelCell | ExcelValue>;
  /** Text in the first column of the total row when that column has no total. Default `Total`. */
  totalLabel?: string;
  totalStyle?: ExcelStyle;
  /** Keep the header in view while scrolling. Default true. */
  freezeHeader?: boolean;
  /** Filter buttons on the header. Default true. */
  autoFilter?: boolean;
  /** The value a cell exports (before styles). Default: the field's value. */
  value?: (row: T, field: string, raw: unknown) => ExcelValue;
  /** Last word on the sheet: add rows, merges, formulas, print settings. */
  customize?: (sheet: ExcelSheet, layout: ExcelTableLayout) => void;
}

// SUBTOTAL ignores rows the filter hides: 101 average, 103 count (non-empty), 104 max, 105 min, 109 sum.
const SUBTOTAL: Record<ExcelTotal, number> = { average: 101, count: 103, max: 104, min: 105, sum: 109 };
const TOTALS = new Set<string>(Object.keys(SUBTOTAL));

const fieldOf = (row: unknown, path: string): unknown => {
  let v: unknown = row;
  for (const key of path.split('.')) {
    if (v === null || v === undefined || typeof v !== 'object') return undefined;
    v = (v as Record<string, unknown>)[key];
  }
  return v;
};

/** Values Excel can hold; anything else becomes its text. */
function toExcelValue(v: unknown): ExcelValue {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || isDate(v)) return v as ExcelValue;
  if (typeof v === 'bigint') return Number(v);
  if (Array.isArray(v)) return v.map((x) => (x === null || x === undefined ? '' : typeof x === 'object' ? JSON.stringify(x) : String(x))).join(', ');
  return typeof v === 'object' ? JSON.stringify(v) : String(v);
}

/**
 * A sheet from rows of objects, styled like a report: optional title, bold shaded header with filter buttons that stays
 * in view, thin borders, widths from the content, number formats per column and a total row of SUBTOTAL formulas (they
 * follow the filter).
 */
export function excelSheetFromRows<T = unknown>(rows: readonly T[], columns: readonly ExcelTableColumn[], options: ExcelTableOptions<T> = {}): ExcelSheet {
  const cols = columns.filter((c) => c && c.field);
  const borderColor = typeof options.borders === 'string' ? options.borders : '#cbd5e1';
  const grid: ExcelStyle = options.borders === false ? {} : { border: { style: 'thin', color: borderColor } };
  const headerStyle = mergeExcelStyles(grid, { bold: true, fill: '#e2e8f0', color: '#0f172a', valign: 'middle', wrap: true }, options.headerStyle);
  const stripe = options.striped ? (typeof options.striped === 'string' ? options.striped : '#f8fafc') : null;
  const sheetRows: ExcelRow[] = [];
  const span = Math.max(1, cols.length);

  const asCell = (v: string | ExcelCell, style: ExcelStyle): ExcelCell =>
    typeof v === 'object' && v !== null ? { ...v, colSpan: v.colSpan ?? span, style: mergeExcelStyles(style, v.style) } : { value: v, colSpan: span, style };
  if (options.title !== undefined && options.title !== null && options.title !== '') {
    sheetRows.push({ cells: [asCell(options.title, { bold: true, fontSize: 14, valign: 'middle' })], height: 24 });
  }
  if (options.subtitle !== undefined && options.subtitle !== null && options.subtitle !== '') {
    sheetRows.push({ cells: [asCell(options.subtitle, { color: '#475569' })] });
  }
  if (sheetRows.length) sheetRows.push({ cells: [] });

  const headerRow = sheetRows.length + 1;
  sheetRows.push({ cells: cols.map((c) => ({ value: c.header ?? c.field, style: headerStyle })) });
  const firstRow = headerRow + 1;

  rows.forEach((row, rowIndex) => {
    const rowStyle = mergeExcelStyles(grid, stripe && rowIndex % 2 === 1 ? { fill: stripe } : null, options.bodyStyle, options.rowStyle?.(row, rowIndex) || null);
    sheetRows.push({
      cells: cols.map((c) => {
        const raw = fieldOf(row, c.field);
        const value = toExcelValue(options.value ? options.value(row, c.field, raw) : raw);
        const style = mergeExcelStyles(rowStyle, c.format ? { format: c.format } : null, c.style, options.cellStyle?.({ row, rowIndex, field: c.field, value }) || null);
        return { value, style };
      }),
    });
  });
  const lastRow = firstRow + rows.length - 1;

  const letters = new Map(cols.map((c, i) => [c.field, excelColumnName(i)] as const));
  const totals = cols.map((c) => (options.totals && c.field in options.totals ? options.totals[c.field] : c.total));
  let totalRow: number | null = null;
  if (totals.some((t) => t !== undefined)) {
    totalRow = lastRow + 1;
    const totalStyle = mergeExcelStyles(grid, { bold: true, fill: '#f1f5f9', border: { top: { style: 'double', color: '#64748b' } } }, options.totalStyle);
    sheetRows.push({
      cells: cols.map((c, i) => {
        const t = totals[i];
        const style = mergeExcelStyles(totalStyle, c.format ? { format: c.format } : null);
        if (typeof t === 'string' && TOTALS.has(t)) {
          const letter = letters.get(c.field)!;
          return rows.length ? { formula: `SUBTOTAL(${SUBTOTAL[t as ExcelTotal]},${letter}${firstRow}:${letter}${lastRow})`, style } : { value: 0, style };
        }
        if (t !== undefined && t !== null && typeof t === 'object' && !isDate(t)) return { ...(t as ExcelCell), style: mergeExcelStyles(style, (t as ExcelCell).style) };
        if (t !== undefined) return { value: t as ExcelValue, style };
        return { value: i === 0 ? options.totalLabel ?? 'Total' : null, style };
      }),
    });
  }

  const lastCol = excelColumnName(span - 1);
  const sheet: ExcelSheet = {
    name: options.sheetName,
    rows: sheetRows,
    columns: cols.map((c) => (c.width ? { width: c.width } : null)),
    freeze: options.freezeHeader === false ? undefined : `A${headerRow + 1}`,
    autoFilter: options.autoFilter === false || !cols.length ? undefined : `A${headerRow}:${lastCol}${Math.max(headerRow, lastRow)}`,
    repeatRows: `${headerRow}:${headerRow}`,
  };
  options.customize?.(sheet, {
    headerRow,
    firstRow,
    lastRow,
    totalRow,
    column: (field) => letters.get(field) ?? '',
  });
  return sheet;
}
