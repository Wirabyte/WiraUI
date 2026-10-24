import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { definePreset, palette, Siam, WtConfig, WtThemeService } from 'wiratheme/config';
import { EN_LOCALE } from 'wiratheme/core';
import { WtAlert, WtAlertService } from 'wiratheme/alert';
import { WtConfirmationService } from 'wiratheme/confirmdialog';
import { WtMessageService } from 'wiratheme/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent {
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
