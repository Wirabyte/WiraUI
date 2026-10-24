import type { Observable } from 'rxjs';

/** `'warning'` is the older spelling of `'warn'`; both work so migrated templates keep compiling. */
export type WtButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'help' | 'contrast';
export type WtButtonVariant = 'solid' | 'outlined' | 'text';
/** `sm` / `lg` are short for `small` / `large`. */
export type WtButtonSize = 'small' | 'large' | 'sm' | 'lg';
/** Work the button waits for: it shows a spinner and blocks repeat clicks until this settles. */
export type WtButtonAction = () => Promise<unknown> | Observable<unknown> | unknown;
