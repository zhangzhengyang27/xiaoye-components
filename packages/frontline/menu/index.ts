import FrontMenu from "./src/front-menu.vue";
import type { FrontMenuItem, FrontMenuProps } from "./src/menu";
import { withInstall } from "@xiaoye/utils";

export type { FrontMenuItem, FrontMenuProps };

export const XyFrontMenu = withInstall(FrontMenu, "xy-front-menu");
export default XyFrontMenu;
