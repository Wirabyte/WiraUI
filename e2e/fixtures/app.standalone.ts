import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme';
import type { MenuItem, Message } from 'wiratheme/api';
import { WtButton, WtButtonDirective } from 'wiratheme/button';
import { WtCard } from 'wiratheme/card';
import { WtCheckbox } from 'wiratheme/checkbox';
import { definePreset, palette, Siam, WtConfig, WtThemeService } from 'wiratheme/config';
import { EN_LOCALE } from 'wiratheme/core';
import { WtAlert, WtAlertService } from 'wiratheme/alert';
import { WtConfirmationService } from 'wiratheme/confirmdialog';
import { WtMessageService } from 'wiratheme/toast';
import { WtInputText } from 'wiratheme/inputtext';
import { WtRadioButton } from 'wiratheme/radiobutton';
import { WtTextarea } from 'wiratheme/textarea';
import { WtToggleSwitch } from 'wiratheme/toggleswitch';
import { WtTag } from 'wiratheme/tag';
import { WtBadge } from 'wiratheme/badge';
import { WtChip } from 'wiratheme/chip';
import { WtAvatar, WtAvatarGroup } from 'wiratheme/avatar';
import { WtDivider } from 'wiratheme/divider';
import { WtSkeleton } from 'wiratheme/skeleton';
import { WtProgressBar } from 'wiratheme/progressbar';
import { WtProgressSpinner } from 'wiratheme/progressspinner';
import { WtMessage } from 'wiratheme/message';
import { WtPanel } from 'wiratheme/panel';
import { WtFieldset } from 'wiratheme/fieldset';
import { WtIconField, WtInputIcon } from 'wiratheme/iconfield';
import { WtInputGroup, WtInputGroupAddon } from 'wiratheme/inputgroup';
import { WtFloatLabel } from 'wiratheme/floatlabel';
import { WtToggleButton } from 'wiratheme/togglebutton';
import { WtSelectButton } from 'wiratheme/selectbutton';
import { WtRating } from 'wiratheme/rating';
import { WtPassword } from 'wiratheme/password';
import { WtToolbar } from 'wiratheme/toolbar';
import { WtAccordion, WtAccordionContent, WtAccordionHeader, WtAccordionPanel, WtAccordionTab } from 'wiratheme/accordion';
import { WtTab, WtTabList, WtTabPanel, WtTabPanels, WtTabs } from 'wiratheme/tabs';
import { WtInputNumber } from 'wiratheme/inputnumber';
import { WtDatePicker } from 'wiratheme/datepicker';
import { WtDialog } from 'wiratheme/dialog';
import { WtTemplate } from 'wiratheme/config';
import { WtConfirmDialog } from 'wiratheme/confirmdialog';
import { WtToast } from 'wiratheme/toast';
import { WtTooltip } from 'wiratheme/tooltip';
import { WtPopover } from 'wiratheme/popover';
import { WtAnimate } from 'wiratheme/animate';
import { WtMeterGroup } from 'wiratheme/metergroup';
import { WtSelect } from 'wiratheme/select';
import { WtTableModule } from 'wiratheme/table';
import { WtMenubar } from 'wiratheme/menubar';
import { WtMenu } from 'wiratheme/menu';
import { WtTabMenu } from 'wiratheme/tabmenu';
import { WtMultiSelect } from 'wiratheme/multiselect';
import { WtInputMask } from 'wiratheme/inputmask';
import { WtMessages } from 'wiratheme/message';
import { WtTimeline } from 'wiratheme/timeline';
import { WtChart } from 'wiratheme/chart';
import { WtImage } from 'wiratheme/image';
import { WtAutoComplete } from 'wiratheme/autocomplete';
import { WtPanelMenu } from 'wiratheme/panelmenu';
import { WtSteps } from 'wiratheme/steps';
import { WtValidationModule } from 'wiratheme/validation';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    WtMenubar,
    WtMenu,
    WtTabMenu,
    WtMultiSelect,
    WtInputMask,
    WtMessages,
    WtTimeline,
    WtChart,
    WtImage,
    WtAutoComplete,
    WtPanelMenu,
    WtSteps,
    ReactiveFormsModule,
    JsonPipe,
    WtButton,
    WtCard,
    WtInputText,
    WtTextarea,
    WtCheckbox,
    WtRadioButton,
    WtToggleSwitch,
    WtTag,
    WtBadge,
    WtChip,
    WtAvatar,
    WtAvatarGroup,
    WtDivider,
    WtSkeleton,
    WtProgressBar,
    WtProgressSpinner,
    WtMessage,
    WtPanel,
    WtFieldset,
    WtIconField,
    WtInputIcon,
    WtInputGroup,
    WtInputGroupAddon,
    WtFloatLabel,
    WtToggleButton,
    WtSelectButton,
    WtRating,
    WtPassword,
    WtToolbar,
    WtAccordion,
    WtAccordionTab,
    WtAccordionPanel,
    WtAccordionHeader,
    WtAccordionContent,
    WtTabs,
    WtTabPanel,
    WtTabList,
    WtTab,
    WtTabPanels,
    WtInputNumber,
    WtDatePicker,
    WtDialog,
    WtTemplate,
    WtConfirmDialog,
    WtToast,
    WtTooltip,
    WtPopover,
    WtAnimate,
    WtButtonDirective,
    WtMeterGroup,
    WtSelect,
    WtTableModule,
    WtValidationModule,
  ],
  templateUrl: './app.component.html',
})
export class App {
  readonly major = WIRATHEME_MAJOR;
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
    { id: 1, name: 'สตรีศรีน่าน' },
    { id: 2, name: 'ศรีสวัสดิ์วิทยาคาร' },
    { id: 3, name: 'น่านนคร' },
    { id: 4, name: 'สารสาสน์', closed: true },
    { id: 5, name: 'ทวีธาภิเศก' },
  ];
  schoolHits: { id: number; name: string }[] = [];
  ac = { school: null as unknown, free: null as unknown };
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

  private readonly theme = inject(WtThemeService);
  private readonly config = inject(WtConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly alert = inject(WtAlertService);
  private readonly confirmation = inject(WtConfirmationService);
  private readonly messages = inject(WtMessageService);

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
    WtAlert.fire({
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
}
