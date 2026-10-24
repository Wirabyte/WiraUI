import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DocsState } from '../core/docs-state';
import { DocsScale, presetGroups } from '../core/version-theme';

/** Same swatches as @wiratheme/core PRIMARY_SWATCHES / SURFACES; kept here so the shell needs no wiratheme import. */
const PRIMARIES = [
  ['wira', '#00a86b'],
  ['emerald', '#10b981'],
  ['green', '#22c55e'],
  ['lime', '#84cc16'],
  ['teal', '#14b8a6'],
  ['cyan', '#06b6d4'],
  ['sky', '#0ea5e9'],
  ['blue', '#3b82f6'],
  ['indigo', '#6366f1'],
  ['violet', '#8b5cf6'],
  ['purple', '#a855f7'],
  ['fuchsia', '#d946ef'],
  ['pink', '#ec4899'],
  ['rose', '#f43f5e'],
  ['red', '#ef4444'],
  ['orange', '#f97316'],
  ['amber', '#f59e0b'],
  ['yellow', '#eab308'],
].map(([id, hex]) => ({ id, hex }));

/** Light (100), mid (500) and dark (800) shade of each surface: the mid shade shows its tint (blue, cool, warm). */
const SURFACES = [
  ['slate', '#f1f5f9', '#64748b', '#1e293b'],
  ['gray', '#f3f4f6', '#6b7280', '#1f2937'],
  ['zinc', '#f4f4f5', '#71717a', '#27272a'],
  ['neutral', '#f5f5f5', '#737373', '#262626'],
  ['stone', '#f5f5f4', '#78716c', '#292524'],
].map(([id, light, mid, dark]) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1),
  swatch: `linear-gradient(90deg, ${light} 0 34%, ${mid} 34% 67%, ${dark} 67%)`,
}));

