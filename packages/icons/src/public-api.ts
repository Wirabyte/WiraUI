import { WIRAICON_ALIASES, WIRAICON_FIXED_WEIGHT, WIRAICON_NAMES } from './icons';

export { WIRAICON_ALIASES, WIRAICON_FIXED_WEIGHT, WIRAICON_NAMES, WIRAICON_VERSION } from './icons';

/** The five weights. `regular` is the default. */
export type WiraIconWeight = 'regular' | 'thin' | 'light' | 'bold' | 'fill';
export const WIRAICON_WEIGHTS: readonly WiraIconWeight[] = ['regular', 'thin', 'light', 'bold', 'fill'];
/** A main icon name (aliases are accepted wherever a name is). */
export type WiraIconName = (typeof WIRAICON_NAMES)[number];

const MAIN = new Set<string>(WIRAICON_NAMES);

/**
 * The main name for `name`, which may be an alias (`xmark` → `times`) or carry the class prefix (`wi-check`,
 * `pi pi-check`, `wi wi-check`); null when wiraicon has no such icon.
 */
export function wiraIconName(name: string | null | undefined): WiraIconName | null {
  if (!name) return null;
  const words = String(name).trim().split(/\s+/);
  const last = words[words.length - 1].replace(/^(wi|pi|fa)-/, '');
  const main = MAIN.has(last) ? last : WIRAICON_ALIASES[last];
  return (main as WiraIconName) || null;
}

/** The weight an icon is drawn in: its own for names such as `star-fill`, otherwise `weight`. */
export function wiraIconWeight(name: string, weight: WiraIconWeight = 'regular'): WiraIconWeight {
  return (WIRAICON_FIXED_WEIGHT[name] as WiraIconWeight) || weight;
}

/** A whole <svg> for a drawing from `@wirabyte/icons/data/<weight>`, sized by `size` (default 1em) and coloured by currentColor. */
export function wiraIconSvg(body: string, size: string | number = '1em', label?: string): string {
  const s = typeof size === 'number' ? `${size}px` : size;
  const a11y = label ? ` role="img" aria-label="${label.replace(/[&"<>]/g, (c) => `&#${c.charCodeAt(0)};`)}"` : ' aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="${s}" height="${s}" fill="currentColor" focusable="false"${a11y}>${body}</svg>`;
}
