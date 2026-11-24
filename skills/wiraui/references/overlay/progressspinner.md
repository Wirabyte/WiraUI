# ProgressSpinner

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-progress-spinner` · `WuProgressSpinnerModule` / `WuProgressSpinner` from `@wirabyte/ui/progressspinner`
Also accepted: `wu-progressSpinner`, `wu-progressspinner` tags.

Spinning ring for loading; sets size, one or several colours, and text under or beside the ring (centred for you).

```html
<wu-progress-spinner ariaLabel="กำลังโหลด"></wu-progress-spinner>
<wu-progress-spinner size="2rem" strokeWidth="6"></wu-progress-spinner>
<wu-progress-spinner [multicolor]="true" size="3rem" ariaLabel="กำลังโหลด"></wu-progress-spinner>
<wu-progress-spinner [colors]="['#e8668e', '#3b6fd8', '#ff9a2e']" size="3rem" strokeWidth="4" ariaLabel="กำลังโหลด"></wu-progress-spinner>
<!-- loading block: ring + text centred in its own space (give it a height) -->
<wu-progress-spinner size="2.5rem" label="กำลังโหลดข้อมูล…" class="loading-card"></wu-progress-spinner>
<wu-progress-spinner size="1.25rem" label="กำลังซิงก์" labelPosition="right"></wu-progress-spinner>
```

**Inputs**
- `size`: `string | number` = token - e.g. `'3rem'` (number = px); size lives on the host, so `style="width: 3rem; height: 3rem"` works too
- `strokeWidth`: `string` = `'2'`; `fill`: `string` = `'none'`; `animationDuration`: `string` = `'2s'` (one turn)
- `multicolor`: `boolean` = preset - `true` cycles theme colours (primary → info → success → warn), `false` primary only; omitted = the preset decides
- `colors`: `string[]` - own colours, up to four (fewer repeat)
- `label`: `string` - text under (or beside) the ring; also the accessible name
- `labelPosition`: `'bottom' | 'right'` = `'bottom'`
- `ariaLabel`: `string` = `label` · locale ("loading"); `styleClass` · `style`

**Slots** - `label`: own content instead of the text (v3 `<ng-template #label>`, v1/v2 `wuTemplate="label"`); always set `ariaLabel` when using it.

**Tokens** - `--wu-spinner-size`, `--wu-spinner-color-1` … `--wu-spinner-color-4`, `--wu-spinner-label-gap`, `--wu-spinner-label-color`, `--wu-spinner-label-size`

**Gotchas**
- Always set `ariaLabel` (or `label`) so screen readers announce it.
- The `label` text doubles as the progressbar's accessible name unless `ariaLabel` is set.
- Centring requires the host to have a height (e.g. a `.loading-card` with `height: 12rem`).
