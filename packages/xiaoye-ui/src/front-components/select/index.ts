import { withInstall } from "xiaoye-primitives";
import Select from "./select.vue";
import type { SelectProps, SelectInstance, SelectSize, SelectOption } from "./select";

export type { SelectProps, SelectInstance, SelectSize, SelectOption };

export const XyuSelect = withInstall(Select, "XyuSelect");

export default XyuSelect;
