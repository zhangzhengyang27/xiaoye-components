import { withInstall } from "xiaoye-primitives";
import Card from "./card.vue";
import type { CardProps, CardEmits, CardInstance } from "./card";

export type { CardProps, CardEmits, CardInstance };

export const XyuCard = withInstall(Card, "XyuCard");

export default XyuCard;
