import Tabs from "./src/tabs.vue";
import type {
  TabItem,
  TabsBeforeLeave,
  TabsChangeHandler,
  TabsDefaultSlotProps,
  TabsEditAction,
  TabsEditHandler,
  TabsInstance,
  TabsModelValueChangeHandler,
  TabsPosition,
  TabsProps,
  TabsTabAddHandler,
  TabsTabClickHandler,
  TabsTabRemoveHandler,
  TabsType
} from "./src/tabs";
import { withInstall } from "@xiaoye/primitives";

export type {
  TabItem,
  TabsBeforeLeave,
  TabsChangeHandler,
  TabsDefaultSlotProps,
  TabsEditAction,
  TabsEditHandler,
  TabsInstance,
  TabsModelValueChangeHandler,
  TabsPosition,
  TabsProps,
  TabsTabAddHandler,
  TabsTabClickHandler,
  TabsTabRemoveHandler,
  TabsType
};

export const XyTabs = withInstall(Tabs, "xy-tabs");
export default XyTabs;
