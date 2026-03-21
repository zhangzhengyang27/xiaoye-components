import Tag from "./src/tag.vue";
import type { TagProps } from "./src/tag.vue";
import { withInstall } from "@xiaoye/utils";

export type { TagProps };

export const XyTag = withInstall(Tag, "xy-tag");
export default XyTag;
