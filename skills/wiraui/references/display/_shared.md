# Shared rules: display

All of these are display components: no `ngModel`. Every one accepts `styleClass` (string) and `style` (object, e.g. `{ width: '20rem' }`) on its outer element unless noted. Severity values: `'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'` (`WuSeverity`); Tag and Badge also accept `'warning'` (= warn) and `'error'` (= danger) (`WuSeverityInput`). Both types import from `@wirabyte/ui/config`.
