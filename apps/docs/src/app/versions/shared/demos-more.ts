import { BLOCKUI_DOC } from '../../data/blockui';
import { BREADCRUMB_DOC } from '../../data/breadcrumb';
import { COLORPICKER_DOC } from '../../data/colorpicker';
import { DRAGDROP_DOC } from '../../data/dragdrop';
import { DRAWER_DOC } from '../../data/drawer';
import { GALLERIA_DOC, GALLERY_PHOTOS } from '../../data/galleria';
import { INPLACE_DOC } from '../../data/inplace';
import { LISTBOX_DOC, LISTBOX_ROOMS } from '../../data/listbox';
import { SCROLLER_DOC } from '../../data/scroller';
import { SCHOOL_RULES, SCROLLPANEL_DOC } from '../../data/scrollpanel';
import { SLIDER_DOC } from '../../data/slider';
import { SPLITBUTTON_DOC } from '../../data/splitbutton';
import { CONTEXTMENU_DOC, TIEREDMENU_DOC } from '../../data/tieredmenu';
import { DocTreeNode, schoolFolders, TREE_DOC, TREESELECT_DOC } from '../../data/tree';
import { MenuEntry, SimpleDemo, wait } from './demos';

/*
 * State and handlers behind the pages added with Slider, Listbox, Galleria and the rest. Like demos.ts, no wiraui
 * import: the same template compiles against v1, v2 and v3, so events are typed by their shape.
 */

/* ---------- Slider ---------- */
export abstract class SliderDemo extends SimpleDemo {
  protected readonly doc = SLIDER_DOC;
  volume = 60;
  passMark = 50;
  scoreRange = [60, 80];
  brightness = 40;
  bellVolume = 50;
  isApiSaving = false;
  savedVolume: number | null = null;
  slideEvents = 0;

  saveVolume(event: { value?: number }): void {
    this.isApiSaving = true;
    wait(700).then(() => {
      this.isApiSaving = false;
      this.savedVolume = event.value ?? null;
    });
  }

  slid(): void {
    this.slideEvents++;
  }
}

/* ---------- SplitButton ---------- */
export abstract class SplitButtonDemo extends SimpleDemo {
  protected readonly doc = SPLITBUTTON_DOC;
  readonly saveActions: MenuEntry[] = [
    { label: 'บันทึกเป็นร่าง', icon: 'wi wi-file', command: (event) => this.run(event) },
    { label: 'บันทึกและส่งต่อ', icon: 'wi wi-send', command: (event) => this.run(event) },
    { separator: true },
    { label: 'ลบเอกสาร', icon: 'wi wi-trash', command: (event) => this.run(event) },
  ];
  readonly exportActions: MenuEntry[] = [
    { label: 'ไฟล์ PDF', icon: 'wi wi-file-pdf', command: (event) => this.run(event) },
    { label: 'ไฟล์ Excel', icon: 'wi wi-file-excel', command: (event) => this.run(event) },
  ];
  readonly reviewActions: MenuEntry[] = [
    { label: 'ส่งกลับแก้ไข', icon: 'wi wi-undo', command: (event) => this.run(event) },
    { label: 'ไม่อนุมัติ', icon: 'wi wi-times', command: (event) => this.run(event) },
  ];
  lastAction = '';
  isApiSaving = false;
  savedCount = 0;
  menuEvents: string[] = [];

  run(event: { item?: MenuEntry }): void {
    this.lastAction = event.item?.label ?? '';
  }

  save(): void {
    this.isApiSaving = true;
    wait(800).then(() => {
      this.isApiSaving = false;
      this.savedCount++;
    });
  }

  logMenu(name: string): void {
    this.menuEvents = [...this.menuEvents.slice(-3), name];
  }
}

/* ---------- Listbox ---------- */
type Room = (typeof LISTBOX_ROOMS)[number];

export abstract class ListboxDemo extends SimpleDemo {
  protected readonly doc = LISTBOX_DOC;
  readonly rooms = LISTBOX_ROOMS;
  readonly roomGroups = [
    { label: 'ชั้น ม.1', items: [{ code: '101', name: 'ม.1/1' }, { code: '102', name: 'ม.1/2' }] },
    { label: 'ชั้น ม.2', items: [{ code: '201', name: 'ม.2/1' }, { code: '202', name: 'ม.2/2' }] },
    { label: 'ชั้น ม.3', items: [{ code: '301', name: 'ม.3/1' }, { code: '302', name: 'ม.3/2' }] },
  ];
  room: Room | null = null;
  roomCodes: string[] = [];
  filterRoom: Room | null = null;
  groupRoom: { code: string; name: string } | null = null;
  tplCodes: string[] = [];
  lastOpened = '';
  lastFilter = '';

