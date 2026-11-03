import { ChangeDetectionStrategy, Component, computed, contentChild, Directive, inject, input, TemplateRef, VERSION } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ApiGroup, ComponentDoc } from '../core/component-doc';
import { DocsI18n, Text } from '../core/i18n';
import { DOCS_PREVIEW } from '../core/preview';
import { sampleText } from '../core/sample-text';
import { DOCS_VERSION } from '../core/version-theme';
import { navPageOf } from '../core/nav';

/** Marks the FEATURES tab content of a component page: `<ng-template docsFeatures>…</ng-template>`. */
@Directive({ selector: 'ng-template[docsFeatures]', standalone: false })
export class DocsFeatures {
  readonly template = inject(TemplateRef);
}

export type DocTab = 'features' | 'api' | 'theming';

/** Header, the Examples · Properties · Styling switch and the generated Properties and Styling content of a component page. */
@Component({
  selector: 'docs-component-page',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-page.html',
})
export class DocsComponentPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly version = inject(DOCS_VERSION);
  protected readonly en = inject(DocsI18n).en;
  protected readonly host = VERSION.full;
  /** In the studio's preview: the Examples only, without the page header and tabs. */
  protected readonly preview = inject(DOCS_PREVIEW, { optional: true }) === true;
  readonly doc = input.required<ComponentDoc>();
  /** Where the page sits in the sidebar: `Components · Form`, `Layout · Components`, `Utilities · Helpers`. */
  protected readonly eyebrow = computed(() => navPageOf('components/' + this.doc().id)?.group || 'Components · ' + this.doc().group);
  protected readonly features = contentChild(DocsFeatures);

  /** Labels only; the ids, the ?tab= values and the anchors stay as they were. */
  protected readonly tabs: { id: DocTab; label: Text; icon: string }[] = [
    { id: 'features', label: { th: 'ตัวอย่าง', en: 'Examples' }, icon: 'sparkles' },
    { id: 'api', label: { th: 'คุณสมบัติ', en: 'Properties' }, icon: 'code' },
    { id: 'theming', label: { th: 'ปรับแต่ง', en: 'Styling' }, icon: 'palette' },
  ];
  protected readonly tab = toSignal(
    this.route.queryParamMap.pipe(map((p): DocTab => (p.get('tab') === 'api' || p.get('tab') === 'theming' ? (p.get('tab') as DocTab) : 'features'))),
    { initialValue: 'features' as DocTab }
  );

  /** Type declarations in the Properties tab carry comments: English ones on the English site. */
  protected readonly apiGroups = computed((): ApiGroup[] => {
    const doc = this.doc();
    if (!this.en()) return doc.api;
    const words = sampleText(doc.english);
    return doc.api.map((g) => (g.code ? { ...g, code: words.swap(g.code) } : g));
  });

  protected readonly cssExample = computed(() => {
    const prefix = '--wu-' + this.tokenPrefix();
    const own = this.doc().tokens.filter((t) => t.name.startsWith(prefix));
    const pickTokens = (own.length ? own : this.doc().tokens).slice(0, 2);
    const en = this.en();
    return `/* ${en ? "The app's styles.css: CSS outside @layer always beats the theme, no !important needed" : 'styles.css ของแอป: CSS ที่ไม่อยู่ใน @layer ชนะธีมเสมอ ไม่ต้องใช้ !important'} */
:root {
${pickTokens.map((t) => `  ${t.name}: …;`).join('\n')}
}

/* ${en ? 'One part of the page only: the variables reach every component inside' : 'เฉพาะบางส่วนของหน้า: ตัวแปรสืบทอดลงไปถึง component ข้างใน'} */
.promo-banner {
  --wu-primary-color: #e11d48;
  --wu-primary-hover: #be123c;
}`;
  });

  protected readonly tsExample = computed(() => {
    const raw = this.doc().overrides;
    if (!raw) return '';
    const o = this.en() ? sampleText(this.doc().english).swap(raw) : raw;
    return `// src/theme/wiraui.overrides.ts
import { defineOverrides } from '@wirabyte/ui/config';

export const wiraOverrides = defineOverrides({
  components: {
${o}
  },
});

// provideWiraUI({ overrides: wiraOverrides })`;
  });

  private tokenPrefix(): string {
    return this.doc().id === 'inputtext' || this.doc().id === 'textarea' ? 'input-' : this.doc().id + '-';
  }
}
