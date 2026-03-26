import type { ComponentSize } from "@xiaoye/utils";

export const alertTypes = ["primary", "success", "info", "warning", "error"] as const;
export const alertEffects = ["light", "dark"] as const;
export const alertVariants = ["default", "banner", "card"] as const;
export const alertOverflowStrategies = ["drop-oldest", "drop-newest"] as const;
export const alertCloseReasons = ["manual", "auto", "close-all", "overflow"] as const;

export type AlertType = (typeof alertTypes)[number];
export type AlertEffect = (typeof alertEffects)[number];
export type AlertVariant = (typeof alertVariants)[number];
export type AlertOverflowStrategy = (typeof alertOverflowStrategies)[number];
export type AlertCloseReason = (typeof alertCloseReasons)[number];
export type AlertDoneFn = (cancel?: boolean) => void;
export type AlertBeforeCloseFn = (done: AlertDoneFn) => void | Promise<void>;
export type AlertServiceClosedFn = (reason: AlertCloseReason) => void;

export interface AlertProps {
  modelValue?: boolean;
  title?: string;
  description?: string;
  type?: AlertType;
  closable?: boolean;
  closeText?: string;
  showIcon?: boolean;
  center?: boolean;
  effect?: AlertEffect;
  duration?: number;
  size?: ComponentSize;
  variant?: AlertVariant;
  beforeClose?: AlertBeforeCloseFn;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnPageHidden?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  lineClamp?: number;
  expandText?: string;
  collapseText?: string;
}

export interface AlertServiceOptions
  extends Omit<AlertProps, "modelValue" | "variant"> {
  groupKey?: string;
  appendTo?: string | HTMLElement;
  maxQueue?: number;
  overflowStrategy?: AlertOverflowStrategy;
  onClosed?: AlertServiceClosedFn;
}

export type AlertServiceUpdateOptions = Partial<AlertServiceOptions>;

export interface AlertServiceSnapshotEntry
  extends Omit<AlertServiceOptions, "beforeClose" | "onClosed"> {
  id: string;
}

export interface AlertServiceSnapshot {
  current: AlertServiceSnapshotEntry | null;
  queue: AlertServiceSnapshotEntry[];
  queueLength: number;
  total: number;
}

export interface AlertServiceHandle {
  id: string;
  close(): void;
  update(patch: AlertServiceUpdateOptions): void;
}

export const ALERT_TYPE_ICON_MAP: Record<AlertType, string> = {
  primary: "mdi:information-outline",
  success: "mdi:check-circle-outline",
  info: "mdi:information-outline",
  warning: "mdi:alert-circle-outline",
  error: "mdi:close-circle-outline"
};

export const ALERT_CLOSE_ICON = "mdi:close";

export function invokeAlertBeforeClose(
  beforeClose: AlertBeforeCloseFn | undefined,
  onProceed: () => void
) {
  if (!beforeClose) {
    onProceed();
    return;
  }

  let finished = false;
  const done: AlertDoneFn = (cancel) => {
    if (finished) {
      return;
    }

    finished = true;

    if (cancel) {
      return;
    }

    onProceed();
  };

  try {
    const result = beforeClose(done);

    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {
        finished = true;
      });
    }
  } catch {
    finished = true;
  }
}
