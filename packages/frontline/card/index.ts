import FrontCard from "./src/front-card.vue";
import type { FrontCardProps, FrontCardSurface } from "./src/card";
import { withInstall } from "@xiaoye/utils";

export type { FrontCardProps, FrontCardSurface };

export const XyFrontCard = withInstall(FrontCard, "xy-front-card");
export default XyFrontCard;
