import { DOCUMENT, isPlatformBrowser, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ɵassertSupportedAngular,
  ɵfindTemplate,
  ɵrefreshOnTranslation,
  ɵtoBool,
  ɵuniqueId,
  ɵWU_SKIP_VERSION_CHECK,
  ɵWuStyleLoader,
  WuConfig,
  WuTemplate,
} from 'wiraui/config';
import { ɵbuttonClass, ɵWU_BUTTON_CSS } from 'wiraui/button';
import {
  base64ToFile,
  clampCrop,
  clampView,
  cropArea,
  CropDimensions,
  CropHandle,
  cropHeight,
  cropperToolbarGroups,
  CropperToolName,
  CropLimits,
  CropMatrix,
  CropOrientation,
  CropperPosition,
  CropView,
  cropWidth,
  exifTransform,
  growCrop,
  initialCrop,
  MAX_CANVAS_AREA,
  moveCrop,
  normalizeAngle,
  normalizeCrop,
  orientationMatrix,
  outputSize,
  padToRatio,
  panCrop,
  parseAspectRatio,
  readExifOrientation,
  remapCrop,
  remapPoint,
  resizeCrop,
  rotatedSize,
  rotateOrientation,
  roundCrop,
  sameCrop,
  viewWindow,
  WuLocale,
  zoomCrop,
} from 'wiraui/core';
import {
  WU_IMAGE_CROPPER_OPTIONS,
  WuImageCroppedEvent,
  WuImageCropperFormat,
  WuImageCropperToolbar,
  WuImageTransform,
  WuLoadedImage,
} from './imagecropper.types';

/** A group of buttons on the toolbar; `zoom` when it holds the slider (it then takes the spare width). */
interface WuImageCropperToolGroup {
  tools: CropperToolName[];
  zoom: boolean;
}

/** A decoded picture, upright (EXIF orientation applied), ready to draw. */
interface Source {
  image: CanvasImageSource;
  width: number;
  height: number;
  /** Size as stored in the file, before the EXIF orientation. */
  rawWidth: number;
  rawHeight: number;
  exif: { rotate: number; flip: boolean };
  close(): void;
}

interface Gesture {
  mode: 'move' | 'resize' | 'pan' | 'pinch' | 'none';
  handle: CropHandle | null;
  x: number;
  y: number;
  crop: CropperPosition;
  view: CropView;
  distance: number;
}

/** Each zoom button press multiplies (or divides) the zoom by this. */
const ZOOM_STEP = 1.25;
/** The crop box never gets smaller than this on screen, so its handles stay usable. */
const MIN_BOX_PX = 16;
/** Wait after the last change before cropping again (autoCrop), in ms. */
const CROP_DELAY = 120;
const UPRIGHT: CropOrientation = { rotate: 0, flipH: false, flipV: false };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return v !== null && v !== '' && isFinite(n) ? n : fallback;
};
const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);
const groupTools = (toolbar: WuImageCropperToolbar | readonly string[] | string | null | undefined): WuImageCropperToolGroup[] =>
  cropperToolbarGroups(toolbar).map((tools) => ({ tools, zoom: tools.includes('zoomSlider') }));
const sameTurn = (a: CropOrientation, b: CropOrientation) =>
  normalizeAngle(a.rotate) === normalizeAngle(b.rotate) && a.flipH === b.flipH && a.flipV === b.flipV;

/**
 * Crops a picture: `<wu-imagecropper [imageFile]="file" [aspectRatio]="4 / 3" [resizeToWidth]="800"
 * (imageCropped)="saved($event)">`. The picture comes from a File/Blob (`imageFile`), a file input's change event
 * (`imageChangedEvent`), a URL or base64; JPEG photos from phones are turned upright from their EXIF orientation.
 * Drag the box to move it, its corners and edges to resize it (the aspect ratio is kept unless
 * `[maintainAspectRatio]="false"`); the toolbar zooms, turns, mirrors and resets. Keyboard on the focused box: arrows
 * move it (Shift = 10 px), Alt + arrows resize it, + / − grow and shrink it. Ctrl + wheel or a pinch zooms; while
 * zoomed in, dragging outside the box pans. The crop box is kept in image pixels, so resizing the window keeps it.
 * `(imageCropped)` fires after each change (`[autoCrop]="false"` to call `crop()` yourself).
 */
