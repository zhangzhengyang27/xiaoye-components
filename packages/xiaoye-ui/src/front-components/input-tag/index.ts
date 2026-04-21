import { withInstall } from "xiaoye-primitives";
import InputTag from "./input-tag.vue";
import type { InputTagProps, InputTagInstance, InputTagSize, InputTagType } from "./input-tag";

export type { InputTagProps, InputTagInstance, InputTagSize, InputTagType };

export const XyuInputTag = withInstall(InputTag, "XyuInputTag");

export default XyuInputTag;
