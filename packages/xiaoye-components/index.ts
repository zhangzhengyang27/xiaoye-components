import type { App, Plugin } from "vue";
import "@xiaoye/theme";
import * as XiaoyeComponentExports from "@xiaoye/components";
import { installableComponentExportNames } from "../components/component-manifest";

export type { ComponentSize, ComponentStatus, SelectOption } from "@xiaoye/utils";
export * from "@xiaoye/components";

const INSTALL_KEY = Symbol.for("xiaoye-components:installed");

function isInstallableExport(value: unknown): value is Plugin {
  return (
    (typeof value === "function" || typeof value === "object") &&
    value !== null &&
    "install" in value &&
    typeof (value as { install?: unknown }).install === "function"
  );
}

const installableExports = Array.from(
  new Set(
    installableComponentExportNames
      .map((name) => XiaoyeComponentExports[name as keyof typeof XiaoyeComponentExports])
      .filter(isInstallableExport)
  )
) as Plugin[];

export function install(app: App) {
  const appWithInstallFlag = app as App & {
    [INSTALL_KEY]?: boolean;
  };

  if (appWithInstallFlag[INSTALL_KEY]) {
    return;
  }

  appWithInstallFlag[INSTALL_KEY] = true;

  installableExports.forEach((component) => {
    app.use(component);
  });
}

declare module "vue" {
  interface ComponentCustomProperties {
    $loading?: typeof import("@xiaoye/components").XyLoadingService;
    $message?: typeof import("@xiaoye/components").XyMessage;
    $notify?: typeof import("@xiaoye/components").XyNotificationService;
  }
}

export default {
  install
};
