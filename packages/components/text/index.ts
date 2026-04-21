import Text from "./src/text.vue";
import type { TextProps, TextType } from "./src/text";
import { withInstall } from "@xiaoye/primitives";

export type { TextProps, TextType };

export const XyText = withInstall(Text, "xy-text");
export default XyText;
