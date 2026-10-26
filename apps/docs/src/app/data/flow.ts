import { ComponentDoc } from '../core/component-doc';
import { row, STYLE_ROW, tok } from './doc-helpers';

/** The node template context, shown on the Properties tab. */
const NODE_CONTEXT = `// <ng-template wtFlowNode="person" let-node> : node คือ object นี้
interface WtFlowNodeContext<T = any> {
  node: WtFlowNode<T>;          // โหนดตามที่แอปให้ (ตำแหน่งและการเลือกล่าสุด)
  id: string;
  type: string;
  data: T;
  selected: boolean;
  dragging: boolean;
  isConnectable: boolean;
  positionAbsoluteX: number;    // ตำแหน่งใน flow รวมกรอบแม่แล้ว
  positionAbsoluteY: number;
  width: number;                // ขนาดที่วัดได้ (0 จนกว่าจะวัด)
  height: number;
  zIndex: number;
  sourcePosition: 'top' | 'right' | 'bottom' | 'left';
  targetPosition: 'top' | 'right' | 'bottom' | 'left';
  parentId: string | null;
}

// <ng-template wtFlowEdge="special" let-edge> และ wtFlowEdgeLabel
interface WtFlowEdgeContext<T = any> {
  edge: WtFlowEdge<T>;
  id: string;
  type: string;
  data: T;
  path: string;                 // ใช้กับ <svg:path [attr.d]="edge.path">
  labelX: number;
  labelY: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  selected: boolean;
  animated: boolean;
  label: string;
  markerStart: string | null;   // url(#…)
  markerEnd: string | null;
}

// <ng-template wtFlowConnectionLine let-line>
interface WtFlowConnectionLineContext {
  path: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  valid: boolean | null;        // อยู่เหนือจุดที่ต่อได้ / ไม่ได้ / ยังไม่อยู่เหนือจุดไหน
  fromNodeId: string;
  fromHandleId: string | null;
}`;

const DATA_TYPES = `interface WtFlowNode<T = any> {
  id: string;
  position: { x: number; y: number };    // นับจากกรอบแม่ถ้ามี parentId
  data?: T;                               // โหนดในตัวแสดง data.label
  type?: string;                          // 'default' | 'input' | 'output' | 'group' | ชื่อ template ของแอป
  width?: number;                         // กำหนดขนาดเอง (resizer เขียนค่านี้)
  height?: number;
  initialWidth?: number;                  // ขนาดที่ใช้ก่อนวัดได้
  initialHeight?: number;
  selected?: boolean;
  draggable?: boolean;                    // ค่าเฉพาะโหนด ไม่ใส่ = ตามค่าของ flow
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  hidden?: boolean;
  zIndex?: number;
  parentId?: string;
  extent?: 'parent' | [[number, number], [number, number]];
  expandParent?: boolean;
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left';
  targetPosition?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  style?: Record<string, any>;
  ariaLabel?: string;
  dragHandle?: string;                    // selector ของส่วนที่ใช้ลาก เช่น '.grip'
}

interface WtFlowEdge<T = any> {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;                          // 'default' | 'smoothstep' | 'step' | 'straight' | 'simplebezier' | ชื่อ template
  data?: T;
  label?: string;
  labelStyle?: Record<string, any>;
  labelShowBg?: boolean;
  labelBgStyle?: Record<string, any>;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  animated?: boolean;
  hidden?: boolean;
  selected?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  reconnectable?: boolean | 'source' | 'target';
  markerStart?: 'arrow' | 'arrowclosed' | { type: 'arrow' | 'arrowclosed'; color?: string; width?: number; height?: number; strokeWidth?: number };
  markerEnd?: 'arrow' | 'arrowclosed' | { type: 'arrow' | 'arrowclosed'; color?: string; width?: number; height?: number; strokeWidth?: number };
  style?: Record<string, any>;
  className?: string;
  interactionWidth?: number;              // ความกว้างของเส้นที่รับคลิก (20)
  zIndex?: number;
  ariaLabel?: string;
  pathOptions?: { curvature?: number; borderRadius?: number; offset?: number };
}`;

