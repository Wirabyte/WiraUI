import { ComponentDoc } from '../core/component-doc';
import { STYLE_ROW } from './doc-helpers';

export const CARD_DOC: ComponentDoc = {
  id: 'card',
  title: 'Card',
  group: 'Panel',
  entry: 'card',
  standalone: 'WuCard',
  module: 'WuCardModule',
  selector: 'wu-card',
  description: {
    th: 'กล่องเนื้อหาที่มี header / subheader และ slot สำหรับรูป ปุ่มข้างหัวการ์ด และ footer พร้อม variant outlined, elevated, glass และสถานะ loading',
    en: 'A content box with header / subheader and slots for media, header actions and a footer, plus outlined, elevated and glass variants and a loading state.',
  },
  english: {
    'โปรไฟล์': 'Profile',
    'ข้อมูลบัญชี': 'Account details',
    'สมชาย ใจดี · สมาชิกตั้งแต่ 2566 · แผน Pro': 'Alex Morgan · Member since 2023 · Pro plan',
    'แผน Pro': 'Pro plan',
    'รายเดือน': 'Monthly',
    '฿290 / เดือน': '฿290 / month',
    '5 โปรเจค · พื้นที่ 50 GB · ผู้ใช้ไม่จำกัด': '5 projects · 50 GB storage · unlimited users',
    'อัปเกรด': 'Upgrade',
    'รายละเอียด': 'Details',
    'ขอบบาง + เงาอ่อน': 'Thin border, soft shadow',
    'มีขอบ ไม่มีเงา': 'Border, no shadow',
    'ไม่มีขอบ เงาชัด': 'Shadow, no border',
    'พื้นกระจก': 'Frosted glass',
    'ทริปทะเลสาบยามเย็น': 'Lakeside evening trip',
    '3 วัน 2 คืน · เชียงใหม่': '3 days, 2 nights · Chiang Mai',
    'ทะเลสาบยามเย็น': 'A lake at dusk',
    'พักริมทะเลสาบ ล่องเรือชมพระอาทิตย์ตก และอาหารเย็นจากฟาร์มท้องถิ่น': 'Stay by the lake, take a sunset boat ride and have dinner from a local farm.',
    'ยอดขายเดือนนี้': "This month's sales",
    '฿128,400 จาก 312 คำสั่งซื้อ': '฿128,400 from 312 orders',
    'ข่าวรับสมัคร': 'Admissions news',
    'ปีการศึกษา 2569': '2026 school year',
    'เปิดรับสมัครนักเรียนชั้น ม.1 และ ม.4': 'Applications are open for grades 7 and 10',
    'สมัครเลย': 'Apply now',
    'ประกาศ': 'Notice',
    'ปิดภาคเรียนวันที่ 1 ตุลาคม': 'Term ends on 1 October',
    'อัปเดตเมื่อวานนี้': 'Updated yesterday',
  },
  sections: {
    import: { title: 'Import' },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่หัวการ์ดด้วย <code>header</code> และ <code>subheader</code> เนื้อหาใส่ไว้ข้างในได้เลย',
        en: 'Set the title with <code>header</code> and <code>subheader</code>; put the content inside.',
      },
    },
    slots: {
      title: 'Slots',
      text: {
        th: 'ใส่ attribute <code>wuCardHeader</code> (ด้านบนสุด เช่น รูป), <code>wuCardActions</code> (ข้างหัวการ์ด) และ <code>wuCardFooter</code> บน element ที่จะวาง ส่วนที่ไม่ได้ใส่จะไม่กินพื้นที่',
        en: 'Add <code>wuCardHeader</code> (top, e.g. an image), <code>wuCardActions</code> (next to the title) or <code>wuCardFooter</code> to the element you place. Unused slots take no space.',
      },
    },
    templates: {
      title: 'Templates',
      text: {
        th: 'template <code>header</code>, <code>title</code>, <code>subtitle</code>, <code>content</code> และ <code>footer</code> (เขียนเป็น <code>#name</code>, <code>wuTemplate</code> หรือ <code>pTemplate</code>) แบบที่ template เดิมใช้ ทำงานเหมือน slot · element <code>&lt;wu-header&gt;</code> และ <code>&lt;wu-footer&gt;</code> วางในการ์ดได้เลยเหมือน <code>wuCardHeader</code> / <code>wuCardFooter</code> · <code>styleClass</code> และ <code>style</code> (object) ใส่ที่กล่องการ์ด',
        en: 'The <code>header</code>, <code>title</code>, <code>subtitle</code>, <code>content</code> and <code>footer</code> templates (as <code>#name</code>, <code>wuTemplate</code> or <code>pTemplate</code>) that older templates use work like the slots · the <code>&lt;wu-header&gt;</code> and <code>&lt;wu-footer&gt;</code> elements go straight into the card like <code>wuCardHeader</code> / <code>wuCardFooter</code> · <code>styleClass</code> and <code>style</code> (an object) go on the card box.',
      },
    },
    variants: {
      title: 'Variants',
      text: {
        th: '<code>glass</code> ใช้ token กลุ่ม Liquid Glass เบลอสิ่งที่อยู่ข้างหลัง และถอยเป็นพื้นทึบเองถ้าเบราว์เซอร์ไม่รองรับ <code>backdrop-filter</code>',
        en: '<code>glass</code> uses the Liquid Glass tokens to blur what is behind it, and falls back to a solid card when the browser lacks <code>backdrop-filter</code>.',
      },
    },
    advanced: {
      title: 'Advanced',
      text: {
        th: 'รูปเต็มความกว้างด้านบนด้วย <code>[wuCardHeader]</code> (กว้างราว 22rem รูปสูงราว 11.5rem และ <code>object-fit: cover</code>) ตามด้วยหัว ข้อความรอง เนื้อหา และปุ่ม ยกเลิก / บันทึก กว้างเท่ากันเต็มแถว',
        en: 'A full-bleed image with <code>[wuCardHeader]</code> (about 22rem wide, the image about 11.5rem tall with <code>object-fit: cover</code>), then the title, subtitle, a paragraph and equal full-width Cancel / Save buttons.',
      },
    },
    loading: {
      title: 'Loading',
      text: {
        th: '<code>loading</code> แสดง skeleton แทนเนื้อหาระหว่างรอข้อมูล หัวการ์ดยังแสดงอยู่',
        en: '<code>loading</code> shows skeleton lines instead of the content while data loads; the header stays visible.',
      },
    },
  },
  code: {
    basic: `<wu-card header="โปรไฟล์" subheader="ข้อมูลบัญชี">
  <p>สมชาย ใจดี · สมาชิกตั้งแต่ 2566 · แผน Pro</p>
</wu-card>`,
    slots: `<wu-card header="แผน Pro" subheader="รายเดือน">
  <div wuCardHeader class="cover">฿290 / เดือน</div>
  <wu-button wuCardActions icon="wi wi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wu-button>
  <p>5 โปรเจค · พื้นที่ 50 GB · ผู้ใช้ไม่จำกัด</p>
  <div wuCardFooter>
    <wu-button label="อัปเกรด" size="small"></wu-button>
    <wu-button label="รายละเอียด" size="small" severity="secondary" [text]="true"></wu-button>
  </div>
</wu-card>`,
    templates: `<wu-card styleClass="news-card" [style]="{ maxWidth: '26rem' }">
  <ng-template #header>
    <div class="cover">ปีการศึกษา 2569</div>
  </ng-template>
  <ng-template #title>ข่าวรับสมัคร</ng-template>
  <ng-template #subtitle>ปีการศึกษา 2569</ng-template>
  <ng-template #content>
    <p>เปิดรับสมัครนักเรียนชั้น ม.1 และ ม.4</p>
  </ng-template>
  <ng-template #footer>
    <wu-button label="สมัครเลย" size="small"></wu-button>
  </ng-template>
</wu-card>

<wu-card header="ประกาศ">
  <wu-header><div class="cover">ปิดภาคเรียนวันที่ 1 ตุลาคม</div></wu-header>
  <p>ปิดภาคเรียนวันที่ 1 ตุลาคม</p>
  <wu-footer>อัปเดตเมื่อวานนี้</wu-footer>
</wu-card>`,
    variants: `<wu-card header="Default"></wu-card>
<wu-card header="Outlined" variant="outlined"></wu-card>
<wu-card header="Elevated" variant="elevated"></wu-card>
<wu-card header="Glass" variant="glass"></wu-card>`,
    advanced: `<wu-card header="ทริปทะเลสาบยามเย็น" subheader="3 วัน 2 คืน · เชียงใหม่" [style]="{ width: '22rem' }">
  <img wuCardHeader src="assets/lake.jpg" alt="ทะเลสาบยามเย็น" class="card-cover" />
  <p>พักริมทะเลสาบ ล่องเรือชมพระอาทิตย์ตก และอาหารเย็นจากฟาร์มท้องถิ่น</p>
  <div wuCardFooter class="card-actions">
    <wu-button label="ยกเลิก" severity="secondary" [outlined]="true" [fluid]="true"></wu-button>
    <wu-button label="บันทึก" [fluid]="true"></wu-button>
  </div>
</wu-card>

<!-- styles.css
.card-cover { display: block; width: 100%; height: 11.5rem; object-fit: cover; }
.card-actions { display: flex; gap: 1rem; }
.card-actions > * { flex: 1 1 0; } -->`,
    loading: `<wu-card header="ยอดขายเดือนนี้" [loading]="isPageLoading">
  <p>฿128,400 จาก 312 คำสั่งซื้อ</p>
</wu-card>`,
  },
  ts: {
    loading: `isPageLoading = true;

ngOnInit(): void {
  this.reportService.getMonthlySales().subscribe((report) => {
    this.report = report;
    this.isPageLoading = false;
  });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        { name: 'header', type: 'string', description: { th: 'หัวการ์ด', en: 'Title' } },
        { name: 'subheader', type: 'string', description: { th: 'ข้อความรองใต้หัวการ์ด', en: 'Secondary line under the title' } },
        {
          name: 'variant',
          type: 'WuCardVariant',
          default: "'default'",
          description: {
            th: 'outlined ไม่มีเงา · elevated มีเงาไม่มีขอบ · glass พื้นกระจก (เฉพาะ v3 ถอยเป็นพื้นทึบเองถ้าเบราว์เซอร์ไม่รองรับ)',
            en: 'outlined: no shadow · elevated: shadow, no border · glass: frosted (v3 only; solid fallback without browser support)',
          },
        },
        { name: 'loading', type: 'boolean', default: 'false', description: { th: 'แสดง skeleton แทนเนื้อหา', en: 'Shows skeleton lines instead of the content' } },
        STYLE_ROW,
      ],
    },
    {
      id: 'api-slots',
      title: 'Slots',
      typeLabel: { th: 'ใส่ด้วย', en: 'Use' },
      rows: [
        { name: 'wuCardHeader', type: 'attribute', description: { th: 'ส่วนบนสุดของการ์ด เช่น รูปภาพ', en: 'Top of the card, e.g. an image' } },
        { name: 'wuCardActions', type: 'attribute', description: { th: 'ปุ่มหรือเมนูทางขวาของหัวการ์ด', en: 'Buttons or a menu to the right of the title' } },
        { name: '(default)', type: 'content', description: { th: 'เนื้อหาของการ์ด', en: 'Card content' } },
        { name: 'wuCardFooter', type: 'attribute', description: { th: 'ส่วนท้าย เรียงแนวนอนและขึ้นบรรทัดใหม่เองเมื่อแคบ', en: 'Footer row that wraps on narrow screens' } },
        { name: 'wu-header · wu-footer', type: 'element', description: { th: 'เหมือน wuCardHeader / wuCardFooter', en: 'Like wuCardHeader / wuCardFooter' } },
        { name: 'header · title · subtitle · content · footer', type: 'template', description: { th: 'template ของแต่ละส่วน (#name, wuTemplate หรือ pTemplate)', en: 'A template per part (#name, wuTemplate or pTemplate)' } },
      ],
      note: {
        th: 'slot ที่ว่างจะหายไปเอง ระยะห่าง body gap จึงอยู่ระหว่างส่วนที่มีจริงเท่านั้น',
        en: 'Empty slots collapse, so the body gap only sits between parts that are there.',
      },
    },
    { id: 'api-types', title: 'Types', code: `type WuCardVariant = 'default' | 'outlined' | 'elevated' | 'glass';` },
  ],
  tokens: [
    { name: '--wu-card-bg', description: { th: 'พื้นของการ์ด', en: 'Background' } },
    { name: '--wu-card-padding', description: { th: 'ระยะขอบด้านใน', en: 'Inner padding' } },
    { name: '--wu-card-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wu-card-shadow', description: { th: 'เงา', en: 'Shadow' } },
    { name: '--wu-card-body-gap', description: { th: 'ระยะระหว่างหัว เนื้อหา และ footer', en: 'Gap between title, content and footer' } },
    { name: '--wu-card-border-width', description: { th: 'ความหนาเส้นขอบ', en: 'Border width' } },
    { name: '--wu-card-title-size', description: { th: 'ขนาดหัวการ์ด', en: 'Title size' } },
    { name: '--wu-card-title-weight', description: { th: 'น้ำหนักหัวการ์ด', en: 'Title weight' } },
    { name: '--wu-border', description: { th: 'สีเส้นขอบ', en: 'Border colour' } },
    { name: '--wu-shadow-md', description: { th: 'เงาของ elevated', en: 'elevated shadow' } },
    { name: '--wu-text-muted', description: { th: 'สี subheader', en: 'Subheader colour' } },
    { name: '--wu-glass-bg', description: { th: 'พื้นของ glass', en: 'glass background' } },
    { name: '--wu-glass-blur', description: { th: 'ความเบลอของ glass', en: 'glass blur' } },
    { name: '--wu-glass-border', description: { th: 'ขอบของ glass', en: 'glass border' } },
    { name: '--wu-glass-shadow', description: { th: 'เงาของ glass', en: 'glass shadow' } },
  ],
  overrides: `    card: { padding: '1rem', radius: '12px', bodyGap: '0', bordered: false },`,
};

/** v1 and v2 have no glass card: the same page without it. */
export const CARD_DOC_CLASSIC: ComponentDoc = {
  ...CARD_DOC,
  description: {
    th: 'กล่องเนื้อหาที่มี header / subheader และ slot สำหรับรูป ปุ่มข้างหัวการ์ด และ footer พร้อม variant outlined และ elevated และสถานะ loading',
    en: 'A content box with header / subheader and slots for media, header actions and a footer, plus outlined and elevated variants and a loading state.',
  },
  sections: {
    ...CARD_DOC.sections,
    variants: {
      title: 'Variants',
      text: { th: '<code>outlined</code> มีขอบไม่มีเงา · <code>elevated</code> มีเงาไม่มีขอบ', en: '<code>outlined</code> has a border and no shadow · <code>elevated</code> a shadow and no border.' },
    },
  },
  code: {
    ...CARD_DOC.code,
    variants: `<wu-card header="Default"></wu-card>
<wu-card header="Outlined" variant="outlined"></wu-card>
<wu-card header="Elevated" variant="elevated"></wu-card>`,
  },
  api: CARD_DOC.api.map((g) =>
    g.id === 'api-inputs'
      ? {
          ...g,
          rows: (g.rows || []).map((r) =>
            r.name === 'variant' ? { ...r, description: { th: 'outlined ไม่มีเงา · elevated มีเงาไม่มีขอบ', en: 'outlined: no shadow · elevated: shadow, no border' } } : r
          ),
        }
      : g.id === 'api-types'
        ? { ...g, code: `type WuCardVariant = 'default' | 'outlined' | 'elevated';` }
        : g
  ),
  tokens: CARD_DOC.tokens.filter((t) => !t.name.startsWith('--wu-glass')),
};
