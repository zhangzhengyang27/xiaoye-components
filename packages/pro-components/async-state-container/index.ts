import AsyncStateContainer from "./src/async-state-container.vue";
import type { AsyncStateContainerProps } from "./src/async-state-container";
import { withInstall } from "@xiaoye/primitives";

export type { AsyncStateContainerProps };

export const XyAsyncStateContainer = withInstall(
  AsyncStateContainer,
  "xy-async-state-container"
);

export default XyAsyncStateContainer;
