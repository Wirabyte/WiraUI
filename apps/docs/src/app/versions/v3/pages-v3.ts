import { Component, inject } from '@angular/core';
import { WuDialogConfig, WuDialogRef } from 'wiraui/dialog';
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
import { ThaiDemo } from '../shared/demos-thai';
import { ChartDemo } from '../shared/demos-chart';

// Shared templates compiled against wiraui@3 components (DocsV3Module imports the v1 modules).

@Component({ selector: 'docs-button-v3', templateUrl: '../shared/button.html', standalone: false })
export class ButtonPageV3 extends ButtonDemo {}

@Component({ selector: 'docs-card-v3', templateUrl: '../shared/card.html', standalone: false })
export class CardPageV3 extends CardDemo {}

@Component({ selector: 'docs-checkbox-v3', templateUrl: '../shared/checkbox.html', standalone: false })
export class CheckboxPageV3 extends CheckboxDemo {}

@Component({ selector: 'docs-inputtext-v3', templateUrl: '../shared/inputtext.html', standalone: false })
export class InputTextPageV3 extends InputTextDemo {}

@Component({ selector: 'docs-radiobutton-v3', templateUrl: '../shared/radiobutton.html', standalone: false })
export class RadioButtonPageV3 extends RadioButtonDemo {}

@Component({ selector: 'docs-textarea-v3', templateUrl: '../shared/textarea.html', standalone: false })
export class TextareaPageV3 extends TextareaDemo {}

@Component({ selector: 'docs-toggleswitch-v3', templateUrl: '../shared/toggleswitch.html', standalone: false })
export class ToggleSwitchPageV3 extends ToggleSwitchDemo {}

@Component({ selector: 'docs-presets-v3', templateUrl: '../shared/presets.html', standalone: false })
export class PresetsPageV3 extends PresetsDemo {}

@Component({ selector: 'docs-tag-v3', templateUrl: '../shared/tag.html', standalone: false })
export class TagPageV3 extends TagDemo {}

@Component({ selector: 'docs-badge-v3', templateUrl: '../shared/badge.html', standalone: false })
export class BadgePageV3 extends BadgeDemo {}

@Component({ selector: 'docs-chip-v3', templateUrl: '../shared/chip.html', standalone: false })
export class ChipPageV3 extends ChipDemo {}

@Component({ selector: 'docs-avatar-v3', templateUrl: '../shared/avatar.html', standalone: false })
export class AvatarPageV3 extends AvatarDemo {}

@Component({ selector: 'docs-skeleton-v3', templateUrl: '../shared/skeleton.html', standalone: false })
export class SkeletonPageV3 extends SkeletonDemo {}

@Component({ selector: 'docs-progressbar-v3', templateUrl: '../shared/progressbar.html', standalone: false })
export class ProgressBarPageV3 extends ProgressBarDemo {}

@Component({ selector: 'docs-progressspinner-v3', templateUrl: '../shared/progressspinner.html', standalone: false })
export class ProgressSpinnerPageV3 extends ProgressSpinnerDemo {}

@Component({ selector: 'docs-divider-v3', templateUrl: '../shared/divider.html', standalone: false })
export class DividerPageV3 extends DividerDemo {}

@Component({ selector: 'docs-panel-v3', templateUrl: '../shared/panel.html', standalone: false })
export class PanelPageV3 extends PanelDemo {}

@Component({ selector: 'docs-fieldset-v3', templateUrl: '../shared/fieldset.html', standalone: false })
export class FieldsetPageV3 extends FieldsetDemo {}

@Component({ selector: 'docs-message-v3', templateUrl: '../shared/message.html', standalone: false })
export class MessagePageV3 extends MessageDemo {}

@Component({ selector: 'docs-iconfield-v3', templateUrl: '../shared/iconfield.html', standalone: false })
export class IconFieldPageV3 extends IconFieldDemo {}

@Component({ selector: 'docs-inputgroup-v3', templateUrl: '../shared/inputgroup.html', standalone: false })
export class InputGroupPageV3 extends InputGroupDemo {}

@Component({ selector: 'docs-floatlabel-v3', templateUrl: '../shared/floatlabel.html', standalone: false })
export class FloatLabelPageV3 extends FloatLabelDemo {}

@Component({ selector: 'docs-togglebutton-v3', templateUrl: '../shared/togglebutton.html', standalone: false })
export class ToggleButtonPageV3 extends ToggleButtonDemo {}

