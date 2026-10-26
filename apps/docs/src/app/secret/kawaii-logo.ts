// The WiraTheme sticker logo of the WiraKawaii secret page, as SVG markup. The page draws it inline (so it can
// animate) and offers the same markup as a download. Like the cute logos of the dev-tool trend it keeps the brand's
// own colours, here Wirabyte's: the coral-to-orange of its W, the mint-to-sky of its B, the navy of its badge. Fonts: Fredoka and M PLUS Rounded 1c (Google Fonts, OFL).

const FONT = `font-family="Fredoka, 'M PLUS Rounded 1c', Kanit, sans-serif" font-weight="700"`;

/** A four-point sparkle of radius r around (0, 0). */
const sparkle = (r: number) => {
  const k = r * 0.16;
  return `M0,${-r} C${k},${-k} ${k},${-k} ${r},0 C${k},${k} ${k},${k} 0,${r} C${-k},${k} ${-k},${k} ${-r},0 C${-k},${-k} ${-k},${-k} 0,${-r}Z`;
};
const HEART = 'M0,14 C-24,-2 -26,-20 -13,-25 C-6,-28 -1,-23 0,-18 C1,-23 6,-28 13,-25 C26,-20 24,-2 0,14Z';
const PLUS = 'M-6,-20 h12 v14 h14 v12 h-14 v14 h-12 v-14 h-14 v-12 h14z';
// A cat's paw: the pad and four toe beans (a nod to the "meow" logos of the same trend).
const PAW =
  'M0,0 C-13,0 -21,12 -18,21 C-15,29 -6,26 0,26 C6,26 15,29 18,21 C21,12 13,0 0,0Z' +
  ' M-26,-9 a7,8.5 0 1,0 14,0 a7,8.5 0 1,0 -14,0Z M-15,-21 a7,8.5 0 1,0 14,0 a7,8.5 0 1,0 -14,0Z' +
  ' M1,-21 a7,8.5 0 1,0 14,0 a7,8.5 0 1,0 -14,0Z M12,-9 a7,8.5 0 1,0 14,0 a7,8.5 0 1,0 -14,0Z';

/** Text drawn three times: a pale sky shadow below, a thick white outline, then the coloured face. */
function sticker(text: string, x: number, y: number, size: number, fill: string, outline: number, extra = ''): string {
  const common = `x="${x}" y="${y}" font-size="${size}" ${FONT} ${extra}`;
  return (
    `<text ${common} transform="translate(0 ${outline * 0.32})" fill="#bde8f6" stroke="#bde8f6" stroke-width="${outline + 10}" stroke-linejoin="round" stroke-linecap="round">${text}</text>` +
    `<text ${common} fill="#ffffff" stroke="#ffffff" stroke-width="${outline}" stroke-linejoin="round" stroke-linecap="round">${text}</text>` +
    `<text ${common} fill="${fill}">${text}</text>`
  );
}

/** A shape drawn the same way: shadow, white outline, face. */
function stickerShape(d: string, transform: string, fill: string, outline: number): string {
  return (
    `<g transform="${transform}">` +
    `<path d="${d}" transform="translate(0 ${outline * 0.4})" fill="#bde8f6" stroke="#bde8f6" stroke-width="${outline + 8}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="#ffffff" stroke="#ffffff" stroke-width="${outline}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="${fill}"/>` +
    `</g>`
  );
}

const KANA = [
  ['ウ', '#ff8a85'],
  ['ィ', '#6cc8ef'],
  ['ラ', '#ffa36b'],
  ['テ', '#5bbde9'],
  ['ー', '#ff8a85'],
  ['マ', '#5fdcbd'],
];

const W = 960;
const H = 460;
const DEFS = [
  `<defs>`,
  `<style>@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&amp;family=M+PLUS+Rounded+1c:wght@800&amp;display=swap');</style>`,
  `<linearGradient id="kw-main" x1="0" y1="0" x2="1" y2="0.25"><stop offset="0" stop-color="#ff6b6b"/><stop offset="0.55" stop-color="#ff7f5a"/><stop offset="1" stop-color="#ff9a4b"/></linearGradient>`,
  `<linearGradient id="kw-tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5fe6bf"/><stop offset="1" stop-color="#45a9e3"/></linearGradient>`,
  `<linearGradient id="kw-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb4a8"/><stop offset="1" stop-color="#ff6b6b"/></linearGradient>`,
  `</defs>`,
].join('');

