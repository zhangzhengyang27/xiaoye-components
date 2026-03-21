import Space from "./src/space.vue";
import type { SpaceProps } from "./src/space.vue";
import { withInstall } from "@xiaoye/utils";

export type { SpaceProps };

export const XySpace = withInstall(Space, "xy-space");
export default XySpace;
