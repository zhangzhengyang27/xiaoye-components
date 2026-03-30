import type { App, Plugin } from "vue";
import "./style.css";
import * as XiaoyeProComponentExports from "@xiaoye/pro-components";
import { proInstallableComponentExportNames } from "../pro-components/component-manifest";

export * from "@xiaoye/pro-components";

const INSTALL_KEY = Symbol.for("xiaoye-pro-components:installed");

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
    proInstallableComponentExportNames
      .map((name) => XiaoyeProComponentExports[name as keyof typeof XiaoyeProComponentExports])
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

export default {
  install
};
