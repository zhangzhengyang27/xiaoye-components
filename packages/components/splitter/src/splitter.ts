export type SplitterLayout = "horizontal" | "vertical";
export type SplitterSize = number | string;
export type SplitterCollapseDirection = "start" | "end";
export type SplitterResizeHandler = (index: number, sizes: number[]) => void;
export type SplitterCollapseHandler = (
  index: number,
  direction: SplitterCollapseDirection,
  sizes: number[]
) => void;

export interface SplitterProps {
  layout?: SplitterLayout;
  lazy?: boolean;
}
