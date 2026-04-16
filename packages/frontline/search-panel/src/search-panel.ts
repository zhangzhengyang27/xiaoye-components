import type { FrontMenuItem } from "../../menu";

export type FrontSearchPanelItem = FrontMenuItem;

export interface FrontSearchPanelProps {
  query?: string;
  activeKey?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  items?: FrontSearchPanelItem[];
  emptyText?: string;
}
