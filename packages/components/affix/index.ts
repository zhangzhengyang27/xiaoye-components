import Affix from "./src/affix.vue";
import type {
  AffixChangeHandler,
  AffixInstance,
  AffixPosition,
  AffixProps,
  AffixScrollHandler,
  AffixScrollPayload,
  AffixZIndex
} from "./src/affix";
import { withInstall } from "@xiaoye/utils";

export type {
  AffixChangeHandler,
  AffixInstance,
  AffixPosition,
  AffixProps,
  AffixScrollHandler,
  AffixScrollPayload,
  AffixZIndex
};

export const XyAffix = withInstall(Affix, "xy-affix");
export default XyAffix;
