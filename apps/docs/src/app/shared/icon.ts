import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** 24×24 stroke icons (Lucide style) used by the docs chrome. */
const ICONS: Record<string, string[]> = {
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'm20 20-4-4'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  sun: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M12 2v2', 'M12 20v2', 'm4.9 4.9 1.4 1.4', 'm17.7 17.7 1.4 1.4', 'M2 12h2', 'M20 12h2', 'm6.3 17.7-1.4 1.4', 'm19.1 4.9-1.4 1.4'],
  moon: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
  palette: [
    'M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-1.8a1.7 1.7 0 0 0-1.2 2.9c.4.4.6.8.6 1.3 0 1-.8 1.8-1.8 1.8H12Z',
    'M7.5 10.5h.01',
    'M10.5 6.5h.01',
    'M15.5 7.5h.01',
  ],
  rocket: [
    'M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z',
    'm12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z',
    'M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0',
    'M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5',
  ],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  chevronDown: ['m6 9 6 6 6-6'],
  chevronRight: ['m9 18 6-6-6-6'],
  chevronLeft: ['m15 18-6-6 6-6'],
  arrowRight: ['M5 12h14', 'm12 5 7 7-7 7'],
  copy: ['M8 8h12v12H8z', 'M16 8V4H4v12h4'],
  check: ['M20 6 9 17l-5-5'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
  layers: ['m12 2 10 5-10 5L2 7l10-5Z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'],
  code: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  calendar: ['M3 5h18v16H3z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
  swap: ['M16 3h5v5', 'M21 3 14 10', 'M8 21H3v-5', 'M3 21l7-7'],
  wand: ['m15 4 5 5', 'M3 21 15 9', 'M19 3v4', 'M21 5h-4', 'M6 3v2', 'M7 4H5'],
  figma: [
    'M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5Z',
    'M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z',
    'M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Z',
    'M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0Z',
    'M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5Z',
  ],
  heart: ['M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z'],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z', 'M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5'],
  sparkles: ['m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z'],
  info: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 16v-4', 'M12 8h.01'],
  alert: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 8v4', 'M12 16h.01'],
  refresh: ['M3 12a9 9 0 0 1 15-6.7L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15 6.7L3 16', 'M8 16H3v5'],
};

@Component({
  selector: 'docs-icon',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'docs-icon', 'aria-hidden': 'true' },
  template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    @for (d of paths(); track $index) {
      <path [attr.d]="d" />
    }
  </svg>`,
})
export class DocsIcon {
  readonly name = input.required<string>();
  protected readonly paths = computed(() => ICONS[this.name()] || []);
}
