import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  inject,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig } from '@wirabyte/ui/config';

/** One row of `[items]`: `{ label: 'สถานะ', value: 'กำลังดำเนินการ', span: 2 }`. */
export interface WuDescriptionsEntry {
  label: string;
  value?: string | number | null;
  /** How many columns the item takes. Default 1. */
  span?: number;
}

const toInt = (v: unknown, fallback: number): number => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/**
 * One label and its value inside `wu-descriptions`: `<wu-descriptions-item label="สถานะ"><wu-tag …></wu-tag></wu-descriptions-item>`.
 * Whatever is inside the tag is the value.
 */
@Component({
  selector: 'wu-descriptions-item, wu-descriptionsItem',
  standalone: true,
  template: '<ng-template #content><ng-content></ng-content></ng-template>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuDescriptionsItem {
  @Input() label?: string | null;
  /** How many columns the item takes. Default 1. */
  @Input() set span(v: unknown) { this._span = toInt(v, 1); }
  get span(): number { return this._span; }
  @ViewChild('content', { static: true }) content!: TemplateRef<unknown>;
  private _span = 1;
}

/**
 * Facts as label and value pairs, in columns: `<wu-descriptions [columns]="2" title="ข้อมูล Ticket">` with
 * `<wu-descriptions-item label="…">` inside, or `[items]="[{ label, value }]"`. `layout="vertical"` puts each label
 * above its value; `bordered` draws a table of cells. The columns fold into one when its box is too narrow for them.
 */
@Component({
  selector: 'wu-descriptions',
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet],
  templateUrl: './descriptions.component.html',
  styleUrls: ['./descriptions.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'wu-descriptions-host', '[attr.title]': 'null' },
})
export class WuDescriptions {
  /** A heading over the list. */
  @Input() title?: string | null;
  @Input() items?: WuDescriptionsEntry[] | null;
  /** Columns on a wide box. Default 1. */
  @Input() set columns(v: unknown) { this._columns = toInt(v, 1); }
  get columns(): number { return this._columns; }
  /** `'horizontal'` (default): label beside value. `'vertical'`: label above value. */
  @Input() layout: 'horizontal' | 'vertical' | null | undefined = 'horizontal';
  /** Cells with borders and a tinted label column. */
  @Input() set bordered(v: unknown) { this._bordered = ɵtoBool(v); }
  get bordered(): boolean { return this._bordered; }
  /** `'small'` tightens the spacing. */
  @Input() size: 'small' | 'normal' | null | undefined = 'normal';
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;

  @ContentChildren(WuDescriptionsItem) protected children?: QueryList<WuDescriptionsItem>;

  private _columns = 1;
  private _bordered = false;
  private readonly config = inject(WuConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  get rootClass(): string {
    return [
      'wu-descriptions',
      this.layout === 'vertical' ? 'wu-descriptions-vertical' : 'wu-descriptions-horizontal',
      this._bordered ? 'wu-descriptions-bordered' : '',
      this.size === 'small' ? 'wu-descriptions-sm' : '',
      this.styleClass || '',
    ]
      .filter(Boolean)
      .join(' ');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> {
    const own = this.style && typeof this.style === 'object' ? this.style : {};
    return { ...own, '--_cols': String(this._columns) };
  }
  spanOf(span: number | undefined): string {
    return `span ${Math.min(toInt(span, 1), this._columns)}`;
  }
  valueText(v: unknown): string {
    if (v === null || v === undefined || v === '') return '–';
    return typeof v === 'number' ? v.toLocaleString(this.config.translation.code === 'th' ? 'th-TH' : 'en-US') : String(v);
  }
}
