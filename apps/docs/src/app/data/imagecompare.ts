import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

export const IMAGECOMPARE_DOC: ComponentDoc = {
  id: 'imagecompare',
  title: 'ImageCompare',
  group: 'Media',
  entry: 'imagecompare',
  standalone: 'WuImageCompare',
  module: 'WuImageCompareModule',
  selector: 'wu-imageCompare',
  description: {
    th: 'เทียบภาพสองภาพในกรอบเดียว ลากเส้นแบ่งไปมาเพื่อดูก่อนและหลัง เช่น อาคารก่อนและหลังปรับปรุง หรือภาพก่อนและหลังแต่งสี ใช้เมาส์ นิ้ว หรือคีย์บอร์ดได้',
    en: 'Two pictures in one frame with a divider you drag to compare them, such as a building before and after its renovation, or a photo before and after its colours were fixed. Works with a mouse, a finger or the keyboard.',
  },
  english: {
    'ก่อน': 'Before',
    'หลัง': 'After',
    'ภาพขาวดำก่อนปรับสี': 'Black and white, before the colours',
    'ภาพสีหลังปรับ': 'In colour, after',
    'เทียบภาพก่อนและหลังปรับสี': 'Compare before and after the colours',
    'ภาพหลัง (left) เต็มกรอบ': 'the after picture (left) fills the frame',
    'ภาพก่อน (right) แสดงจากขอบซ้ายถึงเส้นแบ่ง': 'the before picture (right) shows from the left edge to the divider',
    'ตำแหน่งเส้นแบ่ง': 'Divider position',
    'ตำแหน่งเส้นแบ่ง 0–100 จากขอบซ้าย': 'divider position, 0–100 from the left edge',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuImageCompareModule</code> มี <code>wuTemplate</code> ให้ด้วย) และ standalone (<code>WuImageCompare</code>) · แท็กเขียนได้ทั้ง <code>wu-imageCompare</code>, <code>wu-imagecompare</code> และ <code>wu-image-compare</code>',
        en: 'Works as an NgModule (<code>WuImageCompareModule</code>, which brings <code>wuTemplate</code>) or standalone (<code>WuImageCompare</code>) · the tag can be <code>wu-imageCompare</code>, <code>wu-imagecompare</code> or <code>wu-image-compare</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ใส่ภาพสองภาพเป็น template ชื่อ <code>left</code> และ <code>right</code> · <b>ระวังชื่อที่อาจดูกลับด้าน</b>: ภาพ <code>left</code> เต็มกรอบอยู่ด้านล่าง ส่วนภาพ <code>right</code> วางทับและแสดงจากขอบซ้าย (ขอบเริ่มต้น) ถึงเส้นแบ่ง ภาพทางซ้ายของเส้นแบ่งจึงเป็น <code>right</code> และทางขวาเป็น <code>left</code> · ถ้าอยากให้อ่านจากซ้ายไปขวาเป็น “ก่อน | หลัง” ใส่ภาพก่อนใน <code>right</code> และภาพหลังใน <code>left</code> แบบตัวอย่างนี้ · ภาพ <code>&lt;img&gt;</code> ข้างในขยายเต็มกรอบเอง (<code>object-fit: cover</code>) และกรอบเป็นสัดส่วน 16:9',
        en: 'Give the two pictures as templates named <code>left</code> and <code>right</code> · <b>mind the names, they can feel backwards</b>: the <code>left</code> picture fills the frame underneath, and the <code>right</code> picture lies on top, showing from the left (start) edge up to the divider; so left of the divider you see <code>right</code>, and right of it <code>left</code> · to read “before | after” from left to right, put the before picture in <code>right</code> and the after picture in <code>left</code>, as this demo does · an <code>&lt;img&gt;</code> inside fills the frame (<code>object-fit: cover</code>), and the frame is 16:9.',
      },
    },
    value: {
      title: { th: 'ตำแหน่งเส้นแบ่ง', en: 'Divider position' },
      text: {
        th: '<code>[(value)]</code> คือตำแหน่งเส้นแบ่งเป็น % จากขอบเริ่มต้น (0–100 ค่าเริ่มต้น 50) อ่านค่าหรือตั้งจากโค้ดได้ และ <code>step</code> คือระยะที่ปุ่มลูกศรเลื่อนต่อครั้ง (ค่าเริ่มต้น 1)',
        en: '<code>[(value)]</code> is where the divider is, in % from the start edge (0–100, 50 by default); read it or set it from code. <code>step</code> is how far an arrow key moves it (1 by default).',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด มือถือ และ ARIA', en: 'Keyboard, touch and ARIA' },
      text: {
        th: 'ลากตรงไหนของกรอบก็ได้ด้วยเมาส์หรือปากกา บนจอสัมผัสต้องปัดไปด้านข้างก่อน การปัดขึ้นลงจึงยังเลื่อนหน้าได้ · ปุ่มกลมเป็น <code>role="slider"</code> จุด Tab เดียว (<code>tabindex</code> ที่ใส่บนแท็กไปอยู่ที่ปุ่มนี้) <code>←</code> <code>→</code> <code>↑</code> <code>↓</code> เลื่อนทีละ <code>step</code>, <code>Page Up</code> / <code>Page Down</code> ทีละ 10, <code>Home</code> / <code>End</code> ไปสุดขอบ · โปรแกรมอ่านจออ่านเป็น % ชื่อจาก <code>ariaLabel</code> / <code>ariaLabelledby</code> หรือ locale · หน้าแบบขวาไปซ้าย (RTL) ขอบเริ่มต้นอยู่ทางขวาและลูกศรสลับข้างให้เอง',
        en: 'Drag anywhere in the frame with a mouse or pen; on a touch screen the swipe has to go sideways first, so up-and-down swipes still scroll the page · the round handle is a <code>role="slider"</code> and the only Tab stop (a <code>tabindex</code> on the tag goes to it): <code>←</code> <code>→</code> <code>↑</code> <code>↓</code> move by <code>step</code>, <code>Page Up</code> / <code>Page Down</code> by 10, <code>Home</code> / <code>End</code> to the edges · screen readers hear a %; the name comes from <code>ariaLabel</code> / <code>ariaLabelledby</code> or the locale · on a right-to-left page the start edge is on the right and the arrows swap for you.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-imageCompare&gt;</code> เป็น <code>&lt;wu-imageCompare&gt;</code> · template <code>pTemplate="left"</code> / <code>pTemplate="right"</code> ใช้ได้เหมือนเดิม (หรือ <code>wuTemplate</code>) และ <code>tabindex</code>, <code>ariaLabel</code>, <code>ariaLabelledby</code> ใช้ชื่อเดิม',
        en: 'Change <code>&lt;p-imageCompare&gt;</code> to <code>&lt;wu-imageCompare&gt;</code> · <code>pTemplate="left"</code> / <code>pTemplate="right"</code> keep working (or <code>wuTemplate</code>), and <code>tabindex</code>, <code>ariaLabel</code> and <code>ariaLabelledby</code> keep their names.',
      },
    },
  },
  code: {
    basic: `<!-- ภาพหลัง (left) เต็มกรอบ · ภาพก่อน (right) แสดงจากขอบซ้ายถึงเส้นแบ่ง -->
<wu-imageCompare ariaLabel="เทียบภาพก่อนและหลังปรับสี" [style]="{ maxWidth: '36rem' }">
  <ng-template #left>
    <img src="photos/school-colour.jpg" alt="ภาพสีหลังปรับ" />
  </ng-template>
  <ng-template #right>
    <img src="photos/school-old.jpg" alt="ภาพขาวดำก่อนปรับสี" />
  </ng-template>
</wu-imageCompare>`,
    value: `<wu-imageCompare [(value)]="divider" [step]="5" ariaLabel="เทียบภาพก่อนและหลังปรับสี">
  <ng-template #left><img src="photos/school-colour.jpg" alt="ภาพสีหลังปรับ" /></ng-template>
  <ng-template #right><img src="photos/school-old.jpg" alt="ภาพขาวดำก่อนปรับสี" /></ng-template>
</wu-imageCompare>
<wu-button label="25%" severity="secondary" [outlined]="true" (onClick)="divider = 25"></wu-button>
<wu-button label="50%" severity="secondary" [outlined]="true" (onClick)="divider = 50"></wu-button>
<wu-button label="75%" severity="secondary" [outlined]="true" (onClick)="divider = 75"></wu-button>`,
  },
  ts: {
    value: `divider = 30;   // ตำแหน่งเส้นแบ่ง 0–100 จากขอบซ้าย`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'number', '50', 'ตำแหน่งเส้นแบ่งเป็น % จากขอบเริ่มต้น (สองทาง [(value)])', 'Divider position in % from the start edge (two-way [(value)])'),
        row('step', 'number', '1', 'ระยะที่ปุ่มลูกศรเลื่อนต่อครั้ง (%)', 'How far an arrow key moves it (%)'),
        row('tabindex', 'number', '0', 'ลำดับ Tab ของปุ่มเส้นแบ่ง', 'Tab order of the handle'),
        row('ariaLabel · ariaLabelledby', 'string', 'locale', 'ชื่อของปุ่มเส้นแบ่ง (ariaLabelledBy ก็ได้)', 'Name of the handle (ariaLabelledBy works too)'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [row('valueChange', 'number', undefined, 'เส้นแบ่งเลื่อน (สำหรับ [(value)])', 'The divider moved (for [(value)])')],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'เขียนเป็น #left, wuTemplate="left" หรือ pTemplate="left" ก็ได้',
        en: 'Write them as #left, wuTemplate="left" or pTemplate="left".',
      },
      rows: [
        row('left', '—', undefined, 'ภาพที่เต็มกรอบ (เห็นทางขวาของเส้นแบ่ง)', 'The picture that fills the frame (seen right of the divider)'),
        row('right', '—', undefined, 'ภาพที่แสดงจากขอบเริ่มต้นถึงเส้นแบ่ง (เห็นทางซ้าย)', 'The picture shown from the start edge to the divider (seen left of it)'),
      ],
    },
  ],
  tokens: [
    tok('--wu-imagecompare-aspect-ratio', 'สัดส่วนของกรอบ (ค่าเริ่มต้น 16 / 9)', 'Aspect ratio of the frame (16 / 9 by default)'),
    tok('--wu-imagecompare-radius', 'มุมโค้งของกรอบ', 'Corner radius'),
    tok('--wu-imagecompare-bg', 'พื้นกรอบระหว่างโหลดภาพ', 'Frame background while the pictures load'),
    tok('--wu-imagecompare-divider-width', 'ความหนาเส้นแบ่ง', 'Divider width'),
    tok('--wu-imagecompare-divider-color', 'สีเส้นแบ่ง', 'Divider colour'),
    tok('--wu-imagecompare-handle-size', 'ขนาดปุ่มกลม', 'Handle size'),
    tok('--wu-imagecompare-handle-bg', 'พื้นปุ่มกลม', 'Handle background'),
    tok('--wu-imagecompare-handle-color', 'สีลูกศรในปุ่ม', 'Handle arrow colour'),
    tok('--wu-imagecompare-handle-shadow', 'เงาของปุ่ม', 'Handle shadow'),
  ],
};
