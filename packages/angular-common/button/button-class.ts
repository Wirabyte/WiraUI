const SEVERITIES = ['secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'];
const MODIFIERS = ['outlined', 'text', 'link', 'raised', 'rounded', 'sm', 'lg', 'icon-only'];

/**
 * Classes for a plain `<button>` drawn like wt-button, from a style class written for the classic button names:
 * `ɵbuttonClass('p-button-danger p-button-text')` → `wt-btn p-button p-component wt-btn-danger wt-btn-text p-button-danger p-button-text`.
 * `fallback` (e.g. `'p-button-text'`) applies when the app gave no style class.
 */
export function ɵbuttonClass(styleClass?: string | null, fallback = ''): string {
  return ['wt-btn', 'p-button', 'p-component', ɵbuttonExtras(styleClass || fallback)].filter(Boolean).join(' ');
}

/** The classes of `styleClass` plus our equivalents of its classic button names (`p-button-sm` → also `wt-btn-sm`). */
export function ɵbuttonExtras(styleClass?: string | null): string {
  const given = (styleClass || '').split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (const c of given) {
    const m = /^p-button-(.+)$/.exec(c);
    if (m) {
      const name = m[1] === 'warning' ? 'warn' : m[1] === 'small' ? 'sm' : m[1] === 'large' ? 'lg' : m[1];
      if (SEVERITIES.includes(name) || MODIFIERS.includes(name)) out.push('wt-btn-' + name);
    }
    out.push(c);
  }
  return out.join(' ');
}
