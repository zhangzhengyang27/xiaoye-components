import PageToolbar from "./src/page-toolbar.vue";
import type { PageToolbarProps } from "./src/page-toolbar";
import { withInstall } from "@xiaoye/primitives";

export type { PageToolbarProps };

export const XyPageToolbar = withInstall(PageToolbar, "xy-page-toolbar");
export default XyPageToolbar;
