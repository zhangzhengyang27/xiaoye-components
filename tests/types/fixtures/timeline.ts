import { h } from "vue";
import {
  XyTimeline,
  XyTimelineGroup,
  XyTimelineItem,
  type TimelineDensity,
  type TimelineGroupProps,
  type TimelineItemPlacement,
  type TimelineItemProps,
  type TimelineItemSize,
  type TimelineItemState,
  type TimelineItemType,
  type TimelineMode,
  type TimelineProps
} from "xiaoye-components";

const mode: TimelineMode = "alternate";
const density: TimelineDensity = "compact";
const placement: TimelineItemPlacement = "top";
const size: TimelineItemSize = "large";
const state: TimelineItemState = "current";
const type: TimelineItemType = "success";

const timelineProps: TimelineProps = {
  mode,
  reverse: true,
  density
};

const timelineGroupProps: TimelineGroupProps = {
  title: "今天",
  description: "最近更新",
  divider: false
};

const timelineItemProps: TimelineItemProps = {
  timestamp: "2026-03-26 10:30",
  hideTimestamp: false,
  center: true,
  placement,
  type,
  state,
  color: "#2563eb",
  size,
  icon: "mdi:check-circle-outline",
  hollow: true
};

void timelineProps;
void timelineGroupProps;
void timelineItemProps;

const timelineVNode = h(
  XyTimeline,
  {
    mode: "end",
    reverse: false,
    density: "default"
  },
  {
    default: () => [
      h(XyTimelineGroup as never, { title: "今天" } as never, {
        default: () => [
          h(
            XyTimelineItem as never,
            {
              timestamp: "步骤一",
              type: "primary",
              state: "done"
            } as never,
            {
              title: () => "第一条标题",
              default: () => "第一条记录"
            }
          )
        ]
      }),
      h(
        XyTimeline.Item as never,
        {
          timestamp: "步骤二",
          placement: "bottom",
          size: "normal",
          state: "pending"
        } as never,
        {
          default: () => "第二条记录"
        }
      )
    ]
  }
);

void timelineVNode;

const invalidTimelineProps: TimelineProps = {
  // @ts-expect-error invalid timeline mode
  mode: "middle"
};

void invalidTimelineProps;

const invalidTimelineDensity: TimelineProps = {
  // @ts-expect-error invalid timeline density
  density: "dense"
};

void invalidTimelineDensity;

const invalidTimelineItemType: TimelineItemProps = {
  // @ts-expect-error invalid timeline item type
  type: "info"
};

void invalidTimelineItemType;

const invalidTimelineItemPlacement: TimelineItemProps = {
  // @ts-expect-error invalid timeline item placement
  placement: "left"
};

void invalidTimelineItemPlacement;

const invalidTimelineItemState: TimelineItemProps = {
  // @ts-expect-error invalid timeline item state
  state: "warning"
};

void invalidTimelineItemState;
