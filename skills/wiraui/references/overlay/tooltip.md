# Tooltip

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`[wuTooltip]` · `WuTooltipModule` / `WuTooltip` from `@wirabyte/ui/tooltip`
Also accepted: `pTooltip` attribute.

A short hint on hover or focus; flips sides when there is no room and follows page scroll. Add `wuTooltip` to any element.

```html
<wu-button label="บน" wuTooltip="บันทึกแบบร่าง" tooltipPosition="top"></wu-button>
<input wuInputText wuTooltip="กรอกเลขบัตรประชาชน 13 หลัก" tooltipEvent="focus" />
<wu-button label="รายละเอียด" wuTooltip="<b>Pro</b><br><a href='https://example.com'>ดูราคา</a>" [escape]="false" [showDelay]="500"></wu-button>
```

**Inputs**
- `wuTooltip` · `pTooltip`: `string` - the text
- `tooltipPosition`: `'top' | 'bottom' | 'left' | 'right'` = `'right'`
- `tooltipEvent`: `'hover' | 'focus' | 'both'` = `'hover'` (hover includes keyboard focus)
- `showDelay` · `hideDelay` · `life`: `number` = `0` ms
- `escape`: `boolean` = `true` - `false` shows simple HTML: only b, i, strong, em, u, br, p, span, small, code, ul, ol, li and http/https/mailto links are kept
- `autoHide`: `boolean` = `false` - `true` hides the instant the pointer leaves the target; `false` lets the pointer move onto the tooltip and click links
- `tooltipDisabled`: `boolean` = `false`; `fitContent`: `boolean` = `false` (one line); `tooltipStyleClass`: `string`
- `positionTop` · `positionLeft`: `number` = `0` - extra offset px
- `tooltipOptions`: `WuTooltipOptions` - everything in one object
- Accepted, no effect: `appendTo`, `tooltipZIndex`, `positionStyle`

```ts
type WuTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type WuTooltipEvent = 'hover' | 'focus' | 'both';
```

**Tokens** - `--wu-tooltip-bg`, `--wu-tooltip-color`, `--wu-tooltip-radius`, `--wu-tooltip-padding`, `--wu-tooltip-max-width`, `--wu-tooltip-shadow`

**Gotchas**
- Default position is `right` (PrimeNG-style), not top.
- Icon-only buttons still need `ariaLabel`; a tooltip is not an accessible name.
