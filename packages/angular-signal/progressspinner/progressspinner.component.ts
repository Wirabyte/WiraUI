import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵfindTemplate, ɵrefreshOnTranslation, ɵWU_SKIP_VERSION_CHECK, WuConfig, WuTemplate } from 'wiraui/config';
import { ɵspinnerColors, ɵspinnerMulticolor } from './progressspinner.types';

/**
 * Busy indicator: `<wu-progress-spinner style="width: 2rem; height: 2rem">`. The preset sets its default size and
 * colours; `[multicolor]` / `[colors]` change the colours it cycles through. With `label` (or a `label` template) the
 * text sits under the ring (or beside it, `labelPosition="right"`), centred for you.
 */
@Component({
  selector: 'wu-progress-spinner, wu-progressspinner, wu-progressSpinner',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './progressspinner.component.html',
  styleUrl: './progressspinner.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A size in the `[style]` object (or `size`) sizes the host too (the ring fills the host) — unless there is a label.
  host: {
    '[style.width]': 'hostSize().width',
    '[style.height]': 'hostSize().height',
    '[style]': 'colorVars()',
    '[class.wu-progress-spinner-host-labelled]': 'labelled()',
    '[class.wu-progress-spinner-host-right]': "labelled() && labelPosition() === 'right'",
  },
})
export class WuProgressSpinner {
  readonly strokeWidth = input('2');
  readonly fill = input('none');
  readonly animationDuration = input('2s');
  readonly ariaLabel = input<string>();
  /** Size of the ring, e.g. `size="3rem"` (with a label the host grows to hold the text). */
  readonly size = input<string | number | null | undefined>();
  /** true: cycle through the theme's colours (primary, info, success, warn); false: the primary colour only. */
  readonly multicolor = input<boolean | undefined, unknown>(undefined, { transform: ɵspinnerMulticolor });
  /** Own colours to cycle through: `[colors]="['#e8668e', '#3b6fd8', '#ff9a2e']"` (up to four are used). */
  readonly colors = input<readonly string[] | null | undefined>();
  /** Text under the ring (or beside it), centred: `label="กำลังโหลด…"`. A `label` template takes its place. */
  readonly label = input<string | null | undefined>();
  readonly labelPosition = input<'bottom' | 'right'>('bottom');
  /** Classes for the root element, as before (`styleClass="w-full"`). */
  readonly styleClass = input<string | null | undefined>();
  /** Inline styles for the root element, as an object: `[style]="{ width: '20rem' }"`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style = input<Record<string, any> | string | null | undefined>();
  /** The `style` object for the root (a plain style attribute already styles the host). */
  readonly rootStyle = computed(() => {
    const s = this.style();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return s && typeof s === 'object' ? (s as Record<string, any>) : null;
  });
  readonly ringSize = computed(() => {
    const v = this.size();
    return v === null || v === undefined || v === '' ? null : typeof v === 'number' || /^\d+(\.\d+)?$/.test(String(v)) ? `${v}px` : String(v);
  });

  private readonly labelRef = contentChild('label', { descendants: false });
  private readonly templates = contentChildren(WuTemplate);
  /** `<ng-template #label>` (or `wuTemplate="label"`): own content under the ring. */
  readonly labelTemplate = computed(() => {
    const own = this.labelRef();
    return ((own instanceof TemplateRef ? own : null) || ɵfindTemplate(this.templates(), 'label')) as TemplateRef<unknown> | null;
  });
  readonly labelled = computed(() => !!this.label() || !!this.labelTemplate());

  readonly hostSize = computed(() => {
    if (this.labelled()) return { width: null, height: null };
    const s = this.rootStyle();
    const size = this.ringSize();
    return { width: (s?.['width'] as string | undefined) ?? size, height: (s?.['height'] as string | undefined) ?? size };
  });
  readonly colorVars = computed(() => ɵspinnerColors(this.multicolor(), this.colors()));

  private readonly config = inject(WuConfig);

  constructor() {
    ɵassertSupportedAngular(inject(ɵWU_SKIP_VERSION_CHECK, { optional: true }));
    const i18n = ɵrefreshOnTranslation();
    inject(DestroyRef).onDestroy(() => i18n.unsubscribe());
  }

  ariaText(): string {
    return this.ariaLabel() || this.label() || this.config.translation.loading;
  }
}
