import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  Provider,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { wiraIconName, WiraIconWeight, wiraIconWeight, WIRAICON_WEIGHTS } from '@wirabyte/icons';

type Drawings = Readonly<Record<string, string>>;

// One chunk per weight, fetched the first time a weight is drawn.
const LOADERS: Record<WiraIconWeight, () => Promise<Drawings>> = {
  regular: () => import('@wirabyte/icons/data/regular').then((m) => m.WIRAICON_REGULAR),
  thin: () => import('@wirabyte/icons/data/thin').then((m) => m.WIRAICON_THIN),
  light: () => import('@wirabyte/icons/data/light').then((m) => m.WIRAICON_LIGHT),
  bold: () => import('@wirabyte/icons/data/bold').then((m) => m.WIRAICON_BOLD),
  fill: () => import('@wirabyte/icons/data/fill').then((m) => m.WIRAICON_FILL),
};
const loaded = new Map<WiraIconWeight, Promise<Drawings>>();
function drawings(weight: WiraIconWeight): Promise<Drawings> {
  let p = loaded.get(weight);
  if (!p) {
    p = LOADERS[weight]();
    loaded.set(weight, p);
  }
  return p;
}

/** App-wide defaults for every <wi-icon>: `provideWiraIcon({ weight: 'bold', size: 20 })`. */
export interface WiraIconOptions {
  weight?: WiraIconWeight;
  size?: number | string;
}
export const WIRA_ICON_OPTIONS = new InjectionToken<WiraIconOptions>('WIRA_ICON_OPTIONS');
export function provideWiraIcon(options: WiraIconOptions): Provider {
  return { provide: WIRA_ICON_OPTIONS, useValue: options };
}

const CSS =
  'wi-icon{display:inline-block;flex:none;width:1em;height:1em;line-height:1;vertical-align:-0.125em;color:inherit}' +
  'wi-icon>svg{display:block;width:100%;height:100%}' +
  'wi-icon.wi-icon-spin>svg{animation:wi-icon-spin 1s linear infinite}' +
  '@keyframes wi-icon-spin{to{transform:rotate(360deg)}}' +
  '@media (prefers-reduced-motion:reduce){wi-icon.wi-icon-spin>svg{animation-duration:3s}}';

/**
 * An icon as inline SVG: `<wi-icon name="check">`, `<wi-icon name="trash" weight="bold" [size]="20">`. Names are the
 * same as the `wi wi-<name>` classes, aliases included (`xmark`, `pi-times`). Without `label` the icon is hidden from
 * screen readers (decorative); with it, it is announced as an image. Colour follows the text (currentColor).
 */
@Component({
  selector: 'wi-icon',
  standalone: true,
  template: '',
  styles: [CSS],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.wi-icon-spin]': 'spin',
    '[style.width]': 'cssSize',
    '[style.height]': 'cssSize',
    '[style.color]': 'color || null',
    '[attr.role]': "label ? 'img' : null",
    '[attr.aria-label]': 'label || null',
    '[attr.aria-hidden]': "label ? null : 'true'",
    '[attr.data-icon]': 'resolved',
  },
})
export class WiIcon implements OnChanges, OnDestroy {
  /** Icon name or alias. */
  @Input() name: string | null | undefined;
  /** thin, light, regular (default), bold or fill. */
  @Input() weight: WiraIconWeight | null | undefined;
  /** A number (px) or any CSS length. Default 1em: the size of the text around it. */
  @Input() size: number | string | null | undefined;
  @Input() color: string | null | undefined;
  /** Accessible name; leave empty for a decorative icon. */
  @Input() label: string | null | undefined;
  /** Turn round and round (a loading spinner). */
  @Input() set spin(v: unknown) {
    this._spin = v !== false && v !== null && v !== undefined && v !== 'false';
  }
  get spin(): boolean {
    return this._spin;
  }

  resolved: string | null = null;
  private _spin = false;
  private seq = 0;
  private destroyed = false;
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly renderer = inject(Renderer2);
  private readonly defaults = inject(WIRA_ICON_OPTIONS, { optional: true }) || {};

  get cssSize(): string | null {
    const s = this.size ?? this.defaults.size;
    if (s === null || s === undefined || s === '') return null;
    return typeof s === 'number' || /^\d+(\.\d+)?$/.test(String(s)) ? `${s}px` : String(s);
  }

  ngOnChanges(): void {
    const name = wiraIconName(this.name);
    this.resolved = name;
    const seq = ++this.seq;
    if (!name) {
      this.renderer.setProperty(this.host, 'innerHTML', '');
      if (this.name) console.warn(`wiraicon: no icon named "${this.name}".`);
      return;
    }
    const asked = this.weight || this.defaults.weight || 'regular';
    const weight = wiraIconWeight(name, WIRAICON_WEIGHTS.includes(asked) ? asked : 'regular');
    drawings(weight).then(
      (all) => {
        if (seq !== this.seq || this.destroyed) return;
        const body = all[name] || '';
        this.renderer.setProperty(
          this.host,
          'innerHTML',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" focusable="false" aria-hidden="true">${body}</svg>`,
        );
      },
      (err) => console.warn(`wiraicon: could not load the ${weight} icons.`, err),
    );
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }
}

/** For NgModule apps. Standalone apps import `WiIcon` directly. */
@NgModule({
  imports: [WiIcon],
  exports: [WiIcon],
})
export class WiIconModule {}
