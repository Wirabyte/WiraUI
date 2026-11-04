import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';
const SEVERITY = "'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'";

export const STAT_DOC: ComponentDoc = {
  id: 'stat',
  title: 'Stat',
  group: 'Display',
  entry: 'stat',
  standalone: 'WuStat',
  module: 'WuStatModule',
  selector: 'wu-stat',
  description: {
    th: 'การ์ดตัวเลขสำคัญ (KPI) ของหน้าแดชบอร์ด: ไอคอนในกล่องสีอ่อน ชื่อ ตัวเลขตัวใหญ่ที่คั่นหลักพันตามภาษาของแอป แนวโน้ม ▲ / ▼ ที่บอกว่าเป็นข่าวดีหรือไม่ และคำอธิบายสั้น ๆ ทั้งการ์ดเป็นปุ่มได้ และแสดงแสงวิ่งระหว่างรอตัวเลข',
    en: 'A key-figure (KPI) card for dashboards: an icon in a soft tile, a label, the value in large figures with thousands separators in the app’s language, a ▲ / ▼ trend coloured by whether it is good news, and a short hint. The whole card can be a button, and it shimmers while the number loads.',
  },
  english: {
    'Ticket ที่เปิดอยู่': 'Open tickets',
    'รอช่างรับงาน 3 รายการ': '3 waiting for a technician',
    'ปิดงานเดือนนี้': 'Closed this month',
    'จากเดือนก่อน': 'vs last month',
    'เวลาตอบกลับเฉลี่ย': 'Average first reply',
    'ชม.': 'h',
    'ช้าลงจากเดือนก่อน': 'slower than last month',
    'ความพึงพอใจ': 'Satisfaction',
    'จาก 326 คำตอบ': 'from 326 answers',
    'รายรับเดือนนี้': 'Revenue this month',
    'ผู้เข้าใช้ระบบวันนี้': 'Sign-ins today',
    'คน': 'people',
    'สถานะเซิร์ฟเวอร์': 'Server status',
    'ปกติ': 'Normal',
    'คำขอต่อชั่วโมง': 'Requests per hour',
    'จากชั่วโมงก่อน': 'vs last hour',
    'Ticket ใหม่วันนี้': 'New tickets today',
    'รอการอนุมัติ 5 รายการ เปิดรายการ': '5 awaiting approval, open the list',
    'รอการอนุมัติ': 'Awaiting approval',
    'โหลดใหม่': 'Reload',
    'เปิดรายการ': 'Opened list',
    'เช่น เปิดหน้ารายการด้วย router ของแอป': "e.g. open the list with the app's router",
    'หนึ่งคอลัมน์บนมือถือ สองคอลัมน์บนแท็บเล็ต สี่คอลัมน์บนจอกว้าง': 'one column on a phone, two on a tablet, four on a wide screen',
    'ขึ้นเป็นข่าวดี (ค่าเริ่มต้น): ▲ สีเขียว': 'up is good news (the default): ▲ in green',
    'ยิ่งน้อยยิ่งดี: ▼ สีเขียว, ▲ สีแดง': 'lower is better: ▼ in green, ▲ in red',
    'string แสดงตามที่ใส่, trendSuffix แทน %': 'a string shows as it is; trendSuffix replaces %',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuStatModule</code>) และ standalone (<code>WuStat</code>)',
        en: 'Works as an NgModule (<code>WuStatModule</code>) or standalone (<code>WuStat</code>).',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>label</code> ชื่อของตัวเลข · <code>value</code> ตัวเลข (number คั่นหลักพันตามภาษาของแอปให้เอง) · <code>icon</code> ไอคอนในกล่องสีอ่อนของ <code>severity</code> (ค่าเริ่มต้น <code>primary</code>) · <code>hint</code> บรรทัดสีจางใต้ตัวเลข การ์ดใช้ token ของ Card จึงเข้ากับการ์ดอื่นในหน้า',
        en: '<code>label</code> names the figure · <code>value</code> is the figure (a number gets thousands separators in the app’s language) · <code>icon</code> sits in a soft tile of the <code>severity</code> colour (default <code>primary</code>) · <code>hint</code> is a muted line under it. It uses the Card tokens, so it matches the other cards on the page.',
      },
    },
    grid: {
      title: { th: 'แถว KPI ของแดชบอร์ด', en: 'A dashboard KPI row' },
      text: {
        th: 'วาง <code>wu-stat</code> หลายใบใน grid ของแอป ใบเท่ากันทุกใบและสูงเท่ากันในแถว ตัวอย่างนี้เป็น 4 คอลัมน์บนจอกว้าง 2 คอลัมน์บนแท็บเล็ต และคอลัมน์เดียวบนมือถือ',
        en: 'Put several <code>wu-stat</code> cards in a grid of your own: they share the width and the row height. This one is four columns on a wide screen, two on a tablet and one on a phone.',
      },
    },
    trend: {
      title: { th: 'แนวโน้ม: ข่าวดีหรือข่าวร้าย', en: 'Trend: good news or bad' },
      text: {
        th: '<code>trend</code> เป็น number ได้เครื่องหมาย + / − และ <code>trendSuffix</code> (ค่าเริ่มต้น <code>%</code>) ต่อท้าย เป็น string แสดงตามที่ใส่ · ▲ / ▼ มาจากเครื่องหมายของค่า สีมาจาก <code>trendGood</code>: <code>up</code> (ค่าเริ่มต้น) ขึ้นเป็นสีเขียว ส่วนตัวเลขที่ยิ่งน้อยยิ่งดี (Ticket ค้าง เวลารอ ค่าใช้จ่าย) ใส่ <code>trendGood="down"</code> ลงจึงเป็นสีเขียว · <code>trendLabel</code> คำต่อท้าย เช่น "จากเดือนก่อน" · screen reader อ่านว่า "เพิ่มขึ้น" / "ลดลง" ตาม locale',
        en: '<code>trend</code> as a number gets a + / − sign and <code>trendSuffix</code> (default <code>%</code>); a string shows as it is · ▲ / ▼ follow the sign, the colour follows <code>trendGood</code>: with <code>up</code> (the default) a rise is green, and for figures that should fall (open tickets, waiting time, costs) <code>trendGood="down"</code> makes a fall green · <code>trendLabel</code> follows it, such as “vs last month” · screen readers say “Up” / “Down” from the locale.',
      },
    },
    value: {
      title: { th: 'หน่วย คำนำหน้า และข้อความ', en: 'Units, prefixes and text' },
      text: {
        th: '<code>prefix</code> ตัวเล็กหน้าตัวเลข (เช่น ฿) · <code>unit</code> ตัวเล็กหลังตัวเลข (คน ครั้ง ชม.) · <code>value</code> ที่เป็น string แสดงตามที่ใส่ (สถานะหรือตัวเลขที่จัดรูปแบบมาแล้ว) · ไม่มีค่าแสดง –',
        en: '<code>prefix</code> goes small before the figure (such as ฿) · <code>unit</code> small after it (people, times, h) · a string <code>value</code> shows as it is (a status, or a figure you formatted) · no value shows –.',
      },
    },
    content: {
      title: { th: 'เนื้อหาใต้ตัวเลข', en: 'Content under the figures' },
      text: {
        th: 'สิ่งที่อยู่ใน tag ไปอยู่ใต้ตัวเลขและแนวโน้ม เช่น กราฟเส้นเล็ก (sparkline) แถบความคืบหน้า หรือลิงก์',
        en: 'Whatever is inside the tag goes under the figures and the trend: a sparkline, a progress bar or a link.',
      },
    },
    states: {
      title: { th: 'กำลังโหลด และกดได้', en: 'Loading and clickable' },
      text: {
        th: '<code>loading</code> แสดงแสงวิ่งแทนตัวเลขระหว่างรอ API (ชื่อและไอคอนยังอยู่) · <code>[clickable]="true"</code> ทั้งการ์ดเป็น <code>&lt;button&gt;</code> กดด้วยคีย์บอร์ดได้ และส่ง <code>(onClick)</code> พร้อม MouseEvent ใช้เปิดรายการที่ตัวเลขนั้นนับ ใส่ <code>ariaLabel</code> ให้บอกว่ากดแล้วไปไหน',
        en: '<code>loading</code> shows a shimmer instead of the figures while the API answers (the label and icon stay) · with <code>[clickable]="true"</code> the whole card is a <code>&lt;button&gt;</code>, works from the keyboard and emits <code>(onClick)</code> with the MouseEvent, to open the list the figure counts. Give it an <code>ariaLabel</code> that says where it goes.',
      },
    },
  },
  code: {
    basic: `<wu-stat label="Ticket ที่เปิดอยู่" [value]="12" icon="wi wi-ticket" severity="info"
  hint="รอช่างรับงาน 3 รายการ"></wu-stat>`,
    grid: `<div class="kpi-grid">
  <wu-stat label="Ticket ที่เปิดอยู่" [value]="12" icon="wi wi-ticket" severity="info"
    [trend]="-8" trendGood="down" trendLabel="จากเดือนก่อน"></wu-stat>
  <wu-stat label="ปิดงานเดือนนี้" [value]="1284" icon="wi wi-check-circle" severity="success"
    [trend]="12.5" trendLabel="จากเดือนก่อน"></wu-stat>
  <wu-stat label="เวลาตอบกลับเฉลี่ย" value="1.4" unit="ชม." icon="wi wi-clock" severity="warn"
    [trend]="6" trendGood="down" trendLabel="ช้าลงจากเดือนก่อน"></wu-stat>
  <wu-stat label="ความพึงพอใจ" value="4.8" unit="/ 5" icon="wi wi-star" severity="help"
    trend="+0.2" hint="จาก 326 คำตอบ"></wu-stat>
</div>`,
    trend: `<!-- ขึ้นเป็นข่าวดี (ค่าเริ่มต้น): ▲ สีเขียว -->
<wu-stat label="ปิดงานเดือนนี้" [value]="1284" [trend]="12.5" trendLabel="จากเดือนก่อน"></wu-stat>

<!-- ยิ่งน้อยยิ่งดี: ▼ สีเขียว, ▲ สีแดง -->
<wu-stat label="Ticket ที่เปิดอยู่" [value]="12" [trend]="-8" trendGood="down" trendLabel="จากเดือนก่อน"></wu-stat>
<wu-stat label="เวลาตอบกลับเฉลี่ย" value="1.4" unit="ชม." [trend]="6" trendGood="down"></wu-stat>

<!-- string แสดงตามที่ใส่, trendSuffix แทน % -->
<wu-stat label="ความพึงพอใจ" value="4.8" unit="/ 5" trend="+0.2"></wu-stat>
<wu-stat label="คำขอต่อชั่วโมง" [value]="486" [trend]="32" trendSuffix=""></wu-stat>`,
    value: `<wu-stat label="รายรับเดือนนี้" [value]="128400" prefix="฿" icon="wi wi-money-bill" severity="success"></wu-stat>
<wu-stat label="ผู้เข้าใช้ระบบวันนี้" [value]="3542" unit="คน" icon="wi wi-users"></wu-stat>
<wu-stat label="สถานะเซิร์ฟเวอร์" value="ปกติ" icon="wi wi-server" severity="secondary"></wu-stat>`,
    content: `<wu-stat label="คำขอต่อชั่วโมง" [value]="486" icon="wi wi-chart-line" [trend]="4.2" trendLabel="จากชั่วโมงก่อน">
  <svg class="sparkline" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="0,24 15,20 30,22 45,14 60,16 75,9 90,12 105,6 120,8" />
  </svg>
</wu-stat>`,
    states: `<wu-stat label="Ticket ใหม่วันนี้" [value]="7" icon="wi wi-bell" [loading]="isLoading"></wu-stat>
<wu-stat label="รอการอนุมัติ" [value]="5" icon="wi wi-hourglass" severity="warn" [clickable]="true"
  ariaLabel="รอการอนุมัติ 5 รายการ เปิดรายการ" (onClick)="openList('pending')"></wu-stat>
<wu-button label="โหลดใหม่" icon="wi wi-refresh" severity="secondary" [outlined]="true" (onClick)="reload()"></wu-button>`,
  },
  ts: {
    states: `isLoading = false;
opened = '';

reload(): void {
  this.isLoading = true;
  setTimeout(() => (this.isLoading = false), 1200);
}

openList(status: string): void {
  this.opened = status; // เช่น เปิดหน้ารายการด้วย router ของแอป
}`,
  },
  css: {
    grid: `/* หนึ่งคอลัมน์บนมือถือ สองคอลัมน์บนแท็บเล็ต สี่คอลัมน์บนจอกว้าง */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(var(--kpi-columns, 1), minmax(0, 1fr));
  gap: 1rem;
}
@media (min-width: 576px) {
  .kpi-grid { --kpi-columns: 2; }
}
@media (min-width: 1200px) {
  .kpi-grid { --kpi-columns: 4; }
}`,
    content: `.sparkline {
  display: block;
  width: 100%;
  height: 2rem;
  margin-top: 0.5rem;
  fill: none;
  stroke: var(--wu-primary-color);
  stroke-width: 2;
}
.sparkline polyline {
  vector-effect: non-scaling-stroke;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('label', 'string', undefined, 'ชื่อของตัวเลข', 'What the figure is'),
        row('value', 'number | string', undefined, 'ตัวเลข: number คั่นหลักพันตามภาษาของแอป string แสดงตามที่ใส่ ไม่มีค่าแสดง –', 'The figure: a number gets thousands separators in the app’s language, a string shows as it is, none shows –'),
        row('prefix · unit', 'string', undefined, 'ข้อความตัวเล็กหน้า / หลังตัวเลข เช่น ฿ · คน', 'Small text before / after the figure, such as ฿ · people'),
        row('icon', 'string', undefined, "class ของไอคอน เช่น 'wi wi-ticket'", "Icon class, e.g. 'wi wi-ticket'"),
        row('severity', SEVERITY, "'primary'", 'สีของกล่องไอคอน', 'Colour of the icon tile'),
        row('hint', 'string', undefined, 'บรรทัดสีจางใต้ตัวเลข', 'A muted line under the figure'),
        row('trend', 'number | string', undefined, 'การเปลี่ยนแปลง: number ได้เครื่องหมายและ trendSuffix · string แสดงตามที่ใส่', 'The change: a number gets a sign and trendSuffix · a string shows as it is'),
        row('trendSuffix', 'string', "'%'", 'ต่อท้าย trend ที่เป็น number', 'After a numeric trend'),
        row('trendGood', "'up' | 'down'", "'up'", 'ทิศที่เป็นข่าวดี: สีเขียวหรือแดงของ ▲ / ▼', 'Which direction is good news: green or red for ▲ / ▼'),
        row('trendLabel', 'string', undefined, 'คำหลังแนวโน้ม เช่น "จากเดือนก่อน"', 'Words after the trend, such as “vs last month”'),
        row('clickable', BOOL, 'false', 'ทั้งการ์ดเป็นปุ่มที่ส่ง (onClick)', 'The whole card is a button that emits (onClick)'),
        row('loading', BOOL, 'false', 'แสงวิ่งแทนตัวเลขระหว่างรอ', 'A shimmer instead of the figures while it loads'),
        row('ariaLabel', 'string', undefined, 'ชื่อของการ์ดสำหรับ screen reader (การ์ดที่กดได้ควรบอกว่าไปไหน)', 'Accessible name (a clickable card should say where it goes)'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('onClick', 'MouseEvent', undefined, 'กดการ์ด (เมื่อ clickable)', 'The card was pressed (with clickable)')],
    },
    {
      id: 'api-slots',
      title: { th: 'เนื้อหาใน tag', en: 'Content' },
      rows: [row('(content)', 'HTML', undefined, 'อยู่ใต้ตัวเลขและแนวโน้ม เช่น sparkline', 'Under the figures and the trend, e.g. a sparkline')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `type WuStatSeverity = ${SEVERITY};`,
    },
  ],
  tokens: [
    tok('--wu-stat-gap', 'ระยะระหว่างกล่องไอคอนกับตัวเลข', 'Gap between the icon tile and the figures'),
    tok('--wu-stat-icon-size', 'ขนาดกล่องไอคอน (ไอคอนราว 45%)', 'Size of the icon tile (the icon about 45% of it)'),
    tok('--wu-stat-label-size', 'ขนาดตัวอักษรของชื่อ', 'Font size of the label'),
    tok('--wu-stat-value-size · -value-weight', 'ขนาดและน้ำหนักของตัวเลข (ฟอนต์หัวข้อ --wu-heading-font-family)', 'Size and weight of the figure (in the heading font, --wu-heading-font-family)'),
    tok('--wu-card-padding · -radius · -bg · -shadow · -border-width', 'กล่องของการ์ด มาจาก token ของ Card', 'The card box, from the Card tokens'),
    tok('--wu-tag-soft-mix', 'ความเข้มของพื้นกล่องไอคอน (เท่ากับ tag แบบอ่อน)', 'Strength of the icon tile’s tint (as soft tags)'),
    tok('--wu-success-text · --wu-danger-text', 'สีของแนวโน้มที่ดี / ไม่ดี', 'Colour of a good / bad trend'),
  ],
};
