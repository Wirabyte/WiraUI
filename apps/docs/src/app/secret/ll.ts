import { DOCUMENT, NgFor } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Routes } from '@angular/router';
import { WuButtonModule } from '@wirabyte/ui/button';
import { WuCheckboxModule } from '@wirabyte/ui/checkbox';
import { provideWiraUI } from '@wirabyte/ui/config';
import { computeTokens, ThemeConfig } from '@wirabyte/ui/core';
import { LL } from '@wirabyte/ui/presets';
import { WuProgressBarModule } from '@wirabyte/ui/progressbar';
import { WuTagModule } from '@wirabyte/ui/tag';
import { WuToggleSwitchModule } from '@wirabyte/ui/toggleswitch';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { HASU } from '../core/secrets';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Noto+Serif+Thai:wght@400;600;700' +
  '&family=Noto+Sans+Thai+Looped:wght@400;500;600;700&display=swap';

/** Lotus (hasu): three petals and two side leaves. */
const LOTUS =
  'M0,-30 C12,-18 13,2 0,14 C-13,2 -12,-18 0,-30Z M0,14 C-6,-4 -22,-14 -32,-10 C-30,6 -14,16 0,14Z M0,14 C6,-4 22,-14 32,-10 C30,6 14,16 0,14Z';

interface Unit {
  id: string;
  name: string;
  color: string;
}
const UNITS: Unit[] = [
  { id: 'cerise', name: 'Cerise Bouquet', color: '#e5487a' },
  { id: 'dollchestra', name: 'DOLLCHESTRA', color: '#3a6fd8' },
  { id: 'miracra', name: 'Mira-Cra Park!', color: '#f2a900' },
  { id: 'edel', name: 'Edel Note', color: '#b8963e' },
];

