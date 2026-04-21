export type TabsType = "line" | "card" | "border-card";
export type TabsSize = "sm" | "md" | "lg";
export type TabsTrigger = "click" | "hover";

export interface TabPaneProps {
  label: string;
  name: string;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
}

export interface TabsProps {
  modelValue?: string;
  type?: TabsType;
  size?: TabsSize;
  trigger?: TabsTrigger;
  stretch?: boolean;
}

export type TabsInstance = InstanceType<import("./tabs.vue").default>;
export type TabPaneInstance = InstanceType<import("./tab-pane.vue").default>;
