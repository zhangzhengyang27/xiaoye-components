import Affix from "./src/affix.vue";
import type {
  AffixInstance,
  AffixPosition,
  AffixProps,
  AffixScrollPayload,
  AffixZIndex
} from "./src/affix";
import { withInstall } from "@xiaoye/utils";

export type { AffixInstance, AffixPosition, AffixProps, AffixScrollPayload, AffixZIndex };

export const XyAffix = withInstall(Affix, "xy-affix");
export default XyAffix;
