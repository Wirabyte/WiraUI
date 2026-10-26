import { Directive, inject, Input, TemplateRef } from '@angular/core';
import type { WtFlowConnectionLineContext, WtFlowEdgeContext, WtFlowNodeContext } from './flow.types';

/**
 * A node template for one node type: `<ng-template wtFlowNode="person" let-node>…</ng-template>` draws every node with
 * `type: 'person'`. Without a type (`<ng-template wtFlowNode let-node>`) it draws every node that has no template of
 * its own (the built-in `input`, `output` and `group` types keep their look). Put `<wt-flow-handle>`s inside for the
 * places edges attach. Works the same in every version.
 */
@Directive({
  selector: 'ng-template[wtFlowNode]',
  standalone: true,
})
export class WtFlowNodeTemplate {
  /** The node type this template draws; empty for the default template. */
  @Input('wtFlowNode') type: string | null | undefined = '';
  readonly template: TemplateRef<WtFlowNodeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WtFlowNodeTemplate, _ctx: unknown): _ctx is WtFlowNodeContext {
    return true;
  }
}

/**
 * An edge template for one edge type: `<ng-template wtFlowEdge="special" let-edge><svg:path [attr.d]="edge.path" />
 * </ng-template>`. The template sits inside the edge's SVG group, so write its elements with the `svg:` prefix. The
 * flow adds the wide invisible path that catches clicks. Without a type it draws every edge with a custom type.
 */
@Directive({
  selector: 'ng-template[wtFlowEdge]',
  standalone: true,
})
export class WtFlowEdgeTemplate {
  @Input('wtFlowEdge') type: string | null | undefined = '';
  readonly template: TemplateRef<WtFlowEdgeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WtFlowEdgeTemplate, _ctx: unknown): _ctx is WtFlowEdgeContext {
    return true;
  }
}

/**
 * HTML drawn at an edge's label position instead of the plain label (a button on the edge, a badge):
 * `<ng-template wtFlowEdgeLabel="removable" let-edge>`. Without a type it applies to every edge that has a `label`.
 */
@Directive({
  selector: 'ng-template[wtFlowEdgeLabel]',
  standalone: true,
})
export class WtFlowEdgeLabelTemplate {
  @Input('wtFlowEdgeLabel') type: string | null | undefined = '';
  readonly template: TemplateRef<WtFlowEdgeContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WtFlowEdgeLabelTemplate, _ctx: unknown): _ctx is WtFlowEdgeContext {
    return true;
  }
}

/** The line drawn while a connection is dragged: `<ng-template wtFlowConnectionLine let-line><svg:path …/></ng-template>`. */
@Directive({
  selector: 'ng-template[wtFlowConnectionLine]',
  standalone: true,
})
export class WtFlowConnectionLineTemplate {
  readonly template: TemplateRef<WtFlowConnectionLineContext> = inject(TemplateRef);

  static ngTemplateContextGuard(_dir: WtFlowConnectionLineTemplate, _ctx: unknown): _ctx is WtFlowConnectionLineContext {
    return true;
  }
}
