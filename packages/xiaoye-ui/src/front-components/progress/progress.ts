export type ProgressType = "line" | "circle" | "dashboard";
export type ProgressStatus = "success" | "warning" | "exception";
export type ProgressSize = "small" | "default";

export interface ProgressProps {
  type?: ProgressType;
  percentage?: number;
  status?: ProgressStatus;
  strokeWidth?: number;
  strokeColor?: string | string[];
  trackColor?: string;
  width?: number | string;
  size?: ProgressSize;
  showText?: boolean;
  striped?: boolean;
  stripedFlow?: boolean;
  indeterminate?: boolean;
  format?: (percentage: number) => string;
  color?: string | string[] | ((percentage: number) => string);
}

export type ProgressInstance = InstanceType<import("./progress.vue").default>;
