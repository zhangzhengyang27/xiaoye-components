export type DividerDirection = "horizontal" | "vertical";
export type DividerBorderStyle = "solid" | "dashed" | "dotted";

export interface DividerProps {
  direction?: DividerDirection;
  borderStyle?: DividerBorderStyle;
  color?: string;
  contentPosition?: "left" | "center" | "right";
}

export type DividerInstance = InstanceType<import("./divider.vue").default>;
