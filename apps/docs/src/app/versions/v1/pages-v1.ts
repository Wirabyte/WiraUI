import { Component, inject } from '@angular/core';
import { WuDialogConfig, WuDialogRef } from 'wiraui-v1/dialog';
import {
  ButtonDemo,
  CardDemo,
  CheckboxDemo,
  InputTextDemo,
  PresetsDemo,
  RadioButtonDemo,
  TextareaDemo,
  ToggleSwitchDemo,
  TagDemo,
  BadgeDemo,
  ChipDemo,
  AvatarDemo,
  SkeletonDemo,
  ProgressBarDemo,
  ProgressSpinnerDemo,
  DividerDemo,
  PanelDemo,
  FieldsetDemo,
  MessageDemo,
  IconFieldDemo,
  InputGroupDemo,
  FloatLabelDemo,
  ToggleButtonDemo,
  SelectButtonDemo,
  RatingDemo,
  PasswordDemo,
  ToolbarDemo,
  AccordionDemo,
  TabsDemo,
  InputNumberDemo,
  DatePickerDemo,
  DialogDemo,
  PickStudentBase,
  AlertDemo,
  ConfirmDialogDemo,
  ToastDemo,
  TooltipDemo,
  PopoverDemo,
  AnimateDemo,
  MeterGroupDemo,
  ValidationDemo,
  SelectDemo,
  TableDemo,
  PaginatorDemo,
  MenubarDemo,
  PanelMenuDemo,
  StepsDemo,
  ChartJsDemo,
  ImageDemo,
  AutoCompleteDemo,
  MenuDemo,
  TabMenuDemo,
  MultiSelectDemo,
  InputMaskDemo,
  TimelineDemo,
  PickListDemo,
  OrderListDemo,
  FileUploadDemo,
  StepperDemo,
  EditorDemo,
  RippleDemo,
  KeyFilterDemo,
} from '../shared/demos';
import {
  SliderDemo,
  SplitButtonDemo,
  ListboxDemo,
  GalleriaDemo,
  ColorPickerDemo,
  BreadcrumbDemo,
  InplaceDemo,
  BlockUIDemo,
  ScrollPanelDemo,
  ScrollerDemo,
  DrawerDemo,
  TieredMenuDemo,
  ContextMenuDemo,
  TreeDemo,
  TreeSelectDemo,
  DragDropDemo,
} from '../shared/demos-more';
import { StudioDemo } from '../shared/studio';
import { NavbarDemo } from '../shared/demos-layout';
import { AsideMenuDemo } from '../shared/demos-aside';
import { ImageCropperDemo } from '../shared/demos-cropper';
import { IconsDemo } from '../shared/demos-icons';
import {
  CarouselDemo,
  ImageCompareDemo,
  InputOtpDemo,
  KnobDemo,
  OrganizationChartDemo,
  SplitterDemo,
  TerminalDemo,
} from '../shared/demos-extras';
import { FlowDemo } from '../shared/demos-flow';
import { ExcelDemo } from '../shared/demos-excel';
import { EmptyStateDemo, ErrorPageDemo, ResultDemo } from '../shared/demos-states';
import { BottomBarDemo, DockDemo, FooterDemo } from '../shared/demos-shell';
import { DescriptionsDemo, StatDemo } from '../shared/demos-stat';
import { SignaturePadDemo } from '../shared/demos-signaturepad';
import { ChatDemo } from '../shared/demos-chat';
import { SchedulerDemo } from '../shared/demos-scheduler';
import { ThaiDemo } from '../shared/demos-thai';

// Shared templates compiled against @wirabyte/ui@1 components (DocsV1Module imports the v1 modules).

@Component({ selector: 'docs-button-v1', templateUrl: '../shared/button.html', standalone: false })
export class ButtonPageV1 extends ButtonDemo {}

@Component({ selector: 'docs-card-v1', templateUrl: '../shared/card.html', standalone: false })
export class CardPageV1 extends CardDemo {}

@Component({ selector: 'docs-checkbox-v1', templateUrl: '../shared/checkbox.html', standalone: false })
export class CheckboxPageV1 extends CheckboxDemo {}

@Component({ selector: 'docs-inputtext-v1', templateUrl: '../shared/inputtext.html', standalone: false })
export class InputTextPageV1 extends InputTextDemo {}

