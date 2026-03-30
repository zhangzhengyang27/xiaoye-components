import FilterPanel from "./src/filter-panel.vue";
import type { FilterPanelProps } from "./src/filter-panel";
import { withInstall } from "@xiaoye/utils";

export type { FilterPanelProps };

export const XyFilterPanel = withInstall(FilterPanel, "xy-filter-panel");

export default XyFilterPanel;
