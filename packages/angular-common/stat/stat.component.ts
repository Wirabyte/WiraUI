import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';

export type WuStatSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';

const SEVERITIES: readonly WuStatSeverity[] = ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'];

/**
 * A number to watch: `<wu-stat label="Ticket ที่เปิดอยู่" [value]="12" icon="wi wi-ticket" severity="info" [trend]="8"
 * trendLabel="จากเดือนก่อน">`. An icon in a soft tile of its colour, the label, the value in large figures, and under
 * it the trend (▲ green when up is good, ▼ red; `trendGood="down"` for counts that should fall) and a hint. With
 * `clickable` the whole card is a button that emits `(onClick)`. Anything inside the tag goes under the figures, such as
 * a sparkline.
 */
@Component({
  selector: 'wu-stat',
  standalone: true,
  imports: [NgClass, NgIf, NgTemplateOutlet],
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-stat-host' },
})
export class WuStat implements OnDestroy {
  @Input() label?: string | null;
  /** The figure. Numbers are shown with thousands separators in the app's language; strings as they are. */
  @Input() value?: number | string | null;
  /** Text right after the value, smaller: `'฿'` before needs `prefix`, `'ครั้ง'` after goes here. */
  @Input() unit?: string | null;
  @Input() prefix?: string | null;
  /** Icon class: `'wi wi-ticket'`. */
  @Input() icon?: string | null;
  /** Colour of the icon tile. Default `'primary'`. */
  @Input() severity: WuStatSeverity | null | undefined = 'primary';
  /** A muted line under the value: `'จาก 40 รายการ'`. */
  @Input() hint?: string | null;
  /** Change since the last period. A number gets a sign and `trendSuffix`; a string is shown as it is. */
  @Input() trend?: number | string | null;
  @Input() trendSuffix: string | null | undefined = '%';
  /** Which direction is good news: `'up'` (default) or `'down'` (complaints, open tickets, costs). */
  @Input() trendGood: 'up' | 'down' | null | undefined = 'up';
  /** Words after the trend: `'จากเดือนก่อน'`. */
  @Input() trendLabel?: string | null;
  /** The whole card becomes a button that emits `(onClick)`. */
  @Input() set clickable(v: unknown) { this._clickable = ɵtoBool(v); }
  get clickable(): boolean { return this._clickable; }
  /** Shows a placeholder shimmer instead of the figures while the number loads. */
  @Input() set loading(v: unknown) { this._loading = ɵtoBool(v); }
  get loading(): boolean { return this._loading; }
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @Output() readonly onClick = new EventEmitter<MouseEvent>();

  private _clickable = false;
  private _loading = false;
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get rootClass(): string {
    const severity = SEVERITIES.includes(this.severity as WuStatSeverity) ? this.severity : 'primary';
    return ['wu-stat', `wu-stat-${severity}`, this._clickable ? 'wu-stat-clickable' : '', this.styleClass || ''].filter(Boolean).join(' ');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get valueText(): string {
    const v = this.value;
    if (v === null || v === undefined || v === '') return '–';
    return typeof v === 'number' && Number.isFinite(v) ? v.toLocaleString(this.numberLocale) : String(v);
  }
  get hasTrend(): boolean {
    return this.trend !== null && this.trend !== undefined && this.trend !== '';
  }
  /** `up`, `down` or `same`, from the sign of a numeric trend (a string trend reads its leading + or -). */
  get direction(): 'up' | 'down' | 'same' {
    const t = this.trend;
    const n = typeof t === 'number' ? t : parseFloat(String(t ?? '').replace(/[^\d.+-]/g, ''));
    if (!Number.isFinite(n) || n === 0) return 'same';
    return n > 0 ? 'up' : 'down';
  }
  get trendClass(): string {
    const d = this.direction;
    if (d === 'same') return 'wu-stat-trend wu-stat-trend-same';
    const good = (this.trendGood || 'up') === d;
    return `wu-stat-trend wu-stat-trend-${d} ${good ? 'wu-stat-trend-good' : 'wu-stat-trend-bad'}`;
  }
  get trendText(): string {
    const t = this.trend;
    if (typeof t !== 'number') return String(t ?? '');
    const sign = t > 0 ? '+' : t < 0 ? '−' : '';
    return sign + Math.abs(t).toLocaleString(this.numberLocale) + (this.trendSuffix ?? '');
  }
  /** What a screen reader says before the trend figure. */
  get trendWords(): string {
    const s = this.config.translation.stat;
    return this.direction === 'up' ? s?.up ?? 'Up' : this.direction === 'down' ? s?.down ?? 'Down' : s?.same ?? 'No change';
  }

  click(event: MouseEvent): void {
    this.onClick.emit(event);
  }

  private get numberLocale(): string {
    return this.config.translation.code === 'th' ? 'th-TH' : 'en-US';
  }
}
