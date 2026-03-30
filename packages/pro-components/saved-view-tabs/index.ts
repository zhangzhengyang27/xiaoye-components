import SavedViewTabs from "./src/saved-view-tabs.vue";
import type { SavedViewTabItem, SavedViewTabsProps } from "./src/saved-view-tabs";
import { withInstall } from "@xiaoye/utils";

export type { SavedViewTabItem, SavedViewTabsProps };

export const XySavedViewTabs = withInstall(SavedViewTabs, "xy-saved-view-tabs");

export default XySavedViewTabs;
