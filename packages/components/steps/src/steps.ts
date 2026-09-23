export const stepsDirections = ["horizontal", "vertical"] as const;
export const stepsStatuses = ["wait", "process", "finish", "error", "success"] as const;

export type StepsDirection = (typeof stepsDirections)[number];
export type StepsStatus = (typeof stepsStatuses)[number];
export type StepsChangeHandler = (newValue: number, oldValue: number) => void;

export interface StepsProps {
  space?: number | string;
  active?: number;
  direction?: StepsDirection;
  alignCenter?: boolean;
  simple?: boolean;
  finishStatus?: StepsStatus;
  processStatus?: StepsStatus;
  /**
   * 仅用于开发期捕获误用：XySteps 不支持 items prop。
   * @deprecated 请使用默认插槽渲染 XyStep。
   */
  items?: unknown;
}
