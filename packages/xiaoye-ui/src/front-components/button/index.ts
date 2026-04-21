import { withInstall } from "xiaoye-primitives";
import Button from "./button.vue";
import type { ButtonProps, ButtonInstance, ButtonType, ButtonNativeType, ButtonSize } from "./button";

export type { ButtonProps, ButtonInstance, ButtonType, ButtonNativeType, ButtonSize };

export const XyuButton = withInstall(Button, "XyuButton");

export default XyuButton;
