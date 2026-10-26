import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
import { WtSelectModule } from 'wiratheme/select';
import { WtTableModule } from 'wiratheme/table';
import { WtPaginatorModule } from 'wiratheme/paginator';
import { WtMenubarModule } from 'wiratheme/menubar';
import { WtPanelMenuModule } from 'wiratheme/panelmenu';
import { WtStepsModule } from 'wiratheme/steps';
import { WtChartModule } from 'wiratheme/chart';
import { WtImageModule } from 'wiratheme/image';
import { WtAutoCompleteModule } from 'wiratheme/autocomplete';
import { WtMenuModule } from 'wiratheme/menu';
import { WtTabMenuModule } from 'wiratheme/tabmenu';
import { WtMultiSelectModule } from 'wiratheme/multiselect';
import { WtInputMaskModule } from 'wiratheme/inputmask';
import { WtTimelineModule } from 'wiratheme/timeline';
import { WtPickListModule } from 'wiratheme/picklist';
import { WtOrderListModule } from 'wiratheme/orderlist';
import { WtFileUploadModule } from 'wiratheme/fileupload';
import { WtStepperModule } from 'wiratheme/stepper';
import { WtEditorModule } from 'wiratheme/editor';
import { WtRippleModule } from 'wiratheme/ripple';
import { WtKeyFilterModule } from 'wiratheme/keyfilter';
import { WtSliderModule } from 'wiratheme/slider';
import { WtSplitButtonModule } from 'wiratheme/splitbutton';
import { WtListboxModule } from 'wiratheme/listbox';
import { WtGalleriaModule } from 'wiratheme/galleria';
import { WtColorPickerModule } from 'wiratheme/colorpicker';
import { WtBreadcrumbModule } from 'wiratheme/breadcrumb';
import { WtInplaceModule } from 'wiratheme/inplace';
import { WtBlockUIModule } from 'wiratheme/blockui';
import { WtScrollPanelModule } from 'wiratheme/scrollpanel';
import { WtScrollerModule } from 'wiratheme/scroller';
import { WtDrawerModule } from 'wiratheme/drawer';
import { WtTieredMenuModule } from 'wiratheme/tieredmenu';
import { WtContextMenuModule } from 'wiratheme/contextmenu';
import { WtTreeModule } from 'wiratheme/tree';
import { WtTreeSelectModule } from 'wiratheme/treeselect';
import { WtDragDropModule } from 'wiratheme/dragdrop';
import { WtNavbarModule } from 'wiratheme/navbar';
import { WtAsideMenuModule } from 'wiratheme/asidemenu';
import { WtImageCropperModule } from 'wiratheme/imagecropper';
import { WiIconModule } from 'wiraicon/angular';
import { WtTerminalModule, WtTerminalService } from 'wiratheme/terminal';
import { WtImageCompareModule } from 'wiratheme/imagecompare';
import { WtCarouselModule } from 'wiratheme/carousel';
import { WtSplitterModule } from 'wiratheme/splitter';
import { WtOrganizationChartModule } from 'wiratheme/organizationchart';
import { WtKnobModule } from 'wiratheme/knob';
import { WtInputOtpModule } from 'wiratheme/inputotp';
import { addEdge, applyEdgeChanges, applyNodeChanges, WtFlowModule } from 'wiratheme/flow';
import { WtMeterGroupModule } from 'wiratheme/metergroup';
import { WtValidationModule, WtValidators } from 'wiratheme/validation';
import { WtDialogModule } from 'wiratheme/dialog';
import { WtAlert, WtAlertModule, WtAlertService } from 'wiratheme/alert';
import { WtConfirmationService, WtConfirmDialogModule } from 'wiratheme/confirmdialog';
import { WtMessageService, WtToastModule } from 'wiratheme/toast';
import { WtTooltipModule } from 'wiratheme/tooltip';
import { WtPopoverModule } from 'wiratheme/popover';
import { WtAnimateModule } from 'wiratheme/animate';
import { WtDatePickerModule } from 'wiratheme/datepicker';
import { WtInputNumberModule } from 'wiratheme/inputnumber';
import { WtToolbarModule } from 'wiratheme/toolbar';
import { WtAccordionModule } from 'wiratheme/accordion';
import { WtTabsModule } from 'wiratheme/tabs';
import { WtIconFieldModule } from 'wiratheme/iconfield';
import { WtInputGroupModule } from 'wiratheme/inputgroup';
import { WtFloatLabelModule } from 'wiratheme/floatlabel';
import { WtToggleButtonModule } from 'wiratheme/togglebutton';
import { WtSelectButtonModule } from 'wiratheme/selectbutton';
import { WtRatingModule } from 'wiratheme/rating';
import { WtPasswordModule } from 'wiratheme/password';
import { WtTagModule } from 'wiratheme/tag';
import { WtBadgeModule } from 'wiratheme/badge';
import { WtChipModule } from 'wiratheme/chip';
import { WtAvatarModule } from 'wiratheme/avatar';
import { WtSkeletonModule } from 'wiratheme/skeleton';
import { WtProgressBarModule } from 'wiratheme/progressbar';
import { WtProgressSpinnerModule } from 'wiratheme/progressspinner';
import { WtDividerModule } from 'wiratheme/divider';
import { WtPanelModule } from 'wiratheme/panel';
import { WtFieldsetModule } from 'wiratheme/fieldset';
import { WtMessageModule } from 'wiratheme/message';
import { WtCardModule } from 'wiratheme/card';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { provideWiraTheme } from 'wiratheme/config';
import { WtInputTextModule } from 'wiratheme/inputtext';
import { WtRadioButtonModule } from 'wiratheme/radiobutton';
import { WtTextareaModule } from 'wiratheme/textarea';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { DOCS_FLOW, DOCS_OVERLAYS, DOCS_TERMINAL, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
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
  ChartPageV3,
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
    ChartPageV3,
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
    WtChartModule,
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
    WtInputOtpModule,
    WtFlowModule,
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
        chart: ChartPageV3,
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
      })
    ),
  ],
  providers: [
    provideWiraTheme({ locale: 'th', calendar: 'buddhist' }),
    THEME_V3,
    // Overlay services live in this module's injector, as in the v1 and v2 modules.
    WtAlertService,
    WtConfirmationService,
    WtMessageService,
    // The overlay demos open this version's alerts, confirmations and toasts.
    { provide: DOCS_VALIDATORS, useValue: WtValidators },
    // The Terminal demo talks to this version's terminal service.
    { provide: DOCS_TERMINAL, useExisting: WtTerminalService },
    // The Flow demos that apply changes themselves use this version's helpers.
    { provide: DOCS_FLOW, useValue: { applyNodeChanges, applyEdgeChanges, addEdge } },
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
export class DocsV3Module {}
