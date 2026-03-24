import Tabs from "./src/tabs.vue";
import type {
  TabItem,
  TabsBeforeLeave,
  TabsPosition,
  TabsProps,
  TabsType
} from "./src/tabs";
import { withInstall } from "@xiaoye/utils";

export type { TabItem, TabsBeforeLeave, TabsPosition, TabsProps, TabsType };

export const XyTabs = withInstall(Tabs, "xy-tabs");
export default XyTabs;
