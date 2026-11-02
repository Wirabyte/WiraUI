import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵtoBool } from 'wiraui/config';
import { ɵWuFlowHost } from './flow-host';
import type { WuFlowFitViewOptions, WuFlowPanelPosition } from './flow.types';

const bool = (v: unknown, fallback: boolean) => (v === undefined || v === null ? fallback : ɵtoBool(v));

/**
 * Zoom in / out, fit view and lock buttons: `<wu-flow-controls position="bottom-left">` inside `<wu-flow>`. Each button
 * has a label in the app's language; put your own buttons inside (`<button class="wu-flow-controls-button">`).
 */
@Component({
  selector: 'wu-flow-controls',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      *ngIf="showZoom"
      type="button"
      class="wu-flow-controls-button wu-flow-controls-zoomin"
      [disabled]="atMax"
      [attr.aria-label]="text('flowZoomIn')"
      [attr.title]="text('flowZoomIn')"
      (click)="zoomIn()"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>
    </button>
    <button
      *ngIf="showZoom"
      type="button"
      class="wu-flow-controls-button wu-flow-controls-zoomout"
      [disabled]="atMin"
      [attr.aria-label]="text('flowZoomOut')"
      [attr.title]="text('flowZoomOut')"
      (click)="zoomOut()"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg>
    </button>
    <button
      *ngIf="showFitView"
      type="button"
      class="wu-flow-controls-button wu-flow-controls-fitview"
      [attr.aria-label]="text('flowFitView')"
      [attr.title]="text('flowFitView')"
      (click)="fit()"
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M2.5 6V3.5a1 1 0 0 1 1-1H6M10 2.5h2.5a1 1 0 0 1 1 1V6M13.5 10v2.5a1 1 0 0 1-1 1H10M6 13.5H3.5a1 1 0 0 1-1-1V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
    <button
      *ngIf="showInteractive"
      type="button"
      class="wu-flow-controls-button wu-flow-controls-interactive"
      [attr.aria-pressed]="!interactive"
      [attr.aria-label]="text(interactive ? 'flowLock' : 'flowUnlock')"
      [attr.title]="text(interactive ? 'flowLock' : 'flowUnlock')"
      (click)="toggleInteractive()"
    >
      <svg *ngIf="interactive" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <rect x="3" y="7" width="10" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
        <path d="M5.5 7V5a2.5 2.5 0 0 1 4.9-.7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
      <svg *ngIf="!interactive" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
        <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" stroke="currentColor" stroke-width="1.5"></rect>
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      </svg>
    </button>
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'wu-flow-panel wu-flow-controls',
    role: 'toolbar',
    '[attr.aria-label]': "ariaLabel || text('flowControls')",
    '[attr.aria-orientation]': 'orientation',
    '[class.wu-flow-controls-horizontal]': "orientation === 'horizontal'",
    '[class.wu-flow-panel-top-left]': "position === 'top-left'",
    '[class.wu-flow-panel-top-center]': "position === 'top-center'",
    '[class.wu-flow-panel-top-right]': "position === 'top-right'",
    '[class.wu-flow-panel-bottom-left]': "!position || position === 'bottom-left'",
    '[class.wu-flow-panel-bottom-center]': "position === 'bottom-center'",
    '[class.wu-flow-panel-bottom-right]': "position === 'bottom-right'",
    '[class.wu-flow-panel-center-left]': "position === 'center-left'",
    '[class.wu-flow-panel-center-right]': "position === 'center-right'",
  },
})
export class WuFlowControls implements OnInit, OnDestroy {
  @Input() position: WuFlowPanelPosition = 'bottom-left';
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() set showZoom(v: unknown) {
    this._zoom = bool(v, true);
  }
  get showZoom(): boolean {
    return this._zoom;
  }
  @Input() set showFitView(v: unknown) {
    this._fit = bool(v, true);
  }
  get showFitView(): boolean {
    return this._fit;
  }
  @Input() set showInteractive(v: unknown) {
    this._lock = bool(v, true);
  }
  get showInteractive(): boolean {
    return this._lock;
  }
  @Input() fitViewOptions: WuFlowFitViewOptions | null | undefined;
  /** Animation of the buttons in ms. Default 200 (none with reduced motion). */
  @Input() duration = 200;
  @Input() ariaLabel: string | null | undefined;

  @Output() readonly zoomInClick = new EventEmitter<void>();
  @Output() readonly zoomOutClick = new EventEmitter<void>();
  @Output() readonly fitViewClick = new EventEmitter<void>();
  @Output() readonly interactiveChange = new EventEmitter<boolean>();

  atMin = false;
  atMax = false;
  interactive = true;
  private _zoom = true;
  private _fit = true;
  private _lock = true;
  private stop: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ɵWuFlowHost, { optional: true });

  text(key: 'flowZoomIn' | 'flowZoomOut' | 'flowFitView' | 'flowLock' | 'flowUnlock' | 'flowControls'): string {
    return this.host ? this.host.ɵtext(key) : '';
  }

  ngOnInit(): void {
    this.sync();
    this.stop =
      this.host?.ɵlisten((changes) => {
        if (changes.has('viewport') || changes.has('interactive')) {
          if (this.sync()) this.cdr.detectChanges();
        }
      }) || null;
  }

  ngOnDestroy(): void {
    this.stop?.();
  }

  zoomIn(): void {
    this.host?.zoomIn({ duration: this.duration }).then(() => this.announceZoom());
    this.zoomInClick.emit();
  }

  zoomOut(): void {
    this.host?.zoomOut({ duration: this.duration }).then(() => this.announceZoom());
    this.zoomOutClick.emit();
  }

  /** Screen readers hear the new zoom level. */
  private announceZoom(): void {
    const host = this.host;
    if (host) host.ɵannounce(host.ɵtext('flowZoomLevel').replace('{zoom}', String(Math.round(host.getViewport().zoom * 100))));
  }

  fit(): void {
    void this.host?.fitView({ duration: this.duration, ...(this.fitViewOptions || {}) });
    this.fitViewClick.emit();
  }

  toggleInteractive(): void {
    const host = this.host;
    if (!host) return;
    host.setInteractive(!host.ɵisInteractive());
    this.sync();
    this.interactiveChange.emit(this.interactive);
  }

  /** True when a button's state changed. */
  private sync(): boolean {
    const host = this.host;
    if (!host) return false;
    const zoom = host.getViewport().zoom;
    const atMin = zoom <= host.ɵminZoom() + 1e-6;
    const atMax = zoom >= host.ɵmaxZoom() - 1e-6;
    const interactive = host.ɵisInteractive();
    const changed = atMin !== this.atMin || atMax !== this.atMax || interactive !== this.interactive;
    this.atMin = atMin;
    this.atMax = atMax;
    this.interactive = interactive;
    return changed;
  }
}
