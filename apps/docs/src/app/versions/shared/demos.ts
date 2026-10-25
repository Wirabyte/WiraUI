import { effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocsState } from '../../core/docs-state';
import { DocsI18n } from '../../core/i18n';
import { DOCS_THEME, DOCS_VERSION, presetGroups } from '../../core/version-theme';
import { BUTTON_DOC } from '../../data/button';
import { AVATAR_DOC, BADGE_DOC, CHIP_DOC, PROGRESSBAR_DOC, PROGRESSSPINNER_DOC, SAMPLE_IMAGE, SKELETON_DOC, TAG_DOC } from '../../data/display';
import { DIVIDER_DOC, FIELDSET_DOC, MESSAGE_DOC, PANEL_DOC } from '../../data/panels';
import { ACCORDION_DOC, TABS_DOC, TOOLBAR_DOC } from '../../data/panels-more';
import { INPUTNUMBER_DOC } from '../../data/inputnumber';
import { DATEPICKER_DOC } from '../../data/datepicker';
import { ALERT_DOC, CONFIRMDIALOG_DOC, DIALOG_DOC } from '../../data/overlays';
import { ANIMATE_DOC, POPOVER_DOC, TOAST_DOC, TOOLTIP_DOC } from '../../data/overlays-more';
import { DOCS_OVERLAYS, DOCS_VALIDATORS } from '../../core/overlays';
import { METERGROUP_DOC } from '../../data/metergroup';
import { VALIDATION_DOC } from '../../data/validation';
import { SELECT_DOC } from '../../data/select';
import { PAGINATOR_DOC, REPORT_PLACEHOLDERS, TABLE_DOC } from '../../data/table';
import { MENUBAR_DOC } from '../../data/menubar';
import { PANELMENU_DOC } from '../../data/panelmenu';
import { STEPS_DOC } from '../../data/steps';
import { STEPPER_DOC } from '../../data/stepper';
import { ORDERLIST_DOC, PICKLIST_DOC } from '../../data/picklist';
import { FILEUPLOAD_DOC } from '../../data/fileupload';
import { EDITOR_DOC } from '../../data/editor';
import { KEYFILTER_DOC, RIPPLE_DOC } from '../../data/directives';
import { CHART_DOC } from '../../data/chart';
import { IMAGE_DOC } from '../../data/image';
import { AUTOCOMPLETE_DOC } from '../../data/autocomplete';
import { MENU_DOC, TABMENU_DOC } from '../../data/menu';
import { MULTISELECT_DOC } from '../../data/multiselect';
import { INPUTMASK_DOC } from '../../data/inputmask';
import { TIMELINE_DOC } from '../../data/timeline';
import { CARD_DOC, CARD_DOC_CLASSIC } from '../../data/card';
import {
  FLOATLABEL_DOC,
  ICONFIELD_DOC,
  INPUTGROUP_DOC,
  PASSWORD_DOC,
  RATING_DOC,
  SELECTBUTTON_DOC,
  TOGGLEBUTTON_DOC,
} from '../../data/form-extras';
import { CHECKBOX_DOC } from '../../data/checkbox';
import { INPUTTEXT_DOC } from '../../data/inputtext';
import { RADIOBUTTON_DOC } from '../../data/radiobutton';
import { TEXTAREA_DOC } from '../../data/textarea';
import { TOGGLESWITCH_DOC } from '../../data/toggleswitch';
import { ComponentDoc } from '../../core/component-doc';
import * as S from '../../shared/pages/samples';
import { SampleText, sampleText } from '../../core/sample-text';
import { Snippet } from '../../core/snippets';

/*
 * State and handlers behind the component pages. Each version module declares a tiny subclass with
 * the shared template (shared/<name>.html), so the same page compiles against v1, v2 or v3 components.
 * Sample content follows the site language: the templates bind their Thai text through `tx()` and their
 * data through `local()`, and the code samples go through the same phrase list (core/sample-text.ts),
 * so the English demo shows exactly what the English code says.
 */

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

abstract class DemoPage {
  protected readonly i18n = inject(DocsI18n);
  protected readonly en = this.i18n.en;
  /** English for the Thai in this page's samples. */
  protected abstract get words(): SampleText;

  /** Sample text in the site language: `tx('บันทึก')` is "Save" on the English site. */
  protected tx(th: string): string {
    return this.en() ? this.words.swap(th) : th;
  }

  /** Sample data in the site language (the same copy each time, so components see no change). */
  protected local<T>(data: T): T {
    return this.en() ? this.words.local(data) : data;
  }

  /**
   * For state that starts from sample text (chips, a picked value): runs `reset` now and again when the
   * site language changes, so the demo never mixes languages. Call it from a constructor.
   */
  protected onLang(reset: () => void): void {
    effect(() => {
      this.en();
      untracked(reset);
    });
  }
}

/** Component pages: the doc data, with the code samples in the site language. */
export abstract class SimpleDemo extends DemoPage {
  protected abstract readonly doc: ComponentDoc;
  protected get words(): SampleText {
    return sampleText(this.doc.english);
  }
  protected get sec() {
    return this.doc.sections;
  }
  protected get code(): Record<string, Snippet> {
    return this.words.snippets(this.doc.code, this.i18n.lang());
  }
  protected get ts(): Record<string, Snippet> {
    return this.words.snippets(this.doc.ts || {}, this.i18n.lang());
  }
}

export abstract class ButtonDemo extends SimpleDemo {
  protected readonly doc = BUTTON_DOC;
  saved = 0;
  clicks = 0;
  isApiSaving = false;
  /** [action] takes the function itself, so the method is bound once (as the sample shows). */
  save = this.saveProfile.bind(this);

  saveProfile(): Promise<void> {
    return wait(900).then(() => void this.saved++);
  }

  saveDraft(): void {
    this.isApiSaving = true;
    setTimeout(() => (this.isApiSaving = false), 1200);
  }
}

export abstract class CardDemo extends SimpleDemo {
  /** Glass is a v3 card: v1 / v2 get the page without it. */
  protected readonly glass = inject(DOCS_VERSION).major === 3;
  protected readonly doc = this.glass ? CARD_DOC : CARD_DOC_CLASSIC;
  isPageLoading = true;
}

export abstract class CheckboxDemo extends SimpleDemo {
  protected readonly doc = CHECKBOX_DOC;
  sizeValue = true;
  readonly topics = [
    { value: 'news', label: 'ข่าวสาร' },
    { value: 'deals', label: 'โปรโมชัน' },
    { value: 'product', label: 'อัปเดตสินค้า' },
  ];
  agree = false;
  selected: string[] = ['deals'];
  newsletter = 'N';
  invalidAgree = false;
  readonly form = new FormGroup({
    terms: new FormControl(false, Validators.requiredTrue),
    privacy: new FormControl(false, Validators.requiredTrue),
  });

  patch(): void {
    this.form.patchValue({ terms: true, privacy: true });
  }
}

export abstract class InputTextDemo extends SimpleDemo {
  protected readonly doc = INPUTTEXT_DOC;
  name = '';
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
  });

  patch(): void {
    this.form.patchValue({ name: this.tx('สมชาย ใจดี'), email: this.en() ? 'alex@example.com' : 'somchai@example.com' });
  }
}

export abstract class RadioButtonDemo extends SimpleDemo {
  protected readonly doc = RADIOBUTTON_DOC;
  delivery = 'standard';
  payment = 'card';
  sizeValue = 'md';
  plan = '';
  readonly sizes = [
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
  ];
  size = 'm';
  readonly form = new FormGroup({
    billing: new FormControl('', Validators.required),
  });

  patch(): void {
    this.form.patchValue({ billing: 'yearly' });
  }
}

export abstract class TextareaDemo extends SimpleDemo {
  protected readonly doc = TEXTAREA_DOC;
  note = '';
  address = '';
  readonly form = new FormGroup({
    details: new FormControl('', Validators.minLength(10)),
  });

  fill(): void {
    this.form.patchValue({ details: this.tx('เข้าสู่ระบบไม่ได้\nหลังเปลี่ยนรหัสผ่าน\nลองแล้วทั้งมือถือและคอมพิวเตอร์') });
  }
}

export abstract class ToggleSwitchDemo extends SimpleDemo {
  protected readonly doc = TOGGLESWITCH_DOC;
  sizeValue = true;
  newsletter = false;
  status = 'inactive';
  readonly form = new FormGroup({
    email: new FormControl(true),
    sms: new FormControl(false),
  });

  toggleLock(): void {
    const sms = this.form.controls.sms;
    if (sms.disabled) sms.enable();
    else sms.disable();
  }
}

/** Theming → Presets: the version's own catalog, applied through DocsState. */
export abstract class PresetsDemo extends DemoPage {
  protected readonly state = inject(DocsState);
  protected readonly theme = inject(DOCS_THEME);
  protected readonly v = inject(DOCS_VERSION);
  protected readonly groups = presetGroups(this.theme.presets);
  protected get words(): SampleText {
    return sampleText(S.PRESET_WORDS);
  }
  agree = true;
  plan = 'pro';
  newsletter = true;

  protected use(id: string): void {
    this.state.choosePreset(id);
  }

  protected tsCode(): string {
    const id = this.state.activePresetId();
    const info = this.theme.info(id);
    return this.tx(S.tsPreset(this.v, id, info?.name || id, info?.scheme === 'dark'));
  }

  protected scssCode(): string {
    const id = this.state.activePresetId();
    return this.v.major === 1
      ? `@use 'wiratheme/theme' with (\n  $theme: '${id}',\n);`
      : `@use 'wiratheme/theme' with (\n  $preset: '${id}',\n);`;
  }

  protected cssCode(): string {
    return `"styles": ["node_modules/wiratheme/themes/${this.state.activePresetId()}/theme.css", "src/styles.css"]`;
  }
}

export abstract class TagDemo extends SimpleDemo {
  protected readonly doc = TAG_DOC;
}

export abstract class BadgeDemo extends SimpleDemo {
  protected readonly doc = BADGE_DOC;
  unread = 3;

  markRead(): void {
    this.unread = 0;
  }
}

export abstract class ChipDemo extends SimpleDemo {
  protected readonly doc = CHIP_DOC;
  protected readonly image = SAMPLE_IMAGE;
  tags: string[] = [];

  constructor() {
    super();
    // The chips are sample text: start again in the new language.
    this.resetTags();
    this.onLang(() => this.resetTags());
  }

  remove(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  resetTags(): void {
    this.tags = this.local(['ด่วน', 'ลูกค้าใหม่', 'รอโทรกลับ']);
  }
}

export abstract class AvatarDemo extends SimpleDemo {
  protected readonly doc = AVATAR_DOC;
  protected readonly image = SAMPLE_IMAGE;
}

export abstract class SkeletonDemo extends SimpleDemo {
  protected readonly doc = SKELETON_DOC;
}

export abstract class ProgressBarDemo extends SimpleDemo {
  protected readonly doc = PROGRESSBAR_DOC;
  progress = 30;

  step(): void {
    this.progress = this.progress >= 100 ? 0 : this.progress + 10;
  }
}

export abstract class ProgressSpinnerDemo extends SimpleDemo {
  protected readonly doc = PROGRESSSPINNER_DOC;
}

export abstract class DividerDemo extends SimpleDemo {
  protected readonly doc = DIVIDER_DOC;
}

export abstract class PanelDemo extends SimpleDemo {
  protected readonly doc = PANEL_DOC;
  filtersClosed = true;
}

export abstract class FieldsetDemo extends SimpleDemo {
  protected readonly doc = FIELDSET_DOC;
  moreClosed = false;
}

/** A message for wt-messages (the docs keep no wiratheme import here). */
type Notice = { severity: string; summary: string; detail: string; closable?: boolean; key?: string; life?: number };

export abstract class MessageDemo extends SimpleDemo {
  protected readonly doc = MESSAGE_DOC;
  private readonly messageService = inject(DOCS_OVERLAYS).messages;
  showClosable = true;
  showTimed = true;
  closed = 0;
  notices: Notice[] = [];

  constructor() {
    super();
    this.resetNotices();
    this.onLang(() => this.resetNotices());
  }