  constructor() {
    super();
    this.reset();
    this.onLang(() => this.reset());
  }

  reset(): void {
    this.room = null;
    this.roomCodes = ['101'];
    this.filterRoom = null;
    this.groupRoom = null;
    this.tplCodes = [];
    this.lastOpened = '';
  }

  openRoom(event: { option: { name: string } }): void {
    this.lastOpened = event.option.name;
  }

  filtered(event: { filter: string }): void {
    this.lastFilter = event.filter;
  }
}

/* ---------- Galleria ---------- */
export abstract class GalleriaDemo extends SimpleDemo {
  protected readonly doc = GALLERIA_DOC;
  readonly photos = GALLERY_PHOTOS;
  readonly responsiveOptions = [{ breakpoint: '768px', numVisible: 2 }];
  photoIndex = 0;
  galleryOpen = false;
  fullIndex = 0;

  openPhoto(index: number): void {
    this.fullIndex = index;
    this.galleryOpen = true;
  }
}

/* ---------- ColorPicker ---------- */
export abstract class ColorPickerDemo extends SimpleDemo {
  protected readonly doc = COLORPICKER_DOC;
  schoolColor = '#0f766e';
  noticeColor = { r: 234, g: 88, b: 12 };
  headerColor: { h: number; s: number; b: number } | null = null;
  groupColor = '#7c3aed';
  panelEvents: string[] = [];
  changes = 0;

  logPanel(name: string): void {
    this.panelEvents = [...this.panelEvents.slice(-3), name];
  }

  changed(): void {
    this.changes++;
  }
}

/* ---------- Breadcrumb ---------- */
export abstract class BreadcrumbDemo extends SimpleDemo {
  protected readonly doc = BREADCRUMB_DOC;
  readonly home: MenuEntry = { command: (event) => this.go(event) };
  readonly iconHome: MenuEntry = { icon: 'wi wi-home', command: (event) => this.go(event) };
  readonly trail: MenuEntry[] = [
    { label: 'ระบบทะเบียน', command: (event) => this.go(event) },
    { label: 'ห้องเรียน', icon: 'wi wi-users', command: (event) => this.go(event) },
    { label: 'ม.1/1', command: (event) => this.go(event) },
    { label: 'ด.ช.กิตติพัฒน์ ใจดี' },
  ];
  readonly gradeTrail: MenuEntry[] = [
    { label: 'รายงาน', command: (event) => this.go(event) },
    { label: 'ผลการเรียน', command: (event) => this.go(event) },
    { label: 'ภาคเรียนที่ 1/2569' },
  ];
  lastPressed = '';
  currentView = '';

  go(event: { item?: MenuEntry }): void {
    this.currentView = event.item?.label ?? '';
  }

  pressed(event: { item: MenuEntry }): void {
    this.lastPressed = event.item.label ?? this.tx('หน้าแรก');
  }
}

/* ---------- Inplace ---------- */
export abstract class InplaceDemo extends SimpleDemo {
  protected readonly doc = INPLACE_DOC;
  studentName = '';
  nickname = '';
  note = '';
  editingNote = false;
  isApiSaving = false;
  savedNickname = 0;
  inplaceEvents: string[] = [];

  constructor() {
    super();
    this.reset();
    this.onLang(() => this.reset());
  }

  reset(): void {
    this.studentName = this.tx('ด.ช.กิตติพัฒน์ ใจดี');
    this.nickname = this.tx('ต้นกล้า');
    this.note = '';
  }

  saveNickname(close: () => void): void {
    this.isApiSaving = true;
    wait(700).then(() => {
      this.isApiSaving = false;
      this.savedNickname++;
      close();
    });
  }

  logInplace(name: string): void {
    this.inplaceEvents = [...this.inplaceEvents.slice(-3), name];
  }
}

/* ---------- BlockUI ---------- */
export abstract class BlockUIDemo extends SimpleDemo {
  protected readonly doc = BLOCKUI_DOC;
  studentName = '';
  isApiSaving = false;
  isApiSending = false;
  savedCount = 0;
  sentCount = 0;
  innerPresses = 0;

