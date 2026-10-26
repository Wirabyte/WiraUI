import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { WtI18n } from './i18n.service';

/**
 * `{{ 'บันทึก' | t }}`, `{{ 'สวัสดี {name}' | t: { name: user.name } }}`, `[placeholder]="'ค้นหา' | t"`: the text in
 * the current language (WtI18n). Re-renders by itself when the language changes, OnPush components included.
 */
@Pipe({ name: 't', standalone: true, pure: false })
export class WtTranslatePipe implements PipeTransform, OnDestroy {
  private readonly i18n = inject(WtI18n);
  private readonly cdr = inject(ChangeDetectorRef);
  private version = 0;
  private lastKey: unknown = undefined;
  private lastParams: unknown = undefined;
  private lastVersion = -1;
  private lastValue = '';
  private readonly sub = this.i18n.changes.subscribe(() => {
    this.version++;
    this.cdr.markForCheck();
  });

  transform(key: string | null | undefined, params?: Record<string, unknown> | null): string {
    if (key === null || key === undefined || key === '') return '';
    if (key === this.lastKey && params === this.lastParams && this.version === this.lastVersion) return this.lastValue;
    this.lastKey = key;
    this.lastParams = params;
    this.lastVersion = this.version;
    this.lastValue = this.i18n.t(key, params);
    return this.lastValue;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

/** The same pipe under a longer name: `{{ 'บันทึก' | wtTranslate }}`. */
@Pipe({ name: 'wtTranslate', standalone: true, pure: false })
export class WtTranslateLongPipe extends WtTranslatePipe {}
