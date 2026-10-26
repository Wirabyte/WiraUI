import { ElementRef, inject, signal } from '@angular/core';
import { DOCS_FLOW } from '../../core/overlays';
import { Text } from '../../core/i18n';
import { FLOW_DOC } from '../../data/flow';
import { MenuEntry, SimpleDemo } from './demos';

/*
 * State and handlers behind the Flow page. Like the other demo files, no wiratheme import: the same template compiles
 * against v1, v2 and v3, so the helpers (applyNodeChanges, addEdge) come in through DOCS_FLOW and the flow's own
 * types are mirrored here by shape.
 */

type Side = 'top' | 'right' | 'bottom' | 'left';
type DocFlowMarker = 'arrow' | 'arrowclosed' | { type: 'arrow' | 'arrowclosed'; color?: string; width?: number; height?: number; strokeWidth?: number };

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DocFlowNode {
  id: string;
  position: { x: number; y: number };
  data?: any;
  type?: string;
  width?: number;
  height?: number;
  selected?: boolean;
  parentId?: string;
  extent?: 'parent' | [[number, number], [number, number]];
  expandParent?: boolean;
  sourcePosition?: Side;
  targetPosition?: Side;
}

export interface DocFlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: string;
  label?: string;
  animated?: boolean;
  markerStart?: DocFlowMarker;
  markerEnd?: DocFlowMarker;
  style?: Record<string, any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface DocFlowConnection {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}

interface DocFlowViewport {
  x: number;
  y: number;
  zoom: number;
}

/** The flow methods the demos call (a `#ref` to <wt-flow> of any version fits). */
interface DocFlowApi {
  screenToFlowPosition(point: { x: number; y: number }): { x: number; y: number };
  getNode(id: string): DocFlowNode | undefined;
  getEdge(id: string): DocFlowEdge | undefined;
  addNodes(nodes: DocFlowNode): void;
  updateNodeData(id: string, update: Record<string, unknown>): void;
  updateEdge(id: string, update: Partial<DocFlowEdge>): void;
  select(selection: { nodes?: string[]; edges?: string[] }): void;
  deleteElements(elements: { nodes?: string[]; edges?: string[] }): Promise<unknown>;
  setCenter(x: number, y: number, options?: { zoom?: number; duration?: number }): Promise<boolean>;
  toSvg(options?: { title?: string }): string;
  toJSON(): unknown;
}

