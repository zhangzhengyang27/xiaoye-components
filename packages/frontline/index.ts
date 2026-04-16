import type { App, Plugin } from "vue";
import "./style.css";
import { XyFrontButton } from "./button";
import { XyFrontCard } from "./card";
import { XyFrontDialog } from "./dialog";
import { XyFrontInput } from "./input";
import { XyFrontTabs } from "./tabs";
import { XyFrontPopover } from "./popover";
import { XyFrontSelect } from "./select";
import { XyFrontDropdown } from "./dropdown";
import { XyFrontMenu } from "./menu";
import { XyFrontCommand } from "./command";
import { XyFrontSearchPanel } from "./search-panel";

export * from "./button";
export * from "./card";
export * from "./dialog";
export * from "./input";
export * from "./tabs";
export * from "./popover";
export * from "./select";
export * from "./dropdown";
export * from "./menu";
export * from "./command";
export * from "./search-panel";
export { FrontSlot } from "./shared/slot";
export * from "./shared/contracts";

const INSTALL_KEY = Symbol.for("xiaoye-frontline:installed");
const installables: Plugin[] = [
  XyFrontButton,
  XyFrontCard,
  XyFrontDialog,
  XyFrontInput,
  XyFrontTabs,
  XyFrontPopover,
  XyFrontSelect,
  XyFrontDropdown,
  XyFrontMenu,
  XyFrontCommand,
  XyFrontSearchPanel
];

export function install(app: App) {
  const appWithInstallFlag = app as App & {
    [INSTALL_KEY]?: boolean;
  };

  if (appWithInstallFlag[INSTALL_KEY]) {
    return;
  }

  appWithInstallFlag[INSTALL_KEY] = true;
  installables.forEach((component) => app.use(component));
}

export default {
  install
};
