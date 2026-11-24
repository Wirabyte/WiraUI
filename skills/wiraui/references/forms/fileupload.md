# FileUpload

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-fileupload` · `WuFileUploadModule` / `WuFileUpload` from `@wirabyte/ui/fileupload` · not a ControlValueAccessor (read files from events or `files`)
Also accepted: `wu-fileUpload`, `<p-fileUpload>` renamed; `pTemplate="content"` / `"empty"`.

Choose or drop files; type and size are checked with localized messages; chosen files are listed with thumbnails. Your code uploads (`customUpload`) or the component posts to a `url`. Full box or single button (`mode="basic"`). `WuFileUploadModule` already brings `wuTemplate`. Posting uses XMLHttpRequest, no HttpClient setup.

```html
<wu-fileupload #fileUpload name="documents" [multiple]="true" accept="image/*,application/pdf"
  [maxFileSize]="10485760" chooseLabel="เลือกไฟล์" uploadLabel="อัปโหลด" cancelLabel="ยกเลิก"
  [customUpload]="true" [disabled]="isApiSaving" (uploadHandler)="uploadDocuments($event, fileUpload)"></wu-fileupload>
```
```ts
import { WuFileUpload, WuFileUploadHandlerEvent } from '@wirabyte/ui/fileupload';

uploadDocuments(event: WuFileUploadHandlerEvent, fileUpload: WuFileUpload): void {
  this.isApiSaving = true;
  const formData = new FormData();
  for (const file of event.files) formData.append('documents', file, file.name);
  this.documentService.upload(formData).subscribe(() => {
    this.isApiSaving = false;
    fileUpload.clear();
  });
}
```

Other recipes:
```html
<!-- files go with the form on save: no upload button, read from (onSelect) -->
<wu-fileupload name="scores" accept=".xlsx,.xls" [maxFileSize]="1048576" [fileLimit]="3" [multiple]="true"
  chooseLabel="เลือกไฟล์คะแนน" cancelLabel="ล้าง" [showUploadButton]="false"
  (onSelect)="picked($event)" (onValidationFail)="rejected($event)"></wu-fileupload>
<!-- each listed file shows a "รออัปโหลด" badge; in this mode give a `file` slot that draws
     name + remove button without it (v2/v3: a `content` slot replaces the whole list). A required attachment: keep it in a FormControl set from (onSelect)/(onRemove)/(onClear)
     and show <wu-field-error [control]="form.controls.attachment" label="ไฟล์แนบ"> (FileUpload is not a form control) -->

<!-- single button -->
<wu-fileupload mode="basic" name="photo" accept="image/*" [maxFileSize]="2097152"
  chooseLabel="เลือกรูปนักเรียน" (onSelect)="pickPhoto($event)" (onClear)="clearPhoto()"></wu-fileupload>

<!-- post to a url (no customUpload) -->
<wu-fileupload name="file" url="/api/students/import" accept=".xlsx" [maxFileSize]="10485760"
  chooseLabel="เลือกไฟล์" [headers]="uploadHeaders" (onBeforeUpload)="addClass($event)"
  (onUpload)="imported($event)" (onError)="importFailed($event)"></wu-fileupload>
