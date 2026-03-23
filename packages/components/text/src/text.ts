import type { ComponentSize } from "@xiaoye/utils";

export const textTypes = ["default", "primary", "success", "info", "warning", "danger"] as const;

export type TextType = (typeof textTypes)[number];

export interface TextProps {
  type?: TextType;
  size?: ComponentSize;
  truncated?: boolean;
  lineClamp?: number | string;
  tag?: string;
}
