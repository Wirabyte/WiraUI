import { DOCUMENT, NgFor } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, Routes } from '@angular/router';
import { WuButtonModule } from '@wirabyte/ui/button';
import { WuCheckboxModule } from '@wirabyte/ui/checkbox';
import { provideWiraUI } from '@wirabyte/ui/config';
import { computeTokens } from '@wirabyte/ui/core';
import { WiraKawaii } from '@wirabyte/ui/presets';
import { WuProgressBarModule } from '@wirabyte/ui/progressbar';
import { WuTagModule } from '@wirabyte/ui/tag';
import { WuToggleSwitchModule } from '@wirabyte/ui/toggleswitch';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { KAWAII } from '../core/secrets';
import { KAWAII_LOGO_DECOS, KAWAII_LOGO_STILL_SVG } from './kawaii-logo';

const FONTS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=M+PLUS+Rounded+1c:wght@800&family=Itim&display=swap';

/**
 * A page no menu links to (type "kawaii" anywhere on the site): the cute sticker logo, after the trend of cute logos
 * for dev tools, and the hidden WiraKawaii preset.
 */
@Component({
  selector: 'docs-secret-kawaii',
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, WuButtonModule, WuCheckboxModule, WuProgressBarModule, WuTagModule, WuToggleSwitchModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="docs-kawaii">
      <div class="docs-kawaii-glow" aria-hidden="true"></div>
      <div class="docs-kawaii-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <a class="docs-kawaii-home" routerLink="/">← กลับหน้าแรก</a>
      <span class="docs-kawaii-pill"><span aria-hidden="true">✦</span> ความลับเล็ก ๆ ของเรานะคะ · a little secret</span>
      <div class="docs-kawaii-logo">
        <div class="docs-kawaii-logo-still" [innerHTML]="logo"></div>
        <span
          *ngFor="let d of decos"
          [class]="'docs-kawaii-deco ' + d.cls"
          [style.left.%]="d.left"
          [style.top.%]="d.top"
          [style.width.%]="d.width"
          [innerHTML]="d.svg"
        ></span>
      </div>
      <h1 class="docs-kawaii-title">น่ารักไว้ก่อนนะคะ ♡</h1>
      <p class="docs-kawaii-lead">
        เย้ เจอหน้าลับแล้วค่ะ! ในไลบรารีของเราแอบมีธีมชื่อ <b>WiraKawaii</b> อยู่ สีแดงฟ้าของ Wirabyte ในลุคโลโก้สติกเกอร์น่ารัก ๆ ไม่มีเมนูไหนพามาเลยนะคะ ต้องเรียกชื่อเท่านั้นถึงจะเปิดใช้ได้ค่ะ
        <span lang="en">You found it. WiraUI hides a preset called WiraKawaii, in Wirabyte's coral and sky; nothing lists it, only its name turns it on.</span>
      </p>
      <p class="docs-kawaii-unlocked" role="status">
        ♡ ปลดล็อก preset <b>WiraKawaii</b> ในแผงแต่งธีมกับ Studio ของเว็บนี้ให้แล้วนะคะ{{ wasUnlocked ? '' : ' (ครั้งแรกเลยค่ะ!)' }}
        <span lang="en">WiraKawaii is now in this site's theme panel and Studio.</span>
      </p>

      <section class="docs-kawaii-preview" [style]="previewStyle" aria-label="WiraKawaii preset">
        <div class="docs-kawaii-row">
          <wu-button label="บันทึก" icon="wi wi-heart"></wu-button>
          <wu-button label="ยกเลิก" severity="secondary"></wu-button>
          <wu-button label="ลองดู" [outlined]="true"></wu-button>
          <wu-button label="ลบ" severity="danger" [text]="true"></wu-button>
        </div>
        <div class="docs-kawaii-row" lang="ja">
          <wu-tag value="かわいい"></wu-tag>
          <wu-tag value="ふわふわ" severity="success"></wu-tag>
          <wu-tag value="キラキラ" severity="info"></wu-tag>
          <wu-tag value="ドキドキ" severity="warn"></wu-tag>
          <wu-tag value="にゃーん" severity="danger"></wu-tag>
        </div>
        <div class="docs-kawaii-row">
          <wu-checkbox [(ngModel)]="cute" [binary]="true" inputId="kawaii-cute" label="น่ารักทุกวันเลยค่ะ"></wu-checkbox>
          <wu-toggleswitch [(ngModel)]="sparkle" inputId="kawaii-sparkle"></wu-toggleswitch>
          <label for="kawaii-sparkle">ประกายวิบวับ</label>
        </div>
        <wu-progressBar [value]="105"></wu-progressBar>
      </section>

      <div class="docs-kawaii-code">
        <code>&#64;use '&#64;wirabyte/ui/theme' with ($preset: 'kawaii');</code>
        <code>provideWiraUI(&#123; preset: WiraKawaii &#125;)  // import &#123; WiraKawaii &#125; from '&#64;wirabyte/ui/presets'</code>
      </div>

      <div class="docs-kawaii-actions">
        <a class="docs-kawaii-btn docs-kawaii-btn-main" href="kawaii/wiraui-logo.svg" download="wiraui-logo.svg">ดาวน์โหลดโลโก้ (SVG)</a>
        <a class="docs-kawaii-btn" routerLink="/">กลับหน้าแรก</a>
      </div>
    </main>
  `,
  styles: [
    `
      /* Wirabyte's own colours: the navy of its badge, the coral and sky of its W and B. The site keeps a scrollbar
         gutter: on this dark page it (and the scrollbar in it) goes dark too. */
      html.docs-kawaii-open {
        background: #121a27;
        color-scheme: dark;
      }
      .docs-kawaii {
        position: relative;
        isolation: isolate;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        min-height: 100vh;
        min-height: 100dvh;
        box-sizing: border-box;
        padding: 1rem 1rem 4rem;
        overflow: hidden;
        background: #121a27;
        color: #e6edf5;
        font-family: 'IBM Plex Sans Thai', Inter, sans-serif;
        text-align: center;
      }
      .docs-kawaii-home {
        align-self: stretch;
        width: min(72rem, 100%);
        margin: 0 auto;
        color: inherit;
        font-size: 0.875rem;
        text-align: start;
        text-decoration: none;
        opacity: 0.75;
      }
      .docs-kawaii-home:hover {
        opacity: 1;
      }
      .docs-kawaii-home:focus-visible,
      .docs-kawaii-btn:focus-visible {
        outline: 2px solid #7fd3f5;
        outline-offset: 3px;
      }
      .docs-kawaii-glow {
        position: absolute;
        inset: -20% -10% auto;
        z-index: -1;
        height: 80%;
        background:
          radial-gradient(40% 50% at 20% 30%, rgba(120, 194, 255, 0.2), transparent 75%),
          radial-gradient(35% 45% at 50% 20%, rgba(95, 230, 191, 0.14), transparent 75%),
          radial-gradient(40% 50% at 82% 32%, rgba(255, 107, 107, 0.2), transparent 75%);
      }
      .docs-kawaii-rings {
        position: absolute;
        inset: 0;
        z-index: -1;
        display: grid;
        place-items: center;
        pointer-events: none;
      }
      .docs-kawaii-rings i {
        grid-area: 1 / 1;
        width: min(1300px, 180vw);
        aspect-ratio: 1;
        border: 1px solid rgba(230, 237, 245, 0.08);
        border-radius: 50%;
      }
      .docs-kawaii-rings i:nth-child(2) {
        width: min(1000px, 140vw);
      }
      .docs-kawaii-rings i:nth-child(3) {
        width: min(700px, 100vw);
      }
      .docs-kawaii-pill {
        padding: 0.25rem 0.875rem;
        border-radius: 999px;
        background: rgba(255, 107, 107, 0.14);
        color: #ffb0a8;
        font-size: 0.875rem;
      }
      /* Only transforms on their own layers move: the big logo is painted once and never again. */
      .docs-kawaii-logo {
        position: relative;
        width: min(860px, 100%);
        will-change: transform;
        animation: docs-kawaii-float 5s ease-in-out infinite;
      }
      .docs-kawaii-logo svg {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
      }
      .docs-kawaii-deco {
        position: absolute;
        display: block;
        aspect-ratio: 1;
        will-change: transform;
        pointer-events: none;
      }
      .docs-kawaii-deco.kw-star {
        animation: docs-kawaii-twinkle 2.6s ease-in-out infinite;
      }
      .docs-kawaii-deco.kw-star-b {
        animation-delay: -1.3s;
      }
      .docs-kawaii-deco.kw-heart {
        animation: docs-kawaii-beat 1.4s ease-in-out infinite;
      }
      .docs-kawaii-deco.kw-plus {
        animation: docs-kawaii-spin 9s linear infinite;
      }
      .docs-kawaii-deco.kw-plus-b {
        animation-duration: 12s;
        animation-direction: reverse;
      }
      .docs-kawaii-title {
        margin: 0;
        background: linear-gradient(90deg, #ff6b6b, #ff9a4b, #5fe6bf, #45a9e3);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-family: Fredoka, 'IBM Plex Sans Thai', sans-serif;
        font-size: clamp(1.75rem, 5vw, 3rem);
        line-height: 1.2;
      }
      .docs-kawaii-lead {
        max-width: 40rem;
        margin: 0;
        color: #b4c0cf;
        line-height: 1.7;
      }
      .docs-kawaii-lead span,
      .docs-kawaii-unlocked span {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.875em;
        opacity: 0.8;
      }
      .docs-kawaii-unlocked {
        margin: 0;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background: rgba(69, 169, 227, 0.14);
        color: #9fd9f7;
        font-size: 0.9375rem;
      }
      /* The preview wears the preset (its tokens are set on it); the page around keeps its own look. */
      .docs-kawaii-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: min(36rem, 100%);
        box-sizing: border-box;
        padding: 1.25rem;
        border-radius: 1.25rem;
        background: var(--wu-card-bg);
        color: var(--wu-text);
        font-family: var(--wu-font-family);
        box-shadow: 0 20px 60px -20px rgba(255, 107, 107, 0.4);
        text-align: start;
      }
      .docs-kawaii-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }
      .docs-kawaii-code {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        max-width: 100%;
      }
      .docs-kawaii-code code {
        overflow-x: auto;
        padding: 0.375rem 0.75rem;
        border-radius: 0.5rem;
        background: rgba(230, 237, 245, 0.08);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8125rem;
        white-space: nowrap;
      }
      .docs-kawaii-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }
      .docs-kawaii-btn {
        padding: 0.625rem 1.25rem;
        border: 1px solid rgba(230, 237, 245, 0.25);
        border-radius: 999px;
        color: inherit;
        text-decoration: none;
        font-weight: 600;
      }
      .docs-kawaii-btn:hover {
        background: rgba(230, 237, 245, 0.08);
      }
      .docs-kawaii-btn-main {
        border-color: transparent;
        background: linear-gradient(90deg, #ff6b6b, #ff9a4b);
        color: #ffffff;
      }
      /* Firefox snaps a layer that only slides to whole pixels (a hair of a turn is not enough): a slow float then
         moves a pixel at a time and looks like a few frames a second. The small sway keeps every frame on the
         sub-pixel path, in every engine, and suits a sticker. */
      @keyframes docs-kawaii-float {
        0%,
        100% {
          transform: translateY(0) rotate(-0.6deg);
        }
        50% {
          transform: translateY(-10px) rotate(0.6deg);
        }
      }
      @keyframes docs-kawaii-twinkle {
        50% {
          transform: scale(0.82) rotate(12deg);
        }
      }
      @keyframes docs-kawaii-beat {
        15%,
        45% {
          transform: scale(1.14);
        }
        30% {
          transform: scale(1);
        }
      }
      @keyframes docs-kawaii-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .docs-kawaii-logo,
        .docs-kawaii-deco {
          animation: none;
        }
      }
    `,
  ],
})
export class SecretKawaii implements OnInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly doc = inject(DOCUMENT);
  readonly logo = this.sanitizer.bypassSecurityTrustHtml(KAWAII_LOGO_STILL_SVG);
  readonly decos = KAWAII_LOGO_DECOS.map((d) => ({ ...d, svg: this.sanitizer.bypassSecurityTrustHtml(d.svg) }));
  /** Whether WiraKawaii was already unlocked before this visit; opening the page unlocks it. */
  readonly wasUnlocked = KAWAII.unlocked();
  /** The preview card wears the WiraKawaii preset. */
  readonly previewStyle: Record<string, string> = {};
  cute = true;
  sparkle = true;
  private fontLink: HTMLLinkElement | null = null;

  constructor() {
    KAWAII.unlock();
    for (const [k, v] of Object.entries(computeTokens(WiraKawaii.config).light)) this.previewStyle[`--wu-${k}`] = String(v);
  }

  ngOnInit(): void {
    this.fontLink = this.doc.createElement('link');
    this.fontLink.rel = 'stylesheet';
    this.fontLink.href = FONTS;
    this.doc.head.appendChild(this.fontLink);
    this.doc.documentElement.classList.add('docs-kawaii-open');
  }

  ngOnDestroy(): void {
    this.fontLink?.remove();
    this.doc.documentElement.classList.remove('docs-kawaii-open');
  }
}

export const SECRET_ROUTES: Routes = [
  { path: '', component: SecretKawaii, title: 'WiraUI ♡', providers: [provideWiraUI({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING] },
];
