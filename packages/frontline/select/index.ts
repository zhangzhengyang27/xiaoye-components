import FrontSelect from "./src/front-select.vue";
import type { FrontSelectProps, FrontSelectSize, FrontSelectVariant } from "./src/select";
import { withInstall } from "@xiaoye/utils";

export type { FrontSelectProps, FrontSelectSize, FrontSelectVariant };

export const XyFrontSelect = withInstall(FrontSelect, "xy-front-select");
export default XyFrontSelect;
