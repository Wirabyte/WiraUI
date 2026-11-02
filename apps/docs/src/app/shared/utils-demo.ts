import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, Injectable, input, Pipe, PipeTransform, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DocsI18n } from '../core/i18n';

/** wiraui/utils CSS (copied to /wiraui-utils by angular.json), loaded only on the Utilities pages. */
export const UTILS_CSS = 'wiraui-utils/utils.min.css';

@Injectable({ providedIn: 'root' })
export class UtilsStylesheet {
  private readonly doc = inject(DOCUMENT);

  load(): void {
    if (this.doc.head.querySelector('link[data-docs-utils]')) return;
    const link = this.doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = UTILS_CSS;
    link.setAttribute('data-docs-utils', '');
    this.doc.head.appendChild(link);
  }
}

/**
 * Trusts the docs' own demo markup (static strings in data/utilities.ts, never user input), so form
 * elements in demos are not stripped by the sanitizer.
 */
@Pipe({ name: 'trustHtml', standalone: false })
export class TrustHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

const WIDTHS = [360, 768, 1024];

/** Demo inside an iframe of a chosen width, so the media queries behind sm: / md: / lg: react to it. */
@Component({
  selector: 'docs-viewport-demo',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="docs-viewport-bar" role="group" [attr.aria-label]="en() ? 'Frame width' : 'ความกว้างของกรอบ'">
      @for (w of widths; track w) {
        <button type="button" [class.active]="width() === w" [attr.aria-pressed]="width() === w" (click)="setWidth(w)">{{ w }}px</button>
      }
      <span class="docs-viewport-size">{{ width() }}px</span>
    </div>
    <div class="docs-viewport-stage docs-scroll-x">
      <iframe #frame class="docs-viewport-frame" [style.width.px]="width()" [srcdoc]="doc()" (load)="fit()" [title]="en() ? 'Responsive demo' : 'ตัวอย่าง responsive'"></iframe>
    </div>
  `,
})
export class DocsViewportDemo {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  protected readonly en = inject(DocsI18n).en;
  private readonly frame = viewChild.required<ElementRef<HTMLIFrameElement>>('frame');
  readonly html = input.required<string>();
  protected readonly widths = WIDTHS;
  protected readonly width = signal(360);

  protected readonly doc = computed(() => {
    const base = this.document.baseURI;
    const css = `html{overflow:hidden}body{margin:12px;font:14px/1.6 'IBM Plex Sans Thai',system-ui,sans-serif;color:#0d1726}
.docs-u-box{padding:8px 10px;border-radius:8px;background:#e8f1fc;color:#1763c6;text-align:center;font-size:12.5px;overflow-wrap:anywhere}`;
    return this.sanitizer.bypassSecurityTrustHtml(
      `<!doctype html><html><head><base href="${base}"><link rel="stylesheet" href="${UTILS_CSS}"><style>${css}</style></head><body>${this.html()}</body></html>`
    );
  });

  protected setWidth(w: number): void {
    this.width.set(w);
    setTimeout(() => this.fit(), 30);
  }

  /** Height follows the content (also after late fonts), so the frame never scrolls on its own. */
  protected fit(): void {
    const el = this.frame().nativeElement;
    const doc = el.contentDocument;
    if (!doc) return;
    const size = () => (el.style.height = doc.documentElement.scrollHeight + 'px');
    size();
    if (!this.observed.has(doc) && typeof ResizeObserver === 'function') {
      this.observed.add(doc);
      new ResizeObserver(size).observe(doc.body);
    }
  }

  private readonly observed = new WeakSet<Document>();
}
