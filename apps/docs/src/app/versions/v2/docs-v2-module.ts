import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WuButtonModule } from 'wiraui-v2/button';
import { WuSelectModule } from 'wiraui-v2/select';
import { WuTableModule } from 'wiraui-v2/table';
import { WuPaginatorModule } from 'wiraui-v2/paginator';
import { WuMenubarModule } from 'wiraui-v2/menubar';
import { WuPanelMenuModule } from 'wiraui-v2/panelmenu';
import { WuStepsModule } from 'wiraui-v2/steps';
import { WuChartJsModule } from 'wiraui-v2/chartjs';
import { WuImageModule } from 'wiraui-v2/image';
import { WuAutoCompleteModule } from 'wiraui-v2/autocomplete';
import { WuMenuModule } from 'wiraui-v2/menu';
import { WuTabMenuModule } from 'wiraui-v2/tabmenu';
import { WuMultiSelectModule } from 'wiraui-v2/multiselect';
import { WuInputMaskModule } from 'wiraui-v2/inputmask';
import { WuTimelineModule } from 'wiraui-v2/timeline';
import { WuPickListModule } from 'wiraui-v2/picklist';
import { WuOrderListModule } from 'wiraui-v2/orderlist';
import { WuFileUploadModule } from 'wiraui-v2/fileupload';
import { WuStepperModule } from 'wiraui-v2/stepper';
import { WuEditorModule } from 'wiraui-v2/editor';
import { WuRippleModule } from 'wiraui-v2/ripple';
import { WuKeyFilterModule } from 'wiraui-v2/keyfilter';
import { WuSliderModule } from 'wiraui-v2/slider';
import { WuSplitButtonModule } from 'wiraui-v2/splitbutton';
import { WuListboxModule } from 'wiraui-v2/listbox';
import { WuGalleriaModule } from 'wiraui-v2/galleria';
import { WuColorPickerModule } from 'wiraui-v2/colorpicker';
import { WuBreadcrumbModule } from 'wiraui-v2/breadcrumb';
import { WuInplaceModule } from 'wiraui-v2/inplace';
import { WuBlockUIModule } from 'wiraui-v2/blockui';
import { WuScrollPanelModule } from 'wiraui-v2/scrollpanel';
import { WuScrollerModule } from 'wiraui-v2/scroller';
import { WuDrawerModule } from 'wiraui-v2/drawer';
import { WuTieredMenuModule } from 'wiraui-v2/tieredmenu';
import { WuContextMenuModule } from 'wiraui-v2/contextmenu';
import { WuTreeModule } from 'wiraui-v2/tree';
import { WuTreeSelectModule } from 'wiraui-v2/treeselect';
import { WuDragDropModule } from 'wiraui-v2/dragdrop';
import { WuNavbarModule } from 'wiraui-v2/navbar';
import { WuAsideMenuModule } from 'wiraui-v2/asidemenu';
import { WuImageCropperModule } from 'wiraui-v2/imagecropper';
import { WiIconModule } from '@wirabyte/icons/angular';
import { WuTerminalModule, WuTerminalService } from 'wiraui-v2/terminal';
import { WuImageCompareModule } from 'wiraui-v2/imagecompare';
import { WuCarouselModule } from 'wiraui-v2/carousel';
import { WuSplitterModule } from 'wiraui-v2/splitter';
import { WuOrganizationChartModule } from 'wiraui-v2/organizationchart';
import { WuKnobModule } from 'wiraui-v2/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from 'wiraui-v2/excel';
import { WuEmptyStateModule } from 'wiraui-v2/emptystate';
import { WuResultModule } from 'wiraui-v2/result';
import { WuErrorPageModule } from 'wiraui-v2/errorpage';
import { WuDockModule } from 'wiraui-v2/dock';
import { WuSiteFooterModule } from 'wiraui-v2/sitefooter';
import { WuBottomBarModule } from 'wiraui-v2/bottombar';
import { WuThaiModule } from 'wiraui-v2/thai';
import { WuInputOtpModule } from 'wiraui-v2/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WuFlowModule } from 'wiraui-v2/flow';
import { WuMeterGroupModule } from 'wiraui-v2/metergroup';
import { WuValidationModule, WuValidators } from 'wiraui-v2/validation';
import { WuDialogModule, WuDialogService } from 'wiraui-v2/dialog';
import { WuAlert, WuAlertModule, WuAlertService } from 'wiraui-v2/alert';
import { WuConfirmationService, WuConfirmDialogModule } from 'wiraui-v2/confirmdialog';
import { WuMessageService, WuToastModule } from 'wiraui-v2/toast';
import { WuTooltipModule } from 'wiraui-v2/tooltip';
import { WuPopoverModule } from 'wiraui-v2/popover';
import { WuAnimateModule } from 'wiraui-v2/animate';
import { WuDatePickerModule } from 'wiraui-v2/datepicker';
import { WuInputNumberModule } from 'wiraui-v2/inputnumber';
import { WuToolbarModule } from 'wiraui-v2/toolbar';
import { WuAccordionModule } from 'wiraui-v2/accordion';
import { WuTabsModule } from 'wiraui-v2/tabs';
import { WuIconFieldModule } from 'wiraui-v2/iconfield';
import { WuInputGroupModule } from 'wiraui-v2/inputgroup';
import { WuFloatLabelModule } from 'wiraui-v2/floatlabel';
import { WuToggleButtonModule } from 'wiraui-v2/togglebutton';
import { WuSelectButtonModule } from 'wiraui-v2/selectbutton';
import { WuRatingModule } from 'wiraui-v2/rating';
import { WuPasswordModule } from 'wiraui-v2/password';
import { WuTagModule } from 'wiraui-v2/tag';
import { WuBadgeModule } from 'wiraui-v2/badge';
import { WuChipModule } from 'wiraui-v2/chip';
import { WuAvatarModule } from 'wiraui-v2/avatar';
import { WuSkeletonModule } from 'wiraui-v2/skeleton';
import { WuProgressBarModule } from 'wiraui-v2/progressbar';
import { WuProgressSpinnerModule } from 'wiraui-v2/progressspinner';
import { WuDividerModule } from 'wiraui-v2/divider';
import { WuPanelModule } from 'wiraui-v2/panel';
import { WuFieldsetModule } from 'wiraui-v2/fieldset';
import { WuMessageModule } from 'wiraui-v2/message';
import { WuCardModule } from 'wiraui-v2/card';
import { WuCheckboxModule } from 'wiraui-v2/checkbox';
import { provideWiraUI, ɵWU_SKIP_VERSION_CHECK } from 'wiraui-v2/config';
import { WuInputTextModule } from 'wiraui-v2/inputtext';
import { WuRadioButtonModule } from 'wiraui-v2/radiobutton';
import { WuTextareaModule } from 'wiraui-v2/textarea';
import { WuToggleSwitchModule } from 'wiraui-v2/toggleswitch';
import { DOCS_DIALOGS, DOCS_EXCEL, DOCS_FLOW, DOCS_OVERLAYS, DOCS_TERMINAL, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
import { DocsSharedModule } from '../../shared/docs-shared-module';
import { DocsPagesModule } from '../../shared/pages/docs-pages-module';
import { versionRoutes } from '../shared/version-routes';
import {
  ButtonPageV2,
  CardPageV2,
  CheckboxPageV2,
  InputTextPageV2,
  PresetsPageV2,
  RadioButtonPageV2,
  TagPageV2,
  BadgePageV2,
  ChipPageV2,
  AvatarPageV2,
  SkeletonPageV2,
  ProgressBarPageV2,
  ProgressSpinnerPageV2,
  DividerPageV2,
  PanelPageV2,
  FieldsetPageV2,
  MessagePageV2,
  IconFieldPageV2,
  InputGroupPageV2,
  FloatLabelPageV2,
  ToggleButtonPageV2,
  SelectButtonPageV2,
  RatingPageV2,
  PasswordPageV2,
  ToolbarPageV2,
  AccordionPageV2,
  TabsPageV2,
  InputNumberPageV2,
  DatePickerPageV2,
  DialogPageV2,
  AlertPageV2,
  ConfirmDialogPageV2,
  ToastPageV2,
  TooltipPageV2,
  PopoverPageV2,
  AnimatePageV2,
  MeterGroupPageV2,
  ValidationPageV2,
  SelectPageV2,
  TablePageV2,
  PaginatorPageV2,
  MenubarPageV2,
  PanelMenuPageV2,
  StepsPageV2,
  ChartJsPageV2,
  ImagePageV2,
  AutoCompletePageV2,
  MenuPageV2,
  TabMenuPageV2,
  MultiSelectPageV2,
  InputMaskPageV2,
  TimelinePageV2,
  PickListPageV2,
  OrderListPageV2,
  FileUploadPageV2,
  StepperPageV2,
  EditorPageV2,
  RipplePageV2,
  KeyFilterPageV2,
  SliderPageV2,
  SplitButtonPageV2,
  ListboxPageV2,
  GalleriaPageV2,
  ColorPickerPageV2,
  BreadcrumbPageV2,
  InplacePageV2,
  BlockUIPageV2,
  ScrollPanelPageV2,
  ScrollerPageV2,
  DrawerPageV2,
  TieredMenuPageV2,
  ContextMenuPageV2,
  TreePageV2,
  TreeSelectPageV2,
  DragDropPageV2,
  StudioPageV2,
  NavbarPageV2,
  AsideMenuPageV2,
  ImageCropperPageV2,
  IconsPageV2,
  TerminalPageV2,
  ImageComparePageV2,
  CarouselPageV2,
  SplitterPageV2,
  OrganizationChartPageV2,
  KnobPageV2,
  InputOtpPageV2,
  FlowPageV2,
  ExcelPageV2,
  EmptyStatePageV2,
  ResultPageV2,
  ErrorPagePageV2,
  DockPageV2,
  FooterPageV2,
  BottomBarPageV2,
  ThaiPageV2,
  PickStudentV2,
  TextareaPageV2,
  ToggleSwitchPageV2,
} from './pages-v2';
import { THEME_V2 } from './theme-v2';

@NgModule({
  declarations: [
    ButtonPageV2,
    CardPageV2,
    CheckboxPageV2,
    InputTextPageV2,
    RadioButtonPageV2,
    TextareaPageV2,
    ToggleSwitchPageV2,
    PresetsPageV2,
    TagPageV2,
    BadgePageV2,
    ChipPageV2,
    AvatarPageV2,
    SkeletonPageV2,
    ProgressBarPageV2,
    ProgressSpinnerPageV2,
    DividerPageV2,
    PanelPageV2,
    FieldsetPageV2,
    MessagePageV2,
    IconFieldPageV2,
    InputGroupPageV2,
    FloatLabelPageV2,
    ToggleButtonPageV2,
    SelectButtonPageV2,
    RatingPageV2,
    PasswordPageV2,
    ToolbarPageV2,
    AccordionPageV2,
    TabsPageV2,
    InputNumberPageV2,
    DatePickerPageV2,
    DialogPageV2,
    AlertPageV2,
    ConfirmDialogPageV2,
    ToastPageV2,
    TooltipPageV2,
    PopoverPageV2,
    AnimatePageV2,
    MeterGroupPageV2,
    ValidationPageV2,
    SelectPageV2,
    TablePageV2,
    PaginatorPageV2,
    MenubarPageV2,
    PanelMenuPageV2,
    StepsPageV2,
    ChartJsPageV2,
    ImagePageV2,
    AutoCompletePageV2,
    MenuPageV2,
    TabMenuPageV2,
    MultiSelectPageV2,
    InputMaskPageV2,
    TimelinePageV2,
    PickListPageV2,
    OrderListPageV2,
    FileUploadPageV2,
    StepperPageV2,
    EditorPageV2,
    RipplePageV2,
    KeyFilterPageV2,
    SliderPageV2,
    SplitButtonPageV2,
    ListboxPageV2,
    GalleriaPageV2,
    ColorPickerPageV2,
    BreadcrumbPageV2,
    InplacePageV2,
    BlockUIPageV2,
    ScrollPanelPageV2,
    ScrollerPageV2,
    DrawerPageV2,
    TieredMenuPageV2,
    ContextMenuPageV2,
    TreePageV2,
    TreeSelectPageV2,
    DragDropPageV2,
    StudioPageV2,
    NavbarPageV2,
    AsideMenuPageV2,
    ImageCropperPageV2,
    IconsPageV2,
    TerminalPageV2,
    ImageComparePageV2,
    CarouselPageV2,
    SplitterPageV2,
    OrganizationChartPageV2,
    KnobPageV2,
    InputOtpPageV2,
    FlowPageV2,
    ExcelPageV2,
    EmptyStatePageV2,
    ResultPageV2,
    ErrorPagePageV2,
    DockPageV2,
    FooterPageV2,
    BottomBarPageV2,
    ThaiPageV2,
    PickStudentV2,
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
    WuInputOtpModule,
    WuFlowModule,
    RouterModule.forChild(
      versionRoutes({
        button: ButtonPageV2,
        card: CardPageV2,
        checkbox: CheckboxPageV2,
        inputtext: InputTextPageV2,
        radiobutton: RadioButtonPageV2,
        textarea: TextareaPageV2,
        toggleswitch: ToggleSwitchPageV2,
        presets: PresetsPageV2,
        tag: TagPageV2,
        badge: BadgePageV2,
        chip: ChipPageV2,
        avatar: AvatarPageV2,
        skeleton: SkeletonPageV2,
        progressbar: ProgressBarPageV2,
        progressspinner: ProgressSpinnerPageV2,
        divider: DividerPageV2,
        panel: PanelPageV2,
        fieldset: FieldsetPageV2,
        message: MessagePageV2,
        iconfield: IconFieldPageV2,
        inputgroup: InputGroupPageV2,
        floatlabel: FloatLabelPageV2,
        togglebutton: ToggleButtonPageV2,
        selectbutton: SelectButtonPageV2,
        rating: RatingPageV2,
        password: PasswordPageV2,
        toolbar: ToolbarPageV2,
        accordion: AccordionPageV2,
        tabs: TabsPageV2,
        inputnumber: InputNumberPageV2,
        datepicker: DatePickerPageV2,
        dialog: DialogPageV2,
        alert: AlertPageV2,
        confirmdialog: ConfirmDialogPageV2,
        toast: ToastPageV2,
        tooltip: TooltipPageV2,
        popover: PopoverPageV2,
        animate: AnimatePageV2,
        metergroup: MeterGroupPageV2,
        validation: ValidationPageV2,
        select: SelectPageV2,
        table: TablePageV2,
        paginator: PaginatorPageV2,
        menubar: MenubarPageV2,
        panelmenu: PanelMenuPageV2,
        steps: StepsPageV2,
        chartjs: ChartJsPageV2,
        image: ImagePageV2,
        autocomplete: AutoCompletePageV2,
        menu: MenuPageV2,
        tabmenu: TabMenuPageV2,
        multiselect: MultiSelectPageV2,
        inputmask: InputMaskPageV2,
        timeline: TimelinePageV2,
        picklist: PickListPageV2,
        orderlist: OrderListPageV2,
        fileupload: FileUploadPageV2,
        stepper: StepperPageV2,
        editor: EditorPageV2,
        ripple: RipplePageV2,
        keyfilter: KeyFilterPageV2,
        slider: SliderPageV2,
        splitbutton: SplitButtonPageV2,
        listbox: ListboxPageV2,
        galleria: GalleriaPageV2,
        colorpicker: ColorPickerPageV2,
        breadcrumb: BreadcrumbPageV2,
        inplace: InplacePageV2,
        blockui: BlockUIPageV2,
        scrollpanel: ScrollPanelPageV2,
        scroller: ScrollerPageV2,
        drawer: DrawerPageV2,
        tieredmenu: TieredMenuPageV2,
        contextmenu: ContextMenuPageV2,
        tree: TreePageV2,
        treeselect: TreeSelectPageV2,
        dragdrop: DragDropPageV2,
        studio: StudioPageV2,
        navbar: NavbarPageV2,
        asidemenu: AsideMenuPageV2,
        imagecropper: ImageCropperPageV2,
        icons: IconsPageV2,
        terminal: TerminalPageV2,
        imagecompare: ImageComparePageV2,
        carousel: CarouselPageV2,
        splitter: SplitterPageV2,
        organizationchart: OrganizationChartPageV2,
        knob: KnobPageV2,
        inputotp: InputOtpPageV2,
        flow: FlowPageV2,
        excel: ExcelPageV2,
        emptystate: EmptyStatePageV2,
        result: ResultPageV2,
        errorpage: ErrorPagePageV2,
        dock: DockPageV2,
        footer: FooterPageV2,
        bottombar: BottomBarPageV2,
        thai: ThaiPageV2,
      })
    ),
  ],
  providers: [
    // Docs site only: @wirabyte/ui@2 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWU_SKIP_VERSION_CHECK, useValue: true },
    provideWiraUI({ locale: 'th', calendar: 'buddhist' }),
    THEME_V2,
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
    { provide: DOCS_DIALOGS, useFactory: () => { const dialogs = inject(WuDialogService); return { pickStudent: (config: object) => dialogs.open(PickStudentV2, config).result }; } },
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
export class DocsV2Module {}
