import Avatar from "./src/avatar.vue";
import AvatarGroup from "./src/avatar-group.vue";
import type {
  AvatarErrorHandler,
  AvatarFit,
  AvatarProps,
  AvatarShape
} from "./src/avatar";
import type {
  AvatarGroupItem,
  AvatarGroupItemClickHandler,
  AvatarGroupItemSlotProps,
  AvatarGroupProps
} from "./src/avatar-group";
import { withInstall } from "@xiaoye/utils";

export type {
  AvatarErrorHandler,
  AvatarFit,
  AvatarGroupItem,
  AvatarGroupItemClickHandler,
  AvatarGroupItemSlotProps,
  AvatarGroupProps,
  AvatarProps,
  AvatarShape
};

export const XyAvatar = withInstall(Avatar, "xy-avatar");
export const XyAvatarGroup = withInstall(AvatarGroup, "xy-avatar-group");
export default XyAvatar;
