import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ɵassertSupportedAngular, ɵrefreshOnTranslation, ɵWT_SKIP_VERSION_CHECK, WtConfig } from 'wiratheme/config';
import { LANGUAGE_NAMES, WtLocale } from 'wiratheme/core';
import { WtI18n } from './i18n.service';

/** One choice of the switch. */
export interface WtLanguageOption {
  code: string;
  /** What the switch shows: the code (`TH`) or the language's own name (`ไทย`). */
  label: string;
  /** The language's own name, for the tooltip and screen readers. */
  name: string;
}

/**
 * Lets the user change the app's language (WtI18n): `<wt-language-switch>`. `variant="buttons"` (default) is a
 * segmented TH | EN control; `variant="select"` a drop-down for many languages. The choice is remembered.
 */
@Component({
  selector: 'wt-language-switch, wt-languageSwitch',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './language-switch.component.html',
  styleUrls: ['./i18n.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WtLanguageSwitch implements OnDestroy {
  /** `'buttons'` (default): a segmented control; `'select'`: a drop-down. */
  @Input() variant: 'buttons' | 'select' = 'buttons';
  /** Show the code (`'code'`, default for buttons: TH, EN) or the language's own name (`'name'`, default for select). */
  @Input() display: 'code' | 'name' | null | undefined;
  /** Own labels per code, e.g. `{ th: 'ไทย', en: 'Eng' }`. */
  @Input() labels: Record<string, string> | null | undefined;
  /** The languages to offer (default: all the app set in provideWtI18n). */
  @Input() languages: string[] | null | undefined;
  @Input() size: 'small' | 'large' | null | undefined;
  /** Label of the control (default: the locale's `language`). */
  @Input() ariaLabel?: string | null;
  @Input() styleClass?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() style?: Record<string, any> | string | null;
  /** The user picked a language (after it is in use). */
  @Output() readonly onChange = new EventEmitter<string>();

  readonly i18n = inject(WtI18n);
  private readonly config = inject(WtConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly i18nSub = ɵrefreshOnTranslation();
  private readonly languageSub = this.i18n.languageChange.subscribe(() => this.cdr.markForCheck());

  constructor() {
    ɵassertSupportedAngular(inject(ɵWT_SKIP_VERSION_CHECK, { optional: true }));
  }

  ngOnDestroy(): void {
    this.i18nSub.unsubscribe();
    this.languageSub.unsubscribe();
  }

  get t(): WtLocale {
    return this.config.translation;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get rootStyle(): Record<string, any> | null {
    return this.style && typeof this.style === 'object' ? this.style : null;
  }
  get current(): string {
    return this.i18n.language;
  }
  get options(): WtLanguageOption[] {
    const offered = this.i18n.languages;
    const codes = this.languages?.length ? this.languages.filter((c) => offered.includes(c)) : offered;
    const display = this.display || (this.variant === 'select' ? 'name' : 'code');
    return codes.map((code) => {
      const name = LANGUAGE_NAMES[code.toLowerCase().split(/[-_]/)[0]] || code;
      const own = this.labels?.[code];
      return { code, name, label: own || (display === 'name' ? name : code.toUpperCase()) };
    });
  }
  get rootClass(): string {
    const size = this.size === 'small' ? ' wt-languageswitch-sm' : this.size === 'large' ? ' wt-languageswitch-lg' : '';
    return `wt-languageswitch wt-languageswitch-${this.variant === 'select' ? 'select' : 'buttons'}${size}${this.styleClass ? ' ' + this.styleClass : ''}`;
  }
  trackCode(_: number, o: WtLanguageOption): string {
    return o.code;
  }

  pick(code: string): void {
    if (code === this.current) return;
    void this.i18n.use(code).then((lang) => {
      this.cdr.markForCheck();
      this.onChange.emit(lang);
    });
  }

  selectChange(event: Event): void {
    this.pick((event.target as HTMLSelectElement).value);
  }
}
