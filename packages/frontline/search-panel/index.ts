import FrontSearchPanel from "./src/front-search-panel.vue";
import type { FrontSearchPanelItem, FrontSearchPanelProps } from "./src/search-panel";
import { withInstall } from "@xiaoye/utils";

export type { FrontSearchPanelItem, FrontSearchPanelProps };

export const XyFrontSearchPanel = withInstall(FrontSearchPanel, "xy-front-search-panel");
export default XyFrontSearchPanel;
