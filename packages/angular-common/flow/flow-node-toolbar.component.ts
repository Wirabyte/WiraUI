import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ɵtoBool } from 'wiraui/config';
import type { FlowPosition } from 'wiraui/core';
import { ɵWuFlowHost } from './flow-host';
import { WU_FLOW_NODE } from './flow.types';

/**
 * Buttons floating beside a node: `<wu-flow-node-toolbar position="top">` inside a node template. Shown while the node
 * is the only one selected (or as `[isVisible]` says); it keeps its size whatever the zoom and never starts a drag.
 */
@Component({
  selector: 'wu-flow-node-toolbar',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      *ngIf="visible"
      class="wu-flow-node-toolbar nodrag nowheel"
      [class]="styleClass || ''"
      role="toolbar"
      [attr.aria-label]="ariaLabel || label"
      [attr.data-position]="side"
      [attr.data-align]="align || 'center'"
      [style.--_flow-toolbar-offset]="offsetPx"
    >
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WuFlowNodeToolbar implements OnInit, OnChanges, OnDestroy {
  /** Force it shown (true) or hidden (false); leave out to show it while the node is the only one selected. */
  @Input() isVisible: boolean | string | null | undefined;
  /** Side of the node. Default top. */
  @Input() position: FlowPosition = 'top';
  /** Along that side: start, center (default) or end. */
  @Input() align: 'start' | 'center' | 'end' = 'center';
  /** Space between the node and the toolbar in px (default: the `--wu-flow-toolbar-offset` token, 10px). */
  @Input() offset: number | string | null | undefined;
  /** The node it belongs to (default: the node whose template it is in). */
  @Input() nodeId: string | null | undefined;
  @Input() ariaLabel: string | null | undefined;
  @Input() styleClass?: string | null;

  visible = false;
  private stop: (() => void) | null = null;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly host = inject(ɵWuFlowHost, { optional: true });
  private readonly nodeCtx = inject(WU_FLOW_NODE, { optional: true });

  get side(): FlowPosition {
    const p = this.position;
    return p === 'right' || p === 'bottom' || p === 'left' ? p : 'top';
  }
  get offsetPx(): string | null {
    const n = Number(this.offset);
    return this.offset === null || this.offset === undefined || this.offset === '' || !isFinite(n) ? null : n + 'px';
  }
  get label(): string {
    return this.host ? this.host.ɵtext('flowNodeToolbar') : '';
  }

  ngOnInit(): void {
    this.sync();
    this.stop =
      this.host?.ɵlisten((changes) => {
        if ((changes.has('selection') || changes.has('nodes')) && this.sync()) this.cdr.detectChanges();
      }) || null;
  }

  ngOnChanges(): void {
    this.sync();
  }

  ngOnDestroy(): void {
    this.stop?.();
  }

  private id(): string | null {
    return this.nodeId || this.nodeCtx?.id || this.el.closest?.('.wu-flow-node')?.getAttribute('data-id') || null;
  }

  /** True when it was shown / hidden. */
  private sync(): boolean {
    let next: boolean;
    if (this.isVisible !== undefined && this.isVisible !== null && this.isVisible !== '') next = ɵtoBool(this.isVisible);
    else {
      const id = this.id();
      next = !!id && !!this.host && this.host.ɵisNodeSelected(id) && this.host.ɵselectedNodeCount() === 1;
    }
    const changed = next !== this.visible;
    this.visible = next;
    return changed;
  }
}
