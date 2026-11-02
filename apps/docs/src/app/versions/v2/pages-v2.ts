import { Component, inject } from '@angular/core';
import { WuDialogConfig, WuDialogRef } from 'wiraui-v2/dialog';
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

// Shared templates compiled against wiraui@2 components (DocsV2Module imports the v1 modules).

@Component({ selector: 'docs-button-v2', templateUrl: '../shared/button.html', standalone: false })
export class ButtonPageV2 extends ButtonDemo {}

@Component({ selector: 'docs-card-v2', templateUrl: '../shared/card.html', standalone: false })
export class CardPageV2 extends CardDemo {}

@Component({ selector: 'docs-checkbox-v2', templateUrl: '../shared/checkbox.html', standalone: false })
export class CheckboxPageV2 extends CheckboxDemo {}

@Component({ selector: 'docs-inputtext-v2', templateUrl: '../shared/inputtext.html', standalone: false })
export class InputTextPageV2 extends InputTextDemo {}

@Component({ selector: 'docs-radiobutton-v2', templateUrl: '../shared/radiobutton.html', standalone: false })
export class RadioButtonPageV2 extends RadioButtonDemo {}

@Component({ selector: 'docs-textarea-v2', templateUrl: '../shared/textarea.html', standalone: false })
export class TextareaPageV2 extends TextareaDemo {}

@Component({ selector: 'docs-toggleswitch-v2', templateUrl: '../shared/toggleswitch.html', standalone: false })
export class ToggleSwitchPageV2 extends ToggleSwitchDemo {}

@Component({ selector: 'docs-presets-v2', templateUrl: '../shared/presets.html', standalone: false })
export class PresetsPageV2 extends PresetsDemo {}

@Component({ selector: 'docs-tag-v2', templateUrl: '../shared/tag.html', standalone: false })
export class TagPageV2 extends TagDemo {}

@Component({ selector: 'docs-badge-v2', templateUrl: '../shared/badge.html', standalone: false })
export class BadgePageV2 extends BadgeDemo {}

@Component({ selector: 'docs-chip-v2', templateUrl: '../shared/chip.html', standalone: false })
export class ChipPageV2 extends ChipDemo {}

@Component({ selector: 'docs-avatar-v2', templateUrl: '../shared/avatar.html', standalone: false })
export class AvatarPageV2 extends AvatarDemo {}

@Component({ selector: 'docs-skeleton-v2', templateUrl: '../shared/skeleton.html', standalone: false })
export class SkeletonPageV2 extends SkeletonDemo {}

@Component({ selector: 'docs-progressbar-v2', templateUrl: '../shared/progressbar.html', standalone: false })
export class ProgressBarPageV2 extends ProgressBarDemo {}

@Component({ selector: 'docs-progressspinner-v2', templateUrl: '../shared/progressspinner.html', standalone: false })
export class ProgressSpinnerPageV2 extends ProgressSpinnerDemo {}

@Component({ selector: 'docs-divider-v2', templateUrl: '../shared/divider.html', standalone: false })
export class DividerPageV2 extends DividerDemo {}

@Component({ selector: 'docs-panel-v2', templateUrl: '../shared/panel.html', standalone: false })
export class PanelPageV2 extends PanelDemo {}

@Component({ selector: 'docs-fieldset-v2', templateUrl: '../shared/fieldset.html', standalone: false })
export class FieldsetPageV2 extends FieldsetDemo {}

@Component({ selector: 'docs-message-v2', templateUrl: '../shared/message.html', standalone: false })
export class MessagePageV2 extends MessageDemo {}

@Component({ selector: 'docs-iconfield-v2', templateUrl: '../shared/iconfield.html', standalone: false })
export class IconFieldPageV2 extends IconFieldDemo {}

@Component({ selector: 'docs-inputgroup-v2', templateUrl: '../shared/inputgroup.html', standalone: false })
export class InputGroupPageV2 extends InputGroupDemo {}

@Component({ selector: 'docs-floatlabel-v2', templateUrl: '../shared/floatlabel.html', standalone: false })
export class FloatLabelPageV2 extends FloatLabelDemo {}

@Component({ selector: 'docs-togglebutton-v2', templateUrl: '../shared/togglebutton.html', standalone: false })
export class ToggleButtonPageV2 extends ToggleButtonDemo {}

@Component({ selector: 'docs-selectbutton-v2', templateUrl: '../shared/selectbutton.html', standalone: false })
export class SelectButtonPageV2 extends SelectButtonDemo {}

