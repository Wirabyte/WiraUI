/**
 * The services and helpers pages use with the overlay components, in one import. The names apps already use
 * (`ConfirmationService`, `MessageService`, `ConfirmEventType`, `SharedModule` …) are exported too, so moving an import
 * here is often the only change.
 */
export { WtTemplate } from 'wiratheme/config';
export type { WtMenuItem, WtMenuItem as MenuItem, WtMenuItemCommandEvent, WtMenuItemCommandEvent as MenuItemCommandEvent } from 'wiratheme/config';
export { WtSharedModule, WtSharedModule as SharedModule } from './shared.module';
export {
  WtConfirmationService,
  WtConfirmationService as ConfirmationService,
  WtConfirmEventType,
  WtConfirmEventType as ConfirmEventType,
} from 'wiratheme/confirmdialog';
export type { WtConfirmation, WtConfirmation as Confirmation } from 'wiratheme/confirmdialog';
export { WtMessageService, WtMessageService as MessageService } from 'wiratheme/toast';
export type { WtToastMessage, WtToastMessage as Message, WtToastMessage as ToastMessageOptions } from 'wiratheme/toast';
export { WtAlert, WtAlertService } from 'wiratheme/alert';
export type { WtAlertOptions, WtAlertResult } from 'wiratheme/alert';
export type { TreeNode } from 'wiratheme/core';
