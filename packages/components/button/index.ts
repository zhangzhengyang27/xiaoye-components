import Button from "./src/button.vue";
import type { ButtonProps } from "./src/button.vue";
import { withInstall } from "@xiaoye/utils";

export type { ButtonProps };

export const XyButton = withInstall(Button, "xy-button");
export default XyButton;
