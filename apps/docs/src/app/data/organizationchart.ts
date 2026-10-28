import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** One box of the chart, as the demos build it (a TreeNode). */
// A type alias, not an interface: TreeNode has an index signature that interfaces don't satisfy.
export type DocOrgNode = {
  label: string;
  type?: string;
  expanded?: boolean;
  selectable?: boolean;
  styleClass?: string;
  data?: { name: string; title: string; initial: string };
  children?: DocOrgNode[];
};

const person = (title: string, name: string, initial: string, children?: DocOrgNode[]): DocOrgNode => ({
  label: title,
  type: 'person',
  expanded: true,
  data: { name, title, initial },
  children,
});

/** The fictional Wira School: a director, two deputies and their sections. A fresh copy each time. */
export function wiraSchoolChart(): DocOrgNode[] {
  return [
    person('ผู้อำนวยการ', 'อรุณี ทองดี', 'อ', [
      person('รองผู้อำนวยการฝ่ายวิชาการ', 'ประเสริฐ มั่นคง', 'ป', [
        { label: 'กลุ่มสาระวิทยาศาสตร์', expanded: true },
        { label: 'กลุ่มสาระคณิตศาสตร์', expanded: true },
      ]),
      person('รองผู้อำนวยการฝ่ายบริหารทั่วไป', 'กมลา ใจงาม', 'ก', [
        { label: 'งานอาคารสถานที่', expanded: true },
        { label: 'งานการเงิน', expanded: true },
      ]),
    ]),
  ];
}

/** The same chart, labels only, for the selection demos. */
export function wiraSchoolUnits(): DocOrgNode[] {
  return [
    {
      label: 'ผู้อำนวยการ',
      expanded: true,
      children: [
        { label: 'ฝ่ายวิชาการ', expanded: true, children: [{ label: 'กลุ่มสาระวิทยาศาสตร์' }, { label: 'กลุ่มสาระคณิตศาสตร์' }] },
        { label: 'ฝ่ายบริหารทั่วไป', expanded: false, children: [{ label: 'งานอาคารสถานที่' }, { label: 'งานการเงิน' }] },
      ],
    },
  ];
}

const CHART_TS = `import type { TreeNode } from 'wiratheme/api';

chart: TreeNode[] = [
  {
    label: 'ผู้อำนวยการ',
    type: 'person',
    expanded: true,   // ลูกแสดงเมื่อ expanded เป็น true เท่านั้น
    data: { name: 'อรุณี ทองดี', title: 'ผู้อำนวยการ', initial: 'อ' },
    children: [
      {
        label: 'รองผู้อำนวยการฝ่ายวิชาการ',
        type: 'person',
        expanded: true,
        data: { name: 'ประเสริฐ มั่นคง', title: 'รองผู้อำนวยการฝ่ายวิชาการ', initial: 'ป' },
        children: [{ label: 'กลุ่มสาระวิทยาศาสตร์' }, { label: 'กลุ่มสาระคณิตศาสตร์' }],
      },
      // … ข้อมูลจาก API
    ],
  },
];`;

