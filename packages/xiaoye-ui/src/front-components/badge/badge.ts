export type BadgeType = "primary" | "success" | "warning" | "danger" | "info";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  value?: string | number;
  max?: number;
  isDot?: boolean;
  hidden?: boolean;
  type?: BadgeType;
  size?: BadgeSize;
  showZero?: boolean;
  color?: string;
}

export type BadgeInstance = InstanceType<import("./badge.vue").default>;
