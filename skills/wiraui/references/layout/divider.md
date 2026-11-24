# Divider

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-divider` · `WuDividerModule` / `WuDivider` from `@wirabyte/ui/divider`

Horizontal or vertical separator, optionally with content on the line.

```html
<wu-divider></wu-divider>
<wu-divider align="left"><b>ข้อมูลบัญชี</b></wu-divider>
<wu-divider type="dashed"></wu-divider>
<div class="flex"><span>ซ้าย</span><wu-divider layout="vertical"></wu-divider><span>ขวา</span></div>
```

**Inputs** — `layout`: `'horizontal' | 'vertical'` = `'horizontal'` · `type`: `'solid' | 'dashed' | 'dotted'` = `'solid'` · `align`: `'left' | 'center' | 'right' | 'top' | 'bottom'` — where content sits on the line · `styleClass`, `style`
**Tokens** — `--wu-divider-color`, `--wu-divider-margin`, `--wu-divider-padding` (vertical), `--wu-divider-content-padding`, `--wu-divider-content-padding-y`, `--wu-divider-content-radius`, `--wu-card-bg` (content background), `--wu-text-muted`

**Gotchas** — vertical dividers go inside a flex row; content sits on its own rounded background.
