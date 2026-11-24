# Splitter

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-splitter` · `WuSplitterModule` / `WuSplitter`, `WuSplitterPanel` from `@wirabyte/ui/splitter`
Also accepted: `wu-splitterPanel`; `<ng-template pTemplate="panel">` panels from existing templates.

Resizable panels separated by draggable gutters: horizontal or vertical, nestable, with minimum sizes and remembered sizes.

```html
<wu-splitter [style]="{ height: '16rem' }">
  <wu-splitter-panel [size]="30">เมนู</wu-splitter-panel>
  <wu-splitter-panel [size]="70">
    <wu-splitter layout="vertical">
      <wu-splitter-panel [size]="65">เนื้อหา</wu-splitter-panel>
      <wu-splitter-panel [size]="35">บันทึกย่อ</wu-splitter-panel>
    </wu-splitter>
  </wu-splitter-panel>
</wu-splitter>

<wu-splitter [(panelSizes)]="sizes" [minSizes]="[20, 30]" [gutterSize]="6" [step]="10" (onResizeEnd)="resized($event)"
  stateKey="report-layout" stateStorage="local" [style]="{ height: '12rem' }">
  <wu-splitter-panel>เมนู</wu-splitter-panel>
  <wu-splitter-panel>ตัวอย่างก่อนพิมพ์</wu-splitter-panel>
</wu-splitter>
```
```ts
sizes = [35, 65];   // % per panel
resized(event: { sizes: number[] }): void { /* … */ }
```

**Inputs — `wu-splitter`**
- `layout`: `'horizontal' | 'vertical'` = `'horizontal'`
- `panelSizes`: `number[]` — each panel's size in % (`[(panelSizes)]`)
- `minSizes`: `number[]` = `[]` — smallest size in %
- `gutterSize`: `number` = `4` — px; `step`: `number` = `5` — px per arrow key
- `stateKey`: `string` — remember user sizes under this key; `stateStorage`: `'session' | 'local'` = `'session'`
- `panelStyleClass`: `string`, `panelStyle`: `object` — every panel
- `styleClass`, `style` (object; set the height here)

**Inputs — `wu-splitter-panel`** — `size`: `number` (starting %; panels without it share the rest equally) · `minSize`: `number` (%) · `styleClass`, `style`
**Outputs** — `(onResizeStart)` / `(onResizeEnd)`: `{ originalEvent, sizes }` (sizes in %) · `(panelSizesChange)`: `number[]`
**Keyboard / a11y** — each gutter is a Tab stop, `role="separator"` announcing the previous panel's size in %; `←` `→` (`↑` `↓` vertical) move by `step` px; `Home`/`End` go to smallest/largest; touch drag works with a wider hit area; label from locale (`resizePanels`).
**Tokens** — `--wu-splitter-bg`, `--wu-splitter-color`, `--wu-splitter-border-width`, `--wu-splitter-border-color`, `--wu-splitter-radius`, `--wu-splitter-gutter-bg`, `--wu-splitter-gutter-active-bg`, `--wu-splitter-handle-length`, `--wu-splitter-handle-bg`, `--wu-splitter-hit-size`

**Gotchas**
- Give the splitter a height via `[style]`.
- Saved sizes for a different number of panels are ignored.
- Nest by putting a `wu-splitter` inside a panel.
