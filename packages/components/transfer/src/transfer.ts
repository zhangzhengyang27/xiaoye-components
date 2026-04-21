import type { ComponentSize } from "@xiaoye/primitives";

export type TransferKey = string | number;

export interface TransferItem {
  key: TransferKey;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface TransferProps {
  modelValue?: TransferKey[];
  data?: TransferItem[];
  titles?: [string, string];
  disabled?: boolean;
  filterable?: boolean;
  filterPlaceholder?: string;
  size?: ComponentSize;
}
