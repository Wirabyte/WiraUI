import { ChangeDetectionStrategy, Component, computed, contentChild, Directive, inject, input, TemplateRef, VERSION } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ComponentDoc } from '../core/component-doc';
import { DocsI18n } from '../core/i18n';
import { DOCS_VERSION } from '../core/version-theme';

/** Marks the FEATURES tab content of a component page: `<ng-template docsFeatures>…</ng-template>`. */
@Directive({ selector: 'ng-template[docsFeatures]', standalone: false })
export class DocsFeatures {
  readonly template = inject(TemplateRef);
}

export type DocTab = 'features' | 'api' | 'theming';

/** Header, FEATURES / API / THEMING tabs and the generated API and THEMING content of a component page. */
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
  readonly doc = input.required<ComponentDoc>();
  protected readonly features = contentChild(DocsFeatures);

  protected readonly tabs: { id: DocTab; label: string }[] = [
    { id: 'features', label: 'Features' },
    { id: 'api', label: 'API' },
    { id: 'theming', label: 'Theming' },
  ];
  protected readonly tab = toSignal(
    this.route.queryParamMap.pipe(map((p): DocTab => (p.get('tab') === 'api' || p.get('tab') === 'theming' ? (p.get('tab') as DocTab) : 'features'))),
    { initialValue: 'features' as DocTab }
  );

  protected readonly cssExample = computed(() => {
    const prefix = '--wt-' + this.tokenPrefix();
    const own = this.doc().tokens.filter((t) => t.name.startsWith(prefix));
    const pickTokens = (own.length ? own : this.doc().tokens).slice(0, 2);
    return `/* styles.css ของแอป: CSS ที่ไม่อยู่ใน @layer ชนะธีมเสมอ ไม่ต้องใช้ !important */
:root {
${pickTokens.map((t) => `  ${t.name}: …;`).join('\n')}
}

/* เฉพาะบางส่วนของหน้า: ตัวแปรสืบทอดลงไปถึง component ข้างใน */
.promo-banner {
  --wt-primary-color: #e11d48;
  --wt-primary-hover: #be123c;
}`;
  });

  protected readonly tsExample = computed(() => {
    const o = this.doc().overrides;
    if (!o) return '';
    return `// src/theme/wiratheme.overrides.ts
import { defineOverrides } from 'wiratheme/config';

export const wiraOverrides = defineOverrides({
  components: {
${o}
  },
});

// provideWiraTheme({ overrides: wiraOverrides })`;
  });

  private tokenPrefix(): string {
    return this.doc().id === 'inputtext' || this.doc().id === 'textarea' ? 'input-' : this.doc().id + '-';
  }
}
