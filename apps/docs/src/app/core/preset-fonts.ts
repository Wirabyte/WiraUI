// The site loads Inter, IBM Plex Sans Thai, JetBrains Mono and Kanit itself (index.html). A preset or a Studio theme
// set in another family would fall back to a system Thai font, whose odd metrics put the text off the line of the
// icons beside it; so that family is fetched from Google Fonts the first time a theme uses it.
const ON_PAGE = new Set(['Inter', 'IBM Plex Sans Thai', 'JetBrains Mono', 'Kanit']);
/** The families presets and the Studio offer, with the weights to ask for (the API refuses weights a family lacks). */
const FAMILIES: Record<string, string> = {
  Sarabun: ':wght@400;500;600;700',
  Prompt: ':wght@400;500;600;700',
  'Noto Sans Thai': ':wght@400;500;600;700',
  'Noto Sans Thai Looped': ':wght@400;500;600;700',
  Anuphan: ':wght@400;500;600;700',
  Roboto: ':wght@400;500;600;700',
  Itim: '',
};
const requested = new Set<string>();

/** Loads a theme's font family once, if the page does not have it yet. */
export function ensureFont(family: unknown): void {
  if (typeof family !== 'string' || typeof document === 'undefined') return;
  const name = family.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  if (ON_PAGE.has(name) || requested.has(name) || !(name in FAMILIES)) return;
  requested.add(name);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}${FAMILIES[name]}&display=swap`;
  link.dataset['docsFont'] = name;
  document.head.appendChild(link);
}
