export type SplitterLayout = "horizontal" | "vertical";
export type SplitterSize = number | string;
export type SplitterCollapseDirection = "start" | "end";

export interface SplitterProps {
  layout?: SplitterLayout;
  lazy?: boolean;
}
