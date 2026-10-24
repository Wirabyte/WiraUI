import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ApiGroup, TokenRow } from '../core/component-doc';
import { DocsState } from '../core/docs-state';

@Component({
  selector: 'docs-api-table',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (group().note) {
      <p>{{ group().note | loc }}</p>
    }
    @if (group().rows; as rows) {
      <div class="docs-table-wrap">
        <table class="docs-table docs-api">
          <thead>
            <tr>
              <th>Name</th>
              <th>{{ (group().typeLabel || 'Type') | loc }}</th>
              @if (hasDefault()) {
                <th>Default</th>
              }
              <th>{{ 'api.description' | t }}</th>
            </tr>
          </thead>
          <tbody>
            @for (r of rows; track r.name) {
              <tr>
                <td><code class="docs-api-name">{{ r.name }}</code></td>
                <td [attr.data-label]="(group().typeLabel || 'Type') | loc"><code class="docs-api-type">{{ r.type }}</code></td>
                @if (hasDefault()) {
                  <td data-label="Default">
                    @if (r.default) {
                      <code>{{ r.default }}</code>
                    } @else {
                      <span class="docs-muted">–</span>
                    }
                  </td>
                }
                <td>{{ r.description | loc }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
    @if (group().code; as code) {
      <docs-code [code]="code" lang="ts"></docs-code>
    }
  `,
})
export class DocsApiTable {
  readonly group = input.required<ApiGroup>();
  protected readonly hasDefault = computed(() => (this.group().rows || []).some((r) => r.default !== undefined));
}

/** CSS variables a component reads, with the value the current theme gives them. */
@Component({
  selector: 'docs-token-table',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-table-wrap">
      <table class="docs-table docs-tokens">
        <thead>
          <tr>
            <th>CSS variable</th>
            <th>{{ 'tokens.usedFor' | t }}</th>
            <th>{{ 'tokens.value' | t }}</th>
          </tr>
        </thead>
        <tbody>
          @for (r of rows(); track r.name) {
            <tr>
              <td><code class="docs-api-name">{{ r.name }}</code></td>
              <td>{{ r.description | loc }}</td>
              <td>
                <span class="docs-token-value">
                  @if (r.color) {
                    <span class="docs-swatch" [style.background]="r.value"></span>
                  }
                  <code>{{ r.value || '—' }}</code>
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DocsTokenTable {
  private readonly doc = inject(DOCUMENT);
  private readonly state = inject(DocsState);
  readonly tokens = input.required<TokenRow[]>();

  protected readonly rows = computed(() => {
    this.state.revision();
    const style = this.doc.defaultView?.getComputedStyle(this.doc.documentElement);
    return this.tokens().map((t) => {
      const value = style ? style.getPropertyValue(t.name).trim() : '';
      return { ...t, value, color: /^(#|rgb|hsl|color-mix|oklch)/.test(value) };
    });
  });
}
