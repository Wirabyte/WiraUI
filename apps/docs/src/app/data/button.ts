import { ComponentDoc } from '../core/component-doc';

export const BUTTON_DOC: ComponentDoc = {
  id: 'button',
  title: 'Button',
  group: 'Button',
  entry: 'button',
  standalone: 'WuButton',
  module: 'WuButtonModule',
  selector: 'wu-button',
  description: {
    th: 'ปุ่มที่มี [action]: ส่งงานที่ต้องรอให้ แล้วปุ่มจะแสดง spinner และกันกดซ้ำเองจนงานเสร็จ ไม่ต้องเขียน flag loading เอง',
    en: 'A button with [action]: give it the work to wait for and it shows a spinner and ignores repeat clicks until the work is done. No loading flag to manage.',
  },
  english: {
    'ส่งข้อมูล': 'Submit',
    'เล็ก': 'Small',
    'ปกติ': 'Normal',
    'ใหญ่': 'Large',
    'ดูคำสั่งซื้อ': 'View orders',
    'แจ้งเตือน': 'Notifications',
    'ข้อความ': 'Messages',
    'บันทึกแบบร่าง': 'Save draft',
    'ปิดอยู่': 'Disabled',
    'เข้าสู่ระบบ': 'Sign in',
    'หรือ variant="outlined" / variant="text"': 'or variant="outlined" / variant="text"',
    'class เดิมก็ได้:': 'the old classes work too:',
    'บันทึกข้อมูล': 'save the data',
    '[action] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียวให้ this ยังเป็น component': '[action] takes the function itself: bind it once so this stays the component',
    'คืน Promise หรือ Observable: ระหว่างรอ ปุ่มแสดง spinner และไม่รับการกดซ้ำ':
      'return a Promise or an Observable: while it runs, the button shows a spinner and ignores repeat clicks',
  },
  sections: {
    import: { title: 'Import' },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ข้อความด้วย <code>label</code> และรับการกดด้วย <code>(onClick)</code>',
        en: 'Set the text with <code>label</code> and handle clicks with <code>(onClick)</code>.',
      },
    },
    action: {
      title: 'Action',
      text: {
        th: 'ส่งฟังก์ชันที่คืน <code>Promise</code> หรือ <code>Observable</code> ให้ <code>[action]</code> ปุ่มจะแสดง spinner และไม่รับการกดซ้ำจนงานเสร็จ ไม่ต้องมีตัวแปร <code>loading</code> และไม่ต้องกันกดซ้ำเอง (ลองกดรัว ๆ ได้)',
        en: 'Pass a function that returns a <code>Promise</code> or an <code>Observable</code> to <code>[action]</code>. The button shows a spinner and ignores clicks until it settles, so there is no <code>loading</code> flag or double-submit guard to write. Try clicking it a few times.',
      },
    },
    severity: {
      title: 'Severity',
      text: {
        th: '<code>severity</code> กำหนดสีตามความหมาย <code>\'warning\'</code> ยังใช้ได้และได้ผลเหมือน <code>\'warn\'</code>',
        en: '<code>severity</code> sets the colour by meaning. The older spelling <code>\'warning\'</code> works the same as <code>\'warn\'</code>.',
      },
    },
    variants: {
      title: { th: 'Outlined และ Text', en: 'Outlined and Text' },
      text: {
        th: 'ใช้ <code>outlined</code> หรือ <code>text</code> หรือเขียนเป็น <code>variant</code> ก็ได้ ใช้คู่กับทุก severity',
        en: 'Use <code>outlined</code> or <code>text</code>, or the <code>variant</code> input. Both combine with every severity.',
      },
    },
    shape: { title: { th: 'Raised และ Rounded', en: 'Raised and Rounded' } },
    sizes: {
      title: 'Sizes',
      text: {
        th: '<code>size="small"</code> หรือ <code>"large"</code> (เขียน <code>sm</code> / <code>lg</code> ก็ได้) ความสูงปกติ 33px เมื่อขนาด UI เป็น 14px และปรับตามขนาด UI ทั้งหมด class เดิม <code>p-button-sm</code> / <code>p-button-lg</code> ใน <code>styleClass</code> ก็ได้ผลเหมือนกัน',
        en: '<code>size="small"</code> or <code>"large"</code> (<code>sm</code> / <code>lg</code> work too). The default height is 33px at a 14px UI size and follows the UI size. The class names <code>p-button-sm</code> / <code>p-button-lg</code> in <code>styleClass</code> do the same.',
      },
    },
    directive: {
      title: { th: 'ใส่บนแท็ก button เดิม', en: 'On an existing button element' },
      text: {
        th: '<code>wuButton</code> แต่ง <code>&lt;button&gt;</code> หรือ <code>&lt;a&gt;</code> ที่มีอยู่แล้ว รับ <code>label</code>, <code>icon</code>, <code>severity</code>, <code>size</code>, <code>outlined</code>, <code>text</code>, <code>loading</code> และ <code>badge</code> เหมือน <code>wu-button</code> รับการกดด้วย <code>(click)</code> ปกติ attribute ที่ template เดิมใช้อยู่ก็อ่านได้เหมือนกัน',
        en: '<code>wuButton</code> styles an existing <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>. It takes <code>label</code>, <code>icon</code>, <code>severity</code>, <code>size</code>, <code>outlined</code>, <code>text</code>, <code>loading</code> and <code>badge</code> like <code>wu-button</code>, and clicks are the usual <code>(click)</code>. The attribute your templates already use is read the same.',
      },
    },
    styleclass: {
      title: { th: 'class ปุ่มแบบเดิม', en: 'Existing button classes' },
      text: {
        th: 'class ที่ template เดิมใส่ไว้ใน <code>styleClass</code> หรือ <code>class</code> เช่น <code>p-button-sm</code>, <code>p-button-outlined</code>, <code>p-button-text</code>, <code>p-button-rounded</code>, <code>p-button-danger</code> ถูกแปลงเป็นขนาด รูปแบบ และสีของปุ่มให้เอง',
        en: 'Classes existing templates put in <code>styleClass</code> or <code>class</code>, such as <code>p-button-sm</code>, <code>p-button-outlined</code>, <code>p-button-text</code>, <code>p-button-rounded</code> and <code>p-button-danger</code>, become the matching size, style and colour.',
      },
    },
    icons: {
      title: 'Icons',
      text: {
        th: '<code>icon</code> รับ class ของชุด icon ที่โปรเจคใช้อยู่ เช่น Font Awesome หรือ icon font อื่นที่ใช้ class แบบ <code>wi wi-check</code> ปุ่มที่มีแต่ icon ควรใส่ <code>ariaLabel</code> ให้ screen reader อ่านได้',
        en: '<code>icon</code> takes a class from the icon set your app already uses, such as Font Awesome or any icon font with classes like <code>wi wi-check</code>. Give icon-only buttons an <code>ariaLabel</code> for screen readers.',
      },
    },
    badge: {
      title: 'Badge',
      text: {
        th: '<code>badge</code> ตัวเลขหรือข้อความท้ายปุ่ม และ <code>badgeSeverity</code> สีของ badge · ปุ่มที่มีแต่ icon (เช่น กระดิ่งแจ้งเตือน) ติด badge ไว้ที่มุมบนแทน ปุ่มจึงไม่ขยายตาม · <code>[link]="true"</code> ทำให้ปุ่มเป็นแบบลิงก์ · <code>[style]</code> (object) ใส่ที่ตัวปุ่ม',
        en: '<code>badge</code> puts a count or text at the end and <code>badgeSeverity</code> colours it · an icon-only button (a notification bell, say) wears it on its top corner instead, so the button keeps its size · <code>[link]="true"</code> makes a link-style button · <code>[style]</code> (an object) goes on the button.',
      },
    },
    loading: {
      title: { th: 'Loading และ Disabled', en: 'Loading and Disabled' },
      text: {
        th: 'แบบที่แอปส่วนใหญ่เขียน: ตัวแปร <code>isApiSaving</code> ตั้งเป็น true ก่อนเรียก API และ false เมื่อเสร็จ ผูกกับ <code>[loading]</code> (หรือ <code>[disabled]</code>) ระหว่าง loading ปุ่มจะไม่ส่ง <code>(onClick)</code>',
        en: 'The way most apps write it: an <code>isApiSaving</code> flag set to true before the API call and false when it ends, bound to <code>[loading]</code> (or <code>[disabled]</code>). While loading, the button does not emit <code>(onClick)</code>.',
      },
    },
    fluid: { title: 'Fluid' },
  },
  code: {
    basic: `<wu-button label="บันทึก" icon="wi wi-save" (onClick)="save()"></wu-button>`,
    severity: `<wu-button label="Primary"></wu-button>
<wu-button label="Secondary" severity="secondary"></wu-button>
<wu-button label="Success" severity="success"></wu-button>
<wu-button label="Info" severity="info"></wu-button>
<wu-button label="Warn" severity="warn"></wu-button>
<wu-button label="Help" severity="help"></wu-button>
<wu-button label="Danger" severity="danger"></wu-button>
<wu-button label="Contrast" severity="contrast"></wu-button>`,
    variants: `<wu-button label="Outlined" [outlined]="true"></wu-button>
<wu-button label="Outlined" severity="secondary" [outlined]="true"></wu-button>
<wu-button label="Text" [text]="true"></wu-button>
<wu-button label="Text" severity="danger" [text]="true"></wu-button>
<!-- หรือ variant="outlined" / variant="text" -->`,
    shape: `<wu-button label="Raised" [raised]="true"></wu-button>
<wu-button label="Rounded" [rounded]="true"></wu-button>
<wu-button label="Rounded" severity="secondary" [rounded]="true" [outlined]="true"></wu-button>`,
    sizes: {
      classic: `<wu-button label="เล็ก" size="small"></wu-button>
<wu-button label="ปกติ"></wu-button>
<wu-button label="ใหญ่" size="large"></wu-button>
<!-- class เดิมก็ได้: <wu-button label="เล็ก" styleClass="p-button-sm"></wu-button> -->`,
      v3: `<wu-button label="เล็ก" size="small"></wu-button>
<wu-button label="ปกติ"></wu-button>
<wu-button label="ใหญ่" size="large"></wu-button>`,
    },
    directive: `<button wuButton type="button" label="บันทึก" icon="wi wi-save" (click)="save()"></button>
<button wuButton type="button" label="ลบ" icon="wi wi-trash" severity="danger" [outlined]="true"
  (click)="remove()"></button>
<a wuButton href="/orders" label="ดูคำสั่งซื้อ" severity="secondary" [text]="true"></a>`,
    styleclass: `<wu-button label="ลบ" icon="wi wi-trash" styleClass="p-button-sm p-button-outlined p-button-danger"></wu-button>
<button wuButton type="button" label="ยกเลิก" class="p-button-text p-button-secondary"></button>`,
    icons: `<wu-button label="บันทึก" icon="wi wi-check"></wu-button>
<wu-button label="ส่ง" icon="wi wi-send" iconPos="right"></wu-button>
<wu-button icon="wi wi-search" ariaLabel="ค้นหา"></wu-button>
<wu-button icon="wi wi-trash" severity="danger" [text]="true" ariaLabel="ลบ"></wu-button>`,
    badge: `<wu-button label="แจ้งเตือน" icon="wi wi-bell" badge="3"></wu-button>
<wu-button label="ข้อความ" severity="secondary" badge="12" badgeSeverity="danger"></wu-button>
<wu-button icon="wi wi-bell" badge="5" badgeSeverity="danger" severity="secondary" [text]="true" [rounded]="true"
  ariaLabel="แจ้งเตือน"></wu-button>
<wu-button label="ดูคำสั่งซื้อ" [link]="true" [style]="{ minWidth: '8rem' }"></wu-button>`,
    action: `<wu-button id="demo-save" label="ส่งข้อมูล" icon="wi wi-send" [action]="save"></wu-button>`,
    loading: `<wu-button label="บันทึกแบบร่าง" icon="wi wi-save" [loading]="isApiSaving" (onClick)="saveDraft()"></wu-button>
<wu-button label="ปิดอยู่" [disabled]="true"></wu-button>`,
    fluid: `<wu-button label="เข้าสู่ระบบ" [fluid]="true"></wu-button>`,
  },
  ts: {
    basic: `save(): void {
  // บันทึกข้อมูล
}`,
    action: `export class ProfileComponent {
  // [action] รับตัวฟังก์ชัน จึง bind ไว้ครั้งเดียวให้ this ยังเป็น component
  save = this.saveProfile.bind(this);

  saveProfile(): Observable<unknown> {
    // คืน Promise หรือ Observable: ระหว่างรอ ปุ่มแสดง spinner และไม่รับการกดซ้ำ
    return this.profileService.save(this.profile);
  }
}`,
    loading: `isApiSaving = false;

saveDraft(): void {
  this.isApiSaving = true;
  this.profileService.saveDraft(this.profile).subscribe({
    next: () => {
      this.isApiSaving = false;
    },
    error: () => {
      this.isApiSaving = false;
    },
  });
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        { name: 'label', type: 'string', description: { th: 'ข้อความบนปุ่ม', en: 'Button text' } },
        { name: 'icon', type: 'string', description: { th: 'class ของ icon เช่น wi wi-check หรือ fa-solid fa-floppy-disk', en: 'Icon class, e.g. wi wi-check or fa-solid fa-floppy-disk' } },
        { name: 'iconPos', type: "'left' | 'right'", default: "'left'", description: { th: 'ตำแหน่ง icon', en: 'Icon position' } },
        { name: 'severity', type: 'WuButtonSeverity', default: "'primary'", description: { th: "สีตามความหมาย รับ 'warning' ด้วย", en: "Colour by meaning; 'warning' is accepted too" } },
        { name: 'variant', type: "'solid' | 'outlined' | 'text'", default: "'solid'", description: { th: 'รูปแบบของปุ่ม', en: 'Button style' } },
        { name: 'outlined', type: 'boolean', default: 'false', description: { th: 'ทางลัดของ variant="outlined"', en: 'Shorthand for variant="outlined"' } },
        { name: 'text', type: 'boolean', default: 'false', description: { th: 'ทางลัดของ variant="text"', en: 'Shorthand for variant="text"' } },
        { name: 'raised', type: 'boolean', default: 'false', description: { th: 'ใส่เงา', en: 'Adds a shadow' } },
        { name: 'rounded', type: 'boolean', default: 'false', description: { th: 'ขอบมนเต็ม', en: 'Fully rounded corners' } },
        { name: 'size', type: "'small' | 'large' | 'sm' | 'lg'", description: { th: 'ขนาดของปุ่ม', en: 'Button size' } },
        { name: 'styleClass', type: 'string', description: { th: 'class เพิ่ม (class ปุ่มแบบเดิมถูกแปลงให้)', en: 'Extra classes (existing button classes are mapped)' } },
        { name: 'style', type: 'object', description: { th: "style ของปุ่ม เช่น { minWidth: '8rem' }", en: "Button style, e.g. { minWidth: '8rem' }" } },
        { name: 'link', type: 'boolean', default: 'false', description: { th: 'ปุ่มหน้าตาแบบลิงก์', en: 'A button that looks like a link' } },
        { name: 'fluid', type: 'boolean', default: 'false', description: { th: 'กว้างเต็มพื้นที่', en: 'Full width' } },
        { name: 'badge', type: 'string | number', description: { th: 'ตัวเลขหรือข้อความเล็กท้ายปุ่ม', en: 'Small count or text at the end' } },
        { name: 'badgeSeverity', type: 'WuSeverityInput', description: { th: 'สีของ badge', en: 'Badge colour' } },
        { name: 'loading', type: 'boolean', default: 'false', description: { th: 'แสดง spinner และกดไม่ได้', en: 'Shows a spinner and blocks clicks' } },
        { name: 'action', type: 'WuButtonAction', description: { th: 'ฟังก์ชันที่คืน Promise หรือ Observable ปุ่มแสดง loading จนงานเสร็จ', en: 'Function returning a Promise or Observable; the button stays loading until it settles' } },
        { name: 'disabled', type: 'boolean', default: 'false', description: { th: 'ปิดการกด', en: 'Disables the button' } },
        { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: { th: 'type ของ <button> ข้างใน', en: 'type of the inner <button>' } },
        { name: 'ariaLabel', type: 'string', description: { th: 'ชื่อสำหรับ screen reader (จำเป็นเมื่อมีแต่ icon)', en: 'Accessible name (needed for icon-only buttons)' } },
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [{ name: 'onClick', type: 'MouseEvent', description: { th: 'กดปุ่ม (ไม่ส่งตอนกำลัง loading)', en: 'Click (not emitted while loading)' } }],
    },
    {
      id: 'api-directive',
      title: { th: 'wuButton (directive)', en: 'wuButton (directive)' },
      note: { th: 'ใส่บน <button> หรือ <a> รับการกดด้วย (click)', en: 'On a <button> or <a>; clicks are (click).' },
      rows: [
        { name: 'label · icon · iconPos', type: 'string', description: { th: 'ข้อความและ icon', en: 'Text and icon' } },
        { name: 'severity · variant · size', type: 'WuButtonSeverity · WuButtonVariant · WuButtonSize', description: { th: 'สี รูปแบบ และขนาด', en: 'Colour, style and size' } },
        { name: 'outlined · text · raised · rounded · loading', type: 'boolean', default: 'false', description: { th: 'รูปแบบและสถานะ', en: 'Style and state' } },
        { name: 'badge', type: 'string | number', description: { th: 'ตัวเลขท้ายปุ่ม', en: 'Count at the end' } },
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WuButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'help' | 'contrast';
type WuButtonVariant = 'solid' | 'outlined' | 'text';
type WuButtonSize = 'small' | 'large' | 'sm' | 'lg';
type WuButtonAction = () => Promise<unknown> | Observable<unknown> | unknown;`,
    },
  ],
  tokens: [
    { name: '--wu-button-padding-x', description: { th: 'ระยะซ้ายขวา', en: 'Horizontal padding' } },
    { name: '--wu-button-padding-y', description: { th: 'ระยะบนล่าง', en: 'Vertical padding' } },
    { name: '--wu-button-radius', description: { th: 'ความมนของมุม', en: 'Corner radius' } },
    { name: '--wu-button-font-weight', description: { th: 'น้ำหนักตัวอักษร', en: 'Font weight' } },
    { name: '--wu-control-line-height', description: { th: 'ความสูงบรรทัด (ปุ่มกับช่องกรอกสูงเท่ากัน)', en: 'Line height (buttons and fields match)' } },
    { name: '--wu-button-gap', description: { th: 'ระยะระหว่าง icon กับข้อความ', en: 'Gap between icon and label' } },
    { name: '--wu-button-text-transform', description: { th: 'ตัวพิมพ์ (เช่น uppercase ในธีม Material)', en: 'Text case (e.g. uppercase in Material themes)' } },
    { name: '--wu-primary-color', description: { th: 'พื้นของปุ่มหลัก', en: 'Primary background' } },
    { name: '--wu-primary-hover', description: { th: 'พื้นตอนชี้', en: 'Hover background' } },
    { name: '--wu-primary-active', description: { th: 'พื้นตอนกด', en: 'Pressed background' } },
    { name: '--wu-primary-contrast', description: { th: 'ตัวอักษรบนปุ่มหลัก', en: 'Text on primary' } },
    { name: '--wu-button-secondary-bg', description: { th: 'พื้นของ severity="secondary"', en: 'severity="secondary" background' } },
    { name: '--wu-button-secondary-color', description: { th: 'ตัวอักษรของ severity="secondary"', en: 'severity="secondary" text' } },
    { name: '--wu-danger-color', description: { th: 'พื้นของ severity="danger" (success / info / warn / help แบบเดียวกัน)', en: 'severity="danger" background (success / info / warn / help alike)' } },
    { name: '--wu-control-focus-shadow', description: { th: 'วงโฟกัสเมื่อใช้คีย์บอร์ด', en: 'Keyboard focus ring' } },
    { name: '--wu-shadow-md', description: { th: 'เงาของ raised', en: 'raised shadow' } },
    { name: '--wu-radius-full', description: { th: 'มุมของ rounded และ badge', en: 'rounded and badge corners' } },
    { name: '--wu-disabled-opacity', description: { th: 'ความจางเมื่อ disabled', en: 'Disabled opacity' } },
    { name: '--wu-transition', description: { th: 'ความเร็ว transition', en: 'Transition speed' } },
  ],
  overrides: `    button: { fontWeight: 600, radius: '999px', paddingX: '1.25rem' },`,
};
