import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

export const DESCRIPTIONS_DOC: ComponentDoc = {
  id: 'descriptions',
  title: 'Descriptions',
  group: 'Data',
  entry: 'descriptions',
  standalone: 'WuDescriptions',
  module: 'WuDescriptionsModule',
  selector: 'wu-descriptions',
  description: {
    th: 'ข้อมูลเป็นคู่ หัวข้อ : ค่า เรียงเป็นคอลัมน์ สำหรับหน้ารายละเอียด (ข้อมูล Ticket ผู้แจ้ง อุปกรณ์) ค่าเป็น HTML อะไรก็ได้ เช่น tag สถานะ มีแบบหัวข้ออยู่บนค่า แบบตาราง และพับเหลือคอลัมน์เดียวเองเมื่อกล่องแคบ',
    en: 'Facts as label and value pairs in columns, for detail pages (a ticket, the person who reported it, a device). A value can be any markup, such as a status tag. Labels sit beside or above their values, there is a bordered table look, and the columns fold into one when the box gets narrow.',
  },
  english: {
    'ข้อมูลผู้แจ้ง': 'Reported by',
    'ชื่อ': 'Name',
    'วิระ มีสุข': 'Wira Meesuk',
    'หน่วยงาน': 'Department',
    'ฝ่ายบัญชี': 'Accounting',
    'โทรศัพท์ภายใน': 'Extension',
    'ข้อมูล Ticket': 'Ticket',
    'เลขที่': 'Number',
    'สถานะ': 'Status',
    'กำลังดำเนินการ': 'In progress',
    'หมวด': 'Category',
    'เครือข่าย': 'Network',
    'ความสำคัญ': 'Priority',
    'สูง': 'High',
    'ผู้รับงาน': 'Assignee',
    'น้ำฝน ใจงาม': 'Namfon Jaingam',
    'แจ้งเมื่อ': 'Reported',
    '3 พ.ย. 2569 09:15 น.': '3 Nov 2026, 09:15',
    'รายละเอียด': 'Details',
    'เชื่อมต่อ Wi-Fi ชั้น 3 ไม่ได้ตั้งแต่เช้า เครื่องอื่นในห้องเดียวกันใช้ได้ปกติ':
      'No Wi-Fi on the third floor since this morning; other computers in the same room work fine.',
    'เครื่อง': 'Device',
    'โน้ตบุ๊ก NB-0417': 'Laptop NB-0417',
    'ระบบปฏิบัติการ': 'Operating system',
    'หน่วยความจำ': 'Memory',
    'ที่ตั้ง': 'Location',
    'อาคาร 2 ชั้น 3 ห้อง 305': 'Building 2, floor 3, room 305',
    'ประกันถึง': 'Warranty until',
    '31 มี.ค. 2570': '31 Mar 2027',
    'ผู้ดูแล': 'Owner',
    'กำหนดเสร็จ': 'Due',
    '5 พ.ย. 2569': '5 Nov 2026',
    '3 พ.ย. 2569': '3 Nov 2026',
    'หมายเหตุ': 'Note',
    'รออะไหล่จากผู้ขาย 1 รายการ': 'Waiting for one part from the supplier',
    'รายการสุดท้ายกว้าง 2 คอลัมน์ แถวจึงเต็ม': 'the last item spans 2 columns, so its row is full',
    'กล่องแคบ 22rem': 'A 22rem box',
    'number คั่นหลักพัน · ว่าง แสดง –': 'a number gets thousands separators · empty shows –',
    'กว้างกี่คอลัมน์ ค่าเริ่มต้น 1': 'how many columns it takes, default 1',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: '<code>WuDescriptions</code> และ <code>WuDescriptionsItem</code> อยู่ใน <code>WuDescriptionsModule</code> (หรือ import แบบ standalone ทั้งสองตัว) · tag <code>wu-descriptions-item</code> เขียนเป็น <code>wu-descriptionsItem</code> ก็ได้',
        en: '<code>WuDescriptions</code> and <code>WuDescriptionsItem</code> come with <code>WuDescriptionsModule</code> (or import both standalone) · <code>wu-descriptions-item</code> can be written <code>wu-descriptionsItem</code> too.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[items]</code> เป็น array ของ <code>{ label, value, span? }</code> และ <code>title</code> หัวข้อเหนือรายการ · ค่าที่เป็น number คั่นหลักพัน ค่าว่างแสดง – (เลขที่ รหัส และเบอร์ภายในจึงส่งเป็น string) · ใช้ <code>&lt;dl&gt;</code> จริง screen reader จึงอ่านเป็นคู่ หัวข้อ : ค่า',
        en: '<code>[items]</code> is an array of <code>{ label, value, span? }</code>, and <code>title</code> a heading over the list · number values get thousands separators, empty ones show – (so pass numbers, codes and extensions as strings) · it is a real <code>&lt;dl&gt;</code>, so screen readers read label and value pairs.',
      },
    },
    columns: {
      title: { th: 'คอลัมน์ และค่าที่เป็น HTML', en: 'Columns, and markup as a value' },
      text: {
        th: '<code>[columns]="2"</code> เรียงเป็นสองคอลัมน์ · ใส่ <code>&lt;wu-descriptions-item label="…"&gt;</code> ไว้ใน tag เมื่อค่าเป็น HTML (tag สถานะ ลิงก์ ปุ่ม) สิ่งที่อยู่ข้างในคือค่า · <code>[span]="2"</code> ให้รายการกว้างหลายคอลัมน์ เช่น รายละเอียดยาว ๆ',
        en: '<code>[columns]="2"</code> lays it out in two columns · put <code>&lt;wu-descriptions-item label="…"&gt;</code> inside when a value is markup (a status tag, a link, a button): what is inside it is the value · <code>[span]="2"</code> widens an item over several columns, for a long description.',
      },
    },
    vertical: {
      title: { th: 'หัวข้ออยู่บนค่า', en: 'Labels above values' },
      text: {
        th: '<code>layout="vertical"</code> วางหัวข้อตัวเล็กไว้บนค่า เหมาะกับหลายคอลัมน์และค่าที่ยาว · ค่าเริ่มต้น <code>horizontal</code> วางหัวข้อไว้ข้างค่า (ความกว้างหัวข้อจาก <code>--wu-descriptions-label-width</code>)',
        en: '<code>layout="vertical"</code> puts a small label above each value, good for many columns and long values · the default, <code>horizontal</code>, puts the label beside the value (its width from <code>--wu-descriptions-label-width</code>).',
      },
    },
    bordered: {
      title: { th: 'แบบตาราง', en: 'Bordered' },
      text: {
        th: '<code>[bordered]="true"</code> วาดเป็นตารางช่องมีเส้น หัวข้ออยู่ในช่องสีอ่อน · <code>size="small"</code> ช่องแน่นขึ้น · แถวควรเต็มเสมอ: ให้รายการสุดท้ายมี <code>span</code> พอดีที่เหลือในแถว',
        en: '<code>[bordered]="true"</code> draws a table of cells with the labels in a tinted cell · <code>size="small"</code> tightens them · rows read best full: give the last item a <code>span</code> that fills its row.',
      },
    },
    responsive: {
      title: { th: 'พับตามความกว้างของกล่อง', en: 'Folds with its box' },
      text: {
        th: 'วัดความกว้างของกล่องตัวเอง (container query) ไม่ใช่ของจอ: แคบกว่า 36rem คอลัมน์พับเหลือหนึ่ง (span ไม่มีผล) และแคบกว่า 22rem หัวข้อแบบ horizontal ย้ายไปอยู่บนค่า จึงใช้ในการ์ดแคบ ๆ แผงข้าง หรือ dialog ได้โดยไม่ต้องเปลี่ยน <code>columns</code> เอง',
        en: 'It measures its own box (a container query), not the screen: under 36rem the columns fold into one (spans stop counting), and under 22rem a horizontal label moves above its value. So it fits a narrow card, a side panel or a dialog without changing <code>columns</code> yourself.',
      },
    },
  },
  code: {
    basic: `<wu-descriptions title="ข้อมูลผู้แจ้ง" [items]="reporter"></wu-descriptions>`,
    columns: `<wu-descriptions title="ข้อมูล Ticket" [columns]="2">
  <wu-descriptions-item label="เลขที่">HD-2569-0142</wu-descriptions-item>
  <wu-descriptions-item label="สถานะ">
    <wu-tag value="กำลังดำเนินการ" severity="warn"></wu-tag>
  </wu-descriptions-item>
  <wu-descriptions-item label="หมวด">เครือข่าย</wu-descriptions-item>
  <wu-descriptions-item label="ความสำคัญ">
    <wu-tag value="สูง" severity="danger"></wu-tag>
  </wu-descriptions-item>
  <wu-descriptions-item label="ผู้รับงาน">น้ำฝน ใจงาม</wu-descriptions-item>
  <wu-descriptions-item label="แจ้งเมื่อ">3 พ.ย. 2569 09:15 น.</wu-descriptions-item>
  <wu-descriptions-item label="รายละเอียด" [span]="2">
    เชื่อมต่อ Wi-Fi ชั้น 3 ไม่ได้ตั้งแต่เช้า เครื่องอื่นในห้องเดียวกันใช้ได้ปกติ
  </wu-descriptions-item>
</wu-descriptions>`,
    vertical: `<wu-descriptions layout="vertical" [columns]="3" [items]="device"></wu-descriptions>`,
    bordered: `<wu-descriptions [columns]="2" [bordered]="true" size="small" [items]="summary"></wu-descriptions>`,
    responsive: `<div style="width: 22rem">
  <wu-descriptions [columns]="2" [items]="summary"></wu-descriptions>
</div>`,
  },
  ts: {
    basic: `import { WuDescriptionsEntry } from '@wirabyte/ui/descriptions';

reporter: WuDescriptionsEntry[] = [
  { label: 'ชื่อ', value: 'วิระ มีสุข' },
  { label: 'หน่วยงาน', value: 'ฝ่ายบัญชี' },
  { label: 'โทรศัพท์ภายใน', value: '2145' },
  { label: 'อีเมล', value: 'wira@example.com' },
];`,
    vertical: `device: WuDescriptionsEntry[] = [
  { label: 'เครื่อง', value: 'โน้ตบุ๊ก NB-0417' },
  { label: 'ระบบปฏิบัติการ', value: 'Windows 11' },
  { label: 'หน่วยความจำ', value: '16 GB' },
  { label: 'ที่ตั้ง', value: 'อาคาร 2 ชั้น 3 ห้อง 305' },
  { label: 'ประกันถึง', value: '31 มี.ค. 2570' },
  { label: 'ผู้ดูแล', value: 'วิระ มีสุข' },
];`,
    bordered: `summary: WuDescriptionsEntry[] = [
  { label: 'เลขที่', value: 'HD-2569-0142' },
  { label: 'สถานะ', value: 'กำลังดำเนินการ' },
  { label: 'แจ้งเมื่อ', value: '3 พ.ย. 2569' },
  { label: 'กำหนดเสร็จ', value: '5 พ.ย. 2569' },
  { label: 'หมายเหตุ', value: 'รออะไหล่จากผู้ขาย 1 รายการ', span: 2 }, // รายการสุดท้ายกว้าง 2 คอลัมน์ แถวจึงเต็ม
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs ของ wu-descriptions', en: 'wu-descriptions inputs' },
      rows: [
        row('title', 'string', undefined, 'หัวข้อเหนือรายการ', 'A heading over the list'),
        row('items', 'WuDescriptionsEntry[]', undefined, 'รายการแบบข้อมูล (มาก่อน wu-descriptions-item ใน tag)', 'Items as data (shown before any wu-descriptions-item inside)'),
        row('columns', 'number', '1', 'จำนวนคอลัมน์เมื่อกล่องกว้างพอ (แคบกว่า 36rem เหลือหนึ่ง)', 'Columns on a wide enough box (one under 36rem)'),
        row('layout', "'horizontal' | 'vertical'", "'horizontal'", 'หัวข้ออยู่ข้างค่า หรืออยู่บนค่า', 'Label beside the value, or above it'),
        row('bordered', BOOL, 'false', 'แบบตารางช่องมีเส้น หัวข้อในช่องสีอ่อน', 'A table of cells, labels in a tinted cell'),
        row('size', "'small' | 'normal'", "'normal'", 'ระยะห่าง', 'Spacing'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-item',
      title: { th: 'Inputs ของ wu-descriptions-item', en: 'wu-descriptions-item inputs' },
      rows: [
        row('label', 'string', undefined, 'หัวข้อ', 'The label'),
        row('span', 'number', '1', 'กว้างกี่คอลัมน์ (ไม่เกิน columns)', 'How many columns it takes (at most columns)'),
        row('(content)', 'HTML', undefined, 'ค่าของรายการ: ข้อความ tag ลิงก์ ปุ่ม', 'The value: text, a tag, a link, a button'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuDescriptionsEntry {
  label: string;
  value?: string | number | null;   // number คั่นหลักพัน · ว่าง แสดง –
  span?: number;                    // กว้างกี่คอลัมน์ ค่าเริ่มต้น 1
}`,
    },
  ],
  tokens: [
    tok('--wu-descriptions-gap', 'ระยะระหว่างแถวและคอลัมน์', 'Gap between rows and columns'),
    tok('--wu-descriptions-label-width', 'ความกว้างของหัวข้อแบบ horizontal', 'Width of a horizontal label'),
    tok('--wu-descriptions-label-color · -label-weight', 'สีและน้ำหนักตัวอักษรของหัวข้อ', 'Colour and weight of the labels'),
    tok('--wu-descriptions-bordered-label-bg', 'พื้นช่องหัวข้อของแบบตาราง', 'Label cell background when bordered'),
    tok('--wu-border · --wu-card-bg · --wu-radius-md', 'เส้น พื้นช่อง และมุมของแบบตาราง', 'Lines, cell background and corners when bordered'),
    tok('--wu-heading-font-family', 'ฟอนต์ของ title', 'Font of the title'),
  ],
};
