# SplitButton

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-splitbutton` · `WuSplitButtonModule` / `WuSplitButton` from `@wirabyte/ui/splitbutton`
Also accepted: `wu-splitButton`, `wu-split-button` (and `p-splitButton` → rename the tag; inputs/events keep names).

A main action plus an arrow opening a menu of other actions (Save / Save as draft). Looks and colours like `wu-button`; the menu is the `wu-menu` popup.

```html
<wu-splitButton label="บันทึก" icon="wi wi-save" [model]="saveActions" [disabled]="isApiSaving" (onClick)="save()"></wu-splitButton>
```
```ts
import { WuMenuItem } from '@wirabyte/ui/menu';
saveActions: WuMenuItem[] = [
  { label: 'บันทึกเป็นร่าง', icon: 'wi wi-file', command: (event) => this.run(event) },
  { separator: true },
  { label: 'ลบเอกสาร', icon: 'wi wi-trash', command: (event) => this.run(event) },
];
run(event: { item?: WuMenuItem }): void { /* event.item?.label */ }
```

**Inputs**
- `label`, `icon`: `string` — main part; `iconPos`: `'left' | 'right'` = `'left'`
- `model`: `WuMenuItem[]` — menu items as in wu-menu (`label`, `icon`, `command`, `routerLink`, `separator`, `disabled`)
- `severity`: `'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'` — none = primary
- `outlined`, `text`, `raised`, `rounded`: `boolean` = `false`; `size`: `'small' | 'large'`
- `disabled`: `boolean` = `false` (whole); `buttonDisabled`, `menuButtonDisabled`: `boolean` = `false` (only main part / only arrow; the menu still opens with `buttonDisabled`)
- `dropdownIcon`: `string` — icon class instead of the arrow
- `menuStyleClass`: `string`, `menuStyle`: `object`
- `ariaLabel`, `expandAriaLabel`: `string` — main part / arrow (arrow default from locale)
- `styleClass`, `style` (object)
- `appendTo`, `tooltip`, `tooltipOptions`, `autoZIndex`, `baseZIndex` — accepted, no effect

**Outputs** — `(onClick)`: `MouseEvent` main part · `(onDropdownClick)`: `MouseEvent` arrow · `(onMenuShow)` / `(onMenuHide)`: `void`

**Keyboard** — `Alt` + `↓` opens the menu, `Esc` closes and returns focus.

**Tokens** — none of its own (uses Button tokens for the buttons, Menu tokens for the menu).

**Gotchas**
- `WuMenuItem` comes from `@wirabyte/ui/menu` (type only needed in your TS).
- Menu opens in the top layer, so `appendTo` is not needed.
