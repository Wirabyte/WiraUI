import { ComponentDoc } from '../core/component-doc';
import { importText, row, SEVERITY_TYPE, tok } from './doc-helpers';

const severities = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];

export const TAG_DOC: ComponentDoc = {
  id: 'tag',
  title: 'Tag',
  group: 'Display',
  entry: 'tag',
  standalone: 'WtTag',
  module: 'WtTagModule',
  selector: 'wt-tag',
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
    basic: `<wt-tag value="ใหม่"></wt-tag>`,
    severity: severities.map((s) => `<wt-tag value="${s}" severity="${s}"></wt-tag>`).join('\n'),
    pill: `<wt-tag value="เปิดใช้งาน" severity="success" [rounded]="true"></wt-tag>
<wt-tag value="ยืนยันแล้ว" icon="pi pi-check" severity="info"></wt-tag>`,
    content: `<wt-tag severity="warn">
  <span class="pi pi-bell"></span> รออนุมัติ 3 รายการ
</wt-tag>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'string | number', undefined, 'ข้อความของป้าย', 'Tag text'),
        row('severity', 'WtSeverityInput', "'primary'", 'สีตามความหมาย', 'Colour by meaning'),
        row('rounded', 'boolean', 'false', 'มนเต็ม (pill)', 'Fully rounded (pill)'),
        row('icon', 'string', undefined, 'class ของ icon หน้าข้อความ', 'Icon class before the text'),
      ],
    },
    { id: 'api-types', title: 'Types', code: SEVERITY_TYPE },
  ],
  tokens: [
    tok('--wt-tag-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wt-tag-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wt-tag-radius', 'ความมนของมุม', 'Corner radius'),
    tok('--wt-tag-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wt-tag-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wt-tag-gap', 'ระยะระหว่าง icon กับข้อความ', 'Gap between icon and text'),
    tok('--wt-tag-fill', 'พื้นแบบทึบหรือแบบอ่อน', 'Solid or soft fill'),
    tok('--wt-primary-soft', 'พื้นของ severity="primary"', 'severity="primary" background'),
    tok('--wt-success-bg', 'พื้นของ severity="success" (info / warn / danger / help แบบเดียวกัน)', 'severity="success" background (info / warn / danger / help alike)'),
    tok('--wt-radius-full', 'มุมของ rounded', 'rounded corners'),
  ],
  overrides: `    tag: { pill: true },`,
};

export const BADGE_DOC: ComponentDoc = {
  id: 'badge',
  title: 'Badge',
  group: 'Display',
  entry: 'badge',
  standalone: 'WtBadge',
  module: 'WtBadgeModule',
  selector: 'wt-badge',
  description: { th: 'ตัวเลขหรือจุดเล็ก ๆ บอกจำนวนหรือสถานะ ไม่ใส่ค่าจะเป็นจุด', en: 'A small count or dot. Without a value it is a dot.' },
  english: {
    'กล่องข้อความ': 'Inbox',
    'สถานะออนไลน์': 'Online',
    "'warning' และ 'error' ใช้ได้ด้วย (= 'warn' และ 'danger')": "'warning' and 'error' work too (= 'warn' and 'danger')",
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: '<code>value</code> เป็นตัวเลขหรือข้อความสั้น ๆ ไม่ใส่จะเป็นจุด', en: '<code>value</code> is a number or short text; leave it out for a dot.' } },
    severity: { title: 'Severity' },
    sizes: { title: 'Sizes' },
    inline: { title: { th: 'วางคู่กับข้อความ', en: 'Next to text' } },
  },
  code: {
    basic: `<wt-badge value="8"></wt-badge>
<wt-badge></wt-badge>`,
    severity: severities.map((s, i) => `<wt-badge value="${i + 1}" severity="${s}"></wt-badge>`).join('\n'),
    sizes: `<wt-badge value="2"></wt-badge>
<wt-badge value="4" size="large"></wt-badge>
<wt-badge value="6" size="xlarge"></wt-badge>`,
    inline: `<span>กล่องข้อความ <wt-badge value="12" severity="danger"></wt-badge></span>
<span>สถานะออนไลน์ <wt-badge severity="success"></wt-badge></span>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'string | number', undefined, 'ค่าที่แสดง ไม่ใส่จะเป็นจุด', 'Value to show; a dot when left out'),
        row('severity', 'WtSeverityInput', "'primary'", 'สีตามความหมาย', 'Colour by meaning'),
        row('size', "'small' | 'large' | 'xlarge'", undefined, 'ขนาด', 'Size'),
      ],
    },
    { id: 'api-types', title: 'Types', code: `type WtBadgeSize = 'small' | 'large' | 'xlarge';\n${SEVERITY_TYPE}` },
  ],
  tokens: [
    tok('--wt-badge-size', 'ความสูงและความกว้างขั้นต่ำ', 'Height and minimum width'),
    tok('--wt-badge-dot-size', 'ขนาดของจุด', 'Dot size'),
    tok('--wt-badge-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wt-badge-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wt-badge-font-weight', 'น้ำหนักตัวอักษร', 'Font weight'),
    tok('--wt-primary-color', 'พื้นของ severity="primary"', 'severity="primary" background'),
    tok('--wt-primary-contrast', 'ตัวอักษรบน severity="primary"', 'Text on severity="primary"'),
    tok('--wt-radius-full', 'ความมน', 'Radius'),
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
  standalone: 'WtChip',
  module: 'WtChipModule',
  selector: 'wt-chip',
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
    basic: `<wt-chip label="Angular"></wt-chip>
<wt-chip label="TypeScript"></wt-chip>
<wt-chip label="SCSS"></wt-chip>`,
    icon: `<wt-chip label="ส่งแล้ว" icon="pi pi-send"></wt-chip>
<wt-chip label="สมชาย ใจดี" image="assets/avatar.png" alt="สมชาย"></wt-chip>`,
    removable: {
      classic: `<wt-chip *ngFor="let t of tags" [label]="t" [removable]="true" (onRemove)="remove(t)"></wt-chip>`,
      v3: `@for (t of tags; track t) {
<wt-chip [label]="t" [removable]="true" (onRemove)="remove(t)"></wt-chip>
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
    tok('--wt-chip-bg', 'พื้น', 'Background'),
    tok('--wt-chip-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wt-chip-padding-x', 'ระยะซ้ายขวา', 'Horizontal padding'),
    tok('--wt-chip-padding-y', 'ระยะบนล่าง', 'Vertical padding'),
    tok('--wt-chip-radius', 'ความมน', 'Radius'),
    tok('--wt-chip-gap', 'ระยะระหว่างส่วนต่าง ๆ', 'Gap between parts'),
    tok('--wt-control-focus-shadow', 'วงโฟกัสของปุ่มลบ', 'Focus ring of the remove button'),
  ],
};

export const AVATAR_DOC: ComponentDoc = {
  id: 'avatar',
  title: 'Avatar',
  group: 'Display',
  entry: 'avatar',
  standalone: 'WtAvatar',
  module: 'WtAvatarModule',
  selector: 'wt-avatar',
  description: {
    th: 'รูปหรือตัวอักษรแทนผู้ใช้ มีขนาด รูปทรง และกลุ่มที่ซ้อนกัน ถ้าโหลดรูปไม่ได้จะแสดง label แทน',
    en: 'A picture or initials for a person, with sizes, shapes and overlapping groups. If the image fails, the label shows instead.',
  },
  english: {
    'ส': 'A',
    'ก': 'K',
    'ม': 'M',
    'สมชาย ใจดี': 'Alex Morgan',
  },
  sections: {
    import: { title: 'Import', text: { th: 'มี <code>WtAvatar</code> และ <code>WtAvatarGroup</code> อยู่ใน <code>WtAvatarModule</code>', en: '<code>WtAvatar</code> and <code>WtAvatarGroup</code> both come with <code>WtAvatarModule</code>.' } },
    basic: { title: { th: 'Label, icon และรูป', en: 'Label, icon and image' } },
    sizes: { title: { th: 'ขนาดและรูปทรง', en: 'Sizes and shapes' } },
    group: { title: 'AvatarGroup', text: { th: 'ครอบด้วย <code>wt-avatar-group</code> เพื่อเรียงซ้อนกัน', en: 'Wrap them in <code>wt-avatar-group</code> to overlap them.' } },
    fallback: {
      title: { th: 'เมื่อโหลดรูปไม่ได้', en: 'When the image fails' },
      text: {
        th: 'ใส่ทั้ง <code>image</code> และ <code>label</code> ถ้ารูปโหลดไม่ได้จะแสดง label แทนและส่ง <code>(onImageError)</code>',
        en: 'Give both <code>image</code> and <code>label</code>: if the image fails, the label shows instead and <code>(onImageError)</code> fires.',
      },
    },
  },
  code: {
    basic: `<wt-avatar label="ส"></wt-avatar>
<wt-avatar icon="pi pi-user"></wt-avatar>
<wt-avatar image="assets/avatar.png" ariaLabel="สมชาย ใจดี"></wt-avatar>`,
    sizes: `<wt-avatar label="A" shape="circle"></wt-avatar>
<wt-avatar label="B" size="large" shape="circle"></wt-avatar>
<wt-avatar label="C" size="xlarge" shape="circle"></wt-avatar>
<wt-avatar label="D" size="xlarge"></wt-avatar>`,
    group: `<wt-avatar-group>
  <wt-avatar label="ส" shape="circle"></wt-avatar>
  <wt-avatar label="ก" shape="circle"></wt-avatar>
  <wt-avatar label="ม" shape="circle"></wt-avatar>
  <wt-avatar label="+5" shape="circle"></wt-avatar>
</wt-avatar-group>`,
    fallback: `<wt-avatar image="assets/missing.png" label="ส" shape="circle" (onImageError)="log($event)"></wt-avatar>`,
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
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
      ],
    },
    { id: 'api-outputs', title: 'Outputs', typeLabel: 'Event', rows: [row('onImageError', 'Event', undefined, 'โหลดรูปไม่สำเร็จ', 'Image failed to load')] },
    {
      id: 'api-group',
      title: 'AvatarGroup',
      typeLabel: { th: 'ใส่ด้วย', en: 'Use' },
      rows: [row('wt-avatar-group', 'element', undefined, 'ครอบ avatar หลายตัวให้ซ้อนกัน', 'Wraps avatars so they overlap')],
    },
  ],
  tokens: [
    tok('--wt-avatar-size', 'ขนาด', 'Size'),
    tok('--wt-avatar-bg', 'พื้น', 'Background'),
    tok('--wt-avatar-color', 'สีตัวอักษรและ icon', 'Text and icon colour'),
    tok('--wt-avatar-font-size', 'ขนาดตัวอักษร', 'Font size'),
    tok('--wt-avatar-radius', 'ความมนของ shape="square"', 'Radius of shape="square"'),
    tok('--wt-card-bg', 'ขอบคั่นระหว่าง avatar ในกลุ่ม', 'Ring between grouped avatars'),
  ],
};

export const SKELETON_DOC: ComponentDoc = {
  id: 'skeleton',
  title: 'Skeleton',
  group: 'Display',
  entry: 'skeleton',
  standalone: 'WtSkeleton',
  module: 'WtSkeletonModule',
  selector: 'wt-skeleton',
  description: { th: 'กล่องเปล่าที่แสดงระหว่างรอข้อมูล วางเป็นโครงหน้าตาของเนื้อหาจริงได้', en: 'Placeholder shapes shown while data loads, laid out like the real content.' },
  sections: {
    import: { title: 'Import', text: importText },
    basic: { title: 'Basic', text: { th: 'กำหนดขนาดด้วย <code>width</code> และ <code>height</code>', en: 'Size it with <code>width</code> and <code>height</code>.' } },
    shapes: { title: { th: 'รูปทรง', en: 'Shapes' }, text: { th: '<code>shape="circle"</code> กับ <code>size</code> สำหรับรูปวงกลม', en: '<code>shape="circle"</code> with <code>size</code> for round shapes.' } },
    card: { title: { th: 'โครงการ์ด', en: 'Card placeholder' } },
    animation: { title: 'Animation', text: { th: '<code>animation="none"</code> ปิดแสงวิ่ง ผู้ใช้ที่ตั้งลดการเคลื่อนไหวจะไม่เห็นแสงวิ่งอยู่แล้ว', en: '<code>animation="none"</code> turns the shimmer off; it is also off for readers who prefer reduced motion.' } },
  },
  code: {
    basic: `<wt-skeleton></wt-skeleton>
<wt-skeleton width="60%"></wt-skeleton>
<wt-skeleton width="10rem" height="2rem"></wt-skeleton>`,
    shapes: `<wt-skeleton shape="circle" size="3rem"></wt-skeleton>
<wt-skeleton size="3rem" borderRadius="12px"></wt-skeleton>`,
    card: `<div class="row">
  <wt-skeleton shape="circle" size="3rem"></wt-skeleton>
  <div class="lines">
    <wt-skeleton width="40%"></wt-skeleton>
    <wt-skeleton width="70%" height="0.75rem"></wt-skeleton>
  </div>
</div>
<wt-skeleton height="8rem"></wt-skeleton>`,
    animation: `<wt-skeleton animation="none"></wt-skeleton>`,
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
      ],
    },
  ],
  tokens: [
    tok('--wt-skeleton-bg', 'พื้น', 'Background'),
    tok('--wt-skeleton-wave', 'สีของแสงวิ่ง', 'Shimmer colour'),
    tok('--wt-radius-md', 'ความมนของมุม', 'Corner radius'),
  ],
};

export const PROGRESSBAR_DOC: ComponentDoc = {
  id: 'progressbar',
  title: 'ProgressBar',
  group: 'Display',
  entry: 'progressbar',
  standalone: 'WtProgressBar',
  module: 'WtProgressBarModule',
  selector: 'wt-progressbar',
  description: {
    th: 'แถบความคืบหน้าแบบรู้ค่าหรือไม่รู้ค่า นับเป็นเปอร์เซ็นต์หรือเป็นจำนวนชิ้นเทียบกับ max ความสูงตั้งที่ตัว element ได้เลย',
    en: 'A progress bar, determinate or indeterminate, in percent or as a count against max. Set its height on the element itself.',
  },
  english: {
    'รายการ': 'items',
    'อัปโหลด 3 จาก 10 ไฟล์': 'Uploaded 3 of 10 files',
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
  },
  code: {
    basic: `<wt-progressbar [value]="64"></wt-progressbar>
<wt-progressbar [value]="40" [showValue]="false"></wt-progressbar>`,
    dynamic: `<wt-progressbar [value]="progress" unit="%"></wt-progressbar>
<wt-button label="+10" size="small" (onClick)="progress = progress >= 100 ? 0 : progress + 10"></wt-button>`,
    count: `<wt-progressbar [value]="1000" [max]="2500" unit="รายการ"></wt-progressbar>
<wt-progressbar [value]="3" [max]="10" text="อัปโหลด 3 จาก 10 ไฟล์"></wt-progressbar>`,
    content: `<wt-progressbar [value]="50">
  <ng-template #content let-value>{{ value }}/100</ng-template>
</wt-progressbar>`,
    indeterminate: `<wt-progressbar mode="indeterminate" style="height: 6px"></wt-progressbar>`,
    style: `<wt-progressbar [value]="72" color="#14b8a6" [showValue]="false" style="height: 6px"></wt-progressbar>`,
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
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
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
    tok('--wt-progressbar-height', 'ความสูง', 'Height'),
    tok('--wt-progressbar-bg', 'พื้นราง', 'Track background'),
    tok('--wt-progressbar-radius', 'ความมน', 'Radius'),
    tok('--wt-progressbar-label-size', 'ขนาดตัวเลข', 'Label size'),
    tok('--wt-progressbar-label-weight', 'น้ำหนักตัวเลข', 'Label weight'),
    tok('--wt-primary-color', 'สีแถบ', 'Bar colour'),
    tok('--wt-primary-contrast', 'สีตัวเลขบนแถบ', 'Label colour on the bar'),
  ],
};

export const PROGRESSSPINNER_DOC: ComponentDoc = {
  id: 'progressspinner',
  title: 'ProgressSpinner',
  group: 'Display',
  entry: 'progressspinner',
  standalone: 'WtProgressSpinner',
  module: 'WtProgressSpinnerModule',
  selector: 'wt-progress-spinner',
  description: { th: 'วงกลมหมุนบอกว่ากำลังโหลด ขนาดตั้งที่ตัว element', en: 'A spinning circle that shows something is loading. Size it on the element.' },
  english: {
    'กำลังโหลด': 'Loading',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtProgressSpinnerModule</code>) และ standalone ชื่อ tag ที่แอปใช้อยู่ <code>wt-progressSpinner</code> (และ <code>wt-progressspinner</code>) ใช้ได้เหมือน <code>wt-progress-spinner</code> ย้ายมาแค่เปลี่ยน prefix',
        en: 'Works as an NgModule (<code>WtProgressSpinnerModule</code>) or standalone. The tag name apps already use, <code>wt-progressSpinner</code> (and <code>wt-progressspinner</code>), works the same as <code>wt-progress-spinner</code>, so moving over is a prefix change.',
      },
    },
    basic: { title: 'Basic' },
    custom: {
      title: { th: 'ขนาด เส้น และความเร็ว', en: 'Size, stroke and speed' },
      text: { th: 'ขนาดอยู่ที่ host จึงใส่ <code>style="width: 2rem; height: 2rem"</code> ได้', en: 'The size lives on the host, so <code>style="width: 2rem; height: 2rem"</code> works.' },
    },
  },
  code: {
    basic: `<wt-progress-spinner ariaLabel="กำลังโหลด"></wt-progress-spinner>`,
    custom: `<wt-progress-spinner style="width: 2rem; height: 2rem" strokeWidth="6"></wt-progress-spinner>
<wt-progress-spinner style="width: 3rem; height: 3rem" fill="#eef2f9" animationDuration=".8s"></wt-progress-spinner>`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('strokeWidth', 'string', "'2'", 'ความหนาเส้น', 'Stroke width'),
        row('fill', 'string', "'none'", 'สีพื้นในวง', 'Fill inside the circle'),
        row('animationDuration', 'string', "'2s'", 'เวลาหมุนหนึ่งรอบ', 'Time for one turn'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader', 'Accessible name'),
      ],
    },
  ],
  tokens: [
    tok('--wt-spinner-size', 'ขนาดเริ่มต้น', 'Default size'),
    tok('--wt-spinner-color-1', 'สีช่วงที่ 1 (เปลี่ยนสีวนไป 4 สี)', 'Colour 1 (the stroke cycles through 4)'),
    tok('--wt-spinner-color-2', 'สีช่วงที่ 2', 'Colour 2'),
    tok('--wt-spinner-color-3', 'สีช่วงที่ 3', 'Colour 3'),
    tok('--wt-spinner-color-4', 'สีช่วงที่ 4', 'Colour 4'),
  ],
};
