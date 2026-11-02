/**
 * `glass` (v3 only) uses the Liquid Glass tokens (DESIGN.md §6.9) and falls back to a solid card without
 * backdrop-filter; v1 and v2 show a plain card for it.
 */
export type WuCardVariant = 'default' | 'outlined' | 'elevated' | 'glass';
