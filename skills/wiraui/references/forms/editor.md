# Editor

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

> Also read [`_shared.md`](_shared.md) in this folder: ngModel / reactive forms basics, sizes, invalid styling and the option-list inputs shared by every form control.

`wu-editor` · `WuEditorModule` / `WuEditor` from `@wirabyte/ui/editor` · forms: ngModel / formControlName
Also accepted: `<p-editor>` renamed; `pTemplate="header"`. Content view directive `wuEditorContent` (`WuEditorContent` standalone).

Rich-text field whose value is HTML (`string | null`; `null` when empty). Own implementation: no Quill or other library to install. Toolbar presets, tables, links, pictures (base64 or uploaded), cleaned paste from Word.

```html
<wu-editor name="newsBody" [(ngModel)]="newsBody" [style]="{ height: '320px' }" placeholder="พิมพ์เนื้อหาข่าว"></wu-editor>
<wu-button label="บันทึก" icon="wi wi-save" [loading]="isApiSaving" [disabled]="!newsBody" (onClick)="saveNews()"></wu-button>
```
```ts
newsBody: string | null = '<p>โรงเรียนเปิดรับสมัครนักเรียน <strong>ปีการศึกษา 2569</strong></p>';
```

Show saved HTML with the same look (headings, lists, quotes, tables, pictures, older `ql-align-*` / `ql-indent-*` / `ql-size-*` / `ql-font-*` classes; `<ol><li data-list="bullet">` shows as bullets):
```html
<div wuEditorContent [innerHTML]="announcement"></div>
```

Toolbar and options:
```html
<wu-editor name="a" [(ngModel)]="a" toolbar="full" [toolOptions]="toolOptions" [style]="{ height: '200px' }"></wu-editor>
<wu-editor name="b" [(ngModel)]="b" [toolbar]="['bold','italic','|','bulletList','orderedList','|','link','image','table']"></wu-editor>
<wu-editor name="c" [ngModel]="policy" [readonly]="true" toolbar="basic"></wu-editor>
<wu-editor name="d" [(ngModel)]="summary" toolbar="basic" [showCount]="true" [style]="{ height: '120px' }"></wu-editor>
```
```ts
import { EditorToolOptions, EditorToolbar } from '@wirabyte/ui/editor';
toolOptions: EditorToolOptions = {
  headings: [0, 2, 3],            // 0 = paragraph
  colors: ['#1e293b', '#0f766e'], highlights: ['#fef9c3'],
  alignments: ['left', 'center', 'right'],
  blocks: ['blockquote'],         // Blockquote in the menu, no Code block
  table: { rows: 6, cols: 6, headerRow: true },
  link: { newTab: true },
};
```

Picture upload (default is base64 embedding):
```html
<wu-editor name="n" [(ngModel)]="n" [imageUpload]="{ url: '/api/news/images', responseUrl: 'data.url', maxSize: 2097152 }"
  (onImageUpload)="imageUploaded($event)" (onImageUploadError)="imageFailed($event)"></wu-editor>
```
```ts
imageUpload: WuEditorImageUpload = { upload: this.uploadImage.bind(this), maxSize: 1048576 };
uploadImage(file: File): Promise<string> { /* resolve with the picture URL */ }
```

App-wide defaults (app.config.ts / AppModule providers; component settings still win):
```ts
import { provideEditorOptions } from '@wirabyte/ui/editor';
providers: [provideEditorOptions({
  toolbar: 'standard',
  toolOptions: { headings: [0, 1, 2, 3] },
  imageUpload: { url: '/api/upload', responseUrl: 'data.url', maxSize: 2097152 },
})]
```

Editor API from `(onInit)` or a template ref:
```html
<wu-editor #ed="wuEditor" name="letter" [(ngModel)]="letter" toolbar="basic" (onInit)="editorReady($event)" (onTextChange)="textChanged($event)"></wu-editor>
<wu-button label="Focus" (onClick)="ed.getEditor().focus()"></wu-button>
```
```ts
import { WuEditorApi, WuEditorInitEvent, WuEditorTextChangeEvent } from '@wirabyte/ui/editor';
editorReady(e: WuEditorInitEvent) { this.editor = e.editor; }
useTemplate() { this.editor?.setHTML('<p>เรียน ผู้ปกครอง</p>'); }
```

**Inputs**
- `ngModel` · `formControlName`: `string | null` = `null` — HTML; `null` when empty
- `toolbar`: `'basic' | 'standard' | 'full' | 'none' | EditorTool[] | EditorTool[][]` = `'standard'` — list with `'|'` between groups; unknown names skipped
- `toolOptions`: `EditorToolOptions` — headings, blocks, sizes, fonts, colours, alignments, table, link
- `imageUpload`: `WuEditorImageUpload` = base64 — see below
- `placeholder`: `string` · `readonly`: `boolean` = `false` (also disables every tool; a `disable()`d control does the same)
- `style`: `object` — style of the writing area, e.g. `{ height: '320px' }` · `styleClass`: `string` — outer box class
- `showCount`: `boolean` = `false` — word and character count
- `stickyToolbar`: `boolean` = `true`
- `ariaLabel`, `ariaLabelledBy`, `id`: `string` — name/id of the writing area
- `formats`, `modules`, `bounds`, `scrollingContainer`, `debug`: accepted, no effect

