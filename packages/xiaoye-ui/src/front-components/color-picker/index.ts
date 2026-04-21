import { withInstall } from "xiaoye-primitives";
import ColorPicker from "./color-picker.vue";
import type { ColorPickerProps, ColorPickerEmits, ColorPickerInstance } from "./color-picker";

export type { ColorPickerProps, ColorPickerEmits, ColorPickerInstance };

export const XyuColorPicker = withInstall(ColorPicker, "XyuColorPicker");

export default XyuColorPicker;