/** The parts that stay still: katakana, paw, name and the WB badge. */
const STILL = [
  // Katakana line, tilted a little.
  `<g transform="rotate(-5 300 120)">`,
  KANA.map(([c, color], i) => sticker(c, 150 + i * 74, 136, 76, color, 20)).join(''),
  `</g>`,
  // A paw at the start of the katakana.
  stickerShape(PAW, 'translate(98 124) rotate(-12) scale(1.15)', '#ff9d92', 14),
  // The name.
  sticker('Wira', 96, 352, 236, 'url(#kw-main)', 34, 'letter-spacing="8" rotate="-7 4 -3 6"'),
  `<g transform="rotate(-6 700 400)">`,
  sticker('Theme', 548, 418, 112, 'url(#kw-tail)', 24, 'letter-spacing="3" rotate="4 -3 5 -2 4"'),
  `</g>`,
  // Wirabyte's round WB badge, as a sticker.
  `<g transform="translate(900 84) rotate(10)">`,
  `<circle r="44" cy="6" fill="#bde8f6"/>`,
  `<circle r="44" fill="#ffffff"/>`,
  `<circle r="35" fill="#1c2a3d"/>`,
  `<text x="-11" y="12" text-anchor="middle" font-size="34" ${FONT} fill="url(#kw-main)">W</text>`,
  `<text x="15" y="12" text-anchor="middle" font-size="34" ${FONT} fill="url(#kw-tail)">B</text>`,
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
  { cls: 'kw-star', x: 780, y: 160, r: 104, t: 'rotate(8)', d: sparkle(78), fill: 'url(#kw-star)', outline: 16 },
  { cls: 'kw-star kw-star-b', x: 886, y: 262, r: 40, t: '', d: sparkle(26), fill: '#5bbde9', outline: 10 },
  { cls: 'kw-plus', x: 668, y: 74, r: 34, t: 'rotate(12)', d: PLUS, fill: '#5fdcbd', outline: 10 },
  { cls: 'kw-plus kw-plus-b', x: 926, y: 190, r: 30, t: 'rotate(-10) scale(0.8)', d: PLUS, fill: '#ffa36b', outline: 10 },
  { cls: 'kw-heart', x: 664, y: 210, r: 40, t: 'rotate(-12) scale(1.1)', d: HEART, fill: '#ff7b84', outline: 10 },
];
const decoInPlace = (k: Deco) => stickerShape(k.d, `translate(${k.x} ${k.y}) ${k.t}`, k.fill, k.outline);

/** The whole logo in one SVG: the download. */
export const KAWAII_LOGO_SVG = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="WiraTheme">`,
  DEFS,
  STILL,
  DECOS.map(decoInPlace).join(''),
  `</svg>`,
].join('');

/** The still parts only: the page draws the moving ones as separate layers on top. */
export const KAWAII_LOGO_STILL_SVG = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="WiraTheme">`, DEFS, STILL, `</svg>`].join('');

/**
 * Each moving part as its own small SVG, placed in percent of the logo box. They animate with CSS transforms on
 * their own layers, so the big logo is never repainted while they move.
 */
export const KAWAII_LOGO_DECOS = DECOS.map((k) => ({
  cls: k.cls,
  left: ((k.x - k.r) / W) * 100,
  top: ((k.y - k.r) / H) * 100,
  width: ((2 * k.r) / W) * 100,
  svg:
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-k.r} ${-k.r} ${2 * k.r} ${2 * k.r}" aria-hidden="true">` +
    // Its own gradient id: the still logo on the same page already has #kw-star.
    (k.fill.startsWith('url(') ? `<defs><linearGradient id="kw-deco-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb4a8"/><stop offset="1" stop-color="#ff6b6b"/></linearGradient></defs>` : '') +
    stickerShape(k.d, k.t || 'translate(0 0)', k.fill.replace('#kw-star', '#kw-deco-star'), k.outline) +
    `</svg>`,
}));
