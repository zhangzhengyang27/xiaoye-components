import type { SFCWithInstall } from "@xiaoye/utils";
import { withInstall } from "@xiaoye/utils";
import Timeline from "./src/timeline";
import TimelineGroup from "./src/timeline-group.vue";
import TimelineItem from "./src/timeline-item.vue";
import type { TimelineDensity, TimelineMode, TimelineProps } from "./src/timeline";
import type { TimelineGroupProps } from "./src/timeline-group";
import type {
  TimelineItemPlacement,
  TimelineItemProps,
  TimelineItemSize,
  TimelineItemState,
  TimelineItemType
} from "./src/timeline-item";

export type {
  TimelineDensity,
  TimelineGroupProps,
  TimelineItemPlacement,
  TimelineItemProps,
  TimelineItemSize,
  TimelineItemState,
  TimelineItemType,
  TimelineMode,
  TimelineProps
};

export const XyTimelineGroup = withInstall(TimelineGroup, "xy-timeline-group") as SFCWithInstall<
  typeof TimelineGroup
>;
export const XyTimelineItem = withInstall(TimelineItem, "xy-timeline-item") as SFCWithInstall<
  typeof TimelineItem
>;

export const XyTimeline = withInstall(Timeline, "xy-timeline") as SFCWithInstall<
  typeof Timeline
> & {
  Group: typeof XyTimelineGroup;
  Item: typeof XyTimelineItem;
};

XyTimeline.Group = XyTimelineGroup;
XyTimeline.Item = XyTimelineItem;

export default XyTimeline;
