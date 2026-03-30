import AsyncStateContainer from "./src/async-state-container.vue";
import type { AsyncStateContainerProps } from "./src/async-state-container";
import { withInstall } from "@xiaoye/utils";

export type { AsyncStateContainerProps };

export const XyAsyncStateContainer = withInstall(
  AsyncStateContainer,
  "xy-async-state-container"
);

export default XyAsyncStateContainer;
