import { withInstall } from "xiaoye-primitives";
import Badge from "./badge.vue";
import type { BadgeProps, BadgeInstance, BadgeType, BadgeSize } from "./badge";

export type { BadgeProps, BadgeInstance, BadgeType, BadgeSize };

export const XyuBadge = withInstall(Badge, "XyuBadge");

export default XyuBadge;
