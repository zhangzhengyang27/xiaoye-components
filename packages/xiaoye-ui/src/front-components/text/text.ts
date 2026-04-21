export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
export type TextTag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";

export interface TextProps {
  tag?: TextTag;
  size?: TextSize;
  type?: "primary" | "secondary" | "tertiary" | "disabled" | "danger" | "success" | "warning";
  strong?: boolean;
  italic?: boolean;
  delete?: boolean;
  underline?: boolean;
  mark?: boolean;
  lineClamp?: number;
  ellipsis?: boolean;
  ellipsisLineClamp?: number;
}

export type TextInstance = InstanceType<import("./text.vue").default>;
