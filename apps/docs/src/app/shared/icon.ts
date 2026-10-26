import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * The docs chrome's icon names, drawn with wiraicon (the site's own icon set, the same one the samples use). The names
 * stay short and stable for the templates; the right-hand side is the wiraicon name (`wi wi-<name>`).
 */
const WIRAICON: Record<string, string> = {
  search: 'search',
  menu: 'bars',
  x: 'times',
  sun: 'sun',
  moon: 'moon',
  palette: 'palette',
  rocket: 'rocket',
  grid: 'th-large',
  chevronDown: 'chevron-down',
  chevronRight: 'chevron-right',
  chevronLeft: 'chevron-left',
  arrowRight: 'arrow-right',
  copy: 'copy',
  check: 'check',
  external: 'external-link',
  layers: 'layers',
  code: 'code',
  calendar: 'calendar',
  swap: 'exchange',
  wand: 'magic',
  figma: 'figma',
  heart: 'heart',
  book: 'book',
  sparkles: 'sparkles',
  info: 'info-circle',
  alert: 'exclamation-circle',
  refresh: 'refresh',
  icons: 'smiley',
  download: 'download',
};

/** An icon of the docs chrome: `<docs-icon name="search">`. Sized by its box (18px unless a rule says otherwise). */
@Component({
  selector: 'docs-icon',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-icon', 'aria-hidden': 'true' },
  template: `<i [class]="cls()"></i>`,
})
export class DocsIcon {
  readonly name = input.required<string>();
  protected readonly cls = computed(() => 'wi wi-' + (WIRAICON[this.name()] || this.name()));
}
