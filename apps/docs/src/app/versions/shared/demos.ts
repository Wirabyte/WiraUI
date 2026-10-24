import { inject } from '@angular/core';
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

/*
 * State and handlers behind the component pages. Each version module declares a tiny subclass with
 * the shared template (shared/<name>.html), so the same page compiles against v1, v2 or v3 components.
 * Sample labels inside live demos stay Thai in both languages, matching the code shown under them;
 * section titles and intros come from the data files in the site language.
 */

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

abstract class DemoPage {
  protected readonly en = inject(DocsI18n).en;
}

/** Pages whose demos need no state: the doc data only. */
abstract class SimpleDemo extends DemoPage {
  protected abstract readonly doc: ComponentDoc;
  protected get sec() {
    return this.doc.sections;
  }
  protected get code() {
    return this.doc.code;
  }
  protected get ts() {
    return this.doc.ts || {};
  }
}

export abstract class ButtonDemo extends DemoPage {
  protected readonly doc = BUTTON_DOC;
  protected readonly sec = BUTTON_DOC.sections;
  protected readonly code = BUTTON_DOC.code;
  protected readonly ts = BUTTON_DOC.ts!;
  saved = 0;
  clicks = 0;
  readonly save = () => wait(900).then(() => void this.saved++);
}

export abstract class CardDemo extends DemoPage {
  /** Glass is a v3 card: v1 / v2 get the page without it. */
  protected readonly glass = inject(DOCS_VERSION).major === 3;
  protected readonly doc = this.glass ? CARD_DOC : CARD_DOC_CLASSIC;
  protected readonly sec = this.doc.sections;
  protected readonly code = this.doc.code;
  loading = true;
}

export abstract class CheckboxDemo extends DemoPage {
  protected readonly doc = CHECKBOX_DOC;
  sizeValue = true;
  protected readonly sec = CHECKBOX_DOC.sections;
  protected readonly code = CHECKBOX_DOC.code;
  protected readonly ts = CHECKBOX_DOC.ts!;
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
    terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    privacy: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  patch(): void {
    this.form.patchValue({ terms: true, privacy: true });
  }
}

export abstract class InputTextDemo extends DemoPage {
  protected readonly doc = INPUTTEXT_DOC;
  protected readonly sec = INPUTTEXT_DOC.sections;
  protected readonly code = INPUTTEXT_DOC.code;
  protected readonly ts = INPUTTEXT_DOC.ts!;
  name = '';
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
  });

  patch(): void {
    this.form.patchValue({ name: 'สมชาย ใจดี', email: 'somchai@example.com' });
  }
}

