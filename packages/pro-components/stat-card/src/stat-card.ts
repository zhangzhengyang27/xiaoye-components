import type { PageIcon } from "../../page-header";

export type StatTrend = "up" | "down" | "flat";

export interface StatCardProps {
  title?: string;
  value?: string | number;
  description?: string;
  icon?: PageIcon;
  trend?: StatTrend;
  trendText?: string;
  loading?: boolean;
}
