import type { StyleValue } from "vue";

export const badgeTypes = ["primary", "success", "warning", "info", "danger"] as const;

export type BadgeType = (typeof badgeTypes)[number];

export interface BadgeProps {
  value?: string | number;
  max?: number;
  isDot?: boolean;
  hidden?: boolean;
  type?: BadgeType;
  showZero?: boolean;
  color?: string;
  badgeStyle?: StyleValue;
  offset?: [number, number];
  badgeClass?: string;
}
