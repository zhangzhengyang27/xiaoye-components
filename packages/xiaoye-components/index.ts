import type { App } from "vue";
import "@xiaoye/theme";
export type { ComponentSize, ComponentStatus, SelectOption } from "@xiaoye/utils";
import {
  XyButton,
  XyButtonGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyUpload,
  XyForm,
  XyFormItem
} from "@xiaoye/components";

const components = [
  XyButton,
  XyButtonGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyUpload,
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
  XyButtonGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyInput,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XySelect,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyTooltip,
  XyUpload,
  XyForm,
  XyFormItem
};

export * from "@xiaoye/components";

export default {
  install
};
