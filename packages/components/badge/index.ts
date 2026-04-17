import Badge from "./src/badge.vue";
import type { BadgeContentSlotProps, BadgeInstance, BadgeProps, BadgeType } from "./src/badge";
import { withInstall } from "@xiaoye/utils";

export type { BadgeContentSlotProps, BadgeInstance, BadgeProps, BadgeType };

export const XyBadge = withInstall(Badge, "xy-badge");
export default XyBadge;
