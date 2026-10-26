// The WiraTheme sticker logo of the secret page, as SVG markup. The page draws it inline (so it can animate) and
// offers the same markup as a download. Fonts: Fredoka and M PLUS Rounded 1c (Google Fonts, OFL).

const FONT = `font-family="Fredoka, 'M PLUS Rounded 1c', Kanit, sans-serif" font-weight="700"`;

/** A four-point sparkle of radius r around (0, 0). */
const sparkle = (r: number) => {
  const k = r * 0.16;
  return `M0,${-r} C${k},${-k} ${k},${-k} ${r},0 C${k},${k} ${k},${k} 0,${r} C${-k},${k} ${-k},${k} ${-r},0 C${-k},${-k} ${-k},${-k} 0,${-r}Z`;
};
const HEART = 'M0,14 C-24,-2 -26,-20 -13,-25 C-6,-28 -1,-23 0,-18 C1,-23 6,-28 13,-25 C26,-20 24,-2 0,14Z';
const PLUS = 'M-6,-20 h12 v14 h14 v12 h-14 v14 h-12 v-14 h-14 v-12 h14z';
// Lotus (hasu): three petals and two side leaves.
const LOTUS =
  'M0,-30 C12,-18 13,2 0,14 C-13,2 -12,-18 0,-30Z M0,14 C-6,-4 -22,-14 -32,-10 C-30,6 -14,16 0,14Z M0,14 C6,-4 22,-14 32,-10 C30,6 14,16 0,14Z';

/** Text drawn three times: a lavender shadow below, a thick white outline, then the coloured face. */
function sticker(text: string, x: number, y: number, size: number, fill: string, outline: number, extra = ''): string {
  const common = `x="${x}" y="${y}" font-size="${size}" ${FONT} ${extra}`;
  return (
    `<text ${common} transform="translate(0 ${outline * 0.32})" fill="#e3d6ff" stroke="#e3d6ff" stroke-width="${outline + 10}" stroke-linejoin="round" stroke-linecap="round">${text}</text>` +
    `<text ${common} fill="#ffffff" stroke="#ffffff" stroke-width="${outline}" stroke-linejoin="round" stroke-linecap="round">${text}</text>` +
    `<text ${common} fill="${fill}">${text}</text>`
  );
}

/** A shape drawn the same way: shadow, white outline, face. */
function stickerShape(d: string, transform: string, fill: string, outline: number): string {
  return (
    `<g transform="${transform}">` +
    `<path d="${d}" transform="translate(0 ${outline * 0.4})" fill="#e3d6ff" stroke="#e3d6ff" stroke-width="${outline + 8}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="#ffffff" stroke="#ffffff" stroke-width="${outline}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="${fill}"/>` +
    `</g>`
  );
}

const KANA = [
  ['ウ', '#c4b2ff'],
  ['ィ', '#9fd0ff'],
  ['ラ', '#ffadcb'],
  ['テ', '#a7d4ff'],
  ['ー', '#d2c0ff'],
  ['マ', '#ffb8d6'],
];

const W = 960;
const H = 460;
const DEFS = [
  `<defs>`,
  `<style>@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&amp;family=M+PLUS+Rounded+1c:wght@800&amp;display=swap');</style>`,
  `<linearGradient id="ll-main" x1="0" y1="0" x2="1" y2="0.25"><stop offset="0" stop-color="#78c2ff"/><stop offset="0.42" stop-color="#a6a4ff"/><stop offset="0.72" stop-color="#d79cf2"/><stop offset="1" stop-color="#f58fb9"/></linearGradient>`,
  `<linearGradient id="ll-tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3a2f0"/><stop offset="1" stop-color="#f78db3"/></linearGradient>`,
  `<linearGradient id="ll-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc0dc"/><stop offset="1" stop-color="#f26fae"/></linearGradient>`,
  `</defs>`,
].join('');

