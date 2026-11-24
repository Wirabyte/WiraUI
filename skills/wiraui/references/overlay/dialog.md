# Dialog

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-dialog` · `WuDialogModule` / `WuDialog, WuDialogFooter, WuTemplate` from `@wirabyte/ui/dialog`

A dialog built on the browser's native `<dialog>`, in the top layer. Focus stays inside and returns to the opener on close; page scroll is locked while open. `WuDialogModule` also brings `WuTemplate` and `wu-footer`.

```html
<wu-button label="แก้ไขโปรไฟล์" icon="wi wi-user" (onClick)="visible = true"></wu-button>

<wu-dialog header="แก้ไขโปรไฟล์" [(visible)]="visible" [style]="{ width: '28rem' }">
  <label for="profile-name">ชื่อที่แสดง</label>
  <input wuInputText id="profile-name" name="name" [(ngModel)]="name" [fluid]="true" />
  <ng-template #footer>
    <wu-button label="ยกเลิก" severity="secondary" [text]="true" (onClick)="visible = false"></wu-button>
    <wu-button label="บันทึก" (onClick)="visible = false"></wu-button>
  </ng-template>
</wu-dialog>
```

**Inputs**
- `header`: `string` - title (a `header` template replaces it)
- `visible`: `boolean` = `false` - open or not; use `[(visible)]`
- `modal`: `boolean` = `true` - mask the page and keep focus inside; `[modal]="false"` = no mask, page usable
- `closable`: `boolean` = `true` - the ×, Esc and the mask can close it
- `closeOnEscape`: `boolean` = `true`; `dismissableMask`: `boolean` = `false` (mask click closes)
- `blockScroll`: `boolean` = `modal` - stop page scrolling behind
- `draggable`: `boolean` = `false` (move by header); `maximizable`: `boolean` = `false` (full-screen button)
- `showHeader`: `boolean` = `true`; `focusOnShow`: `boolean` = `true`
- `position`: `string` = `'center'` - center, top, bottom, left, right, topleft, topright, bottomleft, bottomright (`top-left` works too)
- `style` · `styleClass`: `object` · `string` - box style/class (phones always get screen width, even over an app `min-width`)
- `contentStyle` · `contentStyleClass` · `maskStyleClass`: `object` · `string` - content and mask
- `breakpoints`: `Record<string, string>` - width per screen size, e.g. `{ '960px': '75vw' }`; smallest matching max-width wins
- `closeIcon` · `maximizeIcon` · `minimizeIcon`: `string` - icon classes; `closeAriaLabel` · `ariaLabelledBy`: `string`
- Accepted, no effect: `appendTo`, `baseZIndex`, `autoZIndex`, `resizable`, `keepInViewport`, `responsive`, `transitionOptions`

**Outputs** - `(visibleChange)`: boolean - opened/closed · `(onShow)` · `(onHide)`: void - shown/hidden · `(onMaximize)`: `{ maximized: boolean }` (`WuDialogMaximizeEvent`)

**Slots** - `header`, `footer`, `content`, `closeicon` (`#name` or `wuTemplate="name"`); `headless` draws the whole box yourself (open/close, focus, top layer still work). Footer without a template: `<wu-footer>` or `[wuDialogFooter]`.

```html
<wu-dialog [(visible)]="visible" [maximizable]="true" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }">
  <ng-template #header><b>สมหญิง ใจดี</b></ng-template>
  <wu-footer><wu-button label="ส่ง" (onClick)="visible = false"></wu-button></wu-footer>
</wu-dialog>
```

**Tokens** - `--wu-dialog-bg`, `--wu-dialog-border`, `--wu-dialog-shadow`, `--wu-dialog-radius`, `--wu-dialog-header-padding`, `--wu-dialog-content-padding`, `--wu-dialog-footer-padding`, `--wu-dialog-title-size`, `--wu-dialog-title-weight`, `--wu-dialog-divider` (0 = none)

**Gotchas**
- Esc / × / mask clicks close it and write `visible = false` through `[(visible)]`; bind two-way, not one-way.
- Focus goes to an `autofocus` element, else the close button; Tab cycles inside.

## WuDialogService (open a component as a dialog)

`WuDialogService`, `WuDialogRef`, `WuDialogConfig` from `@wirabyte/ui/dialog` (old names `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` import too). No `<wu-dialog>` in the page.

```ts
import { Component, inject } from '@angular/core';
import { WuButton } from '@wirabyte/ui/button';
import { WuDialogConfig, WuDialogRef, WuDialogService } from '@wirabyte/ui/dialog';

// page that opens the dialog
export class ClassroomPage {
  private readonly dialogs = inject(WuDialogService);
  leader = '-';

  async pickLeader(): Promise<void> {
    const ref = this.dialogs.open(PickStudent, { header: 'เลือกหัวหน้าห้อง', width: '26rem', data: { room: 'ม.1/1' } });
    const student = await ref.result;           // or ref.onClose.subscribe(…)
    this.leader = student ? student.name : 'ยกเลิก';
  }
}

// component shown inside the dialog
@Component({
  selector: 'app-pick-student',
  imports: [WuButton],
  template: `<p>ห้อง {{ config.data.room }}</p>
    <wu-button label="เลือก" (onClick)="ref.close(student)"></wu-button>
    <wu-button label="ยกเลิก" severity="secondary" (onClick)="ref.close()"></wu-button>`,
})
export class PickStudent {
  readonly ref = inject(WuDialogRef<Student>);
  readonly config = inject(WuDialogConfig<{ room: string }>);
}
```

- `open<T, R, D>(component, config?)`: `WuDialogRef<R>`. `closeAll()` closes every open dialog with no result; `dialogs` lists open refs.
- Config (from source `WuDialogConfig`): `header`, `data`, `width`, `height`, `style`, `styleClass`, `contentStyle`, `contentStyleClass`, `footer` (a component for the footer buttons; may inject the same ref/config), `modal`=true, `closable`=true, `closeOnEscape`=true, `dismissableMask`=false, `maximizable`=false, `draggable`=false, `showHeader`=true, `focusOnShow`=true, `position`='center', `breakpoints`; `baseZIndex`/`appendTo` accepted, ignored.
- Ref: `close(result?)`, `destroy()` (immediate, no result), `onClose` (Observable), `result` (Promise). Closing with X / Esc / mask gives `undefined`. Dialogs stack.
