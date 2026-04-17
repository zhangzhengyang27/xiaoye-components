import type CollapseItem from "./collapse-item.vue";
import type { CollapseActiveName } from "./context";

export interface CollapseItemTitleSlotProps {
  isActive: boolean;
}

export interface CollapseItemProps {
  title?: string;
  name?: CollapseActiveName;
  disabled?: boolean;
}

export type CollapseItemInstance = InstanceType<typeof CollapseItem>;
