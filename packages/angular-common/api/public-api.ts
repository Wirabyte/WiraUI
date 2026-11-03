/**
 * The services and helpers pages use with the overlay components, in one import. The names apps already use
 * (`ConfirmationService`, `MessageService`, `ConfirmEventType`, `SharedModule` …) are exported too, so moving an import
 * here is often the only change.
 */
export { WuTemplate } from '@wirabyte/ui/config';
export type { WuMenuItem, WuMenuItem as MenuItem, WuMenuItemCommandEvent, WuMenuItemCommandEvent as MenuItemCommandEvent } from '@wirabyte/ui/config';
export { WuSharedModule, WuSharedModule as SharedModule } from './shared.module';
export {
  WuConfirmationService,
  WuConfirmationService as ConfirmationService,
  WuConfirmEventType,
  WuConfirmEventType as ConfirmEventType,
} from '@wirabyte/ui/confirmdialog';
export type { WuConfirmation, WuConfirmation as Confirmation } from '@wirabyte/ui/confirmdialog';
export { WuMessageService, WuMessageService as MessageService } from '@wirabyte/ui/toast';
export type { WuToastMessage, WuToastMessage as Message, WuToastMessage as ToastMessageOptions } from '@wirabyte/ui/toast';
export { WuAlert, WuAlertService } from '@wirabyte/ui/alert';
export type { WuAlertOptions, WuAlertResult } from '@wirabyte/ui/alert';
export type { TreeNode } from '@wirabyte/ui/core';
