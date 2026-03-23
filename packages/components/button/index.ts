import Button from "./src/button.vue";
import ButtonGroup from "./src/button-group.vue";
import type { ButtonProps, ButtonNativeType, ButtonType } from "./src/button";
import type { ButtonGroupDirection, ButtonGroupProps } from "./src/button-group";
import { withInstall } from "@xiaoye/utils";

export type { ButtonGroupDirection, ButtonGroupProps, ButtonNativeType, ButtonProps, ButtonType };

export const XyButton = withInstall(Button, "xy-button");
export const XyButtonGroup = withInstall(ButtonGroup, "xy-button-group");
export default XyButton;
