# Moving a PrimeNG app to WiraUI

Contents: plan · the `from-primeng` schematic · component mapping table · tag spellings and p-* aliases · kept CSS classes and variables · theme moves · gotchas.

WiraUI is built so existing templates move with little change: input names mirror PrimeNG, `p-*` classes and theme variables keep working, and WiraUI has no global reset, so pages you have not moved stay as they are. Move page by page next to the old library; there is no CSS rewrite before you start.

## Step-by-step plan

1. **Install next to what you have.** Check the Angular major first (v1 = Angular 15–17, v2 = 18–20, v3 = 21+; see SKILL.md), then `ng add @wirabyte/ui[@1|@2] --defaults` (or explicit flags). Pick the theme closest to the current one (v1 e.g. `sila-light-teal`, v2 e.g. `mali`). `--theme` also accepts the theme / preset names your team already knows and picks the matching one. Do NOT remove PrimeNG yet.
2. **Move one page at a time**, starting with pages that use few components.
3. **Swap tags and imports** to `wu-*` and `WuXxxModule` / `WuXxx` (by hand, or with the schematic below); most inputs keep their names.
4. **Keep your CSS.** Rules that target the `p-*` classes or read the theme variables still apply. Switch to `--wu-*` tokens later, when convenient.
5. **Remove the old library** (package.json, its theme CSS in angular.json) once no page uses it.

Notes:
- Work you wait for (saving, submitting) moves to `[action]` on `wu-button`, with no loading flag to keep. Example after: `<wu-button label="บันทึก" icon="wi wi-save" [action]="save"></wu-button>`; `<input wuInputText name="name" [(ngModel)]="name" />`; `<wu-checkbox name="agree" [(ngModel)]="agree" [binary]="true" label="ยอมรับเงื่อนไข"></wu-checkbox>`; `<wu-card header="โปรไฟล์">…</wu-card>`.
- `pi pi-x` icons: replace the prefix with `wi wi-x` (templates, menu data, `icon="…"`); see theming/icons.md.
- No more `::ng-deep` or `!important`: app CSS always beats WiraUI's `@layer`. Move to tokens such as `--wu-card-body-gap` as you touch each page.
- Utility CSS: the migration page says utility CSS, grid libraries and Tailwind keep working and WiraUI ships no clashing utility classes; WiraUI's own utility classes (`@wirabyte/ui/utils`) are opt-in (`--utils`, default true in `ng add`; use `$prefix` to run next to another library).

## The `from-primeng` schematic (optional)

Rewrites the code in place. Source: `packages/schematics/src/from-primeng/` (`index.ts`, `mapping.ts`, `schema.json`).

