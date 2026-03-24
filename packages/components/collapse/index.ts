import Collapse from "./src/collapse.vue";
import CollapseItem from "./src/collapse-item.vue";
import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import type { CollapseProps } from "./src/collapse";
import type { CollapseItemProps } from "./src/collapse-item";
import type {
  CollapseActiveName,
  CollapseBeforeCollapse,
  CollapseExpandIconPosition,
  CollapseModelValue
} from "./src/context";

export type {
  CollapseActiveName,
  CollapseBeforeCollapse,
  CollapseExpandIconPosition,
  CollapseItemProps,
  CollapseModelValue,
  CollapseProps
};

export const XyCollapseItem = withInstall(CollapseItem, "xy-collapse-item");

export const XyCollapse = withInstall(Collapse, "xy-collapse") as SFCWithInstall<typeof Collapse> & {
  Item: typeof XyCollapseItem;
};

XyCollapse.Item = XyCollapseItem;

export default XyCollapse;
