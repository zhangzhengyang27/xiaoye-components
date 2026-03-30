import type { ComponentSize } from "@xiaoye/utils";

export interface DescriptionsProps {
  column?: number;
  border?: boolean;
  size?: ComponentSize;
  title?: string;
  extra?: string;
  labelWidth?: string | number;
  direction?: "horizontal" | "vertical";
}