**Tools** (names for `[toolbar]`): `undo` `redo` · `heading` `fontSize` `fontFamily` · `bold` `italic` `underline` `strike` `subscript` `superscript` `code` · `color` `highlight` · `bulletList` `orderedList` `indent` `outdent` · `align` `alignLeft` `alignCenter` `alignRight` `alignJustify` · `link` `image` `table` `blockquote` `codeBlock` `hr` · `clear` `source` `fullscreen` (Esc leaves). `heading` menu = paragraph, Heading 1–6, Blockquote, Code block.

**WuEditorImageUpload**
- `mode`: `'base64' | 'upload'` = `'base64'` (a `url` or `upload` implies upload)
- `url`: `string` · `fieldName`: `string` = `'file'` · `method`: `'POST' | 'PUT'` = `'POST'`
- `headers`: `HttpHeaders | object` · `withCredentials`: `boolean`
- `responseUrl`: `string | (response) => string` — default tries `'url'`, `'data.url'`, `'location'`, `'path'`
- `baseUrl`: `string` — prefixed to a relative URL
- `maxSize`: `number` (bytes) · `accept`: `string` = png, jpeg, gif, webp
- `upload`: `(file: File) => Promise<string>` — your own upload; wins over `url`

**Outputs**
- `(onTextChange)`: `WuEditorTextChangeEvent` · `(onSelectionChange)`: `WuEditorSelectionChangeEvent`
- `(onInit)`: `WuEditorInitEvent` — field ready, with its API
- `(onFocus)` / `(onBlur)`: `FocusEvent`
- `(onImageUpload)`: `{ file, url }` · `(onImageUploadError)`: `WuEditorImageUploadErrorEvent`

**Slots** — `header` (`#header`, `wuTemplate="header"` or `pTemplate="header"`): your own toolbar from `ql-*` buttons/selects. Buttons `ql-*` get icons and actions; selects `ql-header`, `ql-size`, `ql-font`, `ql-color`, `ql-background`, `ql-align` become menus built from their option values; unsupported buttons (e.g. `ql-video`) are hidden; active ones get `ql-active`.

**Methods** — component: `getEditor()` · `getQuill()` (same object as `ed.api` and `onInit`'s `event.editor`). Editor API (`WuEditorApi`): `getHTML()` `getSemanticHTML()` `getText()` `getLength()` · `setHTML(html)` `insertHTML(html)` `insertText(text)` (HTML cleaned) · `focus()` `blur()` `hasFocus()` · `enable(enabled?)` `disable()` · `undo()` `redo()` · `clipboard.dangerouslyPasteHTML(html)` · `root` (the contenteditable element).

**Types**
```ts
interface WuEditorTextChangeEvent { htmlValue: string | null; textValue: string; delta: null; source: 'user' | 'api' }
interface WuEditorSelectionChangeEvent { range: { index: number; length: number } | null; oldRange: { index: number; length: number } | null; source: 'user' }
interface WuEditorInitEvent { editor: WuEditorApi }
interface WuEditorImageUploadErrorEvent { file: File; reason: 'size' | 'type' | 'upload'; message: string }
interface EditorToolOptions {
  headings?: number[]; blocks?: Array<'blockquote' | 'codeBlock'>;
  fontSizes?: { label: string; value: string }[]; fontFamilies?: { label: string; value: string }[];
  colors?: string[]; highlights?: string[];
  alignments?: Array<'left' | 'center' | 'right' | 'justify'>;
  table?: { rows?: number; cols?: number; headerRow?: boolean };
  link?: { newTab?: boolean; protocols?: string[] };
}
function provideEditorOptions(o: { toolbar?: EditorToolbar; toolOptions?: EditorToolOptions; imageUpload?: WuEditorImageUpload }): Provider;
```

**Tokens** — `--wu-editor-radius`, `--wu-editor-toolbar-bg`, `--wu-editor-toolbar-padding`, `--wu-editor-tool-size`, `--wu-editor-tool-radius`, `--wu-editor-tool-hover-bg`, `--wu-editor-tool-on-bg`, `--wu-editor-tool-on-color`, `--wu-editor-content-padding-y`, `--wu-editor-content-padding-x`, `--wu-editor-content-min-height`, `--wu-editor-sticky-top` (offset for the sticky toolbar, e.g. your app bar height), `--wu-primary-color`

**Gotchas**
- Value is `null`, not `''`, when empty, so `!newsBody` works.
- Uploading images: the picture is not in the value until the upload finishes. `upload()` beats `url`.
- Pasting from Word / Google Docs / web is cleaned (no scripts, no styles except colour, alignment, size). `javascript:` links are refused.
- Tables: insert panel (grid or typed rows/cols, header row option); drag across cells or `Shift`+click to select and merge; drag column edges to resize; `Tab` in the last cell adds a row. A table toolbar appears while the caret is in a table.
- Shortcuts: `Ctrl/⌘`+`B` `I` `U` `K` (link) `Z`; redo `Ctrl+Y` or `Ctrl/⌘+Shift+Z`.
- Moving from `p-editor`: `delta` is always `null`; `getQuill()` returns the WiraUI API, not a Quill instance.
- Slot syntax: v3 `<ng-template #header>`, v1/v2 `wuTemplate="header"`.

---
