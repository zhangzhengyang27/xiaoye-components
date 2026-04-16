import FrontTabs from "./src/front-tabs.vue";
import type { FrontTabsProps, FrontTabsVariant } from "./src/tabs";
import { withInstall } from "@xiaoye/utils";

export type { FrontTabsProps, FrontTabsVariant };

export const XyFrontTabs = withInstall(FrontTabs, "xy-front-tabs");
export default XyFrontTabs;
