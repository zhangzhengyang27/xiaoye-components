import type { App } from "vue";
import "@xiaoye/theme";
export type { ComponentSize, ComponentStatus, SelectOption } from "@xiaoye/utils";
import {
  XyButton,
  XyButtonGroup,
  XyBadge,
  XyAvatar,
  XyAvatarGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyTimeSelect,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyCheckbox,
  XyCheckboxButton,
  XyCheckboxGroup,
  XyInput,
  XySwitch,
  XyInputTag,
  XyInputNumber,
  XyRate,
  XySlider,
  XyTimePicker,
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRadio,
  XyRadioButton,
  XyRadioGroup,
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

const INSTALL_KEY = Symbol.for("xiaoye-components:installed");

const components = [
  XyButton,
  XyButtonGroup,
  XyBadge,
  XyAvatar,
  XyAvatarGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyTimeSelect,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyCheckbox,
  XyCheckboxButton,
  XyCheckboxGroup,
  XyInput,
  XySwitch,
  XyInputTag,
  XyInputNumber,
  XyRate,
  XySlider,
  XyTimePicker,
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRadio,
  XyRadioButton,
  XyRadioGroup,
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
  const appWithInstallFlag = app as App & {
    [INSTALL_KEY]?: boolean;
  };

  if (appWithInstallFlag[INSTALL_KEY]) {
    return;
  }

  appWithInstallFlag[INSTALL_KEY] = true;

  components.forEach((component) => {
    app.use(component);
  });
}

export {
  XyButton,
  XyButtonGroup,
  XyBadge,
  XyAvatar,
  XyAvatarGroup,
  XyCol,
  XyConfigProvider,
  XyDatePicker,
  XyTimeSelect,
  XyDrawer,
  XyDropdown,
  XyEmpty,
  XyIcon,
  XyCheckbox,
  XyCheckboxButton,
  XyCheckboxGroup,
  XyInput,
  XySwitch,
  XyInputTag,
  XyInputNumber,
  XyRate,
  XySlider,
  XyTimePicker,
  XyLink,
  XyModal,
  XyPagination,
  XyPopover,
  XyRadio,
  XyRadioButton,
  XyRadioGroup,
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
