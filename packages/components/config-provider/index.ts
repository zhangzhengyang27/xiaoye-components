import ConfigProvider from "./src/config-provider.vue";
import type { ConfigProviderProps } from "./src/context";
import { withInstall } from "@xiaoye/utils";

export type { ConfigProviderProps };

export const XyConfigProvider = withInstall(ConfigProvider, "xy-config-provider");
export default XyConfigProvider;
