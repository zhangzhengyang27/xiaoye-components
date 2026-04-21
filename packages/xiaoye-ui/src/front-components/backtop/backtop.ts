export interface BacktopProps {
  target?: string;
  visibilityHeight?: number;
  right?: number;
  bottom?: number;
  duration?: number;
}

export interface BacktopEmits {
  (e: "click", event: MouseEvent): void;
}

export type BacktopInstance = InstanceType<import("./backtop.vue").default>;
