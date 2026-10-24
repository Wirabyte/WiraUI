import { ChangeDetectorRef, Component, inject, VERSION } from '@angular/core';
import { WIRATHEME_MAJOR } from 'wiratheme';
import { WtThemeService } from 'wiratheme/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})
export class AppComponent {
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

  toggleDark(): void {
    this.theme.setDarkMode(!this.theme.isDarkMode());
  }
}
