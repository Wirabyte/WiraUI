# Dock

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-dock>` · `WuDockModule` / `WuDock` from `@wirabyte/ui/dock` · all majors

Launcher icons along an edge of their box: macOS-style dock (icons swell under the pointer, bounce on click, dot under running apps) or Windows-style taskbar (full width, centred icons, `start` / `end` slots). For building desktop-like UIs in the browser; not an app navbar.

```html
<div class="desk">   <!-- must be a positioned box: the dock sits absolutely on its nearest positioned ancestor -->
  <wu-dock [model]="apps" [position]="position"></wu-dock>
</div>
```
```ts
apps: MenuItem[] = [{ label: 'ไฟล์', icon: 'wi wi-folder' }, { label: 'อีเมล', icon: 'wi wi-envelope', badge: '3' }, { separator: true }, { label: 'ถังขยะ', icon: 'wi wi-trash' }];
position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
```

**Inputs**
- `model`: `MenuItem[]` — icons: `label`, `icon` / `image`, `command`, `url`, `routerLink`, `badge`, `disabled`, `active` (dot under a running app), `current` (long bar for the window in front, windows look), `separator`
- `position`: `'bottom' | 'top' | 'left' | 'right'` = `'bottom'` — edge it sits on
- `look`: `'mac' | 'windows'` = `'mac'` — dock or taskbar
- `magnify`, `magnification`: `boolean`, `number` = `true`, `1.8` — swell under the pointer (mac) and max scale
- `size`: `number` = `48` (windows `40`) — icon size px
- `ariaLabel`, `ariaLabelledBy`: `string` — name of the bar
- `styleClass`, `style`: `string`, `object`

**Outputs** — `(onItemClick)`: `WuDockItemClickEvent` (`{ originalEvent, item }`); `(onFocus)`, `(onBlur)`: `FocusEvent`.

**Slots** — `item` (`$implicit`: MenuItem, `index`; draw an icon yourself), `start` / `end` (before the icons / at the end: start button, tray, clock).
(v3 form `<ng-template #item let-item>` per the slot rule.) 
**Tokens** — `--wu-dock-gap`, `-padding`, `-edge`, `-radius` (mac shelf); `-bg`, `-border`, `-shadow` (frosted shelf); `-item-radius`, `-icon-color`, `-separator`, `-dot`; `-tip-bg`, `-tip-color` (name over an icon); `-taskbar-height`, `-taskbar-bg`, `-taskbar-border`, `-taskbar-hover`, `-taskbar-indicator`, `-taskbar-tip-bg`, `-taskbar-tip-color` (windows).

**Gotchas**
- Position is absolute inside the nearest positioned box: give the container `position: relative` and a height.
- Old `<p-dock>` becomes `<wu-dock>` as-is (`[model]`, `position`, `pTemplate="item"`).

---
