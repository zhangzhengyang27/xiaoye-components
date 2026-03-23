import InputTag from "./src/input-tag.vue";
import type {
  InputTagDropType,
  InputTagProps,
  InputTagTrigger,
  InputTagValue
} from "./src/input-tag";
import { withInstall } from "@xiaoye/utils";

export type { InputTagDropType, InputTagProps, InputTagTrigger, InputTagValue };

export const XyInputTag = withInstall(InputTag, "xy-input-tag");
export default XyInputTag;
