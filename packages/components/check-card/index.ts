import CheckCard from "./src/check-card.vue";
import CheckCardGroup from "./src/check-card-group.vue";
import type { SFCWithInstall } from "@xiaoye/primitives";
import { withInstall } from "@xiaoye/primitives";
import type {
  CheckCardAvatar,
  CheckCardChangeHandler,
  CheckCardExtraHandler,
  CheckCardProps,
  CheckCardSlotProps,
  CheckCardTag
} from "./src/check-card";
import type {
  CheckCardGroupChangeHandler,
  CheckCardGroupExtraHandler,
  CheckCardGroupOption,
  CheckCardGroupProps,
  CheckCardGroupSlotProps,
  CheckCardSingleValue,
  CheckCardValue
} from "./src/check-card-group";

export type {
  CheckCardAvatar,
  CheckCardChangeHandler,
  CheckCardExtraHandler,
  CheckCardGroupChangeHandler,
  CheckCardGroupExtraHandler,
  CheckCardGroupOption,
  CheckCardGroupProps,
  CheckCardGroupSlotProps,
  CheckCardProps,
  CheckCardSingleValue,
  CheckCardSlotProps,
  CheckCardTag,
  CheckCardValue
};

export const XyCheckCardGroup = withInstall(CheckCardGroup, "xy-check-card-group");

export const XyCheckCard = withInstall(CheckCard, "xy-check-card") as SFCWithInstall<
  typeof CheckCard
> & {
  Group: typeof XyCheckCardGroup;
};

XyCheckCard.Group = XyCheckCardGroup;

export default XyCheckCard;
