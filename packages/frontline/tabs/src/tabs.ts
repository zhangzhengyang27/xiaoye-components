import type { TabItem } from "@xiaoye/components/tabs/src/tabs";

export const frontTabsVariants = ["underline", "pill", "segmented"] as const;
export type FrontTabsVariant = (typeof frontTabsVariants)[number];

export interface FrontTabsProps {
  modelValue?: string;
  defaultValue?: string;
  items: TabItem[];
  variant?: FrontTabsVariant;
}
