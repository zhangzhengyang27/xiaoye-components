import Drawer from "./src/drawer.vue";
import type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerInstance,
  DrawerPlacement,
  DrawerProps,
  DrawerTransition
} from "./src/drawer";
import { withInstall } from "@xiaoye/utils";

export type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerInstance,
  DrawerPlacement,
  DrawerProps,
  DrawerTransition
};

export const XyDrawer = withInstall(Drawer, "xy-drawer");
export default XyDrawer;
