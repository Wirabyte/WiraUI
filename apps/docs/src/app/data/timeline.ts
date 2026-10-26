import { ComponentDoc } from '../core/component-doc';
import { row, tok } from './doc-helpers';

const ORDERS_TS = `orders = [
  { status: 'สั่งซื้อแล้ว', date: '12 มี.ค. 2569 10:30', icon: 'wi wi-shopping-cart', color: '#6366f1' },
  { status: 'แพ็กสินค้า', date: '12 มี.ค. 2569 14:00', icon: 'wi wi-box', color: '#f59e0b' },
  { status: 'กำลังจัดส่ง', date: '13 มี.ค. 2569 09:15', icon: 'wi wi-truck', color: '#0ea5e9' },
  { status: 'ส่งถึงแล้ว', date: '14 มี.ค. 2569 16:45', icon: 'wi wi-check', color: '#10b981' },
];`;

export const TIMELINE_DOC: ComponentDoc = {
  id: 'timeline',
  title: 'Timeline',
  group: 'Display',
  entry: 'timeline',
  standalone: 'WtTimeline',
  module: 'WtTimelineModule',
  selector: 'wt-timeline',
  description: {
    th: 'เหตุการณ์เรียงตามเส้นเวลา เช่น สถานะคำสั่งซื้อหรือประวัติการแก้ไข แต่ละเหตุการณ์มีจุดบนเส้น เนื้อหา และของอีกฝั่งได้ เรียงแนวตั้งหรือแนวนอน',
    en: 'Events along a line, such as order statuses or an edit history. Each event has a marker, its content and, optionally, something on the other side, laid out vertically or horizontally.',
  },
  english: {
    'สั่งซื้อแล้ว': 'Ordered',
    'แพ็กสินค้า': 'Packed',
    'กำลังจัดส่ง': 'Shipped',
    'ส่งถึงแล้ว': 'Delivered',
    '12 มี.ค. 2569 10:30': '12 Mar 2026 10:30',
    '12 มี.ค. 2569 14:00': '12 Mar 2026 14:00',
    '13 มี.ค. 2569 09:15': '13 Mar 2026 09:15',
    '14 มี.ค. 2569 16:45': '14 Mar 2026 16:45',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtTimelineModule</code> ซึ่ง export <code>WtTemplate</code> ให้ด้วย) และ standalone (<code>WtTimeline</code>)',
        en: 'Works as an NgModule (<code>WtTimelineModule</code>, which also exports <code>WtTemplate</code>) or standalone (<code>WtTimeline</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือ array ของเหตุการณ์ template <code>content</code> วาดเนื้อหาของแต่ละเหตุการณ์ ได้เหตุการณ์เป็น <code>let-e</code> และลำดับเป็น <code>let-i="index"</code> ถ้าไม่มี template <code>opposite</code> เนื้อหาจะกว้างเต็มแถว',
        en: '<code>[value]</code> is the array of events. The <code>content</code> template draws each event, which arrives as <code>let-e</code> with its position as <code>let-i="index"</code>. Without an <code>opposite</code> template the content takes the whole row.',
      },
    },
    opposite: {
      title: { th: 'ของอีกฝั่ง', en: 'The opposite side' },
      text: {
        th: 'template <code>opposite</code> วางของไว้อีกฝั่งของเส้น เช่น วันเวลา ฝั่งนี้ชิดเข้าหาเส้นเอง',
        en: 'The <code>opposite</code> template puts something on the other side of the line, such as the date and time. It reads towards the line.',
      },
    },
    align: {
      title: { th: 'ฝั่งของเนื้อหา', en: 'Which side' },
      text: {
        th: '<code>align="right"</code> สลับเนื้อหากับของอีกฝั่ง และ <code>"alternate"</code> สลับกันทีละเหตุการณ์ (ค่าเริ่มต้นคือ <code>"left"</code>) แบบ alternate เว้นที่ไว้ทั้งสองฝั่งเสมอ แม้ไม่มี template <code>opposite</code>',
        en: '<code>align="right"</code> swaps the content and the opposite side, and <code>"alternate"</code> swaps them on every other event (the default is <code>"left"</code>). Alternate always keeps both sides, even without an <code>opposite</code> template.',
      },
    },
    marker: {
      title: { th: 'จุดบนเส้นแบบกำหนดเอง', en: 'Custom markers' },
      text: {
        th: 'template <code>marker</code> แทนจุดบนเส้น เช่น ไอคอนในวงกลมสีตามสถานะ เนื้อหาเป็นการ์ดหรืออะไรก็ได้',
        en: 'The <code>marker</code> template replaces the dot on the line, e.g. an icon in a circle coloured by status. The content can be a card or anything else.',
      },
    },
    horizontal: {
      title: { th: 'แนวนอน', en: 'Horizontal' },
      text: {
        th: '<code>layout="horizontal"</code> เรียงเหตุการณ์ตามแนวนอน ใช้ <code>align="top"</code> หรือ <code>"bottom"</code> เลือกว่าเนื้อหาอยู่บนหรือล่างเส้น (<code>"alternate"</code> ก็ได้)',
        en: '<code>layout="horizontal"</code> lays the events out in a row; <code>align="top"</code> or <code>"bottom"</code> puts the content above or below the line (<code>"alternate"</code> works too).',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-timeline&gt;</code> เป็น <code>&lt;wt-timeline&gt;</code> input <code>value</code>, <code>align</code>, <code>layout</code> และ template <code>content</code> / <code>opposite</code> / <code>marker</code> (เขียนเป็น <code>pTemplate</code> ก็ได้) ใช้ต่อได้ class <code>p-timeline-*</code> อยู่คู่กับ <code>wt-timeline-*</code>',
        en: 'Change <code>&lt;p-timeline&gt;</code> to <code>&lt;wt-timeline&gt;</code>. The <code>value</code>, <code>align</code> and <code>layout</code> inputs and the <code>content</code> / <code>opposite</code> / <code>marker</code> templates (<code>pTemplate</code> works too) carry over, and the <code>p-timeline-*</code> classes sit next to <code>wt-timeline-*</code>.',
      },
    },
  },
  code: {
    basic: `<wt-timeline [value]="orders">
  <ng-template #content let-e let-i="index">{{ i + 1 }}. {{ e.status }}</ng-template>
</wt-timeline>`,
    opposite: `<wt-timeline [value]="orders">
  <ng-template #opposite let-e>
    <small class="text-color-secondary">{{ e.date }}</small>
  </ng-template>
  <ng-template #content let-e>{{ e.status }}</ng-template>
</wt-timeline>`,
    align: `<wt-timeline [value]="orders" align="right">
  <ng-template #opposite let-e>
    <small class="text-color-secondary">{{ e.date }}</small>
  </ng-template>
  <ng-template #content let-e>{{ e.status }}</ng-template>
</wt-timeline>

<wt-timeline [value]="orders" align="alternate">
  <ng-template #opposite let-e>
    <small class="text-color-secondary">{{ e.date }}</small>
  </ng-template>
  <ng-template #content let-e>{{ e.status }}</ng-template>
</wt-timeline>`,
    marker: `<wt-timeline [value]="orders">
  <ng-template #marker let-e>
    <span class="flex align-items-center justify-content-center w-2rem h-2rem border-circle text-white"
      [style.background-color]="e.color">
      <i [class]="e.icon"></i>
    </span>
  </ng-template>
  <ng-template #content let-e>
    <div class="p-3 mb-3 surface-card border-1 surface-border border-round">
      <div class="font-semibold">{{ e.status }}</div>
      <small class="text-color-secondary">{{ e.date }}</small>
    </div>
  </ng-template>
</wt-timeline>`,
    horizontal: `<wt-timeline [value]="orders" layout="horizontal" align="top">
  <ng-template #content let-e>{{ e.status }}</ng-template>
</wt-timeline>

<wt-timeline [value]="orders" layout="horizontal" align="bottom">
  <ng-template #content let-e>{{ e.status }}</ng-template>
</wt-timeline>`,
  },
  ts: {
    basic: ORDERS_TS,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'unknown[]', '[]', 'เหตุการณ์ทั้งหมด', 'The events'),
        row('align', "'left' | 'right' | 'alternate' | 'top' | 'bottom'", "'left'", 'ฝั่งของเนื้อหา (top / bottom ใช้กับแนวนอน)', 'Which side the content sits on (top / bottom when horizontal)'),
        row('layout', "'vertical' | 'horizontal'", "'vertical'", 'แนวตั้งหรือแนวนอน', 'Vertical or horizontal'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของกล่อง', 'Box class / style'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #content, wtTemplate="content" หรือ pTemplate="content" ก็ได้',
        en: 'Write them as #content, wtTemplate="content" or pTemplate="content".',
      },
      rows: [
        row('content', '$implicit (event) · index', undefined, 'เนื้อหาของแต่ละเหตุการณ์', "Each event's content"),
        row('opposite', '$implicit (event) · index', undefined, 'ของอีกฝั่งของเส้น ไม่ใส่ = เนื้อหากว้างเต็มแถว (ยกเว้น alternate)', 'The other side of the line; left out, the content takes the whole row (except alternate)'),
        row('marker', '$implicit (event) · index', undefined, 'แทนจุดบนเส้น', 'Replaces the dot on the line'),
      ],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WtTimelineAlign = 'left' | 'right' | 'alternate' | 'top' | 'bottom';
