import { Lang } from './i18n';
import { Snippet, VersionSnippet } from './snippets';

/**
 * English for the sample content of the docs: live demos and the code under them.
 *
 * Samples are written once, in Thai, and the TH site shows them exactly as written. Each page keeps a list
 * of the English for its Thai phrases (`ComponentDoc.english`, Thai → English, plus SHARED_WORDS). On the EN
 * site every listed phrase is swapped:
 *  - in the code samples: the demo base class passes `code` / `ts` through `snippets()` before <docs-demo>;
 *  - in the demo templates: `tx('ไทย')` for text and attributes, `local(data)` for arrays given to components
 *    (it swaps string values and object keys, e.g. `name_th` → `name_en`).
 * Both sides read the same list, so the English demo always renders what the English code says.
 *
 * Matching: longer keys win, and a key that starts or ends with a Thai letter never matches inside a longer
 * Thai word ("จังหวัด" leaves "เลือกจังหวัด" alone). Keys may also be code (`name_th`, `'th-TH'`).
 * A sample whose English version differs in shape is written as `{ th, en }` (see Snippet).
 * Thai with no entry stays Thai: that is how the few demos about Thai behaviour keep their Thai data.
 */
export type SampleWords = Readonly<Record<string, string>>;

const THAI = /[฀-๿]/;

/** Phrases most pages use. A page's own list wins over these. */
export const SHARED_WORDS: SampleWords = {
  'บันทึก': 'Save',
  'ยกเลิก': 'Cancel',
  'ลบ': 'Delete',
  'แก้ไข': 'Edit',
  'ค้นหา': 'Search',
  'ชื่อ': 'Name',
  'อีเมล': 'Email',
  'ตกลง': 'OK',
  'ปิด': 'Close',
  'ส่ง': 'Send',
  'ถัดไป': 'Next',
  'ย้อนกลับ': 'Back',
  'เพิ่ม': 'Add',
  'ข้อความตัวอย่าง': 'Sample text',
};

export class SampleText {
  private readonly pattern: RegExp | null;
  private readonly memo = new Map<string, string>();
  private readonly localized = new WeakMap<object, unknown>();
  private readonly records = new WeakMap<object, Record<string, Snippet>>();

  constructor(private readonly words: SampleWords) {
    const keys = Object.keys(words).sort((a, b) => b.length - a.length);
    this.pattern = keys.length
      ? new RegExp(
          keys
            .map((k) => (THAI.test(k[0]) ? '(?<![\\u0E00-\\u0E7F])' : '') + escape(k) + (THAI.test(k[k.length - 1]) ? '(?![\\u0E00-\\u0E7F])' : ''))
            .join('|'),
          'g'
        )
      : null;
  }

  /** The text with every listed phrase in English. */
  swap(text: string): string {
    if (!this.pattern || !text) return text;
    let out = this.memo.get(text);
    if (out === undefined) {
      out = text.replace(this.pattern, (m) => this.words[m] ?? m);
      this.memo.set(text, out);
    }
    return out;
  }

  /** A copy of the data in English (strings and object keys swapped), the same copy every time. */
  local<T>(value: T): T {
    if (typeof value === 'string') return this.swap(value) as T;
    if (!value || typeof value !== 'object' || value instanceof Date) return value;
    const done = this.localized.get(value);
    if (done) return done as T;
    const out: unknown = Array.isArray(value)
      ? value.map((v) => this.local(v))
      : Object.fromEntries(Object.entries(value).map(([k, v]) => [this.swap(k), this.local(v)]));
    this.localized.set(value, out);
    return out as T;
  }

  /** One code sample in English: the `en` side of a `{ th, en }` sample, then the phrase list. */
  snippet(s: Snippet): VersionSnippet {
    const one = typeof s !== 'string' && 'th' in s ? s.en : s;
    return typeof one === 'string' ? this.swap(one) : { classic: this.swap(one.classic), v3: this.swap(one.v3) };
  }

  /** A page's `code` or `ts` record in the site language. Thai gets the record as written. */
  snippets(record: Record<string, Snippet>, lang: Lang): Record<string, Snippet> {
    if (lang === 'th') return record;
    let out = this.records.get(record);
    if (!out) {
      out = Object.fromEntries(Object.entries(record).map(([k, s]) => [k, this.snippet(s)]));
      this.records.set(record, out);
    }
    return out;
  }
}

const cache = new WeakMap<SampleWords, SampleText>();
const NONE: SampleWords = {};

/** The swapper for a page's own list (merged over SHARED_WORDS), built once per list. */
export function sampleText(words: SampleWords | undefined): SampleText {
  const key = words || NONE;
  let t = cache.get(key);
  if (!t) {
    t = new SampleText({ ...SHARED_WORDS, ...key });
    cache.set(key, t);
  }
  return t;
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