@Component({ selector: 'docs-selectbutton-v3', templateUrl: '../shared/selectbutton.html', standalone: false })
export class SelectButtonPageV3 extends SelectButtonDemo {}

@Component({ selector: 'docs-rating-v3', templateUrl: '../shared/rating.html', standalone: false })
export class RatingPageV3 extends RatingDemo {}

@Component({ selector: 'docs-password-v3', templateUrl: '../shared/password.html', standalone: false })
export class PasswordPageV3 extends PasswordDemo {}

@Component({ selector: 'docs-toolbar-v3', templateUrl: '../shared/toolbar.html', standalone: false })
export class ToolbarPageV3 extends ToolbarDemo {}

@Component({ selector: 'docs-accordion-v3', templateUrl: '../shared/accordion.html', standalone: false })
export class AccordionPageV3 extends AccordionDemo {}

@Component({ selector: 'docs-tabs-v3', templateUrl: '../shared/tabs.html', standalone: false })
export class TabsPageV3 extends TabsDemo {}

@Component({ selector: 'docs-inputnumber-v3', templateUrl: '../shared/inputnumber.html', standalone: false })
export class InputNumberPageV3 extends InputNumberDemo {}

@Component({ selector: 'docs-datepicker-v3', templateUrl: '../shared/datepicker.html', standalone: false })
export class DatePickerPageV3 extends DatePickerDemo {}

@Component({ selector: 'docs-dialog-v3', templateUrl: '../shared/dialog.html', standalone: false })
export class DialogPageV3 extends DialogDemo {}

@Component({ selector: 'docs-alert-v3', templateUrl: '../shared/alert.html', standalone: false })
export class AlertPageV3 extends AlertDemo {}

@Component({ selector: 'docs-confirmdialog-v3', templateUrl: '../shared/confirmdialog.html', standalone: false })
export class ConfirmDialogPageV3 extends ConfirmDialogDemo {}

@Component({ selector: 'docs-toast-v3', templateUrl: '../shared/toast.html', standalone: false })
export class ToastPageV3 extends ToastDemo {}

@Component({ selector: 'docs-tooltip-v3', templateUrl: '../shared/tooltip.html', standalone: false })
export class TooltipPageV3 extends TooltipDemo {}

@Component({ selector: 'docs-popover-v3', templateUrl: '../shared/popover.html', standalone: false })
export class PopoverPageV3 extends PopoverDemo {}

@Component({ selector: 'docs-animate-v3', templateUrl: '../shared/animate.html', standalone: false })
export class AnimatePageV3 extends AnimateDemo {}

@Component({ selector: 'docs-metergroup-v3', templateUrl: '../shared/metergroup.html', standalone: false })
export class MeterGroupPageV3 extends MeterGroupDemo {}

@Component({ selector: 'docs-validation-v3', templateUrl: '../shared/validation.html', standalone: false })
export class ValidationPageV3 extends ValidationDemo {}

@Component({ selector: 'docs-select-v3', templateUrl: '../shared/select.html', standalone: false })
export class SelectPageV3 extends SelectDemo {}

@Component({ selector: 'docs-table-v3', templateUrl: '../shared/table.html', standalone: false })
export class TablePageV3 extends TableDemo {}

@Component({ selector: 'docs-paginator-v3', templateUrl: '../shared/paginator.html', standalone: false })
export class PaginatorPageV3 extends PaginatorDemo {}

@Component({ selector: 'docs-menubar-v3', templateUrl: '../shared/menubar.html', standalone: false })
export class MenubarPageV3 extends MenubarDemo {}

@Component({ selector: 'docs-panelmenu-v3', templateUrl: '../shared/panelmenu.html', standalone: false })
export class PanelMenuPageV3 extends PanelMenuDemo {}

@Component({ selector: 'docs-steps-v3', templateUrl: '../shared/steps.html', standalone: false })
export class StepsPageV3 extends StepsDemo {}

@Component({ selector: 'docs-chartjs-v3', templateUrl: '../shared/chartjs.html', standalone: false })
export class ChartJsPageV3 extends ChartJsDemo {}

@Component({ selector: 'docs-image-v3', templateUrl: '../shared/image.html', standalone: false })
export class ImagePageV3 extends ImageDemo {}

@Component({ selector: 'docs-autocomplete-v3', templateUrl: '../shared/autocomplete.html', standalone: false })
export class AutoCompletePageV3 extends AutoCompleteDemo {}

@Component({ selector: 'docs-menu-v3', templateUrl: '../shared/menu.html', standalone: false })
export class MenuPageV3 extends MenuDemo {}

