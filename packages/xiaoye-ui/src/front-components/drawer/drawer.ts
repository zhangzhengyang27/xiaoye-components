export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "xl";

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  size?: DrawerSize | string;
  placement?: DrawerPlacement;
  showClose?: boolean;
  closeOnClickModal?: boolean;
  destroyOnClose?: boolean;
  zIndex?: number;
  withHeader?: boolean;
}

export type DrawerInstance = InstanceType<import("./drawer.vue").default>;
