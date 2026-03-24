import type { ComponentSize } from "@xiaoye/utils";
import type { StyleValue } from "vue";

export const cardShadows = ["always", "hover", "never"] as const;
export const cardVariants = ["default", "muted"] as const;

export type CardShadow = (typeof cardShadows)[number];
export type CardVariant = (typeof cardVariants)[number];

export interface CardProps {
  size?: ComponentSize;
  variant?: CardVariant;
  bordered?: boolean;
  header?: string;
  footer?: string;
  extra?: string;
  bodyStyle?: StyleValue;
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
  headerDivider?: boolean;
  footerDivider?: boolean;
  shadow?: CardShadow;
  loading?: boolean;
  loadingText?: string;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}
