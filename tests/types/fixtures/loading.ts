import { createApp, defineComponent, h } from "vue";
import type {
  LoadingBinding,
  LoadingGlobalConfig,
  LoadingInstance,
  LoadingOptions,
  LoadingOptionsResolved,
  LoadingParentElement
} from "xiaoye-components";
import { XyLoading, XyLoadingService } from "xiaoye-components";

const loadingTarget = document.createElement("div") as LoadingParentElement;

const loadingOptions: LoadingOptions = {
  target: "#loading-target",
  body: true,
  fullscreen: false,
  lock: true,
  delay: 120,
  minDuration: 240,
  groupKey: "publish-sync",
  text: "加载中",
  spinner: "custom-spinner",
  background: "rgba(15, 23, 42, 0.16)",
  customClass: "custom-loading-mask",
  svg: "<path d='M 25 5 L 45 45' />",
  svgViewBox: "0 0 50 50",
  visible: true,
  beforeClose: () => true,
  closed: () => {}
};

const resolvedOptions: LoadingOptionsResolved = {
  parent: loadingTarget,
  target: loadingTarget,
  background: "rgba(15, 23, 42, 0.16)",
  svg: "<path d='M 25 5 L 45 45' />",
  svgViewBox: "0 0 50 50",
  spinner: "custom-spinner",
  text: h("span", "加载中"),
  fullscreen: false,
  lock: true,
  customClass: "custom-loading-mask",
  visible: true,
  delay: 120,
  minDuration: 240,
  groupKey: "publish-sync",
  beforeClose: () => true,
  closed: () => {}
};

const loadingGlobalConfig: LoadingGlobalConfig = {
  text: "全局加载中",
  background: "rgba(15, 23, 42, 0.2)",
  spinner: "custom-spinner",
  svg: "<path d='M 25 5 L 45 45' />",
  svgViewBox: "0 0 50 50",
  delay: 80,
  minDuration: 160,
  fullscreen: true,
  lock: true
};

const loadingBindingBoolean: LoadingBinding = true;
const loadingBindingObject: LoadingBinding = {
  text: "局部加载",
  target: loadingTarget
};

const serviceInstance = XyLoadingService(loadingOptions);
serviceInstance.setText("更新文案");
serviceInstance.update({
  text: "再次更新",
  background: "rgba(255, 255, 255, 0.72)",
  delay: 60,
  minDuration: 200
});
serviceInstance.close();
XyLoadingService.closeAll();
const withResult = XyLoadingService.with(Promise.resolve("done"), {
  groupKey: "publish-sync"
});
void withResult;

const loadingPluginService = XyLoading.service({
  target: loadingTarget,
  text: "来自插件对象的 service"
});

const loadingDirective = XyLoading.directive;

const loadingInstance: LoadingInstance = loadingPluginService;
loadingInstance.setText(h("strong", "处理中"));
loadingInstance.close();

const app = createApp(
  defineComponent({
    render() {
      return h("div");
    }
  })
);

app.use(XyLoading);
const loadingFromGlobal = app.config.globalProperties.$loading!({
  target: loadingTarget,
  text: "全局方法"
});
loadingFromGlobal.close();

void loadingOptions;
void resolvedOptions;
void loadingGlobalConfig;
void loadingBindingBoolean;
void loadingBindingObject;
void serviceInstance;
void loadingDirective;
void loadingInstance;

const invalidTarget: LoadingOptions = {
  // @ts-expect-error invalid target type should be rejected
  target: 1
};

const invalidLock: LoadingOptions = {
  // @ts-expect-error lock should be a boolean
  lock: "true"
};

const invalidSpinner: LoadingOptions = {
  // @ts-expect-error spinner should be a string
  spinner: 1
};

const invalidDelay: LoadingOptions = {
  // @ts-expect-error delay should be a number
  delay: "100"
};

const invalidMinDuration: LoadingOptions = {
  // @ts-expect-error minDuration should be a number
  minDuration: "100"
};

const invalidGroupKey: LoadingOptions = {
  // @ts-expect-error groupKey should be a string
  groupKey: 1
};

const invalidBeforeClose: LoadingOptions = {
  // @ts-expect-error beforeClose should be a function
  beforeClose: "close"
};

const invalidBinding: LoadingBinding = {
  // @ts-expect-error body should be a boolean
  body: "true"
};

void invalidTarget;
void invalidLock;
void invalidSpinner;
void invalidDelay;
void invalidMinDuration;
void invalidGroupKey;
void invalidBeforeClose;
void invalidBinding;
