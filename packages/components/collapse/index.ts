import Collapse from "./src/collapse.vue";
import CollapseItem from "./src/collapse-item.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type { CollapseInstance, CollapseProps } from "./src/collapse";
import type {
  CollapseItemInstance,
  CollapseItemProps,
  CollapseItemTitleSlotProps
} from "./src/collapse-item";
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
  CollapseInstance,
  CollapseItemProps,
  CollapseItemInstance,
  CollapseItemTitleSlotProps,
  CollapseModelValue,
  CollapseProps
};

export const XyCollapseItem = withInstall(CollapseItem, "xy-collapse-item");

export const XyCollapse = withInstall(Collapse, "xy-collapse") as SFCWithInstall<typeof Collapse> & {
  Item: typeof XyCollapseItem;
};

XyCollapse.Item = XyCollapseItem;

export default XyCollapse;
