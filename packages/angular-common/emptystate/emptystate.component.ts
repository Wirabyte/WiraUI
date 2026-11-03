import { NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';
import { WuEmptyStateType } from '@wirabyte/ui/core';

export type { WuEmptyStateType };
export type WuEmptyStateSize = 'small' | 'normal' | 'large';

const TYPES: readonly WuEmptyStateType[] = ['nodata', 'search', 'inbox', 'folder', 'error', 'offline'];

/**
 * What a list, table or page shows when there is nothing in it:
 * `<wu-empty-state type="search"><wu-button label="ล้างตัวกรอง" (onClick)="clear()"></wu-button></wu-empty-state>`.
 * A drawing per `type` (no data, nothing found, empty inbox, empty folder, failed load, offline) in the theme's colours,
 * a title and a line under it in the app's language (both replaceable), and whatever is inside the tag as actions.
 * `icon` or `image` replace the drawing; `size="small"` fits inside a table's empty row.
 */
@Component({
  selector: 'wu-empty-state, wu-emptyState, wu-empty',
  standalone: true,
  imports: [NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './emptystate.component.html',
  styleUrls: ['./emptystate.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `title` is an input here: keep it off the host so the whole block gets no browser tooltip.
  host: { class: 'wu-empty-state-host', '[attr.title]': 'null' },
})
export class WuEmptyState implements OnDestroy {
  /** Which drawing and default text. Default `'nodata'`. */
  @Input() set type(v: WuEmptyStateType | string | null | undefined) {
    this._type = TYPES.includes(v as WuEmptyStateType) ? (v as WuEmptyStateType) : 'nodata';
  }
  get type(): WuEmptyStateType {
    return this._type;
  }
  /** The title. Default: the locale's title for `type`; `''` shows none. */
  @Input() title?: string | null;
  /** The line under the title. Default: the locale's line for `type`; `''` shows none. */
  @Input() description?: string | null;
  /** An icon class (`'wi wi-users'`) in a soft circle, instead of the drawing. */
  @Input() icon?: string | null;
  /** A picture of your own instead of the drawing. */
  @Input() image?: string | null;
  @Input() imageAlt?: string | null;
  /** `false` leaves out the drawing (and icon / image). */
  @Input() showImage: boolean | string | null | undefined = true;
  /** `'small'` for inside tables and cards, `'large'` for a whole page. */
  @Input() size: WuEmptyStateSize | null | undefined = 'normal';
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  private _type: WuEmptyStateType = 'nodata';
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
    return this.title ?? this.config.translation.emptyState?.[this._type]?.title ?? '';
  }
  get descriptionText(): string {
    return this.description ?? this.config.translation.emptyState?.[this._type]?.description ?? '';
  }
  get pictured(): boolean {
    return this.showImage !== false && this.showImage !== 'false';
  }
  get sizeClass(): string {
    return this.size === 'small' ? 'wu-empty-state-sm' : this.size === 'large' ? 'wu-empty-state-lg' : '';
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
}
