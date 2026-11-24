---
name: wiraui
description: How to install, configure, theme and use WiraUI (@wirabyte/ui), Wirabyte's Angular component library (v1 = Angular 15–17, v2 = 18–20, v3 = 21+). Use whenever a project has @wirabyte/ui in package.json, its templates use wu-* tags or wu* directives (wuButton, wuInputText, wuTooltip…), its code calls provideWiraUI / WuThemeService / WuAlertService / WuMessageService, or the user wants to add WiraUI to an Angular app, build a page or form with it, theme it, or move PrimeNG (p-*) templates over to it. Also for Thai-specific UI needs it covers (Buddhist-era dates, Thai ID, baht text, Excel export).
---

# WiraUI (`@wirabyte/ui`)

Angular UI library with ~100 components, written in-house. API names deliberately mirror PrimeNG (`label`, `severity`, `options`, `optionLabel`, `(onClick)`…), Thai-first (Thai text + Buddhist calendar by default), themed through `--wu-*` CSS variables.

Docs: https://ui.wirabyte.com/v3/ (swap `v3` for `v1`/`v2`). Source of truth when this skill is unsure: the docs data files in the WiraUI repo, `apps/docs/src/app/data/<component>.ts` (inputs, outputs, types, tokens, examples).

## Step 0 — find out what the project is

Before writing any WiraUI code, check:

1. **Angular major** (`@angular/core` in package.json) → which WiraUI major it must use:

   | Angular | WiraUI | Install |
   |---|---|---|
   | 21+ | `@wirabyte/ui@3` | `ng add @wirabyte/ui` |
   | 18–20 | `@wirabyte/ui@2` | `ng add @wirabyte/ui@2` |
   | 15–17 | `@wirabyte/ui@1` | `ng add @wirabyte/ui@1` |

   Majors are locked to their range: wrong major fails at install (peer deps), at `ng add`, and throws at app start. Never install across ranges, never suggest `--legacy-peer-deps` as a fix.
2. **Is WiraUI already set up?** Look for `provideWiraUI(` (app.module.ts / app.config.ts / main.ts) and `src/theme/wiraui.theme.scss` or a `@wirabyte/ui/themes/...` entry in angular.json. If yes, skip install.
3. **NgModule or standalone?** `bootstrapModule(` vs `bootstrapApplication(` in main.ts. Most team apps are NgModule, even on Angular 19.
4. **Does it still use PrimeNG?** Then WiraUI runs side by side; see [migration](references/migration.md).

## Install

`ng add` is interactive. From an agent, always pass `--defaults` or explicit flags:

```bash
ng add @wirabyte/ui --defaults
# or explicit (all optional):
ng add @wirabyte/ui --style=scss --structure=module --theme=wira --primary=#00a86b --font=Kanit --locale=th-buddhist --darkMode=none
```

Flags (from the schematic schema): `--style auto|scss|css`, `--structure auto|module|standalone`, `--theme <name>` (default per major: v1 `sila-light-teal`, v2 `mali`, v3 `wira`), `--utils` (utility classes, default true), `--primary <hex>`, `--font auto|Kanit|Sarabun|Prompt|"Noto Sans Thai"|"IBM Plex Sans Thai"|Anuphan|Inter|Roboto|none`, `--locale th-buddhist|th-gregorian|en`, `--darkMode none|class|media`, `--claude-skill` (copy this skill into `.claude/skills/wiraui`, default true), `--project <name>`.

`--utils` (default on) adds utility classes named like PrimeFlex (`grid`, `col-12`, `md:col-6`, `flex`, `p-3`): a drop-in for PrimeFlex, but pass `--utils=false` when the app uses Tailwind or another utility library it wants to keep.

What it changes: adds `provideWiraUI(...)` to `app.module.ts` providers or `app.config.ts`; SCSS apps get `src/theme/wiraui.theme.scss` + `@use 'theme/wiraui.theme';` as line 1 of `styles.scss`; CSS apps get `src/theme/wiraui.theme.css` (plus `node_modules/@wirabyte/ui/utils/utils.css` unless `--utils=false`) in angular.json `styles`; always creates `src/theme/wiraui.overrides.ts`; copies this skill into `.claude/skills/wiraui/` (replaced on a re-run).

Upgrading Angular across a range moves both in one command: `ng update @angular/core@18 @angular/cli@18 @wirabyte/ui@2`.