  resetNotices(): void {
    this.notices = this.local([
      { severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลนักเรียนถูกบันทึกเรียบร้อย' },
      { severity: 'warn', summary: 'ใกล้ครบกำหนด', detail: 'ส่งเอกสารภายในวันศุกร์', closable: false },
      { severity: 'error', summary: 'อัปโหลดไม่สำเร็จ', detail: 'ไฟล์ใหญ่เกิน 5 MB' },
    ]);
  }

  sendForm(): void {
    this.messageService.add(
      this.local({ key: 'form', severity: 'info', summary: 'ส่งแบบฟอร์มแล้ว', detail: 'จะได้รับอีเมลยืนยันภายใน 5 นาที', life: 5000 })
    );
  }

  onClosed(): void {
    this.closed++;
    this.showClosable = false;
  }

  showAgain(): void {
    this.showClosable = true;
    this.showTimed = true;
  }
}

export abstract class IconFieldDemo extends SimpleDemo {
  protected readonly doc = ICONFIELD_DOC;
}

export abstract class InputGroupDemo extends SimpleDemo {
  protected readonly doc = INPUTGROUP_DOC;
}

export abstract class FloatLabelDemo extends SimpleDemo {
  protected readonly doc = FLOATLABEL_DOC;
  name = '';
  over = '';
  on = '';
  inside = '';
}

export abstract class ToggleButtonDemo extends SimpleDemo {
  protected readonly doc = TOGGLEBUTTON_DOC;
  sizeValue = true;
  pinned = false;
  following = true;
  form = new FormGroup({ notify: new FormControl(true) });
}

export abstract class SelectButtonDemo extends SimpleDemo {
  protected readonly doc = SELECTBUTTON_DOC;
  sizeValue = 'pro';
  plans = [
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Team', value: 'team' },
  ];
  plan = 'pro';
  days = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  workdays: string[] = [];
  range = '';
  formPlans = [
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'ent', disabled: true },
  ];
  form = new FormGroup({ plan: new FormControl('free') });
  readonly views = [
    { label: 'รายการ', value: 'list', icon: 'pi pi-bars' },
    { label: 'ตาราง', value: 'grid', icon: 'pi pi-th-large' },
  ];
  view = 'list';

  constructor() {
    super();
    // The picked days and range are sample text: start again in the new language.
    this.resetPicks();
    this.onLang(() => this.resetPicks());
  }

  resetPicks(): void {
    this.workdays = this.local(['จ', 'อ', 'พ', 'พฤ', 'ศ']);
    this.range = this.tx('สัปดาห์');
  }
}

export abstract class RatingDemo extends SimpleDemo {
  protected readonly doc = RATING_DOC;
  score = 3;
  score10 = 7;
  rated: number | null = null;
}

export abstract class PasswordDemo extends SimpleDemo {
  protected readonly doc = PASSWORD_DOC;
  sizeValue = '';
  password = '';
  pin = '';
  secret = '';
  strongRule = '^(?=.*[A-Z])(?=.*[0-9]).{10,}$';
  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
}

export abstract class ToolbarDemo extends SimpleDemo {
  protected readonly doc = TOOLBAR_DOC;
}

export abstract class AccordionDemo extends SimpleDemo {
  protected readonly doc = ACCORDION_DOC;
  open: number | number[] | null = 0;
  openList: number | number[] | null = [0];
  lastEvent = '';
  detailsOpen = false;
  faq = 'apply';
  faqs = ['apply', 'fees'];
  lastPanel = '';
  gapOpen: number | number[] | null = 0;
  joinedOpen: number | number[] | null = 0;

  logPanel(kind: string, value: unknown): void {
    this.lastPanel = kind + ' ' + value;
  }

  log(kind: string, index: number): void {
    this.lastEvent = kind + ' #' + index;
  }
}

export abstract class TabsDemo extends SimpleDemo {
  protected readonly doc = TABS_DOC;
  tab = 0;
  changed: number | null = null;
  section = 'info';
  aliasTab = 0;
  months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  /** 14 tabs written in the value form: the row scrolls with edge arrows too. */
  readonly units = Array.from({ length: 14 }, (_, i) => i + 1);
  unit = 1;
  readonly pages: MenuEntry[] = [
    { label: 'ข้อมูลทั่วไป', icon: 'pi pi-id-card' },
    { label: 'ผลการเรียน', icon: 'pi pi-chart-line', badge: '2' },
    { label: 'ผู้ปกครอง', icon: 'pi pi-users' },
    { label: 'สุขภาพ', icon: 'pi pi-heart', disabled: true },
  ];
  // activeItem is matched by identity: start from the copy the tabs get (local() gives an English one).
  page: MenuEntry | null | undefined = null;

  constructor() {
    super();
    this.onLang(() => (this.page = this.local(this.pages)[0]));
    this.page = this.local(this.pages)[0];
  }
}

export abstract class InputNumberDemo extends SimpleDemo {
  protected readonly doc = INPUTNUMBER_DOC;
  limited: number | null = null;
  limitedPrice: number | null = null;
  sizeValue: number | null = 25;
  protected get helpersCode(): string {
    return this.ts['helpers'] as string;
  }
  quantity: number | null = 1200;
  price: number | null = 1234.5;
  rate: number | null = 3.1416;
  year: number | null = 2026;
  weight: number | null = 60;
  discount: number | null = 15;
  seats: number | null = 2;
  volume: number | null = 2.5;
  fee: number | null = 350;
  stepSeats: number | null = 2;
  cleared = 0;
  lastKey = '';
  form = new FormGroup({
    budget: new FormControl<number | null>(50000, [Validators.required, Validators.max(100000)]),
  });

  feeCleared(): void {
    this.cleared++;
  }

  keyPressed(event: KeyboardEvent): void {
    this.lastKey = event.key;
  }
}

const pad2 = (n: number) => String(n).padStart(2, '0');

export abstract class DatePickerDemo extends SimpleDemo {
  protected readonly doc = DATEPICKER_DOC;
  readonly events = [5, 14, 21];
  sizeValue: Date | null = new Date(2026, 2, 12);
  basicDate: Date | null = new Date(2026, 2, 12);
  // Not 'date': the page has an <ng-template #date>, whose name would shadow it in the template.
  day: Date | null = new Date(2026, 2, 12);
  // Text in the era the page shows: Gregorian when the site is in English.
  dueText: string | null = this.en() ? '12/03/2026' : '12/03/2569';
  typed: Date | null = null;
  meeting: Date | null = new Date(2026, 2, 12, 9, 30, 0);
  start: Date | null = new Date(2026, 2, 12, 8, 0);
  start2: Date | null = new Date(2026, 2, 12, 8, 0);
  stay: (Date | null)[] | null = [new Date(2026, 2, 12), new Date(2026, 2, 15)];
  shifts: Date[] | null = [new Date(2026, 2, 2), new Date(2026, 2, 9)];
  month: Date | null = new Date(2026, 2, 1);
  year: Date | null = new Date(2026, 0, 1);
  alarm: Date | null = new Date(2026, 2, 12, 18, 45);
  visit: Date | null = new Date(2026, 2, 12);
  minDate = new Date(2026, 2, 5);
  maxDate = new Date(2026, 3, 30);
  holidays = [new Date(2026, 3, 6), new Date(2026, 3, 13), new Date(2026, 3, 14), new Date(2026, 3, 15)];
  due: Date | null = null;
  inlineDate: Date | null = new Date(2026, 2, 12);
  touchDate: Date | null = new Date(2026, 2, 12);
  today = new Date();
  form = new FormGroup({ birthday: new FormControl<Date | null>(null, Validators.required) });

  constructor() {
    super();
    // The text model follows the era of the site language (the TS sample shows the same value).
    this.onLang(() => (this.dueText = this.en() ? '12/03/2026' : '12/03/2569'));
  }

  /** Model values shown under the demos: local date (and time when set), never shifted to UTC. */
  show(v: unknown): string {
    const one = (d: unknown): string => {
      if (!(d instanceof Date)) return JSON.stringify(d ?? null);
      const day = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      const time = d.getHours() || d.getMinutes() || d.getSeconds() ? ` ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}` : '';
      return day + time;
    };
    return Array.isArray(v) ? `[${v.map(one).join(', ')}]` : one(v);
  }
}

export abstract class DialogDemo extends SimpleDemo {
  protected readonly doc = DIALOG_DOC;
  visible = false;
  name = '';
  slotsVisible = false;
  posVisible = false;
  position = 'center';
  readonly positions = ['top', 'bottom', 'left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright', 'center'];
  wideVisible = false;
  noteVisible = false;
  maskVisible = false;
  headlessVisible = false;
  events: string[] = [];

  constructor() {
    super();
    // The name in the profile box is sample text: it follows the site language.
    this.onLang(() => (this.name = this.tx('สมหญิง ใจดี')));
  }

  openAt(position: string): void {
    this.position = position;
    this.posVisible = true;
  }

  log(event: string): void {
    this.events = [...this.events.slice(-3), event];
  }
}

/** Alert, confirm and toast demos call the services of the version on screen. */
abstract class OverlayDemo extends SimpleDemo {
  protected readonly overlays = inject(DOCS_OVERLAYS);
  result = '';

  protected keep(r: unknown): void {
    this.result = JSON.stringify(r);
  }
}

export abstract class AlertDemo extends OverlayDemo {
  protected readonly doc = ALERT_DOC;
  protected get importCode(): string {
    return this.ts['import'] as string;
  }
  private notify: { fire(options: unknown): Promise<unknown> } | null = null;

  protected get alert() {
    return this.overlays.alert;
  }

  async fireIcon(title: string, text: string, icon: string): Promise<void> {
    this.keep(await this.alert.fire(this.tx(title), this.tx(text), icon));
  }

  async remove(): Promise<void> {
    // Options go through local(): the English site gets the texts the English code shows.
    const r = await this.alert.fire(this.local({
      title: 'ลบรายการนี้?',
      text: 'ลบแล้วกู้คืนไม่ได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#dc2626',
      focusCancel: true,
    }));
    this.keep(r);
    if (r.isConfirmed) this.alert.fire(this.tx('ลบแล้ว'), '', 'success');
  }

  async leave(): Promise<void> {
    this.keep(
      await this.alert.fire(this.local({
        title: 'บันทึกการแก้ไขก่อนออก?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        denyButtonText: 'ไม่บันทึก',
      }))
    );
  }

  async askEmail(): Promise<void> {
    const r = await this.alert.fire(this.local({
      title: 'ส่งใบเสร็จทางอีเมล',
      input: 'email',
      inputPlaceholder: 'name@example.com',
      showCancelButton: true,
      inputValidator: (v: unknown) => (!v ? this.tx('กรุณากรอกอีเมล') : undefined),
    }));
    this.keep(r);
    if (r.value) this.alert.fire(this.tx('ส่งแล้ว'), String(r.value), 'success');
  }

  async askBranch(): Promise<void> {
    this.keep(
      await this.alert.fire(this.local({
        title: 'เลือกสาขา',
        input: 'select',
        inputOptions: { bkk: 'กรุงเทพฯ', cnx: 'เชียงใหม่', hkt: 'ภูเก็ต' },
        inputPlaceholder: 'เลือกสาขา',
        showCancelButton: true,
        inputValidator: (v: unknown) => (!v ? this.tx('กรุณาเลือกสาขา') : undefined),
      }))
    );
  }

  async askSize(): Promise<void> {
    this.keep(
      await this.alert.fire(this.local({
        title: 'ขนาดเสื้อ',
        input: 'radio',
        inputOptions: { s: 'S', m: 'M', l: 'L', xl: 'XL' },
        inputValue: 'm',
        showCancelButton: true,
      }))
    );
  }

  async askComment(): Promise<void> {
    this.keep(await this.alert.fire(this.local({ title: 'ความคิดเห็น', input: 'textarea', inputPlaceholder: 'บอกเราได้เลย', showCancelButton: true })));
  }

