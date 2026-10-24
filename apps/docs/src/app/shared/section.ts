import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { DocSectionText } from '../core/component-doc';
import { DocsToc } from '../core/docs-toc';
import { Text } from '../core/i18n';

/**
 * A titled part of a page. Registers itself in the "On this page" list and is the scroll target for #id.
 * Give it `title` (and optional intro `text`, inline HTML allowed), or a `section` from a component's data file.
 */
@Component({
  selector: 'docs-section',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-section', '[attr.id]': 'id()', '[class.docs-section-sub]': 'level() === 3' },
  template: `
    @if (level() === 3) {
      <h3 class="docs-h3">
        <a class="docs-anchor" [routerLink]="[]" [fragment]="id()" queryParamsHandling="preserve" aria-hidden="true">#</a>{{ heading() | loc }}
      </h3>
    } @else {
      <h2 class="docs-h2">
        <a class="docs-anchor" [routerLink]="[]" [fragment]="id()" queryParamsHandling="preserve" aria-hidden="true">#</a>{{ heading() | loc }}
      </h2>
    }
    @if (intro(); as t) {
      <p [innerHTML]="t | loc"></p>
    }
    <ng-content></ng-content>
  `,
})
export class DocsSection implements OnInit, OnDestroy {
  private readonly toc = inject(DocsToc);
  readonly id = input.required<string>();
  readonly title = input<Text>('');
  readonly text = input<Text>();
  readonly section = input<DocSectionText>();
  readonly level = input<2 | 3>(2);

  protected readonly heading = computed(() => this.section()?.title ?? this.title());
  protected readonly intro = computed(() => this.section()?.text ?? this.text());

  ngOnInit(): void {
    this.toc.add({ id: this.id(), title: this.heading(), level: this.level() });
  }

  ngOnDestroy(): void {
    this.toc.remove(this.id());
  }
}
