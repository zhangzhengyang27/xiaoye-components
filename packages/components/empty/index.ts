import Empty from "./src/empty.vue";
import type { EmptyProps } from "./src/empty.vue";
import { withInstall } from "@xiaoye/utils";

export type { EmptyProps };

export const XyEmpty = withInstall(Empty, "xy-empty");
export default XyEmpty;