Manual setup (no schematic): `npm i @wirabyte/ui@<major>`, then add the provider and one theme route from [theming](references/theming/setup.md).

## provideWiraUI

```ts
// NgModule: app.module.ts            // Standalone: app.config.ts → providers: [...]
import { provideWiraUI } from '@wirabyte/ui/config';
import { wiraOverrides } from '../theme/wiraui.overrides';

providers: [provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist' })]
// NgModule alternative: imports: [WiraUIModule.forRoot({ ... })]
```

Options: `preset` (whole theme from TS; omit when theme comes from SCSS/CSS), `overrides` (`defineOverrides({...})`, beats the theme file), `darkMode: 'none'|'class'|'media'` (class = `.wu-dark` on `<html>`), `darkModeSelector` (reuse the app's own dark class, e.g. `'.my-dark'`), `scheme`, `ripple`, `locale: 'th'|'en'|WuLocale` (default `'th'`), `calendar: 'buddhist'|'gregorian'` (default buddhist; only applies while locale is Thai), `delays: { autoComplete, filter }` (ms), `fonts: 'google'|'none'` (default links Google Fonts for the theme font; `'none'` for offline/self-hosted), `now: () => Date` (server clock for "today"), `selector`.

Runtime: `WuConfig.setTranslation({...})` once at app level to change built-in words; `WuThemeService` → `setPreset`, `setPrimary(hex)`, `patch`, `setOverrides`, `setDarkMode(bool)`, `isDarkMode()`.

## Using a component

Every component is a secondary entry point. Name pattern is uniform:

```ts
import { WuSelectModule } from '@wirabyte/ui/select';   // NgModule
import { WuSelect } from '@wirabyte/ui/select';         // standalone
```

```html
<wu-select [(ngModel)]="city" [options]="cities" optionLabel="name" optionValue="id" placeholder="เลือกจังหวัด"></wu-select>
```

- Form controls implement ControlValueAccessor: use `[(ngModel)]` (import `FormsModule`) or `formControlName` (`ReactiveFormsModule`). Model values are plain JS values; dates are plain `Date` even when shown in B.E.
- Show validation errors with `<wu-field-error>` / `WuValidators` from `@wirabyte/ui/validation` (see [validation](references/forms/validation.md)).
- Old camelCase tags and PrimeNG-style attribute names are accepted too (`wu-inputNumber`, `wu-calendar`, `pInputText`, `pTemplate`), but write the canonical names from the index below in new code.

### What differs between majors (templates are otherwise identical)

| | v1 (Ng 15–17) | v2 (Ng 18–20) | v3 (Ng 21+) |
|---|---|---|---|
| Standalone component in your app | needs `standalone: true` | default | default |
| Named slot templates | `<ng-template wuTemplate="footer">` | `<ng-template wuTemplate="footer">` | `<ng-template #footer>` |
| Control flow in examples | `*ngIf` / `*ngFor` | either | `@if` / `@for` |
| Component API style (internal; bindings look the same) | `@Input` / `@Output` | mostly signals `input()` / `model()` | mostly signals |
| Default theme | `sila-light-teal` | `mali` | `wira` (Liquid Glass available) |
| `<wu-chart>` | Chart.js wrapper (app installs `chart.js`) | Chart.js wrapper | WiraUI's own SVG chart, no library; use `<wu-chartjs>` for Chart.js plugins |

The docs list "Signal Forms" for v3, but no component-level Signal Forms integration exists in the source yet; use template-driven (`ngModel`) or reactive forms in every major.

## House rules (what makes WiraUI code correct)

- **Overlays live in the browser top layer.** Dialog, Drawer, Select panels, menus, tooltips: no `appendTo`, no `z-index`, no `baseZIndex` (accepted, ignored).
- **Services come from one import:** `@wirabyte/ui/api` exports `WuMessageService` (alias `MessageService`), `WuConfirmationService` (`ConfirmationService`), `WuAlertService` / `WuAlert`, `MenuItem`, `TreeNode`, `WuTemplate`, `SharedModule`. Both names of each service are the same class; in app code prefer `MessageService` / `ConfirmationService` from `@wirabyte/ui/api` (one import, PrimeNG-familiar). Put `<wu-toast>` / `<wu-confirmdialog>` once in a root template.
- **Alerts:** `WuAlert.fire({...})` / `WuAlertService` replaces SweetAlert2 (`Swal.fire`) with the same theme.
- **Async buttons:** prefer `<wu-button [action]="save">` (function returning Promise/Observable; button shows spinner and blocks double clicks) over hand-written `loading` flags. Bind once: `save = this.doSave.bind(this)`, or an arrow property `save = () => this.api.save(this.form.value)`; never `[action]="doSave()"` (that calls it during rendering).
- **Style through tokens, not CSS hacks.** Never `::ng-deep` or `!important` on `.wu-*`/`.p-*` internals. Use `defineOverrides({ components: { card: { bodyGap: '0' } } })`, SCSS `$components`/`$tokens`, or plain `--wu-*` variables in app CSS (app CSS is outside `@layer`, so it already wins). Per-component token names are listed in each reference.
- **Icons:** `icon` inputs take any icon-font class (`wi wi-save`, `fa-solid fa-floppy-disk`, `pi pi-check`). WiraUI's own set is `@wirabyte/icons` (classes `wi wi-<name>`), a separate package that `ng add` does not install: `npm i @wirabyte/icons` and add `node_modules/@wirabyte/icons/wiraicon.css` to angular.json `styles` before using `wi` classes (see [icons](references/theming/icons.md)). Icon-only buttons need `ariaLabel`.
- **Thai by default:** built-in texts are Thai and dates are B.E. unless `locale`/`calendar` say otherwise. Don't add custom Thai translations or B.E. conversion code; it is built in (pipes `wuDate`, `wuBahtText`, `wuThaiId`… in [Thai pipes](references/helpers/thai-pipes.md)).
- **Excel/CSV:** use `downloadExcel()` / Table `exportCSV()`; don't add `xlsx` for exports.
- **No extra libs** for Editor, Flow, Image cropper, Excel or (v3) Chart. Only `<wu-chartjs>` (and v1/v2 `<wu-chart>`) need `chart.js` 3.x or 4.x.
- **Rebrand with a palette, never `--wu-primary-color` alone:** hover/pressed/selected colours come from the 50–950 shades. Use SCSS `$primary`, TS `palette('#hex')` or `WuThemeService.setPrimary()`.
- **Global app CSS is unlayered, so it beats components too.** Put broad rules (`a { color: inherit }`, resets) in `@layer reset`; theme tweaks in tokens.

## Gotchas that apply across components

- **PrimeNG inputs that are accepted but do nothing** (so migrated templates compile): `appendTo`, `baseZIndex`, `autoZIndex`, `transitionOptions` / `*TransitionOptions`, most `virtualScroll*`, `responsive`, `autoDisplayFirst`, `dropdownAppendTo`. Don't "fix" them and don't rely on them.
- **Not built yet:** Table virtual scroll; AutoComplete `optionValue` and `multiple`. No WiraUI counterpart for PrimeNG `cascadeSelect`, `chips`, `confirmPopup`, `dataView`, `megaMenu`, `scrollTop`, `speedDial`, `treeTable`, `triStateCheckbox`.
- **Option lists** (Select, MultiSelect, AutoComplete, Listbox, SelectButton) share `options` / `optionLabel` / `optionValue` / `optionDisabled` / `dataKey`. Without `optionValue` the model is the whole object, so set `dataKey` when the model is reloaded from an API.
- **Function-valued inputs take the function itself:** `[action]`, `[rowSelectable]`, `[exportFunction]`, Flow `[isValidConnection]`/`[beforeDelete]`. Bind once in the class: `fn = this.fn.bind(this)`.
- **`[style]` is an object** (`[style]="{ height: '12rem' }"`), plus `styleClass` for classes.
- **Two-way bindings that are not forms:** `[(visible)]`, `[(value)]`, `[(activeIndex)]`, `[(activeItem)]`, `[(collapsed)]`, `[(page)]`, `[(panelSizes)]`… use these, not `ngModel`. Accordion/Tabs/Stepper offer an index form, a value form and a model form: pick one per instance; prefer the value form in new code.
- **Data is mutated in place:** Tree (open/checked state), PickList `source`/`target`, OrderList `value`, PanelMenu/AsideMenu `expanded`, Table `expandedRowKeys`/`editingRowKeys`. Don't share one array between two components. Scheduler is the exception: `onEventChange` does not mutate `events`; pass a new array back.
- **Paging is not uniformly indexed:** `wu-paginator` `page`/`first` are 0-based; `wu-table` `(onLazyLoad)` `page` is 1-based.
- **Defaults that differ by major:** Menubar `autoDisplay` (v1 off, v2/v3 on), PanelMenu `multiple` (v1 true, v2/v3 false), PickList/OrderList `metaKeySelection` (v1 true, v2/v3 false).
- **Templates named by data, not slots:** Tree node-type templates and OrganizationChart box templates are matched by `type`, so write `wuTemplate="person"` (or `pTemplate`) in every major, v3 included. Flow uses its own directives (`wuFlowNode="type"`, `wuFlowEdge`…). `pTemplate="x"` is accepted wherever `wuTemplate="x"` is.
- **Forms:** controls turn red on their own once invalid and touched (or form submitted); `[invalid]` only forces it. Show messages with `<wu-field-error for="name" label="ชื่อ">` instead of hand-written `ng-dirty` checks. `WuValidators` and `wuThaiId`/`wuThaiPhone`/`wuMatch` treat empty as valid: pair with `Validators.required`. Empty values are `null` (Editor, SignaturePad, DatePicker, InputNumber).
- **Field sizing:** `input[wuInputText]` and `textarea[wuTextarea]` use `wuSize` (native `size` is taken); components use `size="small"|"large"`. Select-like fields default to 14rem (`--wu-select-width`); use `[fluid]="true"` for full width.
- **DatePicker `dateFormat` uses `dd/mm/yy` tokens** (`yy` = 4-digit year), not Angular date-pipe syntax. The model is always a Gregorian `Date`.
- **Services are `providedIn: 'root'`:** no `providers` entry. Only put `<wu-toast>` and `<wu-confirmdialog>` once in a root template. `confirm()` without a matching `<wu-confirmdialog>` falls back to an AlertDialog. `<wu-messages>` also listens to `MessageService` unless `[enableService]="false"`.
- **Give sized hosts a height:** ScrollPanel (`height`/`maxHeight`), Splitter, Flow (otherwise 20rem). Charts use their `height` input.
- **Chart.js wrappers** don't notice in-place data changes: call `refresh()` or assign a new object.
- **Router menus:** `routerLinkActiveOptions` defaults to `{ exact: false }`, so a `'/'` home item lights up everywhere; set `{ exact: true }` on it. Theme Navbar/AsideMenu through tokens in global CSS, not component-scoped CSS.
- **Accessible names:** icon-only buttons and controls without a visible label (InputNumber, InputMask, InputOtp, Password, Slider, Knob, Rating, ColorPicker, SignaturePad, Editor) take `ariaLabel` / `ariaLabelledBy`.
- **Animations honour reduced motion** already; don't add JS to disable them.

## Component index

Import from `@wirabyte/ui/<entry>`. Before using a component you haven't used in this session, read its file: **`references/<folder>/<entry>.md`**, one file per component (1–6 KB: import, inputs, outputs, slots, examples, gotchas). In folders that have a `_shared.md`, read it once too; it holds the rules every component there follows. Read only the files you need. Examples are v3-style (`<ng-template #x>`, `@if`); for v1/v2 apply the conversions in the version table above.

| Folder | Components (selector), file = entry unless noted |
|---|---|
| `forms/` + `_shared.md` | InputText `input[wuInputText]` · Textarea `textarea[wuTextarea]` · InputNumber `wu-inputnumber` · InputMask `wu-inputmask` · InputOtp `wu-inputOtp` · Password `wu-password` · KeyFilter `[wuKeyFilter]` · FloatLabel `wu-floatlabel` · IconField `wu-iconfield` · InputGroup `wu-inputgroup` · Validation `wu-field-error`, `WuValidators`, `wuThaiId` `wuThaiPhone` `wuMatch` · Select `wu-select` · MultiSelect `wu-multiselect` · AutoComplete `wu-autocomplete` · Listbox `wu-listbox` · TreeSelect `wu-treeselect` · Checkbox `wu-checkbox` · RadioButton `wu-radiobutton` · ToggleSwitch `wu-toggleswitch` · ToggleButton `wu-togglebutton` · SelectButton `wu-selectbutton` · DatePicker `wu-datepicker` · FileUpload `wu-fileupload` · Editor `wu-editor` · ColorPicker `wu-colorpicker` · Slider `wu-slider` · Knob `wu-knob` · Rating `wu-rating` · SignaturePad `wu-signature-pad` |
| `table/` (by task) | `wu-table`: `overview.md` (basic, sorting, client paging, responsive, empty/loading, typical admin list) · `filter.md` (global search, column filters) · `lazy.md` (server-side paging, what fires `onLazyLoad`) · `selection.md` (selection, row expansion, row groups, context menu) · `layout.md` (frozen, scroll, resize, reorder, `stateKey`) · `editing.md` · `export.md` (CSV, Excel) · `api.md` (every input/output/template/method/token, not-built list) · `paginator.md` (`wu-paginator`) |
| `data/` + `_shared.md` | Tree `wu-tree` · PickList `wu-picklist` · OrderList `wu-orderlist` · Scheduler `wu-scheduler` · Scroller `wu-scroller` · Timeline `wu-timeline` · Descriptions `wu-descriptions` |
| `navigation/` | `menuitem.md` (the `MenuItem` model all menus share) · Navbar `wu-navbar` · AsideMenu `wu-aside-menu` (+ app shell recipe) · Menubar `wu-menubar` · Menu `wu-menu` · TabMenu `wu-tabmenu` · PanelMenu `wu-panelmenu` · TieredMenu `wu-tieredmenu` · ContextMenu `wu-contextmenu` · Breadcrumb `wu-breadcrumb` · Steps `wu-steps` · Dock `wu-dock` · BottomBar `wu-bottombar` · SiteFooter `wu-site-footer` |
| `overlay/` + `_shared.md` | `services.md` (where `WuMessageService`, `WuConfirmationService`, `WuAlertService`, `WuDialogService` come from) · Dialog `wu-dialog` · ConfirmDialog `wu-confirmdialog` · AlertDialog `WuAlertService` → `alertdialog.md` · Drawer `wu-drawer` · Popover `wu-popover` · Tooltip `[wuTooltip]` · Toast `wu-toast` · Message `wu-message` · BlockUI `wu-blockui` · ProgressBar `wu-progressbar` · ProgressSpinner `wu-progress-spinner` · Skeleton `wu-skeleton` · EmptyState `wu-empty-state` · ErrorPage `wu-error-page` · Result `wu-result` |
| `layout/` | Button `wu-button` / `[wuButton]` · SplitButton `wu-splitbutton` · Card `wu-card` · Panel `wu-panel` · Fieldset `wu-fieldset` · Accordion `wu-accordion` · Tabs `wu-tabs` · Stepper `wu-stepper` · Inplace `wu-inplace` · Toolbar `wu-toolbar` · Divider `wu-divider` · ScrollPanel `wu-scrollpanel` · Splitter `wu-splitter` |
| `display/` + `_shared.md` | Avatar `wu-avatar` · Badge `wu-badge` · Chip `wu-chip` · Tag `wu-tag` · MeterGroup `wu-metergroup` · Stat `wu-stat` · Chat `wu-chat` · Terminal `wu-terminal` · Image `wu-image` · ImageCropper `wu-imagecropper` · ImageCompare `wu-imageCompare` · Carousel `wu-carousel` · Galleria `wu-galleria` |
| `charts/` + `_shared.md` | Chart `wu-chart` → `chart.md` (v3 own engine; Chart.js wrapper on v1/v2) · ChartJS `wu-chartjs` · Flow `wu-flow` · OrganizationChart `wu-organizationChart` |
| `helpers/` | Thai pipes `wuDate` `wuTimeAgo` `wuBahtText` `wuThaiPhone` `wuThaiId` `wuThaiDigits` → `thai-pipes.md` (entry `thai`) · Excel `downloadExcel()` `buildExcel()` · DragDrop `[wuDraggable]` `[wuDroppable]` · Ripple `[wuRipple]` · Animate `[data-aos]` / `provideWuAnimate()` |
| `theming/` | `setup.md` (theme routes SCSS / CSS / TS, presets per major, tokens, layers, dark mode, scale, `WuThemeService`, old variable names) · `icons.md` (`@wirabyte/icons`) · `utils.md` (utility classes, `@wirabyte/ui/utils`) |
| `migration.md` | Moving a PrimeNG app over: `from-primeng` schematic, tag/module mapping, kept class names and CSS variables |

Entries not obvious from the name: `asidemenu`, `sitefooter`, `emptystate`, `errorpage`, `progressspinner`, `signaturepad`, `inputotp`, `imagecropper`, `imagecompare`, `organizationchart`, `alert` (AlertDialog), `validation` (WuFieldError / WuValidationModule), `thai` (WuThaiModule).
