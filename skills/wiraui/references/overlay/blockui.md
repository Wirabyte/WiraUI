# BlockUI

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: top-layer rules (no appendTo / z-index) and slot syntax.

`wu-blockui` · `WuBlockUIModule` / `WuBlockUI` from `@wirabyte/ui/blockui`
Also accepted: `wu-blockUI`, `wu-block-ui` tags; `<p-blockUI>` moves over with a prefix change.

Covers the whole page, or one part of it, while work runs (e.g. a save). Covered content cannot be pressed or tabbed into; the middle shows what you put inside (spinner, message).

```html
<div #studentForm class="student-form">
  <input id="name" name="name" wuInputText [(ngModel)]="studentName" />
  <wu-button label="ปุ่มด้านใน" severity="secondary" [outlined]="true"></wu-button>
</div>
<wu-blockUI [blocked]="isApiSaving" [target]="studentForm" ariaLabel="กำลังบันทึก">
  <wu-progress-spinner [style]="{ width: '2rem', height: '2rem' }"></wu-progress-spinner>
  <span>กำลังบันทึก</span>
</wu-blockUI>
<wu-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" (onClick)="save()"></wu-button>

<!-- whole page: omit [target] -->
```
```ts
save(): void { this.isApiSaving = true; this.svc.save().subscribe({ next: () => (this.isApiSaving = false), error: () => (this.isApiSaving = false) }); }
```

**Inputs**
- `blocked`: `boolean` = `false`
- `target`: `HTMLElement | ElementRef | component` - cover only this part (template ref, ElementRef, or a component with `el` / `getBlockableElement()`); none = whole page
- `ariaLabel`: `string` - read out while covered
- `styleClass`: `string` - extra class on the cover
- Accepted, no effect: `autoZIndex`, `baseZIndex`

**Slots** - `content` (what shows in the middle; or put it straight inside the tag). No context.

**Tokens** - `--wu-blockui-mask`, `--wu-blockui-color`

**Gotchas**
- With `target`: the part gets `aria-busy="true"` and its content turns `inert` until `blocked` is false.
- Without `target`: modal dialog in the top layer; page cannot be pressed or scrolled and Esc does not close it. Always reset `blocked` in both `next` and `error` or the page stays locked.
- Pass a template ref (`#studentForm`) for `target`, not a string selector.
