export interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
  leaf?: boolean;
}

export interface CascaderProps {
  modelValue?: (string | number)[];
  options?: CascaderOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  showAllLevels?: boolean;
  separator?: string;
  filterable?: boolean;
  collapseTags?: boolean;
  props?: {
    expandTrigger?: "click" | "hover";
    multiple?: boolean;
    checkStrictly?: boolean;
  };
}

export interface CascaderEmits {
  (e: "update:modelValue", value: (string | number)[]): void;
  (e: "change", value: (string | number)[]): void;
}

export type CascaderInstance = InstanceType<import("./cascader.vue").default>;
