import { WtFlowModule } from 'wiratheme/flow';
import { WtTerminalModule } from 'wiratheme/terminal';
import { WtImageCompareModule } from 'wiratheme/imagecompare';
import { WtCarouselModule } from 'wiratheme/carousel';
import { WtSplitterModule } from 'wiratheme/splitter';
import { WtOrganizationChartModule } from 'wiratheme/organizationchart';
import { WtKnobModule } from 'wiratheme/knob';
import { WtInputOtpModule } from 'wiratheme/inputotp';
import { WtI18nModule } from 'wiratheme/i18n';
import { WtAsideMenuModule } from 'wiratheme/asidemenu';
import { WtImageCropperModule } from 'wiratheme/imagecropper';
import { WtNavbarModule } from 'wiratheme/navbar';
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
import { WtRippleModule } from 'wiratheme/ripple';
import { WtKeyFilterModule } from 'wiratheme/keyfilter';
import { WtEditorModule } from 'wiratheme/editor';
import { WtPickListModule } from 'wiratheme/picklist';
import { WtOrderListModule } from 'wiratheme/orderlist';
import { WtFileUploadModule } from 'wiratheme/fileupload';
import { WtStepperModule } from 'wiratheme/stepper';
import { WtStepsModule } from 'wiratheme/steps';
import { WtPanelMenuModule } from 'wiratheme/panelmenu';
import { WtAutoCompleteModule } from 'wiratheme/autocomplete';
import { WtImageModule } from 'wiratheme/image';
import { WtChartModule } from 'wiratheme/chart';
import { WtInputMaskModule } from 'wiratheme/inputmask';
import { WtTimelineModule } from 'wiratheme/timeline';
import { WtMenuModule } from 'wiratheme/menu';
import { WtTabMenuModule } from 'wiratheme/tabmenu';
import { WtMultiSelectModule } from 'wiratheme/multiselect';
import { WtMenubarModule } from 'wiratheme/menubar';
import { WtTableModule } from 'wiratheme/table';
import { WtSelectModule } from 'wiratheme/select';
import { WtMeterGroupModule } from 'wiratheme/metergroup';
import { WtValidationModule } from 'wiratheme/validation';
import { WtDialogModule } from 'wiratheme/dialog';
import { WtAlertModule } from 'wiratheme/alert';
import { WtConfirmDialogModule } from 'wiratheme/confirmdialog';
import { WtToastModule } from 'wiratheme/toast';
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
import { WtDividerModule } from 'wiratheme/divider';
import { WtSkeletonModule } from 'wiratheme/skeleton';
import { WtProgressBarModule } from 'wiratheme/progressbar';
import { WtProgressSpinnerModule } from 'wiratheme/progressspinner';
import { WtMessageModule } from 'wiratheme/message';
import { WtPanelModule } from 'wiratheme/panel';
import { WtFieldsetModule } from 'wiratheme/fieldset';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WtCardModule } from 'wiratheme/card';
import { WtInputTextModule } from 'wiratheme/inputtext';
import { WtTextareaModule } from 'wiratheme/textarea';
import { WtCheckboxModule } from 'wiratheme/checkbox';
import { WtRadioButtonModule } from 'wiratheme/radiobutton';
import { WtToggleSwitchModule } from 'wiratheme/toggleswitch';
import { WtButtonModule } from 'wiratheme/button';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideWiraTheme } from 'wiratheme/config';
import { wiraOverrides } from '../theme/wiratheme.overrides';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [WtFlowModule, WtTerminalModule, WtImageCompareModule, WtCarouselModule, WtSplitterModule, WtOrganizationChartModule, WtKnobModule, WtInputOtpModule, WtI18nModule, WtAsideMenuModule, WtImageCropperModule, WtNavbarModule, WtSliderModule, WtSplitButtonModule, WtListboxModule, WtGalleriaModule, WtColorPickerModule, WtBreadcrumbModule, WtInplaceModule, WtBlockUIModule, WtScrollPanelModule, WtScrollerModule, WtDrawerModule, WtTieredMenuModule, WtContextMenuModule, WtTreeModule, WtTreeSelectModule, WtDragDropModule, WtRippleModule, WtKeyFilterModule, WtEditorModule, WtPickListModule, WtOrderListModule, WtFileUploadModule, WtStepperModule, WtStepsModule, WtPanelMenuModule, WtAutoCompleteModule, WtImageModule, WtChartModule, WtInputMaskModule, WtTimelineModule, WtMenuModule, WtTabMenuModule, WtMultiSelectModule, WtMenubarModule, WtTableModule, WtSelectModule, WtMeterGroupModule, WtValidationModule, WtDialogModule, WtAlertModule, WtConfirmDialogModule, WtToastModule, WtTooltipModule, WtPopoverModule, WtAnimateModule, WtDatePickerModule, WtInputNumberModule, WtToolbarModule, WtAccordionModule, WtTabsModule, WtIconFieldModule, WtInputGroupModule, WtFloatLabelModule, WtToggleButtonModule, WtSelectButtonModule, WtRatingModule, WtPasswordModule, WtTagModule, WtBadgeModule, WtChipModule, WtAvatarModule, WtDividerModule, WtSkeletonModule, WtProgressBarModule, WtProgressSpinnerModule, WtMessageModule, WtPanelModule, WtFieldsetModule, FormsModule, ReactiveFormsModule, WtCardModule, WtInputTextModule, WtTextareaModule, WtCheckboxModule, WtRadioButtonModule, WtToggleSwitchModule, WtButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraTheme({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
