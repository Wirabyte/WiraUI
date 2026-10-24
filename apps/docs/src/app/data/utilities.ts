import { Text } from '../core/i18n';

/** One part of a Utilities page. `demo` is plain HTML using the real utility classes (rendered live). */
export interface UtilitySection {
  id: string;
  title: Text;
  /** Intro; inline HTML allowed (<code>, <b>). */
  text?: Text;
  demo?: string;
  /** Code shown under the demo; defaults to the demo itself. */
  code?: string;
  codeLang?: 'html' | 'scss' | 'css' | 'json' | 'bash';
  /** Render the demo in a frame whose width you can change, so sm: / md: / lg: classes react. */
  frame?: boolean;
  classes?: [string, Text][];
}

export interface UtilityTopic {
  id: string;
  title: Text;
  lead: Text;
  sections: UtilitySection[];
}

const box = (label: string, extra = '') => `<div class="docs-u-box${extra ? ' ' + extra : ''}">${label}</div>`;
/** One framed row per class, labelled, so each value shows its effect next to the others. */
const rows = (classes: string[], frame: (c: string) => string, children: string[]) =>
  `<div class="flex flex-column gap-3">\n` +
  classes.map((c) => `  <div>\n    <div class="docs-u-label">${c}</div>\n    <div class="${frame(c)}">${children.join('')}</div>\n  </div>`).join('\n') +
  `\n</div>`;
const cols = (classes: string[]) => classes.map((c) => `  <div class="${c}">${box(c)}</div>`).join('\n');

