import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WIRAUI_MAJOR } from '@wirabyte/ui';
import type { MenuItem, Message, TreeNode } from '@wirabyte/ui/api';
import { definePreset, palette, Siam, WuConfig, WuThemeService } from '@wirabyte/ui/config';
import { base64ToFile, EN_LOCALE } from '@wirabyte/ui/core';
import type { CropperPosition, WuImageCroppedEvent } from '@wirabyte/ui/imagecropper';
import { WuI18n } from '@wirabyte/ui/i18n';
import { WuAlert, WuAlertService } from '@wirabyte/ui/alert';
import { WuConfirmationService } from '@wirabyte/ui/confirmdialog';
import { WuMessageService } from '@wirabyte/ui/toast';
import { WuTerminalService } from '@wirabyte/ui/terminal';
import { applyEdgeChanges, applyNodeChanges } from '@wirabyte/ui/flow';
import type { FlowEdge, FlowEdgeChange, FlowNode, FlowNodeChange, FlowViewport, WuFlow, WuFlowSelectionChange } from '@wirabyte/ui/flow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent {
  readonly major = WIRAUI_MAJOR;
  readonly ngVersion = VERSION.full;
  saved = 0;
  removed = 0;
  panelCollapsed = false;
  accIndex: number | number[] | null = 0;
  tabIndex = 0;
  num = { price: 1234.5 as number | null, qty: 9 as number | null, weight: 60 as number | null };
  dates = {
    due: null as Date | null,
    meeting: new Date(2026, 2, 12, 9, 30, 15) as Date | null,
    locked: new Date(2026, 2, 12, 14, 0) as Date | null,
    stay: null as (Date | null)[] | null,
    month: null as Date | null,
    alarm: null as Date | null,
    inline: null as Date | null,
  };
  readonly minDate = new Date(2026, 2, 5);
  dialogOpen = false;
  bottomOpen = false;
  students = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: ['กมล', 'ขวัญใจ', 'จิราพร', 'ชยพล', 'ณัฐวุฒิ', 'ธนพร', 'ปิยะ', 'มานี'][i % 8] + ' ' + (i + 1),
    room: 'ม.' + ((i % 3) + 1) + '/' + ((i % 2) + 1),
    score: (i * 37) % 100,
    info: { club: ['ดนตรี', 'กีฬา', 'วิทยาศาสตร์', 'ศิลปะ'][i % 4] },
  }));
  fewStudents = this.students.slice(0, 4);
  plSource = [
    { id: 1, name: 'ดูข้อมูลนักเรียน' },
    { id: 2, name: 'แก้ไขข้อมูลนักเรียน' },
    { id: 3, name: 'อนุมัติคำร้อง' },
    { id: 4, name: 'ออกรายงาน' },
    { id: 5, name: 'ตั้งค่าระบบ' },
  ];
  plTarget: { id: number; name: string }[] = [];
  plSource2 = [
    { id: 1, name: 'คณิตศาสตร์' },
    { id: 2, name: 'วิทยาศาสตร์' },
  ];
  plTarget2: { id: number; name: string }[] = [{ id: 3, name: 'ภาษาไทย' }];
  olItems = [
    { id: 1, name: 'ครูประจำชั้น' },
    { id: 2, name: 'หัวหน้าระดับ' },
    { id: 3, name: 'รองผู้อำนวยการ' },
    { id: 4, name: 'ผู้อำนวยการ' },
  ];
  olSelected: { id: number; name: string }[] = [];
  uploadLog = '';
  deepRows = [
    { id: 1, name: 'กมล', score: 40 },
    { id: 2, name: 'ขวัญใจ', score: 75 },
    { id: 3, name: 'จิราพร', score: 60 },
    { id: 4, name: 'ชยพล', score: 90 },
  ];
  deepCols = [
    { field: 'name', header: 'ชื่อ' },
    { field: 'score', header: 'คะแนน' },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deepPicked: any = null;
  deepFrozen = [{ name: 'รวม', score: 265 }];
  editRows = [
    { id: 1, name: 'ห้องหนึ่ง' },
    { id: 2, name: 'ห้องสอง' },
  ];
  isDeepSelectable(e: { data: unknown }): boolean {
    return (e.data as { id: number }).id !== 3;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortDeep(e: { data: any[]; field?: string; order?: number }): void {
    const f = e.field || 'name';
    const o = e.order || 1;
    e.data.sort((a, b) => (a[f] > b[f] ? 1 : a[f] < b[f] ? -1 : 0) * o);
    this.note('customsort:' + f);
  }
  prNumber: number | null = 12;
  prRadio = 'a';
  prOptions = [
    { label: 'ก', value: 1 },
    { label: 'ข', value: 2 },
  ];
  prChoice: number | null = 1;
  prDigits = '';
  prAcValue: unknown = null;
  prAcItems: string[] = [];
  editorHtml: string | null = '<p>สวัสดี <strong>คุณครู</strong></p>';
  editorQuill: string | null = '<p class="ql-align-center">จัดกลาง</p><ol><li data-list="bullet">ข้อหนึ่ง</li></ol>';
  editorUpload: string | null = null;
  readonlyHtml = '<p>อ่านอย่างเดียว</p>';
  viewHtml = '<h2>หัวข้อ</h2><p class="ql-align-center">กึ่งกลาง</p><p class="ql-indent-1">เยื้อง</p><table><tbody><tr><td>ก</td><td>ข</td></tr></tbody></table>';
  setEditorValue(): void {
    this.editorHtml = '<h2>ข่าวประชาสัมพันธ์</h2><p class="ql-align-right">ชิดขวา</p>';
  }
  stepValue = 1;
  csv = '';
  groupStudents = this.students.slice(0, 8).sort((a, b) => a.info.club.localeCompare(b.info.club, 'th') || a.id - b.id);
  exportCols = [
    { field: 'name', header: 'ชื่อ' },
    { field: 'room', header: 'ห้อง' },
    { field: 'score', header: 'คะแนน' },
  ];
  names(list: { name: string }[]): string {
    return list.map((x) => x.name).join(',');
  }
  uploadFiles(event: { files: File[] }, fu: { clear(): void }): void {
    this.uploadLog = event.files.map((f) => f.name).join(',');
    fu.clear();
  }
  clubs = [
    { id: 1, name: 'ดนตรี' },
    { id: 2, name: 'กีฬา' },
    { id: 3, name: 'วิทยาศาสตร์' },
    { id: 4, name: 'ศิลปะ', closed: true },
    { id: 5, name: 'คอมพิวเตอร์' },
  ];
  ms = { clubs: [2] as number[], provinces: [10, 83] as number[], titles: [] as string[] };
  im = { id: '', phone: '0812345678' };
  msgs: Message[] = [
    { severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลนักเรียน 3 คน' },
    { severity: 'error', summary: 'ผิดพลาด', detail: 'ไม่พบห้องเรียน', closable: false },
    { severity: 'warn', detail: 'ใกล้ครบกำหนด' },
  ];
  sendInline(): void {
    this.messages.add({ key: 'inline', severity: 'info', summary: 'แจ้ง', detail: 'ส่งผ่าน service' });
  }
  steps = [
    { status: 'ยื่นใบสมัคร', date: '1 มี.ค.' },
    { status: 'ตรวจเอกสาร', date: '3 มี.ค.' },
    { status: 'สอบสัมภาษณ์', date: '10 มี.ค.' },
    { status: 'ประกาศผล', date: '15 มี.ค.' },
  ];
  chartType = 'bar';
  chartData = {
    labels: ['ม.1', 'ม.2', 'ม.3'],
    datasets: [{ label: 'คะแนนเฉลี่ย', data: [72, 65, 81], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'] }],
  };
  chartOptions = { animation: false, plugins: { legend: { display: true } } };
  photo =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#10b981"/><circle cx="160" cy="100" r="60" fill="#fff"/></svg>');
  schools = [
    { id: 1, name: 'ฟ้าครามดาวเหนือ' },
    { id: 2, name: 'ฟ้าใสวิทยา' },
    { id: 3, name: 'ดาวเหนือศึกษา' },
    { id: 4, name: 'ทะเลหมอกพัฒนา', closed: true },
    { id: 5, name: 'ใบไม้เขียววิทยาคม' },
  ];
  schoolHits: { id: number; name: string }[] = [];

  /** Records the query on the window as it is asked, so a test can tell it came on the key itself. */
  findSchoolNow(e: { query: string }): void {
    (globalThis as unknown as { wuAsked?: string }).wuAsked = e.query;
    this.findSchool(e);
  }
  ac = { school: null as unknown, free: null as unknown, plain: null as unknown };
  findSchool(e: { query: string }): void {
    const q = e.query.trim();
    this.schoolHits = this.schools.filter((s) => !q || s.name.includes(q));
  }
  aliasDate: Date | null = null;
  aliasOn = true;
  valueTab = 'docs';
  openPanel: string | null = 'fees';
  openPanels: string[] = ['b'];
  menuLog = '-';
  menuItems = [
    { label: 'หน้าแรก', icon: 'pi pi-home', command: () => this.menuPick('home') },
    {
      label: 'นักเรียน',
      items: [
        { label: 'รายชื่อ', command: () => this.menuPick('list') },
        { label: 'นำเข้า', items: [{ label: 'Excel', command: () => this.menuPick('excel') }, { label: 'CSV', command: () => this.menuPick('csv') }] },
        { separator: true },
        { label: 'เก็บถาวร', disabled: true },
      ],
    },
    { label: 'รายงาน', badge: '3', items: [{ label: 'สรุปผล', command: () => this.menuPick('summary') }, { label: 'ซ่อนไว้', visible: false }] },
    { label: 'คู่มือ', url: '#menubar' },
    { label: 'ปิดอยู่', disabled: true },
    { label: 'ไม่แสดง', visible: false },
  ];
  profileItems = [
    { label: 'บัญชี', items: [{ label: 'โปรไฟล์', icon: 'pi pi-user', command: () => this.menuPick('profile') }, { label: 'เปลี่ยนรหัสผ่าน', command: () => this.menuPick('password') }] },
    { separator: true },
    { label: 'ช่วยเหลือ', url: '#menubar' },
    { label: 'ปิดอยู่', disabled: true },
    { label: 'ออกจากระบบ', icon: 'pi pi-sign-out', command: () => this.menuPick('logout') },
  ];
  sideItems = [
    { label: 'หน้าหลัก', command: () => this.menuPick('home') },
    { label: 'นักเรียน', command: () => this.menuPick('students') },
    { label: 'ซ่อนไว้', visible: false },
    { label: 'รายงาน', badge: '2', command: () => this.menuPick('reports') },
  ];
  tabPages = [
    { label: 'ภาพรวม', command: () => this.menuPick('tab:overview') },
    { label: 'คะแนน', command: () => this.menuPick('tab:scores') },
    { label: 'ปิดอยู่', disabled: true },
    { label: 'เวลาเรียน', command: () => this.menuPick('tab:time') },
  ];
  tabPage: MenuItem | null = this.tabPages[0];
  panelItems: MenuItem[] = [
    {
      label: 'งานทะเบียน',
      icon: 'pi pi-book',
      expanded: true,
      items: [
        { label: 'นักเรียน', command: () => this.menuPick('pm:students') },
        { label: 'รายงาน', items: [{ label: 'รายเดือน', command: () => this.menuPick('pm:monthly') }, { label: 'รายปี', command: () => this.menuPick('pm:yearly') }] },
        { separator: true },
        { label: 'ปิดอยู่', disabled: true },
      ],
    },
    { label: 'การเงิน', items: [{ label: 'ค่าเทอม', command: () => this.menuPick('pm:fees') }] },
    { label: 'ออกจากระบบ', command: () => this.menuPick('pm:logout') },
  ];
  panelItemsMulti: MenuItem[] = [
    { label: 'หนึ่ง', items: [{ label: 'หนึ่ง-ก' }] },
    { label: 'สอง', items: [{ label: 'สอง-ก' }] },
  ];
  stepIndex = 1;
  stepVerticalIndex = 0;
  stepItems: MenuItem[] = [
    { label: 'ข้อมูลส่วนตัว', command: () => this.menuPick('st:0') },
    { label: 'ที่อยู่', command: () => this.menuPick('st:1') },
    { label: 'เอกสาร', disabled: true },
    { label: 'ยืนยัน', command: () => this.menuPick('st:3') },
  ];
  menuPick(name: string): void {
    this.menuLog = name;
  }
  picked: unknown[] = [];
  chosen: { name: string } | null = null;
  lazyRows: unknown[] = [];
  lazyTotal = 0;
  lazyLoading = false;
  lazyLog = '';

  /** A pretend server: pages and sorts on its side, answers after a short wait. */
  loadLazy(e: { first: number; rows: number; page: number; sortField?: string | null; sortOrder?: number }): void {
    this.lazyLoading = true;
    this.lazyLog = `page=${e.page} first=${e.first} rows=${e.rows} sort=${e.sortField || '-'}:${e.sortOrder ?? ''}`;
    setTimeout(() => {
      const all = this.students.slice();
      if (e.sortField === 'name') all.sort((a, b) => a.name.localeCompare(b.name, 'th') * (e.sortOrder || 1));
      this.lazyRows = all.slice(e.first, e.first + e.rows);
      this.lazyTotal = all.length;
      this.lazyLoading = false;
      this.cdr.markForCheck();
    }, 150);
  }
  provinces = [
    { id: 10, name_th: 'กรุงเทพมหานคร', code: 'BKK' },
    { id: 40, name_th: 'ขอนแก่น', code: 'KKC' },
    { id: 50, name_th: 'เชียงใหม่', code: 'CNX' },
    { id: 57, name_th: 'เชียงราย', code: 'CEI', inactive: true },
    { id: 83, name_th: 'ภูเก็ต', code: 'HKT' },
    { id: 90, name_th: 'สงขลา', code: 'SKA' },
  ];
  regions = [
    { label: 'ภาคเหนือ', items: [{ name: 'เชียงใหม่' }, { name: 'ลำปาง' }] },
    { label: 'ภาคใต้', items: [{ name: 'ภูเก็ต' }, { name: 'สงขลา' }] },
  ];
  titles = ['นาย', 'นาง', 'นางสาว'];
  sel = { province: null as number | null, search: 83 as number | null, region: null as string | null, object: null as unknown, title: null as string | null, loadingTitle: 'นาย' as string | null };
  isOptionsLoading = true;
  monthIndex = 0;
  review = { agree: false, email: '', phone: '', pw: '', pw2: '' };
  meters = [
    { label: 'แอป', value: 16 },
    { label: 'ข้อความ', value: 8 },
    { label: 'สื่อ', value: 24, color: '#f59e0b' },
  ];
  log: string[] = [];
  readonly maxDate = new Date(2026, 3, 20);
  extras = { name: '', bold: false, plan: 'basic' as string | null, score: 3, pw: '' };
  plans = [
    { id: 'basic', name: 'พื้นฐาน' },
    { id: 'pro', name: 'โปร' },
    { id: 'team', name: 'ทีม' },
  ];

  /** Template-driven form (ngModel). */
  tdf = { name: '', note: '', agree: false, docs: [] as string[], plan: '', notify: false };

  /** Reactive form. */
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    note: new FormControl('', { nonNullable: true }),
    agree: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    plan: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notify: new FormControl(false, { nonNullable: true }),
  });

  /** The page's own texts in Thai and English (@wirabyte/ui/i18n). */
  readonly i18n = this.setupI18n();
  private readonly theme = inject(WuThemeService);
  private readonly config = inject(WuConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly alert = inject(WuAlertService);
  private readonly confirmation = inject(WuConfirmationService);
  private readonly messages = inject(WuMessageService);

  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        this.cdr.markForCheck();
        resolve();
      }, 600)
    );

  fireAlert(): void {
    this.alert.fire('บันทึกแล้ว', 'ข้อมูลถูกบันทึกเรียบร้อย', 'success').then((r) => this.note('alert:' + JSON.stringify(r)));
  }

  /** Through the static facade, as code that called a global alert function does. */
  askAlert(): void {
    WuAlert.fire({
      title: 'ลบรายการนี้?',
      text: 'กู้คืนไม่ได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    }).then((r) => this.note('question:' + (r.isConfirmed ? 'yes' : r.dismiss)));
  }

  askInput(): void {
    this.alert
      .fire({
        title: 'ชื่อผู้ติดต่อ',
        input: 'text',
        inputPlaceholder: 'พิมพ์ชื่อ',
        showCancelButton: true,
        inputValidator: (v) => (v ? null : 'กรุณากรอกชื่อ'),
        preConfirm: (v) => new Promise((resolve) => setTimeout(() => resolve(String(v).toUpperCase()), 300)),
      })
      .then((r) => this.note('input:' + r.value));
  }

  askConfirm(): void {
    this.confirmation.confirm({
      header: 'ยืนยัน',
      message: 'บันทึกการเปลี่ยนแปลง?',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => this.note('confirm:accept'),
      reject: (type) => this.note('confirm:reject:' + type),
    });
  }

  showToast(): void {
    this.messages.add({ severity: 'success', summary: 'สำเร็จ', detail: 'บันทึกข้อมูลแล้ว', life: 2500 });
  }

  note(entry: string): void {
    this.log = [...this.log, entry];
    this.cdr.markForCheck();
  }

  /** Dates in local time, so the test reads the same in every time zone. */
  datesText(): string {
    const f = (d: unknown): unknown =>
      d instanceof Date ? `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}` : Array.isArray(d) ? d.map(f) : d;
    return JSON.stringify(Object.fromEntries(Object.entries(this.dates).map(([k, v]) => [k, f(v)])), null, 1);
  }

  useBlue(): void {
    this.theme.setPrimary('#2563eb');
  }

  useScale(scale: 'sm' | null): void {
    this.theme.setScale(scale);
  }

  /** A whole theme from TypeScript; it replaces the SCSS/CSS theme values in the tokens layer. */
  /** Switches component UI strings at run time, as an app's language menu would. */
  useEnglish(): void {
    this.config.setTranslation(EN_LOCALE);
  }

  useSiam(): void {
    this.theme.setPreset(definePreset(Siam, { semantic: { primary: palette('#e11d48') } }));
  }

  toggleDark(): void {
    this.theme.setDarkMode(!this.theme.isDarkMode());
  }

  submit(): void {
    this.form.markAllAsTouched();
  }

  patch(): void {
    this.form.patchValue({ name: 'กัญญาณัฐ', note: 'บรรทัด 1\nบรรทัด 2', agree: true, plan: 'art', notify: true });
  }

  toggleDisabled(): void {
    if (this.form.enabled) this.form.disable();
    else this.form.enable();
  }

  sliderValue = 40;
  sliderRange = [20, 60];
  splitItems: MenuItem[] = [
    { label: 'บันทึกเป็นร่าง', command: () => this.note('split:draft') },
    { label: 'ลบ', command: () => this.note('split:delete') },
  ];
  rooms = [
    { name: 'ม.1/1', code: '101' },
    { name: 'ม.1/2', code: '102' },
    { name: 'ม.2/1', code: '201', disabled: true },
    { name: 'ม.3/1', code: '301' },
  ];
  room: { name: string; code: string } | null = null;
  roomCodes: string[] = [];
  photos = [
    { title: 'ภาพ 1', color: '#fca5a5' },
    { title: 'ภาพ 2', color: '#fdba74' },
    { title: 'ภาพ 3', color: '#86efac' },
    { title: 'ภาพ 4', color: '#93c5fd' },
    { title: 'ภาพ 5', color: '#c4b5fd' },
  ];
  photoIndex = 0;
  galleryFull = false;
  color = '#6466f1';
  colorRgb = { r: 16, g: 185, b: 129 };
  crumbs: MenuItem[] = [{ label: 'นักเรียน', command: () => this.note('crumb:students') }, { label: 'ม.1/1' }, { label: 'สมชาย' }];
  crumbHome: MenuItem = { command: () => this.note('crumb:home') };
  blocked = false;
  pageBlocked = false;
  numbers = Array.from({ length: 20 }, (_, i) => i + 1);
  manyRows = Array.from({ length: 1000 }, (_, i) => 'แถวที่ ' + (i + 1));
  drawerOpen = false;
  sidebarOpen = false;
  tieredItems: MenuItem[] = [
    {
      label: 'ไฟล์',
      icon: 'pi pi-file',
      items: [
        { label: 'ใหม่', command: () => this.note('tm:new') },
        { label: 'ส่งออก', items: [{ label: 'PDF', command: () => this.note('tm:pdf') }, { label: 'Excel', command: () => this.note('tm:excel') }] },
      ],
    },
    { separator: true },
    { label: 'ลบ', icon: 'pi pi-trash', command: () => this.note('tm:delete') },
    { label: 'ปิดใช้งาน', disabled: true },
  ];
  treeNodes: TreeNode[] = this.makeTree();
  treeNodes2: TreeNode[] = this.makeTree();
  treePicked: TreeNode[] = [];
  treeNode: TreeNode | null = null;
  ctxRoom: { name: string; code: string } | null = null;
  ctxItems: MenuItem[] = [{ label: 'เปิดห้อง', command: () => this.note('ctx:' + (this.ctxRoom?.name || '')) }];

  makeTree(): TreeNode[] {
    return [
      {
        key: 'a',
        label: 'ด้านที่ 1 การบริหาร',
        children: [
          { key: 'a1', label: 'แผนงาน' },
          { key: 'a2', label: 'งบประมาณ', children: [{ key: 'a2x', label: 'รายรับ' }, { key: 'a2y', label: 'รายจ่าย' }] },
        ],
      },
      { key: 'b', label: 'ด้านที่ 2 วิชาการ', children: [{ key: 'b1', label: 'หลักสูตร' }] },
    ];
  }

  pickedKeys(): string {
    return this.treePicked
      .map((n) => n.key)
      .sort()
      .join(',');
  }

  blockPage(): void {
    this.pageBlocked = true;
    setTimeout(() => {
      this.pageBlocked = false;
      this.cdr.markForCheck();
    }, 400);
  }

  stepModel: MenuItem[] = [
    { label: 'ข้อมูล', subtitle: 'ชื่อและวันเกิด' },
    { label: 'ที่อยู่' },
    { label: 'ยืนยัน', command: () => this.note('spm:confirm') },
  ];
  stepModelIndex = 0;
  meterParts = [
    { label: 'ก', value: 30, color: '#10b981' },
    { label: 'ข', value: 20, color: '#3b82f6' },
  ];
  msMore: string[] = ['101', '102', '301'];
  tabModelPage: MenuItem | null = this.tabPages[1];

  navLinks: MenuItem[] = [
    { label: 'หน้าแรก', url: '#nv' },
    { label: 'ข่าวสาร', url: '#nv', badge: '3' },
    {
      label: 'บริการ',
      items: [
        { label: 'ตารางเรียน', command: () => this.note('nv:schedule') },
        { label: 'ผลการเรียน', command: () => this.note('nv:grades') },
        { label: 'ปิดปรับปรุง', disabled: true },
      ],
    },
    { label: 'เกี่ยวกับเรา', command: () => this.note('nv:about') },
    { label: 'ซ่อนอยู่', visible: false },
  ];
  /** No router on the playground: the current page is marked with [activeItem]. */
  navActive: MenuItem = this.navLinks[0];
  navShort: MenuItem[] = [
    { label: 'บทความ', command: () => this.note('nv:articles') },
    { label: 'ผลงาน', command: () => this.note('nv:works') },
  ];

  amItems: MenuItem[] = this.makeAsideItems();
  amSectionItems: MenuItem[] = this.makeAsideItems();
  /** No router on the playground: the current page is marked with [activeItem] (รายงาน → สรุปผล). */
  amActive: MenuItem = (this.amItems[2].items as MenuItem[])[0];
  amCollapsed = false;
  amOpen = false;
  amBarLinks: MenuItem[] = [
    { label: 'ประกาศ', command: () => this.note('am:bar:news') },
    { label: 'ติดต่อ', url: '#am' },
  ];

  makeAsideItems(): MenuItem[] {
    return [
      { label: 'แดชบอร์ด', command: () => this.note('am:dashboard') },
      {
        label: 'นักเรียน',
        icon: 'pi pi-users',
        items: [
          { label: 'รายชื่อ', command: () => this.note('am:list') },
          {
            label: 'นำเข้า',
            items: [
              { label: 'Excel', command: () => this.note('am:excel') },
              { label: 'CSV', command: () => this.note('am:csv') },
            ],
          },
          { label: 'ส่งออก', items: [{ label: 'PDF', command: () => this.note('am:pdf') }] },
        ],
      },
      {
        label: 'รายงาน',
        icon: 'pi pi-chart-bar',
        badge: '2',
        items: [
          { label: 'สรุปผล', url: '#am' },
          { label: 'สถิติ', command: () => this.note('am:stats') },
        ],
      },
      { separator: true },
      { label: 'ตั้งค่า', command: () => this.note('am:settings') },
      { label: 'ปิดใช้งาน', icon: 'pi pi-ban', disabled: true },
      { label: 'ซ่อนอยู่', visible: false },
    ];
  }

  // ---------- image cropper (#ic-section) ----------
  /** A 320 × 200 PNG drawn in the page (the fixture has no network). */
  icImage = this.cropperTestImage();
  icToolsKind = '';
  icFile: Blob | null = this.icImage ? base64ToFile(this.icImage) : null;
  icBox: CropperPosition | null = null;
  icRatioBox: CropperPosition | null = null;
  icCropped: WuImageCroppedEvent | null = null;
  icRatioSize = '';
  icFreeSize = '';

  /** Four coloured quarters and a white dot, so turns and mirrors are easy to see. */
  cropperTestImage(): string {
    if (typeof document === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ['#10b981', '#6366f1', '#f59e0b', '#e11d48'].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect((i % 2) * 160, Math.floor(i / 2) * 100, 160, 100);
    });
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(60, 50, 18, 0, Math.PI * 2);
    ctx.fill();
    return canvas.toDataURL('image/png');
  }

  // ---------- terminal, image compare, carousel, splitter, organization chart, knob, input otp (parity2.spec) ----------
  private readonly terminal = inject(WuTerminalService);
  readonly terminalAnswers = this.terminal.commandHandler.subscribe((text) => this.answer(text));
  icmpValue = 50;
  crsItems = ['#fca5a5', '#fdba74', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4'].map((color, i) => ({ title: 'ข่าว ' + (i + 1), color }));
  crsResponsive = [
    { breakpoint: '767px', numVisible: 2, numScroll: 2 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ];
  crsPage = 0;
  crsAutoplay = 0;
  splSizes: number[] = [];
  splNestedSizes: number[] = [];
  ocData: TreeNode[] = this.makeChart();
  ocData2: TreeNode[] = this.makeChart();
  ocPicked: TreeNode | null = null;
  ocMany: TreeNode[] = [];
  knobValue = 40;
  knobValue2 = 70;
  readonly knobForm = new FormGroup({ level: new FormControl(10, { nonNullable: true }) });
  otpCode = '';
  otpSecret = '';
  otpCustom = '';

  /** The terminal's commands: greet and sum; anything else is unknown. */
  answer(text: string): void {
    const [name, ...args] = text.trim().split(/\s+/);
    if (name === 'greet') this.terminal.sendResponse('สวัสดี ' + args.join(' '));
    else if (name === 'sum') this.terminal.sendResponse(args.reduce((total, n) => total + Number(n), 0));
    else this.terminal.sendResponse('ไม่รู้จักคำสั่ง: ' + name);
  }

  /** A made-up school's chart (no real names). */
  makeChart(): TreeNode[] {
    return [
      {
        label: 'ผู้อำนวยการ',
        type: 'person',
        expanded: true,
        data: { name: 'วิระ ใจดี', title: 'ผู้อำนวยการโรงเรียนวิระ' },
        children: [
          { label: 'ฝ่ายวิชาการ', expanded: true, children: [{ label: 'กลุ่มสาระภาษาไทย' }, { label: 'กลุ่มสาระคณิตศาสตร์' }] },
          { label: 'ฝ่ายบริหารทั่วไป', children: [{ label: 'งานอาคารสถานที่' }] },
          { label: 'ฝ่ายงบประมาณ', selectable: false },
        ],
      },
    ];
  }

  ocManyLabels(): string {
    return this.ocMany.map((n) => n.label).join(',');
  }

  // ---------- flow (flow.spec) ----------
  // wu-flow (#flow): two-way binding
  flowNodes: FlowNode[] = [
    { id: 'start', type: 'input', position: { x: 0, y: 0 }, data: { label: 'ยื่นคำร้อง' } },
    { id: 'wira', type: 'person', position: { x: 280, y: 70 }, ariaLabel: 'วิระ', data: { name: 'วิระ', role: 'ครูประจำชั้น' } },
    { id: 'check', position: { x: 0, y: 140 }, data: { label: 'ตรวจเอกสาร' } },
    { id: 'done', type: 'output', position: { x: 300, y: 220 }, data: { label: 'อนุมัติ' } },
    { id: 'group', type: 'group', position: { x: 520, y: 0 }, width: 220, height: 150, data: { label: 'งานทะเบียน' } },
    { id: 'child', parentId: 'group', extent: 'parent', position: { x: 30, y: 50 }, data: { label: 'บันทึกผล' } },
  ];
  flowEdges: FlowEdge[] = [
    { id: 'e-start-wira', source: 'start', target: 'wira', label: 'ส่งต่อ' },
    { id: 'e-start-check', source: 'start', target: 'check', type: 'smoothstep', animated: true },
    { id: 'e-check-done', source: 'check', target: 'done', type: 'step' },
  ];
  flowViewport: FlowViewport = { x: 40, y: 60, zoom: 1 };
  flowEdgeDefaults: Partial<FlowEdge> = { markerEnd: 'arrowclosed' };
  flowSel = '';
  flowSvgSize = 0;

  // ---------- wu-flow (#flow-controlled): the page applies the changes ----------
  flowCtlNodes: FlowNode[] = [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'ก' } },
    { id: 'b', position: { x: 200, y: 80 }, data: { label: 'ข' } },
  ];
  flowCtlEdges: FlowEdge[] = [{ id: 'ab', source: 'a', target: 'b' }];

  flowNodesText(): string {
    return this.flowNodes.map((n) => `${n.id}@${Math.round(n.position.x)},${Math.round(n.position.y)}${n.selected ? '*' : ''}`).join(' ');
  }

  flowEdgesText(): string {
    return this.flowEdges.map((e) => `${e.source}>${e.target}`).join(' ');
  }

  flowVpText(): string {
    const v = this.flowViewport;
    return `${Math.round(v.x)},${Math.round(v.y)},${v.zoom.toFixed(2)}`;
  }

  flowSelection(e: WuFlowSelectionChange): string {
    return e.nodes.map((n) => n.id).join(',') + '|' + e.edges.map((x) => x.id).join(',');
  }

  flowRoundTrip(flow: WuFlow): void {
    const json = JSON.stringify(flow.toJSON());
    this.note('flow:json:' + (flow.fromJSON(json) ? JSON.parse(json).nodes.length : 'failed'));
  }

  applyFlowNodeChanges(changes: FlowNodeChange[], nodes: FlowNode[]): FlowNode[] {
    return applyNodeChanges(changes, nodes);
  }

  applyFlowEdgeChanges(changes: FlowEdgeChange[], edges: FlowEdge[]): FlowEdge[] {
    return applyEdgeChanges(changes, edges);
  }

  flowCtlText(): string {
    return this.flowCtlNodes.map((n) => `${n.id}@${Math.round(n.position.x)},${Math.round(n.position.y)}${n.selected ? '*' : ''}`).join(' ');
  }

  // ---------- release 1 ----------
  r1Dialog = false;
  r1Note = 'บรรทัดแรก\nบรรทัดที่สอง\nบรรทัดที่สาม';
  r1Date = new Date(2026, 10, 4);
  r1Trail = [{ label: 'คำร้อง' }, { label: 'TK-0001' }];
  r1Filters = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'เปิด', value: 'open' },
    { label: 'กำลังทำ', value: 'doing' },
    { label: 'ปิดแล้ว', value: 'closed' },
  ];
  r1Filter = 'open';
  r1Kinds = [
    { label: 'ซอฟต์แวร์', value: 'sw', icon: 'wi wi-code', description: 'โปรแกรม เว็บ บัญชีผู้ใช้' },
    { label: 'ฮาร์ดแวร์', value: 'hw', icon: 'wi wi-desktop', description: 'เครื่อง อุปกรณ์ เครือข่าย' },
  ];
  r1Kind = 'sw';
  r1Meter = [
    { label: 'เปิด', value: 12 },
    { label: 'กำลังทำ', value: 8 },
    { label: 'ปิดแล้ว', value: 30 },
  ];
  r1Clicked = '';
  r1Signature: string | null = null;
  r1Messages: { id: number; text: string; time: Date; sender: { id: string; name: string }; mine?: boolean; read?: boolean }[] = [
    { id: 1, text: 'สวัสดีครับ เครื่องพิมพ์ใช้ไม่ได้', time: new Date(Date.now() - 3600000), sender: { id: 'c1', name: 'วิระ ใจดี' } },
    { id: 2, text: 'รับเรื่องแล้วครับ', time: new Date(Date.now() - 3000000), sender: { id: 'me', name: 'ทีมงาน' }, read: true },
  ];
  r1View: 'day' | 'week' | 'month' = 'week';
  r1Day = new Date();
  r1Events: { id: string; title: string; start: Date; end?: Date; allDay?: boolean }[] = [
    { id: 'a', title: 'ติดตั้งเครื่องพิมพ์', start: this.r1At(0, 9, 0), end: this.r1At(0, 10, 30) },
    { id: 'b', title: 'ตรวจเครือข่าย', start: this.r1At(0, 10, 0), end: this.r1At(0, 11, 0) },
    { id: 'c', title: 'ประชุมทีม', start: this.r1At(1, 13, 0), end: this.r1At(1, 14, 0) },
    { id: 'd', title: 'วันหยุด', start: this.r1At(2, 0, 0), allDay: true },
  ];

  r1At(days: number, hours: number, minutes: number): Date {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, hours, minutes);
  }
  r1Send(text: string): void {
    this.r1Messages = [...this.r1Messages, { id: this.r1Messages.length + 1, text, time: new Date(), sender: { id: 'me', name: 'ทีมงาน' } }];
  }
  r1Move(event: unknown, start: Date, end: Date): void {
    this.r1Events = this.r1Events.map((e) => (e === event ? { ...e, start, end } : e));
  }

  setupI18n(): WuI18n {
    const i18n = inject(WuI18n);
    i18n.add('th', { menu: { home: 'หน้าแรก' } });
    i18n.add('en', { 'บันทึก': 'Save', 'สวัสดี {name}': 'Hello {name}', menu: { home: 'Home' } });
    return i18n;
  }
}
