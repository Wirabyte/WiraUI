import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

export const SPLITTER_DOC: ComponentDoc = {
  id: 'splitter',
  title: 'Splitter',
  group: 'Layout',
  entry: 'splitter',
  standalone: 'WuSplitter',
  module: 'WuSplitterModule',
  selector: 'wu-splitter',
  description: {
    th: 'แบ่งพื้นที่เป็นช่องที่ปรับขนาดได้ด้วยการลากเส้นแบ่ง แนวนอนหรือแนวตั้ง ซ้อนกันได้ กำหนดขนาดต่ำสุดได้ จำขนาดที่ผู้ใช้ปรับไว้ได้ และใช้คีย์บอร์ดได้',
    en: 'Splits an area into panels people resize by dragging the gutter between them: side by side or stacked, nested, with smallest sizes, sizes remembered for the user, and the keyboard.',
  },
  english: {
    'ห้องเรียน': 'Classes',
    'รายชื่อนักเรียน': 'Students',
    'ม.1/1': 'Grade 7/1',
    'ม.1/2': 'Grade 7/2',
    'ม.2/1': 'Grade 8/1',
    'เลือกห้องทางซ้ายเพื่อดูรายชื่อ': 'Pick a class on the left to see its students',
    'เมนู': 'Menu',
    'เนื้อหา': 'Content',
    'บันทึกย่อ': 'Notes',
    'ตัวอย่างก่อนพิมพ์': 'Print preview',
    'ช่องนี้แคบสุด 20%': 'this panel: 20% at the narrowest',
    'ขนาดเป็น % ของแต่ละช่อง': 'each panel’s size in %',
    'บันทึกขนาดที่ผู้ใช้ลากไว้': 'save the sizes the user dragged to',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuSplitterModule</code>) และ standalone (<code>WuSplitter</code> กับ <code>WuSplitterPanel</code>) · แต่ละช่องเป็น <code>&lt;wu-splitter-panel&gt;</code> (เขียน <code>wu-splitterPanel</code> ก็ได้) หรือ <code>&lt;ng-template pTemplate="panel"&gt;</code> แบบ template เดิม',
        en: 'Works as an NgModule (<code>WuSplitterModule</code>) or standalone (<code>WuSplitter</code> and <code>WuSplitterPanel</code>) · each panel is a <code>&lt;wu-splitter-panel&gt;</code> (or <code>wu-splitterPanel</code>), or an <code>&lt;ng-template pTemplate="panel"&gt;</code> as in existing templates.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ช่องเป็น <code>&lt;wu-splitter-panel&gt;</code> ตามลำดับ <code>[size]</code> คือขนาดเริ่มต้นเป็น % ช่องที่ไม่ใส่แบ่งพื้นที่ที่เหลือเท่า ๆ กัน · ลากเส้นแบ่งเพื่อปรับ ความสูงของทั้งชุดกำหนดด้วย <code>[style]</code>',
        en: 'Put the panels in order as <code>&lt;wu-splitter-panel&gt;</code>; <code>[size]</code> is the starting size in %, and panels without one share what is left equally · drag the gutter to resize; set the height of the whole with <code>[style]</code>.',
      },
    },
    vertical: {
      title: { th: 'แนวตั้งและซ้อนกัน', en: 'Vertical and nested' },
      text: {
        th: '<code>layout="vertical"</code> เรียงช่องจากบนลงล่าง · ใส่ wu-splitter ในช่องของอีกตัวเพื่อแบ่งซ้อน เช่น เมนูทางซ้าย กับเนื้อหาและบันทึกย่อซ้อนกันทางขวา',
        en: '<code>layout="vertical"</code> stacks the panels from top to bottom · put a wu-splitter inside a panel of another to nest them, such as a menu on the left with content over notes on the right.',
      },
    },
    sizes: {
      title: { th: 'ขนาดและขนาดต่ำสุด', en: 'Sizes and smallest sizes' },
      text: {
        th: '<code>[(panelSizes)]</code> ผูกขนาดทุกช่องเป็น array ของ % (อ่านหรือตั้งจากโค้ดได้) และ <code>[minSizes]</code> หรือ <code>[minSize]</code> ของแต่ละช่องคือขนาดเล็กสุดเป็น % · <code>(onResizeStart)</code> / <code>(onResizeEnd)</code> บอก <code>{ originalEvent, sizes }</code> · <code>gutterSize</code> คือความหนาของเส้นแบ่งเป็น px (ค่าเริ่มต้น 4)',
        en: '<code>[(panelSizes)]</code> binds every panel’s size as an array of % (read it or set it from code), and <code>[minSizes]</code>, or a panel’s <code>[minSize]</code>, is the smallest size in % · <code>(onResizeStart)</code> / <code>(onResizeEnd)</code> tell <code>{ originalEvent, sizes }</code> · <code>gutterSize</code> is the gutter thickness in px (4 by default).',
      },
    },
    state: {
      title: { th: 'จำขนาดไว้', en: 'Remembering the sizes' },
      text: {
        th: '<code>stateKey</code> เก็บขนาดที่ผู้ใช้ลากไว้ใน storage ของเบราว์เซอร์ เปิดหน้าใหม่ก็ได้ขนาดเดิม · <code>stateStorage</code> เป็น <code>\'session\'</code> (ค่าเริ่มต้น จนกว่าจะปิดแท็บ) หรือ <code>\'local\'</code> (เก็บไว้ถาวร) · ขนาดที่เก็บไว้ที่จำนวนช่องไม่ตรงกันถูกข้าม',
        en: '<code>stateKey</code> keeps the sizes the user dragged to in the browser’s storage, so the page opens with them again · <code>stateStorage</code> is <code>\'session\'</code> (the default, until the tab closes) or <code>\'local\'</code> (kept) · saved sizes for a different number of panels are skipped.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ดและ ARIA', en: 'Keyboard and ARIA' },
      text: {
        th: 'เส้นแบ่งแต่ละเส้นเป็นจุด Tab และเป็น <code>role="separator"</code> ที่บอกขนาดของช่องก่อนหน้าเป็น % · <code>←</code> <code>→</code> (แนวตั้งใช้ <code>↑</code> <code>↓</code>) เลื่อนทีละ <code>step</code> px (ค่าเริ่มต้น 5) และ <code>Home</code> / <code>End</code> ไปขนาดเล็กสุด / ใหญ่สุด · ชื่อจาก locale (<code>resizePanels</code>) · บนจอสัมผัสลากเส้นแบ่งได้ พื้นที่ที่กดได้กว้างกว่าเส้นที่เห็น',
        en: 'Each gutter is a Tab stop and a <code>role="separator"</code> that tells the size of the panel before it in % · <code>←</code> <code>→</code> (<code>↑</code> <code>↓</code> when vertical) move it by <code>step</code> px (5 by default), and <code>Home</code> / <code>End</code> go to the smallest / largest size · the name comes from the locale (<code>resizePanels</code>) · on a touch screen the gutter drags too, with a hit area wider than the line you see.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-splitter&gt;</code> เป็น <code>&lt;wu-splitter&gt;</code> input และ event ใช้ชื่อเดิม (<code>layout</code>, <code>panelSizes</code>, <code>minSizes</code>, <code>gutterSize</code>, <code>stateKey</code>, <code>stateStorage</code>, <code>step</code>, <code>onResizeStart</code>, <code>onResizeEnd</code>) และช่องแบบ <code>&lt;ng-template pTemplate="panel"&gt;</code> ใช้ได้เหมือนเดิม',
        en: 'Change <code>&lt;p-splitter&gt;</code> to <code>&lt;wu-splitter&gt;</code>; the inputs and events keep their names (<code>layout</code>, <code>panelSizes</code>, <code>minSizes</code>, <code>gutterSize</code>, <code>stateKey</code>, <code>stateStorage</code>, <code>step</code>, <code>onResizeStart</code>, <code>onResizeEnd</code>), and panels as <code>&lt;ng-template pTemplate="panel"&gt;</code> keep working.',
      },
    },
  },
  code: {
    basic: `<wu-splitter [style]="{ height: '16rem' }">
  <wu-splitter-panel [size]="30">
    <h3>ห้องเรียน</h3>
    <ul>
      <li>ม.1/1</li>
      <li>ม.1/2</li>
      <li>ม.2/1</li>
    </ul>
  </wu-splitter-panel>
  <wu-splitter-panel [size]="70">
    <h3>รายชื่อนักเรียน</h3>
    <p>เลือกห้องทางซ้ายเพื่อดูรายชื่อ</p>
  </wu-splitter-panel>
</wu-splitter>`,
    vertical: `<wu-splitter [style]="{ height: '20rem' }">
  <wu-splitter-panel [size]="25">เมนู</wu-splitter-panel>
  <wu-splitter-panel [size]="75">
    <wu-splitter layout="vertical">
      <wu-splitter-panel [size]="65">เนื้อหา</wu-splitter-panel>
      <wu-splitter-panel [size]="35">บันทึกย่อ</wu-splitter-panel>
    </wu-splitter>
  </wu-splitter-panel>
</wu-splitter>`,
    sizes: `<wu-splitter [(panelSizes)]="sizes" [minSizes]="[20, 30]" [gutterSize]="6" [step]="10"
  (onResizeEnd)="resized($event)" [style]="{ height: '12rem' }">
  <wu-splitter-panel>เมนู</wu-splitter-panel>         <!-- ช่องนี้แคบสุด 20% -->
  <wu-splitter-panel>ตัวอย่างก่อนพิมพ์</wu-splitter-panel>
</wu-splitter>`,
    state: `<!-- บันทึกขนาดที่ผู้ใช้ลากไว้ -->
<wu-splitter stateKey="report-layout" stateStorage="local" [style]="{ height: '12rem' }">
  <wu-splitter-panel [size]="40">เมนู</wu-splitter-panel>
  <wu-splitter-panel [size]="60">ตัวอย่างก่อนพิมพ์</wu-splitter-panel>
</wu-splitter>`,
  },
  ts: {
    sizes: `sizes = [35, 65];   // ขนาดเป็น % ของแต่ละช่อง
lastSizes: number[] = [];

resized(event: { sizes: number[] }): void {
  this.lastSizes = event.sizes;
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('layout', "'horizontal' | 'vertical'", "'horizontal'", 'ช่องเรียงซ้ายไปขวา หรือบนลงล่าง', 'Panels side by side, or top to bottom'),
        row('panelSizes', 'number[]', undefined, 'ขนาดเริ่มต้นของแต่ละช่องเป็น % (สองทาง [(panelSizes)])', 'Starting size of each panel in % (two-way [(panelSizes)])'),
        row('minSizes', 'number[]', '[]', 'ขนาดเล็กสุดของแต่ละช่องเป็น %', 'Smallest size of each panel in %'),
        row('gutterSize', 'number', '4', 'ความหนาของเส้นแบ่งเป็น px', 'Gutter thickness in px'),
        row('step', 'number', '5', 'ระยะที่ปุ่มลูกศรเลื่อนเส้นแบ่งเป็น px', 'How far an arrow key moves a gutter, in px'),
        row('stateKey', 'string', undefined, 'จำขนาดไว้ใต้ชื่อนี้', 'Remember the sizes under this key'),
        row('stateStorage', "'session' | 'local'", "'session'", 'ที่เก็บขนาดของ stateKey', 'Where stateKey keeps the sizes'),
        row('panelStyleClass · panelStyle', 'string · object', undefined, 'class / style ของทุกช่อง', 'Class / style of every panel'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-panel',
      title: 'wu-splitter-panel',
      rows: [
        row('size', 'number', undefined, 'ขนาดเริ่มต้นเป็น %', 'Starting size in %'),
        row('minSize', 'number', undefined, 'ขนาดเล็กสุดเป็น %', 'Smallest size in %'),
        row('styleClass · style', 'string · object', undefined, 'class / style ของช่องนี้', 'Class / style of this panel'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onResizeStart', '{ originalEvent, sizes }', undefined, 'เริ่มลากหรือกดปุ่มเลื่อนเส้นแบ่ง', 'A gutter starts moving (drag or key)'),
        row('onResizeEnd', '{ originalEvent, sizes }', undefined, 'ปรับเสร็จ พร้อมขนาดทุกช่องเป็น %', 'Done, with every panel’s size in %'),
        row('panelSizesChange', 'number[]', undefined, 'สำหรับ [(panelSizes)]', 'For [(panelSizes)]'),
      ],
    },
  ],
  tokens: [
    tok('--wu-splitter-bg', 'พื้นของช่อง', 'Panel background'),
    tok('--wu-splitter-color', 'สีตัวอักษร', 'Text colour'),
    tok('--wu-splitter-border-width', 'ความหนาขอบ', 'Border width'),
    tok('--wu-splitter-border-color', 'สีขอบ', 'Border colour'),
    tok('--wu-splitter-radius', 'มุมโค้ง', 'Corner radius'),
    tok('--wu-splitter-gutter-bg', 'สีเส้นแบ่ง', 'Gutter colour'),
    tok('--wu-splitter-gutter-active-bg', 'สีเส้นแบ่งตอนลากหรือโฟกัส', 'Gutter colour while dragged or focused'),
    tok('--wu-splitter-handle-length', 'ความยาวของจับที่เส้นแบ่ง', 'Length of the grip on the gutter'),
    tok('--wu-splitter-handle-bg', 'สีของจับ', 'Grip colour'),
    tok('--wu-splitter-hit-size', 'ความกว้างของพื้นที่ที่กดได้รอบเส้นแบ่ง', 'Width of the area around the gutter that takes a press'),
  ],
};
