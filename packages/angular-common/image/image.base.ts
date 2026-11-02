import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵlockScroll,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵWU_SKIP_VERSION_CHECK,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { WuLocale } from 'wiraui/core';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const ZOOM = { step: 0.1, min: 0.5, max: 1.5 };

/**
 * What wu-image does, shared by the v1 and v2/v3 templates: an `<img>`, and with `[preview]="true"` a button over it
 * that opens the picture full screen (a modal `<dialog>` in the top layer, so `appendTo` is not needed) with rotate and
 * zoom buttons. Escape, the close button or a click beside the picture closes it.
 */
@Directive()
export abstract class ɵWuImageBase implements OnDestroy {
  @Input() src?: string | null;
  @Input() srcSet?: string;
  @Input() sizes?: string;
  @Input() alt?: string;
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() loading?: 'lazy' | 'eager';
  @Input() imageClass?: string;
  @Input() imageStyle?: Record<string, string | number> | null;
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;
  /** Click to see the picture full screen. */
  @Input() set preview(v: unknown) { this._preview = ɵtoBool(v); }
  get preview(): boolean { return this._preview; }
  /** A larger file for the full-screen view. Default: `src`. */
  @Input() previewImageSrc?: string;
  @Input() previewImageSrcSet?: string;
  @Input() previewImageSizes?: string;
  /** Accepted for templates moving over: the preview opens in the top layer. */
  @Input() appendTo: unknown;
  @Input() showTransitionOptions: unknown;
  @Input() hideTransitionOptions: unknown;

  @Output() readonly onShow = new EventEmitter<void>();
  @Output() readonly onHide = new EventEmitter<void>();
  @Output() readonly onImageError = new EventEmitter<Event>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('indicator', { descendants: false }) protected indicatorRef?: unknown;
  @ContentChild('image', { descendants: false }) protected imageRef?: unknown;
  @ContentChild('preview', { descendants: false }) protected previewRef?: unknown;
  @ViewChild('dialog') protected dialogRef?: ElementRef<HTMLDialogElement>;

  /** For the `image` template: call it from the img's (error). */
  readonly errorCallback = (event: Event): void => this.imageError(event);
  previewVisible = false;
  rotate = 0;
  scale = 1;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly doc = inject(DOCUMENT);
  protected readonly config = inject(WuConfig);
  private readonly i18n = ɵrefreshOnTranslation();
  private _preview = false;
  private unlock: (() => void) | null = null;
  private opener: HTMLElement | null = null;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18n.unsubscribe();
    this.unlock?.();
  }

  get t(): WuLocale {
    return this.config.translation;
  }
  get indicatorTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.indicatorRef) || ɵfindTemplate(this.templates, 'indicator');
  }
  get imageTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.imageRef) || ɵfindTemplate(this.templates, 'image');
  }
  get previewTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.previewRef) || ɵfindTemplate(this.templates, 'preview');
  }
  get previewSrc(): string | null {
    return this.previewImageSrc || this.src || null;
  }
  get transform(): string {
    return `rotate(${this.rotate}deg) scale(${this.scale})`;
  }
  get canZoomIn(): boolean {
    return this.scale < ZOOM.max - 1e-9;
  }
  get canZoomOut(): boolean {
    return this.scale > ZOOM.min + 1e-9;
  }
  /** Context for the `preview` template. */
  get previewContext(): { $implicit: string | null; class: string; style: Record<string, string>; previewCallback: () => void } {
    return { $implicit: this.previewSrc, class: 'wu-image-original p-image-original', style: { transform: this.transform }, previewCallback: () => this.closePreview() };
  }

  openPreview(event?: Event): void {
    if (!this._preview || this.previewVisible) return;
    this.opener = (event?.currentTarget as HTMLElement | null) ?? null;
    this.rotate = 0;
    this.scale = 1;
    this.previewVisible = true;
    this.cdr.detectChanges();
    const dialog = this.dialogRef?.nativeElement;
    if (dialog && typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    this.unlock = ɵlockScroll(this.doc);
    this.onShow.emit();
  }

  closePreview(): void {
    if (!this.previewVisible) return;
    const dialog = this.dialogRef?.nativeElement;
    if (dialog?.open) dialog.close();
    this.previewVisible = false;
    this.unlock?.();
    this.unlock = null;
    this.cdr.markForCheck();
    this.opener?.focus();
    this.onHide.emit();
  }

  /** The dialog's own Escape (cancel) closes through closePreview, so the opener gets focus back. */
  dialogCancel(event: Event): void {
    event.preventDefault();
    this.closePreview();
  }

  /** A click on the dark area beside the picture closes it; clicks on the picture and the buttons do not. */
  maskClick(event: MouseEvent): void {
    if (event.target === event.currentTarget || (event.target as HTMLElement).classList?.contains('wu-image-preview-stage')) this.closePreview();
  }

  rotateRight(): void {
    this.rotate += 90;
  }
  rotateLeft(): void {
    this.rotate -= 90;
  }
  zoomIn(): void {
    if (this.canZoomIn) this.scale = Math.round((this.scale + ZOOM.step) * 10) / 10;
  }
  zoomOut(): void {
    if (this.canZoomOut) this.scale = Math.round((this.scale - ZOOM.step) * 10) / 10;
  }

  imageError(event: Event): void {
    this.onImageError.emit(event);
  }
}