@Component({ selector: 'docs-radiobutton-v1', templateUrl: '../shared/radiobutton.html', standalone: false })
export class RadioButtonPageV1 extends RadioButtonDemo {}

@Component({ selector: 'docs-textarea-v1', templateUrl: '../shared/textarea.html', standalone: false })
export class TextareaPageV1 extends TextareaDemo {}

@Component({ selector: 'docs-toggleswitch-v1', templateUrl: '../shared/toggleswitch.html', standalone: false })
export class ToggleSwitchPageV1 extends ToggleSwitchDemo {}

@Component({ selector: 'docs-presets-v1', templateUrl: '../shared/presets.html', standalone: false })
export class PresetsPageV1 extends PresetsDemo {}

@Component({ selector: 'docs-tag-v1', templateUrl: '../shared/tag.html', standalone: false })
export class TagPageV1 extends TagDemo {}

@Component({ selector: 'docs-badge-v1', templateUrl: '../shared/badge.html', standalone: false })
export class BadgePageV1 extends BadgeDemo {}

@Component({ selector: 'docs-chip-v1', templateUrl: '../shared/chip.html', standalone: false })
export class ChipPageV1 extends ChipDemo {}

@Component({ selector: 'docs-avatar-v1', templateUrl: '../shared/avatar.html', standalone: false })
export class AvatarPageV1 extends AvatarDemo {}

@Component({ selector: 'docs-skeleton-v1', templateUrl: '../shared/skeleton.html', standalone: false })
export class SkeletonPageV1 extends SkeletonDemo {}

@Component({ selector: 'docs-progressbar-v1', templateUrl: '../shared/progressbar.html', standalone: false })
export class ProgressBarPageV1 extends ProgressBarDemo {}

@Component({ selector: 'docs-progressspinner-v1', templateUrl: '../shared/progressspinner.html', standalone: false })
export class ProgressSpinnerPageV1 extends ProgressSpinnerDemo {}

@Component({ selector: 'docs-divider-v1', templateUrl: '../shared/divider.html', standalone: false })
export class DividerPageV1 extends DividerDemo {}

@Component({ selector: 'docs-panel-v1', templateUrl: '../shared/panel.html', standalone: false })
export class PanelPageV1 extends PanelDemo {}

@Component({ selector: 'docs-fieldset-v1', templateUrl: '../shared/fieldset.html', standalone: false })
export class FieldsetPageV1 extends FieldsetDemo {}

@Component({ selector: 'docs-message-v1', templateUrl: '../shared/message.html', standalone: false })
export class MessagePageV1 extends MessageDemo {}

@Component({ selector: 'docs-iconfield-v1', templateUrl: '../shared/iconfield.html', standalone: false })
export class IconFieldPageV1 extends IconFieldDemo {}

@Component({ selector: 'docs-inputgroup-v1', templateUrl: '../shared/inputgroup.html', standalone: false })
export class InputGroupPageV1 extends InputGroupDemo {}

@Component({ selector: 'docs-floatlabel-v1', templateUrl: '../shared/floatlabel.html', standalone: false })
export class FloatLabelPageV1 extends FloatLabelDemo {}

@Component({ selector: 'docs-togglebutton-v1', templateUrl: '../shared/togglebutton.html', standalone: false })
export class ToggleButtonPageV1 extends ToggleButtonDemo {}

@Component({ selector: 'docs-selectbutton-v1', templateUrl: '../shared/selectbutton.html', standalone: false })
export class SelectButtonPageV1 extends SelectButtonDemo {}

@Component({ selector: 'docs-rating-v1', templateUrl: '../shared/rating.html', standalone: false })
export class RatingPageV1 extends RatingDemo {}

@Component({ selector: 'docs-password-v1', templateUrl: '../shared/password.html', standalone: false })
export class PasswordPageV1 extends PasswordDemo {}

@Component({ selector: 'docs-toolbar-v1', templateUrl: '../shared/toolbar.html', standalone: false })
export class ToolbarPageV1 extends ToolbarDemo {}

@Component({ selector: 'docs-accordion-v1', templateUrl: '../shared/accordion.html', standalone: false })
export class AccordionPageV1 extends AccordionDemo {}

@Component({ selector: 'docs-tabs-v1', templateUrl: '../shared/tabs.html', standalone: false })
export class TabsPageV1 extends TabsDemo {}

