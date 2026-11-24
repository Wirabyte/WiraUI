# Descriptions

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: slot syntax per major.

`wu-descriptions` + `wu-descriptions-item` · `WuDescriptionsModule` (exports both) / `WuDescriptions`, `WuDescriptionsItem` from `@wirabyte/ui/descriptions`
Also accepted: `wu-descriptionsItem`

Label/value pairs in columns for detail pages (ticket, person, device). Values can be markup (tags, links, buttons). Renders a real `<dl>`. Folds to one column when its own box is narrow.

```html
<wu-descriptions title="ข้อมูลผู้แจ้ง" [items]="reporter"></wu-descriptions>

<wu-descriptions title="ข้อมูล Ticket" [columns]="2">
  <wu-descriptions-item label="เลขที่">HD-2569-0142</wu-descriptions-item>
  <wu-descriptions-item label="สถานะ"><wu-tag value="กำลังดำเนินการ" severity="warn"></wu-tag></wu-descriptions-item>
  <wu-descriptions-item label="รายละเอียด" [span]="2">เชื่อมต่อ Wi-Fi ชั้น 3 ไม่ได้ตั้งแต่เช้า</wu-descriptions-item>
</wu-descriptions>

<wu-descriptions layout="vertical" [columns]="3" [items]="device"></wu-descriptions>
<wu-descriptions [columns]="2" [bordered]="true" size="small" [items]="summary"></wu-descriptions>
```
```ts
import { WuDescriptionsEntry } from '@wirabyte/ui/descriptions';
reporter: WuDescriptionsEntry[] = [
  { label: 'ชื่อ', value: 'วิระ มีสุข' },
  { label: 'โทรศัพท์ภายใน', value: '2145' },
  { label: 'หมายเหตุ', value: 'รออะไหล่', span: 2 },
];
```

**Inputs — wu-descriptions**
- `title`: `string` — heading over the list
- `items`: `WuDescriptionsEntry[]` — data items (shown before any `wu-descriptions-item` inside)
- `columns`: `number` = `1` — columns on a wide enough box (one under 36rem)
- `layout`: `'horizontal' | 'vertical'` = `'horizontal'` — label beside / above the value
- `bordered`: `boolean` = `false` — table of cells, labels in a tinted cell
- `size`: `'small' | 'normal'` = `'normal'`
- `styleClass`, `style`

**Inputs — wu-descriptions-item** — `label`: `string` · `span`: `number` = `1` (at most `columns`) · content = the value (text, tag, link, button)

**Types**
```ts
interface WuDescriptionsEntry {
  label: string;
  value?: string | number | null;   // numbers get thousands separators; empty shows –
  span?: number;                    // columns taken, default 1
}
```

**Tokens** — `--wu-descriptions-gap`, `--wu-descriptions-label-width` (horizontal label), `--wu-descriptions-label-color`, `--wu-descriptions-label-weight`, `--wu-descriptions-bordered-label-bg`, `--wu-border`, `--wu-card-bg`, `--wu-radius-md`, `--wu-heading-font-family` (title)

**Gotchas**
- Pass numbers, codes and phone extensions as strings: number values are formatted with thousands separators.
- Responsive by its own box (container query), not the screen: under 36rem columns fold to one (spans ignored); under 22rem a horizontal label moves above its value.
- Bordered tables read best full: give the last item a `span` that fills its row.
- No slots/outputs; use `wu-descriptions-item` for markup values.
