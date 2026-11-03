import { WuFlowModule } from '@wirabyte/ui/flow';
import { WuTerminalModule } from '@wirabyte/ui/terminal';
import { WuImageCompareModule } from '@wirabyte/ui/imagecompare';
import { WuCarouselModule } from '@wirabyte/ui/carousel';
import { WuSplitterModule } from '@wirabyte/ui/splitter';
import { WuOrganizationChartModule } from '@wirabyte/ui/organizationchart';
import { WuKnobModule } from '@wirabyte/ui/knob';
import { WuInputOtpModule } from '@wirabyte/ui/inputotp';
import { WuI18nModule } from '@wirabyte/ui/i18n';
import { WuNavbarModule } from '@wirabyte/ui/navbar';
import { WuAsideMenuModule } from '@wirabyte/ui/asidemenu';
import { WuImageCropperModule } from '@wirabyte/ui/imagecropper';
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
import { WuRippleModule } from '@wirabyte/ui/ripple';
import { WuKeyFilterModule } from '@wirabyte/ui/keyfilter';
import { WuEditorModule } from '@wirabyte/ui/editor';
import { WuPickListModule } from '@wirabyte/ui/picklist';
import { WuOrderListModule } from '@wirabyte/ui/orderlist';
import { WuFileUploadModule } from '@wirabyte/ui/fileupload';
import { WuStepperModule } from '@wirabyte/ui/stepper';
import { WuStepsModule } from '@wirabyte/ui/steps';
import { WuPanelMenuModule } from '@wirabyte/ui/panelmenu';
import { WuAutoCompleteModule } from '@wirabyte/ui/autocomplete';
import { WuImageModule } from '@wirabyte/ui/image';
import { WuChartJsModule } from '@wirabyte/ui/chartjs';
import { WuInputMaskModule } from '@wirabyte/ui/inputmask';
import { WuTimelineModule } from '@wirabyte/ui/timeline';
import { WuMenuModule } from '@wirabyte/ui/menu';
import { WuTabMenuModule } from '@wirabyte/ui/tabmenu';
import { WuMultiSelectModule } from '@wirabyte/ui/multiselect';
import { WuMenubarModule } from '@wirabyte/ui/menubar';
import { WuTableModule } from '@wirabyte/ui/table';
import { WuSelectModule } from '@wirabyte/ui/select';
import { WuMeterGroupModule } from '@wirabyte/ui/metergroup';
import { WuValidationModule } from '@wirabyte/ui/validation';
import { WuDialogModule } from '@wirabyte/ui/dialog';
import { WuAlertModule } from '@wirabyte/ui/alert';
import { WuConfirmDialogModule } from '@wirabyte/ui/confirmdialog';
import { WuToastModule } from '@wirabyte/ui/toast';
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
import { WuDividerModule } from '@wirabyte/ui/divider';
import { WuSkeletonModule } from '@wirabyte/ui/skeleton';
import { WuProgressBarModule } from '@wirabyte/ui/progressbar';
import { WuProgressSpinnerModule } from '@wirabyte/ui/progressspinner';
import { WuMessageModule } from '@wirabyte/ui/message';
import { WuPanelModule } from '@wirabyte/ui/panel';
import { WuFieldsetModule } from '@wirabyte/ui/fieldset';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WuCardModule } from '@wirabyte/ui/card';
import { WuInputTextModule } from '@wirabyte/ui/inputtext';
import { WuTextareaModule } from '@wirabyte/ui/textarea';
import { WuCheckboxModule } from '@wirabyte/ui/checkbox';
import { WuRadioButtonModule } from '@wirabyte/ui/radiobutton';
import { WuToggleSwitchModule } from '@wirabyte/ui/toggleswitch';
import { WuButtonModule } from '@wirabyte/ui/button';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideWiraUI } from '@wirabyte/ui/config';
import { wiraOverrides } from '../theme/wiraui.overrides';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [WuFlowModule, WuTerminalModule, WuImageCompareModule, WuCarouselModule, WuSplitterModule, WuOrganizationChartModule, WuKnobModule, WuInputOtpModule, WuI18nModule, WuNavbarModule, WuAsideMenuModule, WuImageCropperModule, WuSliderModule, WuSplitButtonModule, WuListboxModule, WuGalleriaModule, WuColorPickerModule, WuBreadcrumbModule, WuInplaceModule, WuBlockUIModule, WuScrollPanelModule, WuScrollerModule, WuDrawerModule, WuTieredMenuModule, WuContextMenuModule, WuTreeModule, WuTreeSelectModule, WuDragDropModule, WuRippleModule, WuKeyFilterModule, WuEditorModule, WuPickListModule, WuOrderListModule, WuFileUploadModule, WuStepperModule, WuStepsModule, WuPanelMenuModule, WuAutoCompleteModule, WuImageModule, WuChartJsModule, WuInputMaskModule, WuTimelineModule, WuMenuModule, WuTabMenuModule, WuMultiSelectModule, WuMenubarModule, WuTableModule, WuSelectModule, WuMeterGroupModule, WuValidationModule, WuDialogModule, WuAlertModule, WuConfirmDialogModule, WuToastModule, WuTooltipModule, WuPopoverModule, WuAnimateModule, WuDatePickerModule, WuInputNumberModule, WuToolbarModule, WuAccordionModule, WuTabsModule, WuIconFieldModule, WuInputGroupModule, WuFloatLabelModule, WuToggleButtonModule, WuSelectButtonModule, WuRatingModule, WuPasswordModule, WuTagModule, WuBadgeModule, WuChipModule, WuAvatarModule, WuDividerModule, WuSkeletonModule, WuProgressBarModule, WuProgressSpinnerModule, WuMessageModule, WuPanelModule, WuFieldsetModule, FormsModule, ReactiveFormsModule, WuCardModule, WuInputTextModule, WuTextareaModule, WuCheckboxModule, WuRadioButtonModule, WuToggleSwitchModule, WuButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