/** The parts that stay still: katakana, lotus, name and the ng badge. */
const STILL = [
  // Katakana line, tilted a little.
  `<g transform="rotate(-5 300 120)">`,
  KANA.map(([c, color], i) => sticker(c, 150 + i * 74, 136, 76, color, 20)).join(''),
  `</g>`,
  // Lotus at the start of the katakana.
  stickerShape(LOTUS, 'translate(96 120) rotate(-8) scale(1.15)', '#f9a3c4', 14),
  // The name.
  sticker('Wira', 96, 352, 236, 'url(#ll-main)', 34, 'letter-spacing="8" rotate="-7 4 -3 6"'),
  `<g transform="rotate(-6 700 400)">`,
  sticker('Theme', 548, 418, 112, 'url(#ll-tail)', 24, 'letter-spacing="3" rotate="4 -3 5 -2 4"'),
  `</g>`,
  `<g transform="translate(880 172) rotate(12)">`,
  `<rect x="-40" y="-34" width="80" height="68" rx="18" transform="translate(0 6)" fill="#e3d6ff"/>`,
  `<rect x="-40" y="-34" width="80" height="68" rx="18" fill="#ffffff"/>`,
  `<rect x="-32" y="-26" width="64" height="52" rx="12" fill="#ffd36e"/>`,
  `<text x="0" y="13" text-anchor="middle" font-size="38" ${FONT} fill="#ffffff" stroke="#f0a92c" stroke-width="2">ng</text>`,
  `</g>`,
].join('');

/** The parts that move on the page: each drawn around its own centre (x, y), r = half its box. */
interface Deco {
  cls: string;
  x: number;
  y: number;
  r: number;
  /** Turn / scale around the centre. */
  t: string;
  d: string;
  fill: string;
  outline: number;
}
const DECOS: Deco[] = [
  { cls: 'll-star', x: 780, y: 160, r: 104, t: 'rotate(8)', d: sparkle(78), fill: 'url(#ll-star)', outline: 16 },
  { cls: 'll-star ll-star-b', x: 886, y: 262, r: 40, t: '', d: sparkle(26), fill: '#b9a8ff', outline: 10 },
  { cls: 'll-plus', x: 668, y: 74, r: 34, t: 'rotate(12)', d: PLUS, fill: '#b2a3ff', outline: 10 },
  { cls: 'll-plus ll-plus-b', x: 900, y: 76, r: 30, t: 'rotate(-10) scale(0.8)', d: PLUS, fill: '#8fc8ff', outline: 10 },
  { cls: 'll-heart', x: 664, y: 210, r: 40, t: 'rotate(-12) scale(1.1)', d: HEART, fill: '#ff8fb8', outline: 10 },
];
const decoInPlace = (k: Deco) => stickerShape(k.d, `translate(${k.x} ${k.y}) ${k.t}`, k.fill, k.outline);

/** The whole logo in one SVG: the download. */
export const LL_LOGO_SVG = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="WiraTheme">`,
  DEFS,
  STILL,
  DECOS.map(decoInPlace).join(''),
  `</svg>`,
].join('');

/** The still parts only: the page draws the moving ones as separate layers on top. */
export const LL_LOGO_STILL_SVG = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="WiraTheme">`, DEFS, STILL, `</svg>`].join('');

/**
 * Each moving part as its own small SVG, placed in percent of the logo box. They animate with CSS transforms on
 * their own layers, so the big logo is never repainted while they move.
 */
export const LL_LOGO_DECOS = DECOS.map((k) => ({
  cls: k.cls,
  left: ((k.x - k.r) / W) * 100,
  top: ((k.y - k.r) / H) * 100,
  width: ((2 * k.r) / W) * 100,
  svg:
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-k.r} ${-k.r} ${2 * k.r} ${2 * k.r}" aria-hidden="true">` +
    // Its own gradient id: the still logo on the same page already has #ll-star.
    (k.fill.startsWith('url(') ? `<defs><linearGradient id="ll-deco-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc0dc"/><stop offset="1" stop-color="#f26fae"/></linearGradient></defs>` : '') +
    stickerShape(k.d, k.t || 'translate(0 0)', k.fill.replace('#ll-star', '#ll-deco-star'), k.outline) +
    `</svg>`,
}));