@Component({ selector: 'docs-inputnumber-v1', templateUrl: '../shared/inputnumber.html', standalone: false })
export class InputNumberPageV1 extends InputNumberDemo {}

@Component({ selector: 'docs-datepicker-v1', templateUrl: '../shared/datepicker.html', standalone: false })
export class DatePickerPageV1 extends DatePickerDemo {}

@Component({ selector: 'docs-dialog-v1', templateUrl: '../shared/dialog.html', standalone: false })
export class DialogPageV1 extends DialogDemo {}

@Component({ selector: 'docs-alert-v1', templateUrl: '../shared/alert.html', standalone: false })
export class AlertPageV1 extends AlertDemo {}

@Component({ selector: 'docs-confirmdialog-v1', templateUrl: '../shared/confirmdialog.html', standalone: false })
export class ConfirmDialogPageV1 extends ConfirmDialogDemo {}

@Component({ selector: 'docs-toast-v1', templateUrl: '../shared/toast.html', standalone: false })
export class ToastPageV1 extends ToastDemo {}

@Component({ selector: 'docs-tooltip-v1', templateUrl: '../shared/tooltip.html', standalone: false })
export class TooltipPageV1 extends TooltipDemo {}

@Component({ selector: 'docs-popover-v1', templateUrl: '../shared/popover.html', standalone: false })
export class PopoverPageV1 extends PopoverDemo {}

@Component({ selector: 'docs-animate-v1', templateUrl: '../shared/animate.html', standalone: false })
export class AnimatePageV1 extends AnimateDemo {}

@Component({ selector: 'docs-metergroup-v1', templateUrl: '../shared/metergroup.html', standalone: false })
export class MeterGroupPageV1 extends MeterGroupDemo {}

@Component({ selector: 'docs-validation-v1', templateUrl: '../shared/validation.html', standalone: false })
export class ValidationPageV1 extends ValidationDemo {}

@Component({ selector: 'docs-select-v1', templateUrl: '../shared/select.html', standalone: false })
export class SelectPageV1 extends SelectDemo {}

@Component({ selector: 'docs-table-v1', templateUrl: '../shared/table.html', standalone: false })
export class TablePageV1 extends TableDemo {}

@Component({ selector: 'docs-paginator-v1', templateUrl: '../shared/paginator.html', standalone: false })
export class PaginatorPageV1 extends PaginatorDemo {}

@Component({ selector: 'docs-menubar-v1', templateUrl: '../shared/menubar.html', standalone: false })
export class MenubarPageV1 extends MenubarDemo {}

@Component({ selector: 'docs-panelmenu-v1', templateUrl: '../shared/panelmenu.html', standalone: false })
export class PanelMenuPageV1 extends PanelMenuDemo {}

@Component({ selector: 'docs-steps-v1', templateUrl: '../shared/steps.html', standalone: false })
export class StepsPageV1 extends StepsDemo {}

@Component({ selector: 'docs-chartjs-v1', templateUrl: '../shared/chartjs.html', standalone: false })
export class ChartJsPageV1 extends ChartJsDemo {}

@Component({ selector: 'docs-image-v1', templateUrl: '../shared/image.html', standalone: false })
export class ImagePageV1 extends ImageDemo {}

@Component({ selector: 'docs-autocomplete-v1', templateUrl: '../shared/autocomplete.html', standalone: false })
export class AutoCompletePageV1 extends AutoCompleteDemo {}

@Component({ selector: 'docs-menu-v1', templateUrl: '../shared/menu.html', standalone: false })
export class MenuPageV1 extends MenuDemo {}

@Component({ selector: 'docs-tabmenu-v1', templateUrl: '../shared/tabmenu.html', standalone: false })
export class TabMenuPageV1 extends TabMenuDemo {}

@Component({ selector: 'docs-multiselect-v1', templateUrl: '../shared/multiselect.html', standalone: false })
export class MultiSelectPageV1 extends MultiSelectDemo {}

@Component({ selector: 'docs-inputmask-v1', templateUrl: '../shared/inputmask.html', standalone: false })
export class InputMaskPageV1 extends InputMaskDemo {}

@Component({ selector: 'docs-timeline-v1', templateUrl: '../shared/timeline.html', standalone: false })
export class TimelinePageV1 extends TimelineDemo {}

@Component({ selector: 'docs-picklist-v1', templateUrl: '../shared/picklist.html', standalone: false })
export class PickListPageV1 extends PickListDemo {}

