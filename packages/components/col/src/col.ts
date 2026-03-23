export const colPositionProps = ["span", "offset", "pull", "push"] as const;
export const colBreakpoints = ["xs", "sm", "md", "lg", "xl"] as const;

export type ColPositionProp = (typeof colPositionProps)[number];
export type ColBreakpoint = (typeof colBreakpoints)[number];

export interface ColSizeObject {
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
}

export type ColSize = number | ColSizeObject;

export interface ColProps {
  tag?: string;
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
  xs?: ColSize;
  sm?: ColSize;
  md?: ColSize;
  lg?: ColSize;
  xl?: ColSize;
}
