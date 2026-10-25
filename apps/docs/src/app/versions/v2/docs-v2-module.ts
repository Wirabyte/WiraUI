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
import { WtChartModule } from 'wiratheme-v2/chart';
import { WtImageModule } from 'wiratheme-v2/image';
import { WtAutoCompleteModule } from 'wiratheme-v2/autocomplete';
import { WtMenuModule } from 'wiratheme-v2/menu';
import { WtTabMenuModule } from 'wiratheme-v2/tabmenu';
import { WtMultiSelectModule } from 'wiratheme-v2/multiselect';
import { WtInputMaskModule } from 'wiratheme-v2/inputmask';
import { WtTimelineModule } from 'wiratheme-v2/timeline';
import { WtMeterGroupModule } from 'wiratheme-v2/metergroup';
import { WtValidationModule, WtValidators } from 'wiratheme-v2/validation';
import { WtDialogModule } from 'wiratheme-v2/dialog';
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
import { DOCS_OVERLAYS, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
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
  ChartPageV2,
  ImagePageV2,
  AutoCompletePageV2,
  MenuPageV2,
  TabMenuPageV2,
  MultiSelectPageV2,
  InputMaskPageV2,
  TimelinePageV2,
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
    ChartPageV2,
    ImagePageV2,
    AutoCompletePageV2,
    MenuPageV2,
    TabMenuPageV2,
    MultiSelectPageV2,
    InputMaskPageV2,
    TimelinePageV2,
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
        chart: ChartPageV2,
        image: ImagePageV2,
        autocomplete: AutoCompletePageV2,
        menu: MenuPageV2,
        tabmenu: TabMenuPageV2,
        multiselect: MultiSelectPageV2,
        inputmask: InputMaskPageV2,
        timeline: TimelinePageV2,
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
