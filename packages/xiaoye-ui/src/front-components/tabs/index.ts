import { withInstall } from "xiaoye-primitives";
import Tabs from "./tabs.vue";
import TabPane from "./tab-pane.vue";
import type { TabsProps, TabsInstance, TabPaneProps, TabPaneInstance, TabsType, TabsSize } from "./tabs";

export type { TabsProps, TabsInstance, TabPaneProps, TabPaneInstance, TabsType, TabsSize };

export const XyuTabs = withInstall(Tabs, "XyuTabs");
export const XyuTabPane = withInstall(TabPane, "XyuTabPane");

export default XyuTabs;
