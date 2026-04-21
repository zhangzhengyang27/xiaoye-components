import { withInstall } from "xiaoye-primitives";
import Timeline from "./timeline.vue";
import TimelineItem from "./timeline-item.vue";
import type { TimelineProps, TimelineEmits, TimelineInstance, TimelineItemProps, TimelineItemInstance, TimelineItemPlacement } from "./timeline";

export type { TimelineProps, TimelineEmits, TimelineInstance, TimelineItemProps, TimelineItemInstance, TimelineItemPlacement };

export const XyuTimeline = withInstall(Timeline, "XyuTimeline");
export const XyuTimelineItem = withInstall(TimelineItem, "XyuTimelineItem");

export default XyuTimeline;
