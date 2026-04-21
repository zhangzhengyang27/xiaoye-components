import { withInstall } from "xiaoye-primitives";
import Text from "./text.vue";
import type { TextProps, TextInstance, TextSize, TextTag } from "./text";

export type { TextProps, TextInstance, TextSize, TextTag };

export const XyuText = withInstall(Text, "XyuText");

export default XyuText;
