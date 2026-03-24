import Result from "./src/result.vue";
import type {
  ResultIconType,
  ResultProps,
  ResultStatus,
  ResultVariant
} from "./src/result";
import { withInstall } from "@xiaoye/utils";

export type { ResultIconType, ResultProps, ResultStatus, ResultVariant };

export const XyResult = withInstall(Result, "xy-result");
export default XyResult;
