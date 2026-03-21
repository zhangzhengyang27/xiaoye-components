import Drawer from "./src/drawer.vue";
import type { DrawerProps } from "./src/drawer.vue";
import { withInstall } from "@xiaoye/utils";

export type { DrawerProps };

export const XyDrawer = withInstall(Drawer, "xy-drawer");
export default XyDrawer;

