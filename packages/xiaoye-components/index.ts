import type { App } from "vue";
import "@xiaoye/theme";
export type { ComponentSize, ComponentStatus, SelectOption } from "@xiaoye/utils";
import {
  XyButton,
  XyConfigProvider,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyForm,
  XyFormItem
} from "@xiaoye/components";

const components = [
  XyButton,
  XyConfigProvider,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyForm,
  XyFormItem
];

export function install(app: App) {
  components.forEach((component) => {
    app.use(component);
  });
}

export {
  XyButton,
  XyConfigProvider,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyForm,
  XyFormItem
};

export * from "@xiaoye/components";

export default {
  install
};