  constructor() {
    super();
    this.onLang(() => (this.studentName = this.tx('ด.ช.กิตติพัฒน์ ใจดี')));
  }

  save(): void {
    this.isApiSaving = true;
    wait(1500).then(() => {
      this.isApiSaving = false;
      this.savedCount++;
    });
  }

  sendGrades(): void {
    this.isApiSending = true;
    wait(1500).then(() => {
      this.isApiSending = false;
      this.sentCount++;
    });
  }

  pressInside(): void {
    this.innerPresses++;
  }
}

/* ---------- ScrollPanel ---------- */
export abstract class ScrollPanelDemo extends SimpleDemo {
  protected readonly doc = SCROLLPANEL_DOC;
  readonly rules = SCHOOL_RULES;
  notices: string[] = [];

  constructor() {
    super();
    this.onLang(() => (this.notices = [this.tx('ประกาศใหม่') + ' 1']));
  }

  addNotice(): void {
    this.notices = [...this.notices, this.tx('ประกาศใหม่') + ' ' + (this.notices.length + 1)];
  }
}

/* ---------- Scroller ---------- */
interface ScrollerStudent {
  id: number;
  name: string;
  room: string;
}

const SCROLLER_ROOMS = ['ม.1/1', 'ม.1/2', 'ม.2/1', 'ม.3/1'];

const makeScrollerStudents = (count: number, from = 0): ScrollerStudent[] =>
  Array.from({ length: count }, (_, k) => {
    const i = from + k;
    return { id: i + 1, name: 'นักเรียนคนที่ ' + (i + 1), room: SCROLLER_ROOMS[i % SCROLLER_ROOMS.length] };
  });

export abstract class ScrollerDemo extends SimpleDemo {
  protected readonly doc = SCROLLER_DOC;
  readonly students = makeScrollerStudents(1000);
  readonly days = Array.from({ length: 365 }, (_, i) => ({ no: i + 1, periods: 6 + (i % 3) }));
  lazyStudents: (ScrollerStudent | undefined)[] = Array.from({ length: 1000 });
  isApiLoading = false;
  lazyLoads = 0;
  firstInView = 0;

  loadStudents(range: { first: number; last: number }): void {
    this.isApiLoading = true;
    wait(400).then(() => {
      const next = [...this.lazyStudents];
      const rows = makeScrollerStudents(range.last - range.first, range.first);
      next.splice(range.first, rows.length, ...rows);
      this.lazyStudents = next;
      this.isApiLoading = false;
      this.lazyLoads++;
    });
  }

  rowsInView(range: { first: number }): void {
    this.firstInView = range.first;
  }

  loadedCount(): number {
    return this.lazyStudents.filter((s) => !!s).length;
  }
}

/* ---------- Drawer ---------- */
type DrawerSide = 'left' | 'right' | 'top' | 'bottom' | 'full';

export abstract class DrawerDemo extends SimpleDemo {
  protected readonly doc = DRAWER_DOC;
  menuOpen = false;
  readonly menuItems: MenuEntry[] = [
    { label: 'หน้าแรก', icon: 'wi wi-home', command: (event) => this.goTo(event) },
    { label: 'นักเรียน', icon: 'wi wi-users', command: (event) => this.goTo(event) },
    { label: 'ตารางเรียน', icon: 'wi wi-calendar', command: (event) => this.goTo(event) },
    { label: 'รายงาน', icon: 'wi wi-chart-bar', command: (event) => this.goTo(event) },
    { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.goTo(event) },
  ];
  lastPage = '';
  side: DrawerSide = 'left';
  noticeOpen = false;
  contactOpen = false;
  parentPhone = '081-234-5678';
  isApiSaving = false;
  savedContact = 0;
  previewOpen = false;
  chatOpen = false;
  message = '';
  drawerEvents: string[] = [];

  goTo(event: { item?: MenuEntry }): void {
    this.lastPage = event.item?.label ?? '';
    this.menuOpen = false;
  }

  openAt(side: DrawerSide): void {
    this.side = side;
    this.noticeOpen = true;
  }

  saveContact(): void {
    this.isApiSaving = true;
    wait(700).then(() => {
      this.isApiSaving = false;
      this.savedContact++;
      this.contactOpen = false;
    });
  }

  logDrawer(name: string): void {
    this.drawerEvents = [...this.drawerEvents.slice(-3), name];
  }
}

