import ConfigProvider from "./src/config-provider.vue";
import {
  configProviderKey,
  createConfigProviderContext,
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX
} from "./src/context";
import type { ConfigProviderContext, ConfigProviderProps } from "./src/context";
import { withInstall } from "@xiaoye/utils";

export type { ConfigProviderContext, ConfigProviderProps };
export {
  configProviderKey,
  createConfigProviderContext,
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX
};

export const XyConfigProvider = withInstall(ConfigProvider, "xy-config-provider");
export default XyConfigProvider;
