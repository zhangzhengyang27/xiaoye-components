export type PageIcon = string;

export interface PageMetaItem {
  label?: string;
  value?: string | number;
  icon?: PageIcon;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export interface PageHeaderProps {
  title?: string;
  description?: string;
  metaItems?: PageMetaItem[];
  divider?: boolean;
  bordered?: boolean;
}
