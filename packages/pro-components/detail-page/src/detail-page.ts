import type { AuditTimelineEntry } from "../../audit-timeline";
import type { ProPageAction } from "../../core";
import type { ProFieldSchema } from "../../core";
import type { DescriptionsDataItem, DescriptionsProps } from "@xiaoye/components";

export interface DetailPageBreadcrumbItem {
  label: string;
  href?: string;
}

export type DetailPageAction = ProPageAction;
/** @deprecated 请改用 DetailPageBreadcrumbItem。 */
export type PageHeaderBreadcrumbItem = DetailPageBreadcrumbItem;

export interface DetailSectionItem {
  key: string;
  title: string;
  description?: string;
  model?: Record<string, unknown>;
  schema?: ProFieldSchema[];
  items?: DescriptionsDataItem[];
  descriptionsProps?: Omit<DescriptionsProps, "items" | "title" | "extra">;
}

export interface DetailPageAttachmentFile {
  id: string | number;
  name: string;
  size?: string;
  status?: "primary" | "success" | "warning" | "danger" | "neutral";
  url?: string;
}

/** @deprecated 请改用 DetailPageAction。 */
export type PageHeaderAction = DetailPageAction;
/** @deprecated 请改用 DetailPageAttachmentFile。 */
export type AttachmentPanelFile = DetailPageAttachmentFile;

export interface ChangeDiffItem {
  key: string;
  label: string;
  before?: string;
  after?: string;
  status?: "added" | "removed" | "changed" | "same";
}

export interface DetailPageProps {
  title?: string;
  description?: string;
  breadcrumbs?: DetailPageBreadcrumbItem[];
  actions?: DetailPageAction[];
  loading?: boolean;
  error?: string | null;
  sections?: DetailSectionItem[];
  attachments?: DetailPageAttachmentFile[];
  changes?: ChangeDiffItem[];
  logs?: AuditTimelineEntry[];
}