export const FLOW_DOC: ComponentDoc = {
  id: 'flow',
  title: 'Flow',
  group: 'Diagram',
  entry: 'flow',
  standalone: 'WtFlow, WtFlowHandle, WtFlowNodeTemplate, WtFlowBackground, WtFlowControls, WtFlowMinimap',
  module: 'WtFlowModule',
  selector: 'wt-flow',
  description: {
    th: 'แผนภาพแบบโหนดที่ผู้ใช้ลาก เชื่อม และแก้ได้บนหน้าเว็บ เช่น ขั้นตอนอนุมัติ ผังงาน ผังองค์กร แผนผังระบบ · โหนดเป็น template ของแอปเอง เส้นเชื่อมมี 5 แบบ ซูมและเลื่อนได้ทั้งเมาส์ คีย์บอร์ด และจอสัมผัส จัดเรียงอัตโนมัติ เลิกทำ / ทำซ้ำ และส่งออกเป็น SVG หรือ JSON',
    en: 'A node diagram people drag, connect and edit on the page: approval steps, flowcharts, org charts, system maps · nodes are your own templates, edges come in five shapes, and it pans and zooms by mouse, keyboard and touch, lays itself out, undoes and redoes, and exports to SVG or JSON.',
  },
  english: {
    // quick start
    'ขั้นตอนอนุมัติคำร้อง': 'Request approval steps',
    'ยื่นคำร้อง': 'Submit a request',
    'ตรวจเอกสาร': 'Check documents',
    'ขอเอกสารเพิ่ม': 'Ask for more documents',
    'ครูที่ปรึกษาอนุมัติ': 'Adviser approves',
    'แจ้งผลทางอีเมล': 'Email the result',
    'ครบ': 'Complete',
    'ทุกเส้น (และเส้นที่ผู้ใช้ลากเชื่อมใหม่) มีหัวลูกศร': 'every edge (and each one people connect) gets an arrowhead',
    'โหนด': 'nodes',
    'เส้น': 'edges',
    // custom nodes
    'โหนด type: \'request\'': 'node type: \'request\'',
    'โหนดตัดสินใจ: จุดออกสองจุดทางขวา id="yes" และ id="no"': 'a decision node: two ways out on the right, id="yes" and id="no"',
    'ใบลา': 'Leave',
    'ขอลา': 'Leave:',
    'วัน': 'days',
    'ลาเกิน 3 วัน?': 'Over 3 days?',
    'หัวหน้างาน': 'Team lead',
    'ฝ่ายบุคคล': 'Human resources',
    'อรุณ': 'Arun',
    'ศิลา': 'Sila',
    'เพชร': 'Phet',
    'ใช่': 'Yes',
    'ไม่': 'No',
    'ขั้นตอนการลา': 'Leave request steps',
    // edges
    'ต้นทาง': 'Source',
    'ปลายทาง': 'Target',
    'ลบได้': 'Removable',
    'ลบเส้นนี้': 'Remove this edge',
    'เส้นเชื่อมแต่ละแบบ': 'Edge shapes',
    'ลบเส้นเมื่อกดปุ่มบนป้าย': 'remove the edge when its label button is pressed',
    // connecting
    'ครูประจำชั้น': 'Homeroom teachers',
    'ครูมาลี': 'Ms Mali',
    'ครูอรุณ': 'Mr Arun',
    'ครูราตรี': 'Ms Ratri',
    'ม.1/1': 'Grade 7/1',
    'ม.1/2': 'Grade 7/2',
    'ห้องละหนึ่งคน': 'one per class',
    'ต่อจากครูไปห้องเท่านั้น': 'teacher to class only',
    'ผู้ใช้ลากเชื่อม: เพิ่มเส้นเอง': 'people connected two handles: add the edge',
    'บอกผลเมื่อปล่อยเมาส์': 'tell the result when the press ends',
    'เชื่อมแล้ว': 'Connected',
    'เชื่อมไม่ได้': 'Not allowed',
    'ล่าสุด': 'Last',
    // controlled
    'ปฐมนิเทศ': 'Orientation',
    'สอบกลางภาค': 'Midterm exams',
    'สอบปลายภาค': 'Final exams',
    'ปฏิทินภาคเรียน': 'Term calendar',
    'ลากได้แค่ซ้ายขวา: บังคับ y ให้เป็น 0 ก่อนใช้': 'drag sideways only: force y to 0 before applying',
    'การเปลี่ยนแปลงล่าสุด': 'Last changes',
    // selection
    'จองหอประชุม': 'Book the hall',
    'เชิญวิทยากร': 'Invite the speaker',
    'ทำป้าย': 'Make the banner',
    'ประชาสัมพันธ์': 'Announce',
    'ลงทะเบียน': 'Registration',
    'สรุปผล': 'Report',
    'เตรียมงานสัมมนา': 'Seminar planning',
    'งานที่ล็อกไว้ลบไม่ได้': 'Locked tasks can not be deleted',
    'ห้ามลบงานที่ล็อกไว้': 'locked tasks may not be deleted',
    'ล็อกไว้': 'Locked',
    'ที่เลือก': 'Selected',
    'ลบแล้ว': 'Deleted',
    // groups
    'ฝ่ายวิชาการ': 'Academic affairs',
    'จัดตารางสอน': 'Timetable',
    'บันทึกผลการเรียน': 'Grade records',
    'ฝ่ายกิจการนักเรียน': 'Student affairs',
    'ชุมนุม': 'Clubs',
    'ดูแลนักเรียน': 'Student care',
    'งานของโรงเรียน': 'School departments',
    // toolbar
    'ประชุมผู้ปกครอง 9:00 น.': 'Parent meeting at 9:00',
    'ส่งคะแนนก่อนวันศุกร์': 'Send the scores by Friday',
    'ป้ายประกาศ': 'Notice board',
    'สีเหลือง': 'Yellow',
    'สีเขียว': 'Green',
    'สีฟ้า': 'Blue',
    'ลบโน้ต': 'Delete the note',
    // context menu
    'ขั้นตอนเบิกพัสดุ': 'Supplies request steps',
    'ขอเบิกพัสดุ': 'Request supplies',
    'หัวหน้าอนุมัติ': 'Head approves',
    'จ่ายของ': 'Hand out',
    'ส่งต่อ': 'Forward',
    'อนุมัติแล้ว': 'Approved',
    'ลบเส้น': 'Delete edge',
    'ลากปลายเส้นใหม่': 'Reconnect',
    'สลับเส้นประวิ่ง': 'Toggle animated',
    'รูปเส้น': 'Edge shape',
    'โค้ง': 'Curve',
    'หักมุมมน': 'Rounded steps',
    'หักมุมฉาก': 'Square steps',
    'เส้นตรง': 'Straight',
    'แก้ชื่อ': 'Rename',
    'ทำสำเนา': 'Duplicate',
    'ลบโหนด': 'Delete node',
    'เพิ่มโหนดตรงนี้': 'Add a node here',
    'ขั้นตอนใหม่': 'New step',
    'ชื่อใหม่': 'New name',
    'ลากวงกลมที่ปลายเส้นไปจุดใหม่': 'Drag a circle at an end of the edge to a new handle',
    'แก้ชื่อโหนด': 'rename a node',
    'คลิกขวาบนเส้น: เมนูของเส้นนั้น': 'right-click on an edge: that edge’s menu',
    'เลือกเส้นไว้ วงกลมที่ปลายจึงโผล่มาให้ลากไปจุดใหม่': 'select the edge, so the circles at its ends appear to drag to a new handle',
    'คลิกขวาบนพื้น: จำจุดที่คลิกไว้เป็นตำแหน่งใน flow': 'right-click on the pane: keep the point as a flow position',
    'ปุ่ม Menu หรือ Shift + F10 บนโหนด เส้น หรือพื้นที่โฟกัสอยู่: เมนูเดียวกับคลิกขวา': 'the Menu key or Shift + F10 on the focused node, edge or pane: the same menu as a right-click',
    'คลิกขวาที่เส้น โหนด หรือพื้น': 'Right-click an edge, a node or the pane',
    // viewport
    'แบบฟอร์มออนไลน์': 'Online form',
    'ส่งเรื่องให้ฝ่ายทะเบียน': 'Send to the registrar',
    'ขั้นตอน': 'Step',
    'เริ่ม': 'Start',
    'จบ': 'End',
    'ลากไปวาง หรือแตะเพื่อเพิ่ม': 'Drag onto the diagram, or tap to add',
    'พอดีจอ': 'Fit',
    'ไปที่จุดเริ่ม': 'Go to start',
    'ล้อเมาส์เลื่อนภาพ': 'Wheel pans',
    'มุมมอง': 'View',
    'ลากจากแถบ: ใส่ชนิดของโหนดไว้ในการลาก': 'dragging from the palette: carry the node type',
    'วางบน flow: แปลงตำแหน่งบนจอเป็นตำแหน่งใน flow': 'dropped on the flow: turn the screen point into a flow point',
    'แตะรายการ: วางไว้กลางภาพ': 'tapped: place it in the middle of the view',
    // layout
    'ผู้อำนวยการ': 'Principal',
    'รองฝ่ายวิชาการ': 'Deputy, academic',
    'รองฝ่ายบริหาร': 'Deputy, administration',
    'งานทะเบียน': 'Registrar',
    'งานหลักสูตร': 'Curriculum',
    'งานการเงิน': 'Finance',
    'งานพัสดุ': 'Supplies',
    'โครงสร้างโรงเรียน': 'School structure',
    'บนลงล่าง': 'Top to bottom',
    'ซ้ายไปขวา': 'Left to right',
    'แบบต้นไม้': 'Tree',
    'หรือจัดก่อนแสดงด้วย helper เช่นข้อมูลจาก API ที่ยังไม่มีตำแหน่ง': 'or lay out before showing, e.g. data from an API with no positions',
    // history
    'เลิกทำ': 'Undo',
    'ทำซ้ำ': 'Redo',
    'แผนผังห้องสมุด': 'Library map',
    'ทางเข้า': 'Entrance',
    'ชั้นหนังสือ': 'Shelves',
    'มุมอ่าน': 'Reading corner',
    'เคาน์เตอร์ยืมคืน': 'Loans desk',
    // export
    'ส่งออก SVG': 'Export SVG',
    'โหลดกลับ': 'Load back',
    'ภาพที่ส่งออก': 'The exported picture',
    'ขั้นตอนรับสมัคร': 'Admission steps',
    'กรอกใบสมัคร': 'Fill in the form',
    'ชำระค่าสมัคร': 'Pay the fee',
    'สอบคัดเลือก': 'Entrance exam',
    'ประกาศผล': 'Results',
    'ดาวน์โหลดเป็นไฟล์': 'download as a file',
    'เก็บลงฐานข้อมูล แล้วโหลดกลับทีหลัง': 'keep it in the database and load it back later',
    // keyboard
    'ลองด้วยคีย์บอร์ด': 'Try it with the keyboard',
    'คีย์': 'Keys',
    'ลาก': 'drag',
    '15 แถว × 20 คอลัมน์ = 300 โหนด แต่ละแถวต่อกันเป็นสาย': '15 rows × 20 columns = 300 nodes, each row chained',
    '[isValidConnection] รับฟังก์ชัน: bind ครั้งเดียว': '[isValidConnection] takes a function: bind it once',
    '[beforeDelete] รับฟังก์ชัน: bind ครั้งเดียว': '[beforeDelete] takes a function: bind it once',
    'ไม่ใส่ชื่อ: ใช้กับทุกโหนดที่ไม่มี template ของตัวเอง': 'no name: draws every node without a template of its own',
    'แล้วใช้': 'then',
    'ทำอะไร': 'What it does',
    // performance
    'งาน': 'Task',
    'วาดเฉพาะส่วนที่เห็น': 'Draw only what is in view',
    'วาดอยู่': 'Drawn',
    'จาก': 'of',
    'แผนภาพ 300 โหนด': 'A 300-node diagram',
    // Properties tab (types)
    'node คือ object นี้': 'node is this object',
    'โหนดตามที่แอปให้ (ตำแหน่งและการเลือกล่าสุด)': 'the node as the app gave it (with the latest position and selection)',
    'ตำแหน่งใน flow รวมกรอบแม่แล้ว': 'position in the flow, parents added',
    'ขนาดที่วัดได้ (0 จนกว่าจะวัด)': 'measured size (0 until measured)',
    'และ wtFlowEdgeLabel': 'and wtFlowEdgeLabel',
    'ใช้กับ': 'for',
    'อยู่เหนือจุดที่ต่อได้ / ไม่ได้ / ยังไม่อยู่เหนือจุดไหน': 'over a handle that may take it / may not / over none yet',
    'นับจากกรอบแม่ถ้ามี parentId': 'from the parent’s corner when parentId is set',
    'โหนดในตัวแสดง data.label': 'the built-in nodes show data.label',
    'ชื่อ template ของแอป': 'the name of an app template',
    'ชื่อ template': 'a template name',
    'กำหนดขนาดเอง (resizer เขียนค่านี้)': 'a fixed size (the resizer writes it)',
    'ขนาดที่ใช้ก่อนวัดได้': 'size to assume until measured',
    'ค่าเฉพาะโหนด ไม่ใส่ = ตามค่าของ flow': 'this node only; leave out to follow the flow',
    'selector ของส่วนที่ใช้ลาก เช่น': 'selector of the part that drags, e.g.',
    'ความกว้างของเส้นที่รับคลิก (20)': 'width of the path that takes clicks (20)',
  },
  sections: {
    import: {
      title: 'Import',
      text: {
        th: 'NgModule ใช้ <code>WtFlowModule</code> (ได้ทุกส่วนของ flow รวม <code>wtTemplate</code>) ส่วน standalone นำเข้าเฉพาะส่วนที่ใช้: <code>WtFlow</code>, <code>WtFlowHandle</code>, <code>WtFlowNodeTemplate</code>, <code>WtFlowEdgeTemplate</code>, <code>WtFlowEdgeLabelTemplate</code>, <code>WtFlowConnectionLineTemplate</code>, <code>WtFlowBackground</code>, <code>WtFlowControls</code>, <code>WtFlowMinimap</code>, <code>WtFlowPanel</code>, <code>WtFlowNodeToolbar</code>, <code>WtFlowNodeResizer</code>, <code>WtFlowHistory</code> · ชนิดข้อมูล (<code>WtFlowNode</code>, <code>WtFlowEdge</code> …) และ helper (<code>applyNodeChanges</code>, <code>addEdge</code>, <code>layoutFlow</code> …) นำเข้าจาก <code>wiratheme/flow</code> ที่เดียวกัน · เขียนครั้งเดียวใช้ได้ทุกรุ่น และไม่มี dependency ภายนอก',
        en: 'As an NgModule use <code>WtFlowModule</code> (every part of the flow, plus <code>wtTemplate</code>); standalone apps import the parts they use: <code>WtFlow</code>, <code>WtFlowHandle</code>, <code>WtFlowNodeTemplate</code>, <code>WtFlowEdgeTemplate</code>, <code>WtFlowEdgeLabelTemplate</code>, <code>WtFlowConnectionLineTemplate</code>, <code>WtFlowBackground</code>, <code>WtFlowControls</code>, <code>WtFlowMinimap</code>, <code>WtFlowPanel</code>, <code>WtFlowNodeToolbar</code>, <code>WtFlowNodeResizer</code>, <code>WtFlowHistory</code> · the types (<code>WtFlowNode</code>, <code>WtFlowEdge</code> …) and helpers (<code>applyNodeChanges</code>, <code>addEdge</code>, <code>layoutFlow</code> …) come from <code>wiratheme/flow</code> too · written once for every version, with no outside dependencies.',
      },
    },
    basic: {
      title: { th: 'เริ่มต้น', en: 'Quick start' },
      text: {
        th: 'โหนดและเส้นเป็น array ของ object ธรรมดาที่แอปถือไว้: โหนดมี <code>id</code>, <code>position</code> และ <code>data</code> (โหนดในตัวแสดง <code>data.label</code>) ชนิดในตัวคือ <code>input</code> (มีแต่ทางออก) <code>default</code> <code>output</code> (มีแต่ทางเข้า) และ <code>group</code> · <code>[(nodes)]</code> / <code>[(edges)]</code> ได้ array ใหม่กลับมาทุกครั้งที่ผู้ใช้ลาก เชื่อม หรือลบ · <code>[fitView]="true"</code> ซูมให้เห็นทั้งภาพเมื่อวัดขนาดโหนดเสร็จ · ลองลากจากจุดล่างของ “ตรวจเอกสาร” ไปจุดบนของ “ขอเอกสารเพิ่ม” (<code>[autoConnect]="true"</code> เพิ่มเส้นให้เอง ถ้าไม่ใส่ แอปเพิ่มเองใน <code>(connect)</code>) · ส่วนเสริมใส่ไว้ข้างใน: พื้นหลัง ปุ่มซูม และแผนที่ย่อ · ให้ความสูงกับ flow เสมอ (ค่าเริ่มต้นสูงอย่างน้อย 20rem)',
        en: 'Nodes and edges are arrays of plain objects your app holds: a node has an <code>id</code>, a <code>position</code> and <code>data</code> (the built-in nodes show <code>data.label</code>); the built-in types are <code>input</code> (a way out only), <code>default</code>, <code>output</code> (a way in only) and <code>group</code> · <code>[(nodes)]</code> / <code>[(edges)]</code> hand back new arrays whenever people drag, connect or delete · <code>[fitView]="true"</code> zooms to show everything once the nodes are measured · try dragging from the bottom dot of “Check documents” to the top dot of “Ask for more documents” (<code>[autoConnect]="true"</code> adds the edge; without it, the app adds it in <code>(connect)</code>) · add-ons go inside: the background, the zoom buttons and the minimap · always give the flow a height (it is at least 20rem tall by default).',
      },
    },
    nodes: {
      title: { th: 'โหนดของแอปเอง', en: 'Your own nodes' },
      text: {
        th: 'โหนดที่ <code>type</code> ตรงกับ <code>&lt;ng-template wtFlowNode="person" let-node&gt;</code> วาดด้วย template นั้น (<code>node.data</code>, <code>node.selected</code>, <code>node.id</code> …) ใส่ <code>class="wt-flow-node-box"</code> เพื่อได้กรอบแบบโหนดในตัว · <code>&lt;wt-flow-handle&gt;</code> คือจุดที่เส้นมาต่อ: <code>type</code> เป็น source หรือ target และ <code>position</code> เป็น top / right / bottom / left · มีหลายจุดในโหนดเดียวได้: ตั้ง <code>id</code> แล้วอ้างในเส้นด้วย <code>sourceHandle</code> / <code>targetHandle</code> และเลื่อนตามด้านด้วย style (<code>[style.top.%]="30"</code>) · <code>&lt;ng-template wtFlowNode let-node&gt;</code> ที่ไม่ใส่ชื่อใช้กับทุกโหนดที่ไม่มี template ของตัวเอง · จะวาดด้วย component ก็ได้: <code>[nodeTypes]="{ machine: MachineNodeComponent }"</code> แล้วใน component ใช้ <code>inject(WT_FLOW_NODE)</code>',
        en: 'A node whose <code>type</code> matches <code>&lt;ng-template wtFlowNode="person" let-node&gt;</code> is drawn by that template (<code>node.data</code>, <code>node.selected</code>, <code>node.id</code> …); add <code>class="wt-flow-node-box"</code> for the frame the built-in nodes have · a <code>&lt;wt-flow-handle&gt;</code> is where edges attach: its <code>type</code> is source or target and its <code>position</code> top / right / bottom / left · a node may have several: give each an <code>id</code>, name it in the edge as <code>sourceHandle</code> / <code>targetHandle</code>, and move it along its side with a style (<code>[style.top.%]="30"</code>) · <code>&lt;ng-template wtFlowNode let-node&gt;</code> without a name draws every node that has no template of its own · components work too: <code>[nodeTypes]="{ machine: MachineNodeComponent }"</code>, with <code>inject(WT_FLOW_NODE)</code> inside the component.',
      },
    },
    edges: {
      title: { th: 'เส้นเชื่อม', en: 'Edges' },
      text: {
        th: '<code>type</code> ของเส้นมี <code>default</code> (โค้ง bezier) <code>smoothstep</code> (หักมุมมน) <code>step</code> (หักมุมฉาก) <code>straight</code> และ <code>simplebezier</code> · <code>label</code> คือป้ายกลางเส้น <code>markerEnd</code> / <code>markerStart</code> ใส่หัวลูกศร (<code>\'arrow\'</code>, <code>\'arrowclosed\'</code> หรือ <code>{ type, color, width, height }</code>) <code>animated</code> ให้เส้นประวิ่ง (หยุดนิ่งเมื่อผู้ใช้ขอลดการเคลื่อนไหว) <code>style</code> เปลี่ยนสีและความหนา และ <code>pathOptions</code> ปรับความโค้ง มุม และระยะยื่น · <code>&lt;ng-template wtFlowEdgeLabel="removable" let-edge&gt;</code> วาด HTML แทนป้ายของเส้นชนิดนั้น เช่นปุ่มลบในตัวอย่าง ส่วน <code>wtFlowEdge</code> วาดทั้งเส้นเองด้วย <code>&lt;svg:path [attr.d]="edge.path"&gt;</code> · คลิกเส้นเพื่อเลือก แล้วลากวงกลมที่ปลายไปจุดอื่นเพื่อย้ายปลายเส้น (<code>[autoConnect]="true"</code> ย้ายให้เอง หรือจัดการเองใน <code>(reconnect)</code> ด้วย <code>reconnectEdge()</code>)',
        en: 'An edge’s <code>type</code> is <code>default</code> (a bezier curve), <code>smoothstep</code> (rounded corners), <code>step</code> (square corners), <code>straight</code> or <code>simplebezier</code> · <code>label</code> sits in the middle, <code>markerEnd</code> / <code>markerStart</code> add arrowheads (<code>\'arrow\'</code>, <code>\'arrowclosed\'</code> or <code>{ type, color, width, height }</code>), <code>animated</code> runs the dashes (still when people ask for reduced motion), <code>style</code> sets the colour and width, and <code>pathOptions</code> tune the curve, the corners and the offset · <code>&lt;ng-template wtFlowEdgeLabel="removable" let-edge&gt;</code> draws HTML in place of the label of that edge type, like the remove button here, and <code>wtFlowEdge</code> draws the whole edge with <code>&lt;svg:path [attr.d]="edge.path"&gt;</code> · click an edge to select it, then drag the circle at an end to another handle to reconnect it (<code>[autoConnect]="true"</code> moves it for you, or handle <code>(reconnect)</code> with <code>reconnectEdge()</code>).',
      },
    },
    connecting: {
      title: { th: 'การเชื่อม', en: 'Connecting' },
      text: {
        th: 'ลากจากจุดหนึ่งไปอีกจุด หรือคลิกจุดหนึ่งแล้วคลิกอีกจุด (<code>connectOnClick</code>) ปล่อยใกล้จุดในระยะ <code>connectionRadius</code> ก็ติด · <code>connectionMode</code> แบบ <code>strict</code> (ค่าเริ่มต้น) ต่อจากทางออกไปทางเข้าเท่านั้น ส่วน <code>loose</code> ต่อจุดไหนกับจุดไหนก็ได้ · <code>[isValidConnection]</code> คือกติกาของแอป (ตัวอย่าง: ต่อจากครูไปห้องเท่านั้น) และ <code>[connectionLimit]="1"</code> ที่ handle รับได้เส้นเดียว (ห้องละครูประจำชั้นหนึ่งคน) จุดที่ต่อได้เป็นสีเขียว ต่อไม่ได้เป็นสีแดง · <code>connectionLineType</code> คือรูปเส้นตอนลาก · ตัวอย่างนี้เพิ่มเส้นเองใน <code>(connect)</code> ด้วย <code>addEdge()</code> และ <code>(connectEnd)</code> บอกว่าเชื่อมได้หรือไม่',
        en: 'Drag from one handle to another, or click one and then the other (<code>connectOnClick</code>); letting go within <code>connectionRadius</code> of a handle snaps to it · <code>connectionMode</code> <code>strict</code> (the default) connects a way out to a way in only, while <code>loose</code> connects any handle to any other · <code>[isValidConnection]</code> is your app’s rule (here: teacher to class only), and <code>[connectionLimit]="1"</code> on a handle takes one edge (one homeroom teacher per class); a handle that may take the edge turns green, one that may not turns red · <code>connectionLineType</code> is the shape of the line while dragging · this sample adds the edge itself in <code>(connect)</code> with <code>addEdge()</code>, and <code>(connectEnd)</code> tells whether it worked.',
      },
    },
    controlled: {
      title: { th: 'แอปคุมการเปลี่ยนแปลงเอง', en: 'Controlled changes' },
      text: {
        th: '<code>[applyChanges]="false"</code> ให้ flow แค่รายงาน: <code>(nodeChanges)</code> และ <code>(edgeChanges)</code> ส่งรายการเปลี่ยนแปลง (<code>position</code>, <code>select</code>, <code>dimensions</code>, <code>remove</code>, <code>add</code>, <code>replace</code>) แล้วแอปใช้ <code>applyNodeChanges()</code> / <code>applyEdgeChanges()</code> สร้าง array ใหม่เอง จึงแก้ ตัด หรือบันทึกการเปลี่ยนแปลงก่อนได้ · ตัวอย่างนี้ล็อกทุกโหนดไว้บนเส้นเวลา ลากได้แค่ซ้ายขวา · ในโหมดสองทาง <code>(nodeChanges)</code> ก็ยังส่งทุกจังหวะของการลาก ส่วน <code>[(nodes)]</code> ได้ค่าเมื่อลากเสร็จ',
        en: 'With <code>[applyChanges]="false"</code> the flow only reports: <code>(nodeChanges)</code> and <code>(edgeChanges)</code> send lists of changes (<code>position</code>, <code>select</code>, <code>dimensions</code>, <code>remove</code>, <code>add</code>, <code>replace</code>), and the app builds the new arrays with <code>applyNodeChanges()</code> / <code>applyEdgeChanges()</code>, so it can adjust, drop or record a change first · this sample keeps every node on a time line: they move sideways only · in two-way mode <code>(nodeChanges)</code> still streams every step of a drag, while <code>[(nodes)]</code> gets the result when the drag ends.',
      },
    },
    selection: {
      title: { th: 'การเลือกและการลบ', en: 'Selecting and deleting' },
      text: {
        th: 'คลิกเพื่อเลือก Shift / Ctrl / ⌘ + คลิกเพื่อเพิ่มหรือเอาออก Shift + ลากบนพื้นเพื่อตีกรอบ หรือ <code>[selectionOnDrag]="true"</code> ให้ลากบนพื้นตีกรอบเลย (เลื่อนภาพด้วยปุ่มกลางหรือ Space + ลาก) · <code>selectionMode="partial"</code> แค่แตะกรอบก็เลือก · Delete / Backspace ลบที่เลือก (<code>deleteKeyCode</code>) และ Ctrl + A เลือกทั้งหมด · <code>[beforeDelete]</code> ถามก่อนลบ: คืน <code>false</code> เพื่อยกเลิก หรือคืนส่วนที่จะลบ (เป็น Promise ได้ เช่นรอกล่องยืนยัน) ตัวอย่างนี้ห้ามลบงานที่ล็อกไว้ · <code>(selectionChange)</code> และ <code>(delete)</code> บอกผล',
        en: 'Click to select; Shift / Ctrl / ⌘ + click adds or takes away; Shift + drag on the pane draws a box, or <code>[selectionOnDrag]="true"</code> makes a plain drag draw it (pan with the middle button or Space + drag) · <code>selectionMode="partial"</code> selects what the box touches · Delete / Backspace deletes the selection (<code>deleteKeyCode</code>) and Ctrl + A selects everything · <code>[beforeDelete]</code> is asked first: return <code>false</code> to cancel, or the part to delete (a Promise works, e.g. for a confirm dialog); here locked tasks stay · <code>(selectionChange)</code> and <code>(delete)</code> tell what happened.',
      },
    },
    groups: {
      title: { th: 'กลุ่มและโหนดซ้อน', en: 'Groups and sub-flows' },
      text: {
        th: 'โหนด <code>type: \'group\'</code> เป็นกรอบ ส่วนโหนดลูกใส่ <code>parentId</code> แล้ว <code>position</code> จะนับจากมุมของกรอบ (เรียงกรอบไว้ก่อนลูกใน array) · ลากกรอบแล้วลูกตามไปด้วย ลบกรอบแล้วลูกถูกลบด้วย · <code>extent: \'parent\'</code> ลากลูกออกนอกกรอบไม่ได้ และ <code>expandParent: true</code> ลากชนขอบแล้วกรอบขยายตาม (ลองลาก “ชุมนุม”) · เส้นต่อข้ามกลุ่มได้ตามปกติ',
        en: 'A <code>type: \'group\'</code> node is a frame; a child sets <code>parentId</code>, and its <code>position</code> then counts from the frame’s corner (list the frame before its children) · dragging the frame moves its children, deleting it deletes them · <code>extent: \'parent\'</code> keeps a child inside, and <code>expandParent: true</code> grows the frame when the child is dragged against its border (try “Clubs”) · edges cross between groups as usual.',
      },
    },
    toolbar: {
      title: { th: 'แถบปุ่มของโหนดและการปรับขนาด', en: 'Node toolbar and resizer' },
      text: {
        th: '<code>&lt;wt-flow-node-toolbar&gt;</code> ใน template คือแถบปุ่มลอยข้างโหนด แสดงเมื่อเลือกโหนดนั้นโหนดเดียว (หรือตาม <code>[isVisible]</code>) ขนาดคงที่ไม่ว่าจะซูมเท่าไร และกดแล้วไม่เริ่มการลาก · <code>position</code> และ <code>align</code> บอกว่าอยู่ด้านไหน · <code>&lt;wt-flow-node-resizer&gt;</code> ให้ลากมุมหรือขอบเพื่อปรับขนาด (<code>minWidth</code>, <code>minHeight</code>, <code>maxWidth</code>, <code>maxHeight</code>, <code>keepAspectRatio</code>) ขนาดใหม่เขียนลง <code>width</code> / <code>height</code> ของโหนด และ Alt + ลูกศรปรับขนาดโหนดที่โฟกัสอยู่ · ปุ่มในตัวอย่างเรียก <code>updateNodeData()</code> และ <code>deleteElements()</code> ของ flow และ <code>fitViewOptions</code> เว้นที่ขอบไว้ให้แถบปุ่ม · คลิกโน้ตเพื่อดูแถบปุ่ม',
        en: 'A <code>&lt;wt-flow-node-toolbar&gt;</code> in the template is a row of buttons floating beside the node, shown while it is the only one selected (or as <code>[isVisible]</code> says); it keeps its size at any zoom and a press on it never starts a drag · <code>position</code> and <code>align</code> say where it sits · <code>&lt;wt-flow-node-resizer&gt;</code> lets people drag a corner or side to resize (<code>minWidth</code>, <code>minHeight</code>, <code>maxWidth</code>, <code>maxHeight</code>, <code>keepAspectRatio</code>); the new size goes into the node’s <code>width</code> / <code>height</code>, and Alt + arrows resize the focused node · the buttons here call the flow’s <code>updateNodeData()</code> and <code>deleteElements()</code>, and <code>fitViewOptions</code> leaves room at the border for the toolbar · click a note to see its toolbar.',
      },
    },
    contextmenu: {
      title: { th: 'เมนูคลิกขวา', en: 'Right-click menus' },
      text: {
        th: 'คลิกขวาบนเส้น โหนด หรือพื้น แล้ว <code>(edgeContextMenu)</code>, <code>(nodeContextMenu)</code> และ <code>(paneContextMenu)</code> ส่งเหตุการณ์พร้อมสิ่งที่ถูกคลิกมาให้ แอปเตรียมรายการแล้วเปิด <code>&lt;wt-contextMenu&gt;</code> ด้วย <code>menu.show($event.event)</code> (ซึ่งกันเมนูของเบราว์เซอร์ไว้ให้ด้วย) · บนเส้น: ลบ ลากปลายเส้นใหม่ (เลือกเส้นไว้ วงกลมที่ปลายจึงโผล่มาให้ลาก) สลับเส้นประวิ่ง และเปลี่ยนรูปเส้นด้วย <code>updateEdge()</code> · บนโหนด: แก้ชื่อ (<code>updateNodeData()</code>) ทำสำเนา (<code>addNodes()</code>) และลบ (<code>deleteElements()</code>) · บนพื้น: เพิ่มโหนดตรงจุดที่คลิก (<code>screenToFlowPosition()</code>) · คีย์บอร์ด: Tab ไปที่โหนดหรือเส้น แล้วกดปุ่ม Menu หรือ Shift + F10 ได้เมนูเดียวกัน',
        en: 'Right-click an edge, a node or the pane, and <code>(edgeContextMenu)</code>, <code>(nodeContextMenu)</code> and <code>(paneContextMenu)</code> hand over the event with what was clicked; the app fills in the items and opens a <code>&lt;wt-contextMenu&gt;</code> with <code>menu.show($event.event)</code> (which also keeps the browser’s own menu away) · on an edge: delete, reconnect (the edge gets selected, so the circles at its ends appear to drag), toggle the running dashes, and change its shape with <code>updateEdge()</code> · on a node: rename (<code>updateNodeData()</code>), duplicate (<code>addNodes()</code>) and delete (<code>deleteElements()</code>) · on the pane: add a node right where it was clicked (<code>screenToFlowPosition()</code>) · keyboard: Tab to a node or edge and press the Menu key or Shift + F10 for the same menu.',
      },
    },
    viewport: {
      title: { th: 'มุมมอง ซูม และการวางโหนดใหม่', en: 'Viewport, zoom and dropping new nodes' },
      text: {
        th: '<code>[(viewport)]</code> คือ <code>{ x, y, zoom }</code> ของมุมมอง · <code>minZoom</code> / <code>maxZoom</code> จำกัดการซูม <code>translateExtent</code> จำกัดการเลื่อน และ <code>panOnScroll</code> ให้ล้อเมาส์เลื่อนภาพแทนการซูม (Ctrl + ล้อยังซูม) · method ของ flow: <code>fitView()</code>, <code>zoomTo()</code>, <code>zoomIn()</code>, <code>setCenter()</code>, <code>setViewport()</code> (ใส่ <code>{ duration }</code> เพื่อเคลื่อนนุ่ม ๆ) · ลากรายการจากแถบด้านบนมาวางบนแผนภาพ: ตอนวางใช้ <code>screenToFlowPosition()</code> แปลงตำแหน่งบนจอเป็นตำแหน่งใน flow แล้ว <code>addNodes()</code> · บนจอสัมผัสแตะรายการเพื่อวางไว้กลางภาพ · แผนภาพกว้างบนจอแคบ: ลด <code>minZoom</code> (เช่น 0.3) เพื่อให้ fitView ย่อได้พอ',
        en: '<code>[(viewport)]</code> is the view’s <code>{ x, y, zoom }</code> · <code>minZoom</code> / <code>maxZoom</code> limit the zoom, <code>translateExtent</code> limits the panning, and <code>panOnScroll</code> makes the wheel pan instead of zoom (Ctrl + wheel still zooms) · the flow’s methods: <code>fitView()</code>, <code>zoomTo()</code>, <code>zoomIn()</code>, <code>setCenter()</code>, <code>setViewport()</code> (pass <code>{ duration }</code> to glide) · drag an item from the palette above onto the diagram: on the drop, <code>screenToFlowPosition()</code> turns the screen point into a flow point and <code>addNodes()</code> adds it · on a touch screen, tap an item to place it in the middle of the view · for wide diagrams on narrow screens, lower <code>minZoom</code> (say 0.3) so fitView can shrink them enough.',
      },
    },
    layout: {
      title: { th: 'จัดเรียงอัตโนมัติ', en: 'Automatic layout' },
      text: {
        th: '<code>layout()</code> จัดตำแหน่งโหนดใหม่ตามเส้นเชื่อมแล้วซูมให้พอดี: แบบชั้น (ค่าเริ่มต้น เหมาะกับขั้นตอนงาน และลดเส้นตัดกัน) หรือ <code>algorithm: \'tree\'</code> แบบต้นไม้สำหรับผังองค์กร · <code>direction</code> คือ <code>TB</code> (บนลงล่าง) <code>LR</code> <code>BT</code> หรือ <code>RL</code> และทางเข้าออกของโหนดในตัวหันตามให้เอง · <code>nodeSep</code> / <code>rankSep</code> (แบบต้นไม้: <code>levelSep</code>) คือระยะห่าง · จะจัดก่อนแสดงก็ได้ด้วย helper <code>layoutFlow()</code> / <code>layoutTree()</code> (แท็บ TS) เช่นข้อมูลจาก API ที่ยังไม่มีตำแหน่ง',
        en: '<code>layout()</code> places the nodes along their edges and fits the view: in layers (the default, for steps of work, with as few crossings as it can) or <code>algorithm: \'tree\'</code> for org charts · <code>direction</code> is <code>TB</code> (top to bottom), <code>LR</code>, <code>BT</code> or <code>RL</code>, and the built-in nodes turn their ways in and out to match · <code>nodeSep</code> / <code>rankSep</code> (tree: <code>levelSep</code>) set the spacing · to lay out before showing, use the helpers <code>layoutFlow()</code> / <code>layoutTree()</code> (TS tab), e.g. for data from an API with no positions.',
      },
    },
    history: {
      title: { th: 'เลิกทำและทำซ้ำ', en: 'Undo and redo' },
      text: {
        th: 'ใส่ <code>wtFlowHistory</code> ที่ <code>&lt;wt-flow&gt;</code> แล้วทุกการเปลี่ยนแปลงที่จบแล้ว (ลากเสร็จ เชื่อม ลบ ปรับขนาด เรียก method) เป็นหนึ่งขั้น การเลือกและการวัดขนาดไม่นับ · Ctrl / ⌘ + Z เลิกทำ Ctrl / ⌘ + Shift + Z หรือ Ctrl + Y ทำซ้ำ ขณะ flow มีโฟกัส · ปุ่มของแอปเรียก <code>history.undo()</code> / <code>history.redo()</code> คู่กับ <code>[disabled]="!history.canUndo"</code> · <code>historyLimit</code> (ค่าเริ่มต้น 100) และ <code>(historyChange)</code> · <code>&lt;wt-flow-panel&gt;</code> วางปุ่มของแอปไว้บนแผนภาพที่มุมไหนก็ได้',
        en: 'Put <code>wtFlowHistory</code> on <code>&lt;wt-flow&gt;</code> and every finished change (a drag that ended, a connection, a delete, a resize, a method call) becomes a step; selecting and measuring do not count · Ctrl / ⌘ + Z undoes, Ctrl / ⌘ + Shift + Z or Ctrl + Y redoes while the flow has focus · your buttons call <code>history.undo()</code> / <code>history.redo()</code> with <code>[disabled]="!history.canUndo"</code> · <code>historyLimit</code> (100 by default) and <code>(historyChange)</code> · <code>&lt;wt-flow-panel&gt;</code> places your own buttons over the diagram at any corner.',
      },
    },
    export: {
      title: { th: 'ส่งออก SVG และ JSON', en: 'Export to SVG and JSON' },
      text: {
        th: '<code>toSvg()</code> ได้ทั้งแผนภาพเป็น SVG (เส้น หัวลูกศร ป้าย และโหนดเป็นกล่องพร้อมชื่อ ด้วยสีของธีมขณะนั้น) เอาไปแสดง ดาวน์โหลด หรือพิมพ์ได้ · <code>toJSON()</code> ได้ <code>{ nodes, edges, viewport }</code> สำหรับเก็บลงฐานข้อมูล และ <code>fromJSON()</code> โหลดกลับ (รับทั้ง object และข้อความ คืน false ถ้าไม่ใช่แผนภาพ) · helper <code>flowToSvg()</code>, <code>flowToJSON()</code> และ <code>flowFromJSON()</code> ใช้ได้โดยไม่ต้องมี component',
        en: '<code>toSvg()</code> gives the whole diagram as SVG (edges, arrowheads, labels, and each node as a box with its name, in the theme’s colours of the moment) to show, download or print · <code>toJSON()</code> gives <code>{ nodes, edges, viewport }</code> to keep in a database, and <code>fromJSON()</code> loads it back (an object or text; false when it is not a diagram) · the helpers <code>flowToSvg()</code>, <code>flowToJSON()</code> and <code>flowFromJSON()</code> work without the component.',
      },
    },
    keyboard: {
      title: { th: 'คีย์บอร์ด จอสัมผัส และ ARIA', en: 'Keyboard, touch and ARIA' },
      text: {
        th: 'ทั้ง flow เป็น <code>role="application"</code> ที่มีชื่อ (<code>ariaLabel</code>) โหนดและเส้นเป็นจุด Tab ที่มีชื่อจาก <code>data.label</code> (หรือ <code>ariaLabel</code>) และทุกการกระทำประกาศผ่าน aria-live ตามภาษาของแอป เช่น “ย้าย ยื่นคำร้อง ไปที่ 10, 0” · คีย์ทั้งหมดอยู่ในตาราง ลองกับแผนภาพเล็กด้านล่าง · บนจอสัมผัส: แตะเพื่อเลือก กดค้างเพื่อเพิ่มในที่เลือก ลากพื้นเพื่อเลื่อน ใช้สองนิ้วเพื่อซูม และจุดเชื่อมกับปุ่มควบคุมใหญ่ขึ้นให้กดง่าย',
        en: 'The whole flow is a named <code>role="application"</code> (<code>ariaLabel</code>); nodes and edges are Tab stops named after <code>data.label</code> (or <code>ariaLabel</code>), and every action is announced through aria-live in the app’s language, like “Moved Submit a request to 10, 0” · every key is in the table; try them on the small diagram below · on a touch screen: tap to select, press and hold to add to the selection, drag the pane to pan, use two fingers to zoom; handles and control buttons grow to be easy to hit.',
      },
    },
    performance: {
      title: { th: 'แผนภาพใหญ่', en: 'Big diagrams' },
      text: {
        th: '<code>[onlyRenderVisibleElements]="true"</code> วาดเฉพาะโหนดและเส้นที่อยู่ใกล้มุมมอง แล้ววาดเพิ่มเมื่อเลื่อนหรือซูม ตัวอย่างนี้มี 300 โหนด (ลองปิดสวิตช์แล้วดูตัวเลข) · โหนดถูกวัดขนาดครั้งเดียว และการเลื่อนหรือซูมใช้ transform เดียวทั้งภาพ · ใส่ <code>initialWidth</code> / <code>initialHeight</code> ให้โหนดที่ยังไม่เคยวาด เพื่อให้ fitView และการส่งออกรู้ขนาด',
        en: '<code>[onlyRenderVisibleElements]="true"</code> draws only the nodes and edges near the view, and draws more as people pan or zoom; this sample has 300 nodes (turn the switch off and watch the count) · nodes are measured once, and panning or zooming moves the whole picture with one transform · give nodes that have never been drawn <code>initialWidth</code> / <code>initialHeight</code> so fitView and export know their size.',
      },
    },
    migration: {
      title: { th: 'ย้ายมาจาก ngx-vflow', en: 'Coming from ngx-vflow' },
      text: {
        th: 'แนวคิดเหมือนกัน (โหนด เส้น handle และ template ต่อชนิด) ต่างที่ชื่อและรูปข้อมูล ตารางนี้จับคู่ส่วนที่ใช้บ่อย · ข้อมูลเปลี่ยนเล็กน้อย: <code>point</code> เป็น <code>position</code> และข้อความของโหนดย้ายไปอยู่ใน <code>data</code> · ตรวจชื่อกับรุ่นของ ngx-vflow ที่ใช้อยู่ด้วย เพราะบางชื่อต่างกันไปตามรุ่น',
        en: 'The ideas are the same (nodes, edges, handles, a template per type); the names and the data shape differ, and this table pairs the parts used most · the data changes a little: <code>point</code> becomes <code>position</code>, and a node’s text moves into <code>data</code> · check the names against the ngx-vflow version you use, as some differ between versions.',
      },
    },
  },
  code: {
    basic: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  [defaultEdgeOptions]="edgeDefaults"
  ariaLabel="ขั้นตอนอนุมัติคำร้อง"
  style="height: 24rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
  <wt-flow-controls position="bottom-left"></wt-flow-controls>
  <wt-flow-minimap position="bottom-right"></wt-flow-minimap>
</wt-flow>`,
    nodes: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  [minZoom]="0.3"
  ariaLabel="ขั้นตอนการลา"
  style="height: 22rem"
>
  <!-- โหนด type: 'request' -->
  <ng-template wtFlowNode="request" let-node>
    <div class="wt-flow-node-box flow-card">
      <i class="wi wi-calendar" aria-hidden="true"></i>
      <span>
        <strong>{{ node.data.name }}</strong>
        <small>ขอลา {{ node.data.days }} วัน</small>
      </span>
      <wt-flow-handle type="source" position="right"></wt-flow-handle>
    </div>
  </ng-template>

  <!-- โหนดตัดสินใจ: จุดออกสองจุดทางขวา id="yes" และ id="no" -->
  <ng-template wtFlowNode="decision" let-node>
    <div class="wt-flow-node-box flow-card flow-decision">
      <wt-flow-handle type="target" position="left"></wt-flow-handle>
      <i class="wi wi-question-circle" aria-hidden="true"></i>
      <strong>{{ node.data.question }}</strong>
      <wt-flow-handle type="source" position="right" id="yes" [style.top.%]="30"></wt-flow-handle>
      <wt-flow-handle type="source" position="right" id="no" [style.top.%]="70"></wt-flow-handle>
    </div>
  </ng-template>

  <ng-template wtFlowNode="person" let-node>
    <div class="wt-flow-node-box flow-card">
      <wt-flow-handle type="target" position="left"></wt-flow-handle>
      <span class="flow-avatar"><i class="wi wi-user" aria-hidden="true"></i></span>
      <span>
        <strong>{{ node.data.name }}</strong>
        <small>{{ node.data.role }}</small>
      </span>
    </div>
  </ng-template>

  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>`,
    edges: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  ariaLabel="เส้นเชื่อมแต่ละแบบ"
  style="height: 30rem"
>
  <ng-template wtFlowEdgeLabel="removable" let-edge>
    <span class="flow-edge-chip">
      {{ edge.label }}
      <button type="button" class="flow-edge-remove" aria-label="ลบเส้นนี้" (click)="removeEdge(edge.id)">
        <i class="wi wi-times" aria-hidden="true"></i>
      </button>
    </span>
  </ng-template>
  <wt-flow-background variant="lines" [gap]="24"></wt-flow-background>
</wt-flow>`,
    connecting: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  connectionLineType="smoothstep"
  [connectionMode]="connectionMode"
  [isValidConnection]="canConnect"
  (connect)="assign($event)"
  (connectEnd)="connectEnded($event)"
  ariaLabel="ครูประจำชั้น"
  style="height: 22rem"
>
  <ng-template wtFlowNode="teacher" let-node>
    <div class="wt-flow-node-box flow-card">
      <i class="wi wi-chalkboard" aria-hidden="true"></i>
      <strong>{{ node.data.label }}</strong>
      <wt-flow-handle type="source" position="right"></wt-flow-handle>
    </div>
  </ng-template>
  <ng-template wtFlowNode="room" let-node>
    <div class="wt-flow-node-box flow-card">
      <!-- ห้องละหนึ่งคน -->
      <wt-flow-handle type="target" position="left" [connectionLimit]="1"></wt-flow-handle>
      <i class="wi wi-school" aria-hidden="true"></i>
      <strong>{{ node.data.label }}</strong>
    </div>
  </ng-template>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>
<wt-button label="connectionMode: {{ connectionMode }}" severity="secondary" [outlined]="true" (onClick)="toggleMode()"></wt-button>
<span>ล่าสุด: {{ lastConnect }}</span>`,
    controlled: `<wt-flow
  [nodes]="nodes"
  [edges]="edges"
  [applyChanges]="false"
  [fitView]="true"
  [fitViewOptions]="{ maxZoom: 1 }"
  [minZoom]="0.3"
  (nodeChanges)="onNodeChanges($event)"
  (edgeChanges)="onEdgeChanges($event)"
  ariaLabel="ปฏิทินภาคเรียน"
  style="height: 16rem"
>
  <wt-flow-background variant="lines" [gap]="40"></wt-flow-background>
</wt-flow>
<span>การเปลี่ยนแปลงล่าสุด: {{ lastChanges }}</span>`,
    selection: {
      classic: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [selectionOnDrag]="true"
  selectionMode="partial"
  [beforeDelete]="confirmDelete"
  (selectionChange)="selectionChanged($event)"
  (delete)="deleted($event)"
  ariaLabel="เตรียมงานสัมมนา"
  style="height: 22rem"
>
  <!-- ไม่ใส่ชื่อ: ใช้กับทุกโหนดที่ไม่มี template ของตัวเอง -->
  <ng-template wtFlowNode let-node>
    <div class="wt-flow-node-box flow-task">
      <wt-flow-handle type="target" position="top"></wt-flow-handle>
      {{ node.data.label }}
      <i *ngIf="node.data.locked" class="wi wi-lock" aria-label="ล็อกไว้"></i>
      <wt-flow-handle type="source" position="bottom"></wt-flow-handle>
    </div>
  </ng-template>
</wt-flow>
<span>ที่เลือก: {{ selectedLabels }}</span>
<span>{{ message }}</span>`,
      v3: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [selectionOnDrag]="true"
  selectionMode="partial"
  [beforeDelete]="confirmDelete"
  (selectionChange)="selectionChanged($event)"
  (delete)="deleted($event)"
  ariaLabel="เตรียมงานสัมมนา"
  style="height: 22rem"
>
  <!-- ไม่ใส่ชื่อ: ใช้กับทุกโหนดที่ไม่มี template ของตัวเอง -->
  <ng-template wtFlowNode let-node>
    <div class="wt-flow-node-box flow-task">
      <wt-flow-handle type="target" position="top"></wt-flow-handle>
      {{ node.data.label }}
      @if (node.data.locked) {
        <i class="wi wi-lock" aria-label="ล็อกไว้"></i>
      }
      <wt-flow-handle type="source" position="bottom"></wt-flow-handle>
    </div>
  </ng-template>
</wt-flow>
<span>ที่เลือก: {{ selectedLabels }}</span>
<span>{{ message }}</span>`,
    },
    groups: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [minZoom]="0.3"
  ariaLabel="งานของโรงเรียน"
  style="height: 22rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
  <wt-flow-controls position="bottom-left" [showInteractive]="false"></wt-flow-controls>
</wt-flow>`,
    toolbar: `<wt-flow
  #board
  [(nodes)]="nodes"
  [fitView]="true"
  [fitViewOptions]="{ padding: '56px' }"
  ariaLabel="ป้ายประกาศ"
  style="height: 22rem"
>
  <ng-template wtFlowNode="note" let-node>
    <div class="wt-flow-node-box flow-note" [attr.data-tone]="node.data.tone">
      {{ node.data.text }}
      <wt-flow-node-toolbar position="top">
        <button type="button" class="flow-swatch" data-tone="yellow" aria-label="สีเหลือง" (click)="recolor(board, node.id, 'yellow')"></button>
        <button type="button" class="flow-swatch" data-tone="green" aria-label="สีเขียว" (click)="recolor(board, node.id, 'green')"></button>
        <button type="button" class="flow-swatch" data-tone="blue" aria-label="สีฟ้า" (click)="recolor(board, node.id, 'blue')"></button>
        <wt-button icon="wi wi-trash" severity="danger" [text]="true" [rounded]="true" ariaLabel="ลบโน้ต" (onClick)="removeNote(board, node.id)"></wt-button>
      </wt-flow-node-toolbar>
      <wt-flow-node-resizer [minWidth]="140" [minHeight]="72"></wt-flow-node-resizer>
    </div>
  </ng-template>
  <wt-flow-background variant="cross" [gap]="28"></wt-flow-background>
</wt-flow>`,
    contextmenu: {
      classic: `<wt-flow
  #sheet
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  [minZoom]="0.3"
  (edgeContextMenu)="openEdgeMenu($event, sheet, menu)"
  (nodeContextMenu)="openNodeMenu($event, sheet, menu)"
  (paneContextMenu)="openPaneMenu($event, sheet, menu)"
  (keydown)="menuKey($event, sheet, menu)"
  ariaLabel="ขั้นตอนเบิกพัสดุ"
  style="height: 22rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>
<wt-contextMenu #menu [model]="menuItems"></wt-contextMenu>

<!-- แก้ชื่อโหนด -->
<div *ngIf="renaming">
  <input wtInputText [(ngModel)]="newName" aria-label="ชื่อใหม่" (keydown.enter)="saveName(sheet)" />
  <wt-button label="บันทึก" (onClick)="saveName(sheet)"></wt-button>
</div>
<span>ล่าสุด: {{ lastAction }}</span>`,
      v3: `<wt-flow
  #sheet
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  [minZoom]="0.3"
  (edgeContextMenu)="openEdgeMenu($event, sheet, menu)"
  (nodeContextMenu)="openNodeMenu($event, sheet, menu)"
  (paneContextMenu)="openPaneMenu($event, sheet, menu)"
  (keydown)="menuKey($event, sheet, menu)"
  ariaLabel="ขั้นตอนเบิกพัสดุ"
  style="height: 22rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>
<wt-contextMenu #menu [model]="menuItems"></wt-contextMenu>

<!-- แก้ชื่อโหนด -->
@if (renaming) {
  <div>
    <input wtInputText [(ngModel)]="newName" aria-label="ชื่อใหม่" (keydown.enter)="saveName(sheet)" />
    <wt-button label="บันทึก" (onClick)="saveName(sheet)"></wt-button>
  </div>
}
<span>ล่าสุด: {{ lastAction }}</span>`,
    },
    viewport: `<div class="flow-palette">
  <!-- ลากไปวาง หรือแตะเพื่อเพิ่ม -->
  <button type="button" draggable="true" (dragstart)="pick($event, 'input')" (click)="addAtCentre(view, canvas, 'input')">เริ่ม</button>
  <button type="button" draggable="true" (dragstart)="pick($event, 'default')" (click)="addAtCentre(view, canvas, 'default')">ขั้นตอน</button>
  <button type="button" draggable="true" (dragstart)="pick($event, 'output')" (click)="addAtCentre(view, canvas, 'output')">จบ</button>
</div>
<div #canvas>
  <wt-flow
    #view
    [(nodes)]="nodes"
    [(edges)]="edges"
    [(viewport)]="viewport"
    [minZoom]="0.25"
    [maxZoom]="3"
    [panOnScroll]="panOnScroll"
    (dragover)="allowDrop($event)"
    (drop)="drop($event, view)"
    ariaLabel="แบบฟอร์มออนไลน์"
    style="height: 22rem"
  >
    <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
    <wt-flow-minimap position="bottom-right"></wt-flow-minimap>
  </wt-flow>
</div>
<wt-button label="พอดีจอ" icon="wi wi-expand" (onClick)="view.fitView({ duration: 300 })"></wt-button>
<wt-button label="100%" severity="secondary" (onClick)="view.zoomTo(1, { duration: 300 })"></wt-button>
<wt-button label="ไปที่จุดเริ่ม" icon="wi wi-target" severity="secondary" (onClick)="goToStart(view)"></wt-button>
<wt-toggleswitch [(ngModel)]="panOnScroll" inputId="pan-on-scroll"></wt-toggleswitch>
<label for="pan-on-scroll">ล้อเมาส์เลื่อนภาพ</label>
<span>มุมมอง: {{ viewportText() }}</span>`,
    layout: `<wt-flow
  #chart
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [minZoom]="0.3"
  ariaLabel="โครงสร้างโรงเรียน"
  style="height: 26rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>
<wt-button label="บนลงล่าง" icon="wi wi-sitemap" (onClick)="chart.layout({ direction: 'TB' })"></wt-button>
<wt-button label="ซ้ายไปขวา" icon="wi wi-arrow-right" severity="secondary" (onClick)="chart.layout({ direction: 'LR' })"></wt-button>
<wt-button label="แบบต้นไม้" icon="wi wi-tree-view" severity="secondary" (onClick)="chart.layout({ algorithm: 'tree', direction: 'TB' })"></wt-button>`,
    history: `<wt-flow
  wtFlowHistory
  #history="wtFlowHistory"
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [autoConnect]="true"
  ariaLabel="แผนผังห้องสมุด"
  style="height: 22rem"
>
  <wt-flow-panel position="top-right">
    <wt-button icon="wi wi-undo" ariaLabel="เลิกทำ" severity="secondary" [outlined]="true" [disabled]="!history.canUndo" (onClick)="history.undo()"></wt-button>
    <wt-button icon="wi wi-redo" ariaLabel="ทำซ้ำ" severity="secondary" [outlined]="true" [disabled]="!history.canRedo" (onClick)="history.redo()"></wt-button>
  </wt-flow-panel>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>`,
    export: `<wt-flow
  #admission
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [minZoom]="0.3"
  ariaLabel="ขั้นตอนรับสมัคร"
  style="height: 18rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>
<wt-button label="ส่งออก SVG" icon="wi wi-file-image" (onClick)="exportSvg(admission)"></wt-button>
<wt-button label="JSON" icon="wi wi-code" severity="secondary" (onClick)="exportJson(admission)"></wt-button>
<wt-button label="โหลดกลับ" icon="wi wi-upload" severity="secondary" [disabled]="!json" (onClick)="admission.fromJSON(json)"></wt-button>
<img [src]="svgUrl" alt="ภาพที่ส่งออก" />
<pre>{{ json }}</pre>`,
    keyboard: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [fitView]="true"
  [fitViewOptions]="{ maxZoom: 1 }"
  ariaLabel="ลองด้วยคีย์บอร์ด"
  style="height: 16rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
</wt-flow>`,
    performance: `<wt-flow
  [(nodes)]="nodes"
  [(edges)]="edges"
  [onlyRenderVisibleElements]="onlyVisible"
  [defaultViewport]="{ x: 24, y: 24, zoom: 0.8 }"
  [minZoom]="0.2"
  ariaLabel="แผนภาพ 300 โหนด"
  style="height: 24rem"
>
  <wt-flow-background variant="dots" [gap]="20"></wt-flow-background>
  <wt-flow-controls position="bottom-left"></wt-flow-controls>
  <wt-flow-minimap position="bottom-right"></wt-flow-minimap>
</wt-flow>
<wt-toggleswitch [(ngModel)]="onlyVisible" inputId="only-visible"></wt-toggleswitch>
<label for="only-visible">วาดเฉพาะส่วนที่เห็น</label>`,
  },
  ts: {
    basic: `import { WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'submit', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
  { id: 'check', position: { x: 0, y: 100 }, data: { label: 'ตรวจเอกสาร' } },
  { id: 'more', position: { x: 220, y: 100 }, data: { label: 'ขอเอกสารเพิ่ม' } },
  { id: 'approve', position: { x: 0, y: 200 }, data: { label: 'ครูที่ปรึกษาอนุมัติ' } },
  { id: 'notify', type: 'output', position: { x: 0, y: 300 }, data: { label: 'แจ้งผลทางอีเมล' } },
];
edges: WtFlowEdge[] = [
  { id: 'submit-check', source: 'submit', target: 'check' },
  { id: 'check-approve', source: 'check', target: 'approve', label: 'ครบ' },
  { id: 'approve-notify', source: 'approve', target: 'notify', animated: true },
];
// ทุกเส้น (และเส้นที่ผู้ใช้ลากเชื่อมใหม่) มีหัวลูกศร
edgeDefaults: Partial<WtFlowEdge> = { markerEnd: 'arrowclosed' };`,
    nodes: `nodes: WtFlowNode[] = [
  { id: 'request', type: 'request', position: { x: 0, y: 60 }, data: { name: 'อรุณ', days: 4 } },
  { id: 'rule', type: 'decision', position: { x: 240, y: 60 }, data: { question: 'ลาเกิน 3 วัน?' } },
  { id: 'head', type: 'person', position: { x: 500, y: 130 }, data: { name: 'ศิลา', role: 'หัวหน้างาน' } },
  { id: 'hr', type: 'person', position: { x: 500, y: 0 }, data: { name: 'เพชร', role: 'ฝ่ายบุคคล' } },
];
edges: WtFlowEdge[] = [
  { id: 'request-rule', source: 'request', target: 'rule' },
  { id: 'rule-hr', source: 'rule', sourceHandle: 'yes', target: 'hr', label: 'ใช่' },
  { id: 'rule-head', source: 'rule', sourceHandle: 'no', target: 'head', label: 'ไม่' },
];`,
    edges: `nodes: WtFlowNode[] = [
  { id: 's1', type: 'input', position: { x: 0, y: 0 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't1', type: 'output', position: { x: 340, y: 40 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
  { id: 's2', type: 'input', position: { x: 0, y: 80 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't2', type: 'output', position: { x: 340, y: 120 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
  { id: 's3', type: 'input', position: { x: 0, y: 160 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't3', type: 'output', position: { x: 340, y: 200 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
  { id: 's4', type: 'input', position: { x: 0, y: 240 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't4', type: 'output', position: { x: 340, y: 280 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
  { id: 's5', type: 'input', position: { x: 0, y: 320 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't5', type: 'output', position: { x: 340, y: 360 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
  { id: 's6', type: 'input', position: { x: 0, y: 400 }, sourcePosition: 'right', data: { label: 'ต้นทาง' } },
  { id: 't6', type: 'output', position: { x: 340, y: 440 }, targetPosition: 'left', data: { label: 'ปลายทาง' } },
];
edges: WtFlowEdge[] = [
  { id: 'e1', source: 's1', target: 't1', label: 'default' },
  { id: 'e2', source: 's2', target: 't2', type: 'smoothstep', label: 'smoothstep', markerEnd: 'arrowclosed' },
  { id: 'e3', source: 's3', target: 't3', type: 'step', label: 'step', markerStart: 'arrow', markerEnd: 'arrow' },
  { id: 'e4', source: 's4', target: 't4', type: 'straight', label: 'straight · animated', animated: true },
  {
    id: 'e5', source: 's5', target: 't5', type: 'simplebezier', label: 'simplebezier',
    style: { stroke: '#16a34a', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#16a34a' },
  },
  { id: 'e6', source: 's6', target: 't6', type: 'removable', label: 'ลบได้' },
];

// ลบเส้นเมื่อกดปุ่มบนป้าย
removeEdge(id: string): void {
  this.edges = this.edges.filter((e) => e.id !== id);
}`,
    connecting: `import { addEdge, FlowConnection, WtFlowConnectEndEvent, WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 't-mali', type: 'teacher', position: { x: 0, y: 0 }, data: { label: 'ครูมาลี' } },
  { id: 't-arun', type: 'teacher', position: { x: 0, y: 90 }, data: { label: 'ครูอรุณ' } },
  { id: 't-ratri', type: 'teacher', position: { x: 0, y: 180 }, data: { label: 'ครูราตรี' } },
  { id: 'r-11', type: 'room', position: { x: 300, y: 40 }, data: { label: 'ม.1/1' } },
  { id: 'r-12', type: 'room', position: { x: 300, y: 150 }, data: { label: 'ม.1/2' } },
];
edges: WtFlowEdge[] = [{ id: 't-mali-r-11', source: 't-mali', target: 'r-11', type: 'smoothstep' }];
connectionMode: 'strict' | 'loose' = 'strict';
lastConnect = '-';
// [isValidConnection] รับฟังก์ชัน: bind ครั้งเดียว
canConnect = this.isTeacherToRoom.bind(this);

// ต่อจากครูไปห้องเท่านั้น
isTeacherToRoom(connection: FlowConnection): boolean {
  return connection.source.startsWith('t-') && connection.target.startsWith('r-');
}

// ผู้ใช้ลากเชื่อม: เพิ่มเส้นเอง
assign(connection: FlowConnection): void {
  this.edges = addEdge({ ...connection, type: 'smoothstep' }, this.edges);
}

// บอกผลเมื่อปล่อยเมาส์
connectEnded(event: WtFlowConnectEndEvent): void {
  this.lastConnect = event.isValid ? 'เชื่อมแล้ว' : 'เชื่อมไม่ได้';
}

toggleMode(): void {
  this.connectionMode = this.connectionMode === 'strict' ? 'loose' : 'strict';
}`,
    controlled: `import { applyEdgeChanges, applyNodeChanges, FlowEdgeChange, FlowNodeChange, WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'orientation', type: 'input', position: { x: 0, y: 0 }, sourcePosition: 'right', data: { label: 'ปฐมนิเทศ' } },
  { id: 'midterm', position: { x: 220, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'สอบกลางภาค' } },
  { id: 'final', type: 'output', position: { x: 440, y: 0 }, targetPosition: 'left', data: { label: 'สอบปลายภาค' } },
];
edges: WtFlowEdge[] = [
  { id: 'orientation-midterm', source: 'orientation', target: 'midterm' },
  { id: 'midterm-final', source: 'midterm', target: 'final' },
];
lastChanges = '-';

onNodeChanges(changes: FlowNodeChange[]): void {
  // ลากได้แค่ซ้ายขวา: บังคับ y ให้เป็น 0 ก่อนใช้
  const kept = changes.map((c) => (c.type === 'position' && c.position ? { ...c, position: { x: c.position.x, y: 0 } } : c));
  this.nodes = applyNodeChanges(kept, this.nodes);
  this.lastChanges = changes.map((c) => c.type).join(', ');
}

onEdgeChanges(changes: FlowEdgeChange[]): void {
  this.edges = applyEdgeChanges(changes, this.edges);
}`,
    selection: `import { WtFlowDeleteEvent, WtFlowEdge, WtFlowNode, WtFlowSelectionChange } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'hall', position: { x: 0, y: 0 }, data: { label: 'จองหอประชุม', locked: true } },
  { id: 'speaker', position: { x: 200, y: 0 }, data: { label: 'เชิญวิทยากร' } },
  { id: 'banner', position: { x: 0, y: 90 }, data: { label: 'ทำป้าย' } },
  { id: 'announce', position: { x: 200, y: 90 }, data: { label: 'ประชาสัมพันธ์' } },
  { id: 'register', position: { x: 100, y: 180 }, data: { label: 'ลงทะเบียน', locked: true } },
  { id: 'report', position: { x: 100, y: 270 }, data: { label: 'สรุปผล' } },
];
edges: WtFlowEdge[] = [
  { id: 'hall-banner', source: 'hall', target: 'banner' },
  { id: 'speaker-announce', source: 'speaker', target: 'announce' },
  { id: 'banner-register', source: 'banner', target: 'register' },
  { id: 'announce-register', source: 'announce', target: 'register' },
  { id: 'register-report', source: 'register', target: 'report' },
];
selectedLabels = '-';
message = '';
// [beforeDelete] รับฟังก์ชัน: bind ครั้งเดียว
confirmDelete = this.keepLocked.bind(this);

// ห้ามลบงานที่ล็อกไว้
keepLocked(elements: { nodes: WtFlowNode[]; edges: WtFlowEdge[] }): boolean {
  if (elements.nodes.some((n) => n.data.locked)) {
    this.message = 'งานที่ล็อกไว้ลบไม่ได้';
    return false;
  }
  return true;
}

selectionChanged(selection: WtFlowSelectionChange): void {
  this.selectedLabels = selection.nodes.map((n) => n.data.label).join(', ') || '-';
}

deleted(event: WtFlowDeleteEvent): void {
  this.message = 'ลบแล้ว ' + event.nodes.length + ' โหนด ' + event.edges.length + ' เส้น';
}`,
    groups: `nodes: WtFlowNode[] = [
  { id: 'academic', type: 'group', position: { x: 0, y: 0 }, width: 250, height: 210, data: { label: 'ฝ่ายวิชาการ' } },
  { id: 'timetable', parentId: 'academic', extent: 'parent', position: { x: 45, y: 45 }, data: { label: 'จัดตารางสอน' } },
  { id: 'grades', parentId: 'academic', extent: 'parent', position: { x: 45, y: 135 }, data: { label: 'บันทึกผลการเรียน' } },
  { id: 'affairs', type: 'group', position: { x: 320, y: 0 }, width: 250, height: 210, data: { label: 'ฝ่ายกิจการนักเรียน' } },
  { id: 'clubs', parentId: 'affairs', expandParent: true, position: { x: 45, y: 45 }, data: { label: 'ชุมนุม' } },
  { id: 'care', parentId: 'affairs', extent: 'parent', position: { x: 45, y: 135 }, data: { label: 'ดูแลนักเรียน' } },
];
edges: WtFlowEdge[] = [
  { id: 'timetable-grades', source: 'timetable', target: 'grades' },
  { id: 'clubs-care', source: 'clubs', target: 'care' },
  { id: 'grades-care', source: 'grades', target: 'care', type: 'smoothstep', animated: true },
];`,
    toolbar: `import { WtFlow, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'meeting', type: 'note', position: { x: 0, y: 0 }, width: 180, height: 96, data: { text: 'ประชุมผู้ปกครอง 9:00 น.', tone: 'yellow' } },
  { id: 'scores', type: 'note', position: { x: 240, y: 60 }, width: 180, height: 96, data: { text: 'ส่งคะแนนก่อนวันศุกร์', tone: 'green' } },
];

recolor(flow: WtFlow, id: string, tone: string): void {
  flow.updateNodeData(id, { tone });
}

removeNote(flow: WtFlow, id: string): void {
  flow.deleteElements({ nodes: [id] });
}`,
    contextmenu: `import { MenuItem } from 'wiratheme/api';
import { WtContextMenu } from 'wiratheme/contextmenu';
import { WtFlow, WtFlowEdge, WtFlowEdgeEvent, WtFlowNode, WtFlowNodeEvent } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'request', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ขอเบิกพัสดุ' } },
  { id: 'approve', position: { x: 0, y: 120 }, data: { label: 'หัวหน้าอนุมัติ' } },
  { id: 'handout', type: 'output', position: { x: 0, y: 240 }, data: { label: 'จ่ายของ' } },
];
edges: WtFlowEdge[] = [
  { id: 'request-approve', source: 'request', target: 'approve', label: 'ส่งต่อ' },
  { id: 'approve-handout', source: 'approve', target: 'handout', label: 'อนุมัติแล้ว' },
];
menuItems: MenuItem[] = [];
renaming: WtFlowNode | null = null;
newName = '';
lastAction = '-';
added = 0;

// คลิกขวาบนเส้น: เมนูของเส้นนั้น
openEdgeMenu(e: WtFlowEdgeEvent, flow: WtFlow, menu: WtContextMenu): void {
  const edge = e.edge;
  this.menuItems = [
    { label: 'ลบเส้น', icon: 'wi wi-trash', command: () => this.deleteEdge(flow, edge) },
    { label: 'ลากปลายเส้นใหม่', icon: 'wi wi-arrows-alt', command: () => this.reconnect(flow, edge) },
    { label: 'สลับเส้นประวิ่ง', icon: 'wi wi-bolt', command: () => flow.updateEdge(edge.id, { animated: !edge.animated }) },
    {
      label: 'รูปเส้น',
      icon: 'wi wi-directions',
      items: [
        { label: 'โค้ง', command: () => flow.updateEdge(edge.id, { type: 'default' }) },
        { label: 'หักมุมมน', command: () => flow.updateEdge(edge.id, { type: 'smoothstep' }) },
        { label: 'หักมุมฉาก', command: () => flow.updateEdge(edge.id, { type: 'step' }) },
        { label: 'เส้นตรง', command: () => flow.updateEdge(edge.id, { type: 'straight' }) },
      ],
    },
  ];
  menu.show(e.event);
}

openNodeMenu(e: WtFlowNodeEvent, flow: WtFlow, menu: WtContextMenu): void {
  const node = e.node;
  this.menuItems = [
    { label: 'แก้ชื่อ', icon: 'wi wi-pencil', command: () => this.startRename(node) },
    { label: 'ทำสำเนา', icon: 'wi wi-clone', command: () => this.duplicate(flow, node) },
    { label: 'ลบโหนด', icon: 'wi wi-trash', command: () => flow.deleteElements({ nodes: [node.id] }) },
  ];
  menu.show(e.event);
}

// คลิกขวาบนพื้น: จำจุดที่คลิกไว้เป็นตำแหน่งใน flow
openPaneMenu(e: MouseEvent | KeyboardEvent, flow: WtFlow, menu: WtContextMenu): void {
  const box = (e.target as Element).getBoundingClientRect();
  const point = e instanceof MouseEvent && e.clientX ? { x: e.clientX, y: e.clientY } : { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  const position = flow.screenToFlowPosition(point);
  this.menuItems = [{ label: 'เพิ่มโหนดตรงนี้', icon: 'wi wi-plus', command: () => this.addHere(flow, position) }];
  menu.show(e);
}

// ปุ่ม Menu หรือ Shift + F10 บนโหนด เส้น หรือพื้นที่โฟกัสอยู่: เมนูเดียวกับคลิกขวา
menuKey(e: KeyboardEvent, flow: WtFlow, menu: WtContextMenu): void {
  if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) return;
  const target = e.target as Element;
  const node = flow.getNode(target.closest('.wt-flow-node')?.getAttribute('data-id') || '');
  const edge = flow.getEdge(target.closest('.wt-flow-edge')?.getAttribute('data-id') || '');
  if (node) this.openNodeMenu({ event: e, node }, flow, menu);
  else if (edge) this.openEdgeMenu({ event: e, edge }, flow, menu);
  else this.openPaneMenu(e, flow, menu);
}

deleteEdge(flow: WtFlow, edge: WtFlowEdge): void {
  flow.deleteElements({ edges: [edge.id] });
  this.lastAction = 'ลบเส้น';
}

// เลือกเส้นไว้ วงกลมที่ปลายจึงโผล่มาให้ลากไปจุดใหม่
reconnect(flow: WtFlow, edge: WtFlowEdge): void {
  flow.select({ edges: [edge.id] });
  this.lastAction = 'ลากวงกลมที่ปลายเส้นไปจุดใหม่';
}

duplicate(flow: WtFlow, node: WtFlowNode): void {
  this.added++;
  flow.addNodes({ ...node, id: node.id + '-' + this.added, selected: false, position: { x: node.position.x + 40, y: node.position.y + 40 } });
}

addHere(flow: WtFlow, position: { x: number; y: number }): void {
  this.added++;
  flow.addNodes({ id: 'step-' + this.added, position, data: { label: 'ขั้นตอนใหม่ ' + this.added } });
}

startRename(node: WtFlowNode): void {
  this.renaming = node;
  this.newName = node.data.label;
}

saveName(flow: WtFlow): void {
  if (this.renaming) flow.updateNodeData(this.renaming.id, { label: this.newName });
  this.renaming = null;
}`,
    viewport: `import { FlowViewport, WtFlow, WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'start', type: 'input', position: { x: 0, y: 0 }, data: { label: 'แบบฟอร์มออนไลน์' } },
  { id: 'send', type: 'output', position: { x: 0, y: 120 }, data: { label: 'ส่งเรื่องให้ฝ่ายทะเบียน' } },
];
edges: WtFlowEdge[] = [{ id: 'start-send', source: 'start', target: 'send' }];
viewport: FlowViewport = { x: 0, y: 0, zoom: 1 };
panOnScroll = false;
added = 0;

// ลากจากแถบ: ใส่ชนิดของโหนดไว้ในการลาก
pick(event: DragEvent, type: string): void {
  event.dataTransfer?.setData('application/x-flow-node', type);
}

allowDrop(event: DragEvent): void {
  event.preventDefault();
}

// วางบน flow: แปลงตำแหน่งบนจอเป็นตำแหน่งใน flow
drop(event: DragEvent, flow: WtFlow): void {
  event.preventDefault();
  const type = event.dataTransfer?.getData('application/x-flow-node');
  if (type) this.place(flow, type, flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
}

// แตะรายการ: วางไว้กลางภาพ
addAtCentre(flow: WtFlow, canvas: HTMLElement, type: string): void {
  const box = canvas.getBoundingClientRect();
  this.place(flow, type, flow.screenToFlowPosition({ x: box.left + box.width / 2, y: box.top + box.height / 2 }));
}

place(flow: WtFlow, type: string, position: { x: number; y: number }): void {
  this.added++;
  const label = type === 'input' ? 'เริ่ม' : type === 'output' ? 'จบ' : 'ขั้นตอน';
  flow.addNodes({ id: 'new-' + this.added, type, position, data: { label: label + ' ' + this.added } });
}

goToStart(flow: WtFlow): void {
  flow.setCenter(80, 20, { zoom: 1.5, duration: 400 });
}

viewportText(): string {
  return Math.round(this.viewport.x) + ', ' + Math.round(this.viewport.y) + ' · ' + this.viewport.zoom.toFixed(2);
}`,
    layout: `import { layoutFlow, WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'principal', position: { x: 160, y: 0 }, data: { label: 'ผู้อำนวยการ' } },
  { id: 'academic', position: { x: 0, y: 40 }, data: { label: 'รองฝ่ายวิชาการ' } },
  { id: 'admin', position: { x: 380, y: 90 }, data: { label: 'รองฝ่ายบริหาร' } },
  { id: 'registrar', position: { x: 60, y: 260 }, data: { label: 'งานทะเบียน' } },
  { id: 'curriculum', position: { x: 300, y: 200 }, data: { label: 'งานหลักสูตร' } },
  { id: 'finance', position: { x: 480, y: 260 }, data: { label: 'งานการเงิน' } },
  { id: 'supplies', position: { x: 220, y: 320 }, data: { label: 'งานพัสดุ' } },
];
edges: WtFlowEdge[] = [
  { id: 'p-a', source: 'principal', target: 'academic', type: 'smoothstep' },
  { id: 'p-b', source: 'principal', target: 'admin', type: 'smoothstep' },
  { id: 'a-r', source: 'academic', target: 'registrar', type: 'smoothstep' },
  { id: 'a-c', source: 'academic', target: 'curriculum', type: 'smoothstep' },
  { id: 'b-f', source: 'admin', target: 'finance', type: 'smoothstep' },
  { id: 'b-s', source: 'admin', target: 'supplies', type: 'smoothstep' },
];

// หรือจัดก่อนแสดงด้วย helper เช่นข้อมูลจาก API ที่ยังไม่มีตำแหน่ง
loadChart(nodes: WtFlowNode[], edges: WtFlowEdge[]): void {
  this.nodes = layoutFlow(nodes, edges, { direction: 'LR', nodeSep: 30, rankSep: 70 });
  this.edges = edges;
}`,
    history: `nodes: WtFlowNode[] = [
  { id: 'door', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ทางเข้า' } },
  { id: 'shelves', position: { x: -120, y: 120 }, data: { label: 'ชั้นหนังสือ' } },
  { id: 'reading', position: { x: 120, y: 120 }, data: { label: 'มุมอ่าน' } },
  { id: 'loans', type: 'output', position: { x: 0, y: 240 }, data: { label: 'เคาน์เตอร์ยืมคืน' } },
];
edges: WtFlowEdge[] = [
  { id: 'door-shelves', source: 'door', target: 'shelves' },
  { id: 'door-reading', source: 'door', target: 'reading' },
  { id: 'shelves-loans', source: 'shelves', target: 'loans' },
];`,
    export: `import { WtFlow, WtFlowEdge, WtFlowNode } from 'wiratheme/flow';

nodes: WtFlowNode[] = [
  { id: 'form', type: 'input', position: { x: 0, y: 0 }, sourcePosition: 'right', data: { label: 'กรอกใบสมัคร' } },
  { id: 'fee', position: { x: 210, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'ชำระค่าสมัคร' } },
  { id: 'exam', position: { x: 420, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'สอบคัดเลือก' } },
  { id: 'result', type: 'output', position: { x: 630, y: 0 }, targetPosition: 'left', data: { label: 'ประกาศผล' } },
];
edges: WtFlowEdge[] = [
  { id: 'form-fee', source: 'form', target: 'fee', markerEnd: 'arrowclosed' },
  { id: 'fee-exam', source: 'fee', target: 'exam', markerEnd: 'arrowclosed' },
  { id: 'exam-result', source: 'exam', target: 'result', markerEnd: 'arrowclosed', animated: true },
];
svgUrl = '';
json = '';

exportSvg(flow: WtFlow): void {
  const svg = flow.toSvg({ title: 'ขั้นตอนรับสมัคร' });
  this.svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  // ดาวน์โหลดเป็นไฟล์: new Blob([svg], { type: 'image/svg+xml' }) แล้วใช้ URL.createObjectURL()
}

// เก็บลงฐานข้อมูล แล้วโหลดกลับทีหลัง
exportJson(flow: WtFlow): void {
  this.json = JSON.stringify(flow.toJSON(), null, 2);
}`,
    keyboard: `nodes: WtFlowNode[] = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
  { id: 'b', position: { x: 0, y: 100 }, data: { label: 'ตรวจเอกสาร' } },
  { id: 'c', type: 'output', position: { x: 220, y: 100 }, data: { label: 'แจ้งผลทางอีเมล' } },
];
edges: WtFlowEdge[] = [{ id: 'a-b', source: 'a', target: 'b' }];`,
    performance: `nodes: WtFlowNode[] = [];
edges: WtFlowEdge[] = [];
onlyVisible = true;

constructor() {
  // 15 แถว × 20 คอลัมน์ = 300 โหนด แต่ละแถวต่อกันเป็นสาย
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 20; col++) {
      const id = 'n' + (row * 20 + col);
      this.nodes.push({ id, position: { x: col * 200, y: row * 90 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'งาน ' + (row * 20 + col + 1) } });
      if (col > 0) this.edges.push({ id: 'e' + id, source: 'n' + (row * 20 + col - 1), target: id });
    }
  }
}`,
  },
  css: {
    selection: `.flow-task {
  display: flex;
  min-width: 9rem;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}
.flow-task .wi-lock {
  color: var(--wt-warn-color);
}`,
    nodes: `.flow-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-align: start;
}
.flow-card small {
  display: block;
  color: var(--wt-text-muted);
}
.flow-avatar {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--wt-primary-soft);
  color: var(--wt-primary-soft-text);
}
.flow-decision {
  border-style: dashed;
}`,
    edges: `.flow-edge-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.25rem 0.125rem 0.5rem;
  border: 1px solid var(--wt-border);
  border-radius: 999px;
  background: var(--wt-card-bg);
  font-size: 0.75rem;
}
.flow-edge-remove {
  display: grid;
  place-items: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--wt-danger-bg);
  color: var(--wt-danger-text);
  cursor: pointer;
}`,
    toolbar: `.flow-note {
  display: grid;
  place-items: center;
  font-weight: 600;
}
.flow-note[data-tone='yellow'] { background: var(--wt-warn-bg); color: var(--wt-warn-text); }
.flow-note[data-tone='green'] { background: var(--wt-success-bg); color: var(--wt-success-text); }
.flow-note[data-tone='blue'] { background: var(--wt-info-bg); color: var(--wt-info-text); }
.flow-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--wt-card-bg);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--wt-border);
  cursor: pointer;
}
.flow-swatch[data-tone='yellow'] { background: var(--wt-warn-color); }
.flow-swatch[data-tone='green'] { background: var(--wt-success-color); }
.flow-swatch[data-tone='blue'] { background: var(--wt-info-color); }`,
  },
  api: [
    {
      id: 'api-inputs',
      title: { th: 'Inputs · ข้อมูล', en: 'Inputs · the diagram' },
      rows: [
        row('nodes', 'WtFlowNode[]', undefined, 'โหนดทั้งหมด (สองทาง [(nodes)])', 'Every node (two-way [(nodes)])'),
        row('edges', 'WtFlowEdge[]', undefined, 'เส้นทั้งหมด (สองทาง [(edges)])', 'Every edge (two-way [(edges)])'),
        row('applyChanges', 'boolean', 'true', 'ใช้การเปลี่ยนแปลงเองแล้วส่ง array ใหม่ · false รายงานผ่าน (nodeChanges) / (edgeChanges) อย่างเดียว', 'Apply changes and hand back new arrays · false only reports them through (nodeChanges) / (edgeChanges)'),
        row('nodeTypes', 'Record<string, Type>', undefined, 'component ที่วาดโหนดแต่ละชนิด (template wtFlowNode ชนะ)', 'Components that draw node types (a wtFlowNode template wins)'),
        row('defaultEdgeOptions', 'Partial<WtFlowEdge>', undefined, 'ค่าตั้งต้นของทุกเส้น รวมเส้นที่เชื่อมใหม่ (type, animated, markerEnd …)', 'What every edge starts from, new connections too (type, animated, markerEnd …)'),
      ],
    },
    {
      id: 'api-connecting',
      title: { th: 'Inputs · การเชื่อม', en: 'Inputs · connecting' },
      rows: [
        row('connectionMode', "'strict' | 'loose'", "'strict'", 'strict: ทางออกไปทางเข้าเท่านั้น · loose: จุดไหนก็ได้', 'strict: a way out to a way in only · loose: any handle to any other'),
        row('connectionLineType', 'string', "'default'", 'รูปเส้นตอนลากเชื่อม (ชนิดเดียวกับ type ของเส้น)', 'Shape of the line while connecting (an edge type)'),
        row('connectionLineStyle', 'object', undefined, 'style ของเส้นตอนลาก', 'Style of the line while connecting'),
        row('connectionRadius', 'number', '20', 'ระยะ (px บนจอ) ที่ปล่อยแล้วติดจุดที่ใกล้ที่สุด', 'How close (screen px) a drop must be to snap to a handle'),
        row('isValidConnection', '(connection: FlowConnection) => boolean', undefined, 'กติกาของแอปว่าเชื่อมได้หรือไม่', 'Your rule for which connections are allowed'),
        row('connectOnClick', 'boolean', 'true', 'คลิกจุดหนึ่งแล้วคลิกอีกจุดเพื่อเชื่อม', 'Click a handle, then another, to connect'),
        row('autoConnect', 'boolean', 'false', 'เพิ่มเส้นให้เองเมื่อเชื่อม (และย้ายเส้นเมื่อ reconnect)', 'Add the edge for a new connection (and move it on reconnect) for you'),
        row('reconnectRadius', 'number', '10', 'ขนาดวงกลมที่ปลายเส้นสำหรับลากย้ายปลาย', 'Size of the circles at an edge’s ends that move them'),
      ],
    },
    {
      id: 'api-switches',
      title: { th: 'Inputs · เปิด / ปิด', en: 'Inputs · switches' },
      rows: [
        row('nodesDraggable · nodesConnectable · nodesFocusable', 'boolean', 'true', 'ลาก เชื่อม และโฟกัสโหนดได้ (โหนดแต่ละตัวตั้งทับได้)', 'Nodes may be dragged, connected and focused (each node may override)'),
        row('edgesFocusable · edgesReconnectable · elementsSelectable', 'boolean', 'true', 'โฟกัสเส้น ย้ายปลายเส้น และเลือกได้', 'Edges may be focused and reconnected; elements may be selected'),
        row('selectNodesOnDrag', 'boolean', 'true', 'ลากโหนดที่ยังไม่ถูกเลือกแล้วเลือกให้ด้วย', 'Dragging an unselected node selects it'),
        row('interactive', 'boolean', 'true', 'false ล็อกการลาก เชื่อม และเลือก (ปุ่มล็อกของ controls) สองทาง [(interactive)]', 'false locks dragging, connecting and selecting (the controls’ lock); two-way [(interactive)]'),
        row('elevateNodesOnSelect', 'boolean', 'true', 'ยกโหนดที่เลือกขึ้นบนสุด', 'Raise selected nodes above the rest'),
        row('elevateEdgesOnSelect', 'boolean', 'false', 'ยกเส้นที่เลือกขึ้นบนสุด', 'Raise selected edges above the rest'),
        row('onlyRenderVisibleElements', 'boolean', 'false', 'วาดเฉพาะโหนดและเส้นที่อยู่ใกล้มุมมอง', 'Draw only the nodes and edges near the view'),
      ],
    },
    {
      id: 'api-dragging',
      title: { th: 'Inputs · การลาก', en: 'Inputs · dragging' },
      rows: [
        row('nodeDragThreshold', 'number', '1', 'px ที่ต้องขยับก่อนนับเป็นการลาก', 'Pixels a press must move before it is a drag'),
        row('snapToGrid · snapGrid', 'boolean · [number, number]', 'false · [15, 15]', 'ให้ตำแหน่งติดตาราง', 'Snap positions to a grid'),
        row('nodeExtent', '[[minX, minY], [maxX, maxY]]', undefined, 'ขอบเขตที่ลากโหนดได้ (พิกัดใน flow)', 'Where nodes may be dragged (flow coordinates)'),
        row('autoPanOnNodeDrag · autoPanOnConnect', 'boolean', 'true', 'เลื่อนภาพเองเมื่อลากใกล้ขอบ', 'Pan the view when a drag nears the border'),
        row('autoPanSpeed', 'number', '15', 'ความเร็วสูงสุด (px ต่อเฟรม) ของการเลื่อนเอง', 'Fastest auto-pan, in px per frame'),
        row('alignmentGuides · alignmentThreshold', 'boolean · number', 'false · 6', 'เส้นช่วยจัดแนวและติดขอบ / กึ่งกลางของโหนดอื่นขณะลาก', 'Guide lines and snapping to other nodes’ edges and centres while dragging'),
        row('keyboardStep', 'number', '5', 'ระยะที่ลูกศรย้ายโหนด (Shift = ×10)', 'How far an arrow key moves the selection (Shift = ×10)'),
      ],
    },
    {
      id: 'api-viewport',
      title: { th: 'Inputs · มุมมอง', en: 'Inputs · viewport' },
      rows: [
        row('viewport', 'FlowViewport', undefined, 'มุมมอง { x, y, zoom } (สองทาง [(viewport)])', 'The view { x, y, zoom } (two-way [(viewport)])'),
        row('defaultViewport', 'FlowViewport', undefined, 'มุมมองเริ่มต้นเมื่อไม่ผูก [(viewport)]', 'Starting view when [(viewport)] is not bound'),
        row('fitView · fitViewOptions', 'boolean · WtFlowFitViewOptions', 'false', 'ซูมให้เห็นทั้งภาพเมื่อวัดขนาดเสร็จ', 'Fit everything into view once measured'),
        row('minZoom · maxZoom', 'number', '0.5 · 2', 'ซูมต่ำสุด / สูงสุด', 'Smallest / largest zoom'),
        row('translateExtent', '[[minX, minY], [maxX, maxY]]', undefined, 'ขอบเขตที่เลื่อนภาพได้', 'How far the view may pan'),
        row('panOnDrag', 'boolean | number[]', 'true', 'ลากพื้นเพื่อเลื่อน: true, false หรือปุ่มเมาส์ที่ใช้ ([1, 2])', 'Drag the pane to pan: true, false or the mouse buttons ([1, 2])'),
        row('panOnScroll · panOnScrollSpeed · panOnScrollMode', "boolean · number · 'free' | 'vertical' | 'horizontal'", "false · 0.5 · 'free'", 'ล้อเมาส์เลื่อนภาพแทนการซูม', 'The wheel pans instead of zooming'),
        row('zoomOnScroll · zoomOnPinch · zoomOnDoubleClick', 'boolean', 'true', 'ซูมด้วยล้อ สองนิ้ว และดับเบิลคลิก', 'Zoom with the wheel, a pinch, a double click'),
        row('preventScrolling', 'boolean', 'true', 'ไม่ให้ล้อเมาส์เลื่อนหน้าเว็บขณะอยู่บน flow', 'Keep the wheel from scrolling the page over the flow'),
        row('zoomStep', 'number', '1.2', 'อัตราซูมของปุ่มและคีย์', 'Zoom factor of the buttons and keys'),
      ],
    },
    {
      id: 'api-selection',
      title: { th: 'Inputs · การเลือกและคีย์', en: 'Inputs · selection and keys' },
      rows: [
        row('selectionOnDrag', 'boolean', 'false', 'ลากบนพื้นเพื่อตีกรอบเลือก', 'A drag on the pane draws a selection box'),
        row('selectionMode', "'full' | 'partial'", "'full'", 'ต้องคลุมทั้งโหนด หรือแตะก็พอ', 'The box must cover a node, or just touch it'),
        row('selectionKeyCode', 'string | string[] | null', "'Shift'", 'คีย์ที่กดค้างแล้วลากเพื่อตีกรอบ', 'Key held while dragging to draw a box'),
        row('multiSelectionKeyCode', 'string | string[] | null', "['Shift', 'Control', 'Meta']", 'คีย์ที่กดค้างแล้วคลิกเพื่อเพิ่ม / เอาออก', 'Keys held while clicking to add or take away'),
        row('deleteKeyCode', 'string | string[] | null', "['Backspace', 'Delete']", 'คีย์ลบ (null = ปิด)', 'Keys that delete (null turns it off)'),
        row('panActivationKeyCode', 'string | string[] | null', "'Space'", 'กดค้างเพื่อเลื่อนภาพแม้ selectionOnDrag', 'Held to pan even with selectionOnDrag'),
        row('zoomActivationKeyCode', 'string | string[] | null', "'Meta'", 'กดค้างเพื่อให้ล้อซูม', 'Held so the wheel zooms'),
        row('beforeDelete', '(elements) => boolean | { nodes, edges } | Promise', undefined, 'ถามก่อนลบ: false ยกเลิก หรือคืนส่วนที่จะลบ', 'Asked before deleting: false cancels, or return the part to delete'),
        row('ariaLabel', 'string', 'locale (flowLabel)', 'ชื่อของแผนภาพสำหรับโปรแกรมอ่านหน้าจอ', 'Name of the diagram for screen readers'),
        STYLE_ROW,
      ],
    },
    {
      id: 'api-outputs',
      title: 'Outputs',
      typeLabel: 'Event',
      rows: [
        row('nodesChange · edgesChange · viewportChange · interactiveChange', 'WtFlowNode[] · WtFlowEdge[] · FlowViewport · boolean', undefined, 'สำหรับการผูกสองทาง', 'For the two-way bindings'),
        row('nodeChanges · edgeChanges', 'FlowNodeChange[] · FlowEdgeChange[]', undefined, 'ทุกการเปลี่ยนแปลง (ทุกจังหวะของการลาก)', 'Every change (each step of a drag)'),
        row('selectionChange', '{ nodes, edges }', undefined, 'ที่เลือกเปลี่ยน', 'The selection changed'),
        row('nodeClick · nodeDoubleClick · nodeContextMenu · nodeMouseEnter · nodeMouseLeave', '{ event, node }', undefined, 'เหตุการณ์ของโหนด', 'Node events'),
        row('nodeDragStart · nodeDrag · nodeDragStop', '{ event, node, nodes }', undefined, 'การลากโหนด (nodes = ทุกโหนดที่ย้ายไปด้วย)', 'Node drags (nodes = every node moving with it)'),
        row('edgeClick · edgeDoubleClick · edgeContextMenu · edgeMouseEnter · edgeMouseLeave', '{ event, edge }', undefined, 'เหตุการณ์ของเส้น', 'Edge events'),
        row('paneClick · paneContextMenu', 'MouseEvent', undefined, 'คลิกบนพื้น', 'A click on the pane'),
        row('moveStart · move · moveEnd', '{ event, viewport }', undefined, 'มุมมองเริ่มเปลี่ยน เปลี่ยน และหยุด', 'The view starts moving, moves, stops'),
        row('connect', 'FlowConnection', undefined, 'เชื่อมสำเร็จ: { source, target, sourceHandle, targetHandle }', 'A connection was made: { source, target, sourceHandle, targetHandle }'),
        row('connectStart · connectEnd', '{ event, nodeId, handleId, handleType } · { event, connection, isValid }', undefined, 'เริ่มและจบการลากเชื่อม', 'A connection drag starts and ends'),
        row('reconnect · reconnectStart · reconnectEnd', '{ edge, connection } · { event, edge, handleType } · { event, edge, connection }', undefined, 'ย้ายปลายเส้น', 'An edge end was moved'),
        row('delete', '{ nodes, edges }', undefined, 'ลบแล้ว', 'Elements were deleted'),
        row('init', 'WtFlow', undefined, 'flow พร้อมใช้ ส่งตัว flow (method ทั้งหมด) มาให้', 'The flow is ready; carries the flow itself (all its methods)'),
        row('nodesInitialized', 'WtFlowNode[]', undefined, 'วัดขนาดทุกโหนดครบแล้ว', 'Every node has been measured'),
        row('nodeComponentEvent', '{ node, name, value }', undefined, 'output ของ component ใน nodeTypes', 'An output of a nodeTypes component'),
      ],
    },
    {
      id: 'api-methods',
      title: { th: 'Methods (ผ่าน #ref, @ViewChild หรือ (init))', en: 'Methods (through #ref, @ViewChild or (init))' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('getNodes() · getEdges() · getNode(id) · getEdge(id)', 'WtFlowNode[] · WtFlowEdge[] · …', undefined, 'อ่านข้อมูลล่าสุด', 'Read the latest data'),
        row('setNodes(nodes | fn) · setEdges(edges | fn) · addNodes(n) · addEdges(e)', 'void', undefined, 'แทนที่หรือเพิ่ม (ผ่านการเปลี่ยนแปลงตามปกติ)', 'Replace or add (as ordinary changes)'),
        row('updateNode(id, update, { replace }) · updateNodeData(id, update) · updateEdge(id, update)', 'void', undefined, 'รวมค่าใหม่เข้าไปในโหนด / data / เส้น', 'Merge new values into a node, its data, an edge'),
        row('deleteElements({ nodes, edges })', 'Promise<{ deletedNodes, deletedEdges }>', undefined, 'ลบ (ลูกและเส้นที่ต่ออยู่ถูกลบด้วย ถาม beforeDelete ก่อน)', 'Delete (children and connected edges too; beforeDelete is asked first)'),
        row('select({ nodes, edges }) · selectAll() · clearSelection()', 'void', undefined, 'เลือกจากโค้ด', 'Select from code'),
        row('getIntersectingNodes(target, partially) · isNodeIntersecting(target, area, partially)', 'WtFlowNode[] · boolean', undefined, 'โหนดที่ซ้อนทับ', 'Overlapping nodes'),
        row('getViewport() · getZoom() · setViewport(viewport, { duration })', 'FlowViewport · number · Promise<boolean>', undefined, 'อ่านและตั้งมุมมอง', 'Read and set the view'),
        row('zoomIn() · zoomOut() · zoomTo(zoom, { duration })', 'Promise<boolean>', undefined, 'ซูม', 'Zoom'),
        row('fitView({ padding, nodes, minZoom, maxZoom, duration })', 'Promise<boolean>', undefined, 'ซูมให้เห็นทุกโหนด (หรือเฉพาะ nodes)', 'Fit every node (or just nodes) into view'),
        row('fitBounds(rect, options) · setCenter(x, y, { zoom, duration }) · panBy({ x, y })', 'Promise<boolean> · boolean', undefined, 'ย้ายมุมมองไปที่กรอบหรือจุด', 'Move the view to a box or a point'),
        row('screenToFlowPosition({ x, y }, { snapToGrid }) · flowToScreenPosition({ x, y })', 'FlowXY', undefined, 'แปลงพิกัดบนจอ ↔ ใน flow', 'Screen ↔ flow coordinates'),
        row('layout({ direction, algorithm, nodeSep, rankSep, fitView, duration })', 'Promise<boolean>', undefined, 'จัดเรียงอัตโนมัติ', 'Automatic layout'),
        row('toJSON() · toObject() · fromJSON(json)', 'FlowJSON · boolean', undefined, 'บันทึกและโหลดทั้งแผนภาพ', 'Save and load the whole diagram'),
        row('toSvg({ title, background, padding, … })', 'string', undefined, 'แผนภาพเป็น SVG', 'The diagram as SVG'),
        row('setInteractive(on) · updateNodeInternals(ids)', 'void', undefined, 'ล็อก / ปลดล็อก · วัดจุดเชื่อมใหม่หลัง template เปลี่ยน', 'Lock / unlock · re-measure handles after a template changed'),
      ],
    },
    {
      id: 'api-templates',
      title: 'Templates',
      rows: [
        row('<ng-template wtFlowNode="type" let-node>', 'WtFlowNodeContext', undefined, 'วาดโหนดชนิดนั้น (ไม่ใส่ชื่อ = ทุกโหนดที่ไม่มี template)', 'Draws nodes of that type (no name = every node without one)'),
        row('<ng-template wtFlowEdge="type" let-edge>', 'WtFlowEdgeContext', undefined, 'วาดเส้นชนิดนั้นเอง (ใช้ svg:path)', 'Draws edges of that type yourself (with svg:path)'),
        row('<ng-template wtFlowEdgeLabel="type" let-edge>', 'WtFlowEdgeContext', undefined, 'HTML แทนป้ายของเส้น', 'HTML in place of an edge label'),
        row('<ng-template wtFlowConnectionLine let-line>', 'WtFlowConnectionLineContext', undefined, 'เส้นที่วาดตอนลากเชื่อม', 'The line drawn while connecting'),
        row('WT_FLOW_NODE', 'InjectionToken<WtFlowNodeContext>', undefined, 'context ของโหนด สำหรับ inject() ใน component ของ nodeTypes', 'The node’s context, for inject() in a nodeTypes component'),
      ],
      code: NODE_CONTEXT,
    },
    {
      id: 'api-handle',
      title: 'wt-flow-handle',
      rows: [
        row('type', "'source' | 'target'", "'source'", 'ทางออก (เส้นเริ่มที่นี่) หรือทางเข้า', 'A way out (edges start here) or a way in'),
        row('position', "'top' | 'right' | 'bottom' | 'left'", 'target: top · source: bottom', 'ด้านของโหนด', 'Side of the node'),
        row('id · handleId', 'string', undefined, 'ชื่อของจุดในโหนด (sourceHandle / targetHandle ของเส้น)', 'The handle’s name within its node (an edge’s sourceHandle / targetHandle)'),
        row('isConnectable · isConnectableStart · isConnectableEnd', 'boolean', 'true', 'เชื่อมได้ เริ่มลากได้ จบลงได้', 'May connect, start a drag, end one'),
        row('connectionLimit', 'number', undefined, 'จำนวนเส้นสูงสุดที่รับได้', 'Most edges it takes'),
        row('styleClass', 'string', undefined, 'class เพิ่ม', 'Extra class'),
      ],
    },
    {
      id: 'api-background',
      title: 'wt-flow-background',
      rows: [
        row('variant', "'dots' | 'lines' | 'cross' | 'image'", "'dots'", 'ลายพื้น (ซ้อนหลายชั้นได้)', 'The pattern (stack several)'),
        row('gap · size · lineWidth · offset', 'number | [x, y]', '20 · 1 / 6 · 1 · 0', 'ระยะ ขนาดจุด ความหนาเส้น และการเลื่อนลาย (หน่วยใน flow)', 'Spacing, dot size, line width and shift (flow units)'),
        row('color · bgColor', 'string', 'token', 'สีของลายและสีพื้น', 'Pattern and background colours'),
        row('src · imageX · imageY · imageWidth · imageHeight · imageOpacity', 'string · number', undefined, 'variant="image": รูปใต้แผนภาพ เช่นแผนผังอาคาร', 'variant="image": a picture under the diagram, such as a floor plan'),
      ],
    },
    {
      id: 'api-controls',
      title: 'wt-flow-controls',
      rows: [
        row('position', 'WtFlowPanelPosition', "'bottom-left'", 'มุมที่วาง', 'The corner it sits in'),
        row('orientation', "'vertical' | 'horizontal'", "'vertical'", 'เรียงปุ่ม', 'Button direction'),
        row('showZoom · showFitView · showInteractive', 'boolean', 'true', 'ปุ่มซูม พอดีจอ และล็อก', 'Zoom, fit and lock buttons'),
        row('fitViewOptions · duration', 'WtFlowFitViewOptions · number', '200', 'ค่าของปุ่มพอดีจอ และความยาวการเคลื่อน (ms)', 'Fit button options and the animation length (ms)'),
        row('(zoomInClick) · (zoomOutClick) · (fitViewClick) · (interactiveChange)', 'void · boolean', undefined, 'กดปุ่ม', 'A button was pressed'),
      ],
    },
    {
      id: 'api-minimap',
      title: 'wt-flow-minimap',
      rows: [
        row('position', 'WtFlowPanelPosition', "'bottom-right'", 'มุมที่วาง', 'The corner it sits in'),
        row('width · height', 'number', '200 · 150', 'ขนาดเป็น px (เล็กลงบนจอแคบ)', 'Size in px (smaller on narrow screens)'),
        row('nodeColor · nodeStrokeColor · nodeClassName', 'string | (node) => string', 'token', 'สีหรือ class ของโหนดในแผนที่', 'Colour or class of the nodes on the map'),
        row('nodeBorderRadius · nodeStrokeWidth', 'number', '5', 'มุมโค้งและความหนาเส้นของโหนด', 'Node corner radius and stroke width'),
        row('maskColor · maskStrokeColor · maskStrokeWidth · bgColor', 'string · number', 'token', 'สีส่วนที่อยู่นอกมุมมองและพื้น', 'Colour over what is out of view, and the background'),
        row('pannable · zoomable · inversePan', 'boolean', 'true · true · false', 'ลากหรือคลิกเพื่อย้ายมุมมอง และหมุนล้อเพื่อซูม', 'Drag or click to move the view; wheel to zoom'),
        row('offsetScale', 'number', '5', 'ระยะรอบภาพในแผนที่', 'Room around the drawing'),
      ],
    },
    {
      id: 'api-panel',
      title: 'wt-flow-panel',
      rows: [row('position', "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center-left' | 'center-right'", "'top-left'", 'อะไรก็ได้วางบนแผนภาพ (ไม่เลื่อนหรือซูมตาม)', 'Anything placed over the diagram (it does not pan or zoom)')],
    },
    {
      id: 'api-toolbar',
      title: 'wt-flow-node-toolbar',
      rows: [
        row('isVisible', 'boolean', undefined, 'บังคับแสดง / ซ่อน (ไม่ใส่ = แสดงเมื่อเลือกโหนดนี้โหนดเดียว)', 'Force shown / hidden (leave out: shown while this node is the only one selected)'),
        row('position · align', "'top' | 'right' | 'bottom' | 'left' · 'start' | 'center' | 'end'", "'top' · 'center'", 'ด้านและแนวของแถบปุ่ม', 'Side and alignment'),
        row('offset', 'number', '10', 'ระยะห่างจากโหนด (px)', 'Space from the node (px)'),
        row('nodeId · ariaLabel · styleClass', 'string', undefined, 'โหนดที่เป็นเจ้าของ (ค่าเริ่มต้น: โหนดของ template) ชื่อ และ class', 'The node it belongs to (default: the template’s node), a name, a class'),
      ],
    },
    {
      id: 'api-resizer',
      title: 'wt-flow-node-resizer',
      rows: [
        row('minWidth · minHeight · maxWidth · maxHeight', 'number', '10 · 10', 'ขนาดเล็กสุด / ใหญ่สุด', 'Smallest / largest size'),
        row('keepAspectRatio', 'boolean', 'false', 'รักษาสัดส่วน', 'Keep the aspect ratio'),
        row('isVisible', 'boolean', undefined, 'บังคับแสดง / ซ่อน (ไม่ใส่ = แสดงเมื่อเลือก)', 'Force shown / hidden (leave out: shown while selected)'),
        row('color · handleClass · lineClass · nodeId', 'string', undefined, 'สีและ class ของจุดจับและเส้น', 'Colour and classes of the grips and lines'),
        row('(resizeStart) · (resize) · (resizeEnd)', '{ event, x, y, width, height }', undefined, 'กรอบใหม่ของโหนด', 'The node’s new box'),
      ],
    },
    {
      id: 'api-history',
      title: 'wtFlowHistory',
      rows: [
        row('historyLimit', 'number', '100', 'จำนวนขั้นที่เก็บ', 'Steps kept'),
        row('historyKeyboard', 'boolean', 'true', 'Ctrl / ⌘ + Z, Ctrl / ⌘ + Shift + Z, Ctrl + Y', 'Ctrl / ⌘ + Z, Ctrl / ⌘ + Shift + Z, Ctrl + Y'),
        row('(historyChange)', '{ canUndo, canRedo }', undefined, 'สถานะของปุ่ม', 'What the buttons can do'),
        row('canUndo · canRedo · undo() · redo() · clear()', 'boolean · boolean · boolean · boolean · void', undefined, 'ผ่าน #history="wtFlowHistory"', 'Through #history="wtFlowHistory"'),
      ],
    },
    {
      id: 'api-helpers',
      title: { th: 'Helpers (ไม่ต้องมี component)', en: 'Helpers (no component needed)' },
      typeLabel: { th: 'คืนค่า', en: 'Returns' },
      rows: [
        row('applyNodeChanges(changes, nodes) · applyEdgeChanges(changes, edges)', 'array ใหม่', undefined, 'ใช้การเปลี่ยนแปลง (โหมดคุมเอง)', 'Apply changes (controlled mode)'),
        row('addEdge(edgeOrConnection, edges, defaults)', 'WtFlowEdge[]', undefined, 'เพิ่มเส้น (ไม่ซ้ำ ตั้ง id ให้)', 'Add an edge (no duplicates; gives it an id)'),
        row('reconnectEdge(oldEdge, connection, edges) · updateEdge', 'WtFlowEdge[]', undefined, 'ย้ายปลายเส้น', 'Move an edge’s ends'),
        row('getIncomers(node, nodes, edges) · getOutgoers(…) · getConnectedEdges(nodes, edges)', 'array', undefined, 'โหนดก่อนหน้า / ถัดไป และเส้นที่ต่ออยู่', 'Nodes before / after, and connected edges'),
        row('getNodesBounds(nodes) · getNodesInside(nodes, rect) · getIntersectingNodes(target, nodes)', 'FlowRect · array', undefined, 'กรอบรวมและโหนดในพื้นที่', 'Bounding box and nodes in an area'),
        row('getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding)', 'FlowViewport', undefined, 'มุมมองที่ทำให้กรอบพอดี', 'The view that fits a box'),
        row('getBezierPath · getSmoothStepPath · getStepPath · getStraightPath · getSimpleBezierPath · getEdgePath(type, p)', '[path, labelX, labelY, offsetX, offsetY]', undefined, 'เส้นทาง SVG ของเส้นแต่ละแบบ (สำหรับ wtFlowEdge)', 'SVG paths of each edge shape (for wtFlowEdge)'),
        row('getEdgeCenter(sourceX, sourceY, targetX, targetY)', '[x, y, offsetX, offsetY]', undefined, 'จุดกึ่งกลางของเส้น', 'The middle of an edge'),
        row('layoutFlow(nodes, edges, options) · layoutTree(nodes, edges, options)', 'WtFlowNode[]', undefined, 'จัดเรียงแบบชั้น / แบบต้นไม้', 'Layered / tree layout'),
        row('flowToJSON(nodes, edges, viewport) · flowFromJSON(json) · flowToSvg(nodes, edges, options)', 'FlowJSON · FlowJSON | null · string', undefined, 'บันทึก โหลด และส่งออก', 'Save, load and export'),
        row('new FlowHistory({ limit }) · flowHistoryKey(event)', "FlowHistory · 'undo' | 'redo' | null", undefined, 'ประวัติสำหรับแอปที่ทำปุ่มเอง', 'History for apps with their own buttons'),
        row('isNode(v) · isEdge(v)', 'boolean', undefined, 'ตรวจชนิดข้อมูล', 'Type checks'),
      ],
    },
    {
      id: 'api-types',
      title: { th: 'ชนิดข้อมูล', en: 'Types' },
      code: DATA_TYPES,
    },
  ],
  tokens: [
    tok('--wt-flow-bg', 'พื้นของแผนภาพ', 'Diagram background'),
    tok('--wt-flow-border-width', 'ความหนากรอบ', 'Border width'),
    tok('--wt-flow-border-color', 'สีกรอบ', 'Border colour'),
    tok('--wt-flow-radius', 'มุมโค้งของกรอบ', 'Corner radius'),
    tok('--wt-flow-min-height', 'ความสูงต่ำสุด (20rem)', 'Smallest height (20rem)'),
    tok('--wt-flow-focus-ring', 'วงโฟกัสของแผนภาพ', 'Focus ring of the diagram'),
    tok('--wt-flow-grid-dot-color', 'สีจุดของพื้น', 'Background dot colour'),
    tok('--wt-flow-grid-line-color', 'สีเส้นของพื้น', 'Background line colour'),
    tok('--wt-flow-node-bg', 'พื้นของโหนด', 'Node background'),
    tok('--wt-flow-node-color', 'สีตัวอักษรของโหนด', 'Node text colour'),
    tok('--wt-flow-node-border-color', 'สีขอบโหนด', 'Node border colour'),
    tok('--wt-flow-node-border-width', 'ความหนาขอบโหนด', 'Node border width'),
    tok('--wt-flow-node-radius', 'มุมโค้งของโหนด', 'Node corner radius'),
    tok('--wt-flow-node-shadow', 'เงาของโหนด', 'Node shadow'),
    tok('--wt-flow-node-padding', 'ระยะในโหนด', 'Node padding'),
    tok('--wt-flow-node-width', 'ความกว้างของโหนดในตัว (10rem)', 'Width of the built-in nodes (10rem)'),
    tok('--wt-flow-node-font-size', 'ขนาดตัวอักษรของโหนด', 'Node font size'),
    tok('--wt-flow-node-hover-border-color', 'สีขอบเมื่อชี้', 'Border colour on hover'),
    tok('--wt-flow-node-selected-border-color', 'สีขอบเมื่อเลือก', 'Border colour when selected'),
    tok('--wt-flow-node-selected-ring', 'วงรอบโหนดที่เลือก', 'Ring around a selected node'),
    tok('--wt-flow-node-dragging-shadow', 'เงาขณะลาก', 'Shadow while dragged'),
    tok('--wt-flow-node-focus-outline', 'เส้นโฟกัสของโหนด', 'Node focus outline'),
    tok('--wt-flow-group-bg', 'พื้นของกลุ่ม', 'Group background'),
    tok('--wt-flow-group-border-color', 'สีขอบกลุ่ม', 'Group border colour'),
    tok('--wt-flow-group-label-color', 'สีชื่อกลุ่ม', 'Group label colour'),
    tok('--wt-flow-handle-size', 'ขนาดจุดเชื่อม', 'Handle size'),
    tok('--wt-flow-handle-bg', 'สีจุดเชื่อม', 'Handle colour'),
    tok('--wt-flow-handle-border', 'สีขอบจุดเชื่อม', 'Handle border colour'),
    tok('--wt-flow-handle-border-width', 'ความหนาขอบจุดเชื่อม', 'Handle border width'),
    tok('--wt-flow-handle-hover-bg', 'สีจุดเชื่อมเมื่อชี้', 'Handle colour on hover'),
    tok('--wt-flow-handle-valid-bg', 'สีจุดที่เชื่อมได้ขณะลาก', 'Colour of a handle that may take the connection'),
    tok('--wt-flow-handle-invalid-bg', 'สีจุดที่เชื่อมไม่ได้ขณะลาก', 'Colour of a handle that may not'),
    tok('--wt-flow-handle-hit', 'พื้นที่กดรอบจุดเชื่อม', 'Hit area around a handle'),
    tok('--wt-flow-handle-hit-coarse', 'พื้นที่กดรอบจุดเชื่อมบนจอสัมผัส', 'Hit area around a handle on touch screens'),
    tok('--wt-flow-edge-color', 'สีเส้น', 'Edge colour'),
    tok('--wt-flow-edge-width', 'ความหนาเส้น', 'Edge width'),
    tok('--wt-flow-edge-hover-color', 'สีเส้นเมื่อชี้', 'Edge colour on hover'),
    tok('--wt-flow-edge-selected-color', 'สีเส้นที่เลือก', 'Selected edge colour'),
    tok('--wt-flow-edge-selected-width', 'ความหนาเส้นที่เลือก', 'Selected edge width'),
    tok('--wt-flow-edge-animated-dash', 'ลายเส้นประของเส้น animated', 'Dash pattern of animated edges'),
    tok('--wt-flow-edge-animated-duration', 'ความเร็วของเส้นประวิ่ง', 'Speed of the running dashes'),
    tok('--wt-flow-edge-focus-color', 'สีเส้นที่โฟกัส', 'Focused edge colour'),
    tok('--wt-flow-edge-updater-bg', 'สีวงกลมที่ปลายเส้นสำหรับย้าย', 'Colour of the circles that move an edge’s ends'),
    tok('--wt-flow-edge-label-bg', 'พื้นป้ายเส้น', 'Edge label background'),
    tok('--wt-flow-edge-label-color', 'สีตัวอักษรป้ายเส้น', 'Edge label text colour'),
    tok('--wt-flow-edge-label-border', 'ขอบป้ายเส้น', 'Edge label border'),
    tok('--wt-flow-edge-label-padding', 'ระยะในป้ายเส้น', 'Edge label padding'),
    tok('--wt-flow-edge-label-radius', 'มุมโค้งป้ายเส้น', 'Edge label corner radius'),
    tok('--wt-flow-edge-label-font-size', 'ขนาดตัวอักษรป้ายเส้น', 'Edge label font size'),
    tok('--wt-flow-edge-label-max-width', 'ความกว้างสูงสุดของป้ายเส้น', 'Widest edge label'),
    tok('--wt-flow-connection-color', 'สีเส้นตอนลากเชื่อม', 'Colour of the line while connecting'),
    tok('--wt-flow-connection-width', 'ความหนาเส้นตอนลากเชื่อม', 'Width of the line while connecting'),
    tok('--wt-flow-selection-bg', 'พื้นกรอบเลือก', 'Selection box fill'),
    tok('--wt-flow-selection-border', 'ขอบกรอบเลือก', 'Selection box border'),
    tok('--wt-flow-guide-color', 'สีเส้นช่วยจัดแนว', 'Alignment guide colour'),
    tok('--wt-flow-panel-margin', 'ระยะห่างของ panel, controls และ minimap จากขอบ', 'Space between the border and panels, controls, minimap'),
    tok('--wt-flow-controls-bg', 'พื้นของปุ่มควบคุม', 'Controls background'),
    tok('--wt-flow-controls-color', 'สีไอคอนของปุ่มควบคุม', 'Controls icon colour'),
    tok('--wt-flow-controls-border', 'สีขอบของปุ่มควบคุม', 'Controls border colour'),
    tok('--wt-flow-controls-radius', 'มุมโค้งของปุ่มควบคุม', 'Controls corner radius'),
    tok('--wt-flow-controls-shadow', 'เงาของปุ่มควบคุม', 'Controls shadow'),
    tok('--wt-flow-controls-button-size', 'ขนาดปุ่มควบคุม', 'Control button size'),
    tok('--wt-flow-controls-button-size-coarse', 'ขนาดปุ่มควบคุมบนจอสัมผัส', 'Control button size on touch screens'),
    tok('--wt-flow-controls-hover-bg', 'พื้นปุ่มควบคุมเมื่อชี้', 'Control button background on hover'),
    tok('--wt-flow-controls-disabled-opacity', 'ความจางของปุ่มที่ใช้ไม่ได้', 'Opacity of a disabled button'),
    tok('--wt-flow-minimap-bg', 'พื้นของแผนที่ย่อ', 'Minimap background'),
    tok('--wt-flow-minimap-border', 'สีขอบของแผนที่ย่อ', 'Minimap border colour'),
    tok('--wt-flow-minimap-radius', 'มุมโค้งของแผนที่ย่อ', 'Minimap corner radius'),
    tok('--wt-flow-minimap-shadow', 'เงาของแผนที่ย่อ', 'Minimap shadow'),
    tok('--wt-flow-minimap-node-bg', 'สีโหนดในแผนที่ย่อ', 'Node colour on the minimap'),
    tok('--wt-flow-minimap-node-selected-bg', 'สีโหนดที่เลือกในแผนที่ย่อ', 'Selected node colour on the minimap'),
    tok('--wt-flow-minimap-group-bg', 'สีกลุ่มในแผนที่ย่อ', 'Group colour on the minimap'),
    tok('--wt-flow-minimap-mask', 'สีทับส่วนที่อยู่นอกมุมมอง', 'Colour over what is out of view'),
    tok('--wt-flow-minimap-mask-stroke', 'สีกรอบมุมมองในแผนที่ย่อ', 'Outline of the view on the minimap'),
    tok('--wt-flow-toolbar-bg', 'พื้นของแถบปุ่มของโหนด', 'Node toolbar background'),
    tok('--wt-flow-toolbar-border', 'สีขอบของแถบปุ่ม', 'Node toolbar border colour'),
    tok('--wt-flow-toolbar-radius', 'มุมโค้งของแถบปุ่ม', 'Node toolbar corner radius'),
    tok('--wt-flow-toolbar-shadow', 'เงาของแถบปุ่ม', 'Node toolbar shadow'),
    tok('--wt-flow-toolbar-padding', 'ระยะในแถบปุ่ม', 'Node toolbar padding'),
    tok('--wt-flow-toolbar-gap', 'ระยะระหว่างปุ่ม', 'Space between toolbar buttons'),
    tok('--wt-flow-toolbar-offset', 'ระยะห่างจากโหนด (10px)', 'Space from the node (10px)'),
    tok('--wt-flow-resizer-color', 'สีเส้นและจุดจับของการปรับขนาด', 'Colour of the resizer lines and grips'),
    tok('--wt-flow-resizer-handle-bg', 'พื้นของจุดจับ', 'Grip background'),
    tok('--wt-flow-resizer-handle-size', 'ขนาดจุดจับ', 'Grip size'),
  ],
};
