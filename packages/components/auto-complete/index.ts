import AutoComplete from "./src/auto-complete.vue";
import type { SelectOption } from "@xiaoye/utils";
import type {
  AutoCompleteInstance,
  AutoCompleteOption,
  AutoCompleteOptionSlotProps,
  AutoCompleteProps,
  AutoCompleteSearchChangeHandler,
  AutoCompleteSelectHandler,
  AutoCompleteValue
  ,
  AutoCompleteValueChangeHandler,
  AutoCompleteVisibleChangeHandler
} from "./src/auto-complete";
import { withInstall } from "@xiaoye/utils";

export type {
  AutoCompleteInstance,
  AutoCompleteOption,
  AutoCompleteOptionSlotProps,
  AutoCompleteProps,
  AutoCompleteSearchChangeHandler,
  AutoCompleteSelectHandler,
  AutoCompleteValue,
  AutoCompleteValueChangeHandler,
  AutoCompleteVisibleChangeHandler,
  SelectOption
};

export const XyAutoComplete = withInstall(AutoComplete, "xy-auto-complete");
export default XyAutoComplete;
