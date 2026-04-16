import FrontCommand from "./src/front-command.vue";
import type { FrontCommandItem, FrontCommandProps } from "./src/command";
import { withInstall } from "@xiaoye/utils";

export type { FrontCommandItem, FrontCommandProps };

export const XyFrontCommand = withInstall(FrontCommand, "xy-front-command");
export default XyFrontCommand;
