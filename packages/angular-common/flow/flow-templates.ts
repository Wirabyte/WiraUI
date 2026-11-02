import { Directive, inject, Input, TemplateRef } from '@angular/core';
import type { WuFlowConnectionLineContext, WuFlowEdgeContext, WuFlowNodeContext } from './flow.types';

/**
 * A node template for one node type: `<ng-template wuFlowNode="person" let-node>…</ng-template>` draws every node with
 * `type: 'person'`. Without a type (`<ng-template wuFlowNode let-node>`) it draws every node that has no template of
 * its own (the built-in `input`, `output` and `group` types keep their look). Put `<wu-flow-handle>`s inside for the
 * places edges attach. Works the same in every version.
 */
@Directive({
  selector: 'ng-template[wuFlowNode]',
  standalone: true,
})
export class WuFlowNodeTemplate {
  /** The node type this template draws; empty for the default template. */
  @Input('wuFlowNode') type: string | null | undefined = '';
  readonly template: TemplateRef<WuFlowNodeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WuFlowNodeTemplate, _ctx: unknown): _ctx is WuFlowNodeContext {
    return true;
  }
}

/**
 * An edge template for one edge type: `<ng-template wuFlowEdge="special" let-edge><svg:path [attr.d]="edge.path" />
 * </ng-template>`. The template sits inside the edge's SVG group, so write its elements with the `svg:` prefix. The
 * flow adds the wide invisible path that catches clicks. Without a type it draws every edge with a custom type.
 */
@Directive({
  selector: 'ng-template[wuFlowEdge]',
  standalone: true,
})
export class WuFlowEdgeTemplate {
  @Input('wuFlowEdge') type: string | null | undefined = '';
  readonly template: TemplateRef<WuFlowEdgeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WuFlowEdgeTemplate, _ctx: unknown): _ctx is WuFlowEdgeContext {
    return true;
  }
}

/**
 * HTML drawn at an edge's label position instead of the plain label (a button on the edge, a badge):
 * `<ng-template wuFlowEdgeLabel="removable" let-edge>`. Without a type it applies to every edge that has a `label`.
 */
@Directive({
  selector: 'ng-template[wuFlowEdgeLabel]',
  standalone: true,
})
export class WuFlowEdgeLabelTemplate {
  @Input('wuFlowEdgeLabel') type: string | null | undefined = '';
  readonly template: TemplateRef<WuFlowEdgeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WuFlowEdgeLabelTemplate, _ctx: unknown): _ctx is WuFlowEdgeContext {
    return true;
  }
}

/** The line drawn while a connection is dragged: `<ng-template wuFlowConnectionLine let-line><svg:path …/></ng-template>`. */
@Directive({
  selector: 'ng-template[wuFlowConnectionLine]',
  standalone: true,
})
export class WuFlowConnectionLineTemplate {
  readonly template: TemplateRef<WuFlowConnectionLineContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WuFlowConnectionLineTemplate, _ctx: unknown): _ctx is WuFlowConnectionLineContext {
    return true;
  }
}