/** A page no menu links to (type "hasu" anywhere on the site): the hidden LL preset, in the club's own look. */
@Component({
  selector: 'docs-secret-hasu',
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, WuButtonModule, WuCheckboxModule, WuProgressBarModule, WuTagModule, WuToggleSwitchModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="docs-hasu">
      <a class="docs-hasu-home" routerLink="/">← กลับหน้าแรก</a>
      <header class="docs-hasu-mast">
        <svg class="docs-hasu-lotus" viewBox="-36 -34 72 52" aria-hidden="true"><path [attr.d]="lotus" /></svg>
        <div>
          <p class="docs-hasu-logo" lang="ja">ウィラUI<span>蓮のプリセット</span></p>
          <p class="docs-hasu-logo-en">WIRAUI · HASU PRESET · LL</p>
        </div>
      </header>

      <div class="docs-hasu-head">
        <h1 class="docs-hasu-title">SECRET</h1>
        <span class="docs-hasu-chip" lang="ja">ひみつ</span>
      </div>

      <section class="docs-hasu-panel">
        <p class="docs-hasu-lead">
          เจอหน้าลับแล้ว ในไลบรารีมีธีมซ่อนชื่อ <b>LL</b> สีแดงของโรงเรียนบนกระดาษสีครีม ตัวอักษรไทยแบบมีหัว ไม่มีเมนูไหนแสดง เปิดใช้ได้ด้วยชื่ออย่างเดียว
          <span lang="en">You found it. WiraUI hides a preset called LL; nothing lists it, only its name turns it on.</span>
        </p>
        <p class="docs-hasu-unlocked" role="status">
          ปลดล็อก preset <b>Hasu</b> ในแผงแต่งธีมกับ Studio ของเว็บนี้แล้ว{{ wasUnlocked ? '' : ' (ครั้งแรก!)' }}
          <span lang="en">Hasu is now in this site's theme panel and Studio.</span>
        </p>

        <div class="docs-hasu-units" role="radiogroup" aria-label="ยูนิต · Units">
          <button
            *ngFor="let u of units"
            type="button"
            role="radio"
            class="docs-hasu-unit"
            [id]="'hasu-unit-' + u.id"
            [attr.aria-checked]="unit === u"
            [style.--docs-hasu-unit]="u.color"
            (click)="pickUnit(u)"
          >
            <span class="docs-hasu-unit-face" aria-hidden="true">
              <svg viewBox="-36 -34 72 52"><path [attr.d]="lotus" /></svg>
            </span>
            <span class="docs-hasu-unit-name">{{ u.name }}</span>
            <span class="docs-hasu-unit-dot" aria-hidden="true"></span>
          </button>
        </div>
        <p class="docs-hasu-hint">แตะยูนิตเพื่อลองสีของยูนิตนั้นในตัวอย่าง แตะซ้ำเพื่อกลับเป็นสีแดง <span lang="en">Tap a unit to try its colour; tap again for the crimson.</span></p>

        <div class="docs-hasu-grid">
          <section class="docs-hasu-preview" [style]="previewStyle" aria-label="LL preset">
            <div class="docs-hasu-row">
              <wu-button label="บันทึก" icon="wi wi-heart"></wu-button>
              <wu-button label="ยกเลิก" severity="secondary"></wu-button>
              <wu-button label="ลองดู" [outlined]="true"></wu-button>
              <wu-button label="ลบ" severity="danger" [text]="true"></wu-button>
            </div>
            <div class="docs-hasu-row">
              <wu-tag value="蓮ノ空"></wu-tag>
              <wu-tag value="Cerise Bouquet" severity="danger"></wu-tag>
              <wu-tag value="DOLLCHESTRA" severity="info"></wu-tag>
              <wu-tag value="Mira-Cra Park!" severity="warn"></wu-tag>
              <wu-tag value="Edel Note" styleClass="docs-hasu-edel"></wu-tag>
            </div>
            <div class="docs-hasu-row">
              <wu-checkbox [(ngModel)]="cheer" [binary]="true" inputId="hasu-cheer" label="เชียร์ทุกวัน"></wu-checkbox>
              <wu-toggleswitch [(ngModel)]="practice" inputId="hasu-practice"></wu-toggleswitch>
              <label for="hasu-practice">ซ้อมหลังเลิกเรียน</label>
            </div>
            <wu-progressBar [value]="105"></wu-progressBar>
          </section>
          <div class="docs-hasu-name">
            <span class="docs-hasu-label">PRESET</span>
            <p class="docs-hasu-name-box"><ruby>LL<rt lang="ja">はす</rt></ruby></p>
            <code>&#64;use '&#64;wirabyte/ui/theme' with ($preset: 'll');</code>
            <code>provideWiraUI(&#123; preset: LL &#125;)  // import &#123; LL &#125; from '&#64;wirabyte/ui/presets'</code>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [
    `
      /* The site keeps a scrollbar gutter: it takes the paper colour too. */
      html.docs-hasu-open {
        background: #f3efe4;
        color-scheme: light;
      }
      /* Paper, crimson and serif, framed like a club notice board. */
      .docs-hasu {
        --docs-hasu-red: #b8172f;
        --docs-hasu-ink: #2b2523;
        --docs-hasu-pink: #f7e1dc;
        --docs-hasu-line: #dcc3bd;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        min-height: 100vh;
        min-height: 100dvh;
        box-sizing: border-box;
        padding: 1rem 1rem 4rem;
        background: #f3efe4;
        color: var(--docs-hasu-ink);
        font-family: 'Noto Serif Thai', 'Shippori Mincho', serif;
        text-align: center;
      }
      .docs-hasu > * {
        width: min(72rem, 100%);
        box-sizing: border-box;
      }
      .docs-hasu-home {
        color: inherit;
        font-size: 0.875rem;
        text-align: start;
        text-decoration: none;
        opacity: 0.75;
      }
      .docs-hasu-home:hover {
        opacity: 1;
      }
      .docs-hasu-home:focus-visible,
      .docs-hasu-unit:focus-visible {
        outline: 2px solid var(--docs-hasu-red);
        outline-offset: 3px;
      }
      .docs-hasu-mast {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid var(--docs-hasu-line);
        text-align: start;
      }
      .docs-hasu-lotus {
        flex: none;
        width: 3.25rem;
        fill: var(--docs-hasu-red);
      }
      .docs-hasu-logo,
      .docs-hasu-logo-en,
      .docs-hasu-title,
      .docs-hasu-chip,
      .docs-hasu-unit-name,
      .docs-hasu-label,
      .docs-hasu-name-box {
        font-family: 'Shippori Mincho', serif;
      }
      .docs-hasu-logo {
        margin: 0;
        color: var(--docs-hasu-red);
        font-size: clamp(1.5rem, 4.5vw, 2.5rem);
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: 0.04em;
      }
      .docs-hasu-logo span {
        margin-inline-start: 0.4em;
        font-size: 0.62em;
        font-weight: 700;
      }
      .docs-hasu-logo-en {
        margin: 0.25rem 0 0;
        color: var(--docs-hasu-red);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.32em;
      }
      .docs-hasu-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }
      .docs-hasu-title {
        margin: 0;
        font-size: clamp(2.5rem, 9vw, 4.5rem);
        font-weight: 500;
        line-height: 1;
        letter-spacing: 0.04em;
      }
      .docs-hasu-chip {
        padding: 0.25rem 1.25rem;
        background: var(--docs-hasu-ink);
        color: #ffffff;
        font-weight: 700;
        letter-spacing: 0.3em;
      }
      /* Double rules round a soft pink board. */
      .docs-hasu-panel {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: clamp(1rem, 3vw, 2rem);
        border: 1px solid var(--docs-hasu-line);
        outline: 1px solid var(--docs-hasu-line);
        outline-offset: 4px;
        background: var(--docs-hasu-pink);
      }
      .docs-hasu-lead {
        max-width: 46rem;
        margin: 0 auto;
        line-height: 1.8;
      }
      .docs-hasu-lead span,
      .docs-hasu-hint span,
      .docs-hasu-unlocked span {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.875em;
        opacity: 0.75;
      }
      .docs-hasu-unlocked {
        align-self: center;
        margin: 0;
        padding: 0.5rem 1rem;
        border: 1px solid var(--docs-hasu-red);
        background: #ffffff;
        color: var(--docs-hasu-red);
      }
      .docs-hasu-units {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        width: min(44rem, 100%);
        box-sizing: border-box;
        margin: 0 auto;
        padding: 0.75rem;
        border: 1px solid var(--docs-hasu-line);
        background: #ffffff;
      }
      @media (min-width: 640px) {
        .docs-hasu-units {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      /* A member-card frame: the colour face, the name down the right edge, a dot in the corner. */
      .docs-hasu-unit {
        position: relative;
        display: grid;
        grid-template-columns: 1fr auto;
        aspect-ratio: 4 / 5;
        padding: 0.375rem;
        border: 1px solid var(--docs-hasu-line);
        background: #ffffff;
        color: inherit;
        font: inherit;
        cursor: pointer;
        transition: box-shadow 0.2s, translate 0.2s;
      }
      .docs-hasu-unit:hover {
        translate: 0 -2px;
        box-shadow: 0 6px 16px -10px rgba(43, 37, 35, 0.5);
      }
      .docs-hasu-unit[aria-checked='true'] {
        border-color: var(--docs-hasu-unit);
        box-shadow: inset 0 0 0 2px var(--docs-hasu-unit);
      }
      .docs-hasu-unit-face {
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--docs-hasu-unit) 16%, #ffffff);
      }
      .docs-hasu-unit-face svg {
        width: 62%;
        fill: var(--docs-hasu-unit);
      }
      .docs-hasu-unit-name {
        padding: 0.25rem 0.125rem 1.25rem;
        writing-mode: vertical-rl;
        font-size: 0.8125rem;
        font-weight: 700;
        white-space: nowrap;
      }
      .docs-hasu-unit-dot {
        position: absolute;
        right: 0.55rem;
        bottom: 0.55rem;
        width: 0.5rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--docs-hasu-unit);
      }
      .docs-hasu-hint {
        margin: -0.5rem 0 0;
        font-size: 0.875rem;
        opacity: 0.8;
      }
      .docs-hasu-grid {
        display: grid;
        gap: 1.25rem;
        align-items: start;
      }
      @media (min-width: 900px) {
        .docs-hasu-grid {
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
        }
      }
      /* The preview wears the preset (its tokens are set on it); the page around keeps its own look. */
      .docs-hasu-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
        border: 1px solid var(--docs-hasu-line);
        background: var(--wu-card-bg);
        color: var(--wu-text);
        font-family: var(--wu-font-family);
        text-align: start;
      }
      .docs-hasu-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }
      /* Edel Note: gold and silver, as its emblem; the preset has no gold of its own. */
      .docs-hasu-edel {
        background: linear-gradient(90deg, #f3d77c, #e6e8ec);
        color: #5c4a12;
      }
      .docs-hasu-name {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-width: 0;
        text-align: start;
      }
      .docs-hasu-label {
        font-size: 0.75rem;
        letter-spacing: 0.2em;
      }
      .docs-hasu-name-box {
        margin: 0;
        padding: 0.5rem 1rem;
        border: 1px solid var(--docs-hasu-ink);
        background: #ffffff;
        font-size: 2.5rem;
        text-align: center;
        letter-spacing: 0.3em;
      }
      .docs-hasu-name-box rt {
        font-size: 0.75rem;
        letter-spacing: 0.4em;
      }
      .docs-hasu-name code {
        overflow-x: auto;
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--docs-hasu-line);
        background: #ffffff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8125rem;
        white-space: nowrap;
      }
      @media (prefers-reduced-motion: reduce) {
        .docs-hasu-unit {
          transition: none;
        }
      }
    `,
  ],
})
export class SecretHasu implements OnInit, OnDestroy {
  private readonly doc = inject(DOCUMENT);
  readonly lotus = LOTUS;
  readonly units = UNITS;
  /** Whether Hasu was already unlocked before this visit; opening the page unlocks it. */
  readonly wasUnlocked = HASU.unlocked();
  /** The unit whose colour the preview wears; none keeps the preset's crimson. */
  unit: Unit | null = null;
  previewStyle: Record<string, string> = {};
  cheer = true;
  practice = true;
  private fontLink: HTMLLinkElement | null = null;

  constructor() {
    HASU.unlock();
  }

  ngOnInit(): void {
    this.restyle();
    this.fontLink = this.doc.createElement('link');
    this.fontLink.rel = 'stylesheet';
    this.fontLink.href = FONTS;
    this.doc.head.appendChild(this.fontLink);
    this.doc.documentElement.classList.add('docs-hasu-open');
  }

  ngOnDestroy(): void {
    this.fontLink?.remove();
    this.doc.documentElement.classList.remove('docs-hasu-open');
  }

  pickUnit(unit: Unit): void {
    this.unit = this.unit === unit ? null : unit;
    this.restyle();
  }

  private restyle(): void {
    const config: ThemeConfig = { ...LL.config, ...(this.unit ? { primary: this.unit.color } : {}) };
    const style: Record<string, string> = {};
    for (const [k, v] of Object.entries(computeTokens(config).light)) style[`--wu-${k}`] = String(v);
    this.previewStyle = style;
  }
}

export const SECRET_ROUTES: Routes = [
  { path: '', component: SecretHasu, title: 'WiraUI · 蓮', providers: [provideWiraUI({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING] },
];
