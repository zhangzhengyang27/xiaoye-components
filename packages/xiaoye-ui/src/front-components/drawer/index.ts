import { withInstall } from "xiaoye-primitives";
import Drawer from "./drawer.vue";
import type { DrawerProps, DrawerInstance, DrawerPlacement, DrawerSize } from "./drawer";

export type { DrawerProps, DrawerInstance, DrawerPlacement, DrawerSize };

export const XyuDrawer = withInstall(Drawer, "XyuDrawer");

export default XyuDrawer;
