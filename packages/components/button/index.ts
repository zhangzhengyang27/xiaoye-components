import Button from "./src/button.vue";
import ButtonGroup from "./src/button-group.vue";
import type {
  ButtonClickHandler,
  ButtonInstance,
  ButtonProps,
  ButtonNativeType,
  ButtonType
} from "./src/button";
import type { ButtonGroupDirection, ButtonGroupProps } from "./src/button-group";
import { withInstall } from "@xiaoye/primitives";

export type {
  ButtonClickHandler,
  ButtonGroupDirection,
  ButtonGroupProps,
  ButtonInstance,
  ButtonNativeType,
  ButtonProps,
  ButtonType
};

export const XyButton = withInstall(Button, "xy-button");
export const XyButtonGroup = withInstall(ButtonGroup, "xy-button-group");
export default XyButton;
