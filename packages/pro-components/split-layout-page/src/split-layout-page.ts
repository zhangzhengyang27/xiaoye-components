export type SplitLayoutPageLayout = "master-detail" | "aside-main";

export interface SplitLayoutPageProps {
  title?: string;
  description?: string;
  layout?: SplitLayoutPageLayout;
  primarySize?: string;
}
