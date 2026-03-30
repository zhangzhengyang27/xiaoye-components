import type { ComponentSize, ComponentStatus } from "@xiaoye/utils";

export const resultIconTypes = ["primary", "success", "warning", "info", "error"] as const;
export const resultVariants = ["plain", "card"] as const;

export type ResultIconType = (typeof resultIconTypes)[number];
export type ResultVariant = (typeof resultVariants)[number];
export type ResultStatus = ComponentStatus | "info" | "error" | "403" | "404" | "500";

export interface ResultProps {
  title?: string;
  subTitle?: string;
  icon?: ResultIconType;
  status?: ResultStatus;
  description?: string;
  size?: ComponentSize;
  variant?: ResultVariant;
  iconSize?: number | string;
}

export const RESULT_STATUS_ICON_MAP: Record<ResultStatus, string> = {
  neutral: "mdi:information-outline",
  primary: "mdi:information-outline",
  success: "mdi:check-circle-outline",
  warning: "mdi:alert-circle-outline",
  danger: "mdi:close-circle-outline",
  info: "mdi:information-outline",
  error: "mdi:close-circle-outline",
  "403": "mdi:shield-lock-outline",
  "404": "mdi:file-question-outline",
  "500": "mdi:server-network-off"
};

export const RESULT_STATUS_TONE_MAP: Record<ResultStatus, ComponentStatus> = {
  neutral: "neutral",
  primary: "primary",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "neutral",
  error: "danger",
  "403": "warning",
  "404": "neutral",
  "500": "danger"
};

export const RESULT_ICON_NAME_MAP: Record<ResultIconType, string> = {
  primary: "mdi:information-outline",
  success: "mdi:check-circle-outline",
  warning: "mdi:alert-circle-outline",
  info: "mdi:information-outline",
  error: "mdi:close-circle-outline"
};

export const RESULT_ICON_STATUS_MAP: Record<ResultIconType, ResultStatus> = {
  primary: "primary",
  success: "success",
  warning: "warning",
  info: "neutral",
  error: "danger"
};
