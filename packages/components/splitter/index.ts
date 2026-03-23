import Splitter from "./src/splitter.vue";
import SplitterPanel from "./src/split-panel.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type {
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterProps,
  SplitterSize
} from "./src/splitter";
import type { SplitterPanelProps } from "./src/split-panel";

export type {
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterPanelProps,
  SplitterProps,
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
