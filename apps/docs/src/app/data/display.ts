import { ComponentDoc } from '../core/component-doc';
import { importText, row, SEVERITY_TYPE, STYLE_ROW, tok } from './doc-helpers';

const severities = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];

export const TAG_DOC: ComponentDoc = {
  id: 'tag',
  title: 'Tag',
  group: 'Display',
  entry: 'tag',
  standalone: 'WuTag',
  module: 'WuTagModule',
  selector: 'wu-tag',
  description: { th: 'ป้ายสั้น ๆ บอกสถานะหรือหมวดหมู่ มีสีตาม severity, แบบมนเต็ม และ icon', en: 'A short label for a status or category, with severity colours, a pill shape and an icon.' },
  english: {
    'ใหม่': 'New',
    'เปิดใช้งาน': 'Active',
    'ยืนยันแล้ว': 'Verified',
    'รออนุมัติ 3 รายการ': '3 awaiting approval',
    "'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')": "'warning' and 'error' work too (= 'warn' and 'danger')",
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: 'ใส่ข้อความด้วย <code>value</code>', en: 'Set the text with <code>value</code>.' } },
    severity: {
      title: 'Severity',
      text: { th: 'สีตามความหมาย <code>\'warning\'</code> และ <code>\'error\'</code> ใช้ได้เหมือน <code>\'warn\'</code> และ <code>\'danger\'</code>', en: 'Colour by meaning; <code>\'warning\'</code> and <code>\'error\'</code> work like <code>\'warn\'</code> and <code>\'danger\'</code>.' },
    },
    pill: { title: { th: 'มนเต็มและ icon', en: 'Pill and icon' } },
    content: { title: { th: 'เนื้อหาเอง', en: 'Custom content' }, text: { th: 'ไม่ใส่ <code>value</code> แล้ววางเนื้อหาไว้ข้างในแทนได้', en: 'Leave out <code>value</code> and put your own content inside.' } },
  },
  code: {
    basic: `<wu-tag value="ใหม่"></wu-tag>`,
    severity: severities.map((s) => `<wu-tag value="${s}" severity="${s}"></wu-tag>`).join('\n'),
    pill: `<wu-tag value="เปิดใช้งาน" severity="success" [rounded]="true"></wu-tag>
<wu-tag value="ยืนยันแล้ว" icon="wi wi-check" severity="info"></wu-tag>`,
    content: `<wu-tag severity="warn">
  <span class="wi wi-bell"></span> รออนุมัติ 3 รายการ
</wu-tag>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'string | number', undefined, 'ข้อความของป้าย', 'Tag text'),
        row('severity', 'WuSeverityInput', "'primary'", 'สีตามความหมาย', 'Colour by meaning'),
        row('rounded', 'boolean', 'false', 'มนเต็ม (pill)', 'Fully rounded (pill)'),
        row('icon', 'string', undefined, 'class ของ icon หน้าข้อความ', 'Icon class before the text'),
        STYLE_ROW,
      ],
    },
    { id: 'api-types', title: 'Types', code: SEVERITY_TYPE },
  ],
  tokens: [
    tok('--wu-tag-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wu-tag-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wu-tag-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wu-tag-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wu-tag-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wu-tag-gap', 'ระยะระหว่าง icon กับข้อความ', 'Gap between icon and text'),
    tok('--wu-tag-fill', 'พื้นแบบทึบหรือแบบอ่อน', 'Solid or soft fill'),
    tok('--wu-primary-soft', 'พื้นของ severity="primary"', 'severity="primary" background'),
    tok('--wu-success-bg', 'พื้นของ severity="success" (info / warn / danger / help แบบเดียวกัน)', 'severity="success" background (info / warn / danger / help alike)'),
    tok('--wu-radius-full', 'มุมของ rounded', 'rounded corners'),
  ],
  overrides: `    tag: { pill: true },`,
};

export const BADGE_DOC: ComponentDoc = {
  id: 'badge',
  title: 'Badge',
  group: 'Display',
  entry: 'badge',
  standalone: 'WuBadge',
  module: 'WuBadgeModule',
  selector: 'wu-badge',
  description: { th: 'ตัวเลขหรือจุดเล็ก ๆ บอกจำนวนหรือสถานะ ไม่ใส่ค่าจะเป็นจุด', en: 'A small count or dot. Without a value it is a dot.' },
  english: {
    'กล่องข้อความ': 'Inbox',
    'สถานะออนไลน์': 'Online',
    'อ่านทั้งหมด': 'Mark all read',
    'ข้อความที่ยังไม่อ่าน': 'unread messages',
    "'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')": "'warning' and 'error' work too (= 'warn' and 'danger')",
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: '<code>value</code> เป็นตัวเลขหรือข้อความสั้น ๆ ไม่ใส่จะเป็นจุด', en: '<code>value</code> is a number or short text; leave it out for a dot.' } },
    severity: { title: 'Severity' },
    sizes: { title: 'Sizes' },
    inline: { title: { th: 'วางคู่กับข้อความ', en: 'Next to text' } },
    directive: {
      title: { th: 'Badge ที่มุมของ element (wuBadge)', en: 'A corner badge on any element (wuBadge)' },
      text: {
        th: 'directive <code>wuBadge</code> (หรือ <code>pBadge</code>) วาง badge ที่มุมขวาบนของ element ใดก็ได้ เช่น ไอคอนกระดิ่ง รับ <code>value</code> (ไม่ใส่เป็นจุด), <code>severity</code>, <code>size</code> / <code>badgeSize</code>, <code>badgeStyleClass</code> และ <code>badgeStyle</code> · <code>[badgeDisabled]="true"</code> ซ่อน badge ตัวอย่างนี้ซ่อนเมื่อไม่มีข้อความที่ยังไม่อ่าน มาจาก <code>WuBadgeModule</code> ตัวเดียวกัน',
        en: 'The <code>wuBadge</code> (or <code>pBadge</code>) directive puts a badge on the top-right corner of any element, such as a bell icon. It takes <code>value</code> (a dot when left out), <code>severity</code>, <code>size</code> / <code>badgeSize</code>, <code>badgeStyleClass</code> and <code>badgeStyle</code> · <code>[badgeDisabled]="true"</code> hides it; here it hides once nothing is unread. It comes with the same <code>WuBadgeModule</code>.',
      },
    },
    style: {
      title: { th: 'class และ style', en: 'Class and style' },
      text: {
        th: '<code>styleClass</code> และ <code>style</code> (object) ใส่ที่ตัว badge ใช้ได้กับ component ทุกตัวในหมวด Display',
        en: '<code>styleClass</code> and <code>style</code> (an object) go on the badge itself; every Display component takes them.',
      },
    },
  },
  code: {
    basic: `<wu-badge value="8"></wu-badge>
<wu-badge></wu-badge>`,
    severity: severities.map((s, i) => `<wu-badge value="${i + 1}" severity="${s}"></wu-badge>`).join('\n'),
    sizes: `<wu-badge value="2"></wu-badge>
<wu-badge value="4" size="large"></wu-badge>
<wu-badge value="6" size="xlarge"></wu-badge>`,
    inline: `<span>กล่องข้อความ <wu-badge value="12" severity="danger"></wu-badge></span>
<span>สถานะออนไลน์ <wu-badge severity="success"></wu-badge></span>`,
    directive: `<span class="notify-icon" wuBadge [value]="unread" severity="danger" [badgeDisabled]="!unread">
  <i class="wi wi-bell"></i>
</span>
<span class="notify-icon" wuBadge severity="success"><i class="wi wi-envelope"></i></span>
<span class="notify-icon" pBadge value="2" badgeSize="large"><i class="wi wi-calendar"></i></span>
<wu-button label="อ่านทั้งหมด" severity="secondary" [text]="true" (onClick)="markRead()"></wu-button>`,
    style: `<wu-badge value="new" styleClass="uppercase" [style]="{ minWidth: '3rem' }"></wu-badge>`,
  },
  ts: {
    directive: `unread = 3;   // ข้อความที่ยังไม่อ่าน

markRead(): void {
  this.unread = 0;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'string | number', undefined, 'ค่าที่แสดง ไม่ใส่จะเป็นจุด', 'Value to show; a dot when left out'),
        row('severity', 'WuSeverityInput', "'primary'", 'สีตามความหมาย', 'Colour by meaning'),
        row('size', "'small' | 'large' | 'xlarge'", undefined, 'ขนาด', 'Size'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-directive',
      title: { th: 'Directive wuBadge', en: 'The wuBadge directive' },
      note: { th: 'ใส่บน element ใดก็ได้: wuBadge หรือ pBadge', en: 'On any element: wuBadge or pBadge.' },
      rows: [
        row('value', 'string | number', undefined, 'ค่าที่แสดง ไม่ใส่จะเป็นจุด', 'Value to show; a dot when left out'),
        row('severity', 'WuSeverityInput', "'primary'", 'สีตามความหมาย', 'Colour by meaning'),
        row('size · badgeSize', "'small' | 'large' | 'xlarge'", undefined, 'ขนาด', 'Size'),
        row('badgeDisabled', 'boolean', 'false', 'ซ่อน badge', 'Hide the badge'),
        row('badgeStyleClass · badgeStyle', 'string · object', undefined, 'class / style ของตัว badge', 'Class / style of the badge itself'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `type WuBadgeSize = 'small' | 'large' | 'xlarge';\n${SEVERITY_TYPE}` },
  ],
  tokens: [
    tok('--wu-badge-size', 'ความสูงและความกว้างขั้นต่ำ', 'Height and minimum width'),
    tok('--wu-badge-dot-size', 'ขนาดของจุด', 'Dot size'),
    tok('--wu-badge-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wu-badge-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wu-badge-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wu-primary-color', 'พื้นของ severity="primary"', 'severity="primary" background'),
    tok('--wu-primary-contrast', 'ตัวอักษรบน severity="primary"', 'Text on severity="primary"'),
    tok('--wu-radius-full', 'ความมน', 'Radius'),
  ],
};

const AVATAR_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e7ae0'/%3E%3Cstop offset='1' stop-color='%2314b8a6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' fill='url(%23g)'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%23fff' fill-opacity='.9'/%3E%3Cpath d='M12 58c3-12 11-18 20-18s17 6 20 18' fill='%23fff' fill-opacity='.9'/%3E%3C/svg%3E";
/** A data URI so the demos need no network; the code samples show a normal file path. */
export const SAMPLE_IMAGE = AVATAR_IMG;

export const CHIP_DOC: ComponentDoc = {
  id: 'chip',
  title: 'Chip',
  group: 'Display',
  entry: 'chip',
  standalone: 'WuChip',
  module: 'WuChipModule',
  selector: 'wu-chip',
  description: { th: 'ข้อมูลชิ้นเล็กแบบเม็ดยา มี icon หรือรูป และลบออกได้', en: 'A compact pill for a piece of data, with an icon or image, and optionally removable.' },
  english: {
    'ส่งแล้ว': 'Sent',
    'สมชาย ใจดี': 'Alex Morgan',
    'สมชาย': 'Alex',
    'คืนค่า': 'Reset',
    'ด่วน': 'Urgent',
    'ลูกค้าใหม่': 'New customer',
    'รอโทรกลับ': 'Call back',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic' },
    icon: { title: { th: 'Icon และรูป', en: 'Icon and image' } },
    removable: {
      title: 'Removable',
      text: {
        th: '<code>removable</code> แสดงปุ่มลบ เมื่อกดแล้ว chip ซ่อนตัวเองและส่ง <code>(onRemove)</code> ใช้ลบข้อมูลออกจาก list ของคุณ',
        en: '<code>removable</code> shows a remove button. Pressing it hides the chip and emits <code>(onRemove)</code>, where you remove the item from your list.',
      },
    },
  },
  code: {
    basic: `<wu-chip label="Angular"></wu-chip>
<wu-chip label="TypeScript"></wu-chip>
<wu-chip label="SCSS"></wu-chip>`,
    icon: `<wu-chip label="ส่งแล้ว" icon="wi wi-send"></wu-chip>
<wu-chip label="สมชาย ใจดี" image="assets/avatar.png" alt="สมชาย"></wu-chip>`,
    removable: {
      classic: `<wu-chip *ngFor="let t of tags" [label]="t" [removable]="true" (onRemove)="remove(t)"></wu-chip>`,
      v3: `@for (t of tags; track t) {
<wu-chip [label]="t" [removable]="true" (onRemove)="remove(t)"></wu-chip>
}`,
    },
  },
  ts: {
    removable: `tags = ['ด่วน', 'ลูกค้าใหม่', 'รอโทรกลับ'];

remove(tag: string): void {
  this.tags = this.tags.filter((t) => t !== tag);
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('label', 'string', undefined, 'ข้อความ', 'Text'),
        row('icon', 'string', undefined, 'class ของ icon', 'Icon class'),
        row('image', 'string', undefined, 'URL ของรูปด้านหน้า', 'URL of a leading image'),
        row('alt', 'string', undefined, 'ข้อความแทนรูป', 'Alt text for the image'),
        row('removable', 'boolean', 'false', 'แสดงปุ่มลบ', 'Shows a remove button'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onRemove', 'Event', undefined, 'กดปุ่มลบ', 'Remove pressed'), row('onImageError', 'Event', undefined, 'โหลดรูปไม่สำเร็จ', 'Image failed to load')],
    },
  ],
  tokens: [
    tok('--wu-chip-bg', 'พื้น', 'Background'),
    tok('--wu-chip-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-chip-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wu-chip-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wu-chip-radius', 'ความมน', 'Radius'),
    tok('--wu-chip-gap', 'ระยะระหว่างส่วนต่าง ๆ', 'Gap between parts'),
    tok('--wu-control-focus-shadow', 'วงโฟกัสของปุ่มลบ', 'Focus ring of the remove button'),
  ],
};

export const AVATAR_DOC: ComponentDoc = {
  id: 'avatar',
  title: 'Avatar',
  group: 'Display',
  entry: 'avatar',
  standalone: 'WuAvatar',
  module: 'WuAvatarModule',
  selector: 'wu-avatar',
  description: {
    th: 'รูปหรือตัวอักษรแทนผู้ใช้ มีขนาด รูปทรง และกลุ่มที่ซ้อนกัน ถ้าโหลดรูปไม่ได้จะแสดง label แทน',
    en: 'A picture or initials for a person, with sizes, shapes and overlapping groups. If the image fails, the label shows instead.',
  },
  english: {
    'ส': 'A',
    'ก': 'K',
    'ม': 'M',
    'สมชาย ใจดี': 'Alex Morgan',
    'ว': 'W',
    'น': 'N',
    'Ticket ที่เปิดอยู่': 'Open tickets',
    'ปิดงานแล้ว': 'Closed',
    'รอตรวจสอบ': 'Needs a look',
    'ล่าช้า': 'Late',
  },
  sections: {
    import: { title: 'Import', text: { th: 'มี <code>WuAvatar</code> และ <code>WuAvatarGroup</code> อยู่ใน <code>WuAvatarModule</code>', en: '<code>WuAvatar</code> and <code>WuAvatarGroup</code> both come with <code>WuAvatarModule</code>.' } },
    basic: { title: { th: 'Label, icon และรูป', en: 'Label, icon and image' } },
    sizes: { title: { th: 'ขนาดและรูปทรง', en: 'Sizes and shapes' } },
    severity: {
      title: { th: 'สีตามความหมาย', en: 'Severity' },
      text: {
        th: '<code>severity</code> วางพื้นสีอ่อนของสีนั้นไว้หลัง icon หรือตัวอักษร (แบบเดียวกับ tag สีอ่อน) ใช้เป็นไอคอนของตัวเลข KPI หรือเครื่องหมายสถานะในรายการ: <code>primary</code>, <code>secondary</code>, <code>success</code>, <code>info</code>, <code>warn</code>, <code>danger</code>, <code>help</code> และ <code>contrast</code> · รูป (<code>image</code>) ไม่มีพื้น',
        en: '<code>severity</code> puts a soft tile of that colour behind the icon or letters (as soft tags look), for KPI icons or status markers in a list: <code>primary</code>, <code>secondary</code>, <code>success</code>, <code>info</code>, <code>warn</code>, <code>danger</code>, <code>help</code> and <code>contrast</code> · a picture (<code>image</code>) gets no tile.',
      },
    },
    group: { title: 'AvatarGroup', text: { th: 'ครอบด้วย <code>wu-avatar-group</code> เพื่อเรียงซ้อนกัน', en: 'Wrap them in <code>wu-avatar-group</code> to overlap them.' } },
    fallback: {
      title: { th: 'เมื่อโหลดรูปไม่ได้', en: 'When the image fails' },
      text: {
        th: 'ใส่ทั้ง <code>image</code> และ <code>label</code> ถ้ารูปโหลดไม่ได้จะแสดง label แทนและส่ง <code>(onImageError)</code>',
        en: 'Give both <code>image</code> and <code>label</code>: if the image fails, the label shows instead and <code>(onImageError)</code> fires.',
      },
    },
  },
  code: {
    basic: `<wu-avatar label="ส"></wu-avatar>
<wu-avatar icon="wi wi-user"></wu-avatar>
<wu-avatar image="assets/avatar.png" ariaLabel="สมชาย ใจดี"></wu-avatar>`,
    sizes: `<wu-avatar label="A" shape="circle"></wu-avatar>
<wu-avatar label="B" size="large" shape="circle"></wu-avatar>
<wu-avatar label="C" size="xlarge" shape="circle"></wu-avatar>
<wu-avatar label="D" size="xlarge"></wu-avatar>`,
    severity: `<wu-avatar icon="wi wi-ticket" severity="info" ariaLabel="Ticket ที่เปิดอยู่"></wu-avatar>
<wu-avatar icon="wi wi-check-circle" severity="success" ariaLabel="ปิดงานแล้ว"></wu-avatar>
<wu-avatar icon="wi wi-clock" severity="warn" ariaLabel="รอตรวจสอบ"></wu-avatar>
<wu-avatar icon="wi wi-exclamation-triangle" severity="danger" ariaLabel="ล่าช้า"></wu-avatar>
<wu-avatar label="ว" severity="help" shape="circle"></wu-avatar>
<wu-avatar label="น" severity="primary" shape="circle"></wu-avatar>
<wu-avatar icon="wi wi-user" severity="secondary" shape="circle"></wu-avatar>
<wu-avatar label="AI" severity="contrast" shape="circle"></wu-avatar>`,
    group: `<wu-avatar-group>
  <wu-avatar label="ส" shape="circle"></wu-avatar>
  <wu-avatar label="ก" shape="circle"></wu-avatar>
  <wu-avatar label="ม" shape="circle"></wu-avatar>
  <wu-avatar label="+5" shape="circle"></wu-avatar>
</wu-avatar-group>`,
    fallback: `<wu-avatar image="assets/missing.png" label="ส" shape="circle" (onImageError)="log($event)"></wu-avatar>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('label', 'string', undefined, 'ตัวอักษรที่แสดง (และใช้แทนรูปที่โหลดไม่ได้)', 'Text to show (also the fallback for a failed image)'),
        row('icon', 'string', undefined, 'class ของ icon', 'Icon class'),
        row('image', 'string', undefined, 'URL ของรูป', 'Image URL'),
        row('size', "'normal' | 'large' | 'xlarge'", "'normal'", 'ขนาด', 'Size'),
        row('shape', "'square' | 'circle'", "'square'", 'รูปทรง', 'Shape'),
        row('severity', "'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'", undefined, 'พื้นสีอ่อนของสีนั้นหลัง icon หรือตัวอักษร', 'A soft tile of that colour behind the icon or letters'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        STYLE_ROW,
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onImageError', 'Event', undefined, 'โหลดรูปไม่สำเร็จ', 'Image failed to load')] },
    {
      id: 'api-group',
      title: 'AvatarGroup',
      typeLabel: { th: 'ใส่ด้วย', en: 'Use' },
      rows: [row('wu-avatar-group', 'element', undefined, 'ครอบ avatar หลายตัวให้ซ้อนกัน', 'Wraps avatars so they overlap')],
    },
  ],
  tokens: [
    tok('--wu-avatar-size', 'ขนาด', 'Size'),
    tok('--wu-avatar-bg', 'พื้น', 'Background'),
    tok('--wu-avatar-color', 'สีตัวอักษรและ icon', 'Text and icon colour'),
    tok('--wu-avatar-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wu-avatar-radius', 'ความมนของ shape="square"', 'Radius of shape="square"'),
    tok('--wu-tag-soft-mix', 'ความเข้มของพื้นเมื่อมี severity (สีมาจาก --wu-<severity>-color และ -text)', 'Strength of the tile with a severity (colours from --wu-<severity>-color and -text)'),
    tok('--wu-card-bg', 'ขอบคั่นระหว่าง avatar ในกลุ่ม', 'Ring between grouped avatars'),
  ],
};

export const SKELETON_DOC: ComponentDoc = {
  id: 'skeleton',
  title: 'Skeleton',
  group: 'Feedback',
  entry: 'skeleton',
  standalone: 'WuSkeleton',
  module: 'WuSkeletonModule',
  selector: 'wu-skeleton',
  description: { th: 'กล่องเปล่าที่แสดงระหว่างรอข้อมูล วางเป็นโครงหน้าตาของเนื้อหาจริงได้', en: 'Placeholder shapes shown while data loads, laid out like the real content.' },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: 'กำหนดขนาดด้วย <code>width</code> และ <code>height</code>', en: 'Size it with <code>width</code> and <code>height</code>.' } },
    shapes: { title: { th: 'รูปทรง', en: 'Shapes' }, text: { th: '<code>shape="circle"</code> กับ <code>size</code> สำหรับรูปวงกลม', en: '<code>shape="circle"</code> with <code>size</code> for round shapes.' } },
    card: { title: { th: 'โครงการ์ด', en: 'Card placeholder' } },
    animation: { title: 'Animation', text: { th: '<code>animation="none"</code> ปิดแสงวิ่ง ผู้ใช้ที่ตั้งลดการเคลื่อนไหวจะไม่เห็นแสงวิ่งอยู่แล้ว', en: '<code>animation="none"</code> turns the shimmer off; it is also off for readers who prefer reduced motion.' } },
  },
  code: {
    basic: `<wu-skeleton></wu-skeleton>
<wu-skeleton width="60%"></wu-skeleton>
<wu-skeleton width="10rem" height="2rem"></wu-skeleton>`,
    shapes: `<wu-skeleton shape="circle" size="3rem"></wu-skeleton>
<wu-skeleton size="3rem" borderRadius="12px"></wu-skeleton>`,
    card: `<div class="row">
  <wu-skeleton shape="circle" size="3rem"></wu-skeleton>
  <div class="lines">
    <wu-skeleton width="40%"></wu-skeleton>
    <wu-skeleton width="70%" height="0.75rem"></wu-skeleton>
  </div>
</div>
<wu-skeleton height="8rem"></wu-skeleton>`,
    animation: `<wu-skeleton animation="none"></wu-skeleton>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('shape', "'rectangle' | 'circle'", "'rectangle'", 'รูปทรง', 'Shape'),
        row('size', 'string', undefined, 'กว้างและสูงเท่ากัน เช่น 3rem', 'Equal width and height, e.g. 3rem'),
        row('width', 'string', "'100%'", 'ความกว้าง', 'Width'),
        row('height', 'string', "'1rem'", 'ความสูง', 'Height'),
        row('borderRadius', 'string', undefined, 'ความมนของมุม', 'Corner radius'),
        row('animation', "'wave' | 'none'", "'wave'", 'แสงวิ่ง', 'Shimmer'),
        STYLE_ROW,
      ],
    },
  ],
  tokens: [
    tok('--wu-skeleton-bg', 'พื้น', 'Background'),
    tok('--wu-skeleton-wave', 'สีของแสงวิ่ง', 'Shimmer colour'),
    tok('--wu-radius-md', 'ความมนของมุม', 'Corner radius'),
  ],
};

export const PROGRESSBAR_DOC: ComponentDoc = {
  id: 'progressbar',
  title: 'ProgressBar',
  group: 'Feedback',
  entry: 'progressbar',
  standalone: 'WuProgressBar',
  module: 'WuProgressBarModule',
  selector: 'wu-progressbar',
  description: {
    th: 'แถบความคืบหน้าแบบรู้ค่าหรือไม่รู้ค่า นับเป็นเปอร์เซ็นต์หรือเป็นจำนวนชิ้นเทียบกับ max ความสูงตั้งที่ตัว element ได้เลย',
    en: 'A progress bar, determinate or indeterminate, in percent or as a count against max. Set its height on the element itself.',
  },
  english: {
    'รายการ': 'items',
    'อัปโหลด 3 จาก 10 ไฟล์': 'Uploaded 3 of 10 files',
    'กำลังนำเข้า': 'Importing',
    'กำลังคัดลอก 7 จาก 10 ไฟล์': 'Copying 7 of 10 files',
    'สำรองข้อมูล': 'Backing up',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: '<code>value</code> 0–100 แสดงค่าบนแถบ ปิดด้วย <code>[showValue]="false"</code>', en: '<code>value</code> is 0–100 and shown on the bar; hide it with <code>[showValue]="false"</code>.' } },
    dynamic: { title: { th: 'ค่าที่เปลี่ยน', en: 'Changing value' } },
    count: {
      title: { th: 'นับเป็นจำนวน', en: 'Counting items' },
      text: {
        th: '<code>[max]</code> และ <code>unit</code> แสดงเป็นจำนวน เช่น <code>1,000 / 2,500 รายการ</code> ส่วน <code>text</code> แทนข้อความบนแถบทั้งหมด',
        en: '<code>[max]</code> and <code>unit</code> show a count such as <code>1,000 / 2,500 items</code>; <code>text</code> replaces the label altogether.',
      },
    },
    content: {
      title: { th: 'เนื้อหาแบบกำหนดเอง', en: 'Custom content' },
      text: {
        th: 'template <code>content</code> ได้ค่าเป็น <code>let-value</code> พร้อม <code>max</code> และ <code>percent</code>',
        en: 'The <code>content</code> template gets the value as <code>let-value</code>, plus <code>max</code> and <code>percent</code>.',
      },
    },
    indeterminate: { title: 'Indeterminate', text: { th: 'ใช้เมื่อไม่รู้ว่าจะเสร็จเมื่อไร', en: 'For work of unknown length.' } },
    style: { title: { th: 'สีและความสูง', en: 'Colour and height' }, text: { th: 'ความสูงอยู่ที่ host จึงใส่ <code>style="height: 6px"</code> ได้', en: 'The height lives on the host, so <code>style="height: 6px"</code> works.' } },
    striped: {
      title: { th: 'ลายทาง', en: 'Stripes' },
      text: {
        th: '<code>[striped]="true"</code> ใส่ลายทางเฉียงบนแถบ · <code>[animated]="true"</code> ให้ลายทางเคลื่อนที่ (มีลายทางในตัว ไม่ต้องใส่ striped) เหมาะกับงานที่กำลังทำอยู่ ลายเอียงไปข้างหน้าและวิ่งไปทางเดียวกับที่แถบยาวขึ้น (ขวาไปซ้ายในหน้า RTL) ผู้ใช้ที่ตั้งลดการเคลื่อนไหวจะเห็นลายทางนิ่ง · ลายทางเป็นอีกชั้นหนึ่ง จึงใช้คู่กับ <code>color</code> ได้ และขนาดลายตั้งด้วย token <code>--wu-progressbar-stripe-size</code>',
        en: '<code>[striped]="true"</code> lays diagonal stripes over the bar · <code>[animated]="true"</code> makes them move (it brings the stripes itself, no striped needed), for work in progress; they lean forward and travel the way the bar grows (right to left on RTL pages), and people who ask for reduced motion see them still · the stripes are a layer of their own, so they go with <code>color</code>, and the <code>--wu-progressbar-stripe-size</code> token sets their size.',
      },
    },
    shimmer: {
      title: { th: 'แถบเงาวาว', en: 'Shimmer' },
      text: {
        th: '<code>[shimmer]="true"</code> ทำให้แถบเงาวาว (ไฮไลต์ด้านใน) และมีแสงวิ่งผ่านแถบทุกราว 2.4 วินาที แบบแถบความคืบหน้าของโปรแกรมบนเดสก์ท็อป บอกผู้ใช้ว่างานยังเดินอยู่แม้ค่ายังไม่ขยับ · แสงวิ่งไปทางที่แถบยาวขึ้น (กลับด้านในหน้า RTL) และใช้คู่กับ <code>color</code>, ลายทาง และ <code>mode="indeterminate"</code> ได้ · ผู้ใช้ที่ตั้งลดการเคลื่อนไหวจะเห็นแค่ความเงานิ่ง ๆ',
        en: '<code>[shimmer]="true"</code> gives the bar a gloss (an inner highlight) and a band of light that sweeps along it every 2.4 s or so, like the progress bars of desktop programs, so people see the work is alive even while the value holds still · the light travels the way the bar grows (reversed on RTL pages) and goes with <code>color</code>, stripes and <code>mode="indeterminate"</code> · people who ask for reduced motion see only the still gloss.',
      },
    },
  },
  code: {
    basic: `<wu-progressbar [value]="64"></wu-progressbar>
<wu-progressbar [value]="40" [showValue]="false"></wu-progressbar>`,
    dynamic: `<wu-progressbar [value]="progress" unit="%"></wu-progressbar>
<wu-button label="+10" size="small" (onClick)="progress = progress >= 100 ? 0 : progress + 10"></wu-button>`,
    count: `<wu-progressbar [value]="1000" [max]="2500" unit="รายการ"></wu-progressbar>
<wu-progressbar [value]="3" [max]="10" text="อัปโหลด 3 จาก 10 ไฟล์"></wu-progressbar>`,
    content: `<wu-progressbar [value]="50">
  <ng-template #content let-value>{{ value }}/100</ng-template>
</wu-progressbar>`,
    indeterminate: `<wu-progressbar mode="indeterminate" style="height: 6px"></wu-progressbar>`,
    style: `<wu-progressbar [value]="72" color="#14b8a6" [showValue]="false" style="height: 6px"></wu-progressbar>`,
    striped: `<wu-progressbar [value]="45" [striped]="true"></wu-progressbar>
<wu-progressbar [value]="60" [animated]="true" text="กำลังนำเข้า"></wu-progressbar>
<wu-progressbar [value]="80" [striped]="true" color="var(--wu-success-color)" [showValue]="false"></wu-progressbar>`,
    shimmer: `<wu-progressbar [value]="70" [shimmer]="true" text="กำลังคัดลอก 7 จาก 10 ไฟล์"></wu-progressbar>
<wu-progressbar [value]="45" [shimmer]="true" color="var(--wu-success-color)" text="สำรองข้อมูล"></wu-progressbar>
<wu-progressbar mode="indeterminate" [shimmer]="true" style="height: 6px"></wu-progressbar>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'number', '0', 'ค่าปัจจุบัน', 'Current value'),
        row('max', 'number', '100', 'ค่าเต็ม (100 = เปอร์เซ็นต์)', 'What value counts up to (100 = percent)'),
        row('text', 'string', undefined, 'ข้อความบนแถบแทนค่า', 'Label instead of the value'),
        row('showValue', 'boolean', 'true', 'แสดงค่าบนแถบ', 'Shows the value on the bar'),
        row('unit', 'string', "'%'", 'หน่วยต่อท้ายค่า (เมื่อ max ไม่ใช่ 100 แสดงเป็น ค่า / max หน่วย)', 'Unit after the value (with a max other than 100: value / max unit)'),
        row('mode', "'determinate' | 'indeterminate'", "'determinate'", 'รู้ค่าหรือไม่รู้ค่า', 'Known or unknown progress'),
        row('color', 'string', undefined, 'สีของแถบ', 'Bar colour'),
        row('striped', 'boolean', 'false', 'ลายทางเฉียงบนแถบ', 'Diagonal stripes on the bar'),
        row('animated', 'boolean', 'false', 'ลายทางที่เคลื่อนที่ (มีลายทางในตัว) นิ่งเมื่อผู้ใช้ตั้งลดการเคลื่อนไหว', 'Moving stripes (stripes included); still for people who ask for reduced motion'),
        row('shimmer', 'boolean', 'false', 'แถบเงาวาวและแสงที่วิ่งผ่านเป็นระยะ (เหลือแค่ความเงาเมื่อผู้ใช้ตั้งลดการเคลื่อนไหว)', 'A glossy bar with a band of light sweeping along it now and then (only the gloss for people who ask for reduced motion)'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [row('content', '$implicit (value) · max · percent', undefined, 'เนื้อหาบนแถบ', 'Content on the bar')],
    },
  ],
  tokens: [
    tok('--wu-progressbar-height', 'ความสูง', 'Height'),
    tok('--wu-progressbar-bg', 'พื้นราง', 'Track background'),
    tok('--wu-progressbar-radius', 'ความมน', 'Radius'),
    tok('--wu-progressbar-label-size', 'ขนาดตัวเลข', 'Label size'),
    tok('--wu-progressbar-label-weight', 'น้ำหนักตัวเลข', 'Label weight'),
    tok('--wu-progressbar-stripe-size', 'ขนาดของลายทาง (striped / animated)', 'Size of the stripes (striped / animated)'),
    tok('--wu-primary-color', 'สีแถบ', 'Bar colour'),
    tok('--wu-primary-contrast', 'สีตัวเลขบนแถบ', 'Label colour on the bar'),
  ],
};