@Component({ selector: 'docs-rating-v2', templateUrl: '../shared/rating.html', standalone: false })
export class RatingPageV2 extends RatingDemo {}

@Component({ selector: 'docs-password-v2', templateUrl: '../shared/password.html', standalone: false })
export class PasswordPageV2 extends PasswordDemo {}

@Component({ selector: 'docs-toolbar-v2', templateUrl: '../shared/toolbar.html', standalone: false })
export class ToolbarPageV2 extends ToolbarDemo {}

@Component({ selector: 'docs-accordion-v2', templateUrl: '../shared/accordion.html', standalone: false })
export class AccordionPageV2 extends AccordionDemo {}

@Component({ selector: 'docs-tabs-v2', templateUrl: '../shared/tabs.html', standalone: false })
export class TabsPageV2 extends TabsDemo {}

@Component({ selector: 'docs-inputnumber-v2', templateUrl: '../shared/inputnumber.html', standalone: false })
export class InputNumberPageV2 extends InputNumberDemo {}

@Component({ selector: 'docs-datepicker-v2', templateUrl: '../shared/datepicker.html', standalone: false })
export class DatePickerPageV2 extends DatePickerDemo {}

@Component({ selector: 'docs-dialog-v2', templateUrl: '../shared/dialog.html', standalone: false })
export class DialogPageV2 extends DialogDemo {}

@Component({ selector: 'docs-alert-v2', templateUrl: '../shared/alert.html', standalone: false })
export class AlertPageV2 extends AlertDemo {}

@Component({ selector: 'docs-confirmdialog-v2', templateUrl: '../shared/confirmdialog.html', standalone: false })
export class ConfirmDialogPageV2 extends ConfirmDialogDemo {}

@Component({ selector: 'docs-toast-v2', templateUrl: '../shared/toast.html', standalone: false })
export class ToastPageV2 extends ToastDemo {}

@Component({ selector: 'docs-tooltip-v2', templateUrl: '../shared/tooltip.html', standalone: false })
export class TooltipPageV2 extends TooltipDemo {}

@Component({ selector: 'docs-popover-v2', templateUrl: '../shared/popover.html', standalone: false })
export class PopoverPageV2 extends PopoverDemo {}

@Component({ selector: 'docs-animate-v2', templateUrl: '../shared/animate.html', standalone: false })
export class AnimatePageV2 extends AnimateDemo {}

@Component({ selector: 'docs-metergroup-v2', templateUrl: '../shared/metergroup.html', standalone: false })
export class MeterGroupPageV2 extends MeterGroupDemo {}

@Component({ selector: 'docs-validation-v2', templateUrl: '../shared/validation.html', standalone: false })
export class ValidationPageV2 extends ValidationDemo {}

@Component({ selector: 'docs-select-v2', templateUrl: '../shared/select.html', standalone: false })
export class SelectPageV2 extends SelectDemo {}

@Component({ selector: 'docs-table-v2', templateUrl: '../shared/table.html', standalone: false })
export class TablePageV2 extends TableDemo {}

@Component({ selector: 'docs-paginator-v2', templateUrl: '../shared/paginator.html', standalone: false })
export class PaginatorPageV2 extends PaginatorDemo {}

@Component({ selector: 'docs-menubar-v2', templateUrl: '../shared/menubar.html', standalone: false })
export class MenubarPageV2 extends MenubarDemo {}

@Component({ selector: 'docs-panelmenu-v2', templateUrl: '../shared/panelmenu.html', standalone: false })
export class PanelMenuPageV2 extends PanelMenuDemo {}

@Component({ selector: 'docs-steps-v2', templateUrl: '../shared/steps.html', standalone: false })
export class StepsPageV2 extends StepsDemo {}

@Component({ selector: 'docs-chartjs-v2', templateUrl: '../shared/chartjs.html', standalone: false })
export class ChartJsPageV2 extends ChartJsDemo {}

@Component({ selector: 'docs-image-v2', templateUrl: '../shared/image.html', standalone: false })
export class ImagePageV2 extends ImageDemo {}

@Component({ selector: 'docs-autocomplete-v2', templateUrl: '../shared/autocomplete.html', standalone: false })
export class AutoCompletePageV2 extends AutoCompleteDemo {}

