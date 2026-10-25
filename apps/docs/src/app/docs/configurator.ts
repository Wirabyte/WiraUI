import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, OnDestroy, output, viewChild } from '@angular/core';
import { DocsI18n } from '../core/i18n';
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

/**
 * Theme drawer, opened from the top bar: a native modal <dialog> on the right (a full-width sheet on phones), so
 * focus stays inside, Escape closes it and focus goes back to the button that opened it. Cards for colour,
 * surface, preset, UI size and display, under a live preview strip drawn with the theme's own tokens.
 */
@Component({
  selector: 'docs-configurator',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dlg class="docs-studio" aria-labelledby="docs-studio-title" (cancel)="cancel($event)" (close)="onClose()" (click)="backdrop($event)">
      <div class="docs-studio-sheet">
        <header class="docs-studio-head">
          <span class="docs-logo-mark docs-studio-logo" aria-hidden="true">
            <svg viewBox="0 0 32 32"><path d="M7.5 10.5 11.5 22l4.5-9 4.5 9 4-11.5" /></svg>
          </span>
          <div class="docs-studio-heading">
            <b id="docs-studio-title">{{ 'config.title' | t }}</b>
            <span>wiratheme {{ version() }} · <code>{{ state.activePresetId() }}</code></span>
          </div>
          <button type="button" class="docs-link-btn" id="docs-config-reset" (click)="state.reset()">
            <docs-icon name="refresh"></docs-icon>{{ 'config.reset' | t }}
          </button>
          <!-- Opens with focus on ×, not on Reset, so the first visible ring is not on an action. -->
          <button type="button" class="docs-icon-btn" id="docs-config-close" autofocus [attr.aria-label]="'config.close' | t" (click)="close()">
            <docs-icon name="x"></docs-icon>
          </button>
        </header>

        <!-- Drawn with the theme's own tokens, so it shows the current choices at a glance. -->
        <div class="docs-studio-preview" aria-hidden="true">
          <span class="docs-studio-pv-btn">{{ en() ? 'Save' : 'บันทึก' }}</span>
          <span class="docs-studio-pv-btn docs-studio-pv-outlined">{{ en() ? 'Cancel' : 'ยกเลิก' }}</span>
          <span class="docs-studio-pv-input">{{ en() ? 'Search' : 'ค้นหา' }}</span>
          <span class="docs-studio-pv-tag">{{ en() ? 'Paid' : 'ชำระแล้ว' }}</span>
          <span class="docs-studio-pv-check"></span>
        </div>

        <div class="docs-studio-body docs-scroll" id="docs-config-panel">
          <section class="docs-studio-card">
            <h3>{{ 'config.colour' | t }}</h3>
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
          </section>

          <section class="docs-studio-card">
            <h3>{{ 'config.surface' | t }}</h3>
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
          </section>

          <section class="docs-studio-card">
            <h3>
              {{ 'config.preset' | t }}
              @if (state.theme(); as t) {
                <span class="docs-muted">{{ version() }} · {{ t.presets.length }}</span>
              }
            </h3>
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
          </section>

          <section class="docs-studio-card">
            <h3>
              {{ 'config.scale' | t }}
              <span class="docs-muted">{{ scalePx[state.scale()] }}px</span>
            </h3>
            <div class="docs-config-scale" role="radiogroup" [attr.aria-label]="'config.scale' | t">
              @for (s of scales; track s) {
                <button
                  type="button"
                  role="radio"
                  class="docs-scale-btn"
                  [class.active]="state.scale() === s"
                  [attr.aria-checked]="state.scale() === s"
                  [attr.data-scale]="s"
                  (click)="state.setScale(s)"
                >
                  <span class="docs-scale-aa" [style.font-size.px]="scalePx[s]">ก</span>
                  {{ s }}
                </button>
              }
            </div>
          </section>

          <section class="docs-studio-card docs-config-switches">
            <h3>{{ 'config.display' | t }}</h3>
            <label class="docs-switch">
              <input type="checkbox" role="switch" [checked]="state.dark()" (change)="state.setDark($any($event.target).checked)" />
              <span class="docs-switch-track"></span>
              {{ 'config.dark' | t }}
            </label>
            <label class="docs-switch">
              <input type="checkbox" role="switch" id="docs-config-ripple" [checked]="state.rippleOn()" (change)="state.setRipple($any($event.target).checked)" />
              <span class="docs-switch-track"></span>
              Ripple
            </label>
          </section>

          <a class="docs-config-designer" [routerLink]="['/', version(), 'theming', 'studio']" (click)="close()">
            <docs-icon name="wand"></docs-icon>
            {{ 'config.designer' | t }}
            <docs-icon name="arrowRight"></docs-icon>
          </a>
        </div>
      </div>
    </dialog>
  `,
})
export class DocsConfigurator implements AfterViewInit, OnDestroy {
  protected readonly state = inject(DocsState);
  protected readonly en = inject(DocsI18n).en;
  readonly version = input.required<string>();
  /** The top-bar button: focus goes back to it on close (Safari does not focus a clicked button, so no activeElement). */
  readonly trigger = input<HTMLElement | null>(null);
  readonly closed = output<void>();
  protected readonly primaries = PRIMARIES;
  protected readonly surfaces = SURFACES;
  protected readonly scales: DocsScale[] = ['sm', 'md', 'lg'];
  protected readonly scalePx: Record<DocsScale, number> = { sm: 12, md: 14, lg: 16 };
  protected readonly groups = computed(() => presetGroups(this.state.theme()?.presets || []));
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private done = false;

  ngAfterViewInit(): void {
    const d = this.dialog().nativeElement;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }

  ngOnDestroy(): void {
    this.done = true;
    const d = this.dialog().nativeElement;
    if (d.open) d.close();
    this.trigger()?.focus();
  }

  /** The ×, the backdrop, the Studio link and Escape. */
  close(): void {
    const d = this.dialog().nativeElement;
    if (d.open && typeof d.close === 'function') d.close();
    this.onClose();
  }

  /** Escape: closed here rather than left to the browser, whose close event can come late (or not at all in a background tab). */
  protected cancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** Also reached from the dialog's own close event, for a browser that closes it some other way. */
  protected onClose(): void {
    if (this.done) return;
    this.done = true;
    this.closed.emit();
  }

  /** A click on the dialog itself, not on the sheet inside it, is a click on the backdrop. */
  protected backdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
