import type { SplitterSize } from "./splitter";

export interface SplitterPanelProps {
  min?: SplitterSize;
  max?: SplitterSize;
  size?: SplitterSize;
  resizable?: boolean;
  collapsible?: boolean;
}

export type SplitterPanelSizeChangeHandler = (value: number) => void;
