export interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
  closable?: boolean;
}

export const tabsTypes = ["", "card", "border-card"] as const;
export const tabsPositions = ["top", "right", "bottom", "left"] as const;

export type TabsType = (typeof tabsTypes)[number];
export type TabsPosition = (typeof tabsPositions)[number];
export type TabsBeforeLeave = (
  newKey: string,
  oldKey: string
) => boolean | void | Promise<boolean | void>;

export interface TabsProps {
  modelValue?: string;
  defaultValue?: string;
  items: TabItem[];
  type?: TabsType;
  tabPosition?: TabsPosition;
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  stretch?: boolean;
  beforeLeave?: TabsBeforeLeave;
  tabindex?: string | number;
}
