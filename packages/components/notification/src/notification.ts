import type { AppContext, VNode, VNodeChild } from "vue";
import type Notification from "./notification.vue";

export const notificationTypes = [
  "primary",
  "success",
  "info",
  "warning",
  "error"
] as const;
export const notificationPositions = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left"
] as const;
export const notificationCloseReasons = [
  "manual",
  "auto",
  "escape",
  "programmatic"
] as const;
export const notificationServiceCloseReasons = [
  ...notificationCloseReasons,
  "close-all",
  "overflow"
] as const;
export const notificationOverflowStrategies = [
  "drop-oldest",
  "drop-newest"
] as const;

export const NOTIFICATION_DEFAULT_POSITION = "top-right";
export const NOTIFICATION_DEFAULT_DURATION = 4500;
export const NOTIFICATION_DEFAULT_OFFSET = 0;
export const NOTIFICATION_DEFAULT_Z_INDEX = 2000;
export const NOTIFICATION_GAP = 16;

export type NotificationType = (typeof notificationTypes)[number];
export type NotificationPosition = (typeof notificationPositions)[number];
export type NotificationCloseReason = (typeof notificationCloseReasons)[number];
export type NotificationServiceCloseReason =
  (typeof notificationServiceCloseReasons)[number];
export type NotificationOverflowStrategy =
  (typeof notificationOverflowStrategies)[number];
export type NotificationContent = string | VNode | (() => VNodeChild);

export interface NotificationCloseFilter {
  type?: NotificationType;
  position?: NotificationPosition;
  target?: string | HTMLElement;
  targetKey?: string;
  groupKey?: string;
}

export interface NotificationGlobalConfig {
  duration?: number;
  position?: NotificationPosition;
  offset?: number;
  showClose?: boolean;
  zIndex?: number;
  max?: number;
  overflowStrategy?: NotificationOverflowStrategy;
  appendTo?: string | HTMLElement;
  dangerouslyUseHTMLString?: boolean;
}

export interface NotificationProps {
  modelValue?: boolean;
  title?: string;
  message?: NotificationContent;
  type?: NotificationType | "";
  duration?: number;
  showClose?: boolean;
  customClass?: string;
  icon?: string;
  closeIcon?: string;
  dangerouslyUseHTMLString?: boolean;
  zIndex?: number;
  timerKey?: number;
}

export interface NotificationServiceOptions
  extends Omit<NotificationProps, "modelValue" | "timerKey"> {
  appendTo?: string | HTMLElement;
  offset?: number;
  position?: NotificationPosition;
  onClick?: () => void;
  onClosed?: (reason: NotificationServiceCloseReason) => void;
  groupKey?: string;
  max?: number;
  overflowStrategy?: NotificationOverflowStrategy;
}

export interface NotificationServiceOptionsNormalized
  extends Omit<
    NotificationServiceOptions,
    "appendTo" | "offset" | "position" | "max" | "overflowStrategy"
  > {
  appendTo: HTMLElement;
  offset: number;
  position: NotificationPosition;
  max: number | null;
  overflowStrategy: NotificationOverflowStrategy;
  targetKey: string;
  title: string;
  message: NotificationContent;
  type: NotificationType | "";
  duration: number;
  showClose: boolean;
  customClass: string;
  icon: string;
  closeIcon: string;
  dangerouslyUseHTMLString: boolean;
  timerKey: number;
}

export type NotificationUpdateOptions = Partial<NotificationServiceOptions>;

export interface NotificationHandler {
  id: string;
  close(reason?: NotificationCloseReason): void;
  update(patch: NotificationUpdateOptions): void;
}

export interface NotificationSnapshotEntry {
  id: string;
  type: NotificationType | "";
  position: NotificationPosition;
  targetKey: string;
  visible: boolean;
  groupKey?: string;
  title?: string;
  messageText?: string;
  hasRichContent: boolean;
}

export interface NotificationSnapshot {
  positions: Partial<Record<NotificationPosition, NotificationSnapshotEntry[]>>;
  total: number;
}

export type NotificationParams = NotificationContent | NotificationServiceOptions;
export type NotificationOptionsTyped = Omit<NotificationServiceOptions, "type">;
export type NotificationParamsTyped = NotificationContent | NotificationOptionsTyped;
export type NotificationTypedFn = (
  options?: NotificationParamsTyped,
  appContext?: AppContext | null
) => NotificationHandler;

export interface NotificationServiceFn {
  (
    options?: NotificationParams,
    appContext?: AppContext | null
  ): NotificationHandler;
  open(
    options?: NotificationParams,
    appContext?: AppContext | null
  ): NotificationHandler;
  closeAll(filter?: NotificationType | NotificationCloseFilter): void;
  getState(filter?: NotificationCloseFilter): NotificationSnapshot;
  updateOffsets(position?: NotificationPosition): void;
}

export interface NotificationService extends NotificationServiceFn {
  primary: NotificationTypedFn;
  success: NotificationTypedFn;
  info: NotificationTypedFn;
  warning: NotificationTypedFn;
  error: NotificationTypedFn;
  withContext(appContext?: AppContext | null): NotificationService;
  _context: AppContext | null;
}

export type NotificationInstance = InstanceType<typeof Notification> & {
  close: (reason?: NotificationCloseReason) => void;
};

export const NOTIFICATION_TYPE_ICON_MAP: Record<NotificationType, string> = {
  primary: "mdi:information-outline",
  success: "mdi:check-circle-outline",
  info: "mdi:information-outline",
  warning: "mdi:alert-circle-outline",
  error: "mdi:close-circle-outline"
};

export const NOTIFICATION_CLOSE_ICON = "mdi:close";

export const notificationServiceDefaults = {
  title: "",
  message: "",
  type: "",
  duration: NOTIFICATION_DEFAULT_DURATION,
  showClose: true,
  customClass: "",
  icon: "",
  closeIcon: NOTIFICATION_CLOSE_ICON,
  dangerouslyUseHTMLString: false,
  zIndex: undefined,
  appendTo:
    typeof document !== "undefined"
      ? document.body
      : (null as unknown as HTMLElement),
  offset: NOTIFICATION_DEFAULT_OFFSET,
  position: NOTIFICATION_DEFAULT_POSITION,
  onClick: undefined,
  onClosed: undefined,
  groupKey: undefined,
  max: null,
  overflowStrategy: "drop-oldest",
  targetKey: "",
  timerKey: 0
} satisfies NotificationServiceOptionsNormalized;
