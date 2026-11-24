# EmptyState

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-empty-state` · `WuEmptyStateModule` / `WuEmptyState` from `@wirabyte/ui/emptystate`
Also accepted: `wu-emptyState`, `wu-empty` tags.

What a list, table or page shows when it is empty: a themed drawing, title, a line, and action buttons. Six kinds with default text in the app's language.

```html
<wu-empty-state></wu-empty-state>
<wu-empty-state type="search"><wu-button label="ล้างตัวกรอง" severity="secondary" [text]="true"></wu-button></wu-empty-state>
<wu-empty-state title="ยังไม่มีนักเรียนในห้องนี้" description="เพิ่มนักเรียนทีละคน">
  <wu-button label="เพิ่มนักเรียน" icon="wi wi-plus"></wu-button>
</wu-empty-state>
<wu-empty-state icon="wi wi-bell" title="ยังไม่มีการแจ้งเตือน" description=""></wu-empty-state>

<!-- in a table's empty row: <wu-table> … <ng-template #emptymessage><tr><td colspan="3"><wu-empty-state size="small" title="ยังไม่มีนักเรียนในห้องนี้"></wu-empty-state></td></tr></ng-template></wu-table> -->
```

**Inputs**
- `type`: `'nodata' | 'search' | 'inbox' | 'folder' | 'error' | 'offline'` = `'nodata'` - drawing and default text (search = nothing found, inbox = nothing new, folder = no files yet, error = failed load, offline = no connection)
- `title` · `description`: `string` = locale - `''` hides it
- `icon`: `string` - icon class in a soft circle instead of the drawing
- `image` · `imageAlt`: `string` - your own picture instead of the drawing
- `showImage`: `boolean` = `true` - `false` keeps only text
- `size`: `'small' | 'normal' | 'large'` = `'normal'` - in a table / normal / whole page
- `styleClass` · `style`

**Slots** - content inside the tag lines up as a row of actions under the text (wraps on narrow screens). No named templates.

**Tokens** - `--wu-empty-state-padding`, `-sm-padding`, `-lg-padding`, `-gap`; `-art-width`, `-art-sm-width`, `-art-lg-width`; `-art-bg`, `-art-paper`, `-art-line`, `-art-accent`, `-art-soft`, `-art-danger`; `-icon-box`, `-icon-size`, `-icon-bg`, `-icon-color`; `-title-color`, `-title-size`, `-title-weight`; `-description-color`, `-description-size`; `-actions-gap` (all prefixed `--wu-empty-state`)

**Gotchas**
- The bare tag already gives drawing + localized text; only set `title`/`description` to override.
- Inside `wu-table`, use `size="small"` and the table's `emptymessage` template (v3 `#emptymessage`, v1/v2 `wuTemplate="emptymessage"`).
