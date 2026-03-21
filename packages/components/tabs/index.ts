import Tabs from "./src/tabs.vue";
import type { TabItem, TabsProps } from "./src/tabs.vue";
import { withInstall } from "@xiaoye/utils";

export type { TabsProps, TabItem };

export const XyTabs = withInstall(Tabs, "xy-tabs");
export default XyTabs;