export const PROGRESSSPINNER_DOC: ComponentDoc = {
  id: 'progressspinner',
  title: 'ProgressSpinner',
  group: 'Feedback',
  entry: 'progressspinner',
  standalone: 'WuProgressSpinner',
  module: 'WuProgressSpinnerModule',
  selector: 'wu-progress-spinner',
  description: {
    th: 'วงกลมหมุนบอกว่ากำลังโหลด ตั้งขนาด สีเดียวหรือหลายสี และใส่ข้อความใต้วงหรือข้างวงได้ โดยวงกับข้อความจัดอยู่กลางพื้นที่ให้เอง',
    en: 'A spinning circle that shows something is loading: set its size, one colour or several, and text under or beside the ring, centred for you.',
  },
  english: {
    'กำลังโหลด': 'Loading',
    'กำลังโหลดข้อมูล…': 'Loading data…',
    'กำลังซิงก์ 3 รายการ': 'Syncing 3 items',
    'กำลังเตรียมรายงาน': 'Preparing the report',
    'อาจใช้เวลาราว 1 นาที': 'This may take about a minute',
    'กล่องรอโหลด: วงกับข้อความอยู่กลางพื้นที่ของตัวเอง': 'a loading block: ring and text centred in their own space',
    'ข้อความข้างวง ในแถวเดียวกับปุ่ม': 'text beside the ring, in a row with a button',
    'เนื้อหาเองสองบรรทัด': 'own content on two lines',
    'สีของแบรนด์ (ใส่ได้สูงสุดสี่สี)': 'brand colours (up to four)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuProgressSpinnerModule</code>) และ standalone ชื่อ tag ที่แอปใช้อยู่ <code>wu-progressSpinner</code> (และ <code>wu-progressspinner</code>) ใช้ได้เหมือน <code>wu-progress-spinner</code> ย้ายมาแค่เปลี่ยน prefix',
        en: 'Works as an NgModule (<code>WuProgressSpinnerModule</code>) or standalone. The tag name apps already use, <code>wu-progressSpinner</code> (and <code>wu-progressspinner</code>), works the same as <code>wu-progress-spinner</code>, so moving over is a prefix change.',
      },
    },
    basic: { title: 'Basic' },
    custom: {
      title: { th: 'ขนาด เส้น และความเร็ว', en: 'Size, stroke and speed' },
      text: {
        th: '<code>size</code> คือขนาดของวง (<code>size="2rem"</code> หรือตัวเลขเป็น px) และเพราะขนาดอยู่ที่ host จึงใส่ <code>style="width: 3rem; height: 3rem"</code> ก็ได้ · <code>strokeWidth</code> คือความหนาเส้น <code>fill</code> คือสีพื้นในวง และ <code>animationDuration</code> คือเวลาหมุนหนึ่งรอบ',
        en: '<code>size</code> sizes the ring (<code>size="2rem"</code>, or a number in px), and as the size lives on the host, <code>style="width: 3rem; height: 3rem"</code> works too · <code>strokeWidth</code> is the line width, <code>fill</code> the colour inside the ring, and <code>animationDuration</code> the time for one turn.',
      },
    },
    colors: {
      title: { th: 'หลากสี', en: 'Colours' },
      text: {
        th: '<code>[multicolor]="true"</code> ให้วงเปลี่ยนสีวนตามสีของธีม (primary → info → success → warn) ส่วน <code>[multicolor]="false"</code> ใช้สี primary สีเดียว · ถ้าไม่ใส่ จะเป็นไปตาม preset (บาง preset วนสี่สีอยู่แล้ว บาง preset ใช้สีเดียว) · <code>[colors]</code> ใส่สีเองได้สูงสุดสี่สี เช่นสีของแบรนด์ (ใส่น้อยกว่าสี่สีจะวนซ้ำให้ครบ) · ทั้งหมดเป็นตัวแปร <code>--wu-spinner-color-1</code> ถึง <code>-4</code> ที่ host จึงตั้งด้วย CSS ก็ได้',
        en: '<code>[multicolor]="true"</code> cycles the ring through the theme’s colours (primary → info → success → warn), and <code>[multicolor]="false"</code> keeps it on the primary colour · left out, the preset decides (some presets already cycle four colours, others use one) · <code>[colors]</code> takes your own, up to four, such as brand colours (fewer repeat to fill four) · all of them are the <code>--wu-spinner-color-1</code> to <code>-4</code> variables on the host, so CSS can set them too.',
      },
    },
    label: {
      title: { th: 'ข้อความใต้ spinner', en: 'With a label' },
      text: {
        th: '<code>label</code> ใส่ข้อความใต้วง แล้ว spinner จัดวงกับข้อความไว้กลางพื้นที่ที่ได้รับเองทั้งแนวนอนและแนวตั้ง จึงเป็นกล่องรอโหลดได้เลยโดยไม่ต้องห่อด้วย div (ให้ความสูงกับมันพอ) · <code>labelPosition="right"</code> วางข้อความข้างวงในบรรทัดเดียว เหมาะกับแถบสถานะหรือแถวที่มีปุ่ม · template <code>label</code> ใส่เนื้อหาเองแทนข้อความ เช่นหัวข้อกับคำอธิบายสองบรรทัด · ข้อความเป็นชื่อของ progressbar สำหรับ screen reader ด้วย เว้นแต่ใส่ <code>ariaLabel</code> (ใส่ไว้เสมอเมื่อใช้ template) · ระยะห่าง สี และขนาดของข้อความตั้งด้วย token <code>--wu-spinner-label-gap</code>, <code>--wu-spinner-label-color</code> และ <code>--wu-spinner-label-size</code>',
        en: '<code>label</code> puts text under the ring, and the spinner centres ring and text in the space it is given, both ways, so it makes a loading block without a wrapper (give it the height) · <code>labelPosition="right"</code> puts the text beside the ring on one line, for a status strip or a row with a button · a <code>label</code> template replaces the text with your own content, such as a title over a small hint · the text is also the progressbar’s name for screen readers unless <code>ariaLabel</code> is set (always set it with a template) · the <code>--wu-spinner-label-gap</code>, <code>--wu-spinner-label-color</code> and <code>--wu-spinner-label-size</code> tokens set the gap, colour and size of the text.',
      },
    },
  },
  code: {
    basic: `<wu-progress-spinner ariaLabel="กำลังโหลด"></wu-progress-spinner>`,
    custom: `<wu-progress-spinner size="2rem" strokeWidth="6"></wu-progress-spinner>
<wu-progress-spinner style="width: 3rem; height: 3rem" fill="#eef2f9" animationDuration=".8s"></wu-progress-spinner>`,
    colors: `<wu-progress-spinner [multicolor]="true" size="3rem" ariaLabel="กำลังโหลด"></wu-progress-spinner>
<wu-progress-spinner [multicolor]="false" size="3rem" ariaLabel="กำลังโหลด"></wu-progress-spinner>
<!-- สีของแบรนด์ (ใส่ได้สูงสุดสี่สี) -->
<wu-progress-spinner [colors]="brandColors" size="3rem" strokeWidth="4" ariaLabel="กำลังโหลด"></wu-progress-spinner>`,
    label: `<!-- กล่องรอโหลด: วงกับข้อความอยู่กลางพื้นที่ของตัวเอง -->
<wu-progress-spinner size="2.5rem" label="กำลังโหลดข้อมูล…" class="loading-card"></wu-progress-spinner>

<!-- ข้อความข้างวง ในแถวเดียวกับปุ่ม -->
<div class="sync-row">
  <wu-progress-spinner size="1.25rem" strokeWidth="5" label="กำลังซิงก์ 3 รายการ" labelPosition="right"></wu-progress-spinner>
  <wu-button label="ยกเลิก" severity="secondary" [text]="true" size="small"></wu-button>
</div>

<!-- เนื้อหาเองสองบรรทัด -->
<wu-progress-spinner [multicolor]="true" size="3rem" ariaLabel="กำลังเตรียมรายงาน">
  <ng-template #label>
    <strong class="spinner-title">กำลังเตรียมรายงาน</strong>
    <small class="spinner-hint">อาจใช้เวลาราว 1 นาที</small>
  </ng-template>
</wu-progress-spinner>`,
  },
  ts: {
    colors: `brandColors = ['#e8668e', '#3b6fd8', '#ff9a2e'];`,
  },
  css: {
    label: `.loading-card {
  height: 12rem;
  border: 1px dashed var(--wu-border);
  border-radius: 12px;
}
.sync-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 6px 6px 14px;
  border: 1px solid var(--wu-border);
  border-radius: 999px;
}
.spinner-title,
.spinner-hint {
  display: block;
}
.spinner-hint {
  color: var(--wu-text-muted);
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('strokeWidth', 'string', "'2'", 'ความหนาเส้น', 'Stroke width'),
        row('fill', 'string', "'none'", 'สีพื้นในวง', 'Fill inside the circle'),
        row('animationDuration', 'string', "'2s'", 'เวลาหมุนหนึ่งรอบ', 'Time for one turn'),
        row('size', 'string | number', 'token', 'ขนาดของวง เช่น \'3rem\' (ตัวเลข = px)', 'Size of the ring, e.g. \'3rem\' (a number = px)'),
        row('multicolor', 'boolean', 'preset', 'true: วนสีของธีม (primary, info, success, warn) · false: สี primary สีเดียว', 'true: cycle the theme’s colours (primary, info, success, warn) · false: the primary colour only'),
        row('colors', 'string[]', undefined, 'สีของตัวเองที่วนไป (สูงสุดสี่สี น้อยกว่านั้นวนซ้ำ)', 'Your own colours to cycle (up to four; fewer repeat)'),
        row('label', 'string', undefined, 'ข้อความใต้วง (หรือข้างวง) จัดกึ่งกลางให้ และเป็นชื่อสำหรับ screen reader ด้วย', 'Text under (or beside) the ring, centred; also the accessible name'),
        row('labelPosition', "'bottom' | 'right'", "'bottom'", 'ข้อความใต้วง หรือข้างวงในบรรทัดเดียว', 'Text under the ring, or beside it on one line'),
        row('ariaLabel', 'string', 'label · locale (loading)', 'ชื่อสำหรับ screen reader', 'Accessible name'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      rows: [row('label', '—', undefined, 'เนื้อหาเองแทนข้อความ (v3: <ng-template #label> · v1 / v2: wuTemplate="label")', 'Own content in place of the text (v3: <ng-template #label> · v1 / v2: wuTemplate="label")')],
    },
  ],
  tokens: [
    tok('--wu-spinner-size', 'ขนาดเริ่มต้น', 'Default size'),
    tok('--wu-spinner-color-1', 'สีช่วงที่ 1 (เปลี่ยนสีวนไป 4 สี)', 'Colour 1 (the stroke cycles through 4)'),
    tok('--wu-spinner-color-2', 'สีช่วงที่ 2', 'Colour 2'),
    tok('--wu-spinner-color-3', 'สีช่วงที่ 3', 'Colour 3'),
    tok('--wu-spinner-color-4', 'สีช่วงที่ 4', 'Colour 4'),
    tok('--wu-spinner-label-gap', 'ระยะระหว่างวงกับข้อความ', 'Space between the ring and its label'),
    tok('--wu-spinner-label-color', 'สีของข้อความ', 'Label colour'),
    tok('--wu-spinner-label-size', 'ขนาดของข้อความ', 'Label size'),
  ],
};
