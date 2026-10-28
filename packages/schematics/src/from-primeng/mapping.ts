/**
 * What `ng g wiratheme:from-primeng` changes: PrimeNG entry points, NgModules, classes and tags, and their WiraTheme
 * names. test/from-primeng.test.ts checks every target here against the real WiraTheme sources.
 */

/** PrimeNG names (module and class, without `Module`) whose WiraTheme name differs. */
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

/** PrimeNG entry point → WiraTheme entry point where they differ (`primeng/dropdown` → `wiratheme/select`). */
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

/** WiraTheme entry points and their NgModules. */
export const WT_MODULES: Record<string, string[]> = {
  accordion: ['WtAccordionModule'],
  alert: ['WtAlertModule'],
  animate: ['WtAnimateModule'],
  autocomplete: ['WtAutoCompleteModule'],
  avatar: ['WtAvatarModule'],
  badge: ['WtBadgeModule'],
  blockui: ['WtBlockUIModule'],
  breadcrumb: ['WtBreadcrumbModule'],
  button: ['WtButtonModule'],
  card: ['WtCardModule'],
  carousel: ['WtCarouselModule'],
  // v1 / v2: the Chart.js chart; v3: WiraTheme's own, which takes Chart.js data and options.
  chart: ['WtChartModule'],
  chartjs: ['WtChartJsModule'],
  checkbox: ['WtCheckboxModule'],
  chip: ['WtChipModule'],
  colorpicker: ['WtColorPickerModule'],
  confirmdialog: ['WtConfirmDialogModule'],
  contextmenu: ['WtContextMenuModule'],
  datepicker: ['WtDatePickerModule'],
  dialog: ['WtDialogModule'],
  divider: ['WtDividerModule'],
  dragdrop: ['WtDragDropModule'],
  drawer: ['WtDrawerModule'],
  editor: ['WtEditorModule'],
  fieldset: ['WtFieldsetModule'],
  fileupload: ['WtFileUploadModule'],
  floatlabel: ['WtFloatLabelModule'],
  galleria: ['WtGalleriaModule'],
  iconfield: ['WtIconFieldModule'],
  image: ['WtImageModule'],
  imagecompare: ['WtImageCompareModule'],
  inplace: ['WtInplaceModule'],
  inputgroup: ['WtInputGroupModule'],
  inputmask: ['WtInputMaskModule'],
  inputnumber: ['WtInputNumberModule'],
  inputotp: ['WtInputOtpModule'],
  inputtext: ['WtInputTextModule'],
  keyfilter: ['WtKeyFilterModule'],
  knob: ['WtKnobModule'],
  listbox: ['WtListboxModule'],
  menu: ['WtMenuModule'],
  menubar: ['WtMenubarModule'],
  message: ['WtMessageModule'],
  metergroup: ['WtMeterGroupModule'],
  multiselect: ['WtMultiSelectModule'],
  orderlist: ['WtOrderListModule'],
  organizationchart: ['WtOrganizationChartModule'],
  paginator: ['WtPaginatorModule'],
  panel: ['WtPanelModule'],
  panelmenu: ['WtPanelMenuModule'],
  password: ['WtPasswordModule'],
  picklist: ['WtPickListModule'],
  popover: ['WtPopoverModule'],
  progressbar: ['WtProgressBarModule'],
  progressspinner: ['WtProgressSpinnerModule'],
  radiobutton: ['WtRadioButtonModule'],
  rating: ['WtRatingModule'],
  ripple: ['WtRippleModule'],
  scroller: ['WtScrollerModule'],
  scrollpanel: ['WtScrollPanelModule'],
  select: ['WtSelectModule'],
  selectbutton: ['WtSelectButtonModule'],
  skeleton: ['WtSkeletonModule'],
  slider: ['WtSliderModule'],
  splitbutton: ['WtSplitButtonModule'],
  splitter: ['WtSplitterModule'],
  stepper: ['WtStepperModule'],
  steps: ['WtStepsModule'],
  table: ['WtTableModule'],
  tabmenu: ['WtTabMenuModule'],
  tabs: ['WtTabsModule'],
  tag: ['WtTagModule'],
  terminal: ['WtTerminalModule'],
  textarea: ['WtTextareaModule'],
  tieredmenu: ['WtTieredMenuModule'],
  timeline: ['WtTimelineModule'],
  toast: ['WtToastModule'],
  togglebutton: ['WtToggleButtonModule'],
  toggleswitch: ['WtToggleSwitchModule'],
  toolbar: ['WtToolbarModule'],
  tooltip: ['WtTooltipModule'],
  tree: ['WtTreeModule'],
  treeselect: ['WtTreeSelectModule'],
};

/**
 * Other names apps import from PrimeNG, by entry: `[PrimeNG name, WiraTheme name, WiraTheme entry]`. The services keep
 * their PrimeNG names (WiraTheme exports them too).
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
    ['PrimeTemplate', 'WtTemplate', 'api'],
    ['PrimeNGConfig', 'WtConfig', 'config'],
    ['LazyLoadEvent', 'WtTableLazyLoadEvent', 'table'],
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
    ['Table', 'WtTable', 'table'],
    ['TableLazyLoadEvent', 'WtTableLazyLoadEvent', 'table'],
    ['TableRowSelectEvent', 'WtTableRowSelectEvent', 'table'],
  ],
  dropdown: [['Dropdown', 'WtSelect', 'select']],
  select: [['Select', 'WtSelect', 'select']],
  calendar: [['Calendar', 'WtDatePicker', 'datepicker']],
  datepicker: [['DatePicker', 'WtDatePicker', 'datepicker']],
  overlaypanel: [['OverlayPanel', 'WtPopover', 'popover']],
  popover: [['Popover', 'WtPopover', 'popover']],
  menu: [['Menu', 'WtMenu', 'menu']],
  dialog: [['Dialog', 'WtDialog', 'dialog']],
  fileupload: [['FileUpload', 'WtFileUpload', 'fileupload']],
  paginator: [['Paginator', 'WtPaginator', 'paginator']],
};

/** `wt-` tags WiraTheme answers to (including the PrimeNG spellings it accepts), case as written. */
export const WT_TAGS = new Set(
  (
    'accordion accordionTab accordiontab accordion-tab accordion-panel accordion-header accordion-content autoComplete autocomplete ' +
    'avatar avatarGroup avatar-group badge blockUI breadcrumb button calendar card carousel cellEditor chart checkbox chip colorPicker ' +
    'columnFilter confirmDialog contextMenu datePicker datepicker dialog divider drawer dropdown editor fieldset fileUpload floatLabel ' +
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

/** PrimeNG tags with no WiraTheme counterpart yet: left as they are and reported. */
export const NOT_YET = ['cascadeSelect', 'chips', 'confirmPopup', 'dataView', 'dock', 'megaMenu', 'scrollTop', 'speedDial', 'treeTable', 'triStateCheckbox'];

/** The WiraTheme name of a PrimeNG module or class name (`DropdownModule` → `WtSelectModule`). */
export function wtName(primeName: string): string {
  const module = primeName.endsWith('Module');
  const base = module ? primeName.slice(0, -'Module'.length) : primeName;
  return `Wt${NAME_RENAMES[base] ?? base}${module ? 'Module' : ''}`;
}
