import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DocsI18n } from '../core/i18n';
import { DOCS_VERSION } from '../core/version-theme';

/**
 * Once per page with named slots, on v1 / v2 only: their samples write `wtTemplate="footer"`, and the attribute
 * older templates use is read the same. v3 samples use `#footer`, so nothing is shown there.
 */
@Component({
  selector: 'docs-slot-note',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (version.major < 3) {
      <p class="docs-slot-note">
        @if (en()) {
          Named slots are written <code>&lt;ng-template wtTemplate="{{ slot() }}"&gt;</code> here. The
          <code>pTemplate="{{ slot() }}"</code> attribute existing templates use is read the same, so they move over as they are.
        } @else {
          ตัวอย่างในรุ่นนี้เขียน slot เป็น <code>&lt;ng-template wtTemplate="{{ slot() }}"&gt;</code> ส่วน attribute
          <code>pTemplate="{{ slot() }}"</code> ที่ template เดิมใช้ก็อ่านได้เหมือนกัน ย้ายมาได้โดยไม่ต้องแก้
        }
      </p>
    }
  `,
})
export class DocsSlotNote {
  protected readonly version = inject(DOCS_VERSION);
  protected readonly en = inject(DocsI18n).en;
  /** The slot name the samples on this page use most. */
  readonly slot = input('footer');
}