@Component({ selector: 'docs-tabmenu-v3', templateUrl: '../shared/tabmenu.html', standalone: false })
export class TabMenuPageV3 extends TabMenuDemo {}

@Component({ selector: 'docs-multiselect-v3', templateUrl: '../shared/multiselect.html', standalone: false })
export class MultiSelectPageV3 extends MultiSelectDemo {}

@Component({ selector: 'docs-inputmask-v3', templateUrl: '../shared/inputmask.html', standalone: false })
export class InputMaskPageV3 extends InputMaskDemo {}

@Component({ selector: 'docs-timeline-v3', templateUrl: '../shared/timeline.html', standalone: false })
export class TimelinePageV3 extends TimelineDemo {}

@Component({ selector: 'docs-picklist-v3', templateUrl: '../shared/picklist.html', standalone: false })
export class PickListPageV3 extends PickListDemo {}

@Component({ selector: 'docs-orderlist-v3', templateUrl: '../shared/orderlist.html', standalone: false })
export class OrderListPageV3 extends OrderListDemo {}

@Component({ selector: 'docs-fileupload-v3', templateUrl: '../shared/fileupload.html', standalone: false })
export class FileUploadPageV3 extends FileUploadDemo {}

@Component({ selector: 'docs-stepper-v3', templateUrl: '../shared/stepper.html', standalone: false })
export class StepperPageV3 extends StepperDemo {}

@Component({ selector: 'docs-editor-v3', templateUrl: '../shared/editor.html', standalone: false })
export class EditorPageV3 extends EditorDemo {}

@Component({ selector: 'docs-ripple-v3', templateUrl: '../shared/ripple.html', standalone: false })
export class RipplePageV3 extends RippleDemo {}

@Component({ selector: 'docs-keyfilter-v3', templateUrl: '../shared/keyfilter.html', standalone: false })
export class KeyFilterPageV3 extends KeyFilterDemo {}

@Component({ selector: 'docs-slider-v3', templateUrl: '../shared/slider.html', standalone: false })
export class SliderPageV3 extends SliderDemo {}

@Component({ selector: 'docs-splitbutton-v3', templateUrl: '../shared/splitbutton.html', standalone: false })
export class SplitButtonPageV3 extends SplitButtonDemo {}

@Component({ selector: 'docs-listbox-v3', templateUrl: '../shared/listbox.html', standalone: false })
export class ListboxPageV3 extends ListboxDemo {}

@Component({ selector: 'docs-galleria-v3', templateUrl: '../shared/galleria.html', standalone: false })
export class GalleriaPageV3 extends GalleriaDemo {}

@Component({ selector: 'docs-colorpicker-v3', templateUrl: '../shared/colorpicker.html', standalone: false })
export class ColorPickerPageV3 extends ColorPickerDemo {}

@Component({ selector: 'docs-breadcrumb-v3', templateUrl: '../shared/breadcrumb.html', standalone: false })
export class BreadcrumbPageV3 extends BreadcrumbDemo {}

@Component({ selector: 'docs-inplace-v3', templateUrl: '../shared/inplace.html', standalone: false })
export class InplacePageV3 extends InplaceDemo {}

@Component({ selector: 'docs-blockui-v3', templateUrl: '../shared/blockui.html', standalone: false })
export class BlockUIPageV3 extends BlockUIDemo {}

@Component({ selector: 'docs-scrollpanel-v3', templateUrl: '../shared/scrollpanel.html', standalone: false })
export class ScrollPanelPageV3 extends ScrollPanelDemo {}

@Component({ selector: 'docs-scroller-v3', templateUrl: '../shared/scroller.html', standalone: false })
export class ScrollerPageV3 extends ScrollerDemo {}

@Component({ selector: 'docs-drawer-v3', templateUrl: '../shared/drawer.html', standalone: false })
export class DrawerPageV3 extends DrawerDemo {}

@Component({ selector: 'docs-tieredmenu-v3', templateUrl: '../shared/tieredmenu.html', standalone: false })
export class TieredMenuPageV3 extends TieredMenuDemo {}

@Component({ selector: 'docs-contextmenu-v3', templateUrl: '../shared/contextmenu.html', standalone: false })
export class ContextMenuPageV3 extends ContextMenuDemo {}

@Component({ selector: 'docs-tree-v3', templateUrl: '../shared/tree.html', standalone: false })
export class TreePageV3 extends TreeDemo {}

