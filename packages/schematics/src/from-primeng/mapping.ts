/**
 * What `ng g @wirabyte/ui:from-primeng` changes: PrimeNG entry points, NgModules, classes and tags, and their WiraUI
 * names. test/from-primeng.test.ts checks every target here against the real WiraUI sources.
 */

/** PrimeNG names (module and class, without `Module`) whose WiraUI name differs. */
export const NAME_RENAMES: Record<string, string> = {
  Dropdown: 'Select',
  Calendar: 'DatePicker',
  InputSwitch: 'ToggleSwitch',
  OverlayPanel: 'Popover',
  Sidebar: 'Drawer',
  TabView: 'Tabs',
  InputTextarea: 'Textarea',
  Messages: 'Message',
  VirtualScroller: 'Scroller',
  AvatarGroup: 'Avatar',
  InputIcon: 'IconField',
  InputGroupAddon: 'InputGroup',
  AnimateOnScroll: 'Animate',
  DynamicDialog: 'Dialog',
};

/** PrimeNG entry point → WiraUI entry point where they differ (`primeng/dropdown` → `@wirabyte/ui/select`). */
export const ENTRY_RENAMES: Record<string, string> = {
  dropdown: 'select',
  calendar: 'datepicker',
  inputswitch: 'toggleswitch',
  overlaypanel: 'popover',
  sidebar: 'drawer',
  tabview: 'tabs',
  inputtextarea: 'textarea',
  messages: 'message',
  virtualscroller: 'scroller',
  avatargroup: 'avatar',
  inputicon: 'iconfield',
  inputgroupaddon: 'inputgroup',
  animateonscroll: 'animate',
  dynamicdialog: 'dialog',
};

/** WiraUI entry points and their NgModules. */
export const WU_MODULES: Record<string, string[]> = {
  accordion: ['WuAccordionModule'],
  alert: ['WuAlertModule'],
  animate: ['WuAnimateModule'],
  autocomplete: ['WuAutoCompleteModule'],
  avatar: ['WuAvatarModule'],
  badge: ['WuBadgeModule'],
  blockui: ['WuBlockUIModule'],
  breadcrumb: ['WuBreadcrumbModule'],
  button: ['WuButtonModule'],
  card: ['WuCardModule'],
  carousel: ['WuCarouselModule'],
  // v1 / v2: the Chart.js chart; v3: WiraUI's own, which takes Chart.js data and options.
  chart: ['WuChartModule'],
  chartjs: ['WuChartJsModule'],
  checkbox: ['WuCheckboxModule'],
  chip: ['WuChipModule'],
  colorpicker: ['WuColorPickerModule'],
  confirmdialog: ['WuConfirmDialogModule'],
  contextmenu: ['WuContextMenuModule'],
  datepicker: ['WuDatePickerModule'],
  dialog: ['WuDialogModule'],
  divider: ['WuDividerModule'],
  dock: ['WuDockModule'],
  dragdrop: ['WuDragDropModule'],
  drawer: ['WuDrawerModule'],
  editor: ['WuEditorModule'],
  fieldset: ['WuFieldsetModule'],
  fileupload: ['WuFileUploadModule'],
  floatlabel: ['WuFloatLabelModule'],
  galleria: ['WuGalleriaModule'],
  iconfield: ['WuIconFieldModule'],
  image: ['WuImageModule'],
  imagecompare: ['WuImageCompareModule'],
  inplace: ['WuInplaceModule'],
  inputgroup: ['WuInputGroupModule'],
  inputmask: ['WuInputMaskModule'],
  inputnumber: ['WuInputNumberModule'],
  inputotp: ['WuInputOtpModule'],
  inputtext: ['WuInputTextModule'],
  keyfilter: ['WuKeyFilterModule'],
  knob: ['WuKnobModule'],
  listbox: ['WuListboxModule'],
  menu: ['WuMenuModule'],
  menubar: ['WuMenubarModule'],
  message: ['WuMessageModule'],
  metergroup: ['WuMeterGroupModule'],
  multiselect: ['WuMultiSelectModule'],
  orderlist: ['WuOrderListModule'],
  organizationchart: ['WuOrganizationChartModule'],
  paginator: ['WuPaginatorModule'],
  panel: ['WuPanelModule'],
  panelmenu: ['WuPanelMenuModule'],
  password: ['WuPasswordModule'],
  picklist: ['WuPickListModule'],
  popover: ['WuPopoverModule'],
  progressbar: ['WuProgressBarModule'],
  progressspinner: ['WuProgressSpinnerModule'],
  radiobutton: ['WuRadioButtonModule'],
  rating: ['WuRatingModule'],
  ripple: ['WuRippleModule'],
  scroller: ['WuScrollerModule'],
  scrollpanel: ['WuScrollPanelModule'],
  select: ['WuSelectModule'],
  selectbutton: ['WuSelectButtonModule'],
  skeleton: ['WuSkeletonModule'],
  slider: ['WuSliderModule'],
  splitbutton: ['WuSplitButtonModule'],
  splitter: ['WuSplitterModule'],
  stepper: ['WuStepperModule'],
  steps: ['WuStepsModule'],
  table: ['WuTableModule'],
  tabmenu: ['WuTabMenuModule'],
  tabs: ['WuTabsModule'],
  tag: ['WuTagModule'],
  terminal: ['WuTerminalModule'],
  textarea: ['WuTextareaModule'],
  tieredmenu: ['WuTieredMenuModule'],
  timeline: ['WuTimelineModule'],
  toast: ['WuToastModule'],
  togglebutton: ['WuToggleButtonModule'],
  toggleswitch: ['WuToggleSwitchModule'],
  toolbar: ['WuToolbarModule'],
  tooltip: ['WuTooltipModule'],
  tree: ['WuTreeModule'],
  treeselect: ['WuTreeSelectModule'],
};

