import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v1/button';
import { WtSelectModule } from 'wiratheme-v1/select';
import { WtTableModule } from 'wiratheme-v1/table';
import { WtPaginatorModule } from 'wiratheme-v1/paginator';
import { WtMenubarModule } from 'wiratheme-v1/menubar';
import { WtPanelMenuModule } from 'wiratheme-v1/panelmenu';
import { WtStepsModule } from 'wiratheme-v1/steps';
import { WtChartJsModule } from 'wiratheme-v1/chartjs';
import { WtImageModule } from 'wiratheme-v1/image';
import { WtAutoCompleteModule } from 'wiratheme-v1/autocomplete';
import { WtMenuModule } from 'wiratheme-v1/menu';
import { WtTabMenuModule } from 'wiratheme-v1/tabmenu';
import { WtMultiSelectModule } from 'wiratheme-v1/multiselect';
import { WtInputMaskModule } from 'wiratheme-v1/inputmask';
import { WtTimelineModule } from 'wiratheme-v1/timeline';
import { WtPickListModule } from 'wiratheme-v1/picklist';
import { WtOrderListModule } from 'wiratheme-v1/orderlist';
import { WtFileUploadModule } from 'wiratheme-v1/fileupload';
import { WtStepperModule } from 'wiratheme-v1/stepper';
import { WtEditorModule } from 'wiratheme-v1/editor';
import { WtRippleModule } from 'wiratheme-v1/ripple';
import { WtKeyFilterModule } from 'wiratheme-v1/keyfilter';
import { WtSliderModule } from 'wiratheme-v1/slider';
import { WtSplitButtonModule } from 'wiratheme-v1/splitbutton';
import { WtListboxModule } from 'wiratheme-v1/listbox';
import { WtGalleriaModule } from 'wiratheme-v1/galleria';
import { WtColorPickerModule } from 'wiratheme-v1/colorpicker';
import { WtBreadcrumbModule } from 'wiratheme-v1/breadcrumb';
import { WtInplaceModule } from 'wiratheme-v1/inplace';
import { WtBlockUIModule } from 'wiratheme-v1/blockui';
import { WtScrollPanelModule } from 'wiratheme-v1/scrollpanel';
import { WtScrollerModule } from 'wiratheme-v1/scroller';
import { WtDrawerModule } from 'wiratheme-v1/drawer';
import { WtTieredMenuModule } from 'wiratheme-v1/tieredmenu';
import { WtContextMenuModule } from 'wiratheme-v1/contextmenu';
import { WtTreeModule } from 'wiratheme-v1/tree';
import { WtTreeSelectModule } from 'wiratheme-v1/treeselect';
import { WtDragDropModule } from 'wiratheme-v1/dragdrop';
import { WtNavbarModule } from 'wiratheme-v1/navbar';
import { WtAsideMenuModule } from 'wiratheme-v1/asidemenu';
import { WtImageCropperModule } from 'wiratheme-v1/imagecropper';
import { WiIconModule } from 'wiraicon/angular';
import { WtTerminalModule, WtTerminalService } from 'wiratheme-v1/terminal';
import { WtImageCompareModule } from 'wiratheme-v1/imagecompare';
import { WtCarouselModule } from 'wiratheme-v1/carousel';
import { WtSplitterModule } from 'wiratheme-v1/splitter';
import { WtOrganizationChartModule } from 'wiratheme-v1/organizationchart';
import { WtKnobModule } from 'wiratheme-v1/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from 'wiratheme-v1/excel';
import { WtEmptyStateModule } from 'wiratheme-v1/emptystate';
import { WtResultModule } from 'wiratheme-v1/result';
import { WtErrorPageModule } from 'wiratheme-v1/errorpage';
import { WtThaiModule } from 'wiratheme-v1/thai';
import { WtInputOtpModule } from 'wiratheme-v1/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WtFlowModule } from 'wiratheme-v1/flow';
import { WtMeterGroupModule } from 'wiratheme-v1/metergroup';
import { WtValidationModule, WtValidators } from 'wiratheme-v1/validation';
import { WtDialogModule, WtDialogService } from 'wiratheme-v1/dialog';
import { WtAlert, WtAlertModule, WtAlertService } from 'wiratheme-v1/alert';
import { WtConfirmationService, WtConfirmDialogModule } from 'wiratheme-v1/confirmdialog';
import { WtMessageService, WtToastModule } from 'wiratheme-v1/toast';
import { WtTooltipModule } from 'wiratheme-v1/tooltip';
import { WtPopoverModule } from 'wiratheme-v1/popover';
import { WtAnimateModule } from 'wiratheme-v1/animate';
import { WtDatePickerModule } from 'wiratheme-v1/datepicker';
import { WtInputNumberModule } from 'wiratheme-v1/inputnumber';
import { WtToolbarModule } from 'wiratheme-v1/toolbar';
import { WtAccordionModule } from 'wiratheme-v1/accordion';
import { WtTabsModule } from 'wiratheme-v1/tabs';
import { WtIconFieldModule } from 'wiratheme-v1/iconfield';
import { WtInputGroupModule } from 'wiratheme-v1/inputgroup';
import { WtFloatLabelModule } from 'wiratheme-v1/floatlabel';
import { WtToggleButtonModule } from 'wiratheme-v1/togglebutton';
import { WtSelectButtonModule } from 'wiratheme-v1/selectbutton';
import { WtRatingModule } from 'wiratheme-v1/rating';
import { WtPasswordModule } from 'wiratheme-v1/password';
import { WtTagModule } from 'wiratheme-v1/tag';
import { WtBadgeModule } from 'wiratheme-v1/badge';
import { WtChipModule } from 'wiratheme-v1/chip';
import { WtAvatarModule } from 'wiratheme-v1/avatar';
import { WtSkeletonModule } from 'wiratheme-v1/skeleton';
import { WtProgressBarModule } from 'wiratheme-v1/progressbar';
import { WtProgressSpinnerModule } from 'wiratheme-v1/progressspinner';
import { WtDividerModule } from 'wiratheme-v1/divider';
import { WtPanelModule } from 'wiratheme-v1/panel';
import { WtFieldsetModule } from 'wiratheme-v1/fieldset';
import { WtMessageModule } from 'wiratheme-v1/message';
import { WtCardModule } from 'wiratheme-v1/card';
import { WtCheckboxModule } from 'wiratheme-v1/checkbox';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v1/config';
import { WtInputTextModule } from 'wiratheme-v1/inputtext';
import { WtRadioButtonModule } from 'wiratheme-v1/radiobutton';
import { WtTextareaModule } from 'wiratheme-v1/textarea';
import { WtToggleSwitchModule } from 'wiratheme-v1/toggleswitch';
import { DOCS_DIALOGS, DOCS_EXCEL, DOCS_FLOW, DOCS_OVERLAYS, DOCS_TERMINAL, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
import { DocsSharedModule } from '../../shared/docs-shared-module';
import { DocsPagesModule } from '../../shared/pages/docs-pages-module';
import { versionRoutes } from '../shared/version-routes';
import {
  ButtonPageV1,
  CardPageV1,
  CheckboxPageV1,
  InputTextPageV1,
  PresetsPageV1,
  RadioButtonPageV1,
  TagPageV1,
  BadgePageV1,
  ChipPageV1,
  AvatarPageV1,
  SkeletonPageV1,
  ProgressBarPageV1,
  ProgressSpinnerPageV1,
  DividerPageV1,
  PanelPageV1,
  FieldsetPageV1,
  MessagePageV1,
  IconFieldPageV1,
  InputGroupPageV1,
  FloatLabelPageV1,
  ToggleButtonPageV1,
  SelectButtonPageV1,
  RatingPageV1,
  PasswordPageV1,
  ToolbarPageV1,
  AccordionPageV1,
  TabsPageV1,
  InputNumberPageV1,
  DatePickerPageV1,
  DialogPageV1,
  AlertPageV1,
  ConfirmDialogPageV1,
  ToastPageV1,
  TooltipPageV1,
  PopoverPageV1,
  AnimatePageV1,
  MeterGroupPageV1,
  ValidationPageV1,
  SelectPageV1,
  TablePageV1,
  PaginatorPageV1,
  MenubarPageV1,
  PanelMenuPageV1,
  StepsPageV1,
  ChartJsPageV1,
  ImagePageV1,
  AutoCompletePageV1,
  MenuPageV1,
  TabMenuPageV1,
  MultiSelectPageV1,
  InputMaskPageV1,
  TimelinePageV1,
  PickListPageV1,
  OrderListPageV1,
  FileUploadPageV1,
  StepperPageV1,
  EditorPageV1,
  RipplePageV1,
  KeyFilterPageV1,
  SliderPageV1,
  SplitButtonPageV1,
  ListboxPageV1,
  GalleriaPageV1,
  ColorPickerPageV1,
  BreadcrumbPageV1,
  InplacePageV1,
  BlockUIPageV1,
  ScrollPanelPageV1,
  ScrollerPageV1,
  DrawerPageV1,
  TieredMenuPageV1,
  ContextMenuPageV1,
  TreePageV1,
  TreeSelectPageV1,
  DragDropPageV1,
  StudioPageV1,
  NavbarPageV1,
  AsideMenuPageV1,
  ImageCropperPageV1,
  IconsPageV1,
  TerminalPageV1,
  ImageComparePageV1,
  CarouselPageV1,
  SplitterPageV1,
  OrganizationChartPageV1,
  KnobPageV1,
  InputOtpPageV1,
  FlowPageV1,
  ExcelPageV1,
  EmptyStatePageV1,
  ResultPageV1,
  ErrorPagePageV1,
  ThaiPageV1,
  PickStudentV1,
  TextareaPageV1,
  ToggleSwitchPageV1,
} from './pages-v1';
import { THEME_V1 } from './theme-v1';

@NgModule({
  declarations: [
    ButtonPageV1,
    CardPageV1,
    CheckboxPageV1,
    InputTextPageV1,
    RadioButtonPageV1,
    TextareaPageV1,
    ToggleSwitchPageV1,
    PresetsPageV1,
    TagPageV1,
    BadgePageV1,
    ChipPageV1,
    AvatarPageV1,
    SkeletonPageV1,
    ProgressBarPageV1,
    ProgressSpinnerPageV1,
    DividerPageV1,
    PanelPageV1,
    FieldsetPageV1,
    MessagePageV1,
    IconFieldPageV1,
    InputGroupPageV1,
    FloatLabelPageV1,
    ToggleButtonPageV1,
    SelectButtonPageV1,
    RatingPageV1,
    PasswordPageV1,
    ToolbarPageV1,
    AccordionPageV1,
    TabsPageV1,
    InputNumberPageV1,
    DatePickerPageV1,
    DialogPageV1,
    AlertPageV1,
    ConfirmDialogPageV1,
    ToastPageV1,
    TooltipPageV1,
    PopoverPageV1,
    AnimatePageV1,
    MeterGroupPageV1,
    ValidationPageV1,
    SelectPageV1,
    TablePageV1,
    PaginatorPageV1,
    MenubarPageV1,
    PanelMenuPageV1,
    StepsPageV1,
    ChartJsPageV1,
    ImagePageV1,
    AutoCompletePageV1,
    MenuPageV1,
    TabMenuPageV1,
    MultiSelectPageV1,
    InputMaskPageV1,
    TimelinePageV1,
    PickListPageV1,
    OrderListPageV1,
    FileUploadPageV1,
    StepperPageV1,
    EditorPageV1,
    RipplePageV1,
    KeyFilterPageV1,
    SliderPageV1,
    SplitButtonPageV1,
    ListboxPageV1,
    GalleriaPageV1,
    ColorPickerPageV1,
    BreadcrumbPageV1,
    InplacePageV1,
    BlockUIPageV1,
    ScrollPanelPageV1,
    ScrollerPageV1,
    DrawerPageV1,
    TieredMenuPageV1,
    ContextMenuPageV1,
    TreePageV1,
    TreeSelectPageV1,
    DragDropPageV1,
    StudioPageV1,
    NavbarPageV1,
    AsideMenuPageV1,
    ImageCropperPageV1,
    IconsPageV1,
    TerminalPageV1,
    ImageComparePageV1,
    CarouselPageV1,
    SplitterPageV1,
    OrganizationChartPageV1,
    KnobPageV1,
    InputOtpPageV1,
    FlowPageV1,
    ExcelPageV1,
    EmptyStatePageV1,
    ResultPageV1,
    ErrorPagePageV1,
    ThaiPageV1,
    PickStudentV1,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DocsSharedModule,
    DocsPagesModule,
    WtButtonModule,
    WtCardModule,
    WtInputTextModule,
    WtTextareaModule,
    WtCheckboxModule,
    WtRadioButtonModule,
    WtToggleSwitchModule,
    WtTagModule,
    WtBadgeModule,
    WtChipModule,
    WtAvatarModule,
    WtSkeletonModule,
    WtProgressBarModule,
    WtProgressSpinnerModule,
    WtDividerModule,
    WtPanelModule,
    WtFieldsetModule,
    WtMessageModule,
    WtIconFieldModule,
    WtInputGroupModule,
    WtFloatLabelModule,
    WtToggleButtonModule,
    WtSelectButtonModule,
    WtRatingModule,
    WtPasswordModule,
    WtToolbarModule,
    WtAccordionModule,
    WtTabsModule,
    WtInputNumberModule,
    WtDatePickerModule,
    WtDialogModule,
    WtAlertModule,
    WtConfirmDialogModule,
    WtToastModule,
    WtTooltipModule,
    WtPopoverModule,
    WtAnimateModule,
    WtMeterGroupModule,
    WtValidationModule,
    WtSelectModule,
    WtTableModule,
    WtPaginatorModule,
    WtMenubarModule,
    WtPanelMenuModule,
    WtStepsModule,
    WtChartJsModule,
    WtImageModule,
    WtAutoCompleteModule,
    WtMenuModule,
    WtTabMenuModule,
    WtMultiSelectModule,
    WtInputMaskModule,
    WtTimelineModule,
    WtPickListModule,
    WtOrderListModule,
    WtFileUploadModule,
    WtStepperModule,
    WtEditorModule,
    WtRippleModule,
    WtKeyFilterModule,
    WtSliderModule,
    WtSplitButtonModule,
    WtListboxModule,
    WtGalleriaModule,
    WtColorPickerModule,
    WtBreadcrumbModule,
    WtInplaceModule,
    WtBlockUIModule,
    WtScrollPanelModule,
    WtScrollerModule,
    WtDrawerModule,
    WtTieredMenuModule,
    WtContextMenuModule,
    WtTreeModule,
    WtTreeSelectModule,
    WtDragDropModule,
    WtNavbarModule,
    WtAsideMenuModule,
    WtImageCropperModule,
    WiIconModule,
    WtTerminalModule,
    WtImageCompareModule,
    WtCarouselModule,
    WtSplitterModule,
    WtOrganizationChartModule,
    WtKnobModule,
    WtEmptyStateModule,
    WtResultModule,
    WtErrorPageModule,
    WtThaiModule,
    WtInputOtpModule,
    WtFlowModule,
    RouterModule.forChild(
      versionRoutes({
        button: ButtonPageV1,
        card: CardPageV1,
        checkbox: CheckboxPageV1,
        inputtext: InputTextPageV1,
        radiobutton: RadioButtonPageV1,
        textarea: TextareaPageV1,
        toggleswitch: ToggleSwitchPageV1,
        presets: PresetsPageV1,
        tag: TagPageV1,
        badge: BadgePageV1,
        chip: ChipPageV1,
        avatar: AvatarPageV1,
        skeleton: SkeletonPageV1,
        progressbar: ProgressBarPageV1,
        progressspinner: ProgressSpinnerPageV1,
        divider: DividerPageV1,
        panel: PanelPageV1,
        fieldset: FieldsetPageV1,
        message: MessagePageV1,
        iconfield: IconFieldPageV1,
        inputgroup: InputGroupPageV1,
        floatlabel: FloatLabelPageV1,
        togglebutton: ToggleButtonPageV1,
        selectbutton: SelectButtonPageV1,
        rating: RatingPageV1,
        password: PasswordPageV1,
        toolbar: ToolbarPageV1,
        accordion: AccordionPageV1,
        tabs: TabsPageV1,
        inputnumber: InputNumberPageV1,
        datepicker: DatePickerPageV1,
        dialog: DialogPageV1,
        alert: AlertPageV1,
        confirmdialog: ConfirmDialogPageV1,
        toast: ToastPageV1,
        tooltip: TooltipPageV1,
        popover: PopoverPageV1,
        animate: AnimatePageV1,
        metergroup: MeterGroupPageV1,
        validation: ValidationPageV1,
        select: SelectPageV1,
        table: TablePageV1,
        paginator: PaginatorPageV1,
        menubar: MenubarPageV1,
        panelmenu: PanelMenuPageV1,
        steps: StepsPageV1,
        chartjs: ChartJsPageV1,
        image: ImagePageV1,
        autocomplete: AutoCompletePageV1,
        menu: MenuPageV1,
        tabmenu: TabMenuPageV1,
        multiselect: MultiSelectPageV1,
        inputmask: InputMaskPageV1,
        timeline: TimelinePageV1,
        picklist: PickListPageV1,
        orderlist: OrderListPageV1,
        fileupload: FileUploadPageV1,
        stepper: StepperPageV1,
        editor: EditorPageV1,
        ripple: RipplePageV1,
        keyfilter: KeyFilterPageV1,
        slider: SliderPageV1,
        splitbutton: SplitButtonPageV1,
        listbox: ListboxPageV1,
        galleria: GalleriaPageV1,
        colorpicker: ColorPickerPageV1,
        breadcrumb: BreadcrumbPageV1,
        inplace: InplacePageV1,
        blockui: BlockUIPageV1,
        scrollpanel: ScrollPanelPageV1,
        scroller: ScrollerPageV1,
        drawer: DrawerPageV1,
        tieredmenu: TieredMenuPageV1,
        contextmenu: ContextMenuPageV1,
        tree: TreePageV1,
        treeselect: TreeSelectPageV1,
        dragdrop: DragDropPageV1,
        studio: StudioPageV1,
        navbar: NavbarPageV1,
        asidemenu: AsideMenuPageV1,
        imagecropper: ImageCropperPageV1,
        icons: IconsPageV1,
        terminal: TerminalPageV1,
        imagecompare: ImageComparePageV1,
        carousel: CarouselPageV1,
        splitter: SplitterPageV1,
        organizationchart: OrganizationChartPageV1,
        knob: KnobPageV1,
        inputotp: InputOtpPageV1,
        flow: FlowPageV1,
        excel: ExcelPageV1,
        emptystate: EmptyStatePageV1,
        result: ResultPageV1,
        errorpage: ErrorPagePageV1,
        thai: ThaiPageV1,
      })
    ),
  ],
  providers: [
    // Docs site only: wiratheme@1 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
    THEME_V1,
    // Overlay services live in this module's injector, not the app root: the alert dialog they create then sees the
    // version check skip above, and pages of one major never reach another major's services.
    WtAlertService,
    WtConfirmationService,
    WtMessageService,
    // The overlay demos open this version's alerts, confirmations and toasts.
    { provide: DOCS_VALIDATORS, useValue: WtValidators },
    // The Terminal demo talks to this version's terminal service.
    { provide: DOCS_TERMINAL, useExisting: WtTerminalService },
    // The Flow demos that apply changes themselves use this version's helpers.
    { provide: DOCS_FLOW, useValue: { applyNodeChanges, applyEdgeChanges, addEdge } },
    // The Excel demos build files with this version's wiratheme/excel.
    { provide: DOCS_EXCEL, useValue: { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } },
    // The Dialog page's service sample: this module's WtDialogService opens this version's picker.
    WtDialogService,
    { provide: DOCS_DIALOGS, useFactory: () => { const dialogs = inject(WtDialogService); return { pickStudent: (config: object) => dialogs.open(PickStudentV1, config).result }; } },
    {
      provide: DOCS_OVERLAYS,
      useFactory: (): DocsOverlays => ({
        alert: inject(WtAlertService),
        staticAlert: WtAlert,
        confirm: inject(WtConfirmationService),
        messages: inject(WtMessageService),
      }),
    },
  ],
})
export class DocsV1Module {}
