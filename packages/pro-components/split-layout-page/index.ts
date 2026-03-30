import SplitLayoutPage from "./src/split-layout-page.vue";
import type { SplitLayoutPageProps } from "./src/split-layout-page";
import { withInstall } from "@xiaoye/utils";

export type { SplitLayoutPageProps };

export const XySplitLayoutPage = withInstall(SplitLayoutPage, "xy-split-layout-page");

export default XySplitLayoutPage;
