import type { Observable } from 'rxjs';

/** `'warning'` is the older spelling of `'warn'`; both work so migrated templates keep compiling. */
export type WuButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'help' | 'contrast';
export type WuButtonVariant = 'solid' | 'outlined' | 'text';
/** `sm` / `lg` are short for `small` / `large`. */
export type WuButtonSize = 'small' | 'large' | 'sm' | 'lg';
/** Work the button waits for: it shows a spinner and blocks repeat clicks until this settles. */
export type WuButtonAction = () => Promise<unknown> | Observable<unknown> | unknown;
