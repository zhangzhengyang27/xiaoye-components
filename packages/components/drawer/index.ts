import Drawer from "./src/drawer.vue";
import type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerHeaderSlotProps,
  DrawerInstance,
  DrawerModelValueChangeHandler,
  DrawerPlacement,
  DrawerProps,
  DrawerResizeHandler,
  DrawerTitleSlotProps,
  DrawerTransition
} from "./src/drawer";
import { withInstall } from "@xiaoye/utils";

export type {
  DrawerCloseReason,
  DrawerDirection,
  DrawerHeaderSlotProps,
  DrawerInstance,
  DrawerModelValueChangeHandler,
  DrawerPlacement,
  DrawerProps,
  DrawerResizeHandler,
  DrawerTitleSlotProps,
  DrawerTransition
};

export const XyDrawer = withInstall(Drawer, "xy-drawer");
export default XyDrawer;
