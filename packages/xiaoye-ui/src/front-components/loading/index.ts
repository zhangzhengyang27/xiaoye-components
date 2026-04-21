import { withInstall } from "xiaoye-primitives";
import Loading from "./loading.vue";
import { vLoading } from "./directive";
import LoadingService from "./service";

export { vLoading, LoadingService };
export type { LoadingOptions } from "./directive";
export type { LoadingInstance } from "./loading";

export const XyuLoading = withInstall(Loading, "XyuLoading") as any;

export default XyuLoading;
