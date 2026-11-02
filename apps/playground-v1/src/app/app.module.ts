import { WuFlowModule } from 'wiraui/flow';
import { WuTerminalModule } from 'wiraui/terminal';
import { WuImageCompareModule } from 'wiraui/imagecompare';
import { WuCarouselModule } from 'wiraui/carousel';
import { WuSplitterModule } from 'wiraui/splitter';
import { WuOrganizationChartModule } from 'wiraui/organizationchart';
import { WuKnobModule } from 'wiraui/knob';
import { WuInputOtpModule } from 'wiraui/inputotp';
import { WuI18nModule } from 'wiraui/i18n';
import { WuAsideMenuModule } from 'wiraui/asidemenu';
import { WuImageCropperModule } from 'wiraui/imagecropper';
import { WuNavbarModule } from 'wiraui/navbar';
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
import { WuRippleModule } from 'wiraui/ripple';
import { WuKeyFilterModule } from 'wiraui/keyfilter';
import { WuEditorModule } from 'wiraui/editor';
import { WuPickListModule } from 'wiraui/picklist';
import { WuOrderListModule } from 'wiraui/orderlist';
import { WuFileUploadModule } from 'wiraui/fileupload';
import { WuStepperModule } from 'wiraui/stepper';
import { WuStepsModule } from 'wiraui/steps';
import { WuPanelMenuModule } from 'wiraui/panelmenu';
import { WuAutoCompleteModule } from 'wiraui/autocomplete';
import { WuImageModule } from 'wiraui/image';
import { WuChartJsModule } from 'wiraui/chartjs';
import { WuInputMaskModule } from 'wiraui/inputmask';
import { WuTimelineModule } from 'wiraui/timeline';
import { WuMenuModule } from 'wiraui/menu';
import { WuTabMenuModule } from 'wiraui/tabmenu';
import { WuMultiSelectModule } from 'wiraui/multiselect';
import { WuMenubarModule } from 'wiraui/menubar';
import { WuTableModule } from 'wiraui/table';
import { WuSelectModule } from 'wiraui/select';
import { WuMeterGroupModule } from 'wiraui/metergroup';
import { WuValidationModule } from 'wiraui/validation';
import { WuDialogModule } from 'wiraui/dialog';
import { WuAlertModule } from 'wiraui/alert';
import { WuConfirmDialogModule } from 'wiraui/confirmdialog';
import { WuToastModule } from 'wiraui/toast';
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
import { WuDividerModule } from 'wiraui/divider';
import { WuSkeletonModule } from 'wiraui/skeleton';
import { WuProgressBarModule } from 'wiraui/progressbar';
import { WuProgressSpinnerModule } from 'wiraui/progressspinner';
import { WuMessageModule } from 'wiraui/message';
import { WuPanelModule } from 'wiraui/panel';
import { WuFieldsetModule } from 'wiraui/fieldset';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WuCardModule } from 'wiraui/card';
import { WuInputTextModule } from 'wiraui/inputtext';
import { WuTextareaModule } from 'wiraui/textarea';
import { WuCheckboxModule } from 'wiraui/checkbox';
import { WuRadioButtonModule } from 'wiraui/radiobutton';
import { WuToggleSwitchModule } from 'wiraui/toggleswitch';
import { WuButtonModule } from 'wiraui/button';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { provideWiraUI } from 'wiraui/config';
import { wiraOverrides } from '../theme/wiraui.overrides';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [WuFlowModule, WuTerminalModule, WuImageCompareModule, WuCarouselModule, WuSplitterModule, WuOrganizationChartModule, WuKnobModule, WuInputOtpModule, WuI18nModule, WuAsideMenuModule, WuImageCropperModule, WuNavbarModule, WuSliderModule, WuSplitButtonModule, WuListboxModule, WuGalleriaModule, WuColorPickerModule, WuBreadcrumbModule, WuInplaceModule, WuBlockUIModule, WuScrollPanelModule, WuScrollerModule, WuDrawerModule, WuTieredMenuModule, WuContextMenuModule, WuTreeModule, WuTreeSelectModule, WuDragDropModule, WuRippleModule, WuKeyFilterModule, WuEditorModule, WuPickListModule, WuOrderListModule, WuFileUploadModule, WuStepperModule, WuStepsModule, WuPanelMenuModule, WuAutoCompleteModule, WuImageModule, WuChartJsModule, WuInputMaskModule, WuTimelineModule, WuMenuModule, WuTabMenuModule, WuMultiSelectModule, WuMenubarModule, WuTableModule, WuSelectModule, WuMeterGroupModule, WuValidationModule, WuDialogModule, WuAlertModule, WuConfirmDialogModule, WuToastModule, WuTooltipModule, WuPopoverModule, WuAnimateModule, WuDatePickerModule, WuInputNumberModule, WuToolbarModule, WuAccordionModule, WuTabsModule, WuIconFieldModule, WuInputGroupModule, WuFloatLabelModule, WuToggleButtonModule, WuSelectButtonModule, WuRatingModule, WuPasswordModule, WuTagModule, WuBadgeModule, WuChipModule, WuAvatarModule, WuDividerModule, WuSkeletonModule, WuProgressBarModule, WuProgressSpinnerModule, WuMessageModule, WuPanelModule, WuFieldsetModule, FormsModule, ReactiveFormsModule, WuCardModule, WuInputTextModule, WuTextareaModule, WuCheckboxModule, WuRadioButtonModule, WuToggleSwitchModule, WuButtonModule, 
    BrowserModule
  ],
  providers: [provideWiraUI({ overrides: wiraOverrides, locale: 'th', calendar: 'buddhist', darkMode: 'class' })],
  bootstrap: [AppComponent]
})
export class AppModule { }