/* ---------- TieredMenu and ContextMenu ---------- */
abstract class MenuCommands extends SimpleDemo {
  lastCommand = '';
  readonly items: MenuEntry[] = [
    {
      label: 'เอกสาร',
      icon: 'wi wi-file',
      items: [
        { label: 'สร้างใหม่', icon: 'wi wi-plus', command: (event) => this.run(event) },
        {
          label: 'ส่งออก',
          icon: 'wi wi-download',
          items: [
            { label: 'ไฟล์ PDF', icon: 'wi wi-file-pdf', command: (event) => this.run(event) },
            { label: 'ไฟล์ Excel', icon: 'wi wi-file-excel', command: (event) => this.run(event) },
          ],
        },
        { separator: true },
        { label: 'พิมพ์', icon: 'wi wi-print', command: (event) => this.run(event) },
      ],
    },
    {
      label: 'นักเรียน',
      icon: 'wi wi-users',
      items: [
        { label: 'รายชื่อนักเรียน', icon: 'wi wi-list', command: (event) => this.run(event) },
        { label: 'ย้ายห้อง', icon: 'wi wi-share-alt', disabled: true },
      ],
    },
    { label: 'ตั้งค่า', icon: 'wi wi-cog', command: (event) => this.run(event) },
  ];
  readonly fileActions: MenuEntry[] = [
    { label: 'คัดลอก', icon: 'wi wi-copy', command: (event) => this.run(event) },
    { label: 'เปลี่ยนชื่อ', icon: 'wi wi-pencil', command: (event) => this.run(event) },
    {
      label: 'แชร์',
      icon: 'wi wi-share-alt',
      items: [
        { label: 'ให้ครูในกลุ่มสาระ', command: (event) => this.run(event) },
        { label: 'ให้ผู้ปกครอง', command: (event) => this.run(event) },
      ],
    },
    { separator: true },
    { label: 'ลบ', icon: 'wi wi-trash', command: (event) => this.run(event) },
  ];

  run(event: { item?: MenuEntry }): void {
    this.lastCommand = event.item?.label ?? '';
  }
}

export abstract class TieredMenuDemo extends MenuCommands {
  protected readonly doc = TIEREDMENU_DOC;
  menuEvents: string[] = [];

  logMenu(name: string): void {
    this.menuEvents = [...this.menuEvents.slice(-3), name];
  }
}

interface DocFile {
  id: number;
  name: string;
}

export abstract class ContextMenuDemo extends MenuCommands {
  protected readonly doc = CONTEXTMENU_DOC;
  readonly files: DocFile[] = [
    { id: 1, name: 'แผนการสอน' },
    { id: 2, name: 'ตารางสอบ' },
    { id: 3, name: 'ผลการเรียน' },
  ];
  pickedFile: DocFile | null = null;

  constructor() {
    super();
    this.onLang(() => (this.pickedFile = null));
  }

  pickFile(file: DocFile): void {
    this.pickedFile = file;
  }
}

/* ---------- Tree and TreeSelect ---------- */
const GRADE_ROOMS: Record<string, string[]> = { m1: ['1/1', '1/2'], m2: ['2/1', '2/2'], m3: ['3/1', '3/2'] };

export abstract class TreeDemo extends SimpleDemo {
  protected readonly doc = TREE_DOC;
  readonly basicNodes = schoolFolders();
  readonly selectNodes = schoolFolders();
  readonly checkNodes = schoolFolders();
  readonly filterNodes = schoolFolders();
  readonly templateNodes = schoolFolders();
  readonly grades: DocTreeNode[] = [
    { key: 'm1', label: 'ชั้น ม.1', leaf: false },
    { key: 'm2', label: 'ชั้น ม.2', leaf: false },
    { key: 'm3', label: 'ชั้น ม.3', leaf: false },
  ];
  readonly fileActions: MenuEntry[] = [
    { label: 'ดาวน์โหลด', icon: 'wi wi-download', command: (event) => this.run(event) },
    { label: 'เปลี่ยนชื่อ', icon: 'wi wi-pencil', command: (event) => this.run(event) },
    { label: 'ลบ', icon: 'wi wi-trash', command: (event) => this.run(event) },
  ];
  pickedFile: DocTreeNode | null = null;
  tickedFiles: DocTreeNode[] = [];
  menuNode: DocTreeNode | null = null;
  lastOpened = '';
  lastCommand = '';
  roomLoads = 0;

