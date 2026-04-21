import { withInstall } from "xiaoye-primitives";
import Result from "./result.vue";
import type { ResultProps, ResultInstance, ResultType } from "./result";

export type { ResultProps, ResultInstance, ResultType };

export const XyuResult = withInstall(Result, "XyuResult");

export default XyuResult;
