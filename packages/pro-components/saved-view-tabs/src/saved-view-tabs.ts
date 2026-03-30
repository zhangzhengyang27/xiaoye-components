export interface SavedViewTabItem {
  key: string;
  label: string;
  count?: number;
  closable?: boolean;
}

export interface SavedViewTabsProps {
  items: SavedViewTabItem[];
  activeKey?: string;
  addable?: boolean;
}
