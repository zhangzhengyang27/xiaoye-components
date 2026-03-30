export const auditTimelineStatuses = [
  "default",
  "success",
  "warning",
  "danger",
  "processing"
] as const;

export type AuditTimelineStatus = (typeof auditTimelineStatuses)[number];

export interface AuditTimelineAttachment {
  label: string;
  href?: string;
}

export interface AuditTimelineEntry {
  id: string | number;
  title: string;
  operator?: string;
  timestamp?: string;
  status?: AuditTimelineStatus;
  description?: string;
  remark?: string;
  attachments?: AuditTimelineAttachment[];
}

export interface AuditTimelineProps {
  items: AuditTimelineEntry[];
  emptyText?: string;
  compact?: boolean;
}
