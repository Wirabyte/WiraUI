# Inplace

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-inplace` · `WuInplaceModule` / `WuInplace` from `@wirabyte/ui/inplace`

Shows a value as plain text until clicked, then the edit field. Good for read-mostly pages.

```html
<wu-inplace [closable]="true">
  <ng-template #display><span>{{ studentName }}</span></ng-template>
  <ng-template #content>
    <input wuInputText name="studentName" [(ngModel)]="studentName" aria-label="ชื่อ - สกุล" />
  </ng-template>
</wu-inplace>

<!-- save, then close -->
<wu-inplace>
  <ng-template #display>ชื่อเล่น: <b>{{ nickname }}</b></ng-template>
  <ng-template #content let-closeCallback="closeCallback">
    <input wuInputText name="nickname" [(ngModel)]="nickname" aria-label="ชื่อเล่น" />
    <wu-button label="บันทึก" size="small" [loading]="isApiSaving" (onClick)="saveNickname(closeCallback)"></wu-button>
  </ng-template>
</wu-inplace>

<!-- from code -->
<wu-inplace #noteEditor [(active)]="editingNote" [preventClick]="true" [closable]="true">…</wu-inplace>
<wu-button label="แก้ไขหมายเหตุ" (onClick)="noteEditor.activate()"></wu-button>
```
```ts
saveNickname(close: () => void): void {
  this.isApiSaving = true;
  this.studentService.saveNickname(this.nickname).subscribe({
    next: () => { this.isApiSaving = false; close(); },
    error: () => (this.isApiSaving = false),
  });
}
```

**Inputs** — `active`: `boolean` = `false` (`[(active)]`) · `closable`: `boolean` = `false` (close button, `Esc` closes) · `disabled`: `boolean` = `false` (cannot open) · `preventClick`: `boolean` = `false` (clicking the text does not open; open from code) · `closeIcon`, `closeAriaLabel`: `string` (default label from locale) · `styleClass`, `style`
**Outputs** — `(onActivate)` / `(onDeactivate)`: `Event` · `(activeChange)`: `boolean`
**Slots (templates)** — `display` (shown first) · `content` (the field; context `closeCallback`; created only on open) · `closeicon` (close button icon). `#name`, `wuTemplate="name"` or `pTemplate="name"`; older `pInplaceDisplay` / `pInplaceContent` attributes are also read.
**Methods** — `activate(event?)` opens and focuses first field · `deactivate(event?)` back to text (focus returns if it was inside)
**Tokens** — `--wu-inplace-padding`

**Gotchas**
- Open via click, or `Enter`/`Space` on the text; focus goes to the first field inside.
- `content` is lazy: images/heavy parts load only when opened.
- Slot syntax: v3 `#display` / `#content`, v1/v2 `wuTemplate="display"`.