@Component({ selector: 'docs-orderlist-v1', templateUrl: '../shared/orderlist.html', standalone: false })
export class OrderListPageV1 extends OrderListDemo {}

@Component({ selector: 'docs-fileupload-v1', templateUrl: '../shared/fileupload.html', standalone: false })
export class FileUploadPageV1 extends FileUploadDemo {}

@Component({ selector: 'docs-stepper-v1', templateUrl: '../shared/stepper.html', standalone: false })
export class StepperPageV1 extends StepperDemo {}

@Component({ selector: 'docs-editor-v1', templateUrl: '../shared/editor.html', standalone: false })
export class EditorPageV1 extends EditorDemo {}

@Component({ selector: 'docs-ripple-v1', templateUrl: '../shared/ripple.html', standalone: false })
export class RipplePageV1 extends RippleDemo {}

@Component({ selector: 'docs-keyfilter-v1', templateUrl: '../shared/keyfilter.html', standalone: false })
export class KeyFilterPageV1 extends KeyFilterDemo {}

@Component({ selector: 'docs-slider-v1', templateUrl: '../shared/slider.html', standalone: false })
export class SliderPageV1 extends SliderDemo {}

@Component({ selector: 'docs-splitbutton-v1', templateUrl: '../shared/splitbutton.html', standalone: false })
export class SplitButtonPageV1 extends SplitButtonDemo {}

@Component({ selector: 'docs-listbox-v1', templateUrl: '../shared/listbox.html', standalone: false })
export class ListboxPageV1 extends ListboxDemo {}

@Component({ selector: 'docs-galleria-v1', templateUrl: '../shared/galleria.html', standalone: false })
export class GalleriaPageV1 extends GalleriaDemo {}

@Component({ selector: 'docs-colorpicker-v1', templateUrl: '../shared/colorpicker.html', standalone: false })
export class ColorPickerPageV1 extends ColorPickerDemo {}

@Component({ selector: 'docs-breadcrumb-v1', templateUrl: '../shared/breadcrumb.html', standalone: false })
export class BreadcrumbPageV1 extends BreadcrumbDemo {}

@Component({ selector: 'docs-inplace-v1', templateUrl: '../shared/inplace.html', standalone: false })
export class InplacePageV1 extends InplaceDemo {}

@Component({ selector: 'docs-blockui-v1', templateUrl: '../shared/blockui.html', standalone: false })
export class BlockUIPageV1 extends BlockUIDemo {}

@Component({ selector: 'docs-scrollpanel-v1', templateUrl: '../shared/scrollpanel.html', standalone: false })
export class ScrollPanelPageV1 extends ScrollPanelDemo {}

@Component({ selector: 'docs-scroller-v1', templateUrl: '../shared/scroller.html', standalone: false })
export class ScrollerPageV1 extends ScrollerDemo {}

@Component({ selector: 'docs-drawer-v1', templateUrl: '../shared/drawer.html', standalone: false })
export class DrawerPageV1 extends DrawerDemo {}

@Component({ selector: 'docs-tieredmenu-v1', templateUrl: '../shared/tieredmenu.html', standalone: false })
export class TieredMenuPageV1 extends TieredMenuDemo {}

@Component({ selector: 'docs-contextmenu-v1', templateUrl: '../shared/contextmenu.html', standalone: false })
export class ContextMenuPageV1 extends ContextMenuDemo {}

@Component({ selector: 'docs-tree-v1', templateUrl: '../shared/tree.html', standalone: false })
export class TreePageV1 extends TreeDemo {}

@Component({ selector: 'docs-treeselect-v1', templateUrl: '../shared/treeselect.html', standalone: false })
export class TreeSelectPageV1 extends TreeSelectDemo {}

@Component({ selector: 'docs-dragdrop-v1', templateUrl: '../shared/dragdrop.html', standalone: false })
export class DragDropPageV1 extends DragDropDemo {}

@Component({ selector: 'docs-studio-v1', templateUrl: '../shared/studio.html', standalone: false })
export class StudioPageV1 extends StudioDemo {}

@Component({ selector: 'docs-navbar-v1', templateUrl: '../shared/navbar.html', standalone: false })
export class NavbarPageV1 extends NavbarDemo {}

@Component({ selector: 'docs-asidemenu-v1', templateUrl: '../shared/asidemenu.html', standalone: false })
export class AsideMenuPageV1 extends AsideMenuDemo {}