type WtTimelineLayout = 'vertical' | 'horizontal';

interface WtTimelineContext {
  $implicit: unknown;
  index: number;
}`,
    },
  ],
  tokens: [
    tok('--wt-timeline-event-min-height', 'ความสูงขั้นต่ำของแต่ละเหตุการณ์ (แนวตั้ง)', 'Minimum height of each event (vertical)'),
    tok('--wt-timeline-content-padding', 'ระยะรอบเนื้อหาและของอีกฝั่ง (แนวตั้ง)', 'Padding around the content and the opposite side (vertical)'),
    tok('--wt-timeline-horizontal-padding', 'ระยะรอบเนื้อหาและของอีกฝั่ง (แนวนอน)', 'Padding around the content and the opposite side (horizontal)'),
    tok('--wt-timeline-marker-size', 'ขนาดจุดบนเส้น', 'Marker size'),
    tok('--wt-timeline-marker-border-width', 'ความหนาขอบของจุด', 'Marker border width'),
    tok('--wt-timeline-marker-border-color', 'สีขอบของจุด', 'Marker border colour'),
    tok('--wt-timeline-marker-bg', 'พื้นของจุด', 'Marker background'),
    tok('--wt-timeline-connector-size', 'ความหนาของเส้น', 'Line thickness'),
    tok('--wt-timeline-connector-color', 'สีของเส้น', 'Line colour'),
  ],
};
