# Tabs

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-tabs` · `WuTabsModule` / `WuTabs`, `WuTabPanel`, `WuTabList`, `WuTab`, `WuTabPanels` from `@wirabyte/ui/tabs`
Also accepted: `wu-tabView`, `wu-tabview`; `wu-tabPanel`, `wu-tabpanel` (= `wu-tab-panel`).

Content tabs with arrow-key selection; the tab row scrolls sideways (edge arrows) when it overflows. Three forms:

- **Tag/index form (older, PrimeNG `p-tabView` style):** `<wu-tab-panel header="…">` children, `[(activeIndex)]`.
- **Value form (newer; "used a lot by newer apps"; v1, v2, v3):** `wu-tablist` + `wu-tab value` and `wu-tabpanels` + `wu-tabpanel value`, `[(value)]`.
- **Model form:** `[model]` of `MenuItem[]` draws a row of link-tabs with no panels (same component as `wu-tabmenu`); you render the picked view yourself.

**Prefer the value form in new code**; use the model form for routed pages.

```html
<!-- index form -->
<wu-tabs [(activeIndex)]="tab" ariaLabel="ข้อมูลลูกค้า" (onChange)="changed = $event.index">
  <wu-tab-panel header="ภาพรวม" leftIcon="wi wi-user">…</wu-tab-panel>
  <wu-tab-panel header="บันทึก" [disabled]="true">…</wu-tab-panel>
</wu-tabs>

<!-- value form -->
<wu-tabs [(value)]="section" ariaLabel="ข้อมูลนักเรียน">
  <wu-tablist>
    <wu-tab value="info">ข้อมูลทั่วไป</wu-tab>
    <wu-tab value="health" [disabled]="true">สุขภาพ</wu-tab>
  </wu-tablist>
  <wu-tabpanels>
    <wu-tabpanel value="info">ห้อง ม.1/2 · เลขที่ 15</wu-tabpanel>
    <wu-tabpanel value="health">…</wu-tabpanel>
  </wu-tabpanels>
</wu-tabs>

<!-- model form -->
<wu-tabs [model]="pages" [(activeItem)]="page" ariaLabel="ข้อมูลนักเรียน"></wu-tabs>
```
```ts
import { MenuItem } from '@wirabyte/ui/api';
pages: MenuItem[] = [{ label: 'ข้อมูลทั่วไป', icon: 'wi wi-id-card' }, { label: 'ผลการเรียน', badge: '2' }];
page?: MenuItem | null = this.pages[0];
```

**Inputs — `wu-tabs`**
- `activeIndex`: `number` = `0` — index form; `[(activeIndex)]`
- `value`: `any` = `undefined` — value form (string, number or your own union); `[(value)]`; unset = first tab
- `model`: `MenuItem[]` — link tabs, no panels (items take `routerLink`, `url`, `command`, `icon`, `badge`, `disabled`)
- `activeItem`: `MenuItem | null` — with `model`: current tab (same object as in the model); `[(activeItem)]`; omitted, `routerLink` items follow the router
- `ariaLabel`: `string` — name of the tab row
- `scrollable`, `lazy`, `selectOnFocus`, `showNavigators`: `unknown` — accepted, no effect (edge arrows appear on their own)
- `styleClass`, `style` (object)

**Inputs — `wu-tab-panel`** — `header`: `string` (index form) · `leftIcon`: `string` · `disabled`: `boolean` = `false` · `value`: `any` (value form: the `wu-tab` value this panel belongs to)
**Inputs — value-form parts** — `wu-tablist` (row of tabs) · `wu-tab`: `value: any`, `disabled: boolean` (content = title) · `wu-tabpanels` (holds panels)

**Outputs** — `(activeIndexChange)`: `number` · `(valueChange)`: `any` · `(activeItemChange)`: `MenuItem` · `(onChange)`: `WuTabsChangeEvent` (user picked a tab: click or keyboard)

**Slots** — `#header` template inside `wu-tab-panel` draws the tab title (icon, unread count); `wuTemplate` / `pTemplate` also work.

**Types**
```ts
interface WuTabsChangeEvent { index: number; value?: string | number /* value form */; originalEvent: Event }
```

**Keyboard** — `Tab` to selected tab · `←` `→` select prev/next immediately · `Home` `End` · disabled tabs skipped (value form also `Enter`/`Space`).

**Tokens** — `--wu-tabs-tab-color`, `--wu-tabs-tab-active-color`, `--wu-tabs-tab-weight`, `--wu-tabs-tab-padding-x`, `--wu-tabs-tab-padding-y`, `--wu-tabs-border-width`, `--wu-tabs-panel-bg`, `--wu-tabs-panel-padding`, `--wu-border`

**Gotchas**
- Pick one form per `wu-tabs`; `activeIndex` and `value` are separate bindings.
- `wu-tabpanel` / `wu-tab-panel` / `wu-tabPanel` are one component; `header` is for the index form, `value` for the value form.
- Header template: v3 `#header`, v1/v2 `wuTemplate="header"`. Loops: v3 `@for … track`, v1 `*ngFor`.
- `scrollable` from PrimeNG templates is accepted but unnecessary.
- Model form has no panels; draw the view under the row yourself or use `<router-outlet>`.
