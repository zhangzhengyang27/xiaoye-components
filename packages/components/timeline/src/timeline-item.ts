import type { ComponentStatus } from "@xiaoye/utils";

export const timelineItemPlacements = ["top", "bottom"] as const;
export const timelineItemTypes = [
  "",
  "neutral",
  "primary",
  "success",
  "warning",
  "danger"
] as const;
export const timelineItemSizes = ["normal", "large"] as const;
export const timelineItemStates = ["default", "done", "current", "pending", "blocked"] as const;

export type TimelineItemPlacement = (typeof timelineItemPlacements)[number];
export type TimelineItemType = "" | ComponentStatus;
export type TimelineItemSize = (typeof timelineItemSizes)[number];
export type TimelineItemState = (typeof timelineItemStates)[number];

export interface TimelineItemProps {
  timestamp?: string;
  hideTimestamp?: boolean;
  center?: boolean;
  placement?: TimelineItemPlacement;
  type?: TimelineItemType;
  color?: string;
  size?: TimelineItemSize;
  icon?: string;
  hollow?: boolean;
  state?: TimelineItemState;
}
