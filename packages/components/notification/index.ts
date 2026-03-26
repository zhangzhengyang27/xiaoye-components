import Notification from "./src/notification.vue";
import type {
  NotificationCloseFilter,
  NotificationCloseReason,
  NotificationContent,
  NotificationGlobalConfig,
  NotificationHandler,
  NotificationInstance,
  NotificationOptionsTyped,
  NotificationOverflowStrategy,
  NotificationParams,
  NotificationParamsTyped,
  NotificationPosition,
  NotificationProps,
  NotificationSnapshot,
  NotificationSnapshotEntry,
  NotificationService,
  NotificationServiceCloseReason,
  NotificationServiceFn,
  NotificationServiceOptions,
  NotificationServiceOptionsNormalized,
  NotificationUpdateOptions,
  NotificationType,
  NotificationTypedFn
} from "./src/notification";
import notification from "./src/service";
import { withInstall, withInstallFunction } from "@xiaoye/utils";

export type {
  NotificationCloseFilter,
  NotificationCloseReason,
  NotificationContent,
  NotificationGlobalConfig,
  NotificationHandler,
  NotificationInstance,
  NotificationOptionsTyped,
  NotificationOverflowStrategy,
  NotificationParams,
  NotificationParamsTyped,
  NotificationPosition,
  NotificationProps,
  NotificationSnapshot,
  NotificationSnapshotEntry,
  NotificationService,
  NotificationServiceCloseReason,
  NotificationServiceFn,
  NotificationServiceOptions,
  NotificationServiceOptionsNormalized,
  NotificationUpdateOptions,
  NotificationType,
  NotificationTypedFn
};

export const XyNotification = withInstall(Notification, "xy-notification");
export const XyNotificationService = withInstallFunction(notification, "$notify");

export default XyNotification;
