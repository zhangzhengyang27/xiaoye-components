import InputTag from "./src/input-tag.vue";
import type {
  InputTagAddTagHandler,
  InputTagDragTagHandler,
  InputTagFocusHandler,
  InputTagInputHandler,
  InputTagDropType,
  InputTagInstance,
  InputTagProps,
  InputTagRemoveTagHandler,
  InputTagSlotProps,
  InputTagTrigger,
  InputTagValue,
  InputTagValueChangeHandler
} from "./src/input-tag";
import { withInstall } from "@xiaoye/utils";

export type {
  InputTagAddTagHandler,
  InputTagDragTagHandler,
  InputTagFocusHandler,
  InputTagInputHandler,
  InputTagDropType,
  InputTagInstance,
  InputTagProps,
  InputTagRemoveTagHandler,
  InputTagSlotProps,
  InputTagTrigger,
  InputTagValue,
  InputTagValueChangeHandler
};

export const XyInputTag = withInstall(InputTag, "xy-input-tag");
export default XyInputTag;
