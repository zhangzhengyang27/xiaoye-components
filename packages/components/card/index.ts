import Card from "./src/card.vue";
import type { CardProps, CardShadow, CardVariant } from "./src/card";
import { withInstall } from "@xiaoye/utils";

export type { CardProps, CardShadow, CardVariant };

export const XyCard = withInstall(Card, "xy-card");
export default XyCard;
