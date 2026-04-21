import type { Component, VNode } from "vue";

export type SpaceSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpaceDirection = "horizontal" | "vertical";
export type SpaceAlignment =
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline"
  | "stretch";
export type SpaceJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export interface SpaceProps {
  size?: SpaceSize | [SpaceSize, SpaceSize] | number | [number, number];
  direction?: SpaceDirection;
  alignment?: SpaceAlignment;
  justify?: SpaceJustify;
  wrap?: boolean;
  fill?: boolean;
  prefixCls?: string;
}

export type SpaceInstance = InstanceType<import("./space.vue").default>;

export function getMargin(size: SpaceSize | number): number {
  if (typeof size === "number") return size;
  const sizeMap: Record<SpaceSize, number> = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  };
  return sizeMap[size];
}