  async askTerms(): Promise<void> {
    this.keep(
      await this.alert.fire(this.local({
        title: 'เงื่อนไขการใช้งาน',
        input: 'checkbox',
        inputPlaceholder: 'ฉันยอมรับเงื่อนไข',
        confirmButtonText: 'ดำเนินการต่อ',
        inputValidator: (v: unknown) => (!v ? this.tx('ต้องยอมรับเงื่อนไขก่อน') : undefined),
      }))
    );
  }

  async request(): Promise<void> {
    const r = await this.alert.fire(this.local({
      title: 'ขอใบเสนอราคา',
      input: 'text',
      inputLabel: 'ชื่อบริษัท',
      inputValue: 'บริษัท ตัวอย่าง จำกัด',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        await wait(1200);
        return 'Q-10234';
      },
    }));
    this.keep(r);
    if (r.isConfirmed) this.alert.fire(this.tx('ส่งคำขอแล้ว'), this.tx('เลขที่ ') + r.value, 'success');
  }

  async autosave(): Promise<void> {
    this.keep(await this.alert.fire({ title: this.tx('บันทึกอัตโนมัติแล้ว'), icon: 'success', timer: 2000, timerProgressBar: true, showConfirmButton: false }));
  }

  async promo(): Promise<void> {
    this.keep(
      await this.alert.fire(this.local({
        title: 'ส่วนลดสมาชิก',
        html: 'ใช้โค้ด <b>WELCOME20</b> รับส่วนลด <b>20%</b> ถึงสิ้นเดือนนี้',
        icon: 'info',
        confirmButtonText: 'ใช้โค้ด',
        confirmButtonColor: '#7c3aed',
        footer: '<a href="https://example.com/terms">อ่านเงื่อนไข</a>',
        width: '32rem',
      }))
    );
  }

  async logout(): Promise<void> {
    this.keep(await this.alert.confirm(this.tx('ออกจากระบบ?'), this.tx('งานที่ยังไม่บันทึกจะหายไป')));
  }

  async copied(): Promise<void> {
    this.notify ??= this.alert.mixin({ icon: 'success', timer: 1500, showConfirmButton: false });
    this.keep(await this.notify.fire({ title: this.tx('คัดลอกลิงก์แล้ว') }));
  }

  async sync(): Promise<void> {
    this.alert.showLoading();
    await wait(1500);
    this.alert.close();
    this.keep('synced');
  }

  async legacy(): Promise<void> {
    this.keep(await this.overlays.staticAlert.fire({ title: this.tx('บันทึกแล้ว'), icon: 'success' }));
  }
}

export abstract class ConfirmDialogDemo extends OverlayDemo {
  protected readonly doc = CONFIRMDIALOG_DOC;
  protected get importCode(): string {
    return this.ts['import'] as string;
  }
  readonly icons = ['warning', 'question', 'info', 'success', 'error'];

  // Options and results go through local() / tx(): the English site gets the texts the English code shows.
  remove(): void {
    this.overlays.confirm.confirm(this.local({
      header: 'ยืนยันการลบ',
      message: 'ต้องการลบลูกค้ารายนี้หรือไม่?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ลบ',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-danger',
      defaultFocus: 'reject',
      accept: () => (this.result = this.tx('ลบแล้ว')),
      // 2 = WtConfirmEventType.CANCEL: closed with the ×, Esc or the mask
      reject: (type: number) => (this.result = this.tx(type === 2 ? 'ปิดไป' : 'ยกเลิก')),
    }));
  }

  ask(icon: string): void {
    this.overlays.confirm.confirm({ header: 'icon: ' + icon, message: this.tx('ข้อความตัวอย่าง'), icon, accept: () => (this.result = icon) });
  }

  askTop(): void {
    this.overlays.confirm.confirm(this.local({
      key: 'top',
      header: 'บันทึกแบบร่าง',
      message: 'บันทึกก่อนออกจากหน้านี้?',
      icon: 'question',
      accept: () => (this.result = this.tx('บันทึกแบบร่างแล้ว')),
    }));
  }

  invite(): void {
    this.overlays.confirm.confirm(this.local({
      key: 'custom',
      header: 'คำเชิญเข้าทีม',
      message: 'กมล ชวนคุณเข้าร่วมทีม "การตลาด"',
      accept: () => (this.result = this.tx('เข้าร่วมแล้ว')),
      reject: () => (this.result = this.tx('ไว้ก่อน')),
    }));
  }

  askNowhere(): void {
    this.overlays.confirm.confirm(this.local({
      key: 'none',
      header: 'ส่งออกไฟล์?',
      message: 'ไฟล์จะถูกส่งไปที่อีเมลของคุณ',
      icon: 'info',
      accept: () => (this.result = this.tx('ส่งออกแล้ว')),
    }));
  }
}

export abstract class ToastDemo extends OverlayDemo {
  protected readonly doc = TOAST_DOC;
  readonly severities = ['success', 'info', 'warn', 'error', 'secondary', 'contrast'];
  dialogOpen = false;

  protected get messages() {
    return this.overlays.messages;
  }

