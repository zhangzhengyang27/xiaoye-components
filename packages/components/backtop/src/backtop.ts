import type Backtop from "./backtop.vue";

export interface BacktopProps {
  visibilityHeight?: number;
  target?: string;
  right?: number;
  bottom?: number;
}

export type BacktopInstance = InstanceType<typeof Backtop>;
