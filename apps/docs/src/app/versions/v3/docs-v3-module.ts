import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme/button';
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
import { DOCS_OVERLAYS, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
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
