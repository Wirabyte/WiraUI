import { ComponentDoc } from '../core/component-doc';

export const CARD_DOC: ComponentDoc = {
  id: 'card',
  title: 'Card',
  group: 'Panel',
  entry: 'card',
  standalone: 'WtCard',
  module: 'WtCardModule',
  selector: 'wt-card',
  description: {
    th: 'กล่องเนื้อหาที่มี header / subheader และ slot สำหรับรูป ปุ่มข้างหัวการ์ด และ footer พร้อม variant outlined, elevated, glass และสถานะ loading',
    en: 'A content box with header / subheader and slots for media, header actions and a footer, plus outlined, elevated and glass variants and a loading state.',
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
        th: 'ใส่ attribute <code>wtCardHeader</code> (ด้านบนสุด เช่น รูป), <code>wtCardActions</code> (ข้างหัวการ์ด) และ <code>wtCardFooter</code> บน element ที่จะวาง ส่วนที่ไม่ได้ใส่จะไม่กินพื้นที่',
        en: 'Add <code>wtCardHeader</code> (top, e.g. an image), <code>wtCardActions</code> (next to the title) or <code>wtCardFooter</code> to the element you place. Unused slots take no space.',
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
        th: 'รูปเต็มความกว้างด้านบนด้วย <code>[wtCardHeader]</code> (กว้างราว 22rem รูปสูงราว 11.5rem และ <code>object-fit: cover</code>) ตามด้วยหัว ข้อความรอง เนื้อหา และปุ่ม ยกเลิก / บันทึก กว้างเท่ากันเต็มแถว',
        en: 'A full-bleed image with <code>[wtCardHeader]</code> (about 22rem wide, the image about 11.5rem tall with <code>object-fit: cover</code>), then the title, subtitle, a paragraph and equal full-width Cancel / Save buttons.',
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
    basic: `<wt-card header="โปรไฟล์" subheader="ข้อมูลบัญชี">
  <p>สมชาย ใจดี · สมาชิกตั้งแต่ 2566 · แผน Pro</p>
</wt-card>`,
    slots: `<wt-card header="แผน Pro" subheader="รายเดือน">
  <div wtCardHeader class="cover">฿290 / เดือน</div>
  <wt-button wtCardActions icon="pi pi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wt-button>
  <p>5 โปรเจค · พื้นที่ 50 GB · ผู้ใช้ไม่จำกัด</p>
  <div wtCardFooter>
    <wt-button label="อัปเกรด" size="small"></wt-button>
    <wt-button label="รายละเอียด" size="small" severity="secondary" [text]="true"></wt-button>
  </div>
</wt-card>`,
    variants: `<wt-card header="Default"></wt-card>
<wt-card header="Outlined" variant="outlined"></wt-card>
<wt-card header="Elevated" variant="elevated"></wt-card>
<wt-card header="Glass" variant="glass"></wt-card>`,
    advanced: `<wt-card header="ทริปทะเลสาบยามเย็น" subheader="3 วัน 2 คืน · เชียงใหม่" [style]="{ width: '22rem' }">
  <img wtCardHeader src="assets/lake.jpg" alt="ทะเลสาบยามเย็น" class="card-cover" />
  <p>พักริมทะเลสาบ ล่องเรือชมพระอาทิตย์ตก และอาหารเย็นจากฟาร์มท้องถิ่น</p>
  <div wtCardFooter class="card-actions">
    <wt-button label="ยกเลิก" severity="secondary" [outlined]="true" [fluid]="true"></wt-button>
    <wt-button label="บันทึก" [fluid]="true"></wt-button>
  </div>
</wt-card>

<!-- styles.css
.card-cover { display: block; width: 100%; height: 11.5rem; object-fit: cover; }
.card-actions { display: flex; gap: 1rem; }
.card-actions > * { flex: 1 1 0; } -->`,
    loading: `<wt-card header="ยอดขายเดือนนี้" [loading]="loading">
  <p>฿128,400 จาก 312 คำสั่งซื้อ</p>
</wt-card>`,
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
          type: 'WtCardVariant',
          default: "'default'",
          description: {
            th: 'outlined ไม่มีเงา · elevated มีเงาไม่มีขอบ · glass พื้นกระจก (เฉพาะ v3 ถอยเป็นพื้นทึบเองถ้าเบราว์เซอร์ไม่รองรับ)',
            en: 'outlined: no shadow · elevated: shadow, no border · glass: frosted (v3 only; solid fallback without browser support)',
          },
        },
        { name: 'loading', type: 'boolean', default: 'false', description: { th: 'แสดง skeleton แทนเนื้อหา', en: 'Shows skeleton lines instead of the content' } },
      ],
    },
    {
      id: 'api-slots',
      title: 'Slots',
      typeLabel: { th: 'ใส่ด้วย', en: 'Use' },
      rows: [
        { name: 'wtCardHeader', type: 'attribute', description: { th: 'ส่วนบนสุดของการ์ด เช่น รูปภาพ', en: 'Top of the card, e.g. an image' } },
        { name: 'wtCardActions', type: 'attribute', description: { th: 'ปุ่มหรือเมนูทางขวาของหัวการ์ด', en: 'Buttons or a menu to the right of the title' } },
        { name: '(default)', type: 'content', description: { th: 'เนื้อหาของการ์ด', en: 'Card content' } },
        { name: 'wtCardFooter', type: 'attribute', description: { th: 'ส่วนท้าย เรียงแนวนอนและขึ้นบรรทัดใหม่เองเมื่อแคบ', en: 'Footer row that wraps on narrow screens' } },
      ],
      note: {
        th: 'slot ที่ว่างจะหายไปเอง ระยะห่าง body gap จึงอยู่ระหว่างส่วนที่มีจริงเท่านั้น',
        en: 'Empty slots collapse, so the body gap only sits between parts that are there.',
      },
    },
    { id: 'api-types', title: 'Types', code: `type WtCardVariant = 'default' | 'outlined' | 'elevated' | 'glass';` },
  ],
  tokens: [
    { name: '--wt-card-bg', description: { th: 'พื้นของการ์ด', en: 'Background' } },
    { name: '--wt-card-padding', description: { th: 'ระยะขอบด้านใน', en: 'Inner padding' } },
    { name: '--wt-card-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wt-card-shadow', description: { th: 'เงา', en: 'Shadow' } },
    { name: '--wt-card-body-gap', description: { th: 'ระยะระหว่างหัว เนื้อหา และ footer', en: 'Gap between title, content and footer' } },
    { name: '--wt-card-border-width', description: { th: 'ความหนาเส้นขอบ', en: 'Border width' } },
    { name: '--wt-card-title-size', description: { th: 'ขนาดหัวการ์ด', en: 'Title size' } },
    { name: '--wt-card-title-weight', description: { th: 'น้ำหนักหัวการ์ด', en: 'Title weight' } },
    { name: '--wt-border', description: { th: 'สีเส้นขอบ', en: 'Border colour' } },
    { name: '--wt-shadow-md', description: { th: 'เงาของ elevated', en: 'elevated shadow' } },
    { name: '--wt-text-muted', description: { th: 'สี subheader', en: 'Subheader colour' } },
    { name: '--wt-glass-bg', description: { th: 'พื้นของ glass', en: 'glass background' } },
    { name: '--wt-glass-blur', description: { th: 'ความเบลอของ glass', en: 'glass blur' } },
    { name: '--wt-glass-border', description: { th: 'ขอบของ glass', en: 'glass border' } },
    { name: '--wt-glass-shadow', description: { th: 'เงาของ glass', en: 'glass shadow' } },
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
    variants: `<wt-card header="Default"></wt-card>
<wt-card header="Outlined" variant="outlined"></wt-card>
<wt-card header="Elevated" variant="elevated"></wt-card>`,
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
        ? { ...g, code: `type WtCardVariant = 'default' | 'outlined' | 'elevated';` }
        : g
  ),
  tokens: CARD_DOC.tokens.filter((t) => !t.name.startsWith('--wt-glass')),
};
