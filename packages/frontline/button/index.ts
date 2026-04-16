import FrontButton from "./src/front-button.vue";
import type { FrontButtonProps, FrontButtonSize, FrontButtonTone, FrontButtonVariant } from "./src/button";
import { withInstall } from "@xiaoye/utils";

export type { FrontButtonProps, FrontButtonSize, FrontButtonTone, FrontButtonVariant };

export const XyFrontButton = withInstall(FrontButton, "xy-front-button");
export default XyFrontButton;
