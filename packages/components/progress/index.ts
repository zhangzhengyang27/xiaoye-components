import Progress from "./src/progress.vue";
import type {
  ProgressColor,
  ProgressColorMap,
  ProgressColorStop,
  ProgressDefaultSlotProps,
  ProgressFormatter,
  ProgressProps,
  ProgressStatus,
  ProgressStrokeLinecap,
  ProgressType
} from "./src/progress";
import { withInstall } from "@xiaoye/utils";

export type {
  ProgressColor,
  ProgressColorMap,
  ProgressColorStop,
  ProgressDefaultSlotProps,
  ProgressFormatter,
  ProgressProps,
  ProgressStatus,
  ProgressStrokeLinecap,
  ProgressType
};

export const XyProgress = withInstall(Progress, "xy-progress");
export default XyProgress;
