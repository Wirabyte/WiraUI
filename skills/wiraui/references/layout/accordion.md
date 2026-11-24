# Accordion

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-accordion` · `WuAccordionModule` / `WuAccordion`, `WuAccordionTab`, `WuAccordionPanel`, `WuAccordionHeader`, `WuAccordionContent` from `@wirabyte/ui/accordion`
Also accepted: `wu-accordionTab` / `wu-accordiontab` (= `wu-accordion-tab`), `wu-accordionpanel`, `wu-accordionheader`, `wu-accordioncontent`.

Headers that open and close content, one at a time or several, with arrow-key navigation. Two forms, both in v1, v2 and v3:

- **Tag/index form (older, PrimeNG `p-accordionTab` style):** `<wu-accordion-tab header="…">`, open state by `[(activeIndex)]`.
- **Value form (newer):** `<wu-accordion-panel value="x">` + `<wu-accordion-header>` + `<wu-accordion-content>`, open state by `[(value)]`.

**Prefer the value form in new code** (state is bound to a value, not a position); keep the index form when editing or migrating templates already written that way. Don't mix both in one accordion.

```html
<!-- index form -->
<wu-accordion [(activeIndex)]="open">
  <wu-accordion-tab header="การจัดส่ง">จัดส่งภายใน 2 วันทำการ</wu-accordion-tab>
  <wu-accordion-tab header="การคืนสินค้า">คืนได้ภายใน 30 วัน</wu-accordion-tab>
</wu-accordion>

<!-- value form -->
<wu-accordion [(value)]="faq" (onOpen)="logPanel('open', $event.value)">
  <wu-accordion-panel value="apply">
    <wu-accordion-header>การสมัครเรียน</wu-accordion-header>
    <wu-accordion-content>สมัครออนไลน์ได้ถึง 31 มีนาคม</wu-accordion-content>
  </wu-accordion-panel>
  <wu-accordion-panel value="internal" [disabled]="true">
    <wu-accordion-header>เอกสารภายใน</wu-accordion-header>
    <wu-accordion-content>…</wu-accordion-content>
  </wu-accordion-panel>
</wu-accordion>
```
```ts
open: number | number[] | null = 0;   // index form (array with [multiple])
faq = 'apply';                        // value form (array with [multiple])
```

**Inputs — `wu-accordion`**
- `multiple`: `boolean` = `false` — several open at once
- `activeIndex`: `number | number[] | null` = `null` — open tab(s), array with `multiple`; `[(activeIndex)]`
- `value`: `any` = `undefined` — value form: open panel's value (array with `multiple`); `[(value)]`
- `gap`: `boolean | string | number` — `true` = 0.75rem and each panel becomes a separate card; text (`"1rem"`) or number (px) = that gap (also cards); `false` = one joined box; omitted = theme (`--wu-accordion-gap`). Works in both forms.
- `styleClass`, `style`

**Inputs — `wu-accordion-tab`** — `header`: `string` · `disabled`: `boolean` = `false` · `selected`: `boolean` = `false` (`[(selected)]`, open from outside)
**Inputs — value-form parts** — `wu-accordion-panel`: `value: any`, `disabled: boolean` · `wu-accordion-header` (content = title) · `wu-accordion-content` (collapsible content)

**Outputs** — `(activeIndexChange)`: `number | number[] | null` · `(valueChange)`: `any` · `(onOpen)` / `(onClose)`: `WuAccordionTabEvent` · on tab: `(selectedChange)`: `boolean`

**Slots** — inside `wu-accordion-tab`: `#header` (custom header, e.g. icon/badge) and `#content` (content built the first time the tab opens, for heavy/lazy content); `wuTemplate` / `pTemplate` also work.

**Types**
```ts
interface WuAccordionTabEvent { index: number; value?: unknown /* value form */ }
```

**Keyboard** — `Tab` to a header · `↑` `↓` prev/next header · `Home` `End` first/last · `Enter`/`Space` toggle.

**Tokens** — `--wu-accordion-gap`, `--wu-accordion-border-width`, `--wu-accordion-root-radius`, `--wu-accordion-bg`, `--wu-accordion-radius`, `--wu-accordion-header-bg`, `--wu-accordion-header-color`, `--wu-accordion-header-active-color`, `--wu-accordion-header-padding`, `--wu-accordion-header-weight`, `--wu-accordion-header-border-width`, `--wu-accordion-panel-border-width`, `--wu-accordion-content-bg`, `--wu-accordion-content-padding`, `--wu-accordion-content-border-width`, `--wu-accordion-icon-order` (-1 left / 1 right), `--wu-accordion-icon-open-rotate`

**Gotchas**
- Look differs by major: v1 boxed headers, chevron left; v2/v3 one bordered box with ruled rows, chevron right (v1 default gap 4px).
- `[(activeIndex)]` is position-based, `[(value)]` is value-based: bind the one matching the markup.
- `onOpen`/`onClose` payload has `index` (index form) or `value` (value form).
- Template slots: v3 `#header` / `#content`, v1/v2 `wuTemplate="header"`.
- `wu-accordionTab` (camelCase) is the same component, so a PrimeNG → WiraUI move is a prefix change.
