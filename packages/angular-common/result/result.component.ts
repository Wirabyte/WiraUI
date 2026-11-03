import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';
import { WuResultStatus } from '@wirabyte/ui/core';

export type { WuResultStatus };

const STATUSES: readonly WuResultStatus[] = ['success', 'error', 'info', 'warning', '403', '404', '500'];

/**
 * The page or panel after a task ends, or instead of a page that cannot be shown:
 * `<wu-result status="success" title="ส่งใบสมัครแล้ว"><wu-button wuResultExtra label="กลับหน้าแรก"></wu-button></wu-result>`.
 * `success`, `error`, `info` and `warning` draw a large status mark in the theme's colours; `403`, `404` and `500` draw
 * the code with a picture in place of its 0. Title and line come from the locale unless given. Elements marked
 * `wuResultExtra` sit in a row of actions; anything else inside the tag goes in a details box under them.
 */
@Component({
  selector: 'wu-result',
  standalone: true,
  imports: [NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './result.component.html',
  styleUrls: ['./result.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here: keep it off the host so the whole block gets no browser tooltip.
  host: { class: 'wu-result-host', '[attr.title]': 'null' },
})
export class WuResult implements OnDestroy {
  /** Default `'info'`. Numbers work too: `[status]="404"`. */
  @Input() set status(v: WuResultStatus | number | string | null | undefined) {
    const s = String(v ?? '') as WuResultStatus;
    this._status = STATUSES.includes(s) ? s : 'info';
  }
  get status(): WuResultStatus {
    return this._status;
  }
  /** Default: the locale's title for `status`; `''` shows none. */
  @Input() title?: string | null;
  /** The line under the title. Default: the locale's line for `status`; `''` shows none. */
  @Input() subtitle?: string | null;
  /** An icon class (`'wi wi-rocket'`) in the status circle instead of the drawn mark. */
  @Input() icon?: string | null;
  /** `false` leaves out the mark or picture. */
  @Input() showIcon: boolean | string | null | undefined = true;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  private _status: WuResultStatus = 'info';
  private readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  // ---------- what the template reads ----------

  get titleText(): string {
    return this.title ?? this.config.translation.result?.[this._status]?.title ?? '';
  }
  get subtitleText(): string {
    return this.subtitle ?? this.config.translation.result?.[this._status]?.description ?? '';
  }
  /** 403, 404 and 500 draw their code; the others a status mark. */
  get isCode(): boolean {
    return this._status === '403' || this._status === '404' || this._status === '500';
  }
  get shown(): boolean {
    return this.showIcon !== false && this.showIcon !== 'false';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
}
