import {
  ComponentRef,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  reflectComponentType,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import type { FlowNode } from '@wirabyte/ui/core';
import { WU_FLOW_NODE } from './flow.types';
import type { WuFlowNodeContext } from './flow.types';

/** The flow's side of the node wrapper: it measures the element while it exists. */
export abstract class ɵWuFlowNodeRegistry {
  abstract ɵregisterNode(id: string, el: HTMLElement): void;
  abstract ɵunregisterNode(id: string, el: HTMLElement): void;
  abstract ɵnodeComponentEvent(node: FlowNode, name: string, value: unknown): void;
}

/** Marks a node's wrapper element so the flow can measure it. Internal. */
@Directive({
  selector: '[wuFlowNodeWrapper]',
  standalone: true,
})
export class ɵWuFlowNodeWrapper implements OnInit, OnChanges, OnDestroy {
  @Input('wuFlowNodeWrapper') nodeId = '';
  private readonly el: HTMLElement = inject(ElementRef).nativeElement;
  private readonly registry = inject(ɵWuFlowNodeRegistry);
  private registered = '';

  ngOnInit(): void {
    this.register();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodeId'] && !changes['nodeId'].firstChange) this.register();
  }

  ngOnDestroy(): void {
    if (this.registered) this.registry.ɵunregisterNode(this.registered, this.el);
  }

  private register(): void {
    if (this.registered === this.nodeId) return;
    if (this.registered) this.registry.ɵunregisterNode(this.registered, this.el);
    this.registered = this.nodeId;
    if (this.nodeId) this.registry.ɵregisterNode(this.nodeId, this.el);
  }
}

/** Inputs a node component may declare; each gets the node's current value. */
const NODE_INPUTS: Record<string, (ctx: WuFlowNodeContext) => unknown> = {
  node: (c) => c.node,
  context: (c) => c,
  props: (c) => c,
  id: (c) => c.id,
  type: (c) => c.type,
  data: (c) => c.data,
  selected: (c) => c.selected,
  dragging: (c) => c.dragging,
  isConnectable: (c) => c.isConnectable,
  connectable: (c) => c.isConnectable,
  positionAbsoluteX: (c) => c.positionAbsoluteX,
  positionAbsoluteY: (c) => c.positionAbsoluteY,
  width: (c) => c.width,
  height: (c) => c.height,
  zIndex: (c) => c.zIndex,
  sourcePosition: (c) => c.sourcePosition,
  targetPosition: (c) => c.targetPosition,
  parentId: (c) => c.parentId,
};

/**
 * Draws a node with a component from `nodeTypes`. The component gets whichever of these inputs it declares: `node`,
 * `data`, `id`, `type`, `selected`, `dragging`, `isConnectable`, `width`, `height`, `positionAbsoluteX/Y`, `zIndex`,
 * `sourcePosition`, `targetPosition`, `parentId` (or `context` for all of them); its outputs come out of the flow's
 * `(nodeComponentEvent)`. Internal.
 */
@Directive({
  selector: '[wuFlowNodeComponent]',
  standalone: true,
})
export class ɵWuFlowNodeComponentOutlet implements OnChanges, DoCheck, OnDestroy {
  @Input() wuFlowNodeComponent: Type<unknown> | null = null;
  @Input() wuFlowNodeContext: WuFlowNodeContext | null = null;

  private ref: ComponentRef<unknown> | null = null;
  private inputs: string[] = [];
  private subs: { unsubscribe(): void }[] = [];
  private readonly vcr = inject(ViewContainerRef);
  private readonly registry = inject(ɵWuFlowNodeRegistry);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wuFlowNodeComponent'] || changes['wuFlowNodeContext']) this.create();
  }

  ngDoCheck(): void {
    this.push();
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private create(): void {
    this.clear();
    const type = this.wuFlowNodeComponent;
    if (!type) return;
    const mirror = reflectComponentType(type);
    // The node's context for `inject(WU_FLOW_NODE)`, on top of the flow's own injector (handles inside find the flow).
    const injector = Injector.create({ providers: [{ provide: WU_FLOW_NODE, useValue: this.wuFlowNodeContext }], parent: this.vcr.injector });
    this.ref = this.vcr.createComponent(type, { injector });
    this.inputs = mirror ? mirror.inputs.map((i) => i.templateName).filter((n) => n in NODE_INPUTS) : [];
    const instance = this.ref.instance as Record<string, unknown>;
    for (const out of mirror ? mirror.outputs : []) {
      const emitter = instance[out.propName];
      if (emitter instanceof EventEmitter || (emitter && typeof (emitter as { subscribe?: unknown }).subscribe === 'function')) {
        this.subs.push(
          (emitter as EventEmitter<unknown>).subscribe((value: unknown) => {
            const ctx = this.wuFlowNodeContext;
            if (ctx) this.registry.ɵnodeComponentEvent(ctx.node, out.templateName, value);
          })
        );
      }
    }
    this.push();
  }

  private push(): void {
    const ref = this.ref;
    const ctx = this.wuFlowNodeContext;
    if (!ref || !ctx) return;
    for (const name of this.inputs) ref.setInput(name, NODE_INPUTS[name](ctx));
  }

  private clear(): void {
    for (const s of this.subs) s.unsubscribe();
    this.subs = [];
    this.ref?.destroy();
    this.ref = null;
    this.vcr.clear();
  }
}
