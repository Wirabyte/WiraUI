/**
 * The app's own translations (@wirabyte/ui/i18n), framework-free. Messages are keyed by an id (`'menu.home'`) or by the
 * text in the app's main language (`'บันทึก'`), so a Thai-first app can write Thai in its templates and add only an
 * English list; a missing key shows the key itself.
 */

/** One language's messages: flat (`{ 'menu.home': 'Home' }`) or nested (`{ menu: { home: 'Home' } }`). */
export interface I18nMessages {
  [key: string]: string | I18nMessages;
}

/** Nested messages as one flat map with dotted keys. Values that are not text are skipped. */
export function flattenMessages(messages: I18nMessages | null | undefined, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  if (!messages || typeof messages !== 'object') return out;
  for (const [key, value] of Object.entries(messages)) {
    const id = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[id] = value;
    else if (value && typeof value === 'object') Object.assign(out, flattenMessages(value, id));
  }
  return out;
}

/** Fills `{name}` placeholders from `params`; a placeholder with no value stays as written. */
export function interpolate(text: string, params?: Record<string, unknown> | null): string {
  if (!params) return text;
  return text.replace(/\{\s*([\w.-]+)\s*\}/g, (whole, name: string) => {
    const v = params[name];
    return v === undefined || v === null ? whole : String(v);
  });
}

/**
 * The text for `key`: the language's own message, else the fallback language's, else the key itself.
 * `dictionaries` maps a language code to its flat messages.
 */
export function translateKey(
  dictionaries: ReadonlyMap<string, Readonly<Record<string, string>>>,
  language: string,
  fallback: string,
  key: string,
  params?: Record<string, unknown> | null,
): string {
  const own = dictionaries.get(language)?.[key];
  const text = own ?? (language !== fallback ? dictionaries.get(fallback)?.[key] : undefined) ?? key;
  return interpolate(text, params);
}

/** `languages`' entry for `code`, matching `'en-US'` to `'en'` and ignoring case; null when none fits. */
export function matchLanguage(languages: readonly string[], code: string | null | undefined): string | null {
  if (!code) return null;
  const want = code.toLowerCase();
  const exact = languages.find((l) => l.toLowerCase() === want);
  if (exact) return exact;
  const base = want.split(/[-_]/)[0];
  return languages.find((l) => l.toLowerCase() === base || l.toLowerCase().split(/[-_]/)[0] === base) ?? null;
}

/** The language to start in: the one saved from last time, else the browser's (when `browser` is given), else `fallback`. */
export function pickLanguage(
  languages: readonly string[],
  fallback: string,
  saved?: string | null,
  browser?: readonly string[] | null,
): string {
  const fromSaved = matchLanguage(languages, saved);
  if (fromSaved) return fromSaved;
  for (const code of browser || []) {
    const hit = matchLanguage(languages, code);
    if (hit) return hit;
  }
  return matchLanguage(languages, fallback) ?? languages[0] ?? fallback;
}

/** What each language calls itself, for language pickers. */
export const LANGUAGE_NAMES: Readonly<Record<string, string>> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  lo: 'ລາວ',
  my: 'မြန်မာ',
  km: 'ខ្មែរ',
  vi: 'Tiếng Việt',
  ms: 'Bahasa Melayu',
  id: 'Bahasa Indonesia',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
};
