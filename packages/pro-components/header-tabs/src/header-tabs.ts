import type { TabItem, TabsBeforeLeave, TabsPosition, TabsType } from "@xiaoye/components";

export type HeaderTabsMenuAction =
  | "close-current"
  | "close-others"
  | "close-left"
  | "close-right"
  | "close-all";

export interface HeaderTabItem extends TabItem {
  badge?: string | number;
}

export interface HeaderTabsProps {
  modelValue?: string;
  defaultValue?: string;
  items: HeaderTabItem[];
  type?: TabsType;
  tabPosition?: TabsPosition;
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  beforeLeave?: TabsBeforeLeave;
  menuActions?: Array<{
    key: HeaderTabsMenuAction;
    label: string;
  }>;
}
