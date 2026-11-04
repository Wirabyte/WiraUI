import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from 'wiraui-v1/button';
import { WuSelectModule } from 'wiraui-v1/select';
import { WuTableModule } from 'wiraui-v1/table';
import { WuPaginatorModule } from 'wiraui-v1/paginator';
import { WuMenubarModule } from 'wiraui-v1/menubar';
import { WuPanelMenuModule } from 'wiraui-v1/panelmenu';
import { WuStepsModule } from 'wiraui-v1/steps';
import { WuChartJsModule } from 'wiraui-v1/chartjs';
import { WuImageModule } from 'wiraui-v1/image';
import { WuAutoCompleteModule } from 'wiraui-v1/autocomplete';
import { WuMenuModule } from 'wiraui-v1/menu';
import { WuTabMenuModule } from 'wiraui-v1/tabmenu';
import { WuMultiSelectModule } from 'wiraui-v1/multiselect';
import { WuInputMaskModule } from 'wiraui-v1/inputmask';
import { WuTimelineModule } from 'wiraui-v1/timeline';
import { WuPickListModule } from 'wiraui-v1/picklist';
import { WuOrderListModule } from 'wiraui-v1/orderlist';
import { WuFileUploadModule } from 'wiraui-v1/fileupload';
import { WuStepperModule } from 'wiraui-v1/stepper';
import { WuEditorModule } from 'wiraui-v1/editor';
import { WuRippleModule } from 'wiraui-v1/ripple';
import { WuKeyFilterModule } from 'wiraui-v1/keyfilter';
import { WuSliderModule } from 'wiraui-v1/slider';
import { WuSplitButtonModule } from 'wiraui-v1/splitbutton';
import { WuListboxModule } from 'wiraui-v1/listbox';
import { WuGalleriaModule } from 'wiraui-v1/galleria';
import { WuColorPickerModule } from 'wiraui-v1/colorpicker';
import { WuBreadcrumbModule } from 'wiraui-v1/breadcrumb';
import { WuInplaceModule } from 'wiraui-v1/inplace';
import { WuBlockUIModule } from 'wiraui-v1/blockui';
import { WuScrollPanelModule } from 'wiraui-v1/scrollpanel';
import { WuScrollerModule } from 'wiraui-v1/scroller';
import { WuDrawerModule } from 'wiraui-v1/drawer';
import { WuTieredMenuModule } from 'wiraui-v1/tieredmenu';
import { WuContextMenuModule } from 'wiraui-v1/contextmenu';
import { WuTreeModule } from 'wiraui-v1/tree';
import { WuTreeSelectModule } from 'wiraui-v1/treeselect';
import { WuDragDropModule } from 'wiraui-v1/dragdrop';
import { WuNavbarModule } from 'wiraui-v1/navbar';
import { WuAsideMenuModule } from 'wiraui-v1/asidemenu';
import { WuImageCropperModule } from 'wiraui-v1/imagecropper';
import { WiIconModule } from '@wirabyte/icons/angular';
import { WuTerminalModule, WuTerminalService } from 'wiraui-v1/terminal';
import { WuImageCompareModule } from 'wiraui-v1/imagecompare';
import { WuCarouselModule } from 'wiraui-v1/carousel';
import { WuSplitterModule } from 'wiraui-v1/splitter';
import { WuOrganizationChartModule } from 'wiraui-v1/organizationchart';
import { WuKnobModule } from 'wiraui-v1/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from 'wiraui-v1/excel';
import { WuEmptyStateModule } from 'wiraui-v1/emptystate';
import { WuResultModule } from 'wiraui-v1/result';
import { WuErrorPageModule } from 'wiraui-v1/errorpage';
import { WuDockModule } from 'wiraui-v1/dock';
import { WuSiteFooterModule } from 'wiraui-v1/sitefooter';
import { WuBottomBarModule } from 'wiraui-v1/bottombar';
import { WuStatModule } from 'wiraui-v1/stat';
import { WuDescriptionsModule } from 'wiraui-v1/descriptions';
import { WuSignaturePadModule } from 'wiraui-v1/signaturepad';
import { WuChatModule } from 'wiraui-v1/chat';
import { WuSchedulerModule } from 'wiraui-v1/scheduler';
import { WuThaiModule } from 'wiraui-v1/thai';
import { WuInputOtpModule } from 'wiraui-v1/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WuFlowModule } from 'wiraui-v1/flow';
import { WuMeterGroupModule } from 'wiraui-v1/metergroup';
import { WuValidationModule, WuValidators } from 'wiraui-v1/validation';
import { WuDialogModule, WuDialogService } from 'wiraui-v1/dialog';
import { WuAlert, WuAlertModule, WuAlertService } from 'wiraui-v1/alert';
import { WuConfirmationService, WuConfirmDialogModule } from 'wiraui-v1/confirmdialog';
import { WuMessageService, WuToastModule } from 'wiraui-v1/toast';
import { WuTooltipModule } from 'wiraui-v1/tooltip';
import { WuPopoverModule } from 'wiraui-v1/popover';
import { WuAnimateModule } from 'wiraui-v1/animate';
import { WuDatePickerModule } from 'wiraui-v1/datepicker';
import { WuInputNumberModule } from 'wiraui-v1/inputnumber';
import { WuToolbarModule } from 'wiraui-v1/toolbar';
import { WuAccordionModule } from 'wiraui-v1/accordion';
import { WuTabsModule } from 'wiraui-v1/tabs';
import { WuIconFieldModule } from 'wiraui-v1/iconfield';
import { WuInputGroupModule } from 'wiraui-v1/inputgroup';
import { WuFloatLabelModule } from 'wiraui-v1/floatlabel';
import { WuToggleButtonModule } from 'wiraui-v1/togglebutton';
import { WuSelectButtonModule } from 'wiraui-v1/selectbutton';
import { WuRatingModule } from 'wiraui-v1/rating';
import { WuPasswordModule } from 'wiraui-v1/password';
import { WuTagModule } from 'wiraui-v1/tag';
import { WuBadgeModule } from 'wiraui-v1/badge';
import { WuChipModule } from 'wiraui-v1/chip';
import { WuAvatarModule } from 'wiraui-v1/avatar';
import { WuSkeletonModule } from 'wiraui-v1/skeleton';
import { WuProgressBarModule } from 'wiraui-v1/progressbar';
import { WuProgressSpinnerModule } from 'wiraui-v1/progressspinner';
import { WuDividerModule } from 'wiraui-v1/divider';
import { WuPanelModule } from 'wiraui-v1/panel';
import { WuFieldsetModule } from 'wiraui-v1/fieldset';
import { WuMessageModule } from 'wiraui-v1/message';
import { WuCardModule } from 'wiraui-v1/card';
import { WuCheckboxModule } from 'wiraui-v1/checkbox';
import { provideWiraUI, ɵWU_SKIP_VERSION_CHECK } from 'wiraui-v1/config';
import { WuInputTextModule } from 'wiraui-v1/inputtext';
import { WuRadioButtonModule } from 'wiraui-v1/radiobutton';
import { WuTextareaModule } from 'wiraui-v1/textarea';
import { WuToggleSwitchModule } from 'wiraui-v1/toggleswitch';
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
  DockPageV1,
  FooterPageV1,
  BottomBarPageV1,
  StatPageV1,
  DescriptionsPageV1,
  SignaturePadPageV1,
  ChatPageV1,
  SchedulerPageV1,
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
    DockPageV1,
    FooterPageV1,
    BottomBarPageV1,
    StatPageV1,
    DescriptionsPageV1,
    SignaturePadPageV1,
    ChatPageV1,
    SchedulerPageV1,
    ThaiPageV1,
    PickStudentV1,
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
    WuStatModule,
    WuDescriptionsModule,
    WuSignaturePadModule,
    WuChatModule,
    WuSchedulerModule,
    WuThaiModule,
    WuInputOtpModule,
    WuFlowModule,
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
        dock: DockPageV1,
        footer: FooterPageV1,
        bottombar: BottomBarPageV1,
        stat: StatPageV1,
        descriptions: DescriptionsPageV1,
        signaturepad: SignaturePadPageV1,
        chat: ChatPageV1,
        scheduler: SchedulerPageV1,
        thai: ThaiPageV1,
      })
    ),
  ],
  providers: [
    // Docs site only: @wirabyte/ui@1 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWU_SKIP_VERSION_CHECK, useValue: true },
    provideWiraUI({ locale: 'th', calendar: 'buddhist' }),
    THEME_V1,
    // Overlay services live in this module's injector, not the app root: the alert dialog they create then sees the
    // version check skip above, and pages of one major never reach another major's services.
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
    { provide: DOCS_DIALOGS, useFactory: () => { const dialogs = inject(WuDialogService); return { pickStudent: (config: object) => dialogs.open(PickStudentV1, config).result }; } },
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
export class DocsV1Module {}
