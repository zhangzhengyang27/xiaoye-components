import type { App, Plugin } from "vue";
import "./style.css";
export * from "./src/headless";

// 现有前台组件
export * from "./src/front-components/product-card";
export * from "./src/front-components/marketing-modal";
export * from "./src/front-components/image-gallery";
export * from "./src/front-components/sku-selector";
export * from "./src/front-components/address-picker";

// Phase 1-A: 表单基础
export * from "./src/front-components/button";
export * from "./src/front-components/input";
export * from "./src/front-components/text";
export * from "./src/front-components/link";
export * from "./src/front-components/tag";
export * from "./src/front-components/badge";

// Phase 1-B: 表单进阶
export * from "./src/front-components/select";
export * from "./src/front-components/checkbox";
export * from "./src/front-components/radio";
export * from "./src/front-components/switch";
export * from "./src/front-components/input-number";
export * from "./src/front-components/slider";

// Phase 1-C: 展示与反馈
export * from "./src/front-components/avatar";
export * from "./src/front-components/image";
export * from "./src/front-components/empty";
export * from "./src/front-components/skeleton";
export * from "./src/front-components/tabs";
export * from "./src/front-components/dropdown";
export * from "./src/front-components/tooltip";

// Phase 1-D: 布局弹层
export * from "./src/front-components/dialog";
export * from "./src/front-components/drawer";
export { default as XyuMessage } from "./src/front-components/message";
export { default as XyuNotification } from "./src/front-components/notification";

// Phase 2: 表单/展示/反馈补全
export * from "./src/front-components/space";
export * from "./src/front-components/progress";
export * from "./src/front-components/steps";
export * from "./src/front-components/alert";
export * from "./src/front-components/rate";
export * from "./src/front-components/input-tag";

// Phase 3: 表单组件补全
export * from "./src/front-components/pagination";
export * from "./src/front-components/popover";
export * from "./src/front-components/popconfirm";
export * from "./src/front-components/upload";
export * from "./src/front-components/cascader";
export * from "./src/front-components/date-picker";
export * from "./src/front-components/time-picker";

// Phase 3: 展示/布局组件
export * from "./src/front-components/card";
export * from "./src/front-components/timeline";
export * from "./src/front-components/result";
export * from "./src/front-components/divider";
export * from "./src/front-components/color-picker";
export * from "./src/front-components/backtop";

// Phase 3: 反馈组件
export * from "./src/front-components/loading";
export { default as XyuMessageBox, XyuMessageBoxService } from "./src/front-components/message-box";

// Composables
export * from "./src/composables";

// 注册所有可 install 的组件
import { XyuProductCard } from "./src/front-components/product-card";
import { XyuMarketingModal } from "./src/front-components/marketing-modal";
import { XyuImageGallery } from "./src/front-components/image-gallery";
import { XyuSkuSelector } from "./src/front-components/sku-selector";
import { XyuAddressPicker } from "./src/front-components/address-picker";
import { XyuButton } from "./src/front-components/button";
import { XyuInput } from "./src/front-components/input";
import { XyuText } from "./src/front-components/text";
import { XyuLink } from "./src/front-components/link";
import { XyuTag } from "./src/front-components/tag";
import { XyuBadge } from "./src/front-components/badge";
import { XyuSelect } from "./src/front-components/select";
import { XyuCheckbox } from "./src/front-components/checkbox";
import { XyuRadio } from "./src/front-components/radio";
import { XyuSwitch } from "./src/front-components/switch";
import { XyuInputNumber } from "./src/front-components/input-number";
import { XyuSlider } from "./src/front-components/slider";
import { XyuAvatar } from "./src/front-components/avatar";
import { XyuImage } from "./src/front-components/image";
import { XyuEmpty } from "./src/front-components/empty";
import { XyuSkeleton } from "./src/front-components/skeleton";
import { XyuTabs, XyuTabPane } from "./src/front-components/tabs";
import { XyuDropdown } from "./src/front-components/dropdown";
import { XyuTooltip } from "./src/front-components/tooltip";
import { XyuDialog } from "./src/front-components/dialog";
import { XyuDrawer } from "./src/front-components/drawer";
import { XyuSpace } from "./src/front-components/space";
import { XyuProgress } from "./src/front-components/progress";
import { XyuSteps, XyuStep } from "./src/front-components/steps";
import { XyuAlert } from "./src/front-components/alert";
import { XyuRate } from "./src/front-components/rate";
import { XyuInputTag } from "./src/front-components/input-tag";
// Phase 3
import { XyuPagination, XyuPager } from "./src/front-components/pagination";
import { XyuPopover } from "./src/front-components/popover";
import { XyuPopconfirm } from "./src/front-components/popconfirm";
import { XyuUpload } from "./src/front-components/upload";
import { XyuCascader } from "./src/front-components/cascader";
import { XyuDatePicker } from "./src/front-components/date-picker";
import { XyuTimePicker } from "./src/front-components/time-picker";
import { XyuCard } from "./src/front-components/card";
import { XyuTimeline, XyuTimelineItem } from "./src/front-components/timeline";
import { XyuResult } from "./src/front-components/result";
import { XyuDivider } from "./src/front-components/divider";
import { XyuColorPicker } from "./src/front-components/color-picker";
import { XyuBacktop } from "./src/front-components/backtop";
import { XyuLoading } from "./src/front-components/loading";
import { XyuMessageBox } from "./src/front-components/message-box";

const INSTALL_KEY = Symbol.for("xiaoye-ui:installed");

function isInstallableExport(value: unknown): value is Plugin {
  return (
    (typeof value === "function" || typeof value === "object") &&
    value !== null &&
    "install" in value &&
    typeof (value as { install?: unknown }).install === "function"
  );
}

const installableExports = [
  // 现有组件
  XyuProductCard,
  XyuMarketingModal,
  XyuImageGallery,
  XyuSkuSelector,
  XyuAddressPicker,
  // Phase 1-A
  XyuButton,
  XyuInput,
  XyuText,
  XyuLink,
  XyuTag,
  XyuBadge,
  // Phase 1-B
  XyuSelect,
  XyuCheckbox,
  XyuRadio,
  XyuSwitch,
  XyuInputNumber,
  XyuSlider,
  // Phase 1-C
  XyuAvatar,
  XyuImage,
  XyuEmpty,
  XyuSkeleton,
  XyuTabs,
  XyuTabPane,
  XyuDropdown,
  XyuTooltip,
  // Phase 1-D
  XyuDialog,
  XyuDrawer,
  // Phase 2
  XyuSpace,
  XyuProgress,
  XyuSteps,
  XyuStep,
  XyuAlert,
  XyuRate,
  XyuInputTag,
  // Phase 3
  XyuPagination,
  XyuPager,
  XyuPopover,
  XyuPopconfirm,
  XyuUpload,
  XyuCascader,
  XyuDatePicker,
  XyuTimePicker,
  XyuCard,
  XyuTimeline,
  XyuTimelineItem,
  XyuResult,
  XyuDivider,
  XyuColorPicker,
  XyuBacktop,
  XyuLoading,
  XyuMessageBox
].filter(isInstallableExport);

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

export default { install };
