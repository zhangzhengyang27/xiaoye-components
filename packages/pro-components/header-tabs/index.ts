import HeaderTabs from "./src/header-tabs.vue";
import type {
  HeaderTabItem,
  HeaderTabsMenuAction,
  HeaderTabsProps
} from "./src/header-tabs";
import { withInstall } from "@xiaoye/primitives";

export type { HeaderTabItem, HeaderTabsMenuAction, HeaderTabsProps };

export const XyHeaderTabs = withInstall(HeaderTabs, "xy-header-tabs");
export default XyHeaderTabs;
