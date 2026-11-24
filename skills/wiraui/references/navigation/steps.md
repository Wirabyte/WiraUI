# Steps

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`<wu-steps>` · `WuStepsModule` / `WuSteps` from `@wirabyte/ui/steps`

Process steps as numbers along a line; passed steps take the primary colour. A progress display by default (`readonly`), or make steps pickable. Steps with their own content (multi-step form) belong in Stepper (`wu-stepper`, [layout/stepper.md](../layout/stepper.md)); `<wu-stepper [model]="steps" [(activeIndex)]="activeIndex" [readonly]="true">` draws the same bar from the same `MenuItem` items.

```html
<wu-steps [model]="steps" [activeIndex]="activeIndex"></wu-steps>
```
```ts
steps: MenuItem[] = [{ label: 'กรอกข้อมูล' }, { label: 'อัปโหลดเอกสาร' }, { label: 'ยืนยัน' }];
activeIndex = 1;   // 0-based
```
Pickable: `<wu-steps [model]="admission" [(activeIndex)]="current" [readonly]="false"></wu-steps>`; also `labelPosition="right"`, `orientation="vertical"`.

**Inputs**
- `model`: `MenuItem[]` = `[]`
- `activeIndex`: `number` = `0` — current step (0-based); `[(activeIndex)]` works
- `readonly`: `boolean` = `true` — display only; `false` = pick by click or keyboard (runs `command`, follows `routerLink` / `url`)
- `labelPosition`: `'bottom' | 'right'` = `'bottom'` — label (+ `subtitle`) under or beside the number; `right` shows only the current label below 576px (others still read by screen readers)
- `orientation`: `'horizontal' | 'vertical'` = `'horizontal'` — vertical puts labels beside numbers; `↑ ↓` also work
- `styleClass`, `style`: `string`, `object`
- `id`: `string` — prefixes step ids
- `exact`: `unknown` — accepted, no effect

**Outputs** — `(activeIndexChange)`: `number` — user picked another step (only when `readonly` is false).

**MenuItem fields it reads** — `label`, `subtitle` (smaller line under the label), `command` (`MenuItemCommandEvent`, `index` = step index), `routerLink queryParams fragment replaceUrl state`, `url`, `disabled` (cannot be picked, keyboard skips) `visible`, `styleClass style title`.

**Tokens** — `--wu-steps-number-size`, `-number-border-width`, `-number-bg`, `-number-color`, `-line-width`, `-line-color`, `-gap`, `-vertical-gap`, `-label-color`, `-label-weight`, `-label-active-color`; also `--wu-primary-color` (current + passed steps and the line up to them), `--wu-primary-contrast` (current step's number).

**Gotchas**
- Back / Next buttons are yours; they only change `activeIndex`. `readonly` defaults to `true`, so a click does nothing until you set `[readonly]="false"`.
- Keyboard (pickable only): one Tab stop, `← →` (`↑ ↓` vertical), `Home`/`End`, `Enter`/`Space`. A read-only row has no Tab stop.
- Default label position differs: wu-steps puts the label under the number, wu-stepper beside it.
- Migration from `<p-steps>`: rename; `model activeIndex readonly styleClass` work as before; `p-steps-*` classes sit next to `wu-steps-*`.

---
