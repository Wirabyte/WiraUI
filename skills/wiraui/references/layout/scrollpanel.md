# ScrollPanel

> Examples are v3-style. For v1/v2 (Angular 15–20) write slots as `<ng-template wuTemplate="x">` instead of `<ng-template #x>`, `*ngIf`/`*ngFor` instead of `@if`/`@for`, and add `standalone: true` to your own standalone components on v1.

`wu-scrollpanel` · `WuScrollPanelModule` / `WuScrollPanel` from `@wirabyte/ui/scrollpanel`
Also accepted: `wu-scrollPanel`, `wu-scroll-panel`.

Box whose content scrolls inside, with thin theme-coloured native scrollbars; focusable region (arrows, Page Up/Down scroll).

```html
<wu-scrollPanel #rulesPanel [style]="{ width: '100%', height: '10rem' }" [step]="40" ariaLabel="ระเบียบของโรงเรียน">
  <ol>
    @for (rule of rules; track rule) { <li>{{ rule }}</li> }
  </ol>
</wu-scrollPanel>
<wu-button label="กลับขึ้นบน" (onClick)="rulesPanel.scrollTop(0)"></wu-button>
```
(v1/v2: use `*ngFor` instead of `@for`.)

**Inputs** — `styleClass`, `style` (object; set `height`, or `maxHeight` to grow with content up to that then scroll) · `ariaLabel`: `string` (role region) · `step`: `number` — pixels per arrow key press (none = browser's own step)
**Methods** — `scrollTop(top)` scrolls content to `top` px (via template ref) · `refresh()` kept for old code, no-op in practice (scrollbars follow content)
**Slots** — `content` template or content straight inside the tag.
**Tokens** — `--wu-scrollpanel-bar-size`, `--wu-scrollpanel-bar-color`, `--wu-scrollpanel-bar-hover-color`

**Gotchas**
- It needs a `height` or `maxHeight` in `[style]` or it never scrolls.
- No fake scrollbars: no `p-scrollpanel-bar` class exists.
- Existing `p-scrollpanel` / `p-scrollpanel-content` classes sit next to the `wu-*` ones.
