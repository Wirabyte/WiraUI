import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

const BOOL = 'boolean';

/** A tree node as the demos build it (no wiraui import here). */
export interface DocTreeNode {
  key?: string;
  label?: string;
  icon?: string;
  expandedIcon?: string;
  collapsedIcon?: string;
  type?: string;
  leaf?: boolean;
  loading?: boolean;
  expanded?: boolean;
  selectable?: boolean;
  data?: unknown;
  children?: DocTreeNode[];
  [field: string]: unknown;
}

/** The school's document folders: a fresh copy each call, since trees open and tick nodes in place. */
export function schoolFolders(): DocTreeNode[] {
  const folder = { expandedIcon: 'wi wi-folder-open', collapsedIcon: 'wi wi-folder' };
  return [
    {
      key: 'a',
      label: 'ฝ่ายวิชาการ',
      ...folder,
      children: [
        {
          key: 'a1',
          label: 'หลักสูตร',
          ...folder,
          children: [
            { key: 'a1x', label: 'หลักสูตรสถานศึกษา', icon: 'wi wi-file-pdf', type: 'file', data: '2.4 MB' },
            { key: 'a1y', label: 'โครงสร้างรายวิชา', icon: 'wi wi-file-excel', type: 'file', data: '180 KB' },
          ],
        },
        {
          key: 'a2',
          label: 'วัดผลและประเมินผล',
          ...folder,
          children: [
            { key: 'a2x', label: 'ตารางสอบกลางภาค', icon: 'wi wi-file-pdf', type: 'file', data: '320 KB' },
            { key: 'a2y', label: 'แบบบันทึกคะแนน', icon: 'wi wi-file-excel', type: 'file', data: '96 KB' },
          ],
        },
      ],
    },
    {
      key: 'b',
      label: 'ฝ่ายบริหารทั่วไป',
      ...folder,
      children: [
        { key: 'b1', label: 'ปฏิทินโรงเรียน', icon: 'wi wi-calendar', type: 'file', data: '64 KB' },
        { key: 'b2', label: 'ระเบียบการแต่งกาย', icon: 'wi wi-file-pdf', type: 'file', data: '410 KB' },
      ],
    },
    {
      key: 'c',
      label: 'ฝ่ายงบประมาณ',
      ...folder,
      children: [{ key: 'c1', label: 'แผนการใช้งบ', icon: 'wi wi-file-excel', type: 'file', data: '150 KB' }],
    },
  ];
}

const FOLDERS_TS = `import type { TreeNode } from '@wirabyte/ui/api';

folders: TreeNode[] = [
  {
    key: 'a',
    label: 'ฝ่ายวิชาการ',
    expandedIcon: 'wi wi-folder-open',
    collapsedIcon: 'wi wi-folder',
    children: [
      {
        key: 'a1',
        label: 'หลักสูตร',
        children: [
          { key: 'a1x', label: 'หลักสูตรสถานศึกษา', icon: 'wi wi-file-pdf', type: 'file', data: '2.4 MB' },
          { key: 'a1y', label: 'โครงสร้างรายวิชา', icon: 'wi wi-file-excel', type: 'file', data: '180 KB' },
        ],
      },
      // …
    ],
  },
  // … ข้อมูลจาก API
];`;

const TREE_WORDS = {
  'ฝ่ายวิชาการ': 'Academic affairs',
  'หลักสูตร': 'Curriculum',
  'หลักสูตรสถานศึกษา': 'School curriculum',
  'โครงสร้างรายวิชา': 'Course structure',
  'วัดผลและประเมินผล': 'Assessment',
  'ตารางสอบกลางภาค': 'Midterm timetable',
  'แบบบันทึกคะแนน': 'Score sheet',
  'ฝ่ายบริหารทั่วไป': 'General administration',
  'ปฏิทินโรงเรียน': 'School calendar',
  'ระเบียบการแต่งกาย': 'Uniform rules',
  'ฝ่ายงบประมาณ': 'Budget',
  'แผนการใช้งบ': 'Spending plan',
  'เอกสารของโรงเรียน': 'School documents',
  'ค้นหาเอกสาร': 'Search documents',
  'ไม่พบเอกสาร': 'No documents found',
  'เลือกอยู่': 'Picked',
  'เลือกแล้ว': 'Picked',
  'ไฟล์': 'files',
  'กำลังโหลด': 'Loading',
  'ห้องเรียน': 'Classes',
  'ชั้น ม.1': 'Grade 7',
  'ชั้น ม.2': 'Grade 8',
  'ชั้น ม.3': 'Grade 9',
  'ห้อง ม.1/1': 'Class 7/1',
  'ห้อง ม.1/2': 'Class 7/2',
  'ห้อง ม.2/1': 'Class 8/1',
  'ห้อง ม.2/2': 'Class 8/2',
  'ห้อง ม.3/1': 'Class 9/1',
  'ห้อง ม.3/2': 'Class 9/2',
  'โหลดห้องเมื่อเปิดชั้น': 'load the classes when a grade opens',
  'เลือกเอกสาร': 'Choose a document',
  'เลือกห้องที่รับผิดชอบ': 'Choose your classes',
  'เอกสารที่แนบ': 'Attached document',
  'ห้องที่รับผิดชอบ': 'Your classes',
  'ห้อง': 'classes',
  'ยังไม่ได้เลือก': 'None picked',
  'เปิด': 'Opened',
  'ดาวน์โหลด': 'Download',
  'เปลี่ยนชื่อ': 'Rename',
  'ลบ': 'Delete',
  'สั่งล่าสุด': 'Last command',
  'ล่าสุด': 'Last event',
  'ข้อมูลจาก API': 'data from the API',
  'โฟลเดอร์ใช้ template default ไฟล์ใช้ template file': 'folders use the default template, files the file template',
};

