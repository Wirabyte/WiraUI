# Card

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-card` · `WuCardModule` / `WuCard` from `@wirabyte/ui/card`

Content box with `header` / `subheader` and slots for media, header actions and footer; outlined / elevated / glass variants; loading skeleton.

```html
<wu-card header="แผน Pro" subheader="รายเดือน" variant="elevated" [loading]="isPageLoading">
  <div wuCardHeader class="cover">฿290 / เดือน</div>
  <wu-button wuCardActions icon="wi wi-plus" [text]="true" [rounded]="true" ariaLabel="เพิ่ม"></wu-button>
  <p>5 โปรเจค · พื้นที่ 50 GB</p>
  <div wuCardFooter>
    <wu-button label="อัปเกรด" size="small"></wu-button>
  </div>
</wu-card>
```

**Inputs**
- `header`: `string` — title; `subheader`: `string` — secondary line
- `variant`: `WuCardVariant` = `'default'` — `outlined`: no shadow · `elevated`: shadow, no border · `glass`: frosted (**v3 only**; solid fallback without `backdrop-filter`)
- `loading`: `boolean` = `false` — skeleton lines instead of content, header stays
- `styleClass`, `style` (object) — on the card box

**Slots** — attributes on the element you place: `wuCardHeader` (top, e.g. an image), `wuCardActions` (right of the title), default content, `wuCardFooter` (row that wraps when narrow). Elements `<wu-header>` / `<wu-footer>` = `wuCardHeader` / `wuCardFooter`. Templates `header`, `title`, `subtitle`, `content`, `footer` (`#name`, `wuTemplate` or `pTemplate`) behave like the slots. Empty slots collapse.

**Types** — `type WuCardVariant = 'default' | 'outlined' | 'elevated' | 'glass';` (v1/v2: no `'glass'`)

**Tokens** — `--wu-card-bg`, `--wu-card-padding`, `--wu-card-radius`, `--wu-card-shadow`, `--wu-card-body-gap`, `--wu-card-border-width`, `--wu-card-title-size`, `--wu-card-title-weight`, `--wu-border`, `--wu-shadow-md`, `--wu-text-muted`, glass (v3): `--wu-glass-bg`, `--wu-glass-blur`, `--wu-glass-border`, `--wu-glass-shadow` · `overrides: components.card` e.g. `{ padding: '1rem', radius: '12px', bodyGap: '0', bordered: false }`

**Gotchas**
- Named template slots: v3 `<ng-template #header>`, v1/v2 `<ng-template wuTemplate="header">`.
- A single wrapper in the footer (`<div wuCardFooter class="flex justify-content-end gap-2">`) spans the card width so your alignment classes work; buttons placed directly in the footer keep their size.
- Full-bleed image: `<img wuCardHeader …>` and size it yourself (`display:block; width:100%; height:11.5rem; object-fit:cover`).
- `wu-header` / `wu-footer` elements are in `WuCardModule` (also used by Panel).
