import Avatar from "./src/avatar.vue";
import AvatarGroup from "./src/avatar-group.vue";
import type { AvatarGroupProps } from "./src/avatar-group";
import type { AvatarFit, AvatarProps, AvatarShape } from "./src/avatar";
import { withInstall } from "@xiaoye/utils";

export type { AvatarFit, AvatarGroupProps, AvatarProps, AvatarShape };

export const XyAvatar = withInstall(Avatar, "xy-avatar");
export const XyAvatarGroup = withInstall(AvatarGroup, "xy-avatar-group");
export default XyAvatar;
