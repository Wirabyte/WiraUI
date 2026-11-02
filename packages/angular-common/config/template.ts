import { Directive, inject, Input, TemplateRef } from '@angular/core';

/**
 * Names an `<ng-template>` for a component slot: `<ng-template wuTemplate="footer">…</ng-template>`.
 * The `pTemplate="footer"` attribute that existing templates use is read the same way, so dialogs, tables and
 * lists move over without touching their slots.
 */
@Directive({
  selector: 'ng-template[wuTemplate], ng-template[pTemplate]',
  standalone: true,
})
export class WuTemplate {
  /** Slot name, e.g. `header`, `footer`, `body`. */
  name = '';
  @Input() set wuTemplate(v: string) {
    this.name = v;
  }
  @Input() set pTemplate(v: string) {
    this.name = v;
  }
  readonly template: TemplateRef<unknown> = inject(TemplateRef);

  getType(): string {
    return this.name;
  }
}

/** The template named `name` among a component's `WuTemplate` children, if any. */
export function ɵfindTemplate(templates: Iterable<WuTemplate> | null | undefined, name: string): TemplateRef<unknown> | null {
  if (!templates) return null;
  for (const t of templates) if (t.name === name) return t.template;
  return null;
}
