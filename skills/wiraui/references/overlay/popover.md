# Popover

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-popover` · `WuPopoverModule` / `WuPopover` from `@wirabyte/ui/popover`
Also accepted: `wu-overlaypanel` (older selector).

A small panel that opens under its button with an arrow, flips above when there is no room below, closes on outside click or Esc.

```html
<wu-button label="แชร์" icon="wi wi-send" (onClick)="op.toggle($event)"></wu-button>
<wu-popover #op>
  <p>ส่งลิงก์ให้ทีม</p>
  <input wuInputText value="https://example.com/r/10234" [readonly]="true" [fluid]="true" />
</wu-popover>
<!-- content template: <ng-template #content let-closeCallback="closeCallback"> … (click)="closeCallback()" -->
```

**Inputs**
- `dismissable`: `boolean` = `true` - outside click closes
- `showCloseIcon`: `boolean` = `false` - × in the corner; `ariaCloseLabel`: `string`
- `focusOnShow`: `boolean` = `true`
- `style` · `styleClass`
- Accepted, no effect: `appendTo`, `baseZIndex`, `autoZIndex`, `showTransitionOptions`, `hideTransitionOptions`

**Outputs** - `(onShow)` · `(onHide)`: void

**Methods** - `toggle(event?, target?)` opens under `target` (default: the event's element) or closes if open · `show(event?, target?)` · `hide()` · `align()` re-places it after the content changes size.

**Slots** - `content` (`#content` / `wuTemplate` / `pTemplate`), context `let-closeCallback="closeCallback"` (a function that closes the panel).

**Tokens** - `--wu-popover-padding`, `--wu-popover-arrow-size`, `--wu-overlay-bg`, `--wu-border`, `--wu-radius-md`, `--wu-shadow-md`

**Gotchas**
- `toggle(event?, target?)` anchors to the event's element unless `target` is given, so pass `$event`.
