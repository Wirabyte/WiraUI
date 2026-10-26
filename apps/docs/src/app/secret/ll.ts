import { DOCUMENT, NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, Routes } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { provideWiraTheme } from 'wiratheme/config';
import { computeTokens } from 'wiratheme/core';
import { LL } from 'wiratheme/presets';
import { WtProgressBarModule } from 'wiratheme/progressbar';
import { WtTagModule } from 'wiratheme/tag';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { THEME_LANDING } from '../versions/v3/theme-v3';
import { hasuUnlocked, unlockHasu } from '../core/hasu';
import { LL_LOGO_DECOS, LL_LOGO_STILL_SVG } from './ll-logo';

const FONTS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&family=M+PLUS+Rounded+1c:wght@800&family=Itim&display=swap';

/** A page no menu links to (type "hasu" anywhere on the site): the sticker logo and the hidden LL preset. */
@Component({
  selector: 'docs-secret-ll',
  standalone: true,
  imports: [NgFor, FormsModule, RouterLink, WtButtonModule, WtCheckboxModule, WtProgressBarModule, WtTagModule, WtToggleSwitchModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <main class="docs-ll">
      <div class="docs-ll-glow" aria-hidden="true"></div>
      <div class="docs-ll-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      <span class="docs-ll-pill"><span aria-hidden="true">✦</span> ความลับเล็ก ๆ · a little secret</span>
      <div class="docs-ll-logo">
        <div class="docs-ll-logo-still" [innerHTML]="logo"></div>
        <span
          *ngFor="let d of decos"
          [class]="'docs-ll-deco ' + d.cls"
          [style.left.%]="d.left"
          [style.top.%]="d.top"
          [style.width.%]="d.width"
          [innerHTML]="d.svg"
        ></span>
      </div>
      <h1 class="docs-ll-title">สวัสดีจากดอกบัว ♡</h1>
      <p class="docs-ll-lead">
        เจอหน้าลับแล้ว! ในไลบรารีมีธีมซ่อนชื่อ <b>LL</b> โทนชมพูดอกบัวกับสีของแต่ละยูนิต ไม่มีเมนูไหนแสดง เปิดใช้ได้ด้วยชื่ออย่างเดียว
        <span lang="en">You found it. WiraTheme hides a preset called LL; nothing lists it, only its name turns it on.</span>
      </p>
      <p class="docs-ll-unlocked" role="status">
        ♡ ปลดล็อก preset <b>Hasu</b> ในแผงแต่งธีมกับ Studio ของเว็บนี้แล้ว{{ wasUnlocked ? '' : ' (ครั้งแรก!)' }}
        <span lang="en">Hasu is now in this site's theme panel and Studio.</span>
      </p>

      <section class="docs-ll-preview" #preview aria-label="LL preset">
        <div class="docs-ll-row">
          <wt-button label="บันทึก" icon="wi wi-heart"></wt-button>
          <wt-button label="ยกเลิก" severity="secondary"></wt-button>
          <wt-button label="ลองดู" [outlined]="true"></wt-button>
          <wt-button label="ลบ" severity="danger" [text]="true"></wt-button>
        </div>
        <div class="docs-ll-row">
          <wt-tag value="蓮ノ空"></wt-tag>
          <wt-tag value="Cerise Bouquet" severity="danger"></wt-tag>
          <wt-tag value="DOLLCHESTRA" severity="info"></wt-tag>
          <wt-tag value="Mira-Cra Park!" severity="warn"></wt-tag>
          <wt-tag value="Edel Note" styleClass="docs-ll-edel"></wt-tag>
        </div>
        <div class="docs-ll-row">
          <wt-checkbox [(ngModel)]="cheer" [binary]="true" inputId="ll-cheer" label="เชียร์ทุกวัน"></wt-checkbox>
          <wt-toggleswitch [(ngModel)]="sparkle" inputId="ll-sparkle"></wt-toggleswitch>
          <label for="ll-sparkle">ประกายวิบวับ</label>
        </div>
        <wt-progressBar [value]="105"></wt-progressBar>
      </section>

      <div class="docs-ll-code">
        <code>&#64;use 'wiratheme/theme' with ($preset: 'll');</code>
        <code>provideWiraTheme(&#123; preset: LL &#125;)  // import &#123; LL &#125; from 'wiratheme/presets'</code>
      </div>

      <div class="docs-ll-actions">
        <a class="docs-ll-btn docs-ll-btn-main" href="ll/wiratheme-logo.svg" download="wiratheme-logo.svg">ดาวน์โหลดโลโก้ (SVG)</a>
        <a class="docs-ll-btn" routerLink="/">กลับหน้าแรก</a>
      </div>
    </main>
  `,
  styles: [
    `
      /* The site keeps a scrollbar gutter: on this dark page it (and the scrollbar in it) goes dark too. */
      html.docs-ll-open {
        background: #15111c;
        color-scheme: dark;
      }
      .docs-ll {
        position: relative;
        isolation: isolate;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        min-height: 100vh;
        min-height: 100dvh;
        box-sizing: border-box;
        padding: 3rem 1rem 4rem;
        overflow: hidden;
        background: #15111c;
        color: #e9e3f5;
        font-family: 'IBM Plex Sans Thai', Inter, sans-serif;
        text-align: center;
      }
      .docs-ll-glow {
        position: absolute;
        inset: -20% -10% auto;
        z-index: -1;
        height: 80%;
        background:
          radial-gradient(40% 50% at 20% 30%, rgba(120, 194, 255, 0.22), transparent 70%),
          radial-gradient(35% 45% at 50% 20%, rgba(215, 156, 242, 0.24), transparent 70%),
          radial-gradient(40% 50% at 82% 32%, rgba(245, 143, 185, 0.24), transparent 70%);
        filter: blur(30px);
      }
      .docs-ll-rings {
        position: absolute;
        inset: 0;
        z-index: -1;
        display: grid;
        place-items: center;
        pointer-events: none;
      }
      .docs-ll-rings i {
        grid-area: 1 / 1;
        width: min(1300px, 180vw);
        aspect-ratio: 1;
        border: 1px solid rgba(233, 227, 245, 0.08);
        border-radius: 50%;
      }
      .docs-ll-rings i:nth-child(2) {
        width: min(1000px, 140vw);
      }
      .docs-ll-rings i:nth-child(3) {
        width: min(700px, 100vw);
      }
      .docs-ll-pill {
        padding: 0.25rem 0.875rem;
        border-radius: 999px;
        background: rgba(245, 143, 185, 0.14);
        color: #f9a8c9;
        font-size: 0.875rem;
      }
      /* Only transforms on their own layers move: the big logo is painted once and never again. */
      .docs-ll-logo {
        position: relative;
        width: min(860px, 100%);
        will-change: transform;
        animation: docs-ll-float 5s ease-in-out infinite;
      }
      .docs-ll-logo svg {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;
      }
      .docs-ll-deco {
        position: absolute;
        display: block;
        aspect-ratio: 1;
        will-change: transform;
        pointer-events: none;
      }
      .docs-ll-deco.ll-star {
        animation: docs-ll-twinkle 2.6s ease-in-out infinite;
      }
      .docs-ll-deco.ll-star-b {
        animation-delay: -1.3s;
      }
      .docs-ll-deco.ll-heart {
        animation: docs-ll-beat 1.4s ease-in-out infinite;
      }
      .docs-ll-deco.ll-plus {
        animation: docs-ll-spin 9s linear infinite;
      }
      .docs-ll-deco.ll-plus-b {
        animation-duration: 12s;
        animation-direction: reverse;
      }
      .docs-ll-unlocked {
        margin: 0;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        background: rgba(232, 102, 142, 0.14);
        color: #f9b8cf;
        font-size: 0.9375rem;
      }
      .docs-ll-unlocked span {
        display: block;
        font-size: 0.8125rem;
        opacity: 0.8;
      }
      .docs-ll-title {
        margin: 0;
        background: linear-gradient(90deg, #78c2ff, #a6a4ff, #d79cf2, #f58fb9);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-family: Fredoka, 'IBM Plex Sans Thai', sans-serif;
        font-size: clamp(1.75rem, 5vw, 3rem);
        line-height: 1.2;
      }
      .docs-ll-lead {
        max-width: 40rem;
        margin: 0;
        color: #bdb3cf;
        line-height: 1.7;
      }
      .docs-ll-lead span {
        display: block;
        margin-top: 0.25rem;
        font-size: 0.875em;
        opacity: 0.8;
      }
      .docs-ll-preview {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: min(36rem, 100%);
        box-sizing: border-box;
        padding: 1.25rem;
        border-radius: 1.25rem;
        background: var(--wt-card-bg);
        color: var(--wt-text);
        font-family: var(--wt-font-family);
        box-shadow: 0 20px 60px -20px rgba(245, 143, 185, 0.45);
        text-align: start;
      }
      /* Edel Note: gold and silver, as its emblem; the preset has no gold of its own. */
      .docs-ll-edel {
        background: linear-gradient(90deg, #f3d77c, #e6e8ec);
        color: #5c4a12;
      }
      .docs-ll-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
      }
      .docs-ll-code {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        max-width: 100%;
      }
      .docs-ll-code code {
        overflow-x: auto;
        padding: 0.375rem 0.75rem;
        border-radius: 0.5rem;
        background: rgba(233, 227, 245, 0.08);
        color: #e9e3f5;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8125rem;
        white-space: nowrap;
      }
      .docs-ll-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }
      .docs-ll-btn {
        padding: 0.625rem 1.25rem;
        border: 1px solid rgba(233, 227, 245, 0.25);
        border-radius: 999px;
        color: #e9e3f5;
        text-decoration: none;
        font-weight: 600;
      }
      .docs-ll-btn:hover {
        background: rgba(233, 227, 245, 0.08);
      }
      .docs-ll-btn-main {
        border-color: transparent;
        background: linear-gradient(90deg, #e8668e, #b77be0);
        color: #ffffff;
      }
      .docs-ll-btn:focus-visible {
        outline: 2px solid #f9a8c9;
        outline-offset: 3px;
      }
      /* A bare translate gets snapped to whole pixels now and then (a 1px hop every few frames); the hair of rotation
         keeps every frame on the sub-pixel path. */
      @keyframes docs-ll-float {
        0%,
        100% {
          transform: translateY(0) rotate(0.01deg);
        }
        50% {
          transform: translateY(-10px) rotate(0.01deg);
        }
      }
      @keyframes docs-ll-twinkle {
        50% {
          transform: scale(0.82) rotate(12deg);
        }
      }
      @keyframes docs-ll-beat {
        15%,
        45% {
          transform: scale(1.14);
        }
        30% {
          transform: scale(1);
        }
      }
      @keyframes docs-ll-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .docs-ll-logo,
        .docs-ll-deco {
          animation: none;
        }
      }
    `,
  ],
})
export class SecretLL implements AfterViewInit, OnDestroy {
  @ViewChild('preview', { static: true }) protected previewRef?: ElementRef<HTMLElement>;
  private readonly sanitizer = inject(DomSanitizer);
  readonly logo = this.sanitizer.bypassSecurityTrustHtml(LL_LOGO_STILL_SVG);
  readonly decos = LL_LOGO_DECOS.map((d) => ({ ...d, svg: this.sanitizer.bypassSecurityTrustHtml(d.svg) }));
  /** Whether Hasu was already unlocked before this visit; opening the page unlocks it. */
  readonly wasUnlocked = hasuUnlocked();
  cheer = true;
  sparkle = true;
  private readonly doc = inject(DOCUMENT);
  private fontLink: HTMLLinkElement | null = null;

  constructor() {
    unlockHasu();
  }

  ngAfterViewInit(): void {
    // The preview card wears the LL preset; the rest of the page keeps the site's theme.
    const el = this.previewRef?.nativeElement;
    if (el) for (const [k, v] of Object.entries(computeTokens(LL.config).light)) el.style.setProperty(`--wt-${k}`, String(v));
    this.fontLink = this.doc.createElement('link');
    this.fontLink.rel = 'stylesheet';
    this.fontLink.href = FONTS;
    this.doc.head.appendChild(this.fontLink);
    this.doc.documentElement.classList.add('docs-ll-open');
  }

  ngOnDestroy(): void {
    this.fontLink?.remove();
    this.doc.documentElement.classList.remove('docs-ll-open');
  }
}

export const SECRET_ROUTES: Routes = [
  { path: '', component: SecretLL, title: 'WiraTheme ♡', providers: [provideWiraTheme({ locale: 'th', calendar: 'buddhist' }), THEME_LANDING] },
];
