import { withInstall } from "xiaoye-primitives";
import SkuSelector from "./sku-selector.vue";

export const XyuSkuSelector = withInstall(SkuSelector, "XyuSkuSelector");

export default XyuSkuSelector;
export type { SkuSelectorProps, SkuDimension, SkuOption } from "./sku-selector.vue";