export abstract class RadioButtonDemo extends DemoPage {
  protected readonly doc = RADIOBUTTON_DOC;
  delivery = 'standard';
  payment = 'card';
  sizeValue = 'md';
  protected readonly sec = RADIOBUTTON_DOC.sections;
  protected readonly code = RADIOBUTTON_DOC.code;
  protected readonly ts = RADIOBUTTON_DOC.ts!;
  plan = '';
  readonly sizes = [
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
  ];
  size = 'm';
  readonly form = new FormGroup({
    billing: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  patch(): void {
    this.form.patchValue({ billing: 'yearly' });
  }
}

export abstract class TextareaDemo extends DemoPage {
  protected readonly doc = TEXTAREA_DOC;
  protected readonly sec = TEXTAREA_DOC.sections;
  protected readonly code = TEXTAREA_DOC.code;
  protected readonly ts = TEXTAREA_DOC.ts!;
  note = '';
  address = '';
  readonly form = new FormGroup({
    details: new FormControl('', { nonNullable: true, validators: [Validators.minLength(10)] }),
  });

  fill(): void {
    this.form.patchValue({ details: 'เข้าสู่ระบบไม่ได้\nหลังเปลี่ยนรหัสผ่าน\nลองแล้วทั้งมือถือและคอมพิวเตอร์' });
  }
}

export abstract class ToggleSwitchDemo extends DemoPage {
  protected readonly doc = TOGGLESWITCH_DOC;
  sizeValue = true;
  protected readonly sec = TOGGLESWITCH_DOC.sections;
  protected readonly code = TOGGLESWITCH_DOC.code;
  protected readonly ts = TOGGLESWITCH_DOC.ts!;
  newsletter = false;
  status = 'inactive';
  readonly form = new FormGroup({
    email: new FormControl(true, { nonNullable: true }),
    sms: new FormControl(false, { nonNullable: true }),
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
  agree = true;
  plan = 'pro';
  newsletter = true;

  protected use(id: string): void {
    this.state.choosePreset(id);
  }

  protected tsCode(): string {
    const id = this.state.activePresetId();
    const info = this.theme.info(id);
    return S.tsPreset(this.v, id, info?.name || id, info?.scheme === 'dark');
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
}

export abstract class ChipDemo extends SimpleDemo {
  protected readonly doc = CHIP_DOC;
  protected readonly image = SAMPLE_IMAGE;
  tags = ['ด่วน', 'ลูกค้าใหม่', 'รอโทรกลับ'];

  remove(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  resetTags(): void {
    this.tags = ['ด่วน', 'ลูกค้าใหม่', 'รอโทรกลับ'];
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

export abstract class MessageDemo extends SimpleDemo {
  protected readonly doc = MESSAGE_DOC;
  showClosable = true;
  showTimed = true;
  closed = 0;

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
  form = new FormGroup({ notify: new FormControl(true, { nonNullable: true }) });
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
  workdays = ['จ', 'อ', 'พ', 'พฤ', 'ศ'];
  range = 'สัปดาห์';
  formPlans = [
    { label: 'Free', value: 'free' },
    { label: 'Pro', value: 'pro' },
    { label: 'Enterprise', value: 'ent', disabled: true },
  ];
  form = new FormGroup({ plan: new FormControl('free', { nonNullable: true }) });
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
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
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

  log(kind: string, index: number): void {
    this.lastEvent = kind + ' #' + index;
  }
}

export abstract class TabsDemo extends SimpleDemo {
  protected readonly doc = TABS_DOC;
  tab = 0;
  changed: number | null = null;
  months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
}

export abstract class InputNumberDemo extends SimpleDemo {
  protected readonly doc = INPUTNUMBER_DOC;
  limited: number | null = null;
  limitedPrice: number | null = null;
  sizeValue: number | null = 25;
  protected readonly helpersCode = INPUTNUMBER_DOC.ts!['helpers'] as string;
  quantity: number | null = 1200;
  price: number | null = 1234.5;
  rate: number | null = 3.1416;
  year: number | null = 2026;
  weight: number | null = 60;
  discount: number | null = 15;
  seats: number | null = 2;
  volume: number | null = 2.5;
  form = new FormGroup({
    budget: new FormControl<number | null>(50000, [Validators.required, Validators.max(100000)]),
  });
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
  name = 'สมหญิง ใจดี';
  slotsVisible = false;
  posVisible = false;
  position = 'center';
  readonly positions = ['top', 'bottom', 'left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright', 'center'];
  wideVisible = false;
  noteVisible = false;
  maskVisible = false;
  headlessVisible = false;
  events: string[] = [];

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
  protected readonly importCode = ALERT_DOC.ts!['import'] as string;
  private notify: { fire(options: unknown): Promise<unknown> } | null = null;

  protected get alert() {
    return this.overlays.alert;
  }

  async fireIcon(title: string, text: string, icon: string): Promise<void> {
    this.keep(await this.alert.fire(title, text, icon));
  }

  async remove(): Promise<void> {
    const r = await this.alert.fire({
      title: 'ลบรายการนี้?',
      text: 'ลบแล้วกู้คืนไม่ได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#dc2626',
      focusCancel: true,
    });
    this.keep(r);
    if (r.isConfirmed) this.alert.fire('ลบแล้ว', '', 'success');
  }

  async leave(): Promise<void> {
    this.keep(
      await this.alert.fire({
        title: 'บันทึกการแก้ไขก่อนออก?',
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        denyButtonText: 'ไม่บันทึก',
      })
    );
  }

  async askEmail(): Promise<void> {
    const r = await this.alert.fire({
      title: 'ส่งใบเสร็จทางอีเมล',
      input: 'email',
      inputPlaceholder: 'name@example.com',
      showCancelButton: true,
      inputValidator: (v: unknown) => (!v ? 'กรุณากรอกอีเมล' : undefined),
    });
    this.keep(r);
    if (r.value) this.alert.fire('ส่งแล้ว', String(r.value), 'success');
  }

  async askBranch(): Promise<void> {
    this.keep(
      await this.alert.fire({
        title: 'เลือกสาขา',
        input: 'select',
        inputOptions: { bkk: 'กรุงเทพฯ', cnx: 'เชียงใหม่', hkt: 'ภูเก็ต' },
        inputPlaceholder: 'เลือกสาขา',
        showCancelButton: true,
        inputValidator: (v: unknown) => (!v ? 'กรุณาเลือกสาขา' : undefined),
      })
    );
  }

  async askSize(): Promise<void> {
    this.keep(
      await this.alert.fire({
        title: 'ขนาดเสื้อ',
        input: 'radio',
        inputOptions: { s: 'S', m: 'M', l: 'L', xl: 'XL' },
        inputValue: 'm',
        showCancelButton: true,
      })
    );
  }

  async askComment(): Promise<void> {
    this.keep(await this.alert.fire({ title: 'ความคิดเห็น', input: 'textarea', inputPlaceholder: 'บอกเราได้เลย', showCancelButton: true }));
  }

  async askTerms(): Promise<void> {
    this.keep(
      await this.alert.fire({
        title: 'เงื่อนไขการใช้งาน',
        input: 'checkbox',
        inputPlaceholder: 'ฉันยอมรับเงื่อนไข',
        confirmButtonText: 'ดำเนินการต่อ',
        inputValidator: (v: unknown) => (!v ? 'ต้องยอมรับเงื่อนไขก่อน' : undefined),
      })
    );
  }

  async request(): Promise<void> {
    const r = await this.alert.fire({
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
    });
    this.keep(r);
    if (r.isConfirmed) this.alert.fire('ส่งคำขอแล้ว', 'เลขที่ ' + r.value, 'success');
  }

  async autosave(): Promise<void> {
    this.keep(await this.alert.fire({ title: 'บันทึกอัตโนมัติแล้ว', icon: 'success', timer: 2000, timerProgressBar: true, showConfirmButton: false }));
  }

  async promo(): Promise<void> {
    this.keep(
      await this.alert.fire({
        title: 'ส่วนลดสมาชิก',
        html: 'ใช้โค้ด <b>WELCOME20</b> รับส่วนลด <b>20%</b> ถึงสิ้นเดือนนี้',
        icon: 'info',
        confirmButtonText: 'ใช้โค้ด',
        confirmButtonColor: '#7c3aed',
        footer: '<a href="https://example.com/terms">อ่านเงื่อนไข</a>',
        width: '32rem',
      })
    );
  }

  async logout(): Promise<void> {
    this.keep(await this.alert.confirm('ออกจากระบบ?', 'งานที่ยังไม่บันทึกจะหายไป'));
  }

  async copied(): Promise<void> {
    this.notify ??= this.alert.mixin({ icon: 'success', timer: 1500, showConfirmButton: false });
    this.keep(await this.notify.fire({ title: 'คัดลอกลิงก์แล้ว' }));
  }

  async sync(): Promise<void> {
    this.alert.showLoading();
    await wait(1500);
    this.alert.close();
    this.keep('synced');
  }

  async legacy(): Promise<void> {
    this.keep(await this.overlays.staticAlert.fire({ title: 'บันทึกแล้ว', icon: 'success' }));
  }
}

export abstract class ConfirmDialogDemo extends OverlayDemo {
  protected readonly doc = CONFIRMDIALOG_DOC;
  protected readonly importCode = CONFIRMDIALOG_DOC.ts!['import'] as string;
  readonly icons = ['warning', 'question', 'info', 'success', 'error'];

  remove(): void {
    this.overlays.confirm.confirm({
      header: 'ยืนยันการลบ',
      message: 'ต้องการลบลูกค้ารายนี้หรือไม่?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'ลบ',
      rejectLabel: 'ยกเลิก',
      acceptButtonStyleClass: 'p-button-danger',
      defaultFocus: 'reject',
      accept: () => (this.result = 'ลบแล้ว'),
      // 2 = WtConfirmEventType.CANCEL: closed with the ×, Esc or the mask
      reject: (type: number) => (this.result = type === 2 ? 'ปิดไป' : 'ยกเลิก'),
    });
  }

  ask(icon: string): void {
    this.overlays.confirm.confirm({ header: 'icon: ' + icon, message: 'ข้อความตัวอย่าง', icon, accept: () => (this.result = icon) });
  }

  askTop(): void {
    this.overlays.confirm.confirm({
      key: 'top',
      header: 'บันทึกแบบร่าง',
      message: 'บันทึกก่อนออกจากหน้านี้?',
      icon: 'question',
      accept: () => (this.result = 'บันทึกแบบร่างแล้ว'),
    });
  }

  invite(): void {
    this.overlays.confirm.confirm({
      key: 'custom',
      header: 'คำเชิญเข้าทีม',
      message: 'กมล ชวนคุณเข้าร่วมทีม "การตลาด"',
      accept: () => (this.result = 'เข้าร่วมแล้ว'),
      reject: () => (this.result = 'ไว้ก่อน'),
    });
  }

  askNowhere(): void {
    this.overlays.confirm.confirm({
      key: 'none',
      header: 'ส่งออกไฟล์?',
      message: 'ไฟล์จะถูกส่งไปที่อีเมลของคุณ',
      icon: 'info',
      accept: () => (this.result = 'ส่งออกแล้ว'),
    });
  }
}

export abstract class ToastDemo extends OverlayDemo {
  protected readonly doc = TOAST_DOC;
  readonly severities = ['success', 'info', 'warn', 'error', 'secondary', 'contrast'];
  dialogOpen = false;

  protected get messages() {
    return this.overlays.messages;
  }

  save(): void {
    this.messages.add({ severity: 'success', summary: 'บันทึกแล้ว', detail: 'ข้อมูลลูกค้าถูกบันทึกเรียบร้อย' });
  }

  show(severity: string): void {
    this.messages.add({ severity, summary: severity, detail: 'ข้อความตัวอย่าง' });
  }

  at(key: string, summary: string): void {
    this.messages.add({ key, severity: 'info', summary, detail: 'ข้อความตัวอย่าง' });
  }

  sticky(): void {
    this.messages.add({ severity: 'warn', summary: 'ต้องตรวจสอบ', detail: 'ค้างไว้จนกว่าจะปิด', sticky: true });
  }

  long(): void {
    this.messages.add({ severity: 'info', summary: 'แสดง 10 วินาที', life: 10000 });
  }

  clear(): void {
    this.messages.clear();
    for (const key of ['bl', 'tc', 'invite']) this.messages.clear(key);
  }

  share(): void {
    this.messages.add({ key: 'invite', summary: 'สมหญิงแชร์เอกสาร', detail: 'รายงานยอดขายเดือนมีนาคม', data: { initial: 'ส' }, life: 6000 });
  }

  fromDialog(): void {
    this.messages.add({ severity: 'success', summary: 'ส่งแล้ว', detail: 'toast ขึ้นเหนือ dialog' });
  }
}

export abstract class TooltipDemo extends SimpleDemo {
  protected readonly doc = TOOLTIP_DOC;
  off = true;
}

export abstract class PopoverDemo extends SimpleDemo {
  protected readonly doc = POPOVER_DOC;
  readonly team = ['สมหญิง', 'กมล', 'ณัฐ', 'ปวีณา'];
  owner = '';
}

export abstract class AnimateDemo extends SimpleDemo {
  protected readonly doc = ANIMATE_DOC;
  protected readonly setupCode = ANIMATE_DOC.ts!['import'] as string;
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
  protected readonly helpersCode = VALIDATION_DOC.ts!['helpers'] as string;
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
