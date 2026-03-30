import AutoComplete from "./src/auto-complete.vue";
import type { SelectOption } from "@xiaoye/utils";
import type {
  AutoCompleteOption,
  AutoCompleteProps,
  AutoCompleteValue
} from "./src/auto-complete";
import { withInstall } from "@xiaoye/utils";

export type { AutoCompleteOption, AutoCompleteProps, AutoCompleteValue, SelectOption };

export const XyAutoComplete = withInstall(AutoComplete, "xy-auto-complete");
export default XyAutoComplete;
