import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

/** School rules the ScrollPanel demos list. */
export const SCHOOL_RULES = [
  'มาถึงโรงเรียนก่อนเวลา 07.45 น.',
  'แต่งกายด้วยชุดนักเรียนที่ถูกระเบียบ',
  'เข้าแถวเคารพธงชาติทุกเช้า',
  'ไม่นำโทรศัพท์มือถือมาใช้ในห้องเรียน',
  'ส่งการบ้านตามกำหนด',
  'รักษาความสะอาดของห้องเรียนและอาคาร',
  'ลาป่วยหรือลากิจต้องมีหนังสือจากผู้ปกครอง',
  'ใช้ห้องสมุดอย่างเงียบ',
  'ไม่ออกนอกบริเวณโรงเรียนในเวลาเรียน',
  'แจ้งครูประจำชั้นเมื่อเปลี่ยนที่อยู่หรือเบอร์โทร',
];

export const SCROLLPANEL_DOC: ComponentDoc = {
  id: 'scrollpanel',
  title: 'ScrollPanel',
  group: 'Panel',
  entry: 'scrollpanel',
  standalone: 'WtScrollPanel',
  module: 'WtScrollPanelModule',
  selector: 'wt-scrollpanel',
  description: {
    th: 'กล่องที่เนื้อหาเลื่อนอยู่ข้างใน มีแถบเลื่อนบางที่เข้ากับธีม ตั้งความสูงหรือความสูงสูงสุดแล้วเนื้อหาที่เกินจะเลื่อนได้ ทั้งด้วยเมาส์ นิ้ว และคีย์บอร์ด',
    en: 'A box whose content scrolls inside it, with thin scrollbars that follow the theme. Give it a height or a max height and what does not fit scrolls, by mouse, finger or keyboard.',
  },
  english: {
    'ระเบียบของโรงเรียน': 'School rules',
    'มาถึงโรงเรียนก่อนเวลา 07.45 น.': 'Arrive before 7:45',
    'แต่งกายด้วยชุดนักเรียนที่ถูกระเบียบ': 'Wear the proper school uniform',
    'เข้าแถวเคารพธงชาติทุกเช้า': 'Line up for the flag every morning',
    'ไม่นำโทรศัพท์มือถือมาใช้ในห้องเรียน': 'No phones in class',
    'ส่งการบ้านตามกำหนด': 'Hand in homework on time',
    'รักษาความสะอาดของห้องเรียนและอาคาร': 'Keep classrooms and buildings clean',
    'ลาป่วยหรือลากิจต้องมีหนังสือจากผู้ปกครอง': 'Absences need a note from a parent',
    'ใช้ห้องสมุดอย่างเงียบ': 'Keep quiet in the library',
    'ไม่ออกนอกบริเวณโรงเรียนในเวลาเรียน': 'Stay on school grounds during lessons',
    'แจ้งครูประจำชั้นเมื่อเปลี่ยนที่อยู่หรือเบอร์โทร': 'Tell your class teacher about a new address or phone number',
    'ประกาศ': 'Notices',
    'เพิ่มประกาศ': 'Add a notice',
    'ประกาศใหม่': 'New notice',
    'กลับขึ้นบน': 'Back to top',
    'ข้อที่': 'Rule',
    'ข้อมูลจาก API': 'data from the API',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtScrollPanelModule</code>) และ standalone (<code>WtScrollPanel</code>) แท็กเขียนได้ทั้ง <code>wt-scrollpanel</code>, <code>wt-scrollPanel</code> และ <code>wt-scroll-panel</code>',
        en: 'Works as an NgModule (<code>WtScrollPanelModule</code>) or standalone (<code>WtScrollPanel</code>). The tag can be written <code>wt-scrollpanel</code>, <code>wt-scrollPanel</code> or <code>wt-scroll-panel</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: 'ตั้ง <code>[style]="{ width: \'100%\', height: \'12rem\' }"</code> เนื้อหาที่เกินเลื่อนอยู่ข้างใน แถบเลื่อนเป็นแถบของเบราว์เซอร์ที่แต่งให้บางตามธีม จึงลื่นเหมือนเดิมทั้งเมาส์และจอสัมผัส · กล่องโฟกัสได้ (role region) จึงเลื่อนด้วยลูกศร Page Up / Down ได้ ใส่ <code>ariaLabel</code> เพื่อบอกว่ากล่องนี้คืออะไร',
        en: 'Set <code>[style]="{ width: \'100%\', height: \'12rem\' }"</code> and what does not fit scrolls inside. The scrollbars are the browser\'s own, made thin to match the theme, so scrolling feels as smooth as ever by mouse or touch · the box can take focus (a region), so arrows and Page Up / Down scroll it; give it an <code>ariaLabel</code> to say what it holds.',
      },
    },
    grow: {
      title: { th: 'สูงตามเนื้อหา', en: 'Growing with the content' },
      text: {
        th: 'ใช้ <code>maxHeight</code> แทน <code>height</code> กล่องจะสูงตามเนื้อหาจนถึงค่านั้นแล้วจึงเลื่อน ลองเพิ่มประกาศ',
        en: 'Use <code>maxHeight</code> instead of <code>height</code>: the box grows with its content up to that, then scrolls. Try adding notices.',
      },
    },
    methods: {
      title: { th: 'เลื่อนจากโค้ด', en: 'Scrolling from code' },
      text: {
        th: '<code>scrollTop(px)</code> เลื่อนไปตำแหน่งนั้น (เรียกผ่าน template ref) · <code>[step]</code> คือจำนวนพิกเซลต่อการกดลูกศรหนึ่งครั้ง (ไม่ใส่ใช้ระยะของเบราว์เซอร์) · <code>refresh()</code> รับไว้ให้โค้ดเดิมเรียกได้ แถบเลื่อนของเบราว์เซอร์ตามเนื้อหาเองอยู่แล้ว',
        en: '<code>scrollTop(px)</code> scrolls there (call it through a template ref) · <code>[step]</code> is the pixels per arrow key press (none: the browser\'s own step) · <code>refresh()</code> stays for code that calls it; native scrollbars follow the content by themselves.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-scrollPanel&gt;</code> เป็น <code>&lt;wt-scrollPanel&gt;</code> <code>[style]</code>, <code>styleClass</code>, <code>scrollTop()</code> และ <code>refresh()</code> ชื่อเดิม class <code>p-scrollpanel</code> และ <code>p-scrollpanel-content</code> อยู่คู่กับ class <code>wt-*</code> (ไม่มีแถบเลื่อนจำลองแยก จึงไม่มี class <code>p-scrollpanel-bar</code>)',
        en: 'Change <code>&lt;p-scrollPanel&gt;</code> to <code>&lt;wt-scrollPanel&gt;</code>; <code>[style]</code>, <code>styleClass</code>, <code>scrollTop()</code> and <code>refresh()</code> keep their names, and the <code>p-scrollpanel</code> and <code>p-scrollpanel-content</code> classes sit next to the <code>wt-*</code> ones (there are no separate fake bars, so no <code>p-scrollpanel-bar</code> class).',
      },
    },
  },
  code: {
    basic: {
      v3: `<wt-scrollPanel [style]="{ width: '100%', height: '12rem' }" ariaLabel="ระเบียบของโรงเรียน">
  <ol>
    @for (rule of rules; track rule) {
      <li>{{ rule }}</li>
    }
  </ol>
</wt-scrollPanel>`,
      classic: `<wt-scrollPanel [style]="{ width: '100%', height: '12rem' }" ariaLabel="ระเบียบของโรงเรียน">
  <ol>
    <li *ngFor="let rule of rules">{{ rule }}</li>
  </ol>
</wt-scrollPanel>`,
    },
    grow: {
      v3: `<wt-scrollPanel [style]="{ width: '100%', maxHeight: '10rem' }" ariaLabel="ประกาศ">
  @for (notice of notices; track $index) {
    <p>{{ notice }}</p>
  }
</wt-scrollPanel>
<wt-button label="เพิ่มประกาศ" icon="wi wi-plus" severity="secondary" (onClick)="addNotice()"></wt-button>`,
      classic: `<wt-scrollPanel [style]="{ width: '100%', maxHeight: '10rem' }" ariaLabel="ประกาศ">
  <p *ngFor="let notice of notices">{{ notice }}</p>
</wt-scrollPanel>
<wt-button label="เพิ่มประกาศ" icon="wi wi-plus" severity="secondary" (onClick)="addNotice()"></wt-button>`,
    },
    methods: {
      v3: `<wt-scrollPanel #rulesPanel [style]="{ width: '100%', height: '10rem' }" [step]="40" ariaLabel="ระเบียบของโรงเรียน">
  <ol>
    @for (rule of rules; track rule) {
      <li>{{ rule }}</li>
    }
  </ol>
</wt-scrollPanel>
<wt-button label="กลับขึ้นบน" icon="wi wi-angle-up" severity="secondary" [text]="true" (onClick)="rulesPanel.scrollTop(0)"></wt-button>`,
      classic: `<wt-scrollPanel #rulesPanel [style]="{ width: '100%', height: '10rem' }" [step]="40" ariaLabel="ระเบียบของโรงเรียน">
  <ol>
    <li *ngFor="let rule of rules">{{ rule }}</li>
  </ol>
</wt-scrollPanel>
<wt-button label="กลับขึ้นบน" icon="wi wi-angle-up" severity="secondary" [text]="true" (onClick)="rulesPanel.scrollTop(0)"></wt-button>`,
    },
  },
  ts: {
    basic: `rules = [
  'มาถึงโรงเรียนก่อนเวลา 07.45 น.',
  'แต่งกายด้วยชุดนักเรียนที่ถูกระเบียบ',
  'เข้าแถวเคารพธงชาติทุกเช้า',
  // … ข้อมูลจาก API
];`,
    grow: `notices: string[] = ['ประกาศใหม่ 1'];

addNotice(): void {
  this.notices = [...this.notices, 'ประกาศใหม่ ' + (this.notices.length + 1)];
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        STYLE_ROW,
        row('ariaLabel', 'string', undefined, 'ชื่อของกล่อง (role region)', 'Name of the box (a region)'),
        row('step', 'number', undefined, 'พิกเซลต่อการกดลูกศรหนึ่งครั้ง', 'Pixels per arrow key press'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [
        row('scrollTop(top)', 'void', undefined, 'เลื่อนเนื้อหาไปที่ top พิกเซล', 'Scrolls the content to top pixels'),
        row('refresh()', 'void', undefined, 'รับไว้ให้โค้ดเดิมเรียกได้ (แถบเลื่อนตามเนื้อหาเอง)', 'Kept for code that calls it (the bars follow the content by themselves)'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      rows: [row('content', '—', undefined, 'เนื้อหา (ใส่ในแท็กตรง ๆ ก็ได้)', 'The content (or put it straight inside the tag)')],
    },
  ],
  tokens: [
    tok('--wt-scrollpanel-bar-size', 'ความหนาของแถบเลื่อน', 'Scrollbar thickness'),
    tok('--wt-scrollpanel-bar-color', 'สีแถบเลื่อน', 'Scrollbar colour'),
    tok('--wt-scrollpanel-bar-hover-color', 'สีแถบเลื่อนเมื่อชี้', 'Scrollbar colour on hover'),
  ],
};
