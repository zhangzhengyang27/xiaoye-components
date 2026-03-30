import AvatarMenu from "./src/avatar-menu.vue";
import type {
  AvatarMenuCommand,
  AvatarMenuItem,
  AvatarMenuProps
} from "./src/avatar-menu";
import { withInstall } from "@xiaoye/utils";

export type { AvatarMenuCommand, AvatarMenuItem, AvatarMenuProps };

export const XyAvatarMenu = withInstall(AvatarMenu, "xy-avatar-menu");
export default XyAvatarMenu;
