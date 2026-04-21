import { withInstall } from "xiaoye-primitives";
import Avatar from "./avatar.vue";
import type { AvatarProps, AvatarInstance, AvatarSize, AvatarShape } from "./avatar";

export type { AvatarProps, AvatarInstance, AvatarSize, AvatarShape };

export const XyuAvatar = withInstall(Avatar, "XyuAvatar");

export default XyuAvatar;
