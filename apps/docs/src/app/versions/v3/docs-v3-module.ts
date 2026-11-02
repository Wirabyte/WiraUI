import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from 'wiraui/button';
import { WuSelectModule } from 'wiraui/select';
import { WuTableModule } from 'wiraui/table';
import { WuPaginatorModule } from 'wiraui/paginator';
import { WuMenubarModule } from 'wiraui/menubar';
import { WuPanelMenuModule } from 'wiraui/panelmenu';
import { WuStepsModule } from 'wiraui/steps';
import { WuChartJsModule } from 'wiraui/chartjs';
import { WuImageModule } from 'wiraui/image';
import { WuAutoCompleteModule } from 'wiraui/autocomplete';
import { WuMenuModule } from 'wiraui/menu';
import { WuTabMenuModule } from 'wiraui/tabmenu';
import { WuMultiSelectModule } from 'wiraui/multiselect';
import { WuInputMaskModule } from 'wiraui/inputmask';
import { WuTimelineModule } from 'wiraui/timeline';
import { WuPickListModule } from 'wiraui/picklist';
import { WuOrderListModule } from 'wiraui/orderlist';
import { WuFileUploadModule } from 'wiraui/fileupload';
import { WuStepperModule } from 'wiraui/stepper';
import { WuEditorModule } from 'wiraui/editor';
import { WuRippleModule } from 'wiraui/ripple';
import { WuKeyFilterModule } from 'wiraui/keyfilter';
import { WuSliderModule } from 'wiraui/slider';
import { WuSplitButtonModule } from 'wiraui/splitbutton';
import { WuListboxModule } from 'wiraui/listbox';
import { WuGalleriaModule } from 'wiraui/galleria';
import { WuColorPickerModule } from 'wiraui/colorpicker';
import { WuBreadcrumbModule } from 'wiraui/breadcrumb';
import { WuInplaceModule } from 'wiraui/inplace';
import { WuBlockUIModule } from 'wiraui/blockui';
import { WuScrollPanelModule } from 'wiraui/scrollpanel';
import { WuScrollerModule } from 'wiraui/scroller';
import { WuDrawerModule } from 'wiraui/drawer';
import { WuTieredMenuModule } from 'wiraui/tieredmenu';
import { WuContextMenuModule } from 'wiraui/contextmenu';
import { WuTreeModule } from 'wiraui/tree';
import { WuTreeSelectModule } from 'wiraui/treeselect';
import { WuDragDropModule } from 'wiraui/dragdrop';
import { WuNavbarModule } from 'wiraui/navbar';
import { WuAsideMenuModule } from 'wiraui/asidemenu';
import { WuImageCropperModule } from 'wiraui/imagecropper';
import { WiIconModule } from 'wiraicon/angular';
import { WuTerminalModule, WuTerminalService } from 'wiraui/terminal';
import { WuImageCompareModule } from 'wiraui/imagecompare';
import { WuCarouselModule } from 'wiraui/carousel';
import { WuSplitterModule } from 'wiraui/splitter';
import { WuOrganizationChartModule } from 'wiraui/organizationchart';
import { WuKnobModule } from 'wiraui/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from 'wiraui/excel';
import { WuEmptyStateModule } from 'wiraui/emptystate';
import { WuResultModule } from 'wiraui/result';
import { WuErrorPageModule } from 'wiraui/errorpage';
import { WuDockModule } from 'wiraui/dock';
import { WuSiteFooterModule } from 'wiraui/sitefooter';
import { WuBottomBarModule } from 'wiraui/bottombar';
import { WuThaiModule } from 'wiraui/thai';
import { WuChartModule } from 'wiraui/chart';
import { WuInputOtpModule } from 'wiraui/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WuFlowModule } from 'wiraui/flow';
import { WuMeterGroupModule } from 'wiraui/metergroup';
import { WuValidationModule, WuValidators } from 'wiraui/validation';
import { WuDialogModule, WuDialogService } from 'wiraui/dialog';
import { WuAlert, WuAlertModule, WuAlertService } from 'wiraui/alert';
import { WuConfirmationService, WuConfirmDialogModule } from 'wiraui/confirmdialog';
import { WuMessageService, WuToastModule } from 'wiraui/toast';
import { WuTooltipModule } from 'wiraui/tooltip';
import { WuPopoverModule } from 'wiraui/popover';
import { WuAnimateModule } from 'wiraui/animate';
import { WuDatePickerModule } from 'wiraui/datepicker';
import { WuInputNumberModule } from 'wiraui/inputnumber';
import { WuToolbarModule } from 'wiraui/toolbar';
import { WuAccordionModule } from 'wiraui/accordion';
import { WuTabsModule } from 'wiraui/tabs';
import { WuIconFieldModule } from 'wiraui/iconfield';
import { WuInputGroupModule } from 'wiraui/inputgroup';
import { WuFloatLabelModule } from 'wiraui/floatlabel';
import { WuToggleButtonModule } from 'wiraui/togglebutton';
import { WuSelectButtonModule } from 'wiraui/selectbutton';
import { WuRatingModule } from 'wiraui/rating';
import { WuPasswordModule } from 'wiraui/password';
import { WuTagModule } from 'wiraui/tag';
import { WuBadgeModule } from 'wiraui/badge';
import { WuChipModule } from 'wiraui/chip';
import { WuAvatarModule } from 'wiraui/avatar';
import { WuSkeletonModule } from 'wiraui/skeleton';
import { WuProgressBarModule } from 'wiraui/progressbar';
import { WuProgressSpinnerModule } from 'wiraui/progressspinner';
import { WuDividerModule } from 'wiraui/divider';
import { WuPanelModule } from 'wiraui/panel';
import { WuFieldsetModule } from 'wiraui/fieldset';
import { WuMessageModule } from 'wiraui/message';
import { WuCardModule } from 'wiraui/card';
import { WuCheckboxModule } from 'wiraui/checkbox';
import { provideWiraUI } from 'wiraui/config';
import { WuInputTextModule } from 'wiraui/inputtext';
import { WuRadioButtonModule } from 'wiraui/radiobutton';
import { WuTextareaModule } from 'wiraui/textarea';
import { WuToggleSwitchModule } from 'wiraui/toggleswitch';
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
    // The Excel demos build files with this version's wiraui/excel.
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