export const TREE_DOC: ComponentDoc = {
  id: 'tree',
  title: 'Tree',
  group: 'Data',
  entry: 'tree',
  standalone: 'WuTree',
  module: 'WuTreeModule',
  selector: 'wu-tree',
  description: {
    th: 'แสดงข้อมูลเป็นลำดับชั้นที่เปิดปิดได้ เช่นโฟลเดอร์เอกสารหรือโครงสร้างหน่วยงาน เลือกทีละรายการ หลายรายการ หรือติ๊กที่กระจายไปยังลูกและพ่อ ค้นหาได้ และโหลดลูกเมื่อเปิดได้',
    en: 'Shows data as levels that open and close, such as document folders or an organisation chart. Pick one node, several, or tick boxes that spread to children and parents; search; load children when a node opens.',
  },
  english: TREE_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuTreeModule</code>) และ standalone (<code>WuTree</code>) type ของ node คือ <code>TreeNode</code> จาก <code>@wirabyte/ui/api</code>',
        en: 'Works as an NgModule (<code>WuTreeModule</code>) or standalone (<code>WuTree</code>). Nodes are typed <code>TreeNode</code> from <code>@wirabyte/ui/api</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[value]</code> คือ node ชั้นบนสุด แต่ละ node มี <code>label</code>, <code>children</code>, <code>icon</code> (หรือ <code>expandedIcon</code> / <code>collapsedIcon</code>), <code>expanded</code> · กดลูกศรเพื่อเปิดปิด (ค่า <code>expanded</code> เปลี่ยนใน node เดิม) · คีย์บอร์ด: ลูกศรขึ้นลงย้ายแถว, <code>→</code> เปิด / ไปลูกคนแรก, <code>←</code> ปิด / กลับไปพ่อ, <code>Home</code> / <code>End</code> · <code>scrollHeight</code> คือความสูงก่อนเลื่อน',
        en: '<code>[value]</code> is the top level; each node has <code>label</code>, <code>children</code>, <code>icon</code> (or <code>expandedIcon</code> / <code>collapsedIcon</code>) and <code>expanded</code> · press the arrow to open or close a node (its <code>expanded</code> changes in place) · keyboard: up and down arrows move, <code>→</code> opens / goes to the first child, <code>←</code> closes / goes to the parent, <code>Home</code> / <code>End</code> · <code>scrollHeight</code> is the height before it scrolls.',
      },
    },
    selection: {
      title: { th: 'เลือก node', en: 'Picking nodes' },
      text: {
        th: '<code>selectionMode="single"</code> กับ <code>[(selection)]</code> ได้ node เดียว · <code>"multiple"</code> ได้ array (คลิกเพิ่มหรือเอาออก หรือ <code>[metaKeySelection]="true"</code> ให้คลิกธรรมดาเลือกอย่างเดียวแล้ว <code>Ctrl</code> / <code>⌘</code> + คลิกเพิ่ม) · <code>Enter</code> / <code>Space</code> เลือกจากคีย์บอร์ด · <code>dataKey="key"</code> เทียบ node ด้วยฟิลด์นั้นแทนตัว object (เหมาะเมื่อโหลดข้อมูลใหม่) · <code>selectable: false</code> ทำให้ node นั้นเลือกไม่ได้',
        en: '<code>selectionMode="single"</code> with <code>[(selection)]</code> gives one node · <code>"multiple"</code> gives an array (a click adds or removes, or <code>[metaKeySelection]="true"</code> makes a plain click pick only that node and <code>Ctrl</code> / <code>⌘</code> + click add) · <code>Enter</code> / <code>Space</code> pick from the keyboard · <code>dataKey="key"</code> compares nodes by that field instead of by object (handy when data reloads) · <code>selectable: false</code> makes a node unpickable.',
      },
    },
    checkbox: {
      title: { th: 'ช่องติ๊ก', en: 'Check boxes' },
      text: {
        th: '<code>selectionMode="checkbox"</code> ติ๊กพ่อแล้วลูกทั้งหมดติดไปด้วย และพ่อติ๊กเองเมื่อลูกครบ ถ้าลูกติ๊กบางส่วน พ่อแสดงครึ่งติ๊ก (<code>aria-checked="mixed"</code>) · <code>[propagateSelectionDown]="false"</code> / <code>[propagateSelectionUp]="false"</code> ปิดการกระจาย · <code>selection</code> เป็น array ของ node ที่ติ๊กครบ',
        en: '<code>selectionMode="checkbox"</code>: ticking a parent ticks all its children, and a parent ticks itself when all its children are; with only some ticked it shows a half tick (<code>aria-checked="mixed"</code>) · <code>[propagateSelectionDown]="false"</code> / <code>[propagateSelectionUp]="false"</code> turn the spreading off · <code>selection</code> is the array of fully ticked nodes.',
      },
    },
    filter: {
      title: { th: 'ค้นหา', en: 'Search' },
      text: {
        th: '<code>[filter]="true"</code> มีช่องค้นหา · <code>filterMode="lenient"</code> (ค่าเริ่มต้น) แสดง node ที่ตรงพร้อมพ่อทั้งสายและลูกทั้งหมด · <code>"strict"</code> แสดงพ่อทั้งสายแต่ไม่แสดงลูกที่ไม่ตรง · <code>filterBy</code> ค้นหลายฟิลด์ (ค่าเริ่มต้น <code>label</code>) · ค้นไม่เจอแสดงข้อความ <code>emptyFilterMessage</code> จาก locale (ส่วน <code>emptyMessage</code> ใช้เมื่อไม่มี node เลย) · <code>resetFilter()</code> ล้างช่องค้นหา',
        en: '<code>[filter]="true"</code> adds a search box · <code>filterMode="lenient"</code> (the default) shows matching nodes with their whole path and all their children · <code>"strict"</code> shows the path but not the children that do not match · <code>filterBy</code> searches several fields (<code>label</code> by default) · a search that finds nothing shows the locale\'s <code>emptyFilterMessage</code> (<code>emptyMessage</code> is for a tree with no nodes) · <code>resetFilter()</code> clears the search.',
      },
    },
    lazy: {
      title: { th: 'โหลดลูกเมื่อเปิด', en: 'Loading children on open' },
      text: {
        th: 'ตั้ง <code>leaf: false</code> ให้ node ที่ยังไม่มีลูก ลูกศรจะแสดง แล้วใน <code>(onNodeExpand)</code> ตั้ง <code>node.loading = true</code> โหลดลูกจาก API แล้วใส่ <code>node.children</code> · <code>[loading]="true"</code> แสดงสถานะโหลดของทั้ง tree',
        en: 'Give a node with children still to load <code>leaf: false</code>: its arrow shows, and in <code>(onNodeExpand)</code> set <code>node.loading = true</code>, load the children from the API and put them in <code>node.children</code> · <code>[loading]="true"</code> shows the whole tree as loading.',
      },
    },
    templates: {
      title: { th: 'Template และเมนูคลิกขวา', en: 'Templates and the context menu' },
      text: {
        th: 'template ตาม <code>type</code> ของ node: <code>wuTemplate="file"</code> สำหรับ node ที่ <code>type: \'file\'</code> และ <code>wuTemplate="default"</code> สำหรับที่เหลือ (ได้ <code>let-node</code>) ชื่อ template นี้เขียนแบบ <code>wuTemplate</code> ในทุกรุ่นเพราะเป็นชื่อตามข้อมูล · <code>header</code>, <code>footer</code>, <code>empty</code> และ <code>togglericon</code> · <code>[contextMenu]="fileMenu"</code> ต่อกับ wu-contextMenu: คลิกขวาที่ node แล้วเมนูเปิด และ <code>(onNodeContextMenuSelect)</code> บอกว่าเป็น node ไหน · <code>(onNodeDoubleClick)</code> เหมาะกับการเปิดไฟล์',
        en: 'Templates by node <code>type</code>: <code>wuTemplate="file"</code> for nodes with <code>type: \'file\'</code> and <code>wuTemplate="default"</code> for the rest (both get <code>let-node</code>); these names come from your data, so they are written <code>wuTemplate</code> in every version · <code>header</code>, <code>footer</code>, <code>empty</code> and <code>togglericon</code> · <code>[contextMenu]="fileMenu"</code> connects a wu-contextMenu: a right-click on a node opens it, and <code>(onNodeContextMenuSelect)</code> says which node · <code>(onNodeDoubleClick)</code> suits opening a file.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-tree&gt;</code> เป็น <code>&lt;wu-tree&gt;</code> input, event และ template ชื่อเดิม (<code>pTemplate="default"</code> และ template ตาม type ใช้ต่อได้) <code>TreeNode</code> import จาก <code>@wirabyte/ui/api</code> · class <code>p-tree</code>, <code>p-treenode</code> และ <code>p-highlight</code> อยู่คู่กับ class <code>wu-*</code> · การลากวาง node (<code>draggableNodes</code>, <code>droppableNodes</code>), <code>virtualScroll</code> และ <code>layout="horizontal"</code> รับไว้แต่ยังไม่มีผล',
        en: 'Change <code>&lt;p-tree&gt;</code> to <code>&lt;wu-tree&gt;</code>; inputs, events and templates keep their names (<code>pTemplate="default"</code> and the per-type templates keep working), and <code>TreeNode</code> is imported from <code>@wirabyte/ui/api</code> · the <code>p-tree</code>, <code>p-treenode</code> and <code>p-highlight</code> classes sit next to the <code>wu-*</code> ones · node drag and drop (<code>draggableNodes</code>, <code>droppableNodes</code>), <code>virtualScroll</code> and <code>layout="horizontal"</code> are accepted but not built yet.',
      },
    },
  },
  code: {
    basic: `<wu-tree [value]="folders" ariaLabel="เอกสารของโรงเรียน" [style]="{ maxWidth: '24rem' }"></wu-tree>`,
    selection: `<wu-tree [value]="folders" selectionMode="single" [(selection)]="pickedFile" dataKey="key" ariaLabel="เอกสารของโรงเรียน"></wu-tree>
<span>เลือกอยู่: {{ pickedFile?.label }}</span>`,
    checkbox: `<wu-tree [value]="folders" selectionMode="checkbox" [(selection)]="tickedFiles" ariaLabel="เอกสารของโรงเรียน"></wu-tree>
<span>เลือกแล้ว {{ tickedFiles.length }} ไฟล์</span>`,
    filter: `<wu-tree [value]="folders" [filter]="true" filterMode="lenient" filterPlaceholder="ค้นหาเอกสาร"
  scrollHeight="18rem" ariaLabel="เอกสารของโรงเรียน"></wu-tree>`,
    lazy: `<wu-tree [value]="grades" (onNodeExpand)="loadRooms($event)" ariaLabel="ห้องเรียน"></wu-tree>`,
    templates: `<wu-tree [value]="folders" selectionMode="single" [(selection)]="pickedFile" [contextMenu]="fileMenu"
  (onNodeContextMenuSelect)="pickNode($event)" (onNodeDoubleClick)="openFile($event)" ariaLabel="เอกสารของโรงเรียน">
  <ng-template wuTemplate="default" let-node>
    <b>{{ node.label }}</b>
  </ng-template>
  <ng-template wuTemplate="file" let-node>
    <span>{{ node.label }}</span>
    <small class="file-size">{{ node.data }}</small>
  </ng-template>
</wu-tree>
<wu-contextMenu #fileMenu [model]="fileActions"></wu-contextMenu>`,
  },
  ts: {
    basic: FOLDERS_TS,
    selection: `pickedFile: TreeNode | null = null;`,
    checkbox: `tickedFiles: TreeNode[] = [];`,
    lazy: `import { WuTreeNodeEvent } from '@wirabyte/ui/tree';

grades: TreeNode[] = [
  { key: 'm1', label: 'ชั้น ม.1', leaf: false },
  { key: 'm2', label: 'ชั้น ม.2', leaf: false },
  { key: 'm3', label: 'ชั้น ม.3', leaf: false },
];

/** โหลดห้องเมื่อเปิดชั้น */
loadRooms(event: WuTreeNodeEvent): void {
  const node = event.node;
  if (node.children) return;
  node.loading = true;
  this.roomService.listRooms(node.key).subscribe((rooms) => {
    node.children = rooms.map((r) => ({ key: r.code, label: 'ห้อง ' + r.name, icon: 'wi wi-users' }));
    node.loading = false;
  });
}`,
    templates: `import { WuTreeNodeEvent } from '@wirabyte/ui/tree';
import { WuMenuItem } from '@wirabyte/ui/menu';

// โฟลเดอร์ใช้ template default ไฟล์ใช้ template file
fileActions: WuMenuItem[] = [
  { label: 'ดาวน์โหลด', icon: 'wi wi-download', command: (event) => this.run(event) },
  { label: 'เปลี่ยนชื่อ', icon: 'wi wi-pencil', command: (event) => this.run(event) },
  { label: 'ลบ', icon: 'wi wi-trash', command: (event) => this.run(event) },
];

pickNode(event: WuTreeNodeEvent): void {
  this.pickedFile = event.node;
}

openFile(event: WuTreeNodeEvent): void {
  this.lastOpened = event.node.label ?? '';
}`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('value', 'TreeNode[]', undefined, 'node ชั้นบนสุด', 'The top-level nodes'),
        row('selectionMode', "'single' | 'multiple' | 'checkbox'", undefined, 'วิธีเลือก (ไม่ใส่ = เลือกไม่ได้)', 'How nodes are picked (none: no picking)'),
        row('selection', 'TreeNode | TreeNode[]', undefined, 'node ที่เลือก (สองทาง [(selection)])', 'The picked node(s) (two-way [(selection)])'),
        row('propagateSelectionDown · propagateSelectionUp', BOOL, 'true', 'ติ๊กกระจายไปลูก / ขึ้นไปพ่อ', 'Ticks spread to children / up to parents'),
        row('metaKeySelection', BOOL, 'false', 'คลิกธรรมดาเลือกอย่างเดียว Ctrl / ⌘ + คลิกเพิ่ม (multiple)', 'A plain click picks one; Ctrl / ⌘ + click adds (multiple)'),
        row('dataKey', 'string', undefined, 'เทียบ node ด้วยฟิลด์นี้', 'Compare nodes by this field'),
        row('filter · filterBy · filterMode · filterPlaceholder', "boolean · string · 'lenient' | 'strict' · string", "false · 'label' · 'lenient'", 'ช่องค้นหาและวิธีค้น', 'The search box and how it matches'),
        row('emptyMessage', 'string', 'locale', 'ข้อความเมื่อไม่มี node (ค้นไม่เจอใช้ emptyFilterMessage ของ locale)', 'Text when there are no nodes (a search with no result uses the locale\'s emptyFilterMessage)'),
        row('loading', BOOL, 'false', 'สถานะโหลดของทั้ง tree', 'The whole tree is loading'),
        row('scrollHeight', 'string', undefined, 'ความสูงก่อนเลื่อน', 'Height before it scrolls'),
        row('contextMenu', 'wu-contextMenu', undefined, 'เมนูที่เปิดเมื่อคลิกขวาที่ node', 'The menu a right-click on a node opens'),
        row('ariaLabel · ariaLabelledBy · togglerAriaLabel', 'string', undefined, 'ชื่อของ tree และของปุ่มเปิดปิด', 'Names of the tree and of the toggle buttons'),
        STYLE_ROW,
        row('layout · lazy · virtualScroll · virtualScrollItemSize · draggableNodes · droppableNodes · validateDrop · filterLocale · trackBy · indentation', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ยังไม่มีผล', 'Accepted so existing templates compile; no effect yet'),
      ],
    },
    {
      id: 'api-node',
      title: { th: 'ฟิลด์ของ node', en: 'Node fields' },
      rows: [
        row('label · data · key', 'string · any · string', undefined, 'ข้อความ ข้อมูลของแอป และกุญแจ (ใช้กับ dataKey)', 'Text, your own data, and a key (for dataKey)'),
        row('children · leaf', 'TreeNode[] · boolean', undefined, 'ลูก / leaf: false = ยังมีลูกที่ต้องโหลด', 'Children / leaf: false: children still to load'),
        row('expanded · loading', BOOL, undefined, 'เปิดอยู่ / กำลังโหลดลูก', 'Open / loading its children'),
        row('icon · expandedIcon · collapsedIcon', 'string', undefined, 'ไอคอน (แยกตอนเปิด / ปิดได้)', 'Icon (separate when open / closed)'),
        row('type', 'string', "'default'", 'เลือก template ตามชื่อนี้', 'Picks the template of that name'),
        row('selectable · styleClass · style', 'boolean · string · object', undefined, 'เลือกได้หรือไม่ และการแต่งแถว', 'Whether it can be picked, and row styling'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('selectionChange', 'TreeNode | TreeNode[]', undefined, 'คู่ของ [(selection)]', 'For [(selection)]'),
        row('onNodeSelect · onNodeUnselect', 'WuTreeNodeEvent', undefined, 'เลือก / เอาออก', 'Picked / unpicked'),
        row('onNodeExpand · onNodeCollapse', 'WuTreeNodeEvent', undefined, 'เปิด / ปิด node', 'A node opened / closed'),
        row('onNodeDoubleClick', 'WuTreeNodeEvent', undefined, 'ดับเบิลคลิกที่ node', 'A node was double-clicked'),
        row('onNodeContextMenuSelect', 'WuTreeNodeEvent', undefined, 'คลิกขวาที่ node (เมื่อมี contextMenu)', 'A node was right-clicked (with a contextMenu)'),
        row('onFilter', 'WuTreeFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'template ตาม type เขียนเป็น wuTemplate="ชื่อ type" (หรือ pTemplate) ส่วน header / footer / empty / togglericon เขียนเป็น #ชื่อ ก็ได้', en: 'Per-type templates are written wuTemplate="type name" (or pTemplate); header / footer / empty / togglericon can also be #name.' },
      rows: [
        row('default · <type>', '$implicit (node)', undefined, 'เนื้อในแถวของ node', 'What is inside a node\'s row'),
        row('header · footer', '—', undefined, 'เหนือ / ใต้ tree', 'Above / below the tree'),
        row('empty', '—', undefined, 'เมื่อไม่มี node / ค้นไม่เจอ', 'No nodes / nothing found'),
        row('togglericon', '$implicit (open)', undefined, 'ไอคอนปุ่มเปิดปิด', 'The toggle icon'),
      ],
    },
    {
      id: 'api-methods',
      title: 'Methods',
      rows: [row('resetFilter()', 'void', undefined, 'ล้างช่องค้นหา', 'Clears the search')],
    },
    {
      id: 'api-types',
      title: 'Types',
      code: `import type { TreeNode } from '@wirabyte/ui/api';

interface WuTreeNodeEvent { originalEvent: Event; node: TreeNode }
interface WuTreeFilterEvent { filter: string; filteredValue: TreeNode[] }`,
    },
  ],
  tokens: [
    tok('--wu-tree-padding', 'ระยะในกรอบ', 'Frame padding'),
    tok('--wu-tree-bg', 'พื้นของกรอบ', 'Frame background'),
    tok('--wu-tree-border-width', 'ขอบของกรอบ', 'Frame border width'),
    tok('--wu-tree-gap', 'ระยะระหว่างแถว', 'Gap between rows'),
    tok('--wu-tree-node-padding-x · --wu-tree-node-padding-y', 'ระยะในแถว', 'Row padding'),
    tok('--wu-tree-node-radius', 'ความมนของแถว', 'Row radius'),
  ],
};

export const TREESELECT_DOC: ComponentDoc = {
  id: 'treeselect',
  title: 'TreeSelect',
  group: 'Form',
  entry: 'treeselect',
  standalone: 'WuTreeSelect',
  module: 'WuTreeSelectModule',
  forms: true,
  selector: 'wu-treeselect',
  description: {
    th: 'ช่องเลือกที่เปิดเป็น tree ให้เลือก node เดียวหรือหลาย node (แสดงเป็นข้อความหรือ chip) ค้นหาได้ ล้างค่าได้ และเมื่อเปิดจะเปิดพ่อของ node ที่เลือกไว้ให้เห็นทันที',
    en: 'A field that opens a tree to pick one node or several (shown as text or chips). It can search and be cleared, and opening it shows the picked nodes with their parents open.',
  },
  english: TREE_WORDS,
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'ใช้ได้ทั้ง NgModule (<code>WuTreeSelectModule</code>) และ standalone (<code>WuTreeSelect</code>) ใช้คู่กับ <code>FormsModule</code> หรือ <code>ReactiveFormsModule</code> แท็กเขียนได้ทั้ง <code>wu-treeselect</code>, <code>wu-treeSelect</code> และ <code>wu-tree-select</code>',
        en: 'Works as an NgModule (<code>WuTreeSelectModule</code>) or standalone (<code>WuTreeSelect</code>), with <code>FormsModule</code> or <code>ReactiveFormsModule</code>. The tag can be written <code>wu-treeselect</code>, <code>wu-treeSelect</code> or <code>wu-tree-select</code>.',
      },
    },
    basic: {
      title: 'Basic',
      text: {
        th: '<code>[options]</code> คือ node แบบเดียวกับ wu-tree และ <code>[(ngModel)]</code> ได้ node ที่เลือก เลือกแล้วแผงปิด · เปิดใหม่จะเห็น node ที่เลือกพร้อมพ่อที่เปิดไว้ · <code>[filter]="true"</code> ค้นหาในแผง (<code>[resetFilterOnHide]="false"</code> เก็บคำค้นไว้) · <code>[showClear]="true"</code> มีปุ่มล้าง และ <code>(onClear)</code> · คีย์บอร์ด: <code>↓</code> / <code>Enter</code> / <code>Space</code> เปิด ใช้ลูกศรใน tree, <code>Esc</code> ปิดแล้วโฟกัสกลับ, <code>Tab</code> ออกและปิด',
        en: '<code>[options]</code> are nodes as in wu-tree and <code>[(ngModel)]</code> gets the picked node; a pick closes the panel · reopening shows the picked node with its parents open · <code>[filter]="true"</code> searches in the panel (<code>[resetFilterOnHide]="false"</code> keeps the text) · <code>[showClear]="true"</code> adds a clear button, with <code>(onClear)</code> · keyboard: <code>↓</code> / <code>Enter</code> / <code>Space</code> open it and the arrows work in the tree, <code>Esc</code> closes and gives focus back, <code>Tab</code> leaves and closes.',
      },
    },
    multiple: {
      title: { th: 'เลือกหลาย node', en: 'Several nodes' },
      text: {
        th: '<code>selectionMode="checkbox"</code> (หรือ <code>"multiple"</code>) ค่าเป็น array ติ๊กกระจายไปลูกและพ่อเหมือน wu-tree · <code>display="chip"</code> แสดงที่เลือกเป็น chip (ค่าเริ่มต้น <code>comma</code> เป็นข้อความคั่นจุลภาค)',
        en: '<code>selectionMode="checkbox"</code> (or <code>"multiple"</code>) makes the value an array; ticks spread to children and parents as in wu-tree · <code>display="chip"</code> shows the picks as chips (<code>comma</code>, the default, as comma-separated text).',
      },
    },
    templates: {
      title: { th: 'Template และหน้าตา', en: 'Templates and looks' },
      text: {
        th: 'template <code>value</code> วาดค่าที่เลือกในช่องเอง (ได้ค่าและ <code>placeholder</code>) · <code>header</code> และ <code>footer</code> อยู่ในแผง · <code>variant="filled"</code>, <code>size</code>, <code>[disabled]</code> และ <code>[loading]</code> เหมือนช่องอื่น · <code>scrollHeight</code> คือความสูงของ tree (ค่าเริ่มต้น 400px) และ <code>panelStyleClass</code> / <code>panelStyle</code> แต่งแผง',
        en: 'The <code>value</code> template draws the picked value in the field (it gets the value and <code>placeholder</code>) · <code>header</code> and <code>footer</code> go in the panel · <code>variant="filled"</code>, <code>size</code>, <code>[disabled]</code> and <code>[loading]</code> as on other fields · <code>scrollHeight</code> is the tree height (400px by default) and <code>panelStyleClass</code> / <code>panelStyle</code> style the panel.',
      },
    },
    migration: {
      title: { th: 'ย้ายโค้ดเดิม', en: 'Moving existing code' },
      text: {
        th: 'เปลี่ยน <code>&lt;p-treeSelect&gt;</code> เป็น <code>&lt;wu-treeSelect&gt;</code> input, event และ template ชื่อเดิม แผงเปิดใน top layer จึงไม่ต้องใช้ <code>appendTo</code> (รับไว้แต่ไม่มีผล เช่นเดียวกับ <code>fluid</code>, transition และ <code>virtualScroll</code>) · class <code>p-treeselect</code> อยู่คู่กับ <code>wu-treeselect</code>',
        en: 'Change <code>&lt;p-treeSelect&gt;</code> to <code>&lt;wu-treeSelect&gt;</code>; inputs, events and templates keep their names. The panel opens in the top layer, so <code>appendTo</code> is not needed (accepted and ignored, like <code>fluid</code>, the transitions and <code>virtualScroll</code>) · the <code>p-treeselect</code> class sits next to <code>wu-treeselect</code>.',
      },
    },
  },
  code: {
    basic: `<label for="attachment">เอกสารที่แนบ</label>
<wu-treeSelect inputId="attachment" name="attachment" [(ngModel)]="attachment" [options]="folders" placeholder="เลือกเอกสาร"
  [filter]="true" [showClear]="true" [style]="{ width: '20rem' }"></wu-treeSelect>`,
    multiple: `<label for="myRooms">ห้องที่รับผิดชอบ</label>
<wu-treeSelect inputId="myRooms" name="myRooms" [(ngModel)]="myRooms" [options]="roomTree" selectionMode="checkbox"
  display="chip" placeholder="เลือกห้องที่รับผิดชอบ" [style]="{ width: '20rem' }"></wu-treeSelect>`,
    templates: {
      v3: `<wu-treeSelect name="attachment" [(ngModel)]="attachment" [options]="folders" variant="filled" ariaLabel="เอกสารที่แนบ"
  [style]="{ width: '20rem' }">
  <ng-template #value let-node let-placeholder="placeholder">
    @if (node) {
      <i [class]="node.icon"></i> {{ node.label }}
    } @else {
      <span class="muted">{{ placeholder }}</span>
    }
  </ng-template>
</wu-treeSelect>`,
      classic: `<wu-treeSelect name="attachment" [(ngModel)]="attachment" [options]="folders" variant="filled" ariaLabel="เอกสารที่แนบ"
  [style]="{ width: '20rem' }">
  <ng-template wuTemplate="value" let-node let-placeholder="placeholder">
    <ng-container *ngIf="node; else empty"><i [class]="node.icon"></i> {{ node.label }}</ng-container>
    <ng-template #empty><span class="muted">{{ placeholder }}</span></ng-template>
  </ng-template>
</wu-treeSelect>`,
    },
  },
  ts: {
    basic: `${FOLDERS_TS}
attachment: TreeNode | null = null;`,
    multiple: `roomTree: TreeNode[] = [
  { key: 'm1', label: 'ชั้น ม.1', children: [{ key: '101', label: 'ห้อง ม.1/1' }, { key: '102', label: 'ห้อง ม.1/2' }] },
  { key: 'm2', label: 'ชั้น ม.2', children: [{ key: '201', label: 'ห้อง ม.2/1' }, { key: '202', label: 'ห้อง ม.2/2' }] },
];
myRooms: TreeNode[] = [];`,
  },
  api: [
    {
      id: 'api-inputs',
      title: 'Inputs',
      rows: [
        row('options', 'TreeNode[]', undefined, 'node ที่ให้เลือก', 'The nodes to pick from'),
        row('selectionMode', "'single' | 'multiple' | 'checkbox'", "'single'", 'เลือก node เดียวหรือหลาย node', 'One node or several'),
        row('placeholder', 'string', undefined, 'ข้อความเมื่อยังไม่เลือก', 'Text while nothing is picked'),
        row('display', "'comma' | 'chip'", "'comma'", 'แสดงหลายค่าเป็นข้อความหรือ chip', 'Several picks as text or chips'),
        row('filter · filterBy · filterMode · filterPlaceholder · resetFilterOnHide', "boolean · string · 'lenient' | 'strict' · string · boolean", "false · 'label' · 'lenient' · — · true", 'ช่องค้นหาในแผง', 'The search box in the panel'),
        row('showClear', BOOL, 'false', 'ปุ่มล้างค่า', 'A clear button'),
        row('metaKeySelection · propagateSelectionUp · propagateSelectionDown · dataKey', 'boolean · boolean · boolean · string', 'false · true · true', 'การเลือกแบบเดียวกับ wu-tree', 'Picking as in wu-tree'),
        row('emptyMessage', 'string', 'locale', 'เมื่อไม่มี node / ค้นไม่เจอ', 'No nodes / nothing found'),
        row('disabled · loading', BOOL, 'false', 'ปิดการใช้งาน / กำลังโหลด', 'Turned off / loading'),
        row('scrollHeight', 'string', "'400px'", 'ความสูงของ tree ก่อนเลื่อน', 'Tree height before it scrolls'),
        row('variant · size', "'outlined' | 'filled' · 'small' | 'large'", undefined, 'หน้าตาและขนาดของช่อง', 'Field look and size'),
        row('panelStyleClass · panelStyle · panelClass · containerStyleClass · labelStyleClass', 'string · object · string · string · string', undefined, 'แต่งแผงและส่วนต่าง ๆ ของช่อง', 'Style the panel and parts of the field'),
        row('inputId · ariaLabel · ariaLabelledBy · tabindex', 'string · string · string · number', undefined, 'id สำหรับ label for และชื่อสำหรับโปรแกรมอ่านหน้าจอ', 'Id for a label, and screen reader names'),
        STYLE_ROW,
        row('appendTo · fluid · showTransitionOptions · hideTransitionOptions · virtualScroll · filterLocale', 'unknown', undefined, 'รับไว้เพื่อให้ template เดิมใช้ได้ ไม่มีผล', 'Accepted so existing templates compile; no effect'),
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('onShow · onHide', 'void', undefined, 'แผงเปิด / ปิด', 'The panel opened / closed'),
        row('onClear', 'void', undefined, 'กดปุ่มล้าง', 'The clear button was pressed'),
        row('onFilter', 'WuTreeFilterEvent', undefined, 'พิมพ์ค้นหา', 'Search typed'),
        row('onNodeSelect · onNodeUnselect · onNodeExpand · onNodeCollapse', 'WuTreeNodeEvent', undefined, 'event ของ tree ในแผง', 'Events of the tree in the panel'),
        row('onFocus · onBlur', 'FocusEvent', undefined, 'ได้ / เสียโฟกัส', 'Gains / loses focus'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      typeLabel: { th: 'context', en: 'Context' },
      note: { th: 'เขียนเป็น #value, wuTemplate="value" หรือ pTemplate="value" ก็ได้', en: 'Write them as #value, wuTemplate="value" or pTemplate="value".' },
      rows: [
        row('value', '$implicit (value) · placeholder', undefined, 'ค่าที่เลือกในช่อง', 'The picked value in the field'),
        row('header · footer', '$implicit (value) · options', undefined, 'เหนือ / ใต้ tree ในแผง', 'Above / below the tree in the panel'),
      ],
    },
  ],
  tokens: [],
  themingNote: {
    th: 'TreeSelect ใช้ token ของ Select (ช่อง แผง) และของ Tree (แถวในแผง) จึงไม่มี token ของตัวเอง',
    en: 'TreeSelect uses the Select tokens (field, panel) and the Tree tokens (rows in the panel), so it has none of its own.',
  },
};
