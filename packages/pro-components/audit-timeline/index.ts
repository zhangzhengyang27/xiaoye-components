import AuditTimeline from "./src/audit-timeline.vue";
import type {
  AuditTimelineAttachment,
  AuditTimelineEntry,
  AuditTimelineProps
} from "./src/audit-timeline";
import { withInstall } from "@xiaoye/utils";

export type {
  AuditTimelineAttachment,
  AuditTimelineEntry,
  AuditTimelineProps
};

export const XyAuditTimeline = withInstall(AuditTimeline, "xy-audit-timeline");

export default XyAuditTimeline;
