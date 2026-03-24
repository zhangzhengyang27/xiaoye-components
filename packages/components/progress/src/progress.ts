import type { SVGAttributes } from "vue";

export const progressTypes = ["line", "circle", "dashboard"] as const;
export const progressStatuses = ["", "success", "exception", "warning"] as const;

export type ProgressType = (typeof progressTypes)[number];
export type ProgressStatus = (typeof progressStatuses)[number];
export type ProgressStrokeLinecap = NonNullable<SVGAttributes["stroke-linecap"]>;

export interface ProgressColorStop {
  color: string;
  percentage: number;
}

export type ProgressColorMap = Array<string | ProgressColorStop>;
export type ProgressFormatter = (percentage: number) => string;
export type ProgressColor = string | ProgressColorMap | ProgressFormatter;

export interface ProgressProps {
  type?: ProgressType;
  percentage?: number;
  status?: ProgressStatus;
  indeterminate?: boolean;
  duration?: number;
  strokeWidth?: number;
  strokeLinecap?: ProgressStrokeLinecap;
  textInside?: boolean;
  width?: number;
  showText?: boolean;
  color?: ProgressColor;
  striped?: boolean;
  stripedFlow?: boolean;
  format?: ProgressFormatter;
}
