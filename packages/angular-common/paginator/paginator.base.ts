import { ChangeDetectorRef, ContentChild, ContentChildren, Directive, EventEmitter, inject, Input, OnDestroy, Output, QueryList, TemplateRef } from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵtoBool, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate } from '@wirabyte/ui/config';
import { pageInfo, pageLinks, pageReport, WuLocale } from '@wirabyte/ui/core';
import { WuPageEvent } from './paginator.types';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const toInt = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Math.floor(Number(v)) : fallback);

/**
 * What wu-paginator does, shared by the v1 and v2/v3 templates. Page buttons, a rows-per-page box and a page report
 * in Thai (`กำลังแสดง 11 ถึง 20 จาก 57 รายการ`); the parts wrap onto new lines on narrow screens.
 */
@Directive()
export abstract class ɵWuPaginatorBase implements OnDestroy {
  /** Index of the first row of the current page (0-based). */
  @Input() set first(v: unknown) { this._first = Math.max(0, toInt(v, 0)); }
  get first(): number { return this._first; }
  /** Rows per page. Default 10. */
  @Input() set rows(v: unknown) { this._rows = Math.max(1, toInt(v, 10)); }
  get rows(): number { return this._rows; }
  @Input() set totalRecords(v: unknown) { this._total = Math.max(0, toInt(v, 0)); }
  get totalRecords(): number { return this._total; }
  /** Choices for the rows-per-page box, e.g. `[10, 25, 50]`. */
  @Input() rowsPerPageOptions?: number[] | null;
  @Input() set showCurrentPageReport(v: unknown) { this._showReport = ɵtoBool(v); }
  get showCurrentPageReport(): boolean { return this._showReport; }
  /** Default: the locale's text, `กำลังแสดง {first} ถึง {last} จาก {totalRecords} รายการ`. */
  @Input() currentPageReportTemplate?: string;
  /** How many page numbers to show. Default 5. */
  @Input() set pageLinkSize(v: unknown) { this._linkSize = Math.max(1, toInt(v, 5)); }
  /** Show the paginator when everything fits on one page. Default true. */
  @Input() set alwaysShow(v: unknown) { this._alwaysShow = v === undefined || ɵtoBool(v); }
  get alwaysShow(): boolean { return this._alwaysShow; }
  @Input() set showFirstLastIcon(v: unknown) { this._firstLast = v === undefined || ɵtoBool(v); }
  get showFirstLastIcon(): boolean { return this._firstLast; }
  @Input() set showPageLinks(v: unknown) { this._links = v === undefined || ɵtoBool(v); }
  get showPageLinks(): boolean { return this._links; }
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  @Input() ariaLabel?: string;
  /** Accepted for templates moving over: the rows-per-page list opens in the top layer. */
  @Input() dropdownAppendTo: unknown;
  @Input() showJumpToPageDropdown: unknown;

  @Output() readonly onPageChange = new EventEmitter<WuPageEvent>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('start', { descendants: false }) protected startRef?: unknown;
  @ContentChild('end', { descendants: false }) protected endRef?: unknown;
  /** The names table templates use, for `<ng-template #paginatorleft>` / `#paginatorright` too. */
  @ContentChild('paginatorleft', { descendants: false }) protected leftRef?: unknown;
  @ContentChild('paginatorright', { descendants: false }) protected rightRef?: unknown;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _first = 0;
  private _rows = 10;
  private _total = 0;
  private _showReport = false;
  private _linkSize = 5;
  private _alwaysShow = true;
  private _firstLast = true;
  private _links = true;
  /** Templates the table passes down (its paginatorleft / paginatorright). */
  @Input() set leftTemplate(v: TemplateRef<unknown> | null | undefined) { this.startTemplateInput = v || null; }
  @Input() set rightTemplate(v: TemplateRef<unknown> | null | undefined) { this.endTemplateInput = v || null; }
  startTemplateInput: TemplateRef<unknown> | null = null;
  endTemplateInput: TemplateRef<unknown> | null = null;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get info(): { page: number; pageCount: number; first: number; last: number } {
    return pageInfo({ first: this._first, rows: this._rows, totalRecords: this._total });
  }
  get links(): number[] {
    const i = this.info;
    return pageLinks(i.page, i.pageCount, this._linkSize);
  }
  get report(): string {
    return pageReport(this.currentPageReportTemplate || this.t.pageReport, { first: this._first, rows: this._rows, totalRecords: this._total });
  }
  get visible(): boolean {
    return this._alwaysShow || this.info.pageCount > 1;
  }
  get atStart(): boolean {
    return this.info.page === 0;
  }
  get atEnd(): boolean {
    const i = this.info;
    return i.page >= i.pageCount - 1;
  }
  /** The same array while rowsPerPageOptions is unchanged, so the select does not rebuild its list on every check. */
  get rppOptions(): { label: string; value: number }[] {
    const src = this.rowsPerPageOptions || [];
    if (src !== this.rppSource) {
      this.rppSource = src;
      this.rppCache = src.filter((n) => Number(n) > 0).map((n) => ({ label: String(n), value: Number(n) }));
    }
    return this.rppCache;
  }
  private rppSource: number[] | null = null;
  private rppCache: { label: string; value: number }[] = [];
  get startTemplate(): TemplateRef<unknown> | null {
    return (
      this.startTemplateInput ||
      asTemplate(this.startRef) ||
      asTemplate(this.leftRef) ||
      ɵfindTemplate(this.templates, 'start') ||
      ɵfindTemplate(this.templates, 'paginatorleft')
    );
  }
  get endTemplate(): TemplateRef<unknown> | null {
    return (
      this.endTemplateInput ||
      asTemplate(this.endRef) ||
      asTemplate(this.rightRef) ||
      ɵfindTemplate(this.templates, 'end') ||
      ɵfindTemplate(this.templates, 'paginatorright')
    );
  }
  get templateContext(): { $implicit: WuPageEvent } {
    return { $implicit: this.event() };
  }
  pageAria(page: number): string {
    return this.t.pageLabel.replace('{page}', String(page + 1));
  }

  changePage(page: number): void {
    const i = this.info;
    const p = Math.min(Math.max(0, page), i.pageCount - 1);
    if (p === i.page && this._first === p * this._rows) return;
    this._first = p * this._rows;
    this.onPageChange.emit(this.event());
    this.cdr.markForCheck();
  }

  changeRows(rows: unknown): void {
    const r = Math.max(1, toInt(rows, this._rows));
    if (r === this._rows) return;
    // Keep the first row on screen within the new page size.
    this._first = Math.floor(this._first / r) * r;
    this._rows = r;
    this.onPageChange.emit(this.event());
    this.cdr.markForCheck();
  }

  private event(): WuPageEvent {
    const i = this.info;
    return { page: i.page, first: this._first, rows: this._rows, pageCount: i.pageCount };
  }
}
