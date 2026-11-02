import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ɵuniqueId } from 'wiraui/config';
import { backgroundPattern } from 'wiraui/core';
import type { FlowBackgroundPattern, FlowViewport } from 'wiraui/core';
import { ɵWuFlowHost } from './flow-host';

/**
 * The pane's background: `<wu-flow-background variant="dots" [gap]="20">` inside `<wu-flow>`. `dots` (default),
 * `lines` or `cross`, every `gap` flow units (or `[x, y]`), moving and scaling with the view. Stack two for a fine and
 * a coarse grid. `variant="image"` puts a picture (a floor plan, a map) under the diagram at `imageX`, `imageY` in flow
 * coordinates, `imageWidth` × `imageHeight` flow units, scaling with the zoom.
 */
@Component({
  selector: 'wu-flow-background',
  standalone: true,
  imports: [NgIf],
  template: `
    <svg class="wu-flow-background" [class]="styleClass || ''" [style.background-color]="bgColor || null" aria-hidden="true" focusable="false">
      <ng-container *ngIf="variant !== 'image'; else picture">
        <svg:pattern
          [attr.id]="patternId"
          patternUnits="userSpaceOnUse"
          [attr.x]="p.x"
          [attr.y]="p.y"
          [attr.width]="p.width"
          [attr.height]="p.height"
        >
          <svg:circle
            *ngIf="variant === 'dots' || !variant"
            class="wu-flow-background-dot"
            [attr.cx]="p.width / 2"
            [attr.cy]="p.height / 2"
            [attr.r]="p.radius"
            [style.fill]="color || null"
          ></svg:circle>
          <svg:path
            *ngIf="variant === 'lines' || variant === 'cross'"
            class="wu-flow-background-line"
            [attr.d]="p.path"
            [style.stroke]="color || null"
            [style.stroke-width]="lineWidth || null"
          ></svg:path>
        </svg:pattern>
        <svg:rect x="0" y="0" width="100%" height="100%" [attr.fill]="'url(#' + patternId + ')'"></svg:rect>
      </ng-container>
      <ng-template #picture>
        <svg:image
          *ngIf="src"
          [attr.href]="src"
          [attr.x]="imageBox.x"
          [attr.y]="imageBox.y"
          [attr.width]="imageBox.width"
          [attr.height]="imageBox.height"
          [attr.opacity]="imageOpacity"
          preserveAspectRatio="xMidYMid meet"
        ></svg:image>
      </ng-template>
    </svg>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuFlowBackground implements OnInit, OnChanges, OnDestroy {
  @Input() variant: 'dots' | 'lines' | 'cross' | 'image' = 'dots';
  /** Space between dots / lines in flow units, or `[x, y]`. Default 20. */
  @Input() gap: number | [number, number] = 20;
  /** Dot diameter or cross length in flow units (default 1 for dots, 6 for crosses). */
  @Input() size: number | null | undefined;
  /** Line width in px for `lines` / `cross`. */
  @Input() lineWidth: number | null | undefined;
  /** Shift of the pattern in flow units. */
  @Input() offset: number | [number, number] = 0;
  /** Colour of the dots / lines (default: the `--wu-flow-grid-dot-color` / `--wu-flow-grid-line-color` tokens). */
  @Input() color: string | null | undefined;
  /** Colour behind the pattern (default: none, the pane's own background shows). */
  @Input() bgColor: string | null | undefined;
  /** `variant="image"`: the picture and where it lies in flow coordinates. */
  @Input() src: string | null | undefined;
  @Input() imageX = 0;
  @Input() imageY = 0;
  @Input() imageWidth: number | null | undefined;
  @Input() imageHeight: number | null | undefined;
  @Input() imageOpacity = 1;
  @Input() styleClass?: string | null;

  readonly patternId = ɵuniqueId('wu-flow-bg');
  p: FlowBackgroundPattern = { width: 20, height: 20, x: 0, y: 0, radius: 0.5, path: '' };
  imageBox = { x: 0, y: 0, width: 0, height: 0 };

  private stop: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ɵWuFlowHost, { optional: true });

  ngOnInit(): void {
    this.update();
    this.stop =
      this.host?.ɵlisten((changes) => {
        if (changes.has('viewport')) {
          this.update();
          this.cdr.detectChanges();
        }
      }) || null;
  }

  ngOnChanges(): void {
    this.update();
  }

  ngOnDestroy(): void {
    this.stop?.();
  }

  private update(): void {
    const vp: FlowViewport = this.host ? this.host.getViewport() : { x: 0, y: 0, zoom: 1 };
    if (this.variant === 'image') {
      const w = Number(this.imageWidth) || 1000;
      const h = Number(this.imageHeight) || 1000;
      this.imageBox = { x: vp.x + (Number(this.imageX) || 0) * vp.zoom, y: vp.y + (Number(this.imageY) || 0) * vp.zoom, width: w * vp.zoom, height: h * vp.zoom };
      return;
    }
    const variant = this.variant === 'lines' || this.variant === 'cross' ? this.variant : 'dots';
    this.p = backgroundPattern(vp, variant, this.gap, this.size ?? undefined, this.offset);
  }
}
