import Select from "./src/select.vue";
import type { SelectOption } from "@xiaoye/utils";
import type {
  SelectInstance,
  SelectOptionGroup,
  SelectOptionItem,
  SelectOptionSlotProps,
  SelectProps,
  SelectSearchChangeHandler,
  SelectValue
  ,
  SelectValueChangeHandler,
  SelectVisibleChangeHandler
} from "./src/select";
import { withInstall } from "@xiaoye/utils";

export type {
  SelectInstance,
  SelectOption,
  SelectOptionGroup,
  SelectOptionItem,
  SelectOptionSlotProps,
  SelectProps,
  SelectSearchChangeHandler,
  SelectValue
  ,
  SelectValueChangeHandler,
  SelectVisibleChangeHandler
};

export const XySelect = withInstall(Select, "xy-select");
export default XySelect;
