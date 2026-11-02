import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW } from './doc-helpers';

const BOOL = 'boolean';

const ACTIONS_TS = `import { WuMenuItem } from 'wiraui/menu';

saveActions: WuMenuItem[] = [
  { label: 'บันทึกเป็นร่าง', icon: 'wi wi-file', command: (event) => this.run(event) },
  { label: 'บันทึกและส่งต่อ', icon: 'wi wi-send', command: (event) => this.run(event) },
  { separator: true },
  { label: 'ลบเอกสาร', icon: 'wi wi-trash', command: (event) => this.run(event) },
];
lastAction = '';

run(event: { item?: WuMenuItem }): void {
  this.lastAction = event.item?.label ?? '';
}`;

export const SPLITBUTTON_DOC: ComponentDoc = {
  id: 'splitbutton',
  title: 'SplitButton',
  group: 'Button',
  entry: 'splitbutton',
  standalone: 'WuSplitButton',
  module: 'WuSplitButtonModule',
  selector: 'wu-splitbutton',
  description: {
    th: 'ปุ่มที่มีคำสั่งหลักหนึ่งคำสั่ง และลูกศรที่เปิดเมนูคำสั่งอื่น ๆ เช่น บันทึก กับ บันทึกเป็นร่าง หน้าตาและสีเหมือน wu-button ส่วนเมนูคือ wu-menu แบบ popup',
    en: 'A button with one main action and an arrow that opens a menu of the others, such as Save next to Save as draft. It looks like wu-button and takes its colours; the menu is the wu-menu popup.',
  },
  english: {
    'บันทึกเป็นร่าง': 'Save as draft',
    'บันทึกและส่งต่อ': 'Save and forward',
    'ลบเอกสาร': 'Delete document',
    'สั่งล่าสุด': 'Last action',
    'ส่งออก': 'Export',
    'ไฟล์ PDF': 'PDF file',
    'ไฟล์ Excel': 'Excel file',
    'พิมพ์': 'Print',
    'อนุมัติ': 'Approve',
    'ส่งกลับแก้ไข': 'Send back',
    'ไม่อนุมัติ': 'Reject',
    'บันทึกครั้งที่': 'Saves',
    'ยังไม่มีสิทธิ์อนุมัติ': 'no right to approve yet',
    'ทุกคำสั่งปิดอยู่': 'every action off',
    'รายการเมนูแบบเดียวกับ wu-menu': 'menu items, as in wu-menu',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuSplitButtonModule</code>) และ standalone (<code>WuSplitButton</code>) แท็กเขียนได้ทั้ง <code>wu-splitbutton</code>, <code>wu-splitButton</code> และ <code>wu-split-button</code>',
        en: 'Works as an NgModule (<code>WuSplitButtonModule</code>) or standalone (<code>WuSplitButton</code>). The tag can be written <code>wu-splitbutton</code>, <code>wu-splitButton</code> or <code>wu-split-button</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ส่วนหลักทำ <code>(onClick)</code> ส่วนลูกศรเปิดเมนูจาก <code>[model]</code> (รายการเมนูแบบเดียวกับ wu-menu: <code>label</code>, <code>icon</code>, <code>command</code>, <code>routerLink</code>, <code>separator</code>, <code>disabled</code>) · <code>Alt</code> + <code>↓</code> เปิดเมนูจากคีย์บอร์ด และ <code>Esc</code> ปิดแล้วคืนโฟกัส · ระหว่างบันทึกใช้ <code>[disabled]="isApiSaving"</code>',
        en: 'The main part runs <code>(onClick)</code>; the arrow opens the menu from <code>[model]</code> (menu items as in wu-menu: <code>label</code>, <code>icon</code>, <code>command</code>, <code>routerLink</code>, <code>separator</code>, <code>disabled</code>) · <code>Alt</code> + <code>↓</code> opens it from the keyboard and <code>Esc</code> closes it and gives focus back · while saving, <code>[disabled]="isApiSaving"</code>.',
      },
    },
    severity: {
      title: { th: 'สีและรูปแบบ', en: 'Colours and variants' },
      text: {
        th: '<code>severity</code>, <code>[outlined]</code>, <code>[text]</code>, <code>[raised]</code>, <code>[rounded]</code> และ <code>size</code> เหมือน wu-button ทุกอย่าง',
        en: '<code>severity</code>, <code>[outlined]</code>, <code>[text]</code>, <code>[raised]</code>, <code>[rounded]</code> and <code>size</code>, exactly as on wu-button.',
      },
    },
    disabled: {
      title: { th: 'ปิดบางส่วน', en: 'Turning parts off' },
      text: {
        th: '<code>[buttonDisabled]</code> ปิดเฉพาะส่วนหลัก (ยังเปิดเมนูได้) · <code>[menuButtonDisabled]</code> ปิดเฉพาะลูกศร · <code>[disabled]</code> ปิดทั้งปุ่ม',
        en: '<code>[buttonDisabled]</code> turns off only the main part (the menu still opens) · <code>[menuButtonDisabled]</code> only the arrow · <code>[disabled]</code> the whole button.',
      },
    },
    icons: {
      title: { th: 'ไอคอนและ event', en: 'Icons and events' },
      text: {
        th: '<code>iconPos="right"</code> ย้ายไอคอนไปท้ายข้อความ · <code>dropdownIcon</code> ใช้ไอคอนของแอปแทนลูกศร · <code>menuStyleClass</code> / <code>menuStyle</code> แต่งเมนู · <code>(onDropdownClick)</code> เมื่อกดลูกศร · <code>(onMenuShow)</code> / <code>(onMenuHide)</code> เมื่อเมนูเปิด / ปิด',
        en: '<code>iconPos="right"</code> puts the icon after the text · <code>dropdownIcon</code> uses your own icon for the arrow · <code>menuStyleClass</code> / <code>menuStyle</code> style the menu · <code>(onDropdownClick)</code> when the arrow is pressed · <code>(onMenuShow)</code> / <code>(onMenuHide)</code> when the menu opens / closes.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-splitButton&gt;</code> เป็น <code>&lt;wu-splitButton&gt;</code> input และ event ชื่อเดิม เมนูเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>tooltip</code>, <code>autoZIndex</code> และ <code>baseZIndex</code>) · class <code>p-splitbutton</code> อยู่คู่กับ <code>wu-splitbutton</code>',
        en: 'Change <code>&lt;p-splitButton&gt;</code> to <code>&lt;wu-splitButton&gt;</code>; inputs and events keep their names. The menu opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>tooltip</code>, <code>autoZIndex</code> and <code>baseZIndex</code>) · the <code>p-splitbutton</code> class sits next to <code>wu-splitbutton</code>.',
      },
    },
  },
  code: {
    basic: `<wu-splitButton label="บันทึก" icon="wi wi-save" [model]="saveActions" [disabled]="isApiSaving" (onClick)="save()"></wu-splitButton>`,
    severity: `<wu-splitButton label="ส่งออก" icon="wi wi-download" severity="secondary" [model]="exportActions"></wu-splitButton>
<wu-splitButton label="ส่งออก" severity="success" [outlined]="true" [model]="exportActions"></wu-splitButton>
<wu-splitButton label="ส่งออก" severity="info" [text]="true" [model]="exportActions"></wu-splitButton>
<wu-splitButton label="ส่งออก" severity="help" [raised]="true" [rounded]="true" size="small" [model]="exportActions"></wu-splitButton>`,
    disabled: `<wu-splitButton label="อนุมัติ" [model]="reviewActions" [buttonDisabled]="true"></wu-splitButton>
<wu-splitButton label="อนุมัติ" [model]="reviewActions" [menuButtonDisabled]="true"></wu-splitButton>
<wu-splitButton label="อนุมัติ" [model]="reviewActions" [disabled]="true"></wu-splitButton>`,
    icons: `<wu-splitButton label="พิมพ์" icon="wi wi-print" iconPos="right" dropdownIcon="wi wi-ellipsis-v" severity="secondary"
  [model]="exportActions" (onMenuShow)="logMenu('onMenuShow')" (onMenuHide)="logMenu('onMenuHide')"></wu-splitButton>`,
  },
  ts: {
    basic: `${ACTIONS_TS}

isApiSaving = false;

save(): void {
  this.isApiSaving = true;
  this.documentService.save(this.document).subscribe({
    next: () => (this.isApiSaving = false),
    error: () => (this.isApiSaving = false),
  });
}`,
    severity: `exportActions: WuMenuItem[] = [
  { label: 'ไฟล์ PDF', icon: 'wi wi-file-pdf' },
  { label: 'ไฟล์ Excel', icon: 'wi wi-file-excel' },
];`,
    icons: `menuEvents: string[] = [];

logMenu(name: string): void {
  this.menuEvents = [...this.menuEvents.slice(-3), name];
}`,
    disabled: `reviewActions: WuMenuItem[] = [
  { label: 'ส่งกลับแก้ไข', icon: 'wi wi-undo' },
  { label: 'ไม่อนุมัติ', icon: 'wi wi-times' },
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('label · icon', 'string', undefined, 'ข้อความและไอคอนของส่วนหลัก', 'Text and icon of the main part'),
        row('iconPos', "'left' | 'right'", "'left'", 'ไอคอนอยู่ก่อนหรือหลังข้อความ', 'Icon before or after the text'),
        row('model', 'WuMenuItem[]', undefined, 'คำสั่งในเมนู', 'The menu\'s actions'),
        row('severity', "'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'", undefined, 'สี (ไม่ใส่คือสีหลัก)', 'Colour (none: the primary colour)'),
        row('outlined · text · raised · rounded', BOOL, 'false', 'รูปแบบปุ่มเหมือน wu-button', 'Button variants, as on wu-button'),
        row('size', "'small' | 'large'", undefined, 'ขนาด', 'Size'),
        row('disabled', BOOL, 'false', 'ปิดทั้งปุ่ม', 'The whole button off'),
        row('buttonDisabled · menuButtonDisabled', BOOL, 'false', 'ปิดเฉพาะส่วนหลัก / เฉพาะลูกศร', 'Only the main part / only the arrow off'),
        row('dropdownIcon', 'string', undefined, 'class ไอคอนแทนลูกศร', 'Icon class instead of the arrow'),
        row('menuStyleClass · menuStyle', 'string · object', undefined, 'class และ style ของเมนู', 'Class and style of the menu'),
        row('ariaLabel · expandAriaLabel', 'string', undefined, 'ชื่อของส่วนหลัก / ของลูกศร (ค่าเริ่มต้นของลูกศรมาจาก locale)', 'Name of the main part / of the arrow (the arrow\'s default comes from the locale)'),
        STYLE_ROW,
        row('appendTo · tooltip · tooltipOptions · autoZIndex · baseZIndex', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onClick', 'MouseEvent', undefined, 'กดส่วนหลัก', 'The main part was pressed'),
        row('onDropdownClick', 'MouseEvent', undefined, 'กดลูกศร', 'The arrow was pressed'),
        row('onMenuShow · onMenuHide', 'void', undefined, 'เมนูเปิด / ปิด', 'The menu opened / closed'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import { WuMenuItem } from 'wiraui/menu';   // รายการเมนูแบบเดียวกับ wu-menu`,
    },
  ],
  tokens: [],
  themingNote: {
    th: 'SplitButton ใช้ token ของ Button (สี ความมน ระยะ) และเมนูใช้ token ของ Menu จึงไม่มี token ของตัวเอง',
    en: 'SplitButton uses the Button tokens (colours, radius, padding) and its menu the Menu tokens, so it has none of its own.',
  },
};
