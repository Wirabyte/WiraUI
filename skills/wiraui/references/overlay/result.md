# Result

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-result` · `WuResultModule` / `WuResult` from `@wirabyte/ui/result`

Page or box that tells how a task ended (success, error, info, warning) or stands in for a page that cannot open (403, 404, 500), with actions and a details box. Default text follows the app's language.

```html
<wu-result status="success" title="ส่งใบสมัครเรียบร้อยแล้ว"
  subtitle="เลขที่ใบสมัคร 69-000123 ระบบส่งอีเมลยืนยันไปที่ wira@example.com แล้ว">
  <wu-button wuResultExtra label="ดูใบสมัคร"></wu-button>
  <wu-button wuResultExtra label="กลับหน้าแรก" severity="secondary" [outlined]="true"></wu-button>
</wu-result>

<wu-result status="error" title="ชำระเงินไม่สำเร็จ" subtitle="บัตรถูกปฏิเสธโดยธนาคาร">
  <wu-button wuResultExtra label="ลองอีกครั้ง"></wu-button>
  <p>ยอดที่ต้องชำระ 3,500.00 บาท</p>   <!-- no wuResultExtra → details box -->
</wu-result>
<wu-result status="404"><wu-button wuResultExtra label="กลับหน้าแรก"></wu-button></wu-result>
```

**Inputs**
- `status`: `'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'` = `'info'` - `[status]="404"` as a number works too; 403/404/500 draw the code with a picture for the 0 (lock, compass, bolt)
- `title` · `subtitle`: `string` = locale - `''` hides it
- `icon`: `string` - icon class in the status circle instead of the mark
- `showIcon`: `boolean` = `true` - `false` keeps only text
- `styleClass` · `style`

**Slots** - `[wuResultExtra]` elements line up as a button row under the text; anything else goes in a soft details box (none, no box). No named templates.

**Tokens** - `--wu-result-padding`, `-gap`; `-icon-box` (colours from `--wu-success-color` / `-bg` etc.); `-art-width`, `-code-color`; `-art-accent`, `-art-soft`, `-art-paper`; `-title-color`, `-title-size`, `-title-weight`; `-description-color`; `-actions-gap`; `-content-bg`, `-content-radius`, `-content-padding` (all prefixed `--wu-result`)

**Gotchas**
- Buttons must carry the `wuResultExtra` attribute to land in the action row; without it they go in the details box.