@Component({
  // `image-cropper` is the tag cropper templates already use, so they move over unchanged.
  selector: 'wu-imagecropper, wu-imageCropper, wu-image-cropper, image-cropper',
  standalone: true,
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgTemplateOutlet],
  templateUrl: './imagecropper.component.html',
  styleUrls: ['./imagecropper.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuImageCropper implements OnChanges, AfterViewInit, OnDestroy {
  /** App-wide defaults from `provideImageCropperOptions()`; the inputs below start from them. */
  private readonly defaults = inject(WU_IMAGE_CROPPER_OPTIONS, { optional: true }) || {};

  // ---------- the picture ----------

  /** A picked file, or any image Blob. */
  @Input() imageFile: Blob | null | undefined;
  /** The `(change)` event of an `<input type="file">`: its first file is opened. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() imageChangedEvent: any;
  /** An image URL (same origin, or served with CORS so the result can be read back). */
  @Input() imageURL: string | null | undefined;
  /** A data URL (`data:image/…;base64,…`) or bare base64. */
  @Input() imageBase64: string | null | undefined;

  // ---------- the result ----------

  @Input() format: WuImageCropperFormat = this.defaults.format ?? 'png';
  /** 0–100, for jpeg and webp. Default 92. */
  @Input() imageQuality: number | string | null | undefined = this.defaults.imageQuality ?? 92;
  /** `'blob'` (default: `blob` + `objectUrl`) or `'base64'` (a data URL). */
  @Input() output: 'blob' | 'base64' = this.defaults.output ?? 'blob';
  /** Output width in pixels (0 = the crop's own size). With `resizeToHeight` too, the image fits inside both. */
  @Input() resizeToWidth: number | string | null | undefined = 0;
  @Input() resizeToHeight: number | string | null | undefined = 0;
  /** Never enlarge: a crop smaller than `resizeToWidth` / `resizeToHeight` keeps its size. */
  @Input() set onlyScaleDown(v: unknown) { this._onlyScaleDown = ɵtoBool(v); }
  get onlyScaleDown(): boolean { return this._onlyScaleDown; }
  /** Fill for transparent areas (padding, tilted corners, transparent PNGs). JPEG without one gets white. */
  @Input() backgroundColor: string | null | undefined;
  /** Crop after every change (debounced). Default true. */
  @Input() set autoCrop(v: unknown) { this._autoCrop = v === undefined || v === null || ɵtoBool(v); }
  get autoCrop(): boolean { return this._autoCrop; }

  // ---------- the crop box ----------

  /** Width / height of the box, e.g. `1`, `4 / 3`, `'16:9'`. Default 1. */
  @Input() aspectRatio: number | string | null | undefined = 1;
  /** Keep `aspectRatio` while resizing. Default true. */
  @Input() set maintainAspectRatio(v: unknown) { this._keepRatio = v === undefined || v === null || ɵtoBool(v); }
  get maintainAspectRatio(): boolean { return this._keepRatio; }
  /** Pad the picture to `aspectRatio` (filled with `backgroundColor`) so the whole photo fits in the box. */
  @Input() set containWithinAspectRatio(v: unknown) { this._contain = ɵtoBool(v); }
  get containWithinAspectRatio(): boolean { return this._contain; }
  /** Limits in image pixels (0 = none). */
  @Input() cropperMinWidth: number | string | null | undefined = 0;
  @Input() cropperMinHeight: number | string | null | undefined = 0;
  @Input() cropperMaxWidth: number | string | null | undefined = 0;
  @Input() cropperMaxHeight: number | string | null | undefined = 0;
  /** A fixed box size in image pixels (both needed): the box moves but does not resize. */
  @Input() cropperStaticWidth: number | string | null | undefined = 0;
  @Input() cropperStaticHeight: number | string | null | undefined = 0;
  /** A round mask over the box (the result is still a rectangle, for an avatar shown in a circle). */
  @Input() set roundCropper(v: unknown) { this._round = ɵtoBool(v); }
  get roundCropper(): boolean { return this._round; }
  /** Hide the squares on the box (it can still be resized from its corners and edges). */
  @Input() set hideResizeSquares(v: unknown) { this._hideSquares = ɵtoBool(v); }
  get hideResizeSquares(): boolean { return this._hideSquares; }
  /** Two-way: `[(cropper)]`, the box `{ x1, y1, x2, y2 }` in image pixels (after turning). */
  @Input() cropper: CropperPosition | null | undefined;

  // ---------- turning and zoom ----------

  /** Quarter turns clockwise (negative = anticlockwise), applied before `transform`. */
  @Input() canvasRotation: number | string | null | undefined = 0;
  /** Two-way: `[(transform)]`, `{ scale, rotate, flipH, flipV }`. The toolbar changes it too. */
  @Input() transform: WuImageTransform | null | undefined;
  /** Degrees clockwise; overrides `transform.rotate` when given. */
  @Input() rotation: number | string | null | undefined;
  /** 1 = the whole picture; overrides `transform.scale` when given. */
  @Input() zoom: number | string | null | undefined;
  /** Largest zoom. Default 10. */
  @Input() maxZoom: number | string | null | undefined = this.defaults.maxZoom ?? 10;
  /** Accepted for templates moving over: while zoomed in, dragging outside the box always pans. */
  @Input() allowMoveImage: unknown;

  // ---------- look ----------

  /** Where a picture narrower than the component sits: `'center'` (default) or `'left'`. */
  @Input() alignImage: 'center' | 'left' = 'center';
  /** The zoom / turn / mirror / reset toolbar under the picture. Default true. */
  @Input() set showToolbar(v: unknown) { this._toolbar = v === undefined || v === null || ɵtoBool(v); }
  get showToolbar(): boolean { return this._toolbar; }
  /**
   * Which built-in buttons the toolbar has: `'full'` (default), `'none'`, or a list such as
   * `['zoom', '|', 'rotateLeft', 'rotateRight']` (`'|'` starts a group). A `tools` template adds the app's own buttons.
   */
  @Input() set toolbar(v: WuImageCropperToolbar | readonly string[] | string | null | undefined) {
    this._tools = (v as WuImageCropperToolbar) ?? null;
    this.toolGroups = groupTools(v ?? this.defaults.toolbar);
  }
  get toolbar(): WuImageCropperToolbar | null {
    return this._tools;
  }
  @Input() set disabled(v: unknown) { this._disabled = ɵtoBool(v); }
  get disabled(): boolean { return this._disabled; }
  /** Label of the whole component. */
  @Input() ariaLabel?: string | null;
  /** Describes the picture to screen readers. */
  @Input() imageAltText?: string | null;
  /** Label of the crop box (default: the locale's `cropArea`). */
  @Input() cropperFrameAriaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** Accepted for templates moving over. */
  @Input() initialStepSize: unknown;
  @Input() checkImageType: unknown;
  @Input() options: unknown;

  @Output() readonly imageCropped = new EventEmitter<WuImageCroppedEvent>();
  /** Fires as a crop starts (the result follows in `imageCropped`). */
  @Output() readonly startCropImage = new EventEmitter<void>();
  @Output() readonly imageLoaded = new EventEmitter<WuLoadedImage>();
  /** The picture is shown; carries its size on screen in CSS pixels. */
  @Output() readonly cropperReady = new EventEmitter<CropDimensions>();
  @Output() readonly loadImageFailed = new EventEmitter<void>();
  /** The box moved or resized (image pixels, rounded). */
  @Output() readonly cropperChange = new EventEmitter<CropperPosition>();
  /** Zoom, turn or mirror changed from the toolbar, keys, wheel or pinch. */
  @Output() readonly transformChange = new EventEmitter<WuImageTransform>();

  @ContentChildren(WuTemplate) protected templates?: QueryList<WuTemplate>;
  @ContentChild('tools', { descendants: false }) protected toolsRef?: unknown;
  @ViewChild('viewport') protected viewportRef?: ElementRef<HTMLElement>;
  @ViewChild('frame') protected frameRef?: ElementRef<HTMLElement>;
  @ViewChild('stage') protected stageRef?: ElementRef<HTMLElement>;
  @ViewChild('canvas') protected canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('box') protected boxRef?: ElementRef<HTMLElement>;

  // ---------- what the template reads ----------

  /** The built-in toolbar buttons, in groups. */
  toolGroups: WuImageCropperToolGroup[] = groupTools(this.defaults.toolbar);
  /** What the `tools` template gets: the cropper as `let-cropper` (and as `cropper`). */
  readonly toolsContext: { $implicit: WuImageCropper; cropper: WuImageCropper } = { $implicit: this, cropper: this };
  /** A picture is loaded. */
  ready = false;
  loading = false;
  failed = false;
  /** The picture is loaded and laid out (the box can be drawn). */
  shown = false;
  dragging = false;
  panning = false;
  stageW = 0;
  stageH = 0;
  stageX = 0;
  stageY = 0;
  boxX = 0;
  boxY = 0;
  boxW = 0;
  boxH = 0;
  /** Crop size in image pixels, for the box's label. */
  cropW = 0;
  cropH = 0;
  /** Zoom slider position, 0–100 on a log scale. */
  zoomSlider = 0;
  zoomPercent = 100;
  canZoomIn = false;
  canZoomOut = false;
  readonly squares: CropHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  readonly edges: CropHandle[] = ['n', 'e', 's', 'w'];
  readonly hintId = ɵuniqueId('wu-imagecropper-hint');

  private _onlyScaleDown = false;
  private _autoCrop = true;
  private _keepRatio = true;
  private _contain = false;
  private _round = false;
  private _hideSquares = false;
  private _toolbar = true;
  private _disabled = false;
  private _tools: WuImageCropperToolbar | null = null;

  private source: Source | null = null;
  private rect: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };
  private view: CropView = { zoom: 1, cx: 0, cy: 0 };
  /** Turn and mirrors from `transform` / `rotation` and the toolbar (`canvasRotation` comes on top). */
  private turn: CropOrientation = UPRIGHT;
  /** The full orientation the current bounds were built for. */
  private applied: CropOrientation = UPRIGHT;
  private bounds: CropDimensions = { width: 0, height: 0 };
  private matrix: CropMatrix = [1, 0, 0, 1, 0, 0];
  /** CSS pixels per image pixel at zoom 1. */
  private fit = 0;
  /** The picture's shape when it loaded. The viewport keeps it, so turning the picture does not change the height. */
  private shape: CropDimensions = { width: 0, height: 0 };
  private viewportRatio = '';
  private pendingCropper: CropperPosition | null = null;
  private announced = false;
  private loadSeq = 0;
  private cropSeq = 0;
  private lastObjectUrl: string | null = null;
  private cropTimer: ReturnType<typeof setTimeout> | null = null;
  private soonTimer: ReturnType<typeof setTimeout> | null = null;
  private soonTransform = false;
  private frameId = 0;
  private needLayout = false;
  private needDraw = false;
  private gesture: Gesture | null = null;
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private stopListen: (() => void) | null = null;
  private stopWheel: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private stopResize: (() => void) | null = null;
  private destroyed = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly zone = inject(NgZone);
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(WuConfig);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly i18n = ɵrefreshOnTranslation();

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    inject(ɵWuStyleLoader).load('button', ɵWU_BUTTON_CSS);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageChangedEvent'] || changes['imageFile'] || changes['imageURL'] || changes['imageBase64']) this.sourceChanged(changes);
    if (changes['cropper']) {
      const given = normalizeCrop(this.cropper);
      if (!this.source) this.pendingCropper = given;
      else if (given && !sameCrop(given, roundCrop(this.rect))) this.placeCrop(given);
    }
    if (!this.source) {
      this.cdr.markForCheck();
      return;
    }
    let layout = false;
    let draw = false;
    let recrop = false;
    if (changes['canvasRotation'] || changes['transform'] || changes['rotation'] || changes['containWithinAspectRatio'] ||
      (this._contain && (changes['aspectRatio'] || changes['maintainAspectRatio'] || changes['cropperStaticWidth'] || changes['cropperStaticHeight']))) {
      // canvasRotation alone keeps turns made with the toolbar; transform / rotation say what the turn is.
      this.reorient(changes['transform'] || changes['rotation'] ? this.inputTurn() : this.turn, false);
    }
    if (changes['aspectRatio'] || changes['maintainAspectRatio'] || changes['cropperMinWidth'] || changes['cropperMinHeight'] ||
      changes['cropperMaxWidth'] || changes['cropperMaxHeight'] || changes['cropperStaticWidth'] || changes['cropperStaticHeight']) {
      this.rect = clampCrop(this.rect, this.windowRect(), this.limits());
      recrop = true;
    }
    if (changes['zoom'] || changes['transform'] || changes['maxZoom']) {
      const z = this.inputZoom();
      if (this.applyZoom(z === null ? this.view.zoom : z)) draw = recrop = true;
    }
    if (changes['alignImage']) layout = draw = true;
    if (changes['format'] || changes['imageQuality'] || changes['output'] || changes['resizeToWidth'] || changes['resizeToHeight'] ||
      changes['onlyScaleDown'] || changes['backgroundColor'] || changes['autoCrop']) recrop = true;
    if (changes['backgroundColor']) draw = true;
    this.sync();
    this.render(layout, draw);
    if (recrop) this.scheduleCrop();
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    if (!this.browser) return;
    const stage = this.stageRef?.nativeElement;
    const viewport = this.viewportRef?.nativeElement;
    this.zone.runOutsideAngular(() => {
      if (stage) {
        const wheel = (e: WheelEvent) => this.wheel(e);
        stage.addEventListener('wheel', wheel, { passive: false });
        this.stopWheel = () => stage.removeEventListener('wheel', wheel);
      }
      if (viewport && typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.render(true, true));
        this.resizeObserver.observe(viewport);
      } else {
        const win = this.doc.defaultView;
        const resize = () => this.render(true, true);
        win?.addEventListener('resize', resize);
        this.stopResize = () => win?.removeEventListener('resize', resize);
      }
    });
    this.render(true, true);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.loadSeq++;
    this.i18n.unsubscribe();
    this.stopListen?.();
    this.stopWheel?.();
    this.stopResize?.();
    this.resizeObserver?.disconnect();
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.cropTimer) clearTimeout(this.cropTimer);
    if (this.soonTimer) clearTimeout(this.soonTimer);
    this.releaseSource();
  }

  // ---------- what the template reads ----------

  get t(): WuLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  /** The app's own toolbar buttons: `<ng-template #tools let-cropper>` or `wuTemplate="tools"`. */
  get toolsTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.toolsRef) || ɵfindTemplate(this.templates, 'tools');
  }
  /** A fixed-size box cannot be resized. */
  get resizable(): boolean {
    return !this._disabled && !(num(this.cropperStaticWidth) > 0 && num(this.cropperStaticHeight) > 0);
  }
  get boxLabel(): string {
    return `${this.cropperFrameAriaLabel || this.t.cropArea}, ${this.cropW} × ${this.cropH}`;
  }
  buttonClass(extra: string): string {
    return ɵbuttonClass('p-button-text p-button-secondary') + ' wu-btn-icon-only ' + extra;
  }

  // ---------- methods for the app ----------

  /**
   * Crops now and resolves with the result (also emitted as `imageCropped`); null while no picture is loaded.
   * `output` overrides the `output` input for this call.
   */
  crop(output?: 'blob' | 'base64'): Promise<WuImageCroppedEvent | null> {
    return this.cropNow(output === 'base64' || output === 'blob' ? output : this.output, false);
  }

  /** Puts the box back to its starting size and place, zoom back to 1. */
  resetCrop(): void {
    if (!this.source) return;
    const zoomed = this.view.zoom !== 1;
    this.startCrop();
    this.commit({ transform: zoomed, draw: zoomed });
  }

  /** Undoes zoom, turns and mirrors and puts the box back (the toolbar's reset). */
  reset(): void {
    if (!this.source) return;
    this.turn = UPRIGHT;
    this.updateBounds();
    this.startCrop();
    this.commit({ transform: true, layout: true, draw: true });
  }

  rotateLeft(): void {
    this.reorient(rotateOrientation(this.turn, -1), true);
  }

  rotateRight(): void {
    this.reorient(rotateOrientation(this.turn, 1), true);
  }

  flipHorizontal(): void {
    this.reorient({ ...this.turn, flipH: !this.turn.flipH }, true);
  }

  flipVertical(): void {
    this.reorient({ ...this.turn, flipV: !this.turn.flipV }, true);
  }

  zoomIn(): void {
    if (this.applyZoom(this.view.zoom * ZOOM_STEP)) this.commit({ transform: true, draw: true });
  }

  zoomOut(): void {
    if (this.applyZoom(this.view.zoom / ZOOM_STEP)) this.commit({ transform: true, draw: true });
  }

  // ---------- toolbar ----------

  zoomSliderInput(event: Event): void {
    const v = num((event.target as HTMLInputElement).value);
    const max = this.maxZoomValue();
    if (this.applyZoom(Math.pow(max, clamp(v, 0, 100) / 100))) this.commit({ transform: true, draw: true, soon: true });
  }

  // ---------- pointer ----------

  pointerDown(event: PointerEvent): void {
    if (this._disabled || !this.shown || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    // A new first pointer starts afresh, in case an earlier pointerup never arrived.
    if (event.isPrimary) this.pointers.clear();
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.listen();
    if (this.pointers.size === 2) {
      this.startPinch();
      return;
    }
    if (this.pointers.size > 2) return;
    const target = event.target as Element | null;
    const handle = target?.closest('[data-handle]')?.getAttribute('data-handle') as CropHandle | null | undefined;
    const inBox = !!target?.closest('.wu-imagecropper-box');
    this.boxRef?.nativeElement.focus({ preventScroll: true });
    let mode: Gesture['mode'] = 'none';
    if (handle && this.resizable) mode = 'resize';
    else if (inBox) mode = 'move';
    else if (this.view.zoom > 1) mode = 'pan';
    this.gesture = { mode, handle: handle || null, x: event.clientX, y: event.clientY, crop: { ...this.rect }, view: { ...this.view }, distance: 0 };
    this.panning = mode === 'pan';
  }

  private startPinch(): void {
    const distance = this.pinchDistance();
    this.gesture = { mode: distance > 0 ? 'pinch' : 'none', handle: null, x: 0, y: 0, crop: { ...this.rect }, view: { ...this.view }, distance };
    this.panning = false;
  }

  private pinchDistance(): number {
    const p = Array.from(this.pointers.values());
    return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }

  private listen(): void {
    if (this.stopListen) return;
    const move = (e: PointerEvent) => this.pointerMove(e);
    const up = (e: PointerEvent) => this.pointerUp(e);
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('pointermove', move);
      this.doc.addEventListener('pointerup', up);
      this.doc.addEventListener('pointercancel', up);
    });
    this.stopListen = () => {
      this.doc.removeEventListener('pointermove', move);
      this.doc.removeEventListener('pointerup', up);
      this.doc.removeEventListener('pointercancel', up);
      this.stopListen = null;
    };
  }

  /** Runs outside Angular: state changes here are drawn on the next frame. */
  private pointerMove(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = this.gesture;
    if (!g || g.mode === 'none' || !this.source) return;
    e.preventDefault();
    if (g.mode === 'pinch') {
      const d = this.pinchDistance();
      if (!d || !g.distance) return;
      const r = zoomCrop(this.bounds, g.view, g.crop, g.view.zoom * (d / g.distance), this.limits(), this.maxZoomValue());
      this.view = r.view;
      this.rect = r.crop;
      this.render(false, true);
      return;
    }
    const s = this.scale || 1;
    const dx = (e.clientX - g.x) / s;
    const dy = (e.clientY - g.y) / s;
    if (g.mode === 'move') {
      this.rect = moveCrop(g.crop, dx, dy, this.windowRect());
    } else if (g.mode === 'resize' && g.handle) {
      this.rect = resizeCrop(g.crop, g.handle, dx, dy, this.windowRect(), this.limits());
    } else if (g.mode === 'pan') {
      const r = panCrop(this.bounds, g.view, g.crop, -dx, -dy);
      this.view = r.view;
      this.rect = r.crop;
    }
    this.dragging = true;
    this.render(false, g.mode === 'pan');
  }

  private pointerUp(e: PointerEvent): void {
    if (!this.pointers.delete(e.pointerId)) return;
    if (this.pointers.size > 0) {
      // One finger of a pinch lifted: wait for the other rather than jumping into a drag.
      if (this.gesture) this.gesture = { ...this.gesture, mode: 'none' };
      return;
    }
    const g = this.gesture;
    this.gesture = null;
    this.stopListen?.();
    const viewChanged = !!g && (g.view.zoom !== this.view.zoom || g.view.cx !== this.view.cx || g.view.cy !== this.view.cy);
    const moved = !!g && (!sameCrop(g.crop, this.rect, 1e-6) || viewChanged);
    this.zone.run(() => {
      this.dragging = false;
      this.panning = false;
      if (moved) this.commit({ transform: !!g && g.view.zoom !== this.view.zoom, draw: viewChanged });
      else {
        this.render(false, false);
        this.cdr.markForCheck();
      }
    });
  }

  /** Ctrl + wheel (and a trackpad pinch, which arrives as one) zooms; a plain wheel scrolls the page. */
  private wheel(e: WheelEvent): void {
    if (!e.ctrlKey || this._disabled || !this.shown) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
    const factor = Math.exp(-clamp(dy, -100, 100) * 0.002);
    this.zone.run(() => {
      if (this.applyZoom(this.view.zoom * factor)) this.commit({ transform: true, draw: true, soon: true });
    });
  }

  // ---------- keyboard ----------

  boxKey(event: KeyboardEvent): void {
    if (this._disabled || !this.source) return;
    const s = this.scale || 1;
    const step = Math.max(1, Math.round((event.shiftKey ? 10 : 1) / s));
    const area = this.windowRect();
    const limits = this.limits();
    let next: CropperPosition | null = null;
    const key = event.key;
    if (key === '+' || key === '=' || key === '-' || key === '_') {
      if (!this.resizable) return;
      const amount = 2 * Math.max(1, Math.round(10 / s));
      next = growCrop(this.rect, key === '+' || key === '=' ? amount : -amount, area, limits);
    } else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0;
      const dy = key === 'ArrowUp' ? -step : key === 'ArrowDown' ? step : 0;
      if (event.altKey) {
        if (!this.resizable) return;
        next = dx ? resizeCrop(this.rect, 'e', dx, 0, area, limits) : resizeCrop(this.rect, 's', 0, dy, area, limits);
      } else {
        next = moveCrop(this.rect, dx, dy, area);
      }
    } else {
      return;
    }
    event.preventDefault();
    if (sameCrop(next, this.rect, 1e-6)) return;
    this.rect = next;
    this.commit({});
  }

  // ---------- loading ----------

  private sourceChanged(changes: SimpleChanges): void {
    if (changes['imageChangedEvent'] && this.imageChangedEvent) {
      const file = fileFrom(this.imageChangedEvent);
      if (file) void this.load(file, 'blob');
      return;
    }
    if (changes['imageFile'] && this.imageFile) void this.load(this.imageFile, 'blob');
    else if (changes['imageURL'] && this.imageURL) void this.load(this.imageURL, 'url');
    else if (changes['imageBase64'] && this.imageBase64) void this.load(this.imageBase64, 'base64');
    else if (!this.imageChangedEvent && !this.imageFile && !this.imageURL && !this.imageBase64) this.clear();
  }

  private async load(input: Blob | string, kind: 'blob' | 'url' | 'base64'): Promise<void> {
    if (!this.browser) return;
    const seq = ++this.loadSeq;
    // The previous picture stays until the new one is decoded, so the layout does not jump.
    this.loading = true;
    this.failed = false;
    this.cdr.markForCheck();
    let src: Source | null = null;
    try {
      src = await loadSource(input, kind, this.doc);
    } catch {
      src = null;
    }
    if (seq !== this.loadSeq || this.destroyed) {
      src?.close();
      return;
    }
    this.releaseSource();
    this.loading = false;
    if (!src) {
      this.ready = false;
      this.failed = true;
      this.sync();
      this.render(true, true);
      this.cdr.markForCheck();
      this.loadImageFailed.emit();
      return;
    }
    this.source = src;
    this.turn = this.inputTurn();
    this.updateBounds();
    this.shape = { ...this.bounds };
    this.startCrop();
    const given = this.pendingCropper;
    this.pendingCropper = null;
    if (given) this.rect = clampCrop(given, this.windowRect(), this.limits());
    const z = this.inputZoom();
    if (z !== null && z !== 1) this.applyZoom(z);
    this.ready = true;
    this.announced = false;
    this.sync();
    this.render(true, true);
    this.cdr.markForCheck();
    this.imageLoaded.emit({
      original: { size: { width: src.rawWidth, height: src.rawHeight } },
      transformed: { size: { width: src.width, height: src.height } },
      exifTransform: { ...src.exif },
    });
  }

  private clear(): void {
    this.loadSeq++;
    this.releaseSource();
    this.ready = this.loading = this.failed = false;
    this.sync();
    this.render(true, true);
    this.cdr.markForCheck();
  }

  private releaseSource(): void {
    this.source?.close();
    this.source = null;
  }

  // ---------- geometry ----------

  /** CSS pixels per image pixel now. */
  private get scale(): number {
    return this.fit * this.view.zoom;
  }

  private windowRect(): CropperPosition {
    return viewWindow(this.bounds, this.view);
  }

  private maxZoomValue(): number {
    return Math.max(1, num(this.maxZoom, 10) || 10);
  }

  private ratio(): number | null {
    const sw = num(this.cropperStaticWidth);
    const sh = num(this.cropperStaticHeight);
    if (sw > 0 && sh > 0) return sw / sh;
    return this._keepRatio ? parseAspectRatio(this.aspectRatio) : null;
  }

  private limits(): CropLimits {
    const sw = num(this.cropperStaticWidth);
    const sh = num(this.cropperStaticHeight);
    if (sw > 0 && sh > 0) return { minWidth: sw, maxWidth: sw, minHeight: sh, maxHeight: sh, ratio: sw / sh };
    const s = this.scale;
    const minPx = s > 0 ? MIN_BOX_PX / s : 0;
    return {
      minWidth: Math.max(num(this.cropperMinWidth), minPx),
      minHeight: Math.max(num(this.cropperMinHeight), minPx),
      maxWidth: num(this.cropperMaxWidth),
      maxHeight: num(this.cropperMaxHeight),
      ratio: this.ratio(),
    };
  }

  /** Turn and mirrors the inputs ask for. */
  private inputTurn(): CropOrientation {
    const t = this.transform || {};
    const r = this.rotation !== null && this.rotation !== undefined && this.rotation !== '' ? num(this.rotation) : num(t.rotate);
    return { rotate: normalizeAngle(r), flipH: !!t.flipH, flipV: !!t.flipV };
  }

  /** Zoom the inputs ask for, or null for none. */
  private inputZoom(): number | null {
    if (this.zoom !== null && this.zoom !== undefined && this.zoom !== '') return num(this.zoom, 1);
    const s = this.transform ? Number(this.transform.scale) : NaN;
    return isFinite(s) && s > 0 ? s : null;
  }

  /** `turn` with `canvasRotation` on top. */
  private total(): CropOrientation {
    return { ...this.turn, rotate: normalizeAngle(this.turn.rotate + Math.round(num(this.canvasRotation)) * 90) };
  }

  /** The oriented picture's size for `o`, padded to the aspect ratio with `containWithinAspectRatio`. */
  private boundsFor(o: CropOrientation): CropDimensions {
    const src = this.source;
    if (!src) return { width: 0, height: 0 };
    const turned = rotatedSize(src.width, src.height, o.rotate);
    const ratio = this.ratio();
    return this._contain && ratio ? padToRatio(turned, ratio) : turned;
  }

  private updateBounds(): void {
    const src = this.source;
    if (!src) return;
    const o = this.total();
    this.bounds = this.boundsFor(o);
    this.matrix = orientationMatrix(src.width, src.height, o, this.bounds);
    this.applied = o;
  }

  private startCrop(): void {
    this.view = clampView(this.bounds, { zoom: 1, cx: this.bounds.width / 2, cy: this.bounds.height / 2 });
    this.rect = initialCrop(cropArea(this.bounds), this.limits());
  }

  /** A box from the app: shown at zoom 1 if it lies outside what is in view. */
  private placeCrop(given: CropperPosition): void {
    const win = this.windowRect();
    if (given.x1 < win.x1 || given.y1 < win.y1 || given.x2 > win.x2 || given.y2 > win.y2) {
      this.view = clampView(this.bounds, { zoom: 1, cx: 0, cy: 0 });
      this.render(false, true);
    }
    this.rect = clampCrop(given, this.windowRect(), this.limits());
    this.sync();
    this.render(false, false);
    this.scheduleCrop();
  }

  /**
   * Turns / mirrors to `next`, carrying the box along. A fresh box when the angle is not a quarter turn or the padding
   * of `containWithinAspectRatio` changes shape.
   */
  private reorient(next: CropOrientation, user: boolean): void {
    const fromSize = this.bounds;
    const from = this.applied;
    this.turn = { rotate: normalizeAngle(next.rotate), flipH: !!next.flipH, flipV: !!next.flipV };
    if (!this.source) return;
    const to = this.total();
    if (sameTurn(from, to) && sameSize(this.boundsFor(to), fromSize)) return;
    this.updateBounds();
    const crop = remapCrop(this.rect, fromSize, from, this.bounds, to, !!this.ratio());
    const centre = remapPoint(this.view.cx, this.view.cy, fromSize, from, this.bounds, to);
    if (crop && centre && sameSize(rotatedSize(fromSize.width, fromSize.height, to.rotate - from.rotate), this.bounds)) {
      this.view = clampView(this.bounds, { zoom: this.view.zoom, cx: centre.x, cy: centre.y }, this.maxZoomValue());
      this.rect = clampCrop(crop, this.windowRect(), this.limits());
    } else {
      this.startCrop();
    }
    if (user) {
      this.commit({ transform: true, layout: true, draw: true });
    } else {
      this.sync();
      this.render(true, true);
      this.scheduleCrop();
    }
  }

  private applyZoom(zoom: number): boolean {
    if (!this.source || !isFinite(zoom)) return false;
    const r = zoomCrop(this.bounds, this.view, this.rect, zoom, this.limits(), this.maxZoomValue());
    const same = r.view.zoom === this.view.zoom && r.view.cx === this.view.cx && r.view.cy === this.view.cy && sameCrop(r.crop, this.rect, 1e-6);
    this.view = r.view;
    this.rect = r.crop;
    return !same;
  }

  // ---------- drawing ----------

  /** Works out what the template shows from the state (no DOM reads). */
  private sync(): void {
    this.shown = this.ready && this.fit > 0;
    const win = this.windowRect();
    const s = this.scale;
    this.boxX = (this.rect.x1 - win.x1) * s;
    this.boxY = (this.rect.y1 - win.y1) * s;
    this.boxW = cropWidth(this.rect) * s;
    this.boxH = cropHeight(this.rect) * s;
    this.cropW = Math.round(cropWidth(this.rect));
    this.cropH = Math.round(cropHeight(this.rect));
    const max = this.maxZoomValue();
    this.zoomSlider = max > 1 ? Math.round((Math.log(this.view.zoom) / Math.log(max)) * 100) : 0;
    this.zoomPercent = Math.round(this.view.zoom * 100);
    this.canZoomOut = this.view.zoom > 1.0001;
    this.canZoomIn = this.view.zoom < max - 0.0001;
  }

  /** Lays out, refreshes the template and redraws on the next frame (outside Angular, once per frame). */
  private render(layout: boolean, draw: boolean): void {
    if (!this.browser || this.destroyed) return;
    this.needLayout = this.needLayout || layout;
    this.needDraw = this.needDraw || draw;
    if (this.frameId) return;
    this.zone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(() => {
        this.frameId = 0;
        if (this.destroyed) return;
        const layoutNow = this.needLayout;
        const drawNow = this.needDraw;
        this.needLayout = this.needDraw = false;
        if (layoutNow) this.layout();
        this.sync();
        this.cdr.detectChanges();
        if (layoutNow || drawNow) this.draw();
        this.announce();
      });
    });
  }

  /**
   * Measures the room for the picture and fits the stage into it. The room has the shape of the picture as loaded;
   * a turned picture fits inside it, so the page below does not jump.
   */
  private layout(): void {
    const viewport = this.viewportRef?.nativeElement;
    const frame = this.frameRef?.nativeElement;
    if (!viewport || !frame) return;
    const ratio = this.ready && this.shape.width > 0 && this.shape.height > 0 ? `${this.shape.width} / ${this.shape.height}` : '';
    if (ratio !== this.viewportRatio) {
      this.viewportRatio = ratio;
      viewport.style.aspectRatio = ratio;
    }
    const aw = frame.clientWidth;
    const ah = frame.clientHeight;
    if (!this.ready || !aw || !ah || !this.bounds.width || !this.bounds.height) {
      this.fit = 0;
      return;
    }
    const fit = Math.min(aw / this.bounds.width, ah / this.bounds.height);
    this.fit = fit;
    this.stageW = this.bounds.width * fit;
    this.stageH = this.bounds.height * fit;
    this.stageX = this.alignImage === 'left' ? 0 : (aw - this.stageW) / 2;
    this.stageY = (ah - this.stageH) / 2;
  }

  private draw(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const src = this.source;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!src || !this.shown) {
      canvas.width = canvas.height = 1;
      ctx.clearRect(0, 0, 1, 1);
      return;
    }
    const dpr = Math.min(Math.max(this.doc.defaultView?.devicePixelRatio || 1, 1), 3);
    const cw = Math.max(1, Math.round(this.stageW * dpr));
    const ch = Math.max(1, Math.round(this.stageH * dpr));
    if (canvas.width !== cw) canvas.width = cw;
    if (canvas.height !== ch) canvas.height = ch;
    const win = this.windowRect();
    const sx = cw / cropWidth(win);
    const sy = ch / cropHeight(win);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.setTransform(sx, 0, 0, sy, -win.x1 * sx, -win.y1 * sy);
    if (this.backgroundColor) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, this.bounds.width, this.bounds.height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const m = this.matrix;
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    ctx.drawImage(src.image, 0, 0);
  }

  /** The first time a picture is shown: `cropperReady`, the starting box for `[(cropper)]`, the first crop. */
  private announce(): void {
    if (this.announced || !this.shown) return;
    this.announced = true;
    this.zone.run(() => {
      this.cropperReady.emit({ width: Math.round(this.stageW), height: Math.round(this.stageH) });
      this.cropperChange.emit(roundCrop(this.rect));
      this.scheduleCrop(0);
    });
  }

  // ---------- telling the app ----------

  /** After a change by the user: redraw, tell the app, crop again. */
  private commit(o: { transform?: boolean; layout?: boolean; draw?: boolean; soon?: boolean }): void {
    this.sync();
    this.cdr.markForCheck();
    this.render(!!o.layout, !!o.draw);
    if (o.soon) this.emitSoon(!!o.transform);
    else this.emitChanges(!!o.transform);
    this.scheduleCrop();
  }

  private emitChanges(transform: boolean): void {
    this.cropperChange.emit(roundCrop(this.rect));
    if (transform) this.transformChange.emit(this.currentTransform());
  }

  /** For changes that stream (slider, wheel): tell the app once they settle. */
  private emitSoon(transform: boolean): void {
    this.soonTransform = this.soonTransform || transform;
    if (this.soonTimer) clearTimeout(this.soonTimer);
    this.zone.runOutsideAngular(() => {
      this.soonTimer = setTimeout(() => {
        this.soonTimer = null;
        const t = this.soonTransform;
        this.soonTransform = false;
        this.zone.run(() => this.emitChanges(t));
      }, 150);
    });
  }

  private currentTransform(): WuImageTransform {
    return { ...(this.transform || {}), scale: this.view.zoom, rotate: this.turn.rotate, flipH: this.turn.flipH, flipV: this.turn.flipV };
  }

  private scheduleCrop(delay = CROP_DELAY): void {
    if (!this._autoCrop || !this.ready || !this.browser || this.destroyed) return;
    if (this.cropTimer) clearTimeout(this.cropTimer);
    this.zone.runOutsideAngular(() => {
      this.cropTimer = setTimeout(() => {
        this.cropTimer = null;
        this.zone.run(() => void this.cropNow(this.output, true));
      }, delay);
    });
  }

  // ---------- cropping ----------

  private async cropNow(output: 'blob' | 'base64', auto: boolean): Promise<WuImageCroppedEvent | null> {
    const src = this.source;
    if (!src || !this.ready || this.destroyed) return null;
    const seq = ++this.cropSeq;
    this.startCropImage.emit();
    let event: WuImageCroppedEvent | null = null;
    try {
      event = await this.produce(src, { ...this.rect }, output);
    } catch (e) {
      console.warn('[wiraui] imagecropper: the picture could not be cropped (a cross-origin image without CORS?).', e);
    }
    if (!event) return null;
    if (seq !== this.cropSeq || this.destroyed || src !== this.source) {
      // A newer crop is on its way: this one is out of date.
      if (auto) {
        if (event.objectUrl) URL.revokeObjectURL(event.objectUrl);
        return null;
      }
      return event;
    }
    if (event.objectUrl) {
      if (this.lastObjectUrl) URL.revokeObjectURL(this.lastObjectUrl);
      this.lastObjectUrl = event.objectUrl;
    }
    this.imageCropped.emit(event);
    return event;
  }

  private async produce(src: Source, rect: CropperPosition, output: 'blob' | 'base64'): Promise<WuImageCroppedEvent | null> {
    const size = outputSize(cropWidth(rect), cropHeight(rect), {
      resizeToWidth: num(this.resizeToWidth),
      resizeToHeight: num(this.resizeToHeight),
      onlyScaleDown: this._onlyScaleDown,
      ratio: this.ratio(),
    });
    const canvas = this.paintCrop(src, rect, size);
    if (!canvas) return null;
    const type = 'image/' + this.formatName();
    const quality = clamp(num(this.imageQuality, 92), 0, 100) / 100;
    const base = { width: size.width, height: size.height, cropperPosition: this.screenPosition(rect), imagePosition: roundCrop(rect) };
    if (output === 'base64') return { ...base, base64: canvas.toDataURL(type, quality) };
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    if (!blob) return null;
    return { ...base, blob, objectUrl: URL.createObjectURL(blob) };
  }

  /**
   * Draws the crop at the output size. A big reduction in one step looks jagged in some browsers, so the crop is
   * drawn at up to 2ⁿ times the size and halved n times.
   */
  private paintCrop(src: Source, rect: CropperPosition, size: CropDimensions): HTMLCanvasElement | null {
    const cw = cropWidth(rect);
    const ch = cropHeight(rect);
    let n = 0;
    while (n < 4 && size.width * 2 ** (n + 1) <= cw && size.height * 2 ** (n + 1) <= ch && size.width * size.height * 4 ** (n + 1) <= MAX_CANVAS_AREA) n++;
    const w = size.width * 2 ** n;
    const h = size.height * 2 ** n;
    const first = this.newCanvas(w, h, n === 0);
    const ctx = first?.getContext('2d');
    if (!first || !ctx) return null;
    let canvas: HTMLCanvasElement = first;
    const sx = w / cw;
    const sy = h / ch;
    ctx.setTransform(sx, 0, 0, sy, -rect.x1 * sx, -rect.y1 * sy);
    const m = this.matrix;
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    ctx.drawImage(src.image, 0, 0);
    for (let i = n - 1; i >= 0; i--) {
      const next = this.newCanvas(size.width * 2 ** i, size.height * 2 ** i, i === 0);
      const nctx = next?.getContext('2d');
      if (!next || !nctx) return null;
      nctx.drawImage(canvas, 0, 0, next.width, next.height);
      canvas = next;
    }
    return canvas;
  }

  /** A canvas; `final` fills it with the background colour first (white for JPEG, which has no transparency). */
  private newCanvas(width: number, height: number, final: boolean): HTMLCanvasElement | null {
    const canvas = this.doc.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const format = this.formatName();
    const fill = this.backgroundColor || (format === 'jpeg' || format === 'bmp' ? '#ffffff' : '');
    if (final && fill) {
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    return canvas;
  }

  /** `format` in lower case, `jpg` read as `jpeg`. */
  private formatName(): string {
    const f = String(this.format || 'png').toLowerCase();
    return f === 'jpg' ? 'jpeg' : f;
  }

  /** Where the box is over the shown picture, in CSS pixels. */
  private screenPosition(rect: CropperPosition): CropperPosition {
    const win = this.windowRect();
    const s = this.scale;
    return roundCrop({ x1: (rect.x1 - win.x1) * s, y1: (rect.y1 - win.y1) * s, x2: (rect.x2 - win.x1) * s, y2: (rect.y2 - win.y1) * s });
  }
}

