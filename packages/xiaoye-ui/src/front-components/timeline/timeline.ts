export type TimelineItemPlacement = "left" | "right" | "alternate";
export type TimelineItemStatus = "pending" | "processing" | "success" | "error" | "warning";

export interface TimelineItemProps {
  timestamp?: string;
  content?: string;
  icon?: string;
  color?: string;
  status?: TimelineItemStatus;
  hollow?: boolean;
  dot?: string;
}

export interface TimelineProps {
  mode?: TimelineItemPlacement;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
}

export interface TimelineEmits {
  (e: "click", item: TimelineItemProps): void;
}

export type TimelineInstance = InstanceType<import("./timeline.vue").default>;
export type TimelineItemInstance = InstanceType<import("./timeline-item.vue").default>;
