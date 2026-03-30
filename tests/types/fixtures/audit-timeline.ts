import type {
  AuditTimelineAttachment,
  AuditTimelineEntry,
  AuditTimelineProps
} from "@xiaoye/pro-components";

const attachment: AuditTimelineAttachment = {
  label: "审批截图.png"
};

const items: AuditTimelineEntry[] = [
  {
    id: "log-1",
    title: "审批发起",
    operator: "小叶",
    timestamp: "2026-03-21 09:10",
    status: "success",
    attachments: [attachment]
  }
];

const props: AuditTimelineProps = {
  items,
  compact: true
};

const status: NonNullable<AuditTimelineEntry["status"]> = "processing";

void attachment;
void items;
void props;
void status;

// @ts-expect-error unsupported audit status
const invalidStatus: NonNullable<AuditTimelineEntry["status"]> = "failed";

void invalidStatus;
