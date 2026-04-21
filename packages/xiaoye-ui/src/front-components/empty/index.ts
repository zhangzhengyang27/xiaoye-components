import { withInstall } from "xiaoye-primitives";
import Empty from "./empty.vue";
import type { EmptyProps, EmptyInstance, EmptySize } from "./empty";

export type { EmptyProps, EmptyInstance, EmptySize };

export const XyuEmpty = withInstall(Empty, "XyuEmpty");

export default XyuEmpty;