/**
 * Other names apps import from PrimeNG, by entry: `[PrimeNG name, WiraUI name, WiraUI entry]`. The services keep
 * their PrimeNG names (WiraUI exports them too).
 */
export const SYMBOLS: Record<string, [string, string, string][]> = {
  api: [
    ['MessageService', 'MessageService', 'api'],
    ['ConfirmationService', 'ConfirmationService', 'api'],
    ['ConfirmEventType', 'ConfirmEventType', 'api'],
    ['MenuItem', 'MenuItem', 'api'],
    ['MenuItemCommandEvent', 'MenuItemCommandEvent', 'api'],
    ['TreeNode', 'TreeNode', 'api'],
    ['SharedModule', 'SharedModule', 'api'],
    ['Message', 'Message', 'api'],
    ['ToastMessageOptions', 'ToastMessageOptions', 'api'],
    ['Confirmation', 'Confirmation', 'api'],
    ['PrimeTemplate', 'WuTemplate', 'api'],
    ['PrimeNGConfig', 'WuConfig', 'config'],
    ['LazyLoadEvent', 'WuTableLazyLoadEvent', 'table'],
    ['FilterMatchMode', 'FilterMatchMode', 'table'],
    ['SortMeta', 'SortMeta', 'table'],
    ['FilterMetadata', 'FilterMeta', 'table'],
  ],
  dynamicdialog: [
    ['DialogService', 'DialogService', 'dialog'],
    ['DynamicDialogRef', 'DynamicDialogRef', 'dialog'],
    ['DynamicDialogConfig', 'DynamicDialogConfig', 'dialog'],
  ],
  table: [
    ['Table', 'WuTable', 'table'],
    ['TableLazyLoadEvent', 'WuTableLazyLoadEvent', 'table'],
    ['TableRowSelectEvent', 'WuTableRowSelectEvent', 'table'],
  ],
  dropdown: [['Dropdown', 'WuSelect', 'select']],
  select: [['Select', 'WuSelect', 'select']],
  calendar: [['Calendar', 'WuDatePicker', 'datepicker']],
  datepicker: [['DatePicker', 'WuDatePicker', 'datepicker']],
  overlaypanel: [['OverlayPanel', 'WuPopover', 'popover']],
  popover: [['Popover', 'WuPopover', 'popover']],
  menu: [['Menu', 'WuMenu', 'menu']],
  dialog: [['Dialog', 'WuDialog', 'dialog']],
  fileupload: [['FileUpload', 'WuFileUpload', 'fileupload']],
  paginator: [['Paginator', 'WuPaginator', 'paginator']],
};

/** `wu-` tags WiraUI answers to (including the PrimeNG spellings it accepts), case as written. */
export const WU_TAGS = new Set(
  (
    'accordion accordionTab accordiontab accordion-tab accordion-panel accordion-header accordion-content autoComplete autocomplete ' +
    'avatar avatarGroup avatar-group badge blockUI breadcrumb button calendar card carousel cellEditor chart checkbox chip colorPicker ' +
    'columnFilter confirmDialog contextMenu datePicker datepicker dialog divider dock drawer dropdown editor fieldset fileUpload floatLabel ' +
    'galleria iconField image imageCompare inplace inputGroup inputGroupAddon inputIcon inputMask inputNumber inputOtp inputSwitch ' +
    'knob listbox listBox menu menubar message messages meterGroup multiSelect orderList organizationChart overlayPanel paginator ' +
    'panel panelMenu password pickList popover progressBar progressSpinner radioButton rating scrollPanel scroller select selectButton ' +
    'sidebar skeleton slider sortIcon splitButton splitter splitterPanel stepper steps tabMenu tabPanel tabView table tableCheckbox ' +
    'tableHeaderCheckbox tableRadioButton tag terminal tieredMenu timeline toast toggleButton toggleswitch toggleSwitch toolbar tree ' +
    'treeSelect virtualScroller tabs tab tablist tabpanels tabpanel step step-list step-panels step-panel step-item iconfield inputicon ' +
    'inputgroup inputgroup-addon floatlabel toggleswitch inputnumber inputmask inputotp multiselect selectbutton togglebutton ' +
    'progressbar progressspinner radiobutton scrollpanel tieredmenu treeselect panelmenu colorpicker contextmenu confirmdialog ' +
    'orderlist picklist organizationchart imagecompare metergroup datatable footer header'
  ).split(/\s+/)
);

/** PrimeNG tags with no WiraUI counterpart yet: left as they are and reported. */
export const NOT_YET = ['cascadeSelect', 'chips', 'confirmPopup', 'dataView', 'megaMenu', 'scrollTop', 'speedDial', 'treeTable', 'triStateCheckbox'];

/** The WiraUI name of a PrimeNG module or class name (`DropdownModule` → `WuSelectModule`). */
export function wuName(primeName: string): string {
  const module = primeName.endsWith('Module');
  const base = module ? primeName.slice(0, -'Module'.length) : primeName;
  return `Wu${NAME_RENAMES[base] ?? base}${module ? 'Module' : ''}`;
}