  // Messages go through local() / tx(): the English site gets the texts the English code shows.
  save(): void {
    this.messages.add(this.local({ severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย' }));
  }

  show(severity: string): void {
    this.messages.add({ severity, summary: severity, detail: this.tx('ข้อความตัวอย่าง') });
  }

  at(key: string, summary: string): void {
    this.messages.add({ key, severity: 'info', summary: this.tx(summary), detail: this.tx('ข้อความตัวอย่าง') });
  }

  sticky(): void {
    this.messages.add(this.local({ severity: 'warn', summary: 'ต้องตรวจสอบ', detail: 'ค้างไว้จนกว่าจะปิด', sticky: true }));
  }

  long(): void {
    this.messages.add({ severity: 'info', summary: this.tx('แสดง 10 วินาที'), life: 10000 });
  }

  clear(): void {
    this.messages.clear();
    for (const key of ['bl', 'tc', 'invite']) this.messages.clear(key);
  }

  share(): void {
    this.messages.add(this.local({ key: 'invite', summary: 'สมหญิงแชร์เอกสาร', detail: 'รายงานยอดขายเดือนมีนาคม', data: { initial: 'ส' }, life: 6000 }));
  }

  fromDialog(): void {
    this.messages.add(this.local({ severity: 'success', summary: 'ส่งแล้ว', detail: 'toast ขึ้นเหนือ dialog' }));
  }
}

export abstract class TooltipDemo extends SimpleDemo {
  protected readonly doc = TOOLTIP_DOC;
  off = true;
  /** The HTML tooltip of the demo (a field: a URL inside a template expression would read as a comment). */
  readonly proHint = "<b>แพ็กเกจ Pro</b><br>ผู้ใช้ไม่จำกัด · <a href='https://example.com'>ดูราคา</a>";
}

export abstract class PopoverDemo extends SimpleDemo {
  protected readonly doc = POPOVER_DOC;
  readonly team = ['สมหญิง', 'กมล', 'ณัฐ', 'ปวีณา'];
  owner = '';

  constructor() {
    super();
    // The picked name is sample text: start over when the site language changes.
    this.onLang(() => (this.owner = ''));
  }
}

export abstract class AnimateDemo extends SimpleDemo {
  protected readonly doc = ANIMATE_DOC;
  protected get setupCode(): string {
    return this.ts['import'] as string;
  }
  readonly families = [
    { name: 'fade', items: ['fade', 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'fade-up-right', 'fade-up-left', 'fade-down-right', 'fade-down-left'] },
    {
      name: 'zoom',
      items: ['zoom-in', 'zoom-in-up', 'zoom-in-down', 'zoom-in-left', 'zoom-in-right', 'zoom-out', 'zoom-out-up', 'zoom-out-down', 'zoom-out-left', 'zoom-out-right'],
    },
    { name: 'flip', items: ['flip-up', 'flip-down', 'flip-left', 'flip-right'] },
    { name: 'slide', items: ['slide-up', 'slide-down', 'slide-left', 'slide-right'] },
  ];
}

export abstract class MeterGroupDemo extends SimpleDemo {
  protected readonly doc = METERGROUP_DOC;
  readonly single = [{ label: 'ใช้ไป', value: 32 }];
  readonly storage = [
    { label: 'รูปภาพ', value: 24 },
    { label: 'วิดีโอ', value: 16 },
    { label: 'เอกสาร', value: 12 },
    { label: 'อื่น ๆ', value: 8 },
  ];
  readonly storageIcons = [
    { label: 'รูปภาพ', value: 24, icon: 'pi pi-image' },
    { label: 'วิดีโอ', value: 16, icon: 'pi pi-video' },
    { label: 'เอกสาร', value: 12, icon: 'pi pi-file' },
  ];
  readonly usedGb = [
    { label: 'ระบบ', value: 40, color: '#64748b' },
    { label: 'แอป', value: 56, color: '#1e7ae0' },
  ];
}

export abstract class ValidationDemo extends SimpleDemo {
  protected readonly doc = VALIDATION_DOC;
  protected get helpersCode(): string {
    return this.ts['helpers'] as string;
  }
  email = '';
  phone = '';
  branchCode = '12345';
  nickname = '';
  templateResult = '';
  /** Each version module provides its own WtValidators (the match validator reads the sibling control). */
  protected readonly validators = inject(DOCS_VALIDATORS);
  form = new FormGroup({
    thaiId: new FormControl('', [Validators.required, this.validators.thaiId]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm: new FormControl('', [Validators.required, this.validators.match('password')]),
  });

  saveTemplate(valid: boolean | null): void {
    this.templateResult = valid ? 'valid' : 'invalid';
  }

  register(): void {
    this.form.markAllAsTouched();
  }
}

type Province = { id: number; code: string; name_th: string; name_en: string };

export abstract class SelectDemo extends SimpleDemo {
  protected readonly doc = SELECT_DOC;
  readonly provinces: Province[] = [
    { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
    { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
    { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
    { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
    { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
  ];
  readonly regions = [
    { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
    { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
    { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
  ];
  readonly levels = [
    { id: 'k1', name: 'อนุบาล 1' },
    { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
    { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
    { id: 'm4', name: 'มัธยมศึกษาปีที่ 4', closed: true },
  ];
  readonly titles = ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง'];
  provinceId: number | null = null;
  searchId: number | null = null;
  clearId: number | null = 50;
  groupId: number | null = null;
  levelId: string | null = null;
  province: Province | null = null;
  moreId: number | null = null;
  title = '';
  checkId: number | null = 83;
  sizeTitle: string | null = null;
  lookId: number | null = null;
  requiredId: number | null = null;
  other: Province | null = null;
  keyed: { id: number; name_th: string } | null = null;
  added = 0;
  form = new FormGroup({ level: new FormControl('', Validators.required) });

  addProvince(): void {
    this.added++;
  }

  reload(): void {
    // A fresh object each time, as from an API (English keys and names on the English site).
    this.keyed = this.local({ id: 50, name_th: 'เชียงใหม่' });
  }
}

type Student = { id: number; code: string; name: string; room: string; score: number; club: { name: string }; status: string; birthDate: string };
/** The parts of the table's lazy-load event and the paginator's page event the demos read (no wiratheme import here). */
type LazyEvent = { first: number; rows: number; page: number; sortField?: string | null; sortOrder?: number };
type PageEvent = { page: number; first: number; rows: number; pageCount: number };

const FIRST_NAMES = ['ด.ช.กิตติพัฒน์', 'ด.ญ.ปภาวรินทร์', 'ด.ช.ธนกฤต', 'ด.ญ.พิมพ์ชนก', 'ด.ช.ศุภกร', 'ด.ญ.ชนิดา', 'ด.ช.อนุชา', 'ด.ญ.กมลชนก', 'ด.ช.วรเมธ', 'ด.ญ.สุภัสสรา', 'ด.ช.ภูมิพัฒน์', 'ด.ญ.ณัฐธิดา'];
const LAST_NAMES = ['ใจดี', 'สุขสวัสดิ์', 'ทองคำ', 'แสงจันทร์', 'บุญมา', 'ศรีสุข', 'วงศ์ไทย', 'รักเรียน', 'พงษ์ไพร', 'มีสุข', 'เกิดผล', 'คงมั่น', 'ชัยมงคล'];
const ROOMS = ['ม.1/1', 'ม.1/2', 'ม.1/10', 'ม.2/1', 'ม.2/3'];
const CLUBS = ['ดนตรีไทย', 'หุ่นยนต์', 'บาสเกตบอล', 'ภาษาจีน', 'คณิตศาสตร์'];
const STATUSES = ['กำลังศึกษา', 'กำลังศึกษา', 'กำลังศึกษา', 'พักการเรียน', 'กำลังศึกษา', 'ย้ายออก'];

/** Students with unique names; some have no club, to show empty cells sorting last. */
function makeStudents(count: number, offset = 0): Student[] {
  return Array.from({ length: count }, (_, k) => {
    const i = k + offset;
    return {
      id: i + 1,
      code: String(66001 + i),
      name: FIRST_NAMES[i % FIRST_NAMES.length] + ' ' + LAST_NAMES[(i * 5) % LAST_NAMES.length],
      room: ROOMS[(i * 3) % ROOMS.length],
      score: 60 + ((i * 37 + 27) % 40),
      club: { name: i % 9 === 4 ? '' : CLUBS[(i * 2) % CLUBS.length] },
      status: STATUSES[i % STATUSES.length],
      birthDate: `2012-${pad2(1 + ((i * 5) % 12))}-${pad2(1 + ((i * 11) % 28))}`,
    };
  });
}

/** Rows of a group sit together: sorted by room, numbers inside read as numbers (ม.1/2 before ม.1/10). */
function byRoomOrder(rows: Student[]): Student[] {
  return [...rows].sort((a, b) => a.room.localeCompare(b.room, 'th', { numeric: true }) || a.id - b.id);
}

/** Rows as the demos show them: the template passes them through local(), so English names on the English site. */
export abstract class TableDemo extends SimpleDemo {
  protected readonly doc = TABLE_DOC;
  protected readonly placeholders = REPORT_PLACEHOLDERS;
  readonly few = makeStudents(5);
  readonly students = makeStudents(23);
  readonly none: Student[] = [];
  readonly frozenRows = makeStudents(8);
  readonly byRoom = byRoomOrder(makeStudents(12));
  /** Students with a paid flag, for the boolean column filter. */
  readonly paidStudents = makeStudents(23).map((s, i) => ({ ...s, paid: i % 4 !== 1 }));
  readonly rooms = ['ม.1/1', 'ม.1/2', 'ม.1/10', 'ม.2/1', 'ม.2/3'];
  readonly exportColumns = [
    { field: 'code', header: 'รหัส' },
    { field: 'name', header: 'ชื่อ - สกุล' },
    { field: 'room', header: 'ห้อง' },
    { field: 'score', header: 'คะแนน' },
    { field: 'id', header: 'id', exportable: false },
  ];
  /** [exportFunction] takes the function itself, so the method is bound once (as the sample shows). */
  exportCell = this.formatCell.bind(this);
  expandedRows: Record<string, boolean> = { 1: true };
  lastToggle = '';
  pickedStudents: Student[] = [];
  csvText = '';
  reorderRows: Student[] = [];
  lastMove = '';
  readonly radioRows = makeStudents(6);
  leader: Student | null = null;
  metaPicked: Student[] = [];
  /** [rowSelectable] takes the function itself, so the method is bound once (as the sample shows). */
  canPick = this.isEnrolled.bind(this);
  editRows: Student[] = [];
  lastEdit = '';
  rowEditRows: Student[] = [];
  editingRows: Record<string, boolean> = {};
  rowsSaved = 0;
  cols: { field: string; header: string }[] = [];
  lastColumns = '';
  restoredCount = 0;
  totals: { label: string; score: number }[] = [];
  private clones: Record<number, Student> = {};
  isApiLoading = false;
  selectedStudent: Student | null = null;
  selectedStudents: Student[] = [];
  lazyRows: Student[] = [];
  totalRecords = 0;
  isLazyLoading = false;
  lazyLog = '';
  adminRows: Student[] = [];
  lastAction = '';
  private readonly server = makeStudents(57);
  private readonly alert = inject(DOCS_OVERLAYS).alert;
  private added = 0;
  private lastLazy: LazyEvent | null = null;

  constructor() {
    super();
    this.resetRows();
    this.onLang(() => this.resetRows());
  }

  /** Rows and picks that hold sample text start again in the new language. */
  resetRows(): void {
    this.adminRows = this.local(makeStudents(23));
    this.lastAction = '';
    this.selectedStudent = null;
    this.selectedStudents = [];
    this.expandedRows = { 1: true };
    this.lastToggle = '';
    this.pickedStudents = [];
    this.csvText = '';
    this.reorderRows = this.local(makeStudents(5));
    this.lastMove = '';
    this.leader = null;
    this.metaPicked = [];
    this.editRows = this.local(makeStudents(5));
    this.lastEdit = '';
    this.rowEditRows = this.local(makeStudents(4));
    this.editingRows = {};
    this.clones = {};
    this.cols = this.local([
      { field: 'code', header: 'รหัส' },
      { field: 'name', header: 'ชื่อ - สกุล' },
      { field: 'room', header: 'ห้อง' },
      { field: 'score', header: 'คะแนน' },
    ]);
    this.lastColumns = '';
    const scores = this.students.map((s) => s.score);
    this.totals = [{ label: this.tx('คะแนนเฉลี่ย'), score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 }];
    if (this.lastLazy) this.loadStudents(this.lastLazy);
  }

  reload(): void {
    this.isApiLoading = true;
    wait(1500).then(() => (this.isApiLoading = false));
  }

  /** A pretend API: sorts and pages 57 rows on the "server" after a short wait. */
  loadStudents(event: LazyEvent): void {
    this.lastLazy = event;
    // The first call comes while the table starts up: change the page state on the next tick.
    void Promise.resolve().then(() => {
      this.isLazyLoading = true;
      this.lazyLog = `page ${event.page} · rows ${event.rows}` + (event.sortField ? ` · ${event.sortField} ${event.sortOrder}` : '');
    });
    wait(500).then(() => {
      const field = event.sortField as keyof Student | null | undefined;
      const order = event.sortOrder ?? 1;
      const server = this.local(this.server);
      const rows = field ? [...server].sort((a, b) => String(a[field]).localeCompare(String(b[field]), 'th') * order) : server;
      this.lazyRows = rows.slice(event.first, event.first + event.rows);
      this.totalRecords = rows.length;
      this.isLazyLoading = false;
    });
  }

  /** th-TH writes the Buddhist year: 14 พ.ค. 2555; the English sample uses en-GB: 14 May 2012. */
  thaiDate(value: string): string {
    return new Date(value + 'T00:00:00').toLocaleDateString(this.en() ? 'en-GB' : 'th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  statusSeverity(status: string): 'success' | 'warn' | 'secondary' {
    return status === this.tx('กำลังศึกษา') ? 'success' : status === this.tx('พักการเรียน') ? 'warn' : 'secondary';
  }

  addStudent(): void {
    this.added++;
    const s = this.local(makeStudents(1, 60 + this.added))[0];
    this.adminRows = [{ ...s, id: 1000 + this.added, status: this.tx('กำลังศึกษา') }, ...this.adminRows];
    this.lastAction = this.tx('เพิ่ม: ') + s.name;
  }

  editStudent(student: Student): void {
    this.lastAction = this.tx('แก้ไข: ') + student.name;
  }

  async deleteStudent(student: Student): Promise<void> {
    if (!(await this.alert.confirm(this.tx('ลบข้อมูลนักเรียน?'), student.name))) return;
    this.adminRows = this.adminRows.filter((s) => s.id !== student.id);
    this.lastAction = this.tx('ลบ: ') + student.name;
  }

  rowOpened(event: { data: unknown }): void {
    this.lastToggle = 'onRowExpand: ' + (event.data as Student).name;
  }

  rowClosed(event: { data: unknown }): void {
    this.lastToggle = 'onRowCollapse: ' + (event.data as Student).name;
  }

  /** Students of a room in the grouped rows on screen (the site language's copy). */
  roomCount(room: string): number {
    return this.local(this.byRoom).filter((s) => s.room === room).length;
  }

  formatCell(cell: { data: unknown; field: string }): string {
    return cell.field === 'score' ? Number(cell.data).toFixed(2) : String(cell.data ?? '');
  }

  previewCsv(table: { toCSV(): string }): void {
    this.csvText = table.toCSV();
  }

  rowMoved(event: { dragIndex: number; dropIndex: number }): void {
    this.lastMove = event.dragIndex + ' → ' + event.dropIndex;
  }

  isEnrolled(row: { data: unknown; index?: number }): boolean {
    return (row.data as Student).status === this.tx('กำลังศึกษา');
  }

  cellSaved(event: { field: string; data: unknown }): void {
    this.lastEdit = event.field + ' · ' + (event.data as Student).name;
  }

  startEdit(student: Student): void {
    this.clones[student.id] = { ...student };
  }

  saveRow(student: Student): void {
    if (!student.name.trim()) return;
    delete this.clones[student.id];
    this.rowsSaved++;
  }

  cancelRow(student: Student): void {
    Object.assign(student, this.clones[student.id]);
    delete this.clones[student.id];
  }

  colResized(event: { delta: number }): void {
    this.lastColumns = 'onColResize: ' + Math.round(event.delta) + 'px';
  }

  colMoved(event: { columns: unknown[] }): void {
    this.lastColumns = 'onColReorder: ' + (event.columns as { field: string }[]).map((c) => c.field).join(', ');
  }

  scoreBand(table: { filterRules(field: string, rules: { value: unknown; matchMode: 'gte' | 'lt' }[], operator: 'and' | 'or'): void }): void {
    table.filterRules(
      'score',
      [
        { value: 80, matchMode: 'gte' },
        { value: 90, matchMode: 'lt' },
      ],
      'and'
    );
  }

  /** Students who need a follow-up first, not alphabetical (the site language's names). */
  sortStudents(event: { data: unknown[]; field?: string; order?: number }): void {
    const order = event.order ?? 1;
    const statusOrder = this.local(['พักการเรียน', 'ย้ายออก', 'กำลังศึกษา']);
    (event.data as Student[]).sort((a, b) => {
      const result =
        event.field === 'status' ? statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) : a.room.localeCompare(b.room, 'th', { numeric: true });
      return result * order;
    });
  }

  stateRestored(): void {
    this.restoredCount++;
  }

  idsOf(list: { id: number }[]): string {
    return list.length ? list.map((s) => s.id).join(', ') : '-';
  }

  /* Context menu: the row last right-clicked is what the commands act on. */
  ctxSelected: Student | null = null;
  ctxStudent: Student | null = null;
  ctxAction = '';
  readonly studentActions: MenuEntry[] = [
    { label: 'ดูประวัติ', icon: 'pi pi-eye', command: () => this.ctxView() },
    { label: 'ย้ายห้อง', icon: 'pi pi-share-alt', command: () => this.ctxMove() },
    { separator: true },
    { label: 'ลบ', icon: 'pi pi-trash', command: () => this.ctxDelete() },
  ];

  ctxView(): void {
    this.ctxAction = this.tx('ดูประวัติ') + ': ' + (this.ctxStudent?.name ?? '');
  }

  ctxMove(): void {
    this.ctxAction = this.tx('ย้ายห้อง') + ': ' + (this.ctxStudent?.name ?? '');
  }

  ctxDelete(): void {
    this.ctxAction = this.tx('ลบ') + ': ' + (this.ctxStudent?.name ?? '');
  }
}

export abstract class PaginatorDemo extends SimpleDemo {
  protected readonly doc = PAGINATOR_DOC;
  protected readonly placeholders = REPORT_PLACEHOLDERS;
  readonly students = makeStudents(23);
  first = 0;
  rows = 5;
  pageItems = this.local(this.students).slice(0, 5);
  reportFirst = 0;
  reportRows = 10;
  optionFirst = 0;
  slotFirst = 0;
  reloads = 0;

  constructor() {
    super();
    this.onLang(() => (this.pageItems = this.local(this.students).slice(this.first, this.first + this.rows)));
  }

  changePage(event: PageEvent): void {
    this.first = event.first;
    this.rows = event.rows;
    this.pageItems = this.local(this.students).slice(event.first, event.first + event.rows);
  }

  changeReport(event: PageEvent): void {
    this.reportFirst = event.first;
    this.reportRows = event.rows;
  }

  changeOptions(event: PageEvent): void {
    this.optionFirst = event.first;
  }

  changeSlots(event: PageEvent): void {
    this.slotFirst = event.first;
  }

  reload(): void {
    this.reloads++;
  }
}

/** A menu item as the Menubar demos build it (no wiratheme import here); `local()` hands the components English copies. */
export type MenuEntry = {
  label?: string;
  icon?: string;
  items?: MenuEntry[];
  command?: (event: { item?: MenuEntry }) => void;
  [key: string]: unknown;
};

export abstract class MenubarDemo extends SimpleDemo {
  protected readonly doc = MENUBAR_DOC;
  lastCommand = '';
  readonly items: MenuEntry[] = [
    { label: 'หน้าแรก', icon: 'pi pi-home' },
    {
      label: 'นักเรียน',
      icon: 'pi pi-users',
      items: [
        { label: 'รายชื่อนักเรียน', icon: 'pi pi-list' },
        { label: 'เพิ่มนักเรียน', icon: 'pi pi-user-plus' },
        { separator: true },
        { label: 'นำเข้าจาก Excel', icon: 'pi pi-upload' },
      ],
    },
    {
      label: 'รายงาน',
      icon: 'pi pi-chart-bar',
      items: [
        { label: 'ผลการเรียน', icon: 'pi pi-book', items: [{ label: 'ภาคเรียนที่ 1' }, { label: 'ภาคเรียนที่ 2' }] },
        { label: 'การมาเรียน', icon: 'pi pi-calendar' },
      ],
    },
    { label: 'ตั้งค่า', icon: 'pi pi-cog' },
  ];
  /** routerLinkActive compares the fragment too: only the section picked lights up. */
  private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };
  readonly links: MenuEntry[] = [
    {
      label: 'หัวข้อในหน้านี้',
      icon: 'pi pi-list',
      items: [
        { label: 'แถบหัวเว็บ', routerLink: [], fragment: 'header', routerLinkActiveOptions: this.sameSection },
        { label: 'คำสั่ง', routerLink: [], fragment: 'commands', routerLinkActiveOptions: this.sameSection },
        { label: 'คีย์บอร์ด', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
      ],
    },
    { label: 'ลิงก์และ router', icon: 'pi pi-hashtag', routerLink: [], fragment: 'router', routerLinkActiveOptions: this.sameSection },
    { label: 'คู่มือ router', icon: 'pi pi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
  ];
  readonly fileItems: MenuEntry[] = [
    {
      label: 'ไฟล์',
      icon: 'pi pi-file',
      items: [
        { label: 'สร้างใหม่', icon: 'pi pi-plus', command: (event) => this.run(event) },
        { label: 'พิมพ์', icon: 'pi pi-print', command: (event) => this.run(event) },
      ],
    },
    {
      label: 'แก้ไข',
      icon: 'pi pi-pencil',
      items: [
        { label: 'คัดลอก', icon: 'pi pi-copy', command: (event) => this.run(event) },
        { label: 'วาง', icon: 'pi pi-clipboard', command: (event) => this.run(event) },
      ],
    },
    { label: 'ช่วยเหลือ', icon: 'pi pi-question-circle', command: (event) => this.run(event) },
  ];
  readonly accountItems: MenuEntry[] = [
    { label: 'กล่องข้อความ', icon: 'pi pi-inbox', badge: '3' },
    {
      label: 'บัญชี',
      icon: 'pi pi-user',
      items: [
        { label: 'โปรไฟล์', icon: 'pi pi-user' },
        { label: 'ความปลอดภัย', icon: 'pi pi-lock', title: 'รหัสผ่านและการยืนยันตัวตน' },
        { separator: true },
        { label: 'ผู้ดูแลระบบ', icon: 'pi pi-shield', visible: false },
        { label: 'ลบบัญชี', icon: 'pi pi-trash', disabled: true },
      ],
    },
    { label: 'รายงาน', icon: 'pi pi-chart-bar', disabled: true },
    { separator: true },
    { label: '<b>ใหม่</b> ห้องสมุด', escape: false },
  ];
  readonly editorItems: MenuEntry[] = [
    {
      label: 'ไฟล์',
      items: [
        { label: 'สร้างใหม่', icon: 'pi pi-plus', shortcut: 'Ctrl+N' },
        { label: 'บันทึก', icon: 'pi pi-save', shortcut: 'Ctrl+S' },
        { label: 'พิมพ์', icon: 'pi pi-print', shortcut: 'Ctrl+P' },
      ],
    },
    {
      label: 'แก้ไข',
      items: [
        { label: 'คัดลอก', icon: 'pi pi-copy', shortcut: 'Ctrl+C' },
        { label: 'วาง', icon: 'pi pi-clipboard', shortcut: 'Ctrl+V' },
      ],
    },
  ];

  run(event: { item?: MenuEntry }): void {
    this.lastCommand = event.item?.label ?? '';
  }
}

/* ---------- Menu page ---------- */
export abstract class MenuDemo extends SimpleDemo {
  protected readonly doc = MENU_DOC;
  lastCommand = '';
  menuEvents: string[] = [];
  readonly profileItems: MenuEntry[] = [
    { label: 'โปรไฟล์ของฉัน', icon: 'pi pi-user', command: (event) => this.run(event) },
    { label: 'ตั้งค่าบัญชี', icon: 'pi pi-cog', command: (event) => this.run(event) },
    { separator: true },
    { label: 'ออกจากระบบ', icon: 'pi pi-sign-out', command: (event) => this.run(event) },
  ];
  readonly sideItems: MenuEntry[] = [
    { label: 'หน้าแรก', icon: 'pi pi-home' },
    { label: 'นักเรียน', icon: 'pi pi-users' },
    { label: 'ตารางเรียน', icon: 'pi pi-calendar' },
    { label: 'รายงาน', icon: 'pi pi-chart-bar' },
    { label: 'ตั้งค่า', icon: 'pi pi-cog' },
  ];
  readonly groupItems: MenuEntry[] = [
    {
      label: 'เอกสาร',
      items: [
        { label: 'สร้างใหม่', icon: 'pi pi-plus' },
        { label: 'ค้นหา', icon: 'pi pi-search' },
      ],
    },
    {
      label: 'บัญชี',
      items: [
        { label: 'ตั้งค่า', icon: 'pi pi-cog' },
        { label: 'ข้อความ', icon: 'pi pi-inbox', badge: '2' },
        { label: 'ออกจากระบบ', icon: 'pi pi-sign-out' },
      ],
    },
  ];
  readonly stateItems: MenuEntry[] = [
    { label: 'กล่องข้อความ', icon: 'pi pi-inbox', badge: '5' },
    { label: 'ส่งออก Excel', icon: 'pi pi-download', title: 'ไฟล์ .xlsx ของหน้านี้' },
    { separator: true },
    { label: 'ผู้ดูแลระบบ', icon: 'pi pi-shield', visible: false },
    { label: 'ลบทั้งหมด', icon: 'pi pi-trash', disabled: true },
  ];
  /** routerLinkActive compares the fragment too: only the section picked lights up. */
  private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };
  readonly linkItems: MenuEntry[] = [
    { label: 'เมนู popup', icon: 'pi pi-hashtag', routerLink: [], fragment: 'popup', routerLinkActiveOptions: this.sameSection },
    { label: 'คีย์บอร์ด', icon: 'pi pi-hashtag', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
    { label: 'คู่มือ router', icon: 'pi pi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
    { separator: true },
    { label: 'พิมพ์หน้านี้', icon: 'pi pi-print', command: (event) => this.run(event) },
    { label: 'คัดลอกลิงก์', icon: 'pi pi-copy', command: (event) => this.run(event) },
  ];

  run(event: { item?: MenuEntry }): void {
    this.lastCommand = event.item?.label ?? '';
  }

  logMenu(name: string): void {
    this.menuEvents = [...this.menuEvents.slice(-3), name];
  }
}

/* ---------- TabMenu page ---------- */
export abstract class TabMenuDemo extends SimpleDemo {
  protected readonly doc = TABMENU_DOC;
  readonly items: MenuEntry[] = [
    { label: 'ภาพรวม', icon: 'pi pi-th-large' },
    { label: 'นักเรียน', icon: 'pi pi-users' },
    { label: 'การเงิน', icon: 'pi pi-wallet' },
    { label: 'ตั้งค่า', icon: 'pi pi-cog' },
  ];
  readonly mailItems: MenuEntry[] = [
    { label: 'ทั้งหมด', icon: 'pi pi-inbox', command: (event) => this.open(event) },
    { label: 'ยังไม่อ่าน', icon: 'pi pi-envelope', badge: '3', command: (event) => this.open(event) },
    { label: 'ติดดาว', icon: 'pi pi-star', command: (event) => this.open(event) },
    { label: 'ถังขยะ', icon: 'pi pi-trash', disabled: true },
  ];
  /** routerLinkActive compares query params: the tab for the page's ?view= lights up. */
  private readonly sameView = { paths: 'exact', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored' };
  readonly viewItems: MenuEntry[] = [
    { label: 'การ์ด', icon: 'pi pi-th-large', routerLink: [], queryParams: { view: 'cards' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
    { label: 'รายการ', icon: 'pi pi-list', routerLink: [], queryParams: { view: 'list' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
    { label: 'แผนที่', icon: 'pi pi-map-marker', routerLink: [], queryParams: { view: 'map' }, queryParamsHandling: 'merge', fragment: 'router', routerLinkActiveOptions: this.sameView },
  ];
  readonly months: MenuEntry[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map(
    (label) => ({ label })
  );
  // activeItem is matched by identity: start from the copies the tab menus get (local() gives English ones).
  activeItem: MenuEntry | null = null;
  mailTab: MenuEntry | null = null;
  month: MenuEntry | null = null;
  lastCommand = '';

  constructor() {
    super();
    this.resetTabs();
    this.onLang(() => this.resetTabs());
  }

  resetTabs(): void {
    this.activeItem = this.local(this.items)[0];
    this.mailTab = this.local(this.mailItems)[0];
    this.month = this.local(this.months)[2];
    this.lastCommand = '';
  }

  open(event: { item?: MenuEntry }): void {
    this.lastCommand = event.item?.label ?? '';
  }
}

/* ---------- MultiSelect page ---------- */
/** The parts of the multiselect events the demos read (no wiratheme import here). */
type MultiChange = { value: unknown[]; itemValue?: unknown };

export abstract class MultiSelectDemo extends SimpleDemo {
  protected readonly doc = MULTISELECT_DOC;
  readonly provinces: Province[] = [
    { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
    { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
    { id: 57, code: 'CRI', name_th: 'เชียงราย', name_en: 'Chiang Rai' },
    { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
    { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
    { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
  ];
  readonly regions = [
    { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
    { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
    { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
  ];
  readonly levels = [
    { id: 'k1', name: 'อนุบาล 1' },
    { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
    { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
    { id: 'm4', name: 'มัธยมศึกษาปีที่ 4', closed: true },
  ];
  provinceIds: number[] = [];
  labelIds: number[] = [10, 50, 40];
  chipIds: number[] = [50, 83];
  /** A narrow field with five chips: the ones that do not fit collapse into "+N". */
  narrowChipIds: number[] = [10, 50, 40, 83, 90];
  limitIds: number[] = [];
  allIds: number[] = [];
  allChecked: boolean | null = null;
  regionIds: number[] = [];
  levelIds: string[] = [];
  clearIds: number[] = [50, 83];
  sizeIds: number[] = [];
  lookIds: number[] = [];
  /** Whole province objects (no optionValue), compared by dataKey="id". */
  picked: Province[] = [];
  moreIds: number[] = [];
  added = 0;
  eventIds: number[] = [];
  lastChange = '';
  lastEvent = '';
  form = new FormGroup({ provinces: new FormControl<number[]>([], Validators.required) });

  allChanged(event: { checked: boolean }): void {
    this.allChecked = event.checked;
  }

  addProvince(): void {
    this.added++;
  }

  changed(event: MultiChange): void {
    this.lastChange = 'itemValue ' + event.itemValue + ' · value [' + event.value.join(', ') + ']';
  }

  log(name: string): void {
    this.lastEvent = name;
  }

  /** The output under the templates demo: the codes, the same in both languages. */
  codesOf(list: Province[]): string {
    return list.length ? list.map((p) => p.code).join(', ') : '-';
  }
}

/* ---------- InputMask page ---------- */
export abstract class InputMaskDemo extends SimpleDemo {
  protected readonly doc = INPUTMASK_DOC;
  idCard = '';
  phone = '';
  birthDate = '';
  sku = '';
  office = '';
  plate = '';
  visitDate = '';
  otp = '';
  clearedPhone = '';
  draftPhone = '';
  formattedId = '';
  rawId = '';
  memberId = '';
  lookupText = '';
  lookPhone = '';
  form = new FormGroup({ phone: new FormControl('', Validators.required) });

  constructor() {
    super();
    this.clearLookup();
    // The status line holds sample text: rewrite it in the new language (a complete number has no `_`).
    this.onLang(() => (this.memberId && !this.memberId.includes('_') ? this.lookUp() : this.clearLookup()));
  }

  lookUp(): void {
    this.lookupText = this.tx('กำลังค้นหา ') + this.memberId;
  }

  clearLookup(): void {
    this.lookupText = this.tx('กรอกให้ครบ 13 หลัก');
  }
}

/* ---------- Timeline page ---------- */
export abstract class TimelineDemo extends SimpleDemo {
  protected readonly doc = TIMELINE_DOC;
  readonly orders = [
    { status: 'สั่งซื้อแล้ว', date: '12 มี.ค. 2569 10:30', icon: 'pi pi-shopping-cart', color: '#6366f1' },
    { status: 'แพ็กสินค้า', date: '12 มี.ค. 2569 14:00', icon: 'pi pi-box', color: '#f59e0b' },
    { status: 'กำลังจัดส่ง', date: '13 มี.ค. 2569 09:15', icon: 'pi pi-truck', color: '#0ea5e9' },
    { status: 'ส่งถึงแล้ว', date: '14 มี.ค. 2569 16:45', icon: 'pi pi-check', color: '#10b981' },
  ];
}

/* ---------- Chart page ---------- */
/** Chart.js data as the demos build it (no chart.js import here); the templates hand `local()` copies to wt-chart. */
type ChartDataset = { label?: string; data: number[]; [key: string]: unknown };
type ChartDataLike = { labels: string[]; datasets: ChartDataset[] };
/** The parts of a Chart.js chart the centre-label plugin draws with. */
type ChartLike = {
  ctx: CanvasRenderingContext2D;
  chartArea: { left: number; right: number; top: number; bottom: number };
  options: { font?: { family?: string }; color?: unknown };
};
const CHART_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];

export abstract class ChartDemo extends SimpleDemo {
  protected readonly doc = CHART_DOC;
  readonly salesData: ChartDataLike = {
    labels: CHART_MONTHS,
    datasets: [
      { label: 'รายรับ', data: [52, 61, 70, 66, 74, 80], backgroundColor: '#3b82f6' },
      { label: 'รายจ่าย', data: [40, 45, 52, 48, 55, 58], backgroundColor: '#f59e0b' },
    ],
  };
  readonly visitData: ChartDataLike = {
    labels: ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'],
    datasets: [
      {
        label: 'ผู้เข้าชมเว็บไซต์',
        data: [320, 410, 380, 460, 520, 280, 240],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  };
  readonly visitOptions = { scales: { y: { beginAtZero: true } } };
  readonly spendData: ChartDataLike = {
    labels: ['อาหาร', 'เดินทาง', 'อุปกรณ์การเรียน', 'อื่น ๆ'],
    datasets: [{ data: [4200, 1800, 1200, 600], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#a855f7'] }],
  };
  readonly genderData: ChartDataLike = {
    labels: ['ม.1', 'ม.2', 'ม.3'],
    datasets: [
      { label: 'ชาย', data: [118, 124, 109], backgroundColor: '#3b82f6' },
      { label: 'หญิง', data: [126, 119, 131], backgroundColor: '#ec4899' },
    ],
  };
  readonly stackedOptions = { indexAxis: 'y', scales: { x: { stacked: true }, y: { stacked: true } } };
  readonly targetData: ChartDataLike = {
    labels: CHART_MONTHS,
    datasets: [
      { type: 'bar', label: 'ยอดขาย', data: [48, 55, 62, 58, 71, 76], backgroundColor: '#3b82f6' },
      { type: 'line', label: 'เป้าหมาย', data: [50, 55, 60, 65, 70, 75], borderColor: '#f43f5e', backgroundColor: '#f43f5e', tension: 0.3 },
    ],
  };
  themeColor = '';
  themeData = this.themeChartData();
  readonly scoreData: ChartDataLike = {
    labels: ['คณิตศาสตร์', 'วิทยาศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'สังคมศึกษา'],
    datasets: [{ label: 'คะแนนเฉลี่ย', data: [72, 68, 81, 75, 70], backgroundColor: '#6366f1' }],
  };
  readonly scoreOptions = { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } };
  picked = '';
  readonly levelData: ChartDataLike = {
    labels: ['ประถม', 'มัธยมต้น', 'มัธยมปลาย'],
    datasets: [{ data: [520, 410, 320], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }],
  };
  readonly levelOptions = { cutout: '65%', plugins: { legend: { position: 'bottom' }, centerText: { text: '1,250 คน' } } };
  /** A plugin of the page's own: the number in the middle of the doughnut, from options.plugins.centerText. */
  readonly centerText = {
    id: 'centerText',
    afterDraw(chart: ChartLike, _args: unknown, options: { text: string }): void {
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.font = '600 18px ' + (chart.options.font?.family ?? 'sans-serif');
      ctx.fillStyle = String(chart.options.color ?? '#333');
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.text, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
      ctx.restore();
    },
  };
  readonly attendance: ChartDataLike = {
    labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4', 'สัปดาห์ 5'],
    datasets: [{ label: 'นักเรียนที่มาเรียน', data: [1180, 1204, 1192, 1215, 1198], borderColor: '#10b981', tension: 0.3 }],
  };

  constructor() {
    super();
    // Read the theme colours again once the page has rendered (the version's theme is on by then).
    this.onLang(() => this.useThemeColors());
  }

  useThemeColors(): void {
    // A new object, so the chart is built again with the colours of the theme on screen now.
    this.themeData = this.themeChartData();
  }

  themeChartData(): ChartDataLike {
    const css = getComputedStyle(document.documentElement);
    this.themeColor = css.getPropertyValue('--wt-primary-color').trim();
    return {
      labels: CHART_MONTHS,
      datasets: [
        { label: 'ปีนี้', data: [52, 61, 70, 66, 74, 80], backgroundColor: this.themeColor },
        { label: 'ปีที่แล้ว', data: [45, 50, 58, 60, 63, 69], backgroundColor: css.getPropertyValue('--wt-primary-300').trim() },
      ],
    };
  }

  /** The picked bar, from the copy the chart shows (English on the English site). */
  pick(event: { element: unknown }): void {
    const { datasetIndex, index } = event.element as { datasetIndex: number; index: number };
    const data = this.local(this.scoreData);
    this.picked = data.labels[index] + ': ' + data.datasets[datasetIndex].data[index];
  }

  /** Changes the data the chart holds in place (the English copy on the English site), then redraws. */
  addWeek(chart: { refresh(): void }): void {
    const data = this.local(this.attendance);
    const week = data.labels.length + 1;
    data.labels.push(this.tx('สัปดาห์ ') + week);
    data.datasets[0].data.push(1150 + ((week * 37) % 80));
    chart.refresh();
  }

  points(): number {
    return this.local(this.attendance).labels.length;
  }
}

/* ---------- Image page ---------- */
export abstract class ImageDemo extends SimpleDemo {
  protected readonly doc = IMAGE_DOC;
  previewEvents: string[] = [];
  /** Starts on a file that does not exist, so the sample shows onImageError swapping in a stand-in. */
  photoSrc = 'photos/student-15.jpg';
  imageErrors = 0;

  logPreview(event: string): void {
    this.previewEvents = [...this.previewEvents, event];
  }

  useStandIn(): void {
    this.imageErrors++;
    this.photoSrc = 'samples/no-photo.svg';
  }

  retryPhoto(): void {
    this.photoSrc = 'photos/student-15.jpg';
  }
}

/* ---------- AutoComplete page ---------- */
type Level = { id: string; name: string; closed?: boolean };
type Region = { label: string; items: { id: number; name_th: string }[] };

/** The searches filter the samples' arrays in the site language (local()), so English names are found on the English site. */
export abstract class AutoCompleteDemo extends SimpleDemo {
  protected readonly doc = AUTOCOMPLETE_DOC;
  readonly provinces: Province[] = [
    { id: 10, code: 'BKK', name_th: 'กรุงเทพมหานคร', name_en: 'Bangkok' },
    { id: 50, code: 'CMI', name_th: 'เชียงใหม่', name_en: 'Chiang Mai' },
    { id: 57, code: 'CRI', name_th: 'เชียงราย', name_en: 'Chiang Rai' },
    { id: 40, code: 'KKN', name_th: 'ขอนแก่น', name_en: 'Khon Kaen' },
    { id: 83, code: 'PKT', name_th: 'ภูเก็ต', name_en: 'Phuket' },
    { id: 90, code: 'SKA', name_th: 'สงขลา', name_en: 'Songkhla' },
  ];
  readonly regions: Region[] = [
    { label: 'ภาคเหนือ', items: [{ id: 50, name_th: 'เชียงใหม่' }, { id: 57, name_th: 'เชียงราย' }] },
    { label: 'ภาคอีสาน', items: [{ id: 40, name_th: 'ขอนแก่น' }, { id: 30, name_th: 'นครราชสีมา' }] },
    { label: 'ภาคใต้', items: [{ id: 83, name_th: 'ภูเก็ต' }, { id: 90, name_th: 'สงขลา' }] },
  ];
  readonly levels: Level[] = [
    { id: 'k1', name: 'อนุบาล 1' },
    { id: 'k2', name: 'อนุบาล 2', closed: true },
    { id: 'p1', name: 'ประถมศึกษาปีที่ 1' },
    { id: 'm1', name: 'มัธยมศึกษาปีที่ 1' },
    { id: 'm4', name: 'มัธยมศึกษาปีที่ 4' },
  ];
  suggestions: Province[] = [];
  slowSuggestions: Province[] = [];
  levelSuggestions: Level[] = [];
  regionSuggestions: Region[] = [];
  province: unknown = null;
  slowProvince: unknown = null;
  emptyProvince: unknown = null;
  noEmptyProvince: unknown = null;
  dropdownProvince: unknown = null;
  currentProvince: unknown = null;
  forceProvince: unknown = null;
  level: unknown = null;
  regionProvince: unknown = null;
  clearProvince: unknown = null;
  filledProvince: unknown = null;
  fluidProvince: unknown = null;
  smallProvince: unknown = null;
  normalProvince: unknown = null;
  largeProvince: unknown = null;
  templateProvince: unknown = null;
  eventProvince: unknown = null;
  lastEvents: string[] = [];
  added = 0;
  form = new FormGroup({ province: new FormControl<unknown>(null, Validators.required) });

  constructor() {
    super();
    this.resetValues();
    // Picks are whole objects in one language: start again in the new one.
    this.onLang(() => this.resetValues());
  }

  resetValues(): void {
    for (const key of ['province', 'slowProvince', 'emptyProvince', 'noEmptyProvince', 'dropdownProvince', 'currentProvince', 'forceProvince', 'level', 'regionProvince', 'filledProvince', 'fluidProvince', 'smallProvince', 'normalProvince', 'largeProvince', 'templateProvince', 'eventProvince'] as const) {
      this[key] = null;
    }
    this.clearProvince = this.local(this.provinces)[1];
    this.suggestions = [];
    this.slowSuggestions = [];
    this.levelSuggestions = [];
    this.regionSuggestions = [];
    this.form.reset();
  }

  search(event: { query: string }): void {
    this.suggestions = this.match(event.query);
  }

  searchSlow(event: { query: string }): void {
    setTimeout(() => (this.slowSuggestions = this.match(event.query)), 700);
  }

  searchByCode(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.suggestions = this.match('').filter((p) => this.nameOf(p).toLowerCase().includes(query) || p.code.toLowerCase().includes(query));
  }

  searchLevels(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.levelSuggestions = this.local(this.levels).filter((l) => l.name.toLowerCase().includes(query));
  }

  searchRegions(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.regionSuggestions = this.local(this.regions)
      .map((r) => ({ ...r, items: r.items.filter((p) => this.nameOf(p).toLowerCase().includes(query)) }))
      .filter((r) => r.items.length);
  }

  addProvince(): void {
    this.added++;
  }

  log(name: string): void {
    this.lastEvents = [...this.lastEvents.slice(-3), name];
  }

  /** The provinces in the site language whose name holds the query. */
  private match(query: string): Province[] {
    const q = query.toLowerCase();
    return this.local(this.provinces).filter((p) => this.nameOf(p).toLowerCase().includes(q));
  }

  /** name_th on the Thai site, name_en on the English one (local() renames the key, as the English code does). */
  private nameOf(p: object): string {
    return String((p as Record<string, unknown>)[this.tx('name_th')] ?? '');
  }
}

/* ---------- PanelMenu page ---------- */
/** Each menu keeps its own array: the panel menu writes `expanded` on the items (local() gives English its own copy). */
export abstract class PanelMenuDemo extends SimpleDemo {
  protected readonly doc = PANELMENU_DOC;
  lastCommand = '';
  readonly items: MenuEntry[] = [
    {
      label: 'นักเรียน',
      icon: 'pi pi-users',
      expanded: true,
      items: [
        { label: 'รายชื่อนักเรียน', icon: 'pi pi-list' },
        { label: 'เพิ่มนักเรียน', icon: 'pi pi-user-plus' },
        { label: 'นำเข้าข้อมูล', icon: 'pi pi-upload', items: [{ label: 'จากไฟล์ Excel' }, { label: 'จากระบบเดิม' }] },
      ],
    },
    {
      label: 'ตารางเรียน',
      icon: 'pi pi-calendar',
      items: [
        { label: 'ตารางสอนครู', icon: 'pi pi-book' },
        { label: 'ตารางห้องเรียน', icon: 'pi pi-building' },
      ],
    },
    {
      label: 'รายงาน',
      icon: 'pi pi-chart-bar',
      items: [
        { label: 'ผลการเรียน', icon: 'pi pi-chart-line' },
        { label: 'การมาเรียน', icon: 'pi pi-clock' },
      ],
    },
  ];
  readonly oneAtATime: MenuEntry[] = this.sections();
  readonly severalAtOnce: MenuEntry[] = this.sections();
  /** routerLinkActive compares the fragment too: only the section picked lights up. */
  private readonly sameSection = { paths: 'exact', queryParams: 'ignored', fragment: 'exact', matrixParams: 'ignored' };
  readonly links: MenuEntry[] = [
    {
      label: 'หัวข้อในหน้านี้',
      icon: 'pi pi-list',
      expanded: true,
      items: [
        { label: 'เปิดหลายหัวข้อ', icon: 'pi pi-hashtag', routerLink: [], fragment: 'multiple', routerLinkActiveOptions: this.sameSection },
        { label: 'คีย์บอร์ด', icon: 'pi pi-hashtag', routerLink: [], fragment: 'keyboard', routerLinkActiveOptions: this.sameSection },
        { label: 'คู่มือ router', icon: 'pi pi-external-link', url: 'https://angular.dev/guide/routing', target: '_blank' },
      ],
    },
    {
      label: 'คำสั่ง',
      icon: 'pi pi-cog',
      expanded: true,
      items: [
        { label: 'พิมพ์หน้านี้', icon: 'pi pi-print', command: (event) => this.run(event) },
        { label: 'คัดลอกลิงก์', icon: 'pi pi-copy', command: (event) => this.run(event) },
      ],
    },
  ];
  readonly accountItems: MenuEntry[] = [
    {
      label: 'กล่องข้อความ',
      icon: 'pi pi-inbox',
      badge: '5',
      expanded: true,
      items: [
        { label: 'ข้อความใหม่', icon: 'pi pi-envelope', badge: '5' },
        { label: 'ติดดาว', icon: 'pi pi-star' },
        { separator: true },
        { label: 'ถังขยะ', icon: 'pi pi-trash', disabled: true },
      ],
    },
    { label: 'ผู้ดูแลระบบ', icon: 'pi pi-shield', visible: false, items: [{ label: 'สิทธิ์ผู้ใช้' }] },
    { label: 'รายงานประจำปี', icon: 'pi pi-chart-bar', disabled: true, items: [{ label: 'ปี 2568' }] },
  ];
  readonly editorItems: MenuEntry[] = [
    {
      label: 'ไฟล์',
      icon: 'pi pi-file',
      expanded: true,
      items: [
        { label: 'สร้างใหม่', icon: 'pi pi-plus', shortcut: 'Ctrl+N' },
        { label: 'บันทึก', icon: 'pi pi-save', shortcut: 'Ctrl+S' },
      ],
    },
    {
      label: 'แก้ไข',
      icon: 'pi pi-pencil',
      items: [
        { label: 'คัดลอก', icon: 'pi pi-copy', shortcut: 'Ctrl+C' },
        { label: 'วาง', icon: 'pi pi-clipboard', shortcut: 'Ctrl+V' },
      ],
    },
  ];
  readonly classItems: MenuEntry[] = [
    { label: 'ห้องเรียน', icon: 'pi pi-building', expanded: true, items: [{ label: 'ม.1' }, { label: 'ม.2' }, { label: 'ม.3' }] },
    { label: 'กิจกรรม', icon: 'pi pi-star', items: [{ label: 'ชุมนุม' }, { label: 'กีฬาสี' }] },
  ];
  readonly compactItems: MenuEntry[] = [
    { label: 'ห้องเรียน', icon: 'pi pi-building', items: [{ label: 'ม.1' }, { label: 'ม.2' }, { label: 'ม.3' }] },
    { label: 'กิจกรรม', icon: 'pi pi-star', items: [{ label: 'ชุมนุม' }, { label: 'กีฬาสี' }] },
  ];

  sections(): MenuEntry[] {
    return [
      { label: 'ข้อมูลทั่วไป', icon: 'pi pi-id-card', expanded: true, items: [{ label: 'ชื่อและที่อยู่' }, { label: 'ผู้ปกครอง' }] },
      { label: 'การเรียน', icon: 'pi pi-book', items: [{ label: 'ผลการเรียน' }, { label: 'ตารางเรียน' }] },
      { label: 'การเงิน', icon: 'pi pi-wallet', items: [{ label: 'ค่าธรรมเนียม' }, { label: 'ใบเสร็จ' }] },
    ];
  }

  run(event: { item?: MenuEntry }): void {
    this.lastCommand = event.item?.label ?? '';
  }
}

/* ---------- Steps page ---------- */
export abstract class StepsDemo extends SimpleDemo {
  protected readonly doc = STEPS_DOC;
  /** For the link to the Stepper page of the same version. */
  protected readonly version = inject(DOCS_VERSION);
  readonly steps: MenuEntry[] = [{ label: 'กรอกข้อมูล' }, { label: 'อัปโหลดเอกสาร' }, { label: 'ชำระเงิน' }, { label: 'ยืนยัน' }];
  activeIndex = 1;
  readonly admission: MenuEntry[] = [
    { label: 'เลือกหลักสูตร', command: (event) => this.go(event) },
    { label: 'ข้อมูลผู้ปกครอง', command: (event) => this.go(event) },
    { label: 'นัดสัมภาษณ์', command: (event) => this.go(event) },
    { label: 'ประกาศผล', command: (event) => this.go(event) },
  ];
  current = 0;
  lastStep = '';
  readonly checks: MenuEntry[] = [
    { label: 'ส่งใบสมัคร' },
    { label: 'ตรวจเอกสาร', disabled: true },
    { label: 'สอบข้อเขียน' },
    { label: 'รายงานตัว' },
  ];
  checkIndex = 0;

  constructor() {
    super();
    // The last picked label is sample text: start again in the new language.
    this.onLang(() => (this.lastStep = ''));
  }

  back(): void {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
  }

  next(): void {
    this.activeIndex = Math.min(this.steps.length - 1, this.activeIndex + 1);
  }

  go(event: { item?: MenuEntry }): void {
    this.lastStep = event.item?.label ?? '';
  }
}

/* ---------- Stepper page ---------- */
export abstract class StepperDemo extends SimpleDemo {
  protected readonly doc = STEPPER_DOC;
  /** For the link to the Steps page of the same version. */
  protected readonly version = inject(DOCS_VERSION);
  step = 1;
  applyStep = 1;
  studentName = '';
  parentPhone = '';
  isApiSaving = false;
  submitted = false;
  setupStep = 1;
  applicationStatus = 'checking';
  paymentStep = 1;
  readonly paymentSteps = [
    { value: 1, label: 'ข้อมูลผู้ชำระ', icon: 'pi pi-user' },
    { value: 2, label: 'ช่องทางชำระ', icon: 'pi pi-credit-card' },
    { value: 3, label: 'ใบเสร็จ', icon: 'pi pi-check-circle' },
  ];
  enrolStep = 1;
  stepIndex = 0;
  lastStep = '';
  trackIndex = 1;
  readonly applySteps: MenuEntry[] = [
    { label: 'เลือกหลักสูตร', subtitle: 'ห้องเรียนพิเศษ', command: (event) => this.stepPicked(event) },
    { label: 'ข้อมูลผู้ปกครอง', subtitle: 'เบอร์ติดต่อ', command: (event) => this.stepPicked(event) },
    { label: 'ชำระเงิน', subtitle: 'ปิดชั่วคราว', disabled: true },
    { label: 'ยืนยัน', command: (event) => this.stepPicked(event) },
  ];
  readonly trackSteps: MenuEntry[] = [
    { label: 'ส่งใบสมัคร', subtitle: '3 พ.ค.' },
    { label: 'ตรวจเอกสาร', subtitle: '5 พ.ค.' },
    { label: 'สัมภาษณ์', subtitle: '12 พ.ค.' },
    { label: 'ประกาศผล', subtitle: '20 พ.ค.' },
  ];

  stepPicked(event: { item?: MenuEntry }): void {
    this.lastStep = event.item?.label ?? '';
  }

  trackBack(): void {
    this.trackIndex = Math.max(0, this.trackIndex - 1);
  }

  trackNext(): void {
    this.trackIndex = Math.min(this.trackSteps.length - 1, this.trackIndex + 1);
  }

  submitApplication(): void {
    this.isApiSaving = true;
    wait(900).then(() => {
      this.isApiSaving = false;
      this.submitted = true;
    });
  }
}

/* ---------- PickList and OrderList pages ---------- */
type Permission = { id: number; code: string; name: string; module: string };
type FlowRank = { id: number; rank: string; person: string };
type Elective = { id: number; name: string; teacher: string };
/** The part of the pick list move events the demos read (no wiratheme import here). */
type ListMove = { items: unknown[] };

const PERMISSIONS: Permission[] = [
  { id: 1, code: 'student.view', name: 'ดูข้อมูลนักเรียน', module: 'งานทะเบียน' },
  { id: 2, code: 'student.edit', name: 'แก้ไขข้อมูลนักเรียน', module: 'งานทะเบียน' },
  { id: 3, code: 'grade.entry', name: 'บันทึกผลการเรียน', module: 'งานวัดผล' },
  { id: 4, code: 'grade.approve', name: 'อนุมัติผลการเรียน', module: 'งานวัดผล' },
  { id: 5, code: 'finance.view', name: 'ดูรายงานการเงิน', module: 'งานการเงิน' },
  { id: 6, code: 'finance.refund', name: 'คืนเงินค่าธรรมเนียม', module: 'งานการเงิน' },
  { id: 7, code: 'user.manage', name: 'จัดการผู้ใช้', module: 'ผู้ดูแลระบบ' },
  { id: 8, code: 'report.export', name: 'ส่งออกรายงาน', module: 'ผู้ดูแลระบบ' },
];

const RANKS: FlowRank[] = [
  { id: 11, rank: 'ครูที่ปรึกษาชุมนุม', person: 'นางสาวกานดา ศรีสุข' },
  { id: 12, rank: 'หัวหน้ากลุ่มสาระ', person: 'นายวิชัย ทองคำ' },
  { id: 13, rank: 'หัวหน้างานกิจกรรม', person: 'นางพรทิพย์ บุญมา' },
  { id: 14, rank: 'รองผู้อำนวยการฝ่ายวิชาการ', person: 'นายสมชาย ใจดี' },
  { id: 15, rank: 'ผู้อำนวยการ', person: 'นางสุนีย์ แสงจันทร์' },
  { id: 16, rank: 'เจ้าหน้าที่การเงิน', person: '' },
];

const ELECTIVES: Elective[] = [
  { id: 1, name: 'หุ่นยนต์เบื้องต้น', teacher: 'ครูวิชัย' },
  { id: 2, name: 'ภาษาจีนเพื่อการสื่อสาร', teacher: 'ครูหลิน' },
  { id: 3, name: 'ดนตรีไทย', teacher: 'ครูสมศักดิ์' },
  { id: 4, name: 'การเขียนโปรแกรมเว็บ', teacher: 'ครูกานดา' },
  { id: 5, name: 'ศิลปะการทำอาหาร', teacher: 'ครูพรทิพย์' },
  { id: 6, name: 'บาสเกตบอล', teacher: 'ครูธนา' },
];

const idList = (list: { id: number }[]) => (list.length ? list.map((x) => x.id).join(', ') : '-');

/**
 * The lists are changed in place by the components, so each demo gets its own arrays, built again (in the site
 * language) when the language changes.
 */
export abstract class PickListDemo extends SimpleDemo {
  protected readonly doc = PICKLIST_DOC;
  basicSource: Permission[] = [];
  basicTarget: Permission[] = [];
  ranks: FlowRank[] = [];
  flow: FlowRank[] = [];
  filterSource: Permission[] = [];
  filterTarget: Permission[] = [];
  moreSource: Permission[] = [];
  moreTarget: Permission[] = [];
  eventSource: Permission[] = [];
  eventTarget: Permission[] = [];
  lookSource: Permission[] = [];
  lookTarget: Permission[] = [];
  isApiSaving = false;
  savedFlow = '';
  lastEvent = '';

  constructor() {
    super();
    this.resetLists();
    this.onLang(() => this.resetLists());
  }

  resetLists(): void {
    const pick = (ids: number[]) => this.local(PERMISSIONS.filter((p) => ids.includes(p.id)));
    const rest = (ids: number[]) => this.local(PERMISSIONS.filter((p) => !ids.includes(p.id)));
    this.basicSource = rest([1]);
    this.basicTarget = pick([1]);
    this.ranks = this.local(RANKS.filter((r) => r.id !== 11 && r.id !== 15));
    this.flow = this.local(RANKS.filter((r) => r.id === 11 || r.id === 15));
    this.filterSource = rest([7]);
    this.filterTarget = pick([7]);
    this.moreSource = rest([]);
    this.moreTarget = [];
    this.eventSource = rest([1, 2]);
    this.eventTarget = pick([1, 2]);
    this.lookSource = rest([1, 3]);
    this.lookTarget = pick([1, 3]);
    this.savedFlow = '';
    this.lastEvent = '';
  }

  saveFlow(): void {
    this.isApiSaving = true;
    const rankIds = this.flow.map((r) => r.id);
    wait(900).then(() => {
      this.isApiSaving = false;
      this.savedFlow = rankIds.join(' → ');
    });
  }

  logMove(name: string, event: ListMove): void {
    const codes = (event.items as Permission[]).map((p) => p.code);
    this.lastEvent = name + ': ' + codes.join(', ');
  }

  /** Outputs under the demos: codes and ids read the same in both languages. */
  codesOf(list: Permission[]): string {
    return list.length ? list.map((p) => p.code).join(', ') : '-';
  }

  idsOf(list: { id: number }[]): string {
    return idList(list);
  }
}

export abstract class OrderListDemo extends SimpleDemo {
  protected readonly doc = ORDERLIST_DOC;
  electives: Elective[] = [];
  dragElectives: Elective[] = [];
  filterElectives: Elective[] = [];
  lookElectives: Elective[] = [];
  selectedElectives: Elective[] = [];
  order = '';

  constructor() {
    super();
    this.resetLists();
    this.onLang(() => this.resetLists());
  }

  resetLists(): void {
    this.electives = this.local([...ELECTIVES]);
    this.dragElectives = this.local([...ELECTIVES]);
    this.filterElectives = this.local([...ELECTIVES]);
    this.lookElectives = this.local([...ELECTIVES]);
    this.selectedElectives = [];
    this.reordered();
  }

  /** The sample types the item; the input's TrackByFunction<unknown> wants `unknown` here. */
  trackById(index: number, elective: unknown): number {
    return (elective as Elective).id;
  }

  reordered(): void {
    this.order = this.electives.map((e) => e.id).join(', ');
  }

  idsOf(list: { id: number }[]): string {
    return idList(list);
  }
}

/* ---------- FileUpload page ---------- */
/** The parts of the file upload component and events the demos use (no wiratheme import here). */
type FileUploadRef = { clear(): void };
type FileSelect = { files: File[] };

export abstract class FileUploadDemo extends SimpleDemo {
  protected readonly doc = FILEUPLOAD_DOC;
  isApiSaving = false;
  uploadedCount = 0;
  lastPicked = '';
  lastProblem = '';
  photo: File | null = null;

  /** A pretend upload: the docs page sends nothing anywhere. */
  uploadDocuments(event: FileSelect, fileUpload: FileUploadRef): void {
    this.isApiSaving = true;
    const count = event.files.length;
    wait(900).then(() => {
      this.isApiSaving = false;
      this.uploadedCount += count;
      fileUpload.clear();
    });
  }

  picked(event: FileSelect): void {
    this.lastPicked = event.files.map((f) => f.name).join(', ');
  }

  rejected(event: { reason: string }): void {
    this.lastProblem = event.reason;
  }

  pickPhoto(event: FileSelect): void {
    this.photo = event.files[0] ?? null;
  }

  clearPhoto(): void {
    this.photo = null;
  }
}

/* ---------- Ripple and KeyFilter pages ---------- */
/** The switch drives the site's own ripple setting (the theme drawer has the same switch). */
export abstract class RippleDemo extends SimpleDemo {
  protected readonly doc = RIPPLE_DOC;
  protected readonly state = inject(DocsState);

  setRipple(on: boolean): void {
    this.state.setRipple(on);
  }
}

export abstract class KeyFilterDemo extends SimpleDemo {
  protected readonly doc = KEYFILTER_DOC;
  studentId = '';
  amount = '';
  email = '';
  nameTh = '';
  color = '';
  subject = '';
  readonly subjectChars = /[A-Z0-9-]/;
  phone = '';
  readonly phonePattern = /^0\d{9}$/;
}

/* ---------- Editor page ---------- */
/** The parts of the editor's API and events the demos use (no wiratheme import here). */
type EditorApiLike = { setHTML(html: string): void };

export abstract class EditorDemo extends SimpleDemo {
  protected readonly doc = EDITOR_DOC;
  newsBody: string | null = null;
  isApiSaving = false;
  savedCount = 0;
  readonly presets = ['basic', 'standard', 'full', 'none'];
  preset: 'basic' | 'standard' | 'full' | 'none' = 'full';
  presetBody: string | null = null;
  customBody: string | null = null;
  readonly tools = ['bold', 'italic', '|', 'bulletList', 'orderedList', '|', 'link', 'image', 'table'] as const;
  noticeBody: string | null = null;
  readonly toolOptions = {
    headings: [0, 2, 3],
    colors: ['#1e293b', '#0f766e', '#b91c1c', '#1d4ed8'],
    highlights: ['#fef9c3', '#dcfce7'],
    alignments: ['left', 'center', 'right'] as Array<'left' | 'center' | 'right'>,
    blocks: ['blockquote'] as Array<'blockquote' | 'codeBlock'>,
    table: { rows: 6, cols: 6, headerRow: true },
    link: { newTab: true },
  };
  policy: string | null = null;
  imageBody: string | null = null;
  /** [imageUpload] takes the function itself, so the method is bound once (as the sample shows). */
  readonly imageUpload = { upload: this.uploadImage.bind(this), maxSize: 1048576 };
  lastImageEvent = '';
  timetable: string | null = null;
  announcement = '';
  summary: string | null = null;
  letter: string | null = null;
  lastEvent = '';
  editorIsReady = false;
  private editor: EditorApiLike | null = null;

  constructor() {
    super();
    this.resetValues();
    // The values hold sample text: start again in the new language.
    this.onLang(() => this.resetValues());
  }

  resetValues(): void {
    this.newsBody = this.tx('<p>โรงเรียนเปิดรับสมัครนักเรียน <strong>ปีการศึกษา 2569</strong></p>');
    this.presetBody = this.tx('<p>ประกาศ</p>');
    this.customBody = this.tx('<p>ประกาศ</p>');
    this.noticeBody = this.tx('<h2>จัดกิจกรรมวันไหว้ครู</h2><p>วันพฤหัสบดีที่ 18 มิถุนายน</p>');
    this.policy = this.tx('<h2>นโยบายการใช้ข้อมูลส่วนบุคคล</h2><p class="ql-align-center">โรงเรียนเก็บข้อมูลเท่าที่จำเป็นต่อการเรียนการสอน</p>');
    this.imageBody = this.tx('<p>เนื้อหาข่าว</p>');
    this.timetable = this.tx(
      '<p>ตารางสอบกลางภาค</p><table style="width: 100%"><colgroup><col style="width: 40%"><col style="width: 35%"><col style="width: 25%"></colgroup>' +
        '<thead><tr><th>วิชา</th><th>วันสอบ</th><th>ห้องสอบ</th></tr></thead>' +
        '<tbody><tr><td>คณิตศาสตร์</td><td>จันทร์ 6 ก.ค.</td><td>311</td></tr><tr><td>วิทยาศาสตร์</td><td>อังคาร 7 ก.ค.</td><td>312</td></tr></tbody></table>'
    );
    this.announcement = this.tx(
      '<h2>จัดกิจกรรมวันไหว้ครู</h2><p class="ql-align-center">วันพฤหัสบดีที่ 18 มิถุนายน</p>' + '<ul><li>แต่งกายชุดนักเรียน</li><li>นำพานไหว้ครูของห้อง</li></ul>'
    );
    this.summary = this.tx('<p>แต่งกายชุดนักเรียน</p>');
    this.letter = null;
    this.lastEvent = '';
    this.lastImageEvent = '';
  }

  saveNews(): void {
    this.isApiSaving = true;
    wait(900).then(() => {
      this.isApiSaving = false;
      this.savedCount++;
    });
  }

  /** A pretend upload: reads the picture back as a data URL after a short wait (the docs page sends nothing). */
  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => wait(600).then(() => resolve(String(reader.result)));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  imageUploaded(event: { file: File }): void {
    this.lastImageEvent = 'onImageUpload: ' + event.file.name;
  }

  imageFailed(event: { reason: string }): void {
    this.lastImageEvent = 'onImageUploadError: ' + event.reason;
  }

  editorReady(event: { editor: EditorApiLike }): void {
    this.editor = event.editor;
    this.editorIsReady = true;
  }

  useLetterTemplate(): void {
    this.editor?.setHTML(this.tx('<p>เรียน ผู้ปกครอง</p><p>ขอเชิญประชุมผู้ปกครองวันเสาร์นี้ เวลา 9.00 น.</p>'));
  }

  textChanged(event: { source: string; textValue: string }): void {
    this.lastEvent = event.source + ' · ' + event.textValue.length;
  }
}
