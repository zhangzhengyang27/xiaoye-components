import { withInstall } from "xiaoye-primitives";
import Space from "./space.vue";
import type { SpaceProps, SpaceInstance, SpaceSize, SpaceDirection, SpaceAlignment, SpaceJustify } from "./space";

export type { SpaceProps, SpaceInstance, SpaceSize, SpaceDirection, SpaceAlignment, SpaceJustify };

export const XyuSpace = withInstall(Space, "XyuSpace");

export default XyuSpace;