```bash
ng g @wirabyte/ui:from-primeng --dry-run                       # show the changes, write nothing (Angular CLI flag; run this first)
ng g @wirabyte/ui:from-primeng                                 # whole workspace
ng g @wirabyte/ui:from-primeng --path=src/app/admin            # one folder
ng g @wirabyte/ui:from-primeng --templates=false               # imports only, leave templates
```
(`--dry-run` is the Angular CLI's standard schematic flag; the migration page documents it for this command.)

**Options** (schema.json)
- `--path`: string — folder to migrate, e.g. `src/app/admin`. Default: the whole workspace.
- `--templates`: boolean = `true` — rename `<p-…>` tags in templates as well as the imports. `false` skips `.html` files AND inline `template:` strings.

**What it rewrites**
- **TypeScript imports** from `primeng/<entry>` become `@wirabyte/ui/<entry>` (one import line per WiraUI entry), with NgModules and classes renamed (`DropdownModule` → `WuSelectModule`, `Table` → `WuTable`) and the uses of renamed names in the same file updated (not property names / object keys). `import type` and `as` aliases are kept. Services keep their names.
- **Templates**: `<p-x …>` / `</p-x>` → `<wu-x …>` in `.html` files and in inline `template:` literals, when `wu-x` is a known WiraUI tag (the known-tag list includes PrimeNG's own spellings, e.g. `p-inputSwitch` → `wu-inputSwitch`).
- Scans `.ts` (not `.d.ts`) and `.html`; skips `node_modules`, `dist`, `.angular`, `.git`.

**What it leaves alone** (WiraUI reads them): attributes (`pButton`, `pTemplate`, `pTooltip`, …) and `p-*` classes.

**What it cannot move** — left untouched and listed at the end as "Left for you":
- imports that are not named imports (default / namespace) from `primeng/*`;
- a name from `primeng/*` with no WiraUI counterpart (the rest of that import is still moved; the leftover stays in a `primeng/<entry>` import);
- `<p-…>` tags with no WiraUI tag. Reported as "not in WiraUI yet" for: `cascadeSelect`, `chips`, `confirmPopup`, `dataView`, `megaMenu`, `scrollTop`, `speedDial`, `treeTable`, `triStateCheckbox`; otherwise "no WiraUI tag".

It does NOT touch package.json, angular.json, theme CSS, `provideWiraUI`, or the `ng add` setup; after the run it prints: "Next: ng add @wirabyte/ui (if not done), then remove primeng and its theme CSS from package.json / angular.json when nothing uses them." It also does not convert loading flags to `[action]`.

**Renames it applies** (PrimeNG name, module and class without `Module` → WiraUI name; entry point renames in parentheses): Dropdown → Select (`dropdown` → `select`) · Calendar → DatePicker (`calendar` → `datepicker`) · InputSwitch → ToggleSwitch (`inputswitch` → `toggleswitch`) · OverlayPanel → Popover (`overlaypanel` → `popover`) · Sidebar → Drawer (`sidebar` → `drawer`) · TabView → Tabs (`tabview` → `tabs`) · InputTextarea → Textarea (`inputtextarea` → `textarea`) · Messages → Message (`messages` → `message`) · VirtualScroller → Scroller (`virtualscroller` → `scroller`) · AvatarGroup → Avatar (`avatargroup` → `avatar`) · InputIcon → IconField (`inputicon` → `iconfield`) · InputGroupAddon → InputGroup (`inputgroupaddon` → `inputgroup`) · AnimateOnScroll → Animate (`animateonscroll` → `animate`) · DynamicDialog → Dialog (`dynamicdialog` → `dialog`). Module/class names get the `Wu` prefix (`wuName`), only if the target module exists in WiraUI.

**Other symbols** (PrimeNG → WiraUI name, WiraUI entry) — services keep their names:
- `primeng/api`: `MessageService`, `ConfirmationService`, `ConfirmEventType`, `MenuItem`, `MenuItemCommandEvent`, `TreeNode`, `SharedModule`, `Message`, `ToastMessageOptions`, `Confirmation` → same name from `@wirabyte/ui/api`; `PrimeTemplate` → `WuTemplate` (api); `PrimeNGConfig` → `WuConfig` (`@wirabyte/ui/config`); `LazyLoadEvent` → `WuTableLazyLoadEvent`, `FilterMatchMode`, `SortMeta`, `FilterMetadata` → `FilterMeta` (all `@wirabyte/ui/table`)
- `primeng/dynamicdialog`: `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` → same names from `@wirabyte/ui/dialog`
- `primeng/table`: `Table` → `WuTable`, `TableLazyLoadEvent` → `WuTableLazyLoadEvent`, `TableRowSelectEvent` → `WuTableRowSelectEvent`
- class renames: `Dropdown` / `Select` → `WuSelect`, `Calendar` / `DatePicker` → `WuDatePicker`, `OverlayPanel` / `Popover` → `WuPopover`, `Menu` → `WuMenu`, `Dialog` → `WuDialog`, `FileUpload` → `WuFileUpload`, `Paginator` → `WuPaginator`

Review the diff afterwards (git), build, and fix the "Left for you" list by hand.

## Mapping table (PrimeNG component → WiraUI)

WiraUI tag · NgModule · standalone · notes. Most changes are only the tag prefix. Full per-component API is in the other reference files.

| Component | Tag / directive | NgModule · Standalone | Notes |
|---|---|---|---|
| Button | `<wu-button>` | `WuButtonModule` · `WuButton` | `[action]` handles loading and double clicks; `severity="warning"` still works |
| Card | `<wu-card>` | `WuCardModule` · `WuCard` | Slots are attributes: `[wuCardHeader]`, `[wuCardActions]`, `[wuCardFooter]` |
| InputText | `input[wuInputText]` | `WuInputTextModule` · `WuInputText` | Size is `wuSize`, because `size` is a native input attribute |
| Textarea | `textarea[wuTextarea]` | `WuTextareaModule` · `WuTextarea` | `autoResize` also follows values set from code |
| Checkbox | `<wu-checkbox>` | `WuCheckboxModule` · `WuCheckbox` | `binary`, `value`, `trueValue` / `falseValue` |
| RadioButton | `<wu-radiobutton>` | `WuRadioButtonModule` · `WuRadioButton` | Radios sharing a FormControl update each other |
| ToggleSwitch | `<wu-toggleswitch>` | `WuToggleSwitchModule` · `WuToggleSwitch` | Built-in label; `<wu-inputSwitch>` works too |
| Translations | `WuConfig.setTranslation()` | | Thai is the default |
| Tag · Badge · Chip · Avatar · Divider · Skeleton · ProgressBar · Message · Panel · Fieldset | `<wu-tag>` · `<wu-badge>` … | `WuTagModule` · `WuTag` … | Same pattern; ProgressSpinner uses `<wu-progress-spinner>` (or `<wu-progressSpinner>`) |
| DatePicker | `<wu-datepicker>` | `WuDatePickerModule` · `WuDatePicker` | `dateFormat="dd/mm/yy"` as before; years show in the Buddhist era; no `appendTo` needed; `<wu-calendar>` works too |
| Dialog · ConfirmDialog | `<wu-dialog>` · `<wu-confirmdialog>` | `WuDialogModule` · `WuConfirmDialogModule` | Slots via `#footer` or the slot attribute templates already use; no `appendTo` or z-index |
| Toast · Tooltip · Popover | `<wu-toast>` · `[wuTooltip]` · `<wu-popover>` | `WuToastModule` · `WuTooltipModule` · `WuPopoverModule` | Services keep their names in one import: `@wirabyte/ui/api` |
| AlertDialog | `WuAlert.fire()` | `WuAlertService` · `WuAlert` | Code that called a global alert function changes only its import |
| Animate on scroll | `data-aos="…"` | `provideWuAnimate()` | The `data-aos` attributes you already use work as they are |
| Select (was `p-dropdown` / `p-select`) | `<wu-select>` | `WuSelectModule` · `WuSelect` | Same option inputs and templates; `appendTo`, `virtualScroll` and `autoDisplayFirst` are accepted and ignored |
| Table (was `p-table`) | `<wu-table>` | `WuTableModule` · `WuTable` | Templates (`pTemplate`), `pSortableColumn`, `pSelectableRow`, `pFrozenColumn`, `pRowToggler`, `pReorderableRow`, `pEditableColumn` / `pEditableRow`, `pResizableColumn` / `pReorderableColumn`, row groups, column filters and their menu (`wu-columnFilter`), `stateKey`, `exportCSV()` and the context menu (`pContextMenuRow`) keep working, as do the `p-datatable-*` classes; virtual scroll is not built yet |
| Accordion · Tabs | `<wu-accordion-tab>` · `<wu-tabs>` `<wu-tab-panel>` | `WuAccordionModule` · `WuTabsModule` | Old tags work too: `<wu-accordionTab>`, `<wu-tabView>` / `<wu-tabPanel>`; by value with `wu-accordion-panel` / `-header` / `-content` and `wu-tablist` / `wu-tab` / `wu-tabpanels` |
| MultiSelect | `<wu-multiselect>` (or `<wu-multiSelect>`) | `WuMultiSelectModule` · `WuMultiSelect` | `defaultLabel`, `maxSelectedLabels`, `selectedItemsLabel`, `display="chip"` and the `selectedItems` template work as before; `appendTo` accepted and ignored |
| AutoComplete | `<wu-autocomplete>` (or `<wu-autoComplete>`) | `WuAutoCompleteModule` · `WuAutoComplete` | `suggestions`, `completeMethod`, `delay`, `minLength`, `dropdown`, `forceSelection` and `field` (`optionLabel`) as before; `optionValue` and `multiple` are not built yet |
| InputMask | `<wu-inputmask>` (or `<wu-inputMask>`) | `WuInputMaskModule` · `WuInputMask` | `mask`, `slotChar`, `autoClear`, `unmask` and `onComplete` as before; Thai digits count as 0–9 |
| Menubar · Menu · TabMenu | `<wu-menubar>` · `<wu-menu>` · `<wu-tabmenu>` | `WuMenubarModule` · `WuMenuModule` · `WuTabMenuModule` | `MenuItem` models move over unchanged (`MenuItem` from `@wirabyte/ui/api`); popups open in the top layer, so `appendTo` is accepted and ignored |
| PanelMenu · Steps | `<wu-panelmenu>` (or `<wu-panelMenu>`) · `<wu-steps>` | `WuPanelMenuModule` · `WuStepsModule` | `MenuItem` models with `expanded`, `multiple`, `activeIndex` and `readonly` work as before; the value-based stepper is the Stepper row |
| Stepper | `<wu-stepper>` · `<wu-step-list>` · `<wu-step>` · `<wu-step-panels>` · `<wu-step-panel>` · `<wu-step-item>` | `WuStepperModule` · `WuStepper` | `[(value)]`, `[linear]` and `#content` templates with `activateCallback` work as before |
| PickList · OrderList | `<wu-picklist>` (or `<wu-pickList>`) · `<wu-orderlist>` (or `<wu-orderList>`) | `WuPickListModule` · `WuOrderListModule` | `source` / `target` / `value` are changed in place as before; `dragdrop`, `filterBy`, the item template and the move events keep their names |
| FileUpload | `<wu-fileupload>` (or `<wu-fileUpload>`) | `WuFileUploadModule` · `WuFileUpload` | `chooseLabel`, `maxFileSize`, `accept`, `customUpload` with `uploadHandler`, `mode="basic"`, the content / empty templates and `clear()` work as before; messages follow the locale |
| Editor | `<wu-editor>` | `WuEditorModule` · `WuEditor` | The HTML value (null when empty), `[style]` height, the header template with `ql-*` buttons and the stored `ql-*` classes work as before; nothing else to install |
| Ripple · KeyFilter · Badge | `[wuRipple]` · `[wuKeyFilter]` · `[wuBadge]` | `WuRippleModule` · `WuKeyFilterModule` · `WuBadgeModule` | `pRipple`, `pKeyFilter` (with `pValidateOnly`) and `pBadge` keep their attribute names |
| Slider · ColorPicker | `<wu-slider>` · `<wu-colorPicker>` | `WuSliderModule` · `WuColorPickerModule` | ngModel values (`[from, to]` for a range; hex, rgb or hsb colours), `onChange` / `onSlideEnd` and the panel keys work as before |
| Listbox · TreeSelect | `<wu-listbox>` · `<wu-treeSelect>` | `WuListboxModule` · `WuTreeSelectModule` | Option fields, groups, multiple / checkbox, filter and the item / value templates keep their names; the TreeSelect panel opens in the top layer |
| SplitButton | `<wu-splitButton>` | `WuSplitButtonModule` · `WuSplitButton` | `model`, `severity` and the variants, `buttonDisabled` / `menuButtonDisabled` and the menu events work as before; `appendTo` not needed |
| Tree · Scroller | `<wu-tree>` · `<wu-scroller>` | `WuTreeModule` · `WuScrollerModule` | `TreeNode` (from `@wirabyte/ui/api`), the three selection modes, filter, lazy children and per-type templates; the scroller draws only rows in view, with lazy loading |
| Galleria | `<wu-galleria>` | `WuGalleriaModule` · `WuGalleria` | Thumbnails, indicators, item navigators, `autoPlay`, `responsiveOptions`, full screen with `[(visible)]` and the item / thumbnail / caption templates |
| Breadcrumb · TieredMenu · ContextMenu | `<wu-breadcrumb>` · `<wu-tieredMenu>` · `<wu-contextMenu>` | `WuBreadcrumbModule` · `WuTieredMenuModule` · `WuContextMenuModule` | `MenuItem` models, `home`, popup / `toggle()`, `target` / `global` and `show(event)` work as before; menus open in the top layer |
| ScrollPanel · Inplace | `<wu-scrollPanel>` · `<wu-inplace>` | `WuScrollPanelModule` · `WuInplaceModule` | `[style]` height, `scrollTop()` and `refresh()`; Inplace uses display / content templates (or `pInplaceDisplay` / `pInplaceContent`) and `closable` |
| Drawer · BlockUI | `<wu-drawer>` (or `<wu-sidebar>`) · `<wu-blockUI>` | `WuDrawerModule` · `WuBlockUIModule` | `[(visible)]`, `position`, `modal`, `dismissible`, header / footer templates; `[blocked]` and `[target]`; both live in the top layer, so `appendTo` and the z-index inputs are ignored |
| DragDrop | `[wuDraggable]` · `[wuDroppable]` | `WuDragDropModule` | `pDraggable`, `pDroppable`, `dragHandle`, the effects and every event keep their names |
| Steps · TabMenu | `<wu-steps>` (or `<wu-stepper [model]>`) · `<wu-tabMenu>` (or `<wu-tabs [model]>`) | `WuStepsModule` · `WuStepperModule` · `WuTabMenuModule` · `WuTabsModule` | Both old tags keep working; for new code one component does both: `wu-stepper` draws a steps bar from a menu model, `wu-tabs` is a tab menu with `[model]` and `[(activeItem)]` |
| Hand-built top bar and side menu | `<wu-navbar [aside]="side">` · `<wu-aside-menu #side>` | `WuNavbarModule` · `WuAsideMenuModule` | A menubar plus hamburger button and a panel-menu sidebar with media queries become two components: the side menu opens the group of the current page, collapses to icons and becomes an off-canvas panel on phones, and the navbar's menu button drives it |
| Image cropper | `<image-cropper>` (or `<wu-imagecropper>`) | `WuImageCropperModule` · `WuImageCropper` | The `image-cropper` tag apps already use keeps its inputs, outputs and `ImageCroppedEvent`; the result is a blob by default, so code that reads `event.base64` sets `output="base64"` |
| Terminal · ImageCompare | `<wu-terminal>` · `<wu-imageCompare>` | `WuTerminalModule` · `WuImageCompareModule` | `TerminalService` under its old name (provided in root), `welcomeMessage`, `prompt`, ↑ ↓ history and `clear`; the left / right templates of the compare keep their names |
| Carousel · Splitter | `<wu-carousel>` · `<wu-splitter>` | `WuCarouselModule` · `WuSplitterModule` | Every carousel input and `onPage`, with the item / header / footer templates; splitter panels as `wu-splitter-panel` or the `pTemplate="panel"` templates, `panelSizes`, `minSizes` and `stateKey` |
| OrganizationChart | `<wu-organizationChart>` | `WuOrganizationChartModule` · `WuOrganizationChart` | The same `TreeNode` data, single / multiple selection, `collapsible`, `preserveSpace` and templates named after node types |
| Knob · InputOtp | `<wu-knob>` · `<wu-inputOtp>` | `WuKnobModule` · `WuInputOtpModule` | ngModel and reactive forms, the same inputs and events; the one-time code boxes take paste and SMS autofill, and the input template keeps `let-token` / `let-events` |
| Messages | `<wu-messages>` | `WuMessagesModule` · `WuMessages` | `enableService` is still on by default: set `[enableService]="false"` when a toast already shows those messages |
| Chart | `<wu-chart>` · `<wu-chartjs>` | `WuChartModule` · `WuChartJsModule` | `type`, `data`, `options`, `width` and `height` as before. v1 / v2: `wu-chart` is the Chart.js chart (the app installs chart.js 3 or 4). v3: `wu-chart` is WiraUI's own chart, no library, same data and options; keep `wu-chartjs` for Chart.js plugins |
| Image | `<wu-image>` | `WuImageModule` · `WuImage` | `preview`, `imageClass` and `onImageError` as before; the preview opens in the top layer, so `appendTo` is accepted and ignored |
| Timeline | `<wu-timeline>` | `WuTimelineModule` · `WuTimeline` | The content / opposite / marker templates and `align` / `layout` as before |
| Paginator | `<wu-paginator>` | `WuPaginatorModule` · `WuPaginator` | `onPageChange` gives a 0-based page; `dropdownAppendTo` is accepted and ignored |

(`WuMessages` and `WuMessagesModule` — an alias of `WuMessageModule` — are both exported from `@wirabyte/ui/message`; there is no `messages` entry.)

PrimeNG tags with no WiraUI counterpart yet (the schematic reports them): `cascadeSelect`, `chips`, `confirmPopup`, `dataView`, `megaMenu`, `scrollTop`, `speedDial`, `treeTable`, `triStateCheckbox`.

## Kept tag spellings and p-* attributes

Every component takes its tag in the camelCase spelling older templates use AND in kebab case, so `p-inputNumber` becomes `wu-inputNumber` (or `wu-input-number`, or `wu-inputnumber`) with nothing else to change. Older names kept too: `wu-calendar`, `wu-inputSwitch`, `wu-progressSpinner`, `wu-accordionTab`, `wu-tabView` / `wu-tabPanel`.

| Kebab / canonical | CamelCase, as before |
|---|---|
| `wu-input-number` | `wu-inputNumber` |
| `wu-radio-button` | `wu-radioButton` |
| `wu-check-box` · `wu-checkbox` | `wu-checkBox` |
| `wu-toggle-button` | `wu-toggleButton` |
| `wu-select-button` | `wu-selectButton` |
| `wu-progress-bar` | `wu-progressBar` |
| `wu-progress-spinner` | `wu-progressSpinner` |
| `wu-input-group` · `wu-input-group-addon` | `wu-inputGroup` · `wu-inputGroupAddon` |
| `wu-icon-field` · `wu-input-icon` | `wu-iconField` · `wu-inputIcon` |
| `wu-float-label` | `wu-floatLabel` |
| `wu-date-picker` · `wu-input-mask` | `wu-datePicker` · `wu-inputMask` |
| `wu-meter-group` · `wu-avatar-group` | `wu-meterGroup` · `wu-avatarGroup` |
| `wu-split-button` · `wu-color-picker` | `wu-splitButton` · `wu-colorPicker` |
| `wu-listbox` · `wu-tree-select` | `wu-listBox` · `wu-treeSelect` |
| `wu-tiered-menu` · `wu-context-menu` | `wu-tieredMenu` · `wu-contextMenu` |
| `wu-scroll-panel` · `wu-block-ui` | `wu-scrollPanel` · `wu-blockUI` |
| `wu-scroller` · `wu-drawer` | `wu-virtualScroller` · `wu-sidebar` |
| `wu-image-compare` · `wu-organization-chart` | `wu-imageCompare` · `wu-organizationChart` |
| `wu-input-otp` · `wu-splitter-panel` | `wu-inputOtp` · `wu-splitterPanel` |
| `[wuDraggable]` · `[wuDroppable]` | `[pDraggable]` · `[pDroppable]` |
| `textarea[wuTextarea]` | `textarea[pInputTextarea]` · `[wuInputTextarea]` · `[pTextarea]` · `[pInputText]` |

Attribute directives keep their PrimeNG names: `pInputText`, `pInputTextarea`, `pTextarea`, `pRipple`, `pKeyFilter`, `pBadge`, `pTemplate` (plus those named in the table: `pButton`/`pTooltip` are read per the schematic note; `pSortableColumn`, `pSelectableRow`, `pFrozenColumn`, `pRowToggler`, `pReorderableRow`, `pEditableColumn`, `pEditableRow`, `pResizableColumn`, `pReorderableColumn`, `pContextMenuRow`, `pDraggable`, `pDroppable`, `pInplaceDisplay`, `pInplaceContent`, `pValidateOnly`). Slot syntax in new code: v3 `<ng-template #x>`, v1/v2 `<ng-template wuTemplate="x">`; `pTemplate` is read too.

## Kept CSS classes and variables

Templates carry the `p-*` class names the existing app already uses next to the `wu-*` classes, and theme files define the CSS variables it already reads.

| | v1 (Angular 15–17) | v2 / v3 |
|---|---|---|
| Classes in templates | `p-button`, `p-button-warning`, `p-card-body`, `p-checkbox-box.p-highlight`, `p-inputswitch` … | `p-button`, `p-button-warn`, `p-card-body`, `p-checkbox-checked`, `p-toggleswitch` … |
| Theme variables | `--primary-color`, `--surface-ground`, `--surface-border`, `--text-color`, `--green-500` … | `--p-primary-color`, `--p-surface-0` … `--p-surface-950`, `--p-content-border-radius`, `--p-<color>-<shade>`; a `--p-card-body-gap` set by your app is honoured too |

```css
/* existing app styles.css still works */
/* v1 */
.p-button.p-button-warning { font-weight: 600; }
.p-card .p-card-body { padding: 1rem; }
.student-name { color: var(--primary-color); border-color: var(--surface-border); }
.page { background: var(--surface-ground); color: var(--text-color); }
/* v2 / v3 */
.p-button.p-button-warn { font-weight: 600; }
:root { --p-card-body-gap: 0; }
.panel { border-radius: var(--p-content-border-radius); background: var(--p-surface-0); }
.badge-ok { color: var(--p-green-500); }
/* recommended from now on: set the token once, no ::ng-deep / !important */
:root { --wu-card-body-gap: 0; }
```
Other kept classes named in the docs: `p-ripple` (beside `wu-ripple`), `p-draggable` / `p-droppable` (beside the `wu-*` ones), `p-draggable-enter` (beside `wu-droppable-over`), `p-datatable-*` on the table. The full variable alias list is in theming/setup.md.

## Moving the theme

- **v1**: load `@wirabyte/ui/themes/sila-light-teal/theme.css` (or another theme folder) instead of your current theme file. `ng add @wirabyte/ui@1 --theme` accepts the theme name your team already uses and writes the matching one.
- **v2 / v3**: presets come from `@wirabyte/ui/presets` (`Mali`, `Sila`, `Material`, `Phet` …); `ng add --theme` accepts the preset name your team already uses and picks the matching one. Keep your `darkModeSelector`.
- A theme exported from an old designer can be rebuilt in the WiraUI Studio (docs site, `theming/studio`) with the same primary colour and font, then exported as SCSS or CSS.

## Gotchas

- Migrate within the Angular range: the major must match the Angular version (SKILL.md). Never upgrade across ranges with a flag hack.
- `appendTo`, z-index inputs, `virtualScroll` / `autoDisplayFirst` (Select), `dropdownAppendTo` and similar PrimeNG inputs are accepted and ignored (overlays live in the top layer).
- Not built yet (per the migration page): table virtual scroll; AutoComplete `optionValue` and `multiple`; the PrimeNG components listed under "no WiraUI counterpart yet".
- Chart: v3 `wu-chart` needs no library; v1/v2 `wu-chart` needs chart.js 3 or 4 installed by the app.
- Messages: `enableService` defaults on; turn it off when a toast already shows the same messages.
- Image cropper: result is a blob by default; set `output="base64"` if code reads `event.base64`.
- Run the schematic with `--dry-run` first, on a clean git tree, then review the diff and the "Left for you" list.