// ---------- reading pictures (browser only) ----------

const sameSize = (a: CropDimensions, b: CropDimensions) => Math.abs(a.width - b.width) < 1e-6 && Math.abs(a.height - b.height) < 1e-6;

/** The first file of a file input's change event (or a drop event). */
function fileFrom(event: unknown): Blob | null {
  if (!event || typeof event !== 'object') return null;
  const e = event as { target?: unknown; currentTarget?: unknown; dataTransfer?: { files?: FileList | null } | null };
  for (const el of [e.target, e.currentTarget]) {
    const files = el && typeof el === 'object' ? (el as { files?: FileList | null }).files : null;
    if (files && files.length) return files[0];
  }
  const dropped = e.dataTransfer?.files;
  return dropped && dropped.length ? dropped[0] : null;
}

async function loadSource(input: Blob | string, kind: 'blob' | 'url' | 'base64', doc: Document): Promise<Source | null> {
  let blob: Blob | null = null;
  if (typeof input !== 'string') blob = input;
  else if (kind === 'base64' || /^data:/i.test(input)) blob = base64ToFile(input.trim());
  else {
    try {
      const res = await fetch(input);
      if (res.ok) blob = await res.blob();
    } catch {
      blob = null;
    }
    // fetch can be refused (CORS, a Content-Security-Policy): let an <img> try.
    if (!blob) return fromImage(await loadImage(input, doc, true), null, 1);
  }
  return decode(blob, doc);
}

