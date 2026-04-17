import Splitter from "./src/splitter.vue";
import SplitterPanel from "./src/split-panel.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  SplitterCollapseHandler,
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterProps,
  SplitterResizeHandler,
  SplitterSize
} from "./src/splitter";
import type { SplitterPanelProps, SplitterPanelSizeChangeHandler } from "./src/split-panel";

export type {
  SplitterCollapseHandler,
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterPanelProps,
  SplitterPanelSizeChangeHandler,
  SplitterProps,
  SplitterResizeHandler,
  SplitterSize
};

export const XySplitterPanel = withInstall(SplitterPanel, "xy-splitter-panel");

export const XySplitter = withInstall(Splitter, "xy-splitter") as SFCWithInstall<
  typeof Splitter
> & {
  Panel: typeof XySplitterPanel;
};

XySplitter.Panel = XySplitterPanel;

export default XySplitter;
