import type {
  CollapseActiveName,
  CollapseBeforeCollapse,
  CollapseExpandIconPosition,
  CollapseModelValue
} from "./context";

export type {
  CollapseActiveName,
  CollapseBeforeCollapse,
  CollapseExpandIconPosition,
  CollapseModelValue
};

export interface CollapseProps {
  modelValue?: CollapseModelValue;
  accordion?: boolean;
  expandIconPosition?: CollapseExpandIconPosition;
  beforeCollapse?: CollapseBeforeCollapse;
}

export function ensureCollapseNames(value: CollapseModelValue | undefined) {
  if (value == null || value === "") {
    return [] as CollapseActiveName[];
  }

  return Array.isArray(value) ? [...value] : [value];
}
