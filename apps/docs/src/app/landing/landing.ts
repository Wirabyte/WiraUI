import { Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocsState } from '../core/docs-state';
import { DocsI18n, Text } from '../core/i18n';
import { navPageOf } from '../core/nav';
import { DocsThemeReveal } from '../core/theme-reveal';
import { DOCS_THEME } from '../core/version-theme';
import { DOC_VERSIONS, rememberedVersion } from '../core/versions';
import { sampleText } from '../core/sample-text';
import { GUIDE_WORDS, MIGRATE_AFTER } from '../shared/pages/samples';

const STATUS: Record<string, Text> = {
  maintenance: { th: 'maintenance · แก้บั๊ก', en: 'maintenance' },
  active: 'active',
  latest: { th: 'latest · ล่าสุด', en: 'latest' },
};

const MONTHS: Record<'th' | 'en', string[]> = {
  th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const REVENUE = [62, 70, 66, 78, 84, 80, 92, 98, 94, 108, 116, 128];

/** Marketing page at /. A sample dashboard built from real wiratheme@3 components, in v3's default look. */
@Component({
  selector: 'docs-landing',
  standalone: false,
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly state = inject(DocsState);
  protected readonly i18n = inject(DocsI18n);
  private readonly reveal = inject(DocsThemeReveal);
  protected readonly en = this.i18n.en;
  protected readonly versions = DOC_VERSIONS;
  protected readonly status = STATUS;
  protected readonly start = rememberedVersion();
  /** The code sample in the site language (core/sample-text.ts). */
  protected readonly code = computed(() => (this.en() ? sampleText(GUIDE_WORDS).swap(MIGRATE_AFTER) : MIGRATE_AFTER));
  protected readonly swatches = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b'];

  protected readonly kpis: { label: Text; value: string; delta: string; up: boolean }[] = [
    { label: { th: 'รายได้', en: 'Revenue' }, value: '฿1.28M', delta: '+12.4%', up: true },
    { label: { th: 'คำสั่งซื้อ', en: 'Orders' }, value: '3,412', delta: '+5.1%', up: true },
    { label: { th: 'ผู้ใช้', en: 'Users' }, value: '18,920', delta: '+2.3%', up: true },
    { label: { th: 'Conversion', en: 'Conversion' }, value: '3.6%', delta: '−0.4%', up: false },
  ];

  /** Bars of the revenue chart (heights in % of the tallest month). */
  protected readonly bars = computed(() => {
    const max = Math.max(...REVENUE);
    return REVENUE.map((v, i) => ({ month: MONTHS[this.i18n.lang()][i], value: v, height: Math.round((v / max) * 100) }));
  });

  protected readonly activity: { icon: string; tone: string; text: Text; time: Text }[] = [
    { icon: 'check', tone: 'success', text: { th: 'คำสั่งซื้อ #10482 ชำระเงินแล้ว', en: 'Order #10482 paid' }, time: { th: '2 นาทีที่แล้ว', en: '2 min ago' } },
    { icon: 'sparkles', tone: 'info', text: { th: 'มีผู้ใช้ใหม่สมัครแผน Pro', en: 'A new user joined the Pro plan' }, time: { th: '18 นาทีที่แล้ว', en: '18 min ago' } },
    { icon: 'refresh', tone: 'warn', text: { th: 'คืนเงินคำสั่งซื้อ #10391', en: 'Refunded order #10391' }, time: { th: '1 ชั่วโมงที่แล้ว', en: '1 hour ago' } },
    { icon: 'alert', tone: 'danger', text: { th: 'ชำระเงินไม่สำเร็จ 3 รายการ', en: '3 payments failed' }, time: { th: '3 ชั่วโมงที่แล้ว', en: '3 hours ago' } },
  ];

  protected readonly plans = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    plan: new FormControl('pro', { nonNullable: true, validators: [Validators.required] }),
    newsletter: new FormControl(true, { nonNullable: true }),
  });
  protected submitted = false;

  protected readonly submit = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.submitted = true;
        resolve();
      }, 1100)
    );

  constructor() {
    // Docs chrome needs tokens before any version module loads: the landing page shows v3's default look.
    this.state.activate(inject(DOCS_THEME));
  }

  protected link(path: string): string {
    return '/' + this.start + '/' + path;
  }

  protected pageTitle(path: string): Text {
    return navPageOf(path)?.title ?? path;
  }

  /** Light / dark and the colour swatches grow out of the button pressed, as in the docs header (core/theme-reveal.ts). */
  protected toggleDark(event: Event): void {
    this.reveal.run(event.currentTarget, () => this.state.setDark(!this.state.dark()));
  }

  protected setPrimary(hex: string | null, event: Event): void {
    this.reveal.run(event.currentTarget, () => this.state.update({ primary: hex }));
  }
}
