import { withInstall } from "xiaoye-primitives";
import AddressPicker from "./address-picker.vue";

export const XyuAddressPicker = withInstall(AddressPicker, "XyuAddressPicker");

export default XyuAddressPicker;
export type { AddressPickerProps, AddressValue } from "./address-picker.vue";
