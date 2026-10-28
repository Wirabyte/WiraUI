import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v2/button';
import { WtSelectModule } from 'wiratheme-v2/select';
import { WtTableModule } from 'wiratheme-v2/table';
import { WtPaginatorModule } from 'wiratheme-v2/paginator';
import { WtMenubarModule } from 'wiratheme-v2/menubar';
import { WtPanelMenuModule } from 'wiratheme-v2/panelmenu';
import { WtStepsModule } from 'wiratheme-v2/steps';
import { WtChartJsModule } from 'wiratheme-v2/chartjs';
import { WtImageModule } from 'wiratheme-v2/image';
import { WtAutoCompleteModule } from 'wiratheme-v2/autocomplete';
import { WtMenuModule } from 'wiratheme-v2/menu';
import { WtTabMenuModule } from 'wiratheme-v2/tabmenu';
import { WtMultiSelectModule } from 'wiratheme-v2/multiselect';
import { WtInputMaskModule } from 'wiratheme-v2/inputmask';
import { WtTimelineModule } from 'wiratheme-v2/timeline';
import { WtPickListModule } from 'wiratheme-v2/picklist';
import { WtOrderListModule } from 'wiratheme-v2/orderlist';
import { WtFileUploadModule } from 'wiratheme-v2/fileupload';
import { WtStepperModule } from 'wiratheme-v2/stepper';
import { WtEditorModule } from 'wiratheme-v2/editor';
import { WtRippleModule } from 'wiratheme-v2/ripple';
import { WtKeyFilterModule } from 'wiratheme-v2/keyfilter';
import { WtSliderModule } from 'wiratheme-v2/slider';
import { WtSplitButtonModule } from 'wiratheme-v2/splitbutton';
import { WtListboxModule } from 'wiratheme-v2/listbox';
import { WtGalleriaModule } from 'wiratheme-v2/galleria';
import { WtColorPickerModule } from 'wiratheme-v2/colorpicker';
import { WtBreadcrumbModule } from 'wiratheme-v2/breadcrumb';
import { WtInplaceModule } from 'wiratheme-v2/inplace';
import { WtBlockUIModule } from 'wiratheme-v2/blockui';
import { WtScrollPanelModule } from 'wiratheme-v2/scrollpanel';
import { WtScrollerModule } from 'wiratheme-v2/scroller';
import { WtDrawerModule } from 'wiratheme-v2/drawer';
import { WtTieredMenuModule } from 'wiratheme-v2/tieredmenu';
import { WtContextMenuModule } from 'wiratheme-v2/contextmenu';
import { WtTreeModule } from 'wiratheme-v2/tree';
import { WtTreeSelectModule } from 'wiratheme-v2/treeselect';
import { WtDragDropModule } from 'wiratheme-v2/dragdrop';
import { WtNavbarModule } from 'wiratheme-v2/navbar';
import { WtAsideMenuModule } from 'wiratheme-v2/asidemenu';
import { WtImageCropperModule } from 'wiratheme-v2/imagecropper';
import { WiIconModule } from 'wiraicon/angular';
import { WtTerminalModule, WtTerminalService } from 'wiratheme-v2/terminal';
import { WtImageCompareModule } from 'wiratheme-v2/imagecompare';
import { WtCarouselModule } from 'wiratheme-v2/carousel';
import { WtSplitterModule } from 'wiratheme-v2/splitter';
import { WtOrganizationChartModule } from 'wiratheme-v2/organizationchart';
import { WtKnobModule } from 'wiratheme-v2/knob';
import { downloadExcel, downloadRowsAsExcel, excelSheetFromRows } from 'wiratheme-v2/excel';
import { WtEmptyStateModule } from 'wiratheme-v2/emptystate';
import { WtResultModule } from 'wiratheme-v2/result';
import { WtErrorPageModule } from 'wiratheme-v2/errorpage';
import { WtDockModule } from 'wiratheme-v2/dock';
import { WtSiteFooterModule } from 'wiratheme-v2/sitefooter';
import { WtBottomBarModule } from 'wiratheme-v2/bottombar';
import { WtThaiModule } from 'wiratheme-v2/thai';
import { WtInputOtpModule } from 'wiratheme-v2/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WtFlowModule } from 'wiratheme-v2/flow';
import { WtMeterGroupModule } from 'wiratheme-v2/metergroup';
import { WtValidationModule, WtValidators } from 'wiratheme-v2/validation';
import { WtDialogModule, WtDialogService } from 'wiratheme-v2/dialog';
import { WtAlert, WtAlertModule, WtAlertService } from 'wiratheme-v2/alert';
import { WtConfirmationService, WtConfirmDialogModule } from 'wiratheme-v2/confirmdialog';
import { WtMessageService, WtToastModule } from 'wiratheme-v2/toast';
import { WtTooltipModule } from 'wiratheme-v2/tooltip';
import { WtPopoverModule } from 'wiratheme-v2/popover';
import { WtAnimateModule } from 'wiratheme-v2/animate';
import { WtDatePickerModule } from 'wiratheme-v2/datepicker';
import { WtInputNumberModule } from 'wiratheme-v2/inputnumber';
import { WtToolbarModule } from 'wiratheme-v2/toolbar';
import { WtAccordionModule } from 'wiratheme-v2/accordion';
import { WtTabsModule } from 'wiratheme-v2/tabs';
import { WtIconFieldModule } from 'wiratheme-v2/iconfield';
import { WtInputGroupModule } from 'wiratheme-v2/inputgroup';
import { WtFloatLabelModule } from 'wiratheme-v2/floatlabel';
import { WtToggleButtonModule } from 'wiratheme-v2/togglebutton';
import { WtSelectButtonModule } from 'wiratheme-v2/selectbutton';
import { WtRatingModule } from 'wiratheme-v2/rating';
import { WtPasswordModule } from 'wiratheme-v2/password';
import { WtTagModule } from 'wiratheme-v2/tag';
import { WtBadgeModule } from 'wiratheme-v2/badge';
import { WtChipModule } from 'wiratheme-v2/chip';
import { WtAvatarModule } from 'wiratheme-v2/avatar';
import { WtSkeletonModule } from 'wiratheme-v2/skeleton';
import { WtProgressBarModule } from 'wiratheme-v2/progressbar';
import { WtProgressSpinnerModule } from 'wiratheme-v2/progressspinner';
import { WtDividerModule } from 'wiratheme-v2/divider';
import { WtPanelModule } from 'wiratheme-v2/panel';
import { WtFieldsetModule } from 'wiratheme-v2/fieldset';
import { WtMessageModule } from 'wiratheme-v2/message';
import { WtCardModule } from 'wiratheme-v2/card';
import { WtCheckboxModule } from 'wiratheme-v2/checkbox';
import { provideWiraTheme, ɵWT_SKIP_VERSION_CHECK } from 'wiratheme-v2/config';
import { WtInputTextModule } from 'wiratheme-v2/inputtext';
import { WtRadioButtonModule } from 'wiratheme-v2/radiobutton';
import { WtTextareaModule } from 'wiratheme-v2/textarea';
import { WtToggleSwitchModule } from 'wiratheme-v2/toggleswitch';
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
    WtDockModule,
    WtSiteFooterModule,
    WtBottomBarModule,
    WtThaiModule,
    WtInputOtpModule,
    WtFlowModule,
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
    // Docs site only: wiratheme@2 normally refuses to start on Angular 21 (DESIGN.md §3).
    { provide: ɵWT_SKIP_VERSION_CHECK, useValue: true },
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
    THEME_V2,
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
    { provide: DOCS_DIALOGS, useFactory: () => { const dialogs = inject(WtDialogService); return { pickStudent: (config: object) => dialogs.open(PickStudentV2, config).result }; } },
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
export class DocsV2Module {}