@Component({ selector: 'docs-imagecropper-v1', templateUrl: '../shared/imagecropper.html', standalone: false })
export class ImageCropperPageV1 extends ImageCropperDemo {}

@Component({ selector: 'docs-icons-v1', templateUrl: '../shared/icons.html', standalone: false })
export class IconsPageV1 extends IconsDemo {}

@Component({ selector: 'docs-terminal-v1', templateUrl: '../shared/terminal.html', standalone: false })
export class TerminalPageV1 extends TerminalDemo {}

@Component({ selector: 'docs-imagecompare-v1', templateUrl: '../shared/imagecompare.html', standalone: false })
export class ImageComparePageV1 extends ImageCompareDemo {}

@Component({ selector: 'docs-carousel-v1', templateUrl: '../shared/carousel.html', standalone: false })
export class CarouselPageV1 extends CarouselDemo {}

@Component({ selector: 'docs-splitter-v1', templateUrl: '../shared/splitter.html', standalone: false })
export class SplitterPageV1 extends SplitterDemo {}

@Component({ selector: 'docs-organizationchart-v1', templateUrl: '../shared/organizationchart.html', standalone: false })
export class OrganizationChartPageV1 extends OrganizationChartDemo {}

@Component({ selector: 'docs-knob-v1', templateUrl: '../shared/knob.html', standalone: false })
export class KnobPageV1 extends KnobDemo {}

@Component({ selector: 'docs-inputotp-v1', templateUrl: '../shared/inputotp.html', standalone: false })
export class InputOtpPageV1 extends InputOtpDemo {}

@Component({ selector: 'docs-flow-v1', templateUrl: '../shared/flow.html', standalone: false })
export class FlowPageV1 extends FlowDemo {}

@Component({ selector: 'docs-excel-v1', templateUrl: '../shared/excel.html', standalone: false })
export class ExcelPageV1 extends ExcelDemo {}

@Component({ selector: 'docs-emptystate-v1', templateUrl: '../shared/emptystate.html', standalone: false })
export class EmptyStatePageV1 extends EmptyStateDemo {}

@Component({ selector: 'docs-result-v1', templateUrl: '../shared/result.html', standalone: false })
export class ResultPageV1 extends ResultDemo {}

@Component({ selector: 'docs-errorpage-v1', templateUrl: '../shared/errorpage.html', standalone: false })
export class ErrorPagePageV1 extends ErrorPageDemo {}

@Component({ selector: 'docs-dock-v1', templateUrl: '../shared/dock.html', standalone: false })
export class DockPageV1 extends DockDemo {}

@Component({ selector: 'docs-footer-v1', templateUrl: '../shared/footer.html', standalone: false })
export class FooterPageV1 extends FooterDemo {}

@Component({ selector: 'docs-bottombar-v1', templateUrl: '../shared/bottombar.html', standalone: false })
export class BottomBarPageV1 extends BottomBarDemo {}

@Component({ selector: 'docs-stat-v1', templateUrl: '../shared/stat.html', standalone: false })
export class StatPageV1 extends StatDemo {}

@Component({ selector: 'docs-descriptions-v1', templateUrl: '../shared/descriptions.html', standalone: false })
export class DescriptionsPageV1 extends DescriptionsDemo {}

@Component({ selector: 'docs-signaturepad-v1', templateUrl: '../shared/signaturepad.html', standalone: false })
export class SignaturePadPageV1 extends SignaturePadDemo {}

@Component({ selector: 'docs-chat-v1', templateUrl: '../shared/chat.html', standalone: false })
export class ChatPageV1 extends ChatDemo {}

@Component({ selector: 'docs-scheduler-v1', templateUrl: '../shared/scheduler.html', standalone: false })
export class SchedulerPageV1 extends SchedulerDemo {}

@Component({ selector: 'docs-thai-v1', templateUrl: '../shared/thai.html', standalone: false })
export class ThaiPageV1 extends ThaiDemo {}

/** What the Dialog page's WuDialogService sample opens (this version's dialog ref and config). */
@Component({ selector: 'docs-pick-student-v1', templateUrl: '../shared/dialog-pick.html', standalone: false })
export class PickStudentV1 extends PickStudentBase {
  protected readonly ref = inject(WuDialogRef);
  protected readonly config = inject(WuDialogConfig);
}