  constructor() {
    super();
    this.onLang(() => {
      this.pickedFile = null;
      this.tickedFiles = [];
      this.menuNode = null;
    });
  }

  /** Only files count (folders follow their children). */
  tickedFileCount(): number {
    return this.tickedFiles.filter((n) => n.type === 'file').length;
  }

  loadRooms(event: { node: DocTreeNode }): void {
    const node = event.node;
    if (node.children) return;
    node.loading = true;
    wait(500).then(() => {
      node.children = (GRADE_ROOMS[node.key ?? ''] || []).map((r) => ({ key: node.key + '-' + r, label: this.tx('ห้อง ม.' + r), icon: 'wi wi-users' }));
      node.loading = false;
      this.roomLoads++;
    });
  }

  pickNode(event: { node: DocTreeNode }): void {
    this.menuNode = event.node;
  }

  openFile(event: { node: DocTreeNode }): void {
    this.lastOpened = event.node.label ?? '';
  }

  run(event: { item?: MenuEntry }): void {
    this.lastCommand = (event.item?.label ?? '') + ': ' + (this.menuNode?.label ?? '');
  }
}

export abstract class TreeSelectDemo extends SimpleDemo {
  protected readonly doc = TREESELECT_DOC;
  readonly folders = schoolFolders();
  readonly templateFolders = schoolFolders();
  readonly roomTree: DocTreeNode[] = [
    { key: 'm1', label: 'ชั้น ม.1', children: [{ key: '101', label: 'ห้อง ม.1/1' }, { key: '102', label: 'ห้อง ม.1/2' }] },
    { key: 'm2', label: 'ชั้น ม.2', children: [{ key: '201', label: 'ห้อง ม.2/1' }, { key: '202', label: 'ห้อง ม.2/2' }] },
    { key: 'm3', label: 'ชั้น ม.3', children: [{ key: '301', label: 'ห้อง ม.3/1' }, { key: '302', label: 'ห้อง ม.3/2' }] },
  ];
  attachment: DocTreeNode | null = null;
  myRooms: DocTreeNode[] = [];
  styledAttachment: DocTreeNode | null = null;
  cleared = 0;

  constructor() {
    super();
    this.onLang(() => {
      this.attachment = null;
      this.myRooms = [];
      this.styledAttachment = null;
    });
  }

  clearedField(): void {
    this.cleared++;
  }

  roomCount(): number {
    return this.myRooms.filter((n) => !n.children).length;
  }
}

/* ---------- DragDrop ---------- */
interface DragStudent {
  id: number;
  name: string;
}

const DRAG_STUDENTS = ['ด.ช.กิตติพัฒน์ ใจดี', 'ด.ญ.ปภาวรินทร์ ศรีสุข', 'ด.ช.ธนกฤต เกิดผล', 'ด.ญ.ชนิดา ชัยมงคล'];

export abstract class DragDropDemo extends SimpleDemo {
  protected readonly doc = DRAGDROP_DOC;
  available: DragStudent[] = [];
  members: DragStudent[] = [];
  dragged: DragStudent | null = null;
  adviser = '';
  draggedTeacher = '';
  groups: string[] = [];
  orderLocked = false;
  dragStarts = 0;
  private from = -1;

  constructor() {
    super();
    this.reset();
    this.onLang(() => this.reset());
  }

  reset(): void {
    this.available = DRAG_STUDENTS.map((name, i) => ({ id: i + 1, name: this.tx(name) }));
    this.members = [];
    this.adviser = '';
    this.groups = [1, 2, 3, 4].map((n) => this.tx('กลุ่มที่') + ' ' + n);
  }

  dragStart(student: DragStudent): void {
    this.dragged = student;
    this.dragStarts++;
  }

  dragEnd(): void {
    this.dragged = null;
  }

  dropToClub(): void {
    const s = this.dragged;
    if (!s) return;
    this.available = this.available.filter((a) => a.id !== s.id);
    this.members = [...this.members, s];
  }

  dragTeacher(name: string): void {
    this.draggedTeacher = name;
  }

  setAdviser(): void {
    this.adviser = this.draggedTeacher;
  }

  dragFrom(index: number): void {
    this.from = index;
  }

  dropAt(index: number): void {
    if (this.from < 0 || this.from === index) return;
    const next = [...this.groups];
    const [moved] = next.splice(this.from, 1);
    next.splice(index, 0, moved);
    this.groups = next;
    this.from = -1;
  }
}