@Component({ selector: 'docs-treeselect-v3', templateUrl: '../shared/treeselect.html', standalone: false })
export class TreeSelectPageV3 extends TreeSelectDemo {}

@Component({ selector: 'docs-dragdrop-v3', templateUrl: '../shared/dragdrop.html', standalone: false })
export class DragDropPageV3 extends DragDropDemo {}

@Component({ selector: 'docs-studio-v3', templateUrl: '../shared/studio.html', standalone: false })
export class StudioPageV3 extends StudioDemo {}

@Component({ selector: 'docs-navbar-v3', templateUrl: '../shared/navbar.html', standalone: false })
export class NavbarPageV3 extends NavbarDemo {}

@Component({ selector: 'docs-asidemenu-v3', templateUrl: '../shared/asidemenu.html', standalone: false })
export class AsideMenuPageV3 extends AsideMenuDemo {}

@Component({ selector: 'docs-imagecropper-v3', templateUrl: '../shared/imagecropper.html', standalone: false })
export class ImageCropperPageV3 extends ImageCropperDemo {}

@Component({ selector: 'docs-icons-v3', templateUrl: '../shared/icons.html', standalone: false })
export class IconsPageV3 extends IconsDemo {}

@Component({ selector: 'docs-terminal-v3', templateUrl: '../shared/terminal.html', standalone: false })
export class TerminalPageV3 extends TerminalDemo {}

@Component({ selector: 'docs-imagecompare-v3', templateUrl: '../shared/imagecompare.html', standalone: false })
export class ImageComparePageV3 extends ImageCompareDemo {}

@Component({ selector: 'docs-carousel-v3', templateUrl: '../shared/carousel.html', standalone: false })
export class CarouselPageV3 extends CarouselDemo {}

@Component({ selector: 'docs-splitter-v3', templateUrl: '../shared/splitter.html', standalone: false })
export class SplitterPageV3 extends SplitterDemo {}

@Component({ selector: 'docs-organizationchart-v3', templateUrl: '../shared/organizationchart.html', standalone: false })
export class OrganizationChartPageV3 extends OrganizationChartDemo {}

@Component({ selector: 'docs-knob-v3', templateUrl: '../shared/knob.html', standalone: false })
export class KnobPageV3 extends KnobDemo {}

@Component({ selector: 'docs-inputotp-v3', templateUrl: '../shared/inputotp.html', standalone: false })
export class InputOtpPageV3 extends InputOtpDemo {}

@Component({ selector: 'docs-flow-v3', templateUrl: '../shared/flow.html', standalone: false })
export class FlowPageV3 extends FlowDemo {}

@Component({ selector: 'docs-excel-v3', templateUrl: '../shared/excel.html', standalone: false })
export class ExcelPageV3 extends ExcelDemo {}

@Component({ selector: 'docs-emptystate-v3', templateUrl: '../shared/emptystate.html', standalone: false })
export class EmptyStatePageV3 extends EmptyStateDemo {}

@Component({ selector: 'docs-result-v3', templateUrl: '../shared/result.html', standalone: false })
export class ResultPageV3 extends ResultDemo {}

@Component({ selector: 'docs-errorpage-v3', templateUrl: '../shared/errorpage.html', standalone: false })
export class ErrorPagePageV3 extends ErrorPageDemo {}

@Component({ selector: 'docs-dock-v3', templateUrl: '../shared/dock.html', standalone: false })
export class DockPageV3 extends DockDemo {}

@Component({ selector: 'docs-footer-v3', templateUrl: '../shared/footer.html', standalone: false })
export class FooterPageV3 extends FooterDemo {}

@Component({ selector: 'docs-bottombar-v3', templateUrl: '../shared/bottombar.html', standalone: false })
export class BottomBarPageV3 extends BottomBarDemo {}

@Component({ selector: 'docs-thai-v3', templateUrl: '../shared/thai.html', standalone: false })
export class ThaiPageV3 extends ThaiDemo {}

// wiraui@3 only.
@Component({ selector: 'docs-chart-v3', templateUrl: '../shared/chart.html', standalone: false })
export class ChartPageV3 extends ChartDemo {}

/** What the Dialog page's WuDialogService sample opens (this version's dialog ref and config). */
@Component({ selector: 'docs-pick-student-v3', templateUrl: '../shared/dialog-pick.html', standalone: false })
export class PickStudentV3 extends PickStudentBase {
  protected readonly ref = inject(WuDialogRef);
  protected readonly config = inject(WuDialogConfig);
}
