# Button

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-button` and `button[wuButton]` / `a[wuButton]` · `WuButtonModule` / `WuButton` (component) + `WuButtonDirective` from `@wirabyte/ui/button`
Also accepted: directive selector `pButton`; `severity="warning"` (= `warn`); `p-button-*` classes in `styleClass` / `class` (`p-button-sm`, `-lg`, `-outlined`, `-text`, `-rounded`, `-danger` …) are mapped to size/style/colour.

The one button for everything. Use `[action]` for async work: the button shows a spinner and ignores repeat clicks until the Promise/Observable settles. Use the directive to style an existing `<button>` / `<a>`.

```html
<wu-button label="บันทึก" icon="wi wi-save" (onClick)="save()"></wu-button>
<wu-button label="ส่งข้อมูล" icon="wi wi-send" [action]="save"></wu-button>
<button wuButton type="button" label="บันทึก" icon="wi wi-save" (click)="save()"></button>
<a wuButton href="/orders" label="ดูคำสั่งซื้อ" severity="secondary" [text]="true"></a>
```
```ts
// [action] takes the function itself: bind once so `this` stays the component
save = this.saveProfile.bind(this);
saveProfile(): Observable<unknown> { return this.profileService.save(this.profile); }
```

**Inputs (wu-button)**
- `label`: `string` — text
- `icon`: `string` — icon class (`wi wi-check`, `fa-solid fa-floppy-disk`); `iconPos`: `'left' | 'right'` = `'left'`
- `severity`: `WuButtonSeverity` = `'primary'`; `variant`: `'solid' | 'outlined' | 'text'` = `'solid'`
- `outlined` / `text` / `raised` / `rounded` / `link` / `fluid` / `loading` / `disabled`: `boolean` = `false` (`outlined` = `variant="outlined"`, `text` = `variant="text"`, `raised` adds a shadow, `rounded` fully rounded, `link` link-looking, `fluid` full width, `loading` spinner + blocks clicks)
- `size`: `'small' | 'large' | 'sm' | 'lg'` — default height 33px at 14px UI size, follows UI size
- `styleClass`: `string`; `style`: `object` (e.g. `{ minWidth: '8rem' }`) — on the button
- `badge`: `string | number` — count/text at the end (icon-only buttons wear it on the top corner); `badgeSeverity`: `WuSeverityInput`
- `action`: `WuButtonAction` — function returning Promise or Observable; loading until it settles
- `type`: `'button' | 'submit' | 'reset'` = `'button'`
- `ariaLabel`: `string` — required for icon-only buttons

**Outputs** — `(onClick)`: `MouseEvent` — click (not emitted while loading)

**Directive `wuButton`** (on `<button>` / `<a>`; clicks are plain `(click)`): `label`, `icon`, `iconPos`, `severity`, `variant`, `size`, `outlined`, `text`, `raised`, `rounded`, `loading` (boolean, default false), `badge`. The attribute your old template used is read the same.

**Types**
```ts
type WuButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'warning' | 'danger' | 'help' | 'contrast';
type WuButtonVariant = 'solid' | 'outlined' | 'text';
type WuButtonSize = 'small' | 'large' | 'sm' | 'lg';
type WuButtonAction = () => Promise<unknown> | Observable<unknown> | unknown;
```

**Tokens** — `--wu-button-padding-x`, `--wu-button-padding-y`, `--wu-button-radius`, `--wu-button-font-weight`, `--wu-control-line-height`, `--wu-button-gap`, `--wu-button-text-transform`, `--wu-primary-color`, `--wu-primary-hover`, `--wu-primary-active`, `--wu-primary-contrast`, `--wu-button-secondary-bg`, `--wu-button-secondary-color`, `--wu-danger-color` (success/info/warn/help alike), `--wu-control-focus-shadow`, `--wu-shadow-md`, `--wu-radius-full`, `--wu-disabled-opacity`, `--wu-transition` · `overrides: components.button` e.g. `{ fontWeight: 600, radius: '999px', paddingX: '1.25rem' }`

**Gotchas**
- `[action]` receives the function, not a call: `[action]="save"`, with `save = this.doSave.bind(this)` (otherwise `this` is lost). Don't hand-write `isSaving` flags for this.
- The manual way still works: `[loading]="isApiSaving"` or `[disabled]`; no `(onClick)` is emitted while loading.
- Icon-only button without `ariaLabel` is an a11y bug.
- `action` is documented for `wu-button` only, not for the `wuButton` directive.
