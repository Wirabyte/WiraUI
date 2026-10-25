import { ContentChild, ContentChildren, Directive, inject, Input, QueryList, TemplateRef } from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵWT_SKIP_VERSION_CHECK, WtTemplate } from 'wiratheme/config';

const asTemplate = (v: unknown): TemplateRef<unknown> | null => (v instanceof TemplateRef ? v : null);

export type WtTimelineAlign = 'left' | 'right' | 'alternate' | 'top' | 'bottom';
export type WtTimelineLayout = 'vertical' | 'horizontal';

/** Context of the content / opposite / marker templates: the event and its index. */
export interface WtTimelineContext {
  $implicit: unknown;
  index: number;
}

/**
 * What wt-timeline does, shared by the v1 and v2/v3 templates: events along a line, each with a marker, its content
 * and (optionally) something on the opposite side. Without an `opposite` template the content takes the full width.
 */
@Directive()
export abstract class ɵWtTimelineBase {
  @Input() value: readonly unknown[] | null | undefined = [];
  /** Which side the content sits on: `left` (default), `right`, `alternate`; `top` / `bottom` when horizontal. */
  @Input() align: WtTimelineAlign = 'left';
  @Input() layout: WtTimelineLayout = 'vertical';
  @Input() styleClass?: string;
  @Input() style?: Record<string, string | number> | null;

  @ContentChildren(WtTemplate) protected templates?: QueryList<WtTemplate>;
  @ContentChild('content', { descendants: false }) protected contentRef?: unknown;
  @ContentChild('opposite', { descendants: false }) protected oppositeRef?: unknown;
  @ContentChild('marker', { descendants: false }) protected markerRef?: unknown;

  readonly trackIndex = (i: number): number => i;

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  get events(): readonly unknown[] {
    return this.value || [];
  }
  get contentTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.contentRef) || ɵfindTemplate(this.templates, 'content');
  }
  get oppositeTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.oppositeRef) || ɵfindTemplate(this.templates, 'opposite');
  }
  get markerTemplate(): TemplateRef<unknown> | null {
    return asTemplate(this.markerRef) || ɵfindTemplate(this.templates, 'marker');
  }
  get rootClasses(): string {
    const layout = this.layout === 'horizontal' ? 'horizontal' : 'vertical';
    const align = this.align || (layout === 'horizontal' ? 'top' : 'left');
    return `wt-timeline wt-timeline-${align} wt-timeline-${layout} p-timeline p-component p-timeline-${align} p-timeline-${layout}`;
  }
  context(event: unknown, index: number): WtTimelineContext {
    return { $implicit: event, index };
  }
}
