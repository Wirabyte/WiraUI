import { DOCUMENT } from '@angular/common';
import { computed, inject, signal } from '@angular/core';
import { DocsI18n } from '../../core/i18n';
import { sampleText } from '../../core/sample-text';
import { pick, Snippet } from '../../core/snippets';
import { DOCS_VERSION } from '../../core/version-theme';
import { ICONS_CODE, ICONS_SECTIONS, ICONS_WORDS } from '../../data/icons';

/*
 * The Icons page (getting-started/icons). A version page, so its demos use that version's wu-button; the icons
 * themselves (wiraicon) are the same in every version. The gallery reads wiraicon/icons.json, which angular.json
 * serves next to the SVG files (wiraicon/svg/<weight>/<name>.svg), so the list is fetched once, not bundled.
 */

/** One entry of wiraicon/icons.json. */
export interface WiraIconEntry {
  name: string;
  aliases: string[];
  category: string;
  codepoint: string;
  /** Icons drawn in one weight only (star-fill …). */
  weight?: string;
}

interface WiraIconFile {
  version: string;
  weights: string[];
  categories: Record<string, { th: string; en: string }>;
  icons: WiraIconEntry[];
}

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill';

export interface IconOption {
  label: string;
  value: string;
}

/** Old prefixes people type out of habit: `pi pi-times`, `fa-solid fa-xmark`, `ph-x` … are searched as the name. */
const PREFIX = /^(?:wi\s+wi-|pi\s+pi-|fa[a-z-]*\s+fa-|ph\s+ph-|wi-|pi-|fa-|ph-)/;

let iconFile: Promise<WiraIconFile> | null = null;

export abstract class IconsDemo {
  protected readonly v = inject(DOCS_VERSION);
  protected readonly i18n = inject(DocsI18n);
  protected readonly en = this.i18n.en;
  private readonly doc = inject(DOCUMENT);
  private readonly words = sampleText(ICONS_WORDS);
  protected readonly sec = ICONS_SECTIONS;

  readonly data = signal<WiraIconFile | null>(null);
  readonly failed = signal(false);
  readonly query = signal('');
  readonly category = signal('all');
  readonly weight = signal<IconWeight>('regular');
  readonly size = signal(28);
  readonly picked = signal<WiraIconEntry | null>(null);

  readonly weights: IconWeight[] = ['thin', 'light', 'regular', 'bold', 'fill'];
  readonly weightOptions = computed<IconOption[]>(() =>
    this.weights.map((w) => ({ label: w === 'regular' ? this.tx('ปกติ') : w, value: w }))
  );
  readonly categoryOptions = computed<IconOption[]>(() => {
    const d = this.data();
    const en = this.en();
    const all = { label: this.tx('ทุกหมวด'), value: 'all' };
    if (!d) return [all];
    return [all, ...Object.entries(d.categories).map(([value, label]) => ({ label: en ? label.en : label.th, value }))];
  });

  /** The icons the search and category leave, in the file's order. */
  readonly visible = computed<WiraIconEntry[]>(() => {
    const d = this.data();
    if (!d) return [];
    const q = this.query().trim().toLowerCase().replace(PREFIX, '');
    const cat = this.category();
    return d.icons.filter((i) => {
      if (cat !== 'all' && i.category !== cat) return false;
      if (!q) return true;
      if (i.name.includes(q) || i.aliases.some((a) => a.includes(q))) return true;
      const label = d.categories[i.category];
      return !!label && (label.th.includes(q) || label.en.toLowerCase().includes(q));
    });
  });

  /** ' wi-bold' … for the weight picked ('' for regular). */
  readonly weightClass = computed(() => (this.weight() === 'regular' ? '' : ' wi-' + this.weight()));
  readonly gridStyle = computed(() => ({ '--docs-wi-size': this.size() + 'px' }));

  readonly pickedClass = computed(() => {
    const p = this.picked();
    return p ? 'wi wi-' + p.name + this.weightClass() : '';
  });
  readonly classCode = computed(() => (this.picked() ? `<i class="${this.pickedClass()}"></i>` : ''));
  readonly tagCode = computed(() => {
    const p = this.picked();
    if (!p) return '';
    return `<wi-icon name="${p.name}"${this.weight() === 'regular' ? '' : ` weight="${this.weight()}"`}></wi-icon>`;
  });
  readonly buttonCode = computed(() => (this.picked() ? `icon="${this.pickedClass()}"` : ''));
  readonly svgHref = computed(() => {
    const p = this.picked();
    return p ? `wiraicon/svg/${this.weight()}/${p.name}.svg` : '';
  });
  readonly pickedCategory = computed(() => {
    const p = this.picked();
    const label = p && this.data()?.categories[p.category];
    return label ? (this.en() ? label.en : label.th) : '';
  });

  /** The standalone import, as the docs show it for this version (v1 components say standalone: true). */
  readonly standaloneCode = computed(
    () => `import { Component } from '@angular/core';
import { WiIcon } from 'wiraicon/angular';

@Component({
  selector: 'app-example',${this.v.major === 1 ? '\n  standalone: true,' : ''}
  imports: [WiIcon],
  templateUrl: './example.component.html',
})
export class ExampleComponent {}`
  );
  readonly importTabs = computed(() => [
    { label: 'Standalone', code: this.standaloneCode(), lang: 'ts' as const },
    { label: 'NgModule', code: this.code('ngmodule'), lang: 'ts' as const },
  ]);

  constructor() {
    iconFile ||= fetch(new URL('wiraicon/icons.json', this.doc.baseURI).href).then((r) =>
      r.ok ? (r.json() as Promise<WiraIconFile>) : Promise.reject(new Error(String(r.status)))
    );
    iconFile.then(
      (d) => this.data.set(d),
      () => {
        iconFile = null;
        this.failed.set(true);
      }
    );
  }

  /** Sample text in the site language. */
  protected tx(th: string): string {
    return this.en() ? this.words.swap(th) : th;
  }

  /** A code sample of the page in the site language and for this version. */
  protected code(key: string): string {
    const s: Snippet | undefined = ICONS_CODE[key];
    return pick(this.en() && s ? this.words.snippet(s) : s, this.v, this.i18n.lang());
  }

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected pickIcon(icon: WiraIconEntry): void {
    this.picked.set(icon);
  }

  protected setWeight(value: unknown): void {
    if (this.weights.includes(value as IconWeight)) this.weight.set(value as IconWeight);
  }

  protected setCategory(value: unknown): void {
    this.category.set(typeof value === 'string' ? value : 'all');
  }

  protected setSize(value: unknown): void {
    const n = Number(value);
    if (Number.isFinite(n)) this.size.set(Math.min(64, Math.max(16, n)));
  }
}