async function decode(blob: Blob, doc: Document): Promise<Source | null> {
  const orientation = await orientationOf(blob);
  if (typeof createImageBitmap === 'function') {
    try {
      const options = { imageOrientation: 'from-image' } as unknown as ImageBitmapOptions;
      const bitmap = await createImageBitmap(blob, options);
      return upright(bitmap, bitmap.width, bitmap.height, orientation, () => bitmap.close());
    } catch {
      // An older browser without 'from-image', or a format createImageBitmap does not take (SVG): use an <img>.
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    return fromImage(await loadImage(url, doc, false), url, orientation, doc);
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

/** A picture that is already upright. */
function upright(image: CanvasImageSource, width: number, height: number, orientation: number, close: () => void): Source {
  const exif = exifTransform(orientation);
  const swap = exif.rotate === 90 || exif.rotate === 270;
  return { image, width, height, rawWidth: swap ? height : width, rawHeight: swap ? width : height, exif, close };
}

/**
 * From a loaded <img>. Current browsers turn JPEGs upright themselves; one that does not (no CSS image-orientation)
 * gets the EXIF orientation applied on a canvas.
 */
function fromImage(img: HTMLImageElement, url: string | null, orientation: number, doc?: Document): Source {
  const release = () => {
    if (url) URL.revokeObjectURL(url);
  };
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const autoOriented = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('image-orientation', 'from-image');
  if (orientation <= 1 || autoOriented || !doc) return upright(img, w, h, autoOriented ? orientation : 1, release);
  const exif = exifTransform(orientation);
  const o: CropOrientation = { rotate: exif.rotate, flipH: exif.flip, flipV: false };
  const turned = rotatedSize(w, h, o.rotate);
  const k = Math.min(1, Math.sqrt(MAX_CANVAS_AREA / (turned.width * turned.height)));
  const canvas = doc.createElement('canvas');
  canvas.width = Math.max(1, Math.round(turned.width * k));
  canvas.height = Math.max(1, Math.round(turned.height * k));
  const ctx = canvas.getContext('2d');
  if (!ctx) return upright(img, w, h, 1, release);
  ctx.setTransform(k, 0, 0, k, 0, 0);
  const m = orientationMatrix(w, h, o, turned);
  ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
  ctx.drawImage(img, 0, 0);
  release();
  return { image: canvas, width: canvas.width, height: canvas.height, rawWidth: w, rawHeight: h, exif, close: () => undefined };
}

function loadImage(url: string, doc: Document, cors: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = doc.createElement('img');
    if (cors) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => (img.naturalWidth && img.naturalHeight ? resolve(img) : reject(new Error('The image has no size.')));
    img.onerror = () => reject(new Error('The image could not be loaded.'));
    img.src = url;
  });
}

/** EXIF orientation from the first 64 KB of a JPEG (1 for anything else). */
async function orientationOf(blob: Blob): Promise<number> {
  if (blob.type && !/jpe?g/i.test(blob.type)) return 1;
  try {
    return readExifOrientation(await readBytes(blob.slice(0, 65536)));
  } catch {
    return 1;
  }
}

function readBytes(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}
