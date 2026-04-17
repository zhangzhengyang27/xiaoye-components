import type Backtop from "./backtop.vue";

export type BacktopClickHandler = (event: MouseEvent) => void;

export interface BacktopProps {
  visibilityHeight?: number;
  target?: string;
  right?: number;
  bottom?: number;
}

export type BacktopInstance = InstanceType<typeof Backtop>;