const BASIC_NODES: DocFlowNode[] = [
  { id: 'submit', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
  { id: 'check', position: { x: 0, y: 100 }, data: { label: 'ตรวจเอกสาร' } },
  { id: 'more', position: { x: 220, y: 100 }, data: { label: 'ขอเอกสารเพิ่ม' } },
  { id: 'approve', position: { x: 0, y: 200 }, data: { label: 'ครูที่ปรึกษาอนุมัติ' } },
  { id: 'notify', type: 'output', position: { x: 0, y: 300 }, data: { label: 'แจ้งผลทางอีเมล' } },
];
const BASIC_EDGES: DocFlowEdge[] = [
  { id: 'submit-check', source: 'submit', target: 'check' },
  { id: 'check-approve', source: 'check', target: 'approve', label: 'ครบ' },
  { id: 'approve-notify', source: 'approve', target: 'notify', animated: true },
];

const LEAVE_NODES: DocFlowNode[] = [
  { id: 'request', type: 'request', position: { x: 0, y: 60 }, data: { name: 'อรุณ', days: 4 } },
  { id: 'rule', type: 'decision', position: { x: 240, y: 60 }, data: { question: 'ลาเกิน 3 วัน?' } },
  { id: 'head', type: 'person', position: { x: 500, y: 130 }, data: { name: 'ศิลา', role: 'หัวหน้างาน' } },
  { id: 'hr', type: 'person', position: { x: 500, y: 0 }, data: { name: 'เพชร', role: 'ฝ่ายบุคคล' } },
];
const LEAVE_EDGES: DocFlowEdge[] = [
  { id: 'request-rule', source: 'request', target: 'rule' },
  { id: 'rule-hr', source: 'rule', sourceHandle: 'yes', target: 'hr', label: 'ใช่' },
  { id: 'rule-head', source: 'rule', sourceHandle: 'no', target: 'head', label: 'ไม่' },
];

const SHAPE_NODES: DocFlowNode[] = [1, 2, 3, 4, 5, 6].flatMap((i) => [
  { id: 's' + i, type: 'input', position: { x: 0, y: (i - 1) * 80 }, sourcePosition: 'right' as Side, data: { label: 'ต้นทาง' } },
  { id: 't' + i, type: 'output', position: { x: 340, y: (i - 1) * 80 + 40 }, targetPosition: 'left' as Side, data: { label: 'ปลายทาง' } },
]);
const SHAPE_EDGES: DocFlowEdge[] = [
  { id: 'e1', source: 's1', target: 't1', label: 'default' },
  { id: 'e2', source: 's2', target: 't2', type: 'smoothstep', label: 'smoothstep', markerEnd: 'arrowclosed' },
  { id: 'e3', source: 's3', target: 't3', type: 'step', label: 'step', markerStart: 'arrow', markerEnd: 'arrow' },
  { id: 'e4', source: 's4', target: 't4', type: 'straight', label: 'straight · animated', animated: true },
  {
    id: 'e5',
    source: 's5',
    target: 't5',
    type: 'simplebezier',
    label: 'simplebezier',
    style: { stroke: '#16a34a', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#16a34a' },
  },
  { id: 'e6', source: 's6', target: 't6', type: 'removable', label: 'ลบได้' },
];

const ASSIGN_NODES: DocFlowNode[] = [
  { id: 't-mali', type: 'teacher', position: { x: 0, y: 0 }, data: { label: 'ครูมาลี' } },
  { id: 't-arun', type: 'teacher', position: { x: 0, y: 90 }, data: { label: 'ครูอรุณ' } },
  { id: 't-ratri', type: 'teacher', position: { x: 0, y: 180 }, data: { label: 'ครูราตรี' } },
  { id: 'r-11', type: 'room', position: { x: 300, y: 40 }, data: { label: 'ม.1/1' } },
  { id: 'r-12', type: 'room', position: { x: 300, y: 150 }, data: { label: 'ม.1/2' } },
];
const ASSIGN_EDGES: DocFlowEdge[] = [{ id: 't-mali-r-11', source: 't-mali', target: 'r-11', type: 'smoothstep' }];

const TERM_NODES: DocFlowNode[] = [
  { id: 'orientation', type: 'input', position: { x: 0, y: 0 }, sourcePosition: 'right', data: { label: 'ปฐมนิเทศ' } },
  { id: 'midterm', position: { x: 220, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'สอบกลางภาค' } },
  { id: 'final', type: 'output', position: { x: 440, y: 0 }, targetPosition: 'left', data: { label: 'สอบปลายภาค' } },
];
const TERM_EDGES: DocFlowEdge[] = [
  { id: 'orientation-midterm', source: 'orientation', target: 'midterm' },
  { id: 'midterm-final', source: 'midterm', target: 'final' },
];

const TASK_NODES: DocFlowNode[] = [
  { id: 'hall', position: { x: 0, y: 0 }, data: { label: 'จองหอประชุม', locked: true } },
  { id: 'speaker', position: { x: 200, y: 0 }, data: { label: 'เชิญวิทยากร' } },
  { id: 'banner', position: { x: 0, y: 90 }, data: { label: 'ทำป้าย' } },
  { id: 'announce', position: { x: 200, y: 90 }, data: { label: 'ประชาสัมพันธ์' } },
  { id: 'register', position: { x: 100, y: 180 }, data: { label: 'ลงทะเบียน', locked: true } },
  { id: 'report', position: { x: 100, y: 270 }, data: { label: 'สรุปผล' } },
];
const TASK_EDGES: DocFlowEdge[] = [
  { id: 'hall-banner', source: 'hall', target: 'banner' },
  { id: 'speaker-announce', source: 'speaker', target: 'announce' },
  { id: 'banner-register', source: 'banner', target: 'register' },
  { id: 'announce-register', source: 'announce', target: 'register' },
  { id: 'register-report', source: 'register', target: 'report' },
];

const GROUP_NODES: DocFlowNode[] = [
  { id: 'academic', type: 'group', position: { x: 0, y: 0 }, width: 250, height: 210, data: { label: 'ฝ่ายวิชาการ' } },
  { id: 'timetable', parentId: 'academic', extent: 'parent', position: { x: 45, y: 45 }, data: { label: 'จัดตารางสอน' } },
  { id: 'grades', parentId: 'academic', extent: 'parent', position: { x: 45, y: 135 }, data: { label: 'บันทึกผลการเรียน' } },
  { id: 'affairs', type: 'group', position: { x: 320, y: 0 }, width: 250, height: 210, data: { label: 'ฝ่ายกิจการนักเรียน' } },
  { id: 'clubs', parentId: 'affairs', expandParent: true, position: { x: 45, y: 45 }, data: { label: 'ชุมนุม' } },
  { id: 'care', parentId: 'affairs', extent: 'parent', position: { x: 45, y: 135 }, data: { label: 'ดูแลนักเรียน' } },
];
const GROUP_EDGES: DocFlowEdge[] = [
  { id: 'timetable-grades', source: 'timetable', target: 'grades' },
  { id: 'clubs-care', source: 'clubs', target: 'care' },
  { id: 'grades-care', source: 'grades', target: 'care', type: 'smoothstep', animated: true },
];

const NOTE_NODES: DocFlowNode[] = [
  { id: 'meeting', type: 'note', position: { x: 0, y: 0 }, width: 180, height: 96, data: { text: 'ประชุมผู้ปกครอง 9:00 น.', tone: 'yellow' } },
  { id: 'scores', type: 'note', position: { x: 240, y: 60 }, width: 180, height: 96, data: { text: 'ส่งคะแนนก่อนวันศุกร์', tone: 'green' } },
];

/** A #ref to <wt-contextMenu> of any version. */
interface DocMenu {
  show(event?: Event): void;
}

const MENU_NODES: DocFlowNode[] = [
  { id: 'request', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ขอเบิกพัสดุ' } },
  { id: 'approve', position: { x: 0, y: 120 }, data: { label: 'หัวหน้าอนุมัติ' } },
  { id: 'handout', type: 'output', position: { x: 0, y: 240 }, data: { label: 'จ่ายของ' } },
];
const MENU_EDGES: DocFlowEdge[] = [
  { id: 'request-approve', source: 'request', target: 'approve', label: 'ส่งต่อ' },
  { id: 'approve-handout', source: 'approve', target: 'handout', label: 'อนุมัติแล้ว' },
];

const VIEW_NODES: DocFlowNode[] = [
  { id: 'start', type: 'input', position: { x: 0, y: 0 }, data: { label: 'แบบฟอร์มออนไลน์' } },
  { id: 'send', type: 'output', position: { x: 0, y: 120 }, data: { label: 'ส่งเรื่องให้ฝ่ายทะเบียน' } },
];
const VIEW_EDGES: DocFlowEdge[] = [{ id: 'start-send', source: 'start', target: 'send' }];

const CHART_NODES: DocFlowNode[] = [
  { id: 'principal', position: { x: 160, y: 0 }, data: { label: 'ผู้อำนวยการ' } },
  { id: 'academic', position: { x: 0, y: 40 }, data: { label: 'รองฝ่ายวิชาการ' } },
  { id: 'admin', position: { x: 380, y: 90 }, data: { label: 'รองฝ่ายบริหาร' } },
  { id: 'registrar', position: { x: 60, y: 260 }, data: { label: 'งานทะเบียน' } },
  { id: 'curriculum', position: { x: 300, y: 200 }, data: { label: 'งานหลักสูตร' } },
  { id: 'finance', position: { x: 480, y: 260 }, data: { label: 'งานการเงิน' } },
  { id: 'supplies', position: { x: 220, y: 320 }, data: { label: 'งานพัสดุ' } },
];
const CHART_EDGES: DocFlowEdge[] = [
  { id: 'p-a', source: 'principal', target: 'academic', type: 'smoothstep' },
  { id: 'p-b', source: 'principal', target: 'admin', type: 'smoothstep' },
  { id: 'a-r', source: 'academic', target: 'registrar', type: 'smoothstep' },
  { id: 'a-c', source: 'academic', target: 'curriculum', type: 'smoothstep' },
  { id: 'b-f', source: 'admin', target: 'finance', type: 'smoothstep' },
  { id: 'b-s', source: 'admin', target: 'supplies', type: 'smoothstep' },
];

const LIBRARY_NODES: DocFlowNode[] = [
  { id: 'door', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ทางเข้า' } },
  { id: 'shelves', position: { x: -120, y: 120 }, data: { label: 'ชั้นหนังสือ' } },
  { id: 'reading', position: { x: 120, y: 120 }, data: { label: 'มุมอ่าน' } },
  { id: 'loans', type: 'output', position: { x: 0, y: 240 }, data: { label: 'เคาน์เตอร์ยืมคืน' } },
];
const LIBRARY_EDGES: DocFlowEdge[] = [
  { id: 'door-shelves', source: 'door', target: 'shelves' },
  { id: 'door-reading', source: 'door', target: 'reading' },
  { id: 'shelves-loans', source: 'shelves', target: 'loans' },
];

const ADMIT_NODES: DocFlowNode[] = [
  { id: 'form', type: 'input', position: { x: 0, y: 0 }, sourcePosition: 'right', data: { label: 'กรอกใบสมัคร' } },
  { id: 'fee', position: { x: 210, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'ชำระค่าสมัคร' } },
  { id: 'exam', position: { x: 420, y: 0 }, sourcePosition: 'right', targetPosition: 'left', data: { label: 'สอบคัดเลือก' } },
  { id: 'result', type: 'output', position: { x: 630, y: 0 }, targetPosition: 'left', data: { label: 'ประกาศผล' } },
];
const ADMIT_EDGES: DocFlowEdge[] = [
  { id: 'form-fee', source: 'form', target: 'fee', markerEnd: 'arrowclosed' },
  { id: 'fee-exam', source: 'fee', target: 'exam', markerEnd: 'arrowclosed' },
  { id: 'exam-result', source: 'exam', target: 'result', markerEnd: 'arrowclosed', animated: true },
];

const KEY_NODES: DocFlowNode[] = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
  { id: 'b', position: { x: 0, y: 100 }, data: { label: 'ตรวจเอกสาร' } },
  { id: 'c', type: 'output', position: { x: 220, y: 100 }, data: { label: 'แจ้งผลทางอีเมล' } },
];
const KEY_EDGES: DocFlowEdge[] = [{ id: 'a-b', source: 'a', target: 'b' }];

/** The keys of a flow, for the table on the page. */
export const FLOW_KEYS: { keys: string; text: Text }[] = [
  { keys: 'Tab · Shift + Tab', text: { th: 'ไปโหนดถัดไป / ก่อนหน้า (โหนดก่อน แล้วจึงเส้น)', en: 'Next / previous node (nodes first, then edges)' } },
  { keys: 'Enter · Space', text: { th: 'เลือกโหนดหรือเส้นที่โฟกัส', en: 'Select the focused node or edge' } },
  { keys: '← ↑ → ↓', text: { th: 'ย้ายที่เลือก (Shift = ×10) · บนพื้นที่ว่าง: เลื่อนภาพ', en: 'Move the selection (Shift = ×10) · on the pane: pan' } },
  { keys: 'Alt + ← ↑ → ↓', text: { th: 'ปรับขนาดโหนดที่มี resizer', en: 'Resize a node that has a resizer' } },
  { keys: 'Delete · Backspace', text: { th: 'ลบที่เลือก', en: 'Delete the selection' } },
  { keys: 'Ctrl / ⌘ + A', text: { th: 'เลือกทั้งหมด', en: 'Select everything' } },
  { keys: 'C → Tab → Enter', text: { th: 'เริ่มเชื่อมจากโหนดที่โฟกัส แล้ว Enter ที่โหนดปลายทาง', en: 'Start a connection from the focused node, then Enter on the target' } },
  { keys: 'Escape', text: { th: 'ยกเลิกการเชื่อม และล้างที่เลือก', en: 'Cancel a connection and clear the selection' } },
  { keys: '+ · −', text: { th: 'ซูมเข้า / ออก', en: 'Zoom in / out' } },
  { keys: 'Ctrl / ⌘ + Z · Ctrl / ⌘ + Shift + Z · Ctrl + Y', text: { th: 'เลิกทำ / ทำซ้ำ (wtFlowHistory)', en: 'Undo / redo (wtFlowHistory)' } },
  { keys: 'Shift + ลาก', text: { th: 'ตีกรอบเลือก', en: 'Draw a selection box' } },
  { keys: 'Space + ลาก', text: { th: 'เลื่อนภาพ (เมื่อ selectionOnDrag)', en: 'Pan (with selectionOnDrag)' } },
];

/** ngx-vflow → wt-flow, for the migration table. */
export const FLOW_MIGRATION: { from: string; to: string; note?: Text }[] = [
  { from: 'VflowModule · Vflow', to: 'WtFlowModule · WtFlow + parts' },
  { from: '<vflow [nodes] [edges]>', to: '<wt-flow [(nodes)] [(edges)]>', note: { th: 'ได้ array ใหม่กลับมาเมื่อผู้ใช้แก้', en: 'new arrays come back when people edit' } },
  { from: "node.point: { x, y }", to: 'node.position: { x, y }' },
  { from: 'node.text', to: 'node.data.label' },
  { from: "type: 'html-template' + <ng-template nodeHtml let-ctx>", to: "type: 'person' + <ng-template wtFlowNode=\"person\" let-node>", note: { th: 'template ต่อชนิดโหนด', en: 'one template per node type' } },
  { from: 'type: MyNodeComponent', to: "type: 'machine' + [nodeTypes]=\"{ machine: MyNodeComponent }\"" },
  { from: '<handle type="source" position="right" id="out">', to: '<wt-flow-handle type="source" position="right" id="out">' },
  { from: "edge.curve: 'bezier' | 'straight' | 'smooth-step'", to: "edge.type: 'default' | 'straight' | 'smoothstep'", note: { th: 'มี step และ simplebezier เพิ่ม', en: 'plus step and simplebezier' } },
  { from: "edge.markers.end: { type: 'arrow-closed' }", to: "edge.markerEnd: 'arrowclosed'" },
  { from: 'edge.edgeLabels.center', to: 'edge.label · <ng-template wtFlowEdgeLabel>' },
  { from: '<ng-template edge let-ctx>', to: '<ng-template wtFlowEdge="type" let-edge>' },
  { from: '<ng-template connection let-ctx>', to: '<ng-template wtFlowConnectionLine let-line>' },
  { from: '(onConnect)', to: '(connect) + addEdge() · [autoConnect]="true"' },
  { from: "[connection]: ConnectionSettings({ mode, validator })", to: 'connectionMode · [isValidConnection]' },
  { from: '(onNodesChange) · (onEdgesChange)', to: '(nodeChanges) · (edgeChanges)', note: { th: 'คู่กับ [applyChanges]="false" และ applyNodeChanges()', en: 'with [applyChanges]="false" and applyNodeChanges()' } },
  { from: '<background> · <minimap>', to: '<wt-flow-background> · <wt-flow-minimap> · <wt-flow-controls>' },
  { from: 'view="auto"', to: '[fitView]="true"' },
  { from: 'fitView() · zoomTo() · panTo()', to: 'fitView() · zoomTo() · setCenter() · setViewport()' },
  { from: 'documentPointToFlowPoint()', to: 'screenToFlowPosition()' },
];

/* ---------- Flow ---------- */
export abstract class FlowDemo extends SimpleDemo {
  protected readonly doc = FLOW_DOC;
  private readonly kit = inject(DOCS_FLOW);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly flowKeys = FLOW_KEYS;
  protected readonly migrationRows = FLOW_MIGRATION;

  basicNodes: DocFlowNode[] = [];
  basicEdges: DocFlowEdge[] = [];
  readonly edgeDefaults: Partial<DocFlowEdge> = { markerEnd: 'arrowclosed' };
  leaveNodes: DocFlowNode[] = [];
  leaveEdges: DocFlowEdge[] = [];
  shapeNodes: DocFlowNode[] = [];
  shapeEdges: DocFlowEdge[] = [];
  assignNodes: DocFlowNode[] = [];
  assignEdges: DocFlowEdge[] = [];
  connectionMode: 'strict' | 'loose' = 'strict';
  lastConnect = '-';
  /** [isValidConnection] takes the function itself, so the method is bound once (as the sample shows). */
  readonly canConnect = this.isTeacherToRoom.bind(this);
  termNodes: DocFlowNode[] = [];
  termEdges: DocFlowEdge[] = [];
  lastChanges = '-';
  taskNodes: DocFlowNode[] = [];
  taskEdges: DocFlowEdge[] = [];
  selectedLabels = '-';
  deleteMessage = '';
  readonly confirmDelete = this.keepLocked.bind(this);
  groupNodes: DocFlowNode[] = [];
  groupEdges: DocFlowEdge[] = [];
  noteNodes: DocFlowNode[] = [];
  menuNodes: DocFlowNode[] = [];
  menuEdges: DocFlowEdge[] = [];
  menuItems: MenuEntry[] = [];
  renaming: DocFlowNode | null = null;
  newName = '';
  lastAction = '-';
  menuAdded = 0;
  viewNodes: DocFlowNode[] = [];
  viewEdges: DocFlowEdge[] = [];
  viewport: DocFlowViewport = { x: 40, y: 40, zoom: 1 };
  panOnScroll = false;
  added = 0;
  chartNodes: DocFlowNode[] = [];
  chartEdges: DocFlowEdge[] = [];
  libraryNodes: DocFlowNode[] = [];
  libraryEdges: DocFlowEdge[] = [];
  admitNodes: DocFlowNode[] = [];
  admitEdges: DocFlowEdge[] = [];
  svgUrl = '';
  json = '';
  keyNodes: DocFlowNode[] = [];
  keyEdges: DocFlowEdge[] = [];
  perfNodes: DocFlowNode[] = [];
  perfEdges: DocFlowEdge[] = [];
  onlyVisible = true;
  readonly drawn = signal(0);

  constructor() {
    super();
    this.reset();
    this.onLang(() => this.reset());
  }

  /** Every diagram from its sample data, in the site language. */
  reset(): void {
    this.basicNodes = this.fresh(BASIC_NODES);
    this.basicEdges = this.fresh(BASIC_EDGES);
    this.leaveNodes = this.fresh(LEAVE_NODES);
    this.leaveEdges = this.fresh(LEAVE_EDGES);
    this.shapeNodes = this.fresh(SHAPE_NODES);
    this.shapeEdges = this.fresh(SHAPE_EDGES);
    this.assignNodes = this.fresh(ASSIGN_NODES);
    this.assignEdges = this.fresh(ASSIGN_EDGES);
    this.termNodes = this.fresh(TERM_NODES);
    this.termEdges = this.fresh(TERM_EDGES);
    this.taskNodes = this.fresh(TASK_NODES);
    this.taskEdges = this.fresh(TASK_EDGES);
    this.groupNodes = this.fresh(GROUP_NODES);
    this.groupEdges = this.fresh(GROUP_EDGES);
    this.noteNodes = this.fresh(NOTE_NODES);
    this.menuNodes = this.fresh(MENU_NODES);
    this.menuEdges = this.fresh(MENU_EDGES);
    this.renaming = null;
    this.lastAction = '-';
    this.viewNodes = this.fresh(VIEW_NODES);
    this.viewEdges = this.fresh(VIEW_EDGES);
    this.chartNodes = this.fresh(CHART_NODES);
    this.chartEdges = this.fresh(CHART_EDGES);
    this.libraryNodes = this.fresh(LIBRARY_NODES);
    this.libraryEdges = this.fresh(LIBRARY_EDGES);
    this.admitNodes = this.fresh(ADMIT_NODES);
    this.admitEdges = this.fresh(ADMIT_EDGES);
    this.keyNodes = this.fresh(KEY_NODES);
    this.keyEdges = this.fresh(KEY_EDGES);
    this.buildBigDiagram();
    this.lastConnect = '-';
    this.lastChanges = '-';
    this.selectedLabels = '-';
    this.deleteMessage = '';
    this.svgUrl = '';
    this.json = '';
  }

  /** A copy the flow may hand back changed, without touching the sample data. */
  private fresh<T>(data: T): T {
    return structuredClone(this.local(data));
  }

  // ---------- edges ----------

  removeEdge(id: string): void {
    this.shapeEdges = this.shapeEdges.filter((e) => e.id !== id);
  }

  // ---------- connecting ----------

  isTeacherToRoom(connection: DocFlowConnection): boolean {
    return connection.source.startsWith('t-') && connection.target.startsWith('r-');
  }

  assign(connection: DocFlowConnection): void {
    this.assignEdges = this.kit.addEdge({ ...connection, type: 'smoothstep' }, this.assignEdges);
  }

  connectEnded(event: { isValid: boolean }): void {
    this.lastConnect = this.tx(event.isValid ? 'เชื่อมแล้ว' : 'เชื่อมไม่ได้');
  }

  toggleMode(): void {
    this.connectionMode = this.connectionMode === 'strict' ? 'loose' : 'strict';
  }

  // ---------- controlled ----------

  onNodeChanges(changes: { type: string; position?: { x: number; y: number } }[]): void {
    const kept = changes.map((c) => (c.type === 'position' && c.position ? { ...c, position: { x: c.position.x, y: 0 } } : c));
    this.termNodes = this.kit.applyNodeChanges(kept, this.termNodes);
    this.lastChanges = changes.map((c) => c.type).join(', ');
  }

  onEdgeChanges(changes: { type: string }[]): void {
    this.termEdges = this.kit.applyEdgeChanges(changes, this.termEdges);
  }

  termText(): string {
    return this.termNodes.map((n) => `${n.id}@${Math.round(n.position.x)},${Math.round(n.position.y)}`).join(' ');
  }

  // ---------- selection ----------

  keepLocked(elements: { nodes: DocFlowNode[]; edges: DocFlowEdge[] }): boolean {
    if (elements.nodes.some((n) => n.data?.locked)) {
      this.deleteMessage = this.tx('งานที่ล็อกไว้ลบไม่ได้');
      return false;
    }
    return true;
  }

  selectionChanged(selection: { nodes: DocFlowNode[] }): void {
    this.selectedLabels = selection.nodes.map((n) => n.data?.label).join(', ') || '-';
  }

  deleted(event: { nodes: unknown[]; edges: unknown[] }): void {
    this.deleteMessage = `${this.tx('ลบแล้ว')} ${event.nodes.length} ${this.tx('โหนด')} ${event.edges.length} ${this.tx('เส้น')}`;
  }

  // ---------- node toolbar ----------

  recolor(flow: DocFlowApi, id: string, tone: string): void {
    flow.updateNodeData(id, { tone });
  }

  removeNote(flow: DocFlowApi, id: string): void {
    void flow.deleteElements({ nodes: [id] });
  }

  // ---------- right-click menus ----------

  openEdgeMenu(e: { event: Event; edge: DocFlowEdge }, flow: DocFlowApi, menu: DocMenu): void {
    const edge = e.edge;
    this.menuItems = [
      { label: this.tx('ลบเส้น'), icon: 'wi wi-trash', command: () => this.deleteEdge(flow, edge) },
      { label: this.tx('ลากปลายเส้นใหม่'), icon: 'wi wi-arrows-alt', command: () => this.reconnect(flow, edge) },
      { label: this.tx('สลับเส้นประวิ่ง'), icon: 'wi wi-bolt', command: () => flow.updateEdge(edge.id, { animated: !edge.animated }) },
      {
        label: this.tx('รูปเส้น'),
        icon: 'wi wi-directions',
        items: [
          { label: this.tx('โค้ง'), command: () => flow.updateEdge(edge.id, { type: 'default' }) },
          { label: this.tx('หักมุมมน'), command: () => flow.updateEdge(edge.id, { type: 'smoothstep' }) },
          { label: this.tx('หักมุมฉาก'), command: () => flow.updateEdge(edge.id, { type: 'step' }) },
          { label: this.tx('เส้นตรง'), command: () => flow.updateEdge(edge.id, { type: 'straight' }) },
        ],
      },
    ];
    menu.show(e.event);
  }

  openNodeMenu(e: { event: Event; node: DocFlowNode }, flow: DocFlowApi, menu: DocMenu): void {
    const node = e.node;
    this.menuItems = [
      { label: this.tx('แก้ชื่อ'), icon: 'wi wi-pencil', command: () => this.startRename(node) },
      { label: this.tx('ทำสำเนา'), icon: 'wi wi-clone', command: () => this.duplicate(flow, node) },
      { label: this.tx('ลบโหนด'), icon: 'wi wi-trash', command: () => void flow.deleteElements({ nodes: [node.id] }) },
    ];
    menu.show(e.event);
  }

  openPaneMenu(e: MouseEvent | KeyboardEvent, flow: DocFlowApi, menu: DocMenu): void {
    const box = (e.target as Element).getBoundingClientRect();
    const point = e instanceof MouseEvent && e.clientX ? { x: e.clientX, y: e.clientY } : { x: box.left + box.width / 2, y: box.top + box.height / 2 };
    const position = flow.screenToFlowPosition(point);
    this.menuItems = [{ label: this.tx('เพิ่มโหนดตรงนี้'), icon: 'wi wi-plus', command: () => this.addHere(flow, position) }];
    menu.show(e);
  }

  menuKey(e: KeyboardEvent, flow: DocFlowApi, menu: DocMenu): void {
    if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) return;
    const target = e.target as Element;
    const node = flow.getNode(target.closest('.wt-flow-node')?.getAttribute('data-id') || '');
    const edge = flow.getEdge(target.closest('.wt-flow-edge')?.getAttribute('data-id') || '');
    if (node) this.openNodeMenu({ event: e, node }, flow, menu);
    else if (edge) this.openEdgeMenu({ event: e, edge }, flow, menu);
    else this.openPaneMenu(e, flow, menu);
  }

  deleteEdge(flow: DocFlowApi, edge: DocFlowEdge): void {
    void flow.deleteElements({ edges: [edge.id] });
    this.lastAction = this.tx('ลบเส้น');
  }

  reconnect(flow: DocFlowApi, edge: DocFlowEdge): void {
    flow.select({ edges: [edge.id] });
    this.lastAction = this.tx('ลากวงกลมที่ปลายเส้นไปจุดใหม่');
  }

  duplicate(flow: DocFlowApi, node: DocFlowNode): void {
    this.menuAdded++;
    flow.addNodes({ ...node, id: node.id + '-' + this.menuAdded, selected: false, position: { x: node.position.x + 40, y: node.position.y + 40 } });
  }

  addHere(flow: DocFlowApi, position: { x: number; y: number }): void {
    this.menuAdded++;
    flow.addNodes({ id: 'step-' + this.menuAdded, position, data: { label: this.tx('ขั้นตอนใหม่') + ' ' + this.menuAdded } });
  }

  startRename(node: DocFlowNode): void {
    this.renaming = node;
    this.newName = node.data?.label || '';
  }

  saveName(flow: DocFlowApi): void {
    if (this.renaming) flow.updateNodeData(this.renaming.id, { label: this.newName });
    this.renaming = null;
  }

  // ---------- viewport ----------

  pick(event: DragEvent, type: string): void {
    event.dataTransfer?.setData('application/x-flow-node', type);
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  drop(event: DragEvent, flow: DocFlowApi): void {
    event.preventDefault();
    const type = event.dataTransfer?.getData('application/x-flow-node');
    if (type) this.place(flow, type, flow.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
  }

  addAtCentre(flow: DocFlowApi, canvas: HTMLElement, type: string): void {
    const box = canvas.getBoundingClientRect();
    this.place(flow, type, flow.screenToFlowPosition({ x: box.left + box.width / 2, y: box.top + box.height / 2 }));
  }

  place(flow: DocFlowApi, type: string, position: { x: number; y: number }): void {
    this.added++;
    const label = this.tx(type === 'input' ? 'เริ่ม' : type === 'output' ? 'จบ' : 'ขั้นตอน');
    flow.addNodes({ id: 'new-' + this.added, type, position, data: { label: label + ' ' + this.added } });
  }

  goToStart(flow: DocFlowApi): void {
    void flow.setCenter(80, 20, { zoom: 1.5, duration: 400 });
  }

  viewportText(): string {
    return Math.round(this.viewport.x) + ', ' + Math.round(this.viewport.y) + ' · ' + this.viewport.zoom.toFixed(2);
  }

  // ---------- export ----------

  exportSvg(flow: DocFlowApi): void {
    const svg = flow.toSvg({ title: this.tx('ขั้นตอนรับสมัคร') });
    this.svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  exportJson(flow: DocFlowApi): void {
    this.json = JSON.stringify(flow.toJSON(), null, 2);
  }

  // ---------- keyboard ----------

  keyText(): string {
    return this.keyNodes.map((n) => `${n.id}@${Math.round(n.position.x)},${Math.round(n.position.y)}${n.selected ? '*' : ''}`).join(' ');
  }

  // ---------- performance ----------

  /** 15 rows × 20 columns = 300 nodes, each row chained. */
  private buildBigDiagram(): void {
    const nodes: DocFlowNode[] = [];
    const edges: DocFlowEdge[] = [];
    const word = this.tx('งาน');
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 20; col++) {
        const id = 'n' + (row * 20 + col);
        nodes.push({ id, position: { x: col * 200, y: row * 90 }, sourcePosition: 'right', targetPosition: 'left', data: { label: word + ' ' + (row * 20 + col + 1) } });
        if (col > 0) edges.push({ id: 'e' + id, source: 'n' + (row * 20 + col - 1), target: id });
      }
    }
    this.perfNodes = nodes;
    this.perfEdges = edges;
  }

  /** How many nodes the big diagram draws right now (after the next frames). */
  countDrawn(): void {
    const el = this.host.nativeElement;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.drawn.set(el.querySelectorAll('#d-flow-perf .wt-flow-node').length))
    );
  }
}
