import Tag from "./src/tag.vue";
import type { TagCloseHandler, TagProps } from "./src/tag.vue";
import { withInstall } from "@xiaoye/utils";

export type { TagCloseHandler, TagProps };

export const XyTag = withInstall(Tag, "xy-tag");
export default XyTag;
