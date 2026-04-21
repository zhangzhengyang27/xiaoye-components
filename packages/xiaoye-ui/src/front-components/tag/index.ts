import { withInstall } from "xiaoye-primitives";
import Tag from "./tag.vue";
import type { TagProps, TagInstance, TagType, TagSize } from "./tag";

export type { TagProps, TagInstance, TagType, TagSize };

export const XyuTag = withInstall(Tag, "XyuTag");

export default XyuTag;
