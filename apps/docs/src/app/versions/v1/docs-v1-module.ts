import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WtButtonModule } from 'wiratheme-v1/button';
import { WtMeterGroupModule } from 'wiratheme-v1/metergroup';
import { WtValidationModule, WtValidators } from 'wiratheme-v1/validation';
import { WtDialogModule } from 'wiratheme-v1/dialog';
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
import { DOCS_OVERLAYS, DOCS_VALIDATORS, DocsOverlays } from '../../core/overlays';
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
