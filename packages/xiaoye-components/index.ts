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
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XyScrollbar,
  XySelect,
  XySplitter,
  XySplitterPanel,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyText,
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
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XyScrollbar,
  XySelect,
  XySplitter,
  XySplitterPanel,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyText,
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
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRow,
  XyScrollbar,
  XySelect,
  XySplitter,
  XySplitterPanel,
  XySpace,
  XyTable,
  XyTabs,
  XyTag,
  XyText,
  XyTooltip,
  XyUpload,
  XyForm,
  XyFormItem
};

export * from "@xiaoye/components";

export default {
  install
};
