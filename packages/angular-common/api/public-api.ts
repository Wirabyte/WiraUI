/**
 * The services and helpers pages use with the overlay components, in one import. The names apps already use
 * (`ConfirmationService`, `MessageService`, `ConfirmEventType`, `SharedModule` …) are exported too, so moving an import
 * here is often the only change.
 */
export { WuTemplate } from 'wiraui/config';
export type { WuMenuItem, WuMenuItem as MenuItem, WuMenuItemCommandEvent, WuMenuItemCommandEvent as MenuItemCommandEvent } from 'wiraui/config';
export { WuSharedModule, WuSharedModule as SharedModule } from './shared.module';
export {
  WuConfirmationService,
  WuConfirmationService as ConfirmationService,
  WuConfirmEventType,
  WuConfirmEventType as ConfirmEventType,
} from 'wiraui/confirmdialog';
export type { WuConfirmation, WuConfirmation as Confirmation } from 'wiraui/confirmdialog';
export { WuMessageService, WuMessageService as MessageService } from 'wiraui/toast';
export type { WuToastMessage, WuToastMessage as Message, WuToastMessage as ToastMessageOptions } from 'wiraui/toast';
export { WuAlert, WuAlertService } from 'wiraui/alert';
export type { WuAlertOptions, WuAlertResult } from 'wiraui/alert';
export type { TreeNode } from 'wiraui/core';
