export interface NoticeCenterAction {
  key: string;
  label: string;
  icon?: string;
}

export interface NoticeCenterItem {
  key: string;
  title: string;
  content?: string;
  time?: string;
  tag?: string;
  tagStatus?: "primary" | "success" | "warning" | "danger" | "neutral";
  avatar?: string;
  read?: boolean;
}

export interface NoticeCenterTab {
  key: string;
  label: string;
  items: NoticeCenterItem[];
}

export interface NoticeCenterProps {
  tabs: NoticeCenterTab[];
  actions?: NoticeCenterAction[];
  maxHeight?: string | number;
  emptyText?: string;
  defaultTab?: string;
}
