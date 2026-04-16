export interface FrontMenuItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  group?: string;
  disabled?: boolean;
  shortcut?: string;
}

export interface FrontMenuProps {
  items: FrontMenuItem[];
  activeKey?: string;
  emptyText?: string;
}