/** Theme popover in the top bar: primary, surface, the current version's presets, UI size, ripple. */
@Component({
  selector: 'docs-configurator',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-config docs-scroll" id="docs-config-panel" role="dialog" [attr.aria-label]="'config.title' | t">
      <div class="docs-config-head">
        <b>{{ 'config.title' | t }}</b>
        <span class="docs-chip docs-chip-quiet">{{ version() }}</span>
        <button type="button" class="docs-link-btn" id="docs-config-reset" (click)="state.reset()">{{ 'config.reset' | t }}</button>
      </div>

      <div class="docs-config-section">
        <div class="docs-config-label">Primary</div>
        <div class="docs-swatches">
          <button
            type="button"
            class="docs-swatch-btn docs-swatch-default"
            [class.active]="!state.custom().primary"
            (click)="state.update({ primary: null })"
            [title]="'config.presetColor' | t"
            [attr.aria-label]="'config.presetColor' | t"
          ></button>
          @for (c of primaries; track c.id) {
            <button
              type="button"
              class="docs-swatch-btn"
              [style.background]="c.hex"
              [class.active]="state.custom().primary === c.hex"
              [attr.data-primary]="c.id"
              [title]="c.id"
              [attr.aria-label]="c.id"
              (click)="state.update({ primary: c.hex })"
            ></button>
          }
        </div>
      </div>

      <div class="docs-config-section">
        <div class="docs-config-label">Surface</div>
        <!-- Named pills: the five surfaces differ only in tint, too little to tell apart as plain dots. -->
        <div class="docs-config-surfaces">
          <button
            type="button"
            class="docs-config-preset docs-surface-pill"
            [class.active]="!state.custom().surface"
            [attr.aria-pressed]="!state.custom().surface"
            (click)="state.update({ surface: null })"
            [title]="'config.presetSurface' | t"
          >
            <span class="docs-surface-dot docs-surface-dot-default" aria-hidden="true"></span>
            {{ 'config.surfaceDefault' | t }}
          </button>
          @for (s of surfaces; track s.id) {
            <button
              type="button"
              class="docs-config-preset docs-surface-pill"
              [class.active]="state.custom().surface === s.id"
              [attr.aria-pressed]="state.custom().surface === s.id"
              [attr.data-surface]="s.id"
              (click)="state.update({ surface: s.id })"
            >
              <span class="docs-surface-dot" [style.background]="s.swatch" aria-hidden="true"></span>
              {{ s.name }}
            </button>
          }
        </div>
      </div>

      <div class="docs-config-section">
        <div class="docs-config-label">
          {{ 'config.presets' | t }} {{ version() }}
          @if (state.theme(); as t) {
            <span class="docs-muted">{{ t.presets.length }}</span>
          }
        </div>
        <div class="docs-config-presets">
          @for (g of groups(); track g.family) {
            @if (g.family) {
              <div class="docs-config-family">
                <span class="docs-config-family-name">{{ g.label }}</span>
                <span class="docs-swatches">
                  @for (p of g.items; track p.id) {
                    <button
                      type="button"
                      class="docs-swatch-btn docs-theme-swatch"
                      [class.docs-theme-dark]="p.scheme === 'dark'"
                      [style.background]="p.primary"
                      [class.active]="state.activePresetId() === p.id"
                      [attr.data-preset]="p.id"
                      [title]="p.id"
                      [attr.aria-label]="p.id"
                      (click)="state.choosePreset(p.id)"
                    ></button>
                  }
                </span>
              </div>
            } @else {
              @for (p of g.items; track p.id) {
                <button
                  type="button"
                  class="docs-config-preset"
                  [class.active]="state.activePresetId() === p.id"
                  [attr.data-preset]="p.id"
                  (click)="state.choosePreset(p.id)"
                >
                  {{ p.name }}
                </button>
              }
            }
          }
        </div>
        <div class="docs-config-current">
          {{ 'config.current' | t }} <code>{{ state.activePresetId() }}</code>
        </div>
      </div>

      <div class="docs-config-section">
        <div class="docs-config-label">
          {{ 'config.scale' | t }}
          <span class="docs-muted">{{ scalePx[state.scale()] }}px</span>
        </div>
        <div class="docs-config-scale" role="radiogroup" [attr.aria-label]="'config.scale' | t">
          @for (s of scales; track s) {
            <button
              type="button"
              role="radio"
              class="docs-config-preset"
              [class.active]="state.scale() === s"
              [attr.aria-checked]="state.scale() === s"
              [attr.data-scale]="s"
              (click)="state.setScale(s)"
            >
              {{ s }}
            </button>
          }
        </div>
      </div>

      <div class="docs-config-section docs-config-switches">
        <label class="docs-switch">
          <input type="checkbox" role="switch" id="docs-config-ripple" [checked]="state.rippleOn()" (change)="state.setRipple($any($event.target).checked)" />
          <span class="docs-switch-track"></span>
          Ripple
        </label>
        <label class="docs-switch">
          <input type="checkbox" role="switch" [checked]="state.dark()" (change)="state.setDark($any($event.target).checked)" />
          <span class="docs-switch-track"></span>
          Dark mode
        </label>
      </div>

      <a class="docs-config-designer" [routerLink]="['/', version(), 'theming', 'designer']" (click)="closed.emit()">
        <docs-icon name="wand"></docs-icon>
        {{ 'config.designer' | t }}
        <docs-icon name="arrowRight"></docs-icon>
      </a>
    </div>
  `,
})
export class DocsConfigurator {
  protected readonly state = inject(DocsState);
  readonly version = input.required<string>();
  readonly closed = output<void>();
  protected readonly primaries = PRIMARIES;
  protected readonly surfaces = SURFACES;
  protected readonly scales: DocsScale[] = ['sm', 'md', 'lg'];
  protected readonly scalePx: Record<DocsScale, number> = { sm: 12, md: 14, lg: 16 };
  protected readonly groups = computed(() => presetGroups(this.state.theme()?.presets || []));
}
