export type AlertType = "primary" | "success" | "warning" | "danger" | "info";
export type AlertDisplayMode = "default" | "card" | "banner";

export interface AlertProps {
  title?: string;
  description?: string;
  type?: AlertType;
  closable?: boolean;
  closeText?: string;
  showIcon?: boolean;
  effect?: "light" | "dark";
  center?: boolean;
  descriptionLineClamp?: number;
  modelValue?: boolean;
  displayMode?: AlertDisplayMode;
}

export type AlertInstance = InstanceType<import("./alert.vue").default>;