export const ORGANIZATIONCHART_DOC: ComponentDoc = {
  id: 'organizationchart',
  title: 'OrganizationChart',
  group: 'Charts',
  entry: 'organizationchart',
  standalone: 'WtOrganizationChart',
  module: 'WtOrganizationChartModule',
  selector: 'wt-organizationChart',
  description: {
    th: 'ผังองค์กรแบบต้นไม้จากบนลงล่าง กล่องเชื่อมด้วยเส้น วาดกล่องเองตามชนิดของข้อมูลได้ เลือกกล่องได้ทีละกล่องหรือหลายกล่อง พับ / กางสาขาได้ ใช้คีย์บอร์ดได้ และเลื่อนดูในกล่องของตัวเองบนมือถือ',
    en: 'An organization chart drawn top down, boxes joined by lines: draw the boxes yourself by data type, pick one box or many, fold and open branches, use the keyboard, and scroll it inside its own box on phones.',
  },
  english: {
    'ผู้อำนวยการ': 'Director',
    'รองผู้อำนวยการฝ่ายวิชาการ': 'Deputy director, academic affairs',
    'รองผู้อำนวยการฝ่ายบริหารทั่วไป': 'Deputy director, general affairs',
    'กลุ่มสาระวิทยาศาสตร์': 'Science department',
    'กลุ่มสาระคณิตศาสตร์': 'Mathematics department',
    'งานอาคารสถานที่': 'Buildings and grounds',
    'งานการเงิน': 'Finance',
    'ฝ่ายวิชาการ': 'Academic affairs',
    'ฝ่ายบริหารทั่วไป': 'General affairs',
    'อรุณี ทองดี': 'Arunee Thongdee',
    'ประเสริฐ มั่นคง': 'Prasert Mankong',
    'กมลา ใจงาม': 'Kamala Jai-ngam',
    // Initials on the avatars (single letters: they match only where they stand alone).
    'อ': 'A',
    'ป': 'P',
    'ก': 'K',
    'ผังองค์กรโรงเรียนวิระ': 'Wira School organization chart',
    'ลูกแสดงเมื่อ expanded เป็น true เท่านั้น': 'children show only while expanded is true',
    'ข้อมูลจาก API': 'data from the API',
    'ที่เลือก': 'Picked',
    'ไม่มี': 'none',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WtOrganizationChartModule</code> มี <code>wtTemplate</code> ให้ด้วย) และ standalone (<code>WtOrganizationChart</code>) · แท็กเขียนได้ทั้ง <code>wt-organizationChart</code>, <code>wt-organizationchart</code> และ <code>wt-organization-chart</code> · ข้อมูลเป็น <code>TreeNode</code> จาก <code>wiratheme/api</code>',
        en: 'Works as an NgModule (<code>WtOrganizationChartModule</code>, which brings <code>wtTemplate</code>) or standalone (<code>WtOrganizationChart</code>) · the tag can be <code>wt-organizationChart</code>, <code>wt-organizationchart</code> or <code>wt-organization-chart</code> · the data is <code>TreeNode</code> from <code>wiratheme/api</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือ array ที่มีกล่องบนสุดเป็นตัวแรก แต่ละกล่องเป็น <code>TreeNode</code>: <code>label</code>, <code>children</code>, <code>type</code>, <code>styleClass</code>, <code>selectable</code> · <b>ลูกของกล่องแสดงเมื่อ <code>expanded: true</code> เท่านั้น</b> กล่องที่ไม่ใส่ expanded จึงไม่เห็นลูก (ใส่ให้ทุกกล่องที่อยากให้กางตั้งแต่แรก)',
        en: '<code>[value]</code> is an array with the top box first; each box is a <code>TreeNode</code>: <code>label</code>, <code>children</code>, <code>type</code>, <code>styleClass</code>, <code>selectable</code> · <b>a box’s children show only while it has <code>expanded: true</code></b>, so a box without it shows no children (set it on every box that should start open).',
      },
    },
    templates: {
      title: { th: 'วาดกล่องเอง', en: 'Drawing the boxes' },
      text: {
        th: 'template ตั้งชื่อตาม <code>type</code> ของกล่อง เช่น <code>wtTemplate="person"</code> ใช้กับกล่องที่ <code>type: \'person\'</code> และ <code>wtTemplate="default"</code> ใช้กับกล่องที่เหลือ (ได้ <code>let-node</code>) · ใช้ <code>wtTemplate</code> หรือ <code>pTemplate</code> ทุกรุ่น (ชื่อตาม type ไม่ใช้ <code>#ref</code>) · <code>togglericon</code> วาดไอคอนปุ่มพับเอง (ได้ <code>let-expanded</code>)',
        en: 'Name a template after a box’s <code>type</code>: <code>wtTemplate="person"</code> draws boxes with <code>type: \'person\'</code>, and <code>wtTemplate="default"</code> the rest (each gets <code>let-node</code>) · use <code>wtTemplate</code> or <code>pTemplate</code> in every version (type names are not <code>#refs</code>) · <code>togglericon</code> draws the fold button’s icon (it gets <code>let-expanded</code>).',
      },
    },
    selection: {
      title: { th: 'เลือกกล่อง', en: 'Picking boxes' },
      text: {
        th: '<code>selectionMode="single"</code> เลือกได้กล่องเดียว หรือ <code>"multiple"</code> หลายกล่อง (ผูกเป็น array) ด้วย <code>[(selection)]</code> · คลิกกล่องที่เลือกอยู่ซ้ำเพื่อยกเลิก · กล่องที่ <code>selectable: false</code> เลือกไม่ได้ · <code>(onNodeSelect)</code> / <code>(onNodeUnselect)</code> บอก <code>{ originalEvent, node }</code>',
        en: '<code>selectionMode="single"</code> picks one box, or <code>"multiple"</code> several (bound as an array), with <code>[(selection)]</code> · click a picked box again to drop it · boxes with <code>selectable: false</code> cannot be picked · <code>(onNodeSelect)</code> / <code>(onNodeUnselect)</code> tell <code>{ originalEvent, node }</code>.',
      },
    },
    collapsible: {
      title: { th: 'พับสาขา', en: 'Folding branches' },
      text: {
        th: '<code>[collapsible]="true"</code> เพิ่มปุ่มพับ / กางใต้กล่องที่มีลูก ปุ่มเปลี่ยน <code>node.expanded</code> และส่ง <code>(onNodeExpand)</code> / <code>(onNodeCollapse)</code> · <code>preserveSpace</code> (ค่าเริ่มต้น true) เก็บที่ของลูกไว้ตอนพับ ผังจึงไม่ขยับ ใส่ <code>[preserveSpace]="false"</code> ให้พับเก็บที่ด้วย',
        en: '<code>[collapsible]="true"</code> adds a fold button under boxes with children; it flips <code>node.expanded</code> and sends <code>(onNodeExpand)</code> / <code>(onNodeCollapse)</code> · <code>preserveSpace</code> (true by default) keeps the room the children take while folded, so the chart does not jump; <code>[preserveSpace]="false"</code> folds it away.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด มือถือ และ ARIA', en: 'Keyboard, phones and ARIA' },
      text: {
        th: 'ผังเป็น <code>role="tree"</code> กด Tab เข้าผังแล้ว <code>↓</code> เปิดกล่องหรือไปลูกตัวแรก, <code>↑</code> พับหรือไปกล่องแม่, <code>←</code> / <code>→</code> ไปกล่องข้าง ๆ ในแถวเดียวกัน, <code>Home</code> / <code>End</code>, <code>Enter</code> / <code>Space</code> เลือก · ผังที่กว้างกว่าที่วาง (เช่นบนมือถือ) เลื่อนซ้ายขวาในกล่องของตัวเอง หน้าเว็บไม่ล้น · ชื่อจาก <code>ariaLabel</code> / <code>ariaLabelledBy</code> หรือ locale',
        en: 'The chart is a <code>role="tree"</code>: Tab into it, then <code>↓</code> opens a box or goes to its first child, <code>↑</code> folds it or goes to the parent, <code>←</code> / <code>→</code> move along a row, <code>Home</code> / <code>End</code>, <code>Enter</code> / <code>Space</code> pick · a chart wider than its place (on a phone, say) scrolls sideways inside its own box, so the page does not overflow · the name comes from <code>ariaLabel</code> / <code>ariaLabelledBy</code> or the locale.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-organizationChart&gt;</code> เป็น <code>&lt;wt-organizationChart&gt;</code> input, event และ template แบบ <code>pTemplate="person"</code> ใช้ชื่อเดิม และข้อมูล <code>TreeNode</code> ชุดเดิมใช้ได้เลย',
        en: 'Change <code>&lt;p-organizationChart&gt;</code> to <code>&lt;wt-organizationChart&gt;</code>; the inputs, events and <code>pTemplate="person"</code> templates keep their names, and the same <code>TreeNode</code> data works as is.',
      },
    },
  },
  code: {
    basic: `<wt-organizationChart [value]="chart" ariaLabel="ผังองค์กรโรงเรียนวิระ"></wt-organizationChart>`,
    templates: `<wt-organizationChart [value]="chart" ariaLabel="ผังองค์กรโรงเรียนวิระ">
  <ng-template wtTemplate="person" let-node>
    <div class="person">
      <wt-avatar [label]="node.data.initial" shape="circle"></wt-avatar>
      <b>{{ node.data.name }}</b>
      <small>{{ node.data.title }}</small>
    </div>
  </ng-template>
</wt-organizationChart>`,
    selection: {
      v3: `<wt-organizationChart [value]="units" selectionMode="single" [(selection)]="picked" (onNodeSelect)="selected($event)">
</wt-organizationChart>
@if (picked) {
  <span>ที่เลือก: {{ picked.label }}</span>
}

<wt-organizationChart [value]="units" selectionMode="multiple" [(selection)]="team"></wt-organizationChart>`,
      classic: `<wt-organizationChart [value]="units" selectionMode="single" [(selection)]="picked" (onNodeSelect)="selected($event)">
</wt-organizationChart>
<span *ngIf="picked">ที่เลือก: {{ picked.label }}</span>

<wt-organizationChart [value]="units" selectionMode="multiple" [(selection)]="team"></wt-organizationChart>`,
    },
    collapsible: `<wt-organizationChart [value]="units" [collapsible]="true" [preserveSpace]="false"
  (onNodeExpand)="opened($event)" (onNodeCollapse)="closed($event)"></wt-organizationChart>`,
  },
  ts: {
    basic: CHART_TS,
    selection: `import type { TreeNode } from 'wiratheme/api';

picked: TreeNode | null = null;
team: TreeNode[] = [];

selected(event: { node: TreeNode }): void {
  console.log(event.node.label);
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'TreeNode[]', undefined, 'ผังทั้งหมด กล่องบนสุดเป็นตัวแรก (ลูกแสดงเมื่อ expanded)', 'The chart, top box first (children show while expanded)'),
        row('selectionMode', "'single' | 'multiple'", undefined, 'เลือกได้กล่องเดียว หรือหลายกล่อง', 'Pick one box, or many'),
        row('selection', 'TreeNode | TreeNode[]', undefined, 'กล่องที่เลือก (สองทาง [(selection)])', 'The picked box(es) (two-way [(selection)])'),
        row('collapsible', BOOL, 'false', 'มีปุ่มพับ / กางใต้กล่องที่มีลูก', 'A fold button under boxes with children'),
        row('preserveSpace', BOOL, 'true', 'เก็บที่ของลูกไว้ตอนพับ', 'Keep the children’s room while folded'),
        row('ariaLabel · ariaLabelledBy', 'string', 'locale', 'ชื่อของผัง', 'Name of the chart'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onNodeSelect · onNodeUnselect', '{ originalEvent, node }', undefined, 'เลือก / ยกเลิกกล่อง', 'A box was picked / dropped'),
        row('onNodeExpand · onNodeCollapse', '{ originalEvent, node }', undefined, 'กาง / พับสาขา', 'A branch opened / folded'),
        row('selectionChange', 'TreeNode | TreeNode[]', undefined, 'สำหรับ [(selection)]', 'For [(selection)]'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: {
        th: 'ตั้งชื่อตาม type ของกล่องด้วย wtTemplate="ชื่อ" หรือ pTemplate · togglericon เขียนเป็น #togglericon ได้ด้วย',
        en: 'Name them after the box type with wtTemplate="name" or pTemplate · togglericon can also be #togglericon.',
      },
      rows: [
        row('<type> · default', '$implicit (node)', undefined, 'เนื้อในกล่องที่ type ตรงกัน / กล่องที่เหลือ', 'Inside boxes of that type / every other box'),
        row('togglericon', '$implicit (expanded)', undefined, 'ไอคอนของปุ่มพับ', 'Icon of the fold button'),
      ],
    },
    {
      id: 'api-node',
      title: 'TreeNode',
      note: { th: 'field ที่ผังใช้', en: 'The fields the chart reads.' },
      rows: [
        row('label', 'string', undefined, 'ข้อความในกล่อง (เมื่อไม่มี template)', 'Text of the box (without a template)'),
        row('children · expanded', 'TreeNode[] · boolean', undefined, 'กล่องลูก · แสดงลูกหรือไม่', 'Child boxes · whether they show'),
        row('type', 'string', undefined, 'เลือก template ตามชื่อนี้', 'Picks the template of that name'),
        row('selectable · styleClass · data', 'boolean · string · any', undefined, 'เลือกได้หรือไม่ · class ของกล่อง · ข้อมูลของแอป', 'Can be picked · box class · the app’s own data'),
      ],
    },
  ],
  tokens: [
    tok('--wt-organizationchart-padding', 'ระยะรอบผัง', 'Padding around the chart'),
    tok('--wt-organizationchart-gutter', 'ระยะระหว่างกล่องข้างกัน', 'Gap between boxes side by side'),
    tok('--wt-organizationchart-connector-height', 'ความสูงของเส้นเชื่อม', 'Height of the connectors'),
    tok('--wt-organizationchart-connector-color', 'สีเส้นเชื่อม', 'Connector colour'),
    tok('--wt-organizationchart-connector-radius', 'มุมโค้งของเส้นเชื่อม', 'Connector corner radius'),
    tok('--wt-organizationchart-node-bg', 'พื้นกล่อง', 'Box background'),
    tok('--wt-organizationchart-node-color', 'สีตัวอักษรในกล่อง', 'Box text colour'),
    tok('--wt-organizationchart-node-border-color', 'สีขอบกล่อง', 'Box border colour'),
    tok('--wt-organizationchart-node-padding', 'ระยะในกล่อง', 'Box padding'),
    tok('--wt-organizationchart-node-toggleable-padding', 'ระยะในกล่องที่มีปุ่มพับ', 'Padding of boxes with a fold button'),
    tok('--wt-organizationchart-node-radius', 'มุมโค้งของกล่อง', 'Box corner radius'),
    tok('--wt-organizationchart-node-hover-bg', 'พื้นกล่องเมื่อชี้ (เมื่อเลือกได้)', 'Box background on hover (when pickable)'),
    tok('--wt-organizationchart-node-selected-bg', 'พื้นกล่องที่เลือก', 'Picked box background'),
    tok('--wt-organizationchart-node-selected-color', 'สีตัวอักษรของกล่องที่เลือก', 'Picked box text colour'),
    tok('--wt-organizationchart-toggle-size', 'ขนาดปุ่มพับ', 'Fold button size'),
    tok('--wt-organizationchart-toggle-bg', 'พื้นปุ่มพับ', 'Fold button background'),
    tok('--wt-organizationchart-toggle-color', 'สีไอคอนปุ่มพับ', 'Fold button icon colour'),
    tok('--wt-organizationchart-toggle-hover-bg', 'พื้นปุ่มพับเมื่อชี้', 'Fold button background on hover'),
    tok('--wt-organizationchart-toggle-hover-color', 'สีไอคอนปุ่มพับเมื่อชี้', 'Fold button icon colour on hover'),
  ],
};