```
```ts
picked(event: WuFileSelectEvent) { this.names = event.files.map(f => f.name); }   // only files that passed
pickPhoto(event: WuFileSelectEvent) { this.photo = event.files[0] ?? null; }
addClass(event: WuFileBeforeUploadEvent) { event.formData.append('classId', String(this.classId)); }
```

**Inputs: files and uploading**
- `mode`: `'advanced' | 'basic'` = `'advanced'`
- `multiple`: `boolean` = `false`
- `accept`: `string` — e.g. `'.xlsx,.xls'`, `'image/*,application/pdf'`
- `maxFileSize`: `number` — bytes per file (10485760 = 10 MB)
- `fileLimit`: `number` — max files, uploaded ones count
- `customUpload`: `boolean` = `false` — upload button emits `(uploadHandler)` instead of posting to `url`
- `auto`: `boolean` = `false` — upload as soon as files are chosen
- `url`: `string` · `method`: `'post' | 'put'` = `'post'` · `name`: `string` = `'file'` (FormData field name)
- `headers`: `HttpHeaders | Record<string, string>` · `withCredentials`: `boolean` = `false`
- `files`: `File[]` = `[]` (read and write)
- `disabled`: `boolean` = `false`
- `invalidFileSizeMessageSummary` · `…Detail` · `invalidFileTypeMessageSummary` · `…Detail` · `invalidFileLimitMessageSummary` · `…Detail`: `string` = locale (`{0}` = name / size / types / limit)

**Inputs: buttons and look**
- `chooseLabel`, `uploadLabel`, `cancelLabel`: `string` = locale (Choose · Upload · Cancel)
- `chooseIcon`, `uploadIcon`, `cancelIcon`: `string` (built-in SVG icons when unset)
- `showUploadButton`, `showCancelButton`: `boolean` = `true`
- `chooseStyleClass`, `uploadStyleClass`, `cancelStyleClass`, `removeStyleClass`: `string` — e.g. `'p-button-sm p-button-secondary'`
- `previewWidth`: `number` = `50` (px)
- `style`, `styleClass`, `tabindex`
- `chooseButtonProps`, `uploadButtonProps`, `cancelButtonProps`: accepted, no effect

**Outputs**
- `(onSelect)`: `WuFileSelectEvent` — `files` = ones that passed, `currentFiles` = all now chosen
- `(uploadHandler)`: `WuFileUploadHandlerEvent` — upload pressed (customUpload)
- `(onValidationFail)`: `WuFileValidationFailEvent` — a file was turned away
- `(onRemove)`: `WuFileRemoveEvent` · `(onClear)`: `void`
- `(onBeforeUpload)`: `WuFileBeforeUploadEvent` (add formData fields) · `(onSend)`: `WuFileSendEvent`
- `(onProgress)`: `WuFileProgressEvent` (0–100)
- `(onUpload)`: `WuFileUploadEvent` (2xx) · `(onError)`: `WuFileUploadErrorEvent`
- `(onRemoveUploadedFile)`: `{ file, index }` · `(onImageError)`: `Event` (thumbnail failed)

**Slots** (`#name`, `wuTemplate="name"` or `pTemplate="name"`)
- `file` — `let-file` + `let-i="index"`: each chosen file
- `content` — `WuFileUploadContentContext`: v1 renders it under the file list, v2/v3 instead of the list
- `header` — same context as `content`: replaces the whole button bar
- `toolbar` — none: after the buttons
- `empty` — none: shown before any file is chosen

**Methods** (via template ref `#fileUpload`) — `choose()`, `upload()`, `clear()` (files + messages), `remove(event, index)`, `removeUploadedFile(index)`; readable `files`, `uploadedFiles`, `progress`, `msgs`.

**Types**
```ts
interface WuFileSelectEvent { originalEvent: Event; files: File[]; currentFiles: File[] }
interface WuFileUploadHandlerEvent { files: File[] }
interface WuFileValidationFailEvent { file: File | null /* null for the limit */; reason: 'type' | 'size' | 'limit'; message: string }
interface WuFileRemoveEvent { originalEvent: Event; file: File }
interface WuFileBeforeUploadEvent { formData: FormData }
interface WuFileSendEvent { xhr: XMLHttpRequest; formData: FormData }
interface WuFileProgressEvent { originalEvent: ProgressEvent; progress: number }
interface WuFileUploadEvent { originalEvent: Event | XMLHttpRequest; files: File[] }
interface WuFileUploadErrorEvent { xhr: XMLHttpRequest; files: File[] }
interface WuFileUploadContentContext {
  $implicit: File[]; files: File[]; uploadedFiles: File[];
  chooseCallback: () => void; clearCallback: () => void; uploadCallback: () => void;
  removeFileCallback: (event: Event, index: number) => void;
  removeUploadedFileCallback: (index: number) => void;
  progress: number; messages: string[];
}
```

**Tokens** — `--wu-fileupload-border-width`, `--wu-fileupload-radius`, `--wu-fileupload-header-padding`, `--wu-fileupload-header-border-width`, `--wu-fileupload-header-radius`, `--wu-fileupload-header-bg`, `--wu-fileupload-content-padding`, `--wu-fileupload-content-border-width`, `--wu-fileupload-content-radius`, `--wu-fileupload-file-gap`, `--wu-fileupload-thumb-radius`, `--wu-primary-color` (drop outline and progress bar)

**Gotchas**
- Not a form control: there is no `ngModel` value. Take files from `(onSelect)` / `(uploadHandler)` or `fileUpload.files`.
- Rejected files (wrong `accept` / over `maxFileSize` / over `fileLimit`) are never added; they show a closable message and fire `(onValidationFail)`. `(onSelect).files` holds only the accepted ones.
- With `customUpload` call `fileUpload.clear()` yourself after your upload succeeds.
- Duplicate files are skipped; images get thumbnails; chosen files carry a Pending badge, posted ones a Completed badge.
- `files` in the content/file slot: v1 lists files then `content`; v2/v3 let `content` replace the list.
- Slots: v3 `<ng-template #file let-file>`, v1/v2 `wuTemplate="file"`.

---