@Component({ selector: 'docs-menu-v2', templateUrl: '../shared/menu.html', standalone: false })
export class MenuPageV2 extends MenuDemo {}

@Component({ selector: 'docs-tabmenu-v2', templateUrl: '../shared/tabmenu.html', standalone: false })
export class TabMenuPageV2 extends TabMenuDemo {}

@Component({ selector: 'docs-multiselect-v2', templateUrl: '../shared/multiselect.html', standalone: false })
export class MultiSelectPageV2 extends MultiSelectDemo {}

@Component({ selector: 'docs-inputmask-v2', templateUrl: '../shared/inputmask.html', standalone: false })
export class InputMaskPageV2 extends InputMaskDemo {}

@Component({ selector: 'docs-timeline-v2', templateUrl: '../shared/timeline.html', standalone: false })
export class TimelinePageV2 extends TimelineDemo {}

@Component({ selector: 'docs-picklist-v2', templateUrl: '../shared/picklist.html', standalone: false })
export class PickListPageV2 extends PickListDemo {}

@Component({ selector: 'docs-orderlist-v2', templateUrl: '../shared/orderlist.html', standalone: false })
export class OrderListPageV2 extends OrderListDemo {}

@Component({ selector: 'docs-fileupload-v2', templateUrl: '../shared/fileupload.html', standalone: false })
export class FileUploadPageV2 extends FileUploadDemo {}

@Component({ selector: 'docs-stepper-v2', templateUrl: '../shared/stepper.html', standalone: false })
export class StepperPageV2 extends StepperDemo {}

@Component({ selector: 'docs-editor-v2', templateUrl: '../shared/editor.html', standalone: false })
export class EditorPageV2 extends EditorDemo {}

@Component({ selector: 'docs-ripple-v2', templateUrl: '../shared/ripple.html', standalone: false })
export class RipplePageV2 extends RippleDemo {}

@Component({ selector: 'docs-keyfilter-v2', templateUrl: '../shared/keyfilter.html', standalone: false })
export class KeyFilterPageV2 extends KeyFilterDemo {}

@Component({ selector: 'docs-slider-v2', templateUrl: '../shared/slider.html', standalone: false })
export class SliderPageV2 extends SliderDemo {}

@Component({ selector: 'docs-splitbutton-v2', templateUrl: '../shared/splitbutton.html', standalone: false })
export class SplitButtonPageV2 extends SplitButtonDemo {}

@Component({ selector: 'docs-listbox-v2', templateUrl: '../shared/listbox.html', standalone: false })
export class ListboxPageV2 extends ListboxDemo {}

@Component({ selector: 'docs-galleria-v2', templateUrl: '../shared/galleria.html', standalone: false })
export class GalleriaPageV2 extends GalleriaDemo {}

@Component({ selector: 'docs-colorpicker-v2', templateUrl: '../shared/colorpicker.html', standalone: false })
export class ColorPickerPageV2 extends ColorPickerDemo {}

@Component({ selector: 'docs-breadcrumb-v2', templateUrl: '../shared/breadcrumb.html', standalone: false })
export class BreadcrumbPageV2 extends BreadcrumbDemo {}

@Component({ selector: 'docs-inplace-v2', templateUrl: '../shared/inplace.html', standalone: false })
export class InplacePageV2 extends InplaceDemo {}

@Component({ selector: 'docs-blockui-v2', templateUrl: '../shared/blockui.html', standalone: false })
export class BlockUIPageV2 extends BlockUIDemo {}

@Component({ selector: 'docs-scrollpanel-v2', templateUrl: '../shared/scrollpanel.html', standalone: false })
export class ScrollPanelPageV2 extends ScrollPanelDemo {}

@Component({ selector: 'docs-scroller-v2', templateUrl: '../shared/scroller.html', standalone: false })
export class ScrollerPageV2 extends ScrollerDemo {}

@Component({ selector: 'docs-drawer-v2', templateUrl: '../shared/drawer.html', standalone: false })
export class DrawerPageV2 extends DrawerDemo {}

@Component({ selector: 'docs-tieredmenu-v2', templateUrl: '../shared/tieredmenu.html', standalone: false })
export class TieredMenuPageV2 extends TieredMenuDemo {}

@Component({ selector: 'docs-contextmenu-v2', templateUrl: '../shared/contextmenu.html', standalone: false })
export class ContextMenuPageV2 extends ContextMenuDemo {}

