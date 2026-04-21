import { withInstall } from "xiaoye-primitives";
import ProductCard from "./product-card.vue";

export const XyuProductCard = withInstall(ProductCard, "XyuProductCard");

export default XyuProductCard;
export type { ProductCardProps } from "./product-card.vue";
