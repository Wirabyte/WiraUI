import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { WtButton } from 'wiratheme/button';
import { definePreset, palette, Siam, WtThemeService } from 'wiratheme/config';

@Component({
  selector: 'app-root',
  imports: [WtButton],
  templateUrl: './app.component.html',
})
export class App {
  readonly major = WIRATHEME_MAJOR;
  readonly ngVersion = VERSION.full;
  saved = 0;

  private readonly theme = inject(WtThemeService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly save = () =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        this.saved++;
        this.cdr.markForCheck();
        resolve();
      }, 600)
    );

  useBlue(): void {
    this.theme.setPrimary('#2563eb');
  }

  /** A whole theme from TypeScript; it replaces the SCSS/CSS theme values in the tokens layer. */
  useSiam(): void {
    this.theme.setPreset(definePreset(Siam, { semantic: { primary: palette('#e11d48') } }));
  }

  toggleDark(): void {
    this.theme.setDarkMode(!this.theme.isDarkMode());
  }
}
