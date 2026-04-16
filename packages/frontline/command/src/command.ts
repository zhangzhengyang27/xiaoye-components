export interface FrontCommandItem {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  group?: string;
  shortcut?: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface FrontCommandProps {
  modelValue?: boolean;
  items: FrontCommandItem[];
  placeholder?: string;
  title?: string;
  description?: string;
  emptyText?: string;
  closeOnSelect?: boolean;
  enableGlobalShortcut?: boolean;
  shortcutLabel?: string;
  shortcutKeys?: string[];
}
