import { ComponentDoc } from '../core/component-doc';
import { importText, row, tok } from './doc-helpers';

export const METERGROUP_DOC: ComponentDoc = {
  id: 'metergroup',
  title: 'MeterGroup',
  group: 'Display',
  entry: 'metergroup',
  standalone: 'WuMeterGroup',
  module: 'WuMeterGroupModule',
  selector: 'wu-metergroup',
  description: {
    th: 'หลายค่าบนแถบเดียวพร้อมคำอธิบาย เช่น พื้นที่จัดเก็บที่ใช้ไปแยกตามประเภท สีวนตามสีของธีมเองถ้าไม่กำหนด',
    en: 'Several values on one bar with a legend, such as storage used by type. Colours cycle through the theme\'s own when not set.',
  },
  english: {
    'พื้นที่จัดเก็บ': 'Storage',
    'ใช้ไป': 'Used',
    'พื้นที่ 200 GB': 'Storage, 200 GB',
    'ใช้ไปทั้งหมด': 'Used in total',
    'รูปภาพ': 'Photos',
    'วิดีโอ': 'Videos',
    'เอกสาร': 'Documents',
    'อื่น ๆ': 'Other',
    'ใช้ไป 96 จาก 200 GB': '96 of 200 GB used',
    'ระบบ': 'System',
    'แอป': 'Apps',
    'สี CSS ใดก็ได้ ไม่ใส่ = สีของธีมวนไป': 'any CSS colour; left out = the theme colours in turn',
    'ปกติ': 'Normal',
    'เติมจากล่างขึ้นบน': 'fills from the bottom',
  },
  sections: {
    import: { title: 'Import', text: importText },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>value</code> เป็น array ของ <code>{ label, value, color?, icon? }</code> ค่านับเทียบกับ <code>min</code>–<code>max</code> (0–100)',
        en: '<code>value</code> is an array of <code>{ label, value, color?, icon? }</code>, read against <code>min</code>–<code>max</code> (0–100).',
      },
    },
    multiple: {
      title: 'Multiple',
      text: {
        th: 'ไม่ใส่ <code>color</code> สีจะวนเป็น primary, info, success, warn, danger และ help ของธีม',
        en: 'Without <code>color</code>, the parts take the theme\'s primary, info, success, warn, danger and help colours in turn.',
      },
    },
    icons: { title: 'Icons', text: { th: '<code>icon</code> แสดงแทนจุดสีในคำอธิบาย', en: '<code>icon</code> shows instead of the colour dot in the legend.' } },
    label: {
      title: { th: 'ตำแหน่งคำอธิบาย', en: 'Legend position' },
      text: {
        th: '<code>labelPosition="start"</code> วางคำอธิบายไว้ก่อนแถบ และ <code>labelOrientation="vertical"</code> เรียงเป็นแนวตั้ง',
        en: '<code>labelPosition="start"</code> puts the legend before the bar, and <code>labelOrientation="vertical"</code> stacks it.',
      },
    },
    vertical: {
      title: 'Vertical',
      text: {
        th: '<code>orientation="vertical"</code> แถบตั้งเต็มความสูงของตัว element จึงต้องกำหนดความสูง เช่น <code>style="height: 20rem"</code>',
        en: '<code>orientation="vertical"</code> fills the height of the element, so give it one, e.g. <code>style="height: 20rem"</code>.',
      },
    },
    reverse: {
      title: { th: 'เติมจากอีกด้าน', en: 'Reverse' },
      text: {
        th: '<code>[reverse]="true"</code> เริ่มเติมช่วงต่าง ๆ จากอีกด้านของแถบ: แนวตั้งเติมจากล่างขึ้นบน (แบบแท็งก์น้ำ) แนวนอนเติมจากขวาไปซ้าย คำอธิบายยังเรียงตามเดิม ตัวอย่างนี้วางแบบปกติไว้คู่กัน',
        en: '<code>[reverse]="true"</code> fills the parts from the other end of the bar: a vertical meter fills from the bottom up (like a tank), a horizontal one from right to left; the legend keeps its order. The normal one sits beside it here.',
      },
    },
    minmax: {
      title: 'Min / Max',
      text: { th: 'นับเป็นหน่วยจริงได้ เช่น GB โดยตั้ง <code>[max]</code> เป็นความจุ', en: 'Count in real units, such as GB, by setting <code>[max]</code> to the capacity.' },
    },
    template: {
      title: 'Templates',
      text: {
        th: 'template <code>label</code> (<code>let-value</code>, <code>totalPercent</code>, <code>percentages</code>) แทนคำอธิบายทั้งหมด ส่วน <code>start</code> / <code>end</code> วางก่อน / หลังแถบ <code>meter</code> แทนแต่ละช่วง และ <code>icon</code> แทนจุดสี ตัวอย่างนี้ทำเป็นการ์ดสรุปพื้นที่ใต้แถบ',
        en: 'The <code>label</code> template (<code>let-value</code>, <code>totalPercent</code>, <code>percentages</code>) replaces the legend; <code>start</code> / <code>end</code> go before / after the bar, <code>meter</code> draws each part and <code>icon</code> the marker. Here it becomes storage summary cards under the bar.',
      },
    },
  },
  code: {
    basic: `<wu-metergroup [value]="[{ label: 'ใช้ไป', value: 32 }]" ariaLabel="พื้นที่จัดเก็บ"></wu-metergroup>`,
    multiple: `<wu-metergroup [value]="storage" ariaLabel="พื้นที่จัดเก็บ"></wu-metergroup>`,
    icons: `<wu-metergroup [value]="storageIcons" ariaLabel="พื้นที่จัดเก็บ"></wu-metergroup>`,
    label: `<wu-metergroup [value]="storage" labelPosition="start" labelOrientation="vertical"></wu-metergroup>`,
    vertical: `<wu-metergroup [value]="storage" orientation="vertical" labelOrientation="vertical"
  style="height: 20rem"></wu-metergroup>`,
    minmax: `<wu-metergroup [value]="usedGb" [min]="0" [max]="200" ariaLabel="พื้นที่ 200 GB"></wu-metergroup>`,
    reverse: `<wu-metergroup [value]="storage" orientation="vertical" labelOrientation="vertical" style="height: 14rem"></wu-metergroup>

<!-- เติมจากล่างขึ้นบน -->
<wu-metergroup [value]="storage" orientation="vertical" labelOrientation="vertical" [reverse]="true"
  style="height: 14rem"></wu-metergroup>`,
    template: {
      classic: `<wu-metergroup [value]="storage" labelPosition="start">
  <ng-template wuTemplate="label" let-value let-percentages="percentages">
    <div class="storage-cards">
      <div *ngFor="let item of value; let i = index" class="storage-card">
        <span class="storage-name">{{ item.label }}</span>
        <b>{{ percentages[i] }}%</b>
      </div>
    </div>
  </ng-template>
  <ng-template wuTemplate="end" let-totalPercent="totalPercent">
    <p class="storage-total">ใช้ไปทั้งหมด {{ totalPercent }}%</p>
  </ng-template>
</wu-metergroup>`,
      v3: `<wu-metergroup [value]="storage" labelPosition="start">
  <ng-template #label let-value let-percentages="percentages">
    <div class="storage-cards">
      @for (item of value; track item.label; let i = $index) {
      <div class="storage-card">
        <span class="storage-name">{{ item.label }}</span>
        <b>{{ percentages[i] }}%</b>
      </div>
      }
    </div>
  </ng-template>
  <ng-template #end let-totalPercent="totalPercent">
    <p class="storage-total">ใช้ไปทั้งหมด {{ totalPercent }}%</p>
  </ng-template>
</wu-metergroup>`,
    },
  },
  ts: {
    multiple: `storage: WuMeterItem[] = [
  { label: 'รูปภาพ', value: 24 },
  { label: 'วิดีโอ', value: 16 },
  { label: 'เอกสาร', value: 12 },
  { label: 'อื่น ๆ', value: 8 },
];`,
    icons: `storageIcons: WuMeterItem[] = [
  { label: 'รูปภาพ', value: 24, icon: 'wi wi-image' },
  { label: 'วิดีโอ', value: 16, icon: 'wi wi-video' },
  { label: 'เอกสาร', value: 12, icon: 'wi wi-file' },
];`,
    minmax: `// ใช้ไป 96 จาก 200 GB
usedGb: WuMeterItem[] = [
  { label: 'ระบบ', value: 40, color: '#64748b' },
  { label: 'แอป', value: 56, color: '#1e7ae0' },
];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'WuMeterItem[]', '[]', 'ช่วงต่าง ๆ บนแถบ', 'The parts of the bar'),
        row('min · max', 'number', '0 · 100', 'ช่วงที่ค่านับเทียบ', 'Range the values are read against'),
        row('orientation', "'horizontal' | 'vertical'", "'horizontal'", 'แนวของแถบ (vertical เต็มความสูงของ element)', 'Bar direction (vertical fills the element height)'),
        row('reverse', 'boolean', 'false', 'เติมจากอีกด้าน: ขวาไปซ้าย หรือ (แนวตั้ง) ล่างขึ้นบน คำอธิบายเรียงเหมือนเดิม', 'Fill from the other end: right to left, or (vertical) bottom to top; the legend keeps its order'),
        row('labelPosition', "'start' | 'end'", "'end'", 'คำอธิบายก่อนหรือหลังแถบ', 'Legend before or after the bar'),
        row('labelOrientation', "'horizontal' | 'vertical'", "'horizontal'", 'คำอธิบายเรียงแถวหรือคอลัมน์', 'Legend in a row or a column'),
        row('styleClass · style', 'string · object', undefined, 'class และ style เพิ่ม (style เป็น object)', 'Extra class and style (style is an object)'),
        row('ariaLabel', 'string', undefined, 'ชื่อสำหรับ screen reader (role="meter")', 'Accessible name (role="meter")'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [
        row('label', '$implicit (items) · totalPercent · percentages', undefined, 'คำอธิบายทั้งหมด', 'The whole legend'),
        row('meter', '$implicit (item) · index · size · class · orientation', undefined, 'แต่ละช่วงบนแถบ', 'One part of the bar'),
        row('start · end', '$implicit (items) · totalPercent · percentages', undefined, 'เนื้อหาก่อน / หลังแถบ', 'Content before / after the bar'),
        row('icon', '$implicit (item) · icon', undefined, 'เครื่องหมายของแต่ละรายการในคำอธิบาย', 'Marker of one legend item'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `interface WuMeterItem {
  label?: string;
  value: number;
  color?: string;   // สี CSS ใดก็ได้ ไม่ใส่ = สีของธีมวนไป
  icon?: string;
}
type WuMeterOrientation = 'horizontal' | 'vertical';
type WuMeterLabelPosition = 'start' | 'end';`,
    },
  ],
  tokens: [
    tok('--wu-metergroup-size', 'ความหนาของแถบ', 'Bar thickness'),
    tok('--wu-metergroup-gap', 'ระยะระหว่างแถบกับคำอธิบาย', 'Gap between the bar and the legend'),
    tok('--wu-metergroup-radius', 'ความมนของแถบ', 'Bar radius'),
    tok('--wu-metergroup-bg', 'พื้นราง', 'Track background'),
  ],
};
