export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";
export type DialogEffect = "light" | "dark";

export interface DialogProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  size?: DialogSize;
  effect?: DialogEffect;
  top?: string;
  showClose?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  destroyOnClose?: boolean;
  zIndex?: number;
}

export type DialogInstance = InstanceType<import("./dialog.vue").default>;