@Component({ selector: 'docs-tree-v2', templateUrl: '../shared/tree.html', standalone: false })
export class TreePageV2 extends TreeDemo {}

@Component({ selector: 'docs-treeselect-v2', templateUrl: '../shared/treeselect.html', standalone: false })
export class TreeSelectPageV2 extends TreeSelectDemo {}

@Component({ selector: 'docs-dragdrop-v2', templateUrl: '../shared/dragdrop.html', standalone: false })
export class DragDropPageV2 extends DragDropDemo {}

@Component({ selector: 'docs-studio-v2', templateUrl: '../shared/studio.html', standalone: false })
export class StudioPageV2 extends StudioDemo {}

@Component({ selector: 'docs-navbar-v2', templateUrl: '../shared/navbar.html', standalone: false })
export class NavbarPageV2 extends NavbarDemo {}

@Component({ selector: 'docs-asidemenu-v2', templateUrl: '../shared/asidemenu.html', standalone: false })
export class AsideMenuPageV2 extends AsideMenuDemo {}

@Component({ selector: 'docs-imagecropper-v2', templateUrl: '../shared/imagecropper.html', standalone: false })
export class ImageCropperPageV2 extends ImageCropperDemo {}

@Component({ selector: 'docs-icons-v2', templateUrl: '../shared/icons.html', standalone: false })
export class IconsPageV2 extends IconsDemo {}

@Component({ selector: 'docs-terminal-v2', templateUrl: '../shared/terminal.html', standalone: false })
export class TerminalPageV2 extends TerminalDemo {}

@Component({ selector: 'docs-imagecompare-v2', templateUrl: '../shared/imagecompare.html', standalone: false })
export class ImageComparePageV2 extends ImageCompareDemo {}

@Component({ selector: 'docs-carousel-v2', templateUrl: '../shared/carousel.html', standalone: false })
export class CarouselPageV2 extends CarouselDemo {}

@Component({ selector: 'docs-splitter-v2', templateUrl: '../shared/splitter.html', standalone: false })
export class SplitterPageV2 extends SplitterDemo {}

@Component({ selector: 'docs-organizationchart-v2', templateUrl: '../shared/organizationchart.html', standalone: false })
export class OrganizationChartPageV2 extends OrganizationChartDemo {}

@Component({ selector: 'docs-knob-v2', templateUrl: '../shared/knob.html', standalone: false })
export class KnobPageV2 extends KnobDemo {}

@Component({ selector: 'docs-inputotp-v2', templateUrl: '../shared/inputotp.html', standalone: false })
export class InputOtpPageV2 extends InputOtpDemo {}

@Component({ selector: 'docs-flow-v2', templateUrl: '../shared/flow.html', standalone: false })
export class FlowPageV2 extends FlowDemo {}

@Component({ selector: 'docs-excel-v2', templateUrl: '../shared/excel.html', standalone: false })
export class ExcelPageV2 extends ExcelDemo {}

@Component({ selector: 'docs-emptystate-v2', templateUrl: '../shared/emptystate.html', standalone: false })
export class EmptyStatePageV2 extends EmptyStateDemo {}

@Component({ selector: 'docs-result-v2', templateUrl: '../shared/result.html', standalone: false })
export class ResultPageV2 extends ResultDemo {}

@Component({ selector: 'docs-errorpage-v2', templateUrl: '../shared/errorpage.html', standalone: false })
export class ErrorPagePageV2 extends ErrorPageDemo {}

@Component({ selector: 'docs-dock-v2', templateUrl: '../shared/dock.html', standalone: false })
export class DockPageV2 extends DockDemo {}

@Component({ selector: 'docs-footer-v2', templateUrl: '../shared/footer.html', standalone: false })
export class FooterPageV2 extends FooterDemo {}

@Component({ selector: 'docs-bottombar-v2', templateUrl: '../shared/bottombar.html', standalone: false })
export class BottomBarPageV2 extends BottomBarDemo {}

@Component({ selector: 'docs-thai-v2', templateUrl: '../shared/thai.html', standalone: false })
export class ThaiPageV2 extends ThaiDemo {}

/** What the Dialog page's WuDialogService sample opens (this version's dialog ref and config). */
@Component({ selector: 'docs-pick-student-v2', templateUrl: '../shared/dialog-pick.html', standalone: false })
export class PickStudentV2 extends PickStudentBase {
  protected readonly ref = inject(WuDialogRef);
  protected readonly config = inject(WuDialogConfig);
}