export const UTILITY_TOPICS: Record<string, UtilityTopic> = {
  overview: {
    id: 'overview',
    title: { th: 'Utility classes', en: 'Utility classes' },
    lead: {
      th: 'class สำเร็จรูปสำหรับ layout, ระยะห่าง, ขนาด, ตัวอักษร และสี มากับ wiratheme ในตัว จึงไม่ต้องติดตั้ง utility library แยก และเปิดหรือปิดได้ตามต้องการ',
      en: 'Ready-made classes for layout, spacing, sizing, type and colour that ship with wiratheme, so no separate utility library is needed. Switch them on or off as you like.',
    },
    sections: [
      {
        id: 'what',
        title: { th: 'คืออะไร', en: 'What it is' },
        text: {
          th: 'ชุด class แบบ <b>mobile-first</b> (<code>md:col-6</code> = ตั้งแต่ 768px ขึ้นไป) ชื่อ class ตรงกับที่แอปเดิมใช้อยู่ template เดิมจึงใช้ต่อได้ สีและมุมอ่านจาก token <code>--wt-*</code> ของธีม จึงเปลี่ยนตาม preset และ dark mode',
          en: 'A <b>mobile-first</b> set of classes (<code>md:col-6</code> = from 768px up). The class names match what existing apps already use, so templates keep working. Colours and radii read the theme\'s <code>--wt-*</code> tokens, so they follow the preset and dark mode.',
        },
        demo: `<div class="flex flex-wrap align-items-center gap-3 p-3 surface-card border-1 surface-border border-round-lg shadow-1">
  <div class="docs-u-avatar border-circle">W</div>
  <div class="flex-1 min-w-0">
    <div class="font-semibold text-color">WiraTheme</div>
    <div class="text-sm text-color-secondary white-space-nowrap overflow-hidden text-overflow-ellipsis">flex · gap · surface · border-round · shadow</div>
  </div>
  <span class="px-2 py-1 border-round bg-primary-100 text-primary-700 text-sm font-medium">utils</span>
</div>`,
      },
      {
        id: 'enable',
        title: { th: 'เปิดใช้', en: 'Switching it on' },
        text: {
          th: '<code>ng add</code> ถามว่า “เพิ่ม utility class …” (ข้ามได้ด้วย <code>--utils=false</code>) หรือเพิ่มเองด้วย SCSS หรือ CSS อย่างใดอย่างหนึ่ง ไม่ใส่ก็คือปิด',
          en: '<code>ng add</code> asks whether to add the utility classes (skip with <code>--utils=false</code>), or add them yourself with SCSS or CSS. Leave them out and they are off.',
        },
        code: `// src/styles.scss: ทั้งชุด
@use 'wiratheme/utils';

// หรือเลือกเอง
@use 'wiratheme/utils' with (
  $groups: (palette: false, shadows: false),   // ตัดกลุ่มที่ไม่ใช้
  $prefix: 'u-',                               // .u-flex, .md:u-col-6
  $responsive: true,                           // false = ไม่มี sm: md: lg: xl:
  $breakpoints: (sm: 576px, md: 768px, lg: 992px, xl: 1200px),
  $layer: false,                               // ไม่ใส่ใน @layer
  $important: false
);`,
        codeLang: 'scss',
      },
      {
        id: 'css',
        title: { th: 'ใช้แบบ CSS', en: 'As plain CSS' },
        code: `// angular.json → projects.<app>.architect.build.options
"styles": [
  "node_modules/wiratheme/utils/utils.min.css",
  "src/styles.css"
]`,
        codeLang: 'json',
      },
      {
        id: 'layer',
        title: { th: 'ลำดับการชนะ', en: 'What wins' },
        text: {
          th: 'class อยู่ใน <code>&#64;layer wiratheme.utilities</code> ระหว่าง components กับ overrides จึงชนะ style ของ component แต่แพ้ CSS ของแอปเอง',
          en: 'Classes live in <code>&#64;layer wiratheme.utilities</code>, between components and overrides: they beat component styles and lose to your app\'s own CSS.',
        },
        code: `@layer reset, wiratheme.tokens, wiratheme.components, wiratheme.utilities, wiratheme.overrides;`,
        codeLang: 'css',
      },
      {
        id: 'breakpoints',
        title: 'Breakpoints',
        classes: [
          ['sm:', { th: 'ตั้งแต่ 576px ขึ้นไป', en: '576px and up' }],
          ['md:', { th: 'ตั้งแต่ 768px ขึ้นไป', en: '768px and up' }],
          ['lg:', { th: 'ตั้งแต่ 992px ขึ้นไป', en: '992px and up' }],
          ['xl:', { th: 'ตั้งแต่ 1200px ขึ้นไป', en: '1200px and up' }],
        ],
      },
    ],
  },

  grid: {
    id: 'grid',
    title: 'Grid',
    lead: {
      th: 'grid 12 คอลัมน์แบบ flexbox: ใส่ <code>grid</code> ที่ตัวครอบ และ <code>col-*</code> ที่ลูก ปรับระยะห่างด้วย <code>--wt-grid-gutter</code>',
      en: 'A 12-column flexbox grid: <code>grid</code> on the wrapper, <code>col-*</code> on the children. Change the spacing with <code>--wt-grid-gutter</code>.',
    },
    sections: [
      {
        id: 'columns',
        title: { th: 'คอลัมน์', en: 'Columns' },
        text: { th: '<code>col-1</code> ถึง <code>col-12</code> กินพื้นที่ตามสัดส่วนของ 12', en: '<code>col-1</code> to <code>col-12</code> take that share of 12.' },
        demo: `<div class="grid">\n${cols(['col-12', 'col-6', 'col-6', 'col-4', 'col-4', 'col-4', 'col-3', 'col-9'])}\n</div>`,
      },
      {
        id: 'auto',
        title: { th: 'กว้างอัตโนมัติ', en: 'Automatic width' },
        text: {
          th: '<code>col</code> แบ่งที่ว่างเท่า ๆ กัน <code>col-fixed</code> กว้างตามเนื้อหา',
          en: '<code>col</code> shares the space equally; <code>col-fixed</code> is as wide as its content.',
        },
        demo: `<div class="grid">\n${cols(['col', 'col', 'col'])}\n</div>\n<div class="grid">\n  <div class="col-fixed">${box('col-fixed', 'docs-u-fixed')}</div>\n  <div class="col">${box('col')}</div>\n</div>`,
      },
      {
        id: 'offset',
        title: 'Offset',
        text: { th: '<code>col-offset-N</code> เว้นที่ด้านซ้าย N คอลัมน์', en: '<code>col-offset-N</code> leaves N columns empty on the left.' },
        demo: `<div class="grid">\n  <div class="col-6 col-offset-3">${box('col-6 col-offset-3')}</div>\n  <div class="col-4 col-offset-8">${box('col-4 col-offset-8')}</div>\n</div>`,
      },
      {
        id: 'responsive',
        title: 'Responsive',
        text: {
          th: 'ใส่ <code>sm:</code> <code>md:</code> <code>lg:</code> <code>xl:</code> หน้า class เพื่อให้มีผลตั้งแต่ความกว้างนั้นขึ้นไป ลองเปลี่ยนความกว้างของกรอบด้านล่าง',
          en: 'Prefix a class with <code>sm:</code> <code>md:</code> <code>lg:</code> or <code>xl:</code> to apply it from that width up. Change the width of the frame below.',
        },
        frame: true,
        demo: `<div class="grid">\n${cols(['col-12 md:col-6 lg:col-3', 'col-12 md:col-6 lg:col-3', 'col-12 md:col-6 lg:col-3', 'col-12 md:col-6 lg:col-3'])}\n</div>`,
      },
      {
        id: 'gutter',
        title: 'Gutter',
        text: {
          th: '<code>grid-nogutter</code> ไม่มีระยะห่าง หรือตั้ง <code>--wt-grid-gutter</code> บนตัวครอบเพื่อเปลี่ยนเฉพาะจุด',
          en: '<code>grid-nogutter</code> removes the spacing; set <code>--wt-grid-gutter</code> on a wrapper to change it locally.',
        },
        demo: `<div class="grid grid-nogutter">\n${cols(['col-4', 'col-4', 'col-4'])}\n</div>`,
        code: `<div class="grid grid-nogutter">…</div>\n\n/* หรือ */\n.dense { --wt-grid-gutter: 0.25rem; }`,
      },
    ],
  },

  flex: {
    id: 'flex',
    title: 'Flex',
    lead: {
      th: 'จัด layout ด้วย flexbox: ทิศทาง การขึ้นบรรทัด การจัดตำแหน่ง ระยะห่าง และลำดับ',
      en: 'Flexbox layout: direction, wrapping, alignment, gaps and order.',
    },
    sections: [
      {
        id: 'direction',
        title: { th: 'ทิศทาง', en: 'Direction' },
        demo: `<div class="flex flex-column md:flex-row gap-2">\n  ${box('1')}\n  ${box('2')}\n  ${box('3')}\n</div>`,
        classes: [
          ['flex · inline-flex', { th: 'เปิด flexbox', en: 'Turn on flexbox' }],
          ['flex-row · flex-column (-reverse)', { th: 'ทิศทางของลูก', en: 'Direction of the children' }],
          ['flex-wrap · flex-nowrap', { th: 'ขึ้นบรรทัดใหม่หรือไม่', en: 'Wrap or not' }],
        ],
      },
      {
        id: 'justify',
        title: { th: 'จัดแนวนอน', en: 'Justify' },
        demo: rows(['start', 'center', 'end', 'between', 'around', 'evenly'].map((v) => `justify-content-${v}`), (c) => `flex ${c} gap-2 p-2 docs-u-frame`, [box('A'), box('B'), box('C')]),
        code: ['start', 'center', 'end', 'between', 'around', 'evenly'].map((v) => `<div class="flex justify-content-${v} gap-2">…</div>`).join('\n'),
        classes: [['justify-content-start · center · end · between · around · evenly', { th: 'การกระจายตามแกนหลัก', en: 'Spread along the main axis' }]],
      },
      {
        id: 'align',
        title: { th: 'จัดแนวตั้ง', en: 'Align' },
        demo: rows(['start', 'center', 'end', 'stretch'].map((v) => `align-items-${v}`), (c) => `flex ${c} gap-2 p-2 docs-u-frame docs-u-tall`, [box('A'), box('B', 'docs-u-big'), box('C')]),
        code: ['start', 'center', 'end', 'stretch'].map((v) => `<div class="flex align-items-${v} gap-2">…</div>`).join('\n'),
        classes: [
          ['align-items-start · center · end · stretch · baseline', { th: 'การจัดตามแกนขวาง', en: 'Alignment on the cross axis' }],
          ['align-self-*', { th: 'เฉพาะตัวลูกตัวนั้น', en: 'For one child' }],
        ],
      },
      {
        id: 'center',
        title: { th: 'กึ่งกลางทั้งสองแกน', en: 'Centre on both axes' },
        demo: `<div class="flex align-items-center justify-content-center docs-u-frame docs-u-tall">\n  ${box('align-items-center justify-content-center')}\n</div>`,
        classes: [['flex align-items-center justify-content-center', { th: 'วางของไว้ตรงกลางกล่องทั้งแนวตั้งและแนวนอน', en: 'Put the content in the middle of the box, both ways' }]],
      },
      {
        id: 'gap',
        title: { th: 'ระยะห่างและลำดับ', en: 'Gap and order' },
        demo: `<div class="flex flex-wrap gap-3">\n  <div class="flex-order-2">${box('1 · flex-order-2')}</div>\n  <div class="flex-order-1">${box('2 · flex-order-1')}</div>\n  <div class="flex-1">${box('3 · flex-1')}</div>\n</div>`,
        classes: [
          ['gap-0 … gap-8 · row-gap-* · column-gap-*', { th: 'ระยะห่างระหว่างลูก (สเกลเดียวกับ spacing)', en: 'Space between children (same scale as spacing)' }],
          ['flex-order-0 … flex-order-6', { th: 'ลำดับการแสดง', en: 'Display order' }],
          ['flex-1 · flex-auto · flex-none · flex-grow-* · flex-shrink-*', { th: 'การยืดหด', en: 'Grow and shrink' }],
        ],
      },
    ],
  },

  spacing: {
    id: 'spacing',
    title: 'Spacing',
    lead: {
      th: 'padding และ margin สเกล 0–8 = 0, .25, .5, 1, 1.5, 2, 3, 4, 5rem ใส่ด้านด้วย t r b l x y',
      en: 'Padding and margin on a 0–8 scale = 0, .25, .5, 1, 1.5, 2, 3, 4, 5rem, with sides t r b l x y.',
    },
    sections: [
      {
        id: 'padding',
        title: 'Padding',
        demo: `<div class="flex flex-wrap gap-3">\n  <div class="docs-u-frame p-1">${box('p-1')}</div>\n  <div class="docs-u-frame p-3">${box('p-3')}</div>\n  <div class="docs-u-frame px-5 py-2">${box('px-5 py-2')}</div>\n</div>`,
        classes: [
          ['p-0 … p-8', { th: 'ทุกด้าน', en: 'All sides' }],
          ['pt-* · pr-* · pb-* · pl-*', { th: 'ด้านเดียว', en: 'One side' }],
          ['px-* · py-*', { th: 'แนวนอน / แนวตั้ง', en: 'Horizontal / vertical' }],
        ],
      },
      {
        id: 'margin',
        title: 'Margin',
        demo: `<div class="docs-u-frame">\n  <div class="w-6 mx-auto">${box('w-6 mx-auto')}</div>\n  <div class="w-4 mt-3 ml-auto">${box('mt-3 ml-auto')}</div>\n</div>`,
        classes: [
          ['m-0 … m-8 · mt-* · mx-* …', { th: 'เหมือน padding', en: 'Same as padding' }],
          ['m-auto · mx-auto · ml-auto …', { th: 'ใช้จัดกึ่งกลางหรือดันไปชิดอีกด้าน', en: 'Centre, or push to the other side' }],
          ['-m-1 … -m-8 · -mt-* …', { th: 'ค่าติดลบ', en: 'Negative values' }],
        ],
      },
    ],
  },

  sizing: {
    id: 'sizing',
    title: 'Sizing',
    lead: { th: 'ความกว้าง ความสูง และค่าต่ำสุด / สูงสุด', en: 'Width, height, and their minimums and maximums.' },
    sections: [
      {
        id: 'width',
        title: { th: 'ความกว้าง', en: 'Width' },
        demo: `<div class="flex flex-column gap-2">\n  ${box('w-full', 'w-full')}\n  ${box('w-6', 'w-6')}\n  ${box('w-10rem', 'w-10rem')}\n  ${box('w-fit', 'w-fit')}\n</div>`,
        classes: [
          ['w-full · w-screen · w-auto · w-min · w-max · w-fit', { th: 'ค่าสำเร็จรูป', en: 'Keywords' }],
          ['w-1 … w-12', { th: 'สัดส่วนของ 12 (w-6 = 50%)', en: 'Share of 12 (w-6 = 50%)' }],
          ['w-1rem … w-30rem', { th: 'ขนาดตายตัว', en: 'Fixed sizes' }],
        ],
      },
      {
        id: 'height',
        title: { th: 'ความสูงและค่าจำกัด', en: 'Height and limits' },
        classes: [
          ['h-full · h-screen · h-auto · h-1rem … h-30rem', { th: 'แบบเดียวกับ w-', en: 'Same as w-' }],
          ['min-w-0 · min-w-full · min-h-screen …', { th: 'ค่าต่ำสุด', en: 'Minimums' }],
          ['max-w-full · max-h-screen …', { th: 'ค่าสูงสุด', en: 'Maximums' }],
        ],
      },
    ],
  },

  typography: {
    id: 'typography',
    title: 'Typography',
    lead: { th: 'ขนาด น้ำหนัก การจัดวาง และการตัดข้อความ', en: 'Size, weight, alignment and truncation.' },
    sections: [
      {
        id: 'size',
        title: { th: 'ขนาดและน้ำหนัก', en: 'Size and weight' },
        demo: `<div class="flex flex-column gap-1">\n  <span class="text-sm">text-sm ตัวอักษรเล็ก</span>\n  <span class="text-xl font-medium">text-xl font-medium</span>\n  <span class="text-3xl font-bold">text-3xl font-bold</span>\n</div>`,
        classes: [
          ['text-xs · sm · base · lg · xl · 2xl … 8xl', { th: 'ขนาดตัวอักษร', en: 'Font size' }],
          ['font-light · normal · medium · semibold · bold', { th: 'น้ำหนัก', en: 'Weight' }],
          ['line-height-1 … line-height-4', { th: 'ระยะบรรทัด', en: 'Line height' }],
        ],
      },
      {
        id: 'style',
        title: { th: 'การจัดวางและรูปแบบ', en: 'Alignment and style' },
        demo: `<p class="text-center uppercase m-0">text-center uppercase</p>\n<p class="text-right underline m-0">text-right underline</p>\n<div class="w-12rem white-space-nowrap overflow-hidden text-overflow-ellipsis">text-overflow-ellipsis ตัดข้อความที่ยาวเกินกล่อง</div>`,
        classes: [
          ['text-left · center · right · justify', { th: 'จัดแนว', en: 'Alignment' }],
          ['uppercase · lowercase · capitalize', { th: 'ตัวพิมพ์', en: 'Case' }],
          ['underline · line-through · no-underline · font-italic', { th: 'ตกแต่ง', en: 'Decoration' }],
          ['white-space-nowrap · text-overflow-ellipsis', { th: 'ไม่ตัดบรรทัด / ตัดด้วย …', en: 'No wrap / ellipsis' }],
        ],
      },
    ],
  },

  colors: {
    id: 'colors',
    title: { th: 'สี', en: 'Colours' },
    lead: {
      th: 'class สีอ่านจากธีม จึงเปลี่ยนตาม preset และ dark mode ส่วนชุด palette มีสีคงที่',
      en: 'Colour classes read the theme, so they follow the preset and dark mode. The palette set has fixed colours.',
    },
    sections: [
      {
        id: 'theme',
        title: { th: 'สีตามธีม', en: 'Theme colours' },
        demo: `<div class="flex flex-wrap gap-2">\n  <div class="p-3 border-round bg-primary">bg-primary</div>\n  <div class="p-3 border-round bg-primary-100 text-primary-700">bg-primary-100</div>\n  <div class="p-3 border-round surface-card border-1 surface-border text-color">surface-card</div>\n  <div class="p-3 border-round surface-ground text-color-secondary">surface-ground</div>\n  <div class="p-3 border-round bg-success text-white">bg-success</div>\n  <div class="p-3 border-round bg-danger text-white">bg-danger</div>\n</div>`,
        classes: [
          ['text-color · text-color-secondary · text-primary · bg-primary', { th: 'สีหลักของธีม', en: 'Main theme colours' }],
          ['surface-ground · section · card · overlay · hover · border', { th: 'พื้นผิวตามธีม', en: 'Theme surfaces' }],
          ['surface-0 … surface-950', { th: 'ไล่เฉด surface', en: 'Surface scale' }],
          ['text- / bg- / border-primary-50 … 950', { th: 'ไล่เฉดสีหลัก', en: 'Primary scale' }],
          ['text- / bg- / border-gray-*', { th: 'เท่ากับ surface ของธีม', en: 'Same as the theme surface' }],
          ['text- / bg- / border-success · info · warn · danger · help', { th: 'สีตามความหมาย', en: 'Semantic colours' }],
        ],
      },
      {
        id: 'palette',
        title: 'Palette',
        text: {
          th: 'สีคงที่ไม่ขึ้นกับธีม: blue, green, yellow, cyan, pink, indigo, teal, orange, bluegray, purple, red, emerald, lime, sky, violet, fuchsia, rose, amber เฉด 50–900',
          en: 'Fixed colours that ignore the theme: blue, green, yellow, cyan, pink, indigo, teal, orange, bluegray, purple, red, emerald, lime, sky, violet, fuchsia, rose and amber, shades 50–900.',
        },
        demo: `<div class="flex flex-wrap gap-2">\n  <div class="p-3 border-round bg-blue-100 text-blue-800">blue</div>\n  <div class="p-3 border-round bg-teal-100 text-teal-800">teal</div>\n  <div class="p-3 border-round bg-amber-100 text-amber-800">amber</div>\n  <div class="p-3 border-round bg-rose-100 text-rose-800">rose</div>\n  <div class="p-3 border-round bg-violet-100 text-violet-800">violet</div>\n</div>`,
      },
    ],
  },

  borders: {
    id: 'borders',
    title: { th: 'เส้นขอบและเงา', en: 'Borders and shadows' },
    lead: { th: 'ความหนา ด้าน รูปแบบ ความมน และเงา', en: 'Width, sides, style, radius and elevation.' },
    sections: [
      {
        id: 'border',
        title: { th: 'เส้นขอบ', en: 'Borders' },
        demo: `<div class="flex flex-wrap gap-3">\n  <div class="p-3 border-1 surface-border border-round">border-1</div>\n  <div class="p-3 border-2 border-primary border-round-lg">border-2</div>\n  <div class="p-3 border-top-2 border-dashed border-primary">border-top-2 dashed</div>\n  <div class="docs-u-avatar border-circle">●</div>\n</div>`,
        classes: [
          ['border-1 · 2 · 3 · border-none', { th: 'ความหนา', en: 'Width' }],
          ['border-top-* · right · bottom · left · x · y', { th: 'ด้านเดียว', en: 'One side' }],
          ['border-solid · dashed · dotted', { th: 'รูปแบบ', en: 'Style' }],
          ['border-round(-xs … -xl) · -left · -right · -top · -bottom · border-circle', { th: 'ความมน', en: 'Radius' }],
        ],
      },
      {
        id: 'shadow',
        title: { th: 'เงา', en: 'Shadows' },
        demo: `<div class="flex flex-wrap gap-3">\n  <div class="p-3 surface-card border-round shadow-1">shadow-1</div>\n  <div class="p-3 surface-card border-round shadow-4">shadow-4</div>\n  <div class="p-3 surface-card border-round shadow-8">shadow-8</div>\n  <div class="p-3 surface-card border-round shadow-md">shadow-md</div>\n</div>`,
        classes: [
          ['shadow-1 … shadow-8', { th: 'ระดับเงา', en: 'Elevation levels' }],
          ['shadow-sm · md · lg', { th: 'เงาตามธีม', en: 'The theme\'s elevation' }],
        ],
      },
    ],
  },

  misc: {
    id: 'misc',
    title: { th: 'ตำแหน่งและอื่น ๆ', en: 'Position and more' },
    lead: { th: 'position, z-index, overflow และ class เล็ก ๆ ที่ใช้บ่อย', en: 'Position, z-index, overflow and small everyday helpers.' },
    sections: [
      {
        id: 'position',
        title: { th: 'ตำแหน่ง', en: 'Position' },
        demo: `<div class="relative docs-u-frame docs-u-tall">\n  <span class="absolute top-0 right-0 m-2 px-2 border-round bg-primary text-sm">absolute top-0 right-0</span>\n</div>`,
        classes: [
          ['static · relative · absolute · fixed · sticky', { th: 'position', en: 'position' }],
          ['top-0 · right-0 · bottom-0 · left-0 …', { th: 'ระยะจากขอบ', en: 'Offsets' }],
          ['z-0 … z-5', { th: 'ลำดับซ้อน', en: 'Stacking order' }],
        ],
      },
      {
        id: 'other',
        title: { th: 'อื่น ๆ', en: 'Other' },
        classes: [
          ['overflow-auto · hidden · visible · scroll · clip (-x / -y)', { th: 'การล้น', en: 'Overflow' }],
          ['cursor-pointer · default · text · move · wait · not-allowed', 'cursor'],
          ['select-none · text · all · auto', { th: 'การเลือกข้อความ', en: 'Text selection' }],
          ['opacity-0 … opacity-100', { th: 'ความทึบ', en: 'Opacity' }],
          ['sr-only', { th: 'ซ่อนจากตาแต่ screen reader ยังอ่าน', en: 'Hidden visually, read by screen readers' }],
          ['hidden · block · inline · inline-block', 'display'],
        ],
      },
    ],
  },

  forms: {
    id: 'forms',
    title: { th: 'จัด layout ฟอร์ม', en: 'Form layout' },
    lead: {
      th: 'class ช่วยวางฟอร์ม: label เหนือช่อง ช่องติ๊กคู่ข้อความ ฟอร์มหลายคอลัมน์ และฟอร์มแนวนอน',
      en: 'Helpers for laying out forms: labels above fields, checkboxes with text, multi-column forms and inline forms.',
    },
    sections: [
      {
        id: 'field',
        title: 'field · formgrid',
        demo: `<div class="formgrid grid">\n  <div class="field col-12 md:col-6">\n    <label for="u-first">ชื่อ</label>\n    <input id="u-first" class="docs-u-input w-full" />\n  </div>\n  <div class="field col-12 md:col-6">\n    <label for="u-last">นามสกุล</label>\n    <input id="u-last" class="docs-u-input w-full" />\n  </div>\n</div>`,
        classes: [
          ['field', { th: 'กลุ่ม label + ช่องกรอก มีระยะห่างด้านล่าง', en: 'Label + field group with bottom spacing' }],
          ['formgrid grid', { th: 'ฟอร์มหลายคอลัมน์ด้วย grid', en: 'Multi-column form on the grid' }],
        ],
      },
      {
        id: 'checkbox',
        title: 'field-checkbox · formgroup-inline',
        demo: `<div class="field-checkbox">\n  <input type="checkbox" id="u-news" />\n  <label for="u-news">รับข่าวสารทางอีเมล</label>\n</div>\n<div class="formgroup-inline">\n  <div class="field">\n    <input class="docs-u-input" placeholder="อีเมล" aria-label="อีเมล" />\n  </div>\n  <div class="field">\n    <button type="button" class="docs-u-button">สมัคร</button>\n  </div>\n</div>`,
        classes: [
          ['field-checkbox · field-radiobutton', { th: 'ช่องติ๊ก / radio คู่กับข้อความ', en: 'Checkbox / radio next to its text' }],
          ['formgroup-inline', { th: 'ช่องเรียงแนวนอน', en: 'Fields in a row' }],
        ],
      },
    ],
  },
};
