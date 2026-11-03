import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from '@wirabyte/ui/button';
import { WuSelectModule } from '@wirabyte/ui/select';
import { WuTableModule } from '@wirabyte/ui/table';
import { WuPaginatorModule } from '@wirabyte/ui/paginator';
import { WuMenubarModule } from '@wirabyte/ui/menubar';
import { WuPanelMenuModule } from '@wirabyte/ui/panelmenu';
import { WuStepsModule } from '@wirabyte/ui/steps';
import { WuChartJsModule } from '@wirabyte/ui/chartjs';
import { WuImageModule } from '@wirabyte/ui/image';
import { WuAutoCompleteModule } from '@wirabyte/ui/autocomplete';
import { WuMenuModule } from '@wirabyte/ui/menu';
import { WuTabMenuModule } from '@wirabyte/ui/tabmenu';
import { WuMultiSelectModule } from '@wirabyte/ui/multiselect';
import { WuInputMaskModule } from '@wirabyte/ui/inputmask';
import { WuTimelineModule } from '@wirabyte/ui/timeline';
import { WuPickListModule } from '@wirabyte/ui/picklist';
import { WuOrderListModule } from '@wirabyte/ui/orderlist';
import { WuFileUploadModule } from '@wirabyte/ui/fileupload';
import { WuStepperModule } from '@wirabyte/ui/stepper';
import { WuEditorModule } from '@wirabyte/ui/editor';
import { WuRippleModule } from '@wirabyte/ui/ripple';
import { WuKeyFilterModule } from '@wirabyte/ui/keyfilter';
import { WuSliderModule } from '@wirabyte/ui/slider';
import { WuSplitButtonModule } from '@wirabyte/ui/splitbutton';
import { WuListboxModule } from '@wirabyte/ui/listbox';
import { WuGalleriaModule } from '@wirabyte/ui/galleria';
import { WuColorPickerModule } from '@wirabyte/ui/colorpicker';
import { WuBreadcrumbModule } from '@wirabyte/ui/breadcrumb';
import { WuInplaceModule } from '@wirabyte/ui/inplace';
import { WuBlockUIModule } from '@wirabyte/ui/blockui';
import { WuScrollPanelModule } from '@wirabyte/ui/scrollpanel';
import { WuScrollerModule } from '@wirabyte/ui/scroller';
import { WuDrawerModule } from '@wirabyte/ui/drawer';
import { WuTieredMenuModule } from '@wirabyte/ui/tieredmenu';
import { WuContextMenuModule } from '@wirabyte/ui/contextmenu';
import { WuTreeModule } from '@wirabyte/ui/tree';
import { WuTreeSelectModule } from '@wirabyte/ui/treeselect';
import { WuDragDropModule } from '@wirabyte/ui/dragdrop';
import { WuNavbarModule } from '@wirabyte/ui/navbar';
import { WuAsideMenuModule } from '@wirabyte/ui/asidemenu';
import { WuImageCropperModule } from '@wirabyte/ui/imagecropper';
import { WiIconModule } from '@wirabyte/icons/angular';
import { WuTerminalModule, WuTerminalService } from '@wirabyte/ui/terminal';
import { WuImageCompareModule } from '@wirabyte/ui/imagecompare';
import { WuCarouselModule } from '@wirabyte/ui/carousel';
import { WuSplitterModule } from '@wirabyte/ui/splitter';
import { WuOrganizationChartModule } from '@wirabyte/ui/organizationchart';
import { WuKnobModule } from '@wirabyte/ui/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from '@wirabyte/ui/excel';
import { WuEmptyStateModule } from '@wirabyte/ui/emptystate';
import { WuResultModule } from '@wirabyte/ui/result';
import { WuErrorPageModule } from '@wirabyte/ui/errorpage';
import { WuDockModule } from '@wirabyte/ui/dock';
import { WuSiteFooterModule } from '@wirabyte/ui/sitefooter';
import { WuBottomBarModule } from '@wirabyte/ui/bottombar';
import { WuThaiModule } from '@wirabyte/ui/thai';
import { WuChartModule } from '@wirabyte/ui/chart';
import { WuInputOtpModule } from '@wirabyte/ui/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WuFlowModule } from '@wirabyte/ui/flow';
import { WuMeterGroupModule } from '@wirabyte/ui/metergroup';
import { WuValidationModule, WuValidators } from '@wirabyte/ui/validation';
import { WuDialogModule, WuDialogService } from '@wirabyte/ui/dialog';
import { WuAlert, WuAlertModule, WuAlertService } from '@wirabyte/ui/alert';
import { WuConfirmationService, WuConfirmDialogModule } from '@wirabyte/ui/confirmdialog';
import { WuMessageService, WuToastModule } from '@wirabyte/ui/toast';
import { WuTooltipModule } from '@wirabyte/ui/tooltip';
import { WuPopoverModule } from '@wirabyte/ui/popover';
import { WuAnimateModule } from '@wirabyte/ui/animate';
import { WuDatePickerModule } from '@wirabyte/ui/datepicker';
import { WuInputNumberModule } from '@wirabyte/ui/inputnumber';
import { WuToolbarModule } from '@wirabyte/ui/toolbar';
import { WuAccordionModule } from '@wirabyte/ui/accordion';
import { WuTabsModule } from '@wirabyte/ui/tabs';
import { WuIconFieldModule } from '@wirabyte/ui/iconfield';
import { WuInputGroupModule } from '@wirabyte/ui/inputgroup';
import { WuFloatLabelModule } from '@wirabyte/ui/floatlabel';
import { WuToggleButtonModule } from '@wirabyte/ui/togglebutton';
import { WuSelectButtonModule } from '@wirabyte/ui/selectbutton';
import { WuRatingModule } from '@wirabyte/ui/rating';
import { WuPasswordModule } from '@wirabyte/ui/password';
import { WuTagModule } from '@wirabyte/ui/tag';
import { WuBadgeModule } from '@wirabyte/ui/badge';
import { WuChipModule } from '@wirabyte/ui/chip';
import { WuAvatarModule } from '@wirabyte/ui/avatar';
import { WuSkeletonModule } from '@wirabyte/ui/skeleton';
import { WuProgressBarModule } from '@wirabyte/ui/progressbar';
import { WuProgressSpinnerModule } from '@wirabyte/ui/progressspinner';
import { WuDividerModule } from '@wirabyte/ui/divider';
import { WuPanelModule } from '@wirabyte/ui/panel';
import { WuFieldsetModule } from '@wirabyte/ui/fieldset';
import { WuMessageModule } from '@wirabyte/ui/message';
import { WuCardModule } from '@wirabyte/ui/card';
import { WuCheckboxModule } from '@wirabyte/ui/checkbox';
import { provideWiraUI } from '@wirabyte/ui/config';
import { WuInputTextModule } from '@wirabyte/ui/inputtext';
import { WuRadioButtonModule } from '@wirabyte/ui/radiobutton';
import { WuTextareaModule } from '@wirabyte/ui/textarea';
import { WuToggleSwitchModule } from '@wirabyte/ui/toggleswitch';
import { DOCS_DIALOGS, DOCS_EXCEL, DOCS_FLOW, DOCS_OVERLAYS, DOCS_TERMINAL, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
import { DocsSharedModule } from '../../shared/docs-shared-module';
import { DocsPagesModule } from '../../shared/pages/docs-pages-module';
import { versionRoutes } from '../shared/version-routes';
import {
  ButtonPageV3,
  CardPageV3,
  CheckboxPageV3,
  InputTextPageV3,
  PresetsPageV3,
  RadioButtonPageV3,
  TagPageV3,
  BadgePageV3,
  ChipPageV3,
  AvatarPageV3,
  SkeletonPageV3,
  ProgressBarPageV3,
  ProgressSpinnerPageV3,
  DividerPageV3,
  PanelPageV3,
  FieldsetPageV3,
  MessagePageV3,
  IconFieldPageV3,
  InputGroupPageV3,
  FloatLabelPageV3,
  ToggleButtonPageV3,
  SelectButtonPageV3,
  RatingPageV3,
  PasswordPageV3,
  ToolbarPageV3,
  AccordionPageV3,
  TabsPageV3,
  InputNumberPageV3,
  DatePickerPageV3,
  DialogPageV3,
  AlertPageV3,
  ConfirmDialogPageV3,
  ToastPageV3,
  TooltipPageV3,
  PopoverPageV3,
  AnimatePageV3,
  MeterGroupPageV3,
  ValidationPageV3,
  SelectPageV3,
  TablePageV3,
  PaginatorPageV3,
  MenubarPageV3,
  PanelMenuPageV3,
  StepsPageV3,
  ChartJsPageV3,
  ImagePageV3,
  AutoCompletePageV3,
  MenuPageV3,
  TabMenuPageV3,
  MultiSelectPageV3,
  InputMaskPageV3,
  TimelinePageV3,
  PickListPageV3,
  OrderListPageV3,
  FileUploadPageV3,
  StepperPageV3,
  EditorPageV3,
  RipplePageV3,
  KeyFilterPageV3,
  SliderPageV3,
  SplitButtonPageV3,
  ListboxPageV3,
  GalleriaPageV3,
  ColorPickerPageV3,
  BreadcrumbPageV3,
  InplacePageV3,
  BlockUIPageV3,
  ScrollPanelPageV3,
  ScrollerPageV3,
  DrawerPageV3,
  TieredMenuPageV3,
  ContextMenuPageV3,
  TreePageV3,
  TreeSelectPageV3,
  DragDropPageV3,
  StudioPageV3,
  NavbarPageV3,
  AsideMenuPageV3,
  ImageCropperPageV3,
  IconsPageV3,
  TerminalPageV3,
  ImageComparePageV3,
  CarouselPageV3,
  SplitterPageV3,
  OrganizationChartPageV3,
  KnobPageV3,
  InputOtpPageV3,
  FlowPageV3,
  ExcelPageV3,
  EmptyStatePageV3,
  ResultPageV3,
  ErrorPagePageV3,
  DockPageV3,
  FooterPageV3,
  BottomBarPageV3,
  ThaiPageV3,
  PickStudentV3,
  ChartPageV3,
  TextareaPageV3,
  ToggleSwitchPageV3,
} from './pages-v3';
import { THEME_V3 } from './theme-v3';

@NgModule({
  declarations: [
    ButtonPageV3,
    CardPageV3,
    CheckboxPageV3,
    InputTextPageV3,
    RadioButtonPageV3,
    TextareaPageV3,
    ToggleSwitchPageV3,
    PresetsPageV3,
    TagPageV3,
    BadgePageV3,
    ChipPageV3,
    AvatarPageV3,
    SkeletonPageV3,
    ProgressBarPageV3,
    ProgressSpinnerPageV3,
    DividerPageV3,
    PanelPageV3,
    FieldsetPageV3,
    MessagePageV3,
    IconFieldPageV3,
    InputGroupPageV3,
    FloatLabelPageV3,
    ToggleButtonPageV3,
    SelectButtonPageV3,
    RatingPageV3,
    PasswordPageV3,
    ToolbarPageV3,
    AccordionPageV3,
    TabsPageV3,
    InputNumberPageV3,
    DatePickerPageV3,
    DialogPageV3,
    AlertPageV3,
    ConfirmDialogPageV3,
    ToastPageV3,
    TooltipPageV3,
    PopoverPageV3,
    AnimatePageV3,
    MeterGroupPageV3,
    ValidationPageV3,
    SelectPageV3,
    TablePageV3,
    PaginatorPageV3,
    MenubarPageV3,
    PanelMenuPageV3,
    StepsPageV3,
    ChartJsPageV3,
    ImagePageV3,
    AutoCompletePageV3,
    MenuPageV3,
    TabMenuPageV3,
    MultiSelectPageV3,
    InputMaskPageV3,
    TimelinePageV3,
    PickListPageV3,
    OrderListPageV3,
    FileUploadPageV3,
    StepperPageV3,
    EditorPageV3,
    RipplePageV3,
    KeyFilterPageV3,
    SliderPageV3,
    SplitButtonPageV3,
    ListboxPageV3,
    GalleriaPageV3,
    ColorPickerPageV3,
    BreadcrumbPageV3,
    InplacePageV3,
    BlockUIPageV3,
    ScrollPanelPageV3,
    ScrollerPageV3,
    DrawerPageV3,
    TieredMenuPageV3,
    ContextMenuPageV3,
    TreePageV3,
    TreeSelectPageV3,
    DragDropPageV3,
    StudioPageV3,
    NavbarPageV3,
    AsideMenuPageV3,
    ImageCropperPageV3,
    IconsPageV3,
    TerminalPageV3,
    ImageComparePageV3,
    CarouselPageV3,
    SplitterPageV3,
    OrganizationChartPageV3,
    KnobPageV3,
    InputOtpPageV3,
    FlowPageV3,
    ExcelPageV3,
    EmptyStatePageV3,
    ResultPageV3,
    ErrorPagePageV3,
    DockPageV3,
    FooterPageV3,
    BottomBarPageV3,
    ThaiPageV3,
    PickStudentV3,
    ChartPageV3,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DocsSharedModule,
    DocsPagesModule,
    WuButtonModule,
    WuCardModule,
    WuInputTextModule,
    WuTextareaModule,
    WuCheckboxModule,
    WuRadioButtonModule,
    WuToggleSwitchModule,
    WuTagModule,
    WuBadgeModule,
    WuChipModule,
    WuAvatarModule,
    WuSkeletonModule,
    WuProgressBarModule,
    WuProgressSpinnerModule,
    WuDividerModule,
    WuPanelModule,
    WuFieldsetModule,
    WuMessageModule,
    WuIconFieldModule,
    WuInputGroupModule,
    WuFloatLabelModule,
    WuToggleButtonModule,
    WuSelectButtonModule,
    WuRatingModule,
    WuPasswordModule,
    WuToolbarModule,
    WuAccordionModule,
    WuTabsModule,
    WuInputNumberModule,
    WuDatePickerModule,
    WuDialogModule,
    WuAlertModule,
    WuConfirmDialogModule,
    WuToastModule,
    WuTooltipModule,
    WuPopoverModule,
    WuAnimateModule,
    WuMeterGroupModule,
    WuValidationModule,
    WuSelectModule,
    WuTableModule,
    WuPaginatorModule,
    WuMenubarModule,
    WuPanelMenuModule,
    WuStepsModule,
    WuChartJsModule,
    WuImageModule,
    WuAutoCompleteModule,
    WuMenuModule,
    WuTabMenuModule,
    WuMultiSelectModule,
    WuInputMaskModule,
    WuTimelineModule,
    WuPickListModule,
    WuOrderListModule,
    WuFileUploadModule,
    WuStepperModule,
    WuEditorModule,
    WuRippleModule,
    WuKeyFilterModule,
    WuSliderModule,
    WuSplitButtonModule,
    WuListboxModule,
    WuGalleriaModule,
    WuColorPickerModule,
    WuBreadcrumbModule,
    WuInplaceModule,
    WuBlockUIModule,
    WuScrollPanelModule,
    WuScrollerModule,
    WuDrawerModule,
    WuTieredMenuModule,
    WuContextMenuModule,
    WuTreeModule,
    WuTreeSelectModule,
    WuDragDropModule,
    WuNavbarModule,
    WuAsideMenuModule,
    WuImageCropperModule,
    WiIconModule,
    WuTerminalModule,
    WuImageCompareModule,
    WuCarouselModule,
    WuSplitterModule,
    WuOrganizationChartModule,
    WuKnobModule,
    WuEmptyStateModule,
    WuResultModule,
    WuErrorPageModule,
    WuDockModule,
    WuSiteFooterModule,
    WuBottomBarModule,
    WuThaiModule,
    WuChartModule,
    WuInputOtpModule,
    WuFlowModule,
    RouterModule.forChild(
      versionRoutes({
        button: ButtonPageV3,
        card: CardPageV3,
        checkbox: CheckboxPageV3,
        inputtext: InputTextPageV3,
        radiobutton: RadioButtonPageV3,
        textarea: TextareaPageV3,
        toggleswitch: ToggleSwitchPageV3,
        presets: PresetsPageV3,
        tag: TagPageV3,
        badge: BadgePageV3,
        chip: ChipPageV3,
        avatar: AvatarPageV3,
        skeleton: SkeletonPageV3,
        progressbar: ProgressBarPageV3,
        progressspinner: ProgressSpinnerPageV3,
        divider: DividerPageV3,
        panel: PanelPageV3,
        fieldset: FieldsetPageV3,
        message: MessagePageV3,
        iconfield: IconFieldPageV3,
        inputgroup: InputGroupPageV3,
        floatlabel: FloatLabelPageV3,
        togglebutton: ToggleButtonPageV3,
        selectbutton: SelectButtonPageV3,
        rating: RatingPageV3,
        password: PasswordPageV3,
        toolbar: ToolbarPageV3,
        accordion: AccordionPageV3,
        tabs: TabsPageV3,
        inputnumber: InputNumberPageV3,
        datepicker: DatePickerPageV3,
        dialog: DialogPageV3,
        alert: AlertPageV3,
        confirmdialog: ConfirmDialogPageV3,
        toast: ToastPageV3,
        tooltip: TooltipPageV3,
        popover: PopoverPageV3,
        animate: AnimatePageV3,
        metergroup: MeterGroupPageV3,
        validation: ValidationPageV3,
        select: SelectPageV3,
        table: TablePageV3,
        paginator: PaginatorPageV3,
        menubar: MenubarPageV3,
        panelmenu: PanelMenuPageV3,
        steps: StepsPageV3,
        chartjs: ChartJsPageV3,
        image: ImagePageV3,
        autocomplete: AutoCompletePageV3,
        menu: MenuPageV3,
        tabmenu: TabMenuPageV3,
        multiselect: MultiSelectPageV3,
        inputmask: InputMaskPageV3,
        timeline: TimelinePageV3,
        picklist: PickListPageV3,
        orderlist: OrderListPageV3,
        fileupload: FileUploadPageV3,
        stepper: StepperPageV3,
        editor: EditorPageV3,
        ripple: RipplePageV3,
        keyfilter: KeyFilterPageV3,
        slider: SliderPageV3,
        splitbutton: SplitButtonPageV3,
        listbox: ListboxPageV3,
        galleria: GalleriaPageV3,
        colorpicker: ColorPickerPageV3,
        breadcrumb: BreadcrumbPageV3,
        inplace: InplacePageV3,
        blockui: BlockUIPageV3,
        scrollpanel: ScrollPanelPageV3,
        scroller: ScrollerPageV3,
        drawer: DrawerPageV3,
        tieredmenu: TieredMenuPageV3,
        contextmenu: ContextMenuPageV3,
        tree: TreePageV3,
        treeselect: TreeSelectPageV3,
        dragdrop: DragDropPageV3,
        studio: StudioPageV3,
        navbar: NavbarPageV3,
        asidemenu: AsideMenuPageV3,
        imagecropper: ImageCropperPageV3,
        icons: IconsPageV3,
        terminal: TerminalPageV3,
        imagecompare: ImageComparePageV3,
        carousel: CarouselPageV3,
        splitter: SplitterPageV3,
        organizationchart: OrganizationChartPageV3,
        knob: KnobPageV3,
        inputotp: InputOtpPageV3,
        flow: FlowPageV3,
        excel: ExcelPageV3,
        emptystate: EmptyStatePageV3,
        result: ResultPageV3,
        errorpage: ErrorPagePageV3,
        dock: DockPageV3,
        footer: FooterPageV3,
        bottombar: BottomBarPageV3,
        thai: ThaiPageV3,
        chart: ChartPageV3,
      })
    ),
  ],
  providers: [
    provideWiraUI({ locale: 'th', calendar: 'buddhist' }),
    THEME_V3,
    // Overlay services live in this module's injector, as in the v1 and v2 modules.
    WuAlertService,
    WuConfirmationService,
    WuMessageService,
    // The overlay demos open this version's alerts, confirmations and toasts.
    { provide: DOCS_VALIDATORS, useValue: WuValidators },
    // The Terminal demo talks to this version's terminal service.
    { provide: DOCS_TERMINAL, useExisting: WuTerminalService },
    // The Flow demos that apply changes themselves use this version's helpers.
    { provide: DOCS_FLOW, useValue: { applyNodeChanges, applyEdgeChanges, addEdge } },
    // The Excel demos build files with this version's @wirabyte/ui/excel.
    { provide: DOCS_EXCEL, useValue: { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } },
    // The Dialog page's service sample: this module's WuDialogService opens this version's picker.
    WuDialogService,
    { provide: DOCS_DIALOGS, useFactory: () => { const dialogs = inject(WuDialogService); return { pickStudent: (config: object) => dialogs.open(PickStudentV3, config).result }; } },
    {
      provide: DOCS_OVERLAYS,
      useFactory: (): DocsOverlays => ({
        alert: inject(WuAlertService),
        staticAlert: WuAlert,
        confirm: inject(WuConfirmationService),
        messages: inject(WuMessageService),
      }),
    },
  ],
})
export class DocsV3Module {}
