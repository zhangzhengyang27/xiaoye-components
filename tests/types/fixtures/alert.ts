import { h } from "vue";
import type {
  AlertBeforeCloseFn,
  AlertCloseReason,
  AlertEffect,
  AlertOverflowStrategy,
  AlertProps,
  AlertServiceClosedFn,
  AlertServiceHandle,
  AlertServiceOptions,
  AlertServiceSnapshot,
  AlertType,
  AlertVariant
} from "xiaoye-components";
import { XyAlert, XyAlertService } from "xiaoye-components";

const type: AlertType = "warning";
const effect: AlertEffect = "dark";
const variant: AlertVariant = "banner";
const closeReason: AlertCloseReason = "overflow";
const overflowStrategy: AlertOverflowStrategy = "drop-oldest";
const beforeClose: AlertBeforeCloseFn = (done) => done();
const onClosed: AlertServiceClosedFn = (reason) => {
  const currentReason: AlertCloseReason = reason;
  void currentReason;
};

void closeReason;
void overflowStrategy;

const alertProps: AlertProps = {
  modelValue: true,
  title: "高风险提醒",
  description: "请先校验配置后再继续发布",
  type,
  closable: true,
  closeText: "我知道了",
  showIcon: true,
  center: false,
  effect,
  duration: 3_000,
  size: "lg",
  variant,
  beforeClose,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnPageHidden: true,
  collapsible: true,
  defaultExpanded: false,
  lineClamp: 3,
  expandText: "查看更多",
  collapseText: "收起说明"
};

void alertProps;

const serviceOptions: AlertServiceOptions = {
  title: "服务提示",
  description: "这是一条来自全局服务的提示",
  type: "success",
  duration: 2_000,
  groupKey: "global-sync",
  appendTo: "#alert-service-target",
  maxQueue: 3,
  overflowStrategy,
  onClosed,
  showIcon: true,
  beforeClose,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnPageHidden: true,
  collapsible: true,
  defaultExpanded: true,
  lineClamp: 4,
  expandText: "查看更多",
  collapseText: "收起说明"
};

void serviceOptions;

const serviceOptionsWithElement: AlertServiceOptions = {
  title: "元素挂载服务提示",
  appendTo: document.createElement("div")
};

void serviceOptionsWithElement;

const serviceHandle: AlertServiceHandle = {
  id: "xy-alert-service-1",
  close() {},
  update() {}
};

void serviceHandle;

const serviceSnapshot: AlertServiceSnapshot = XyAlertService.getState();

void serviceSnapshot;

const vnode = h(
  XyAlert,
  {
    title: "插槽测试",
    showIcon: true
  },
  {
    title: () => "title",
    icon: () => "icon",
    default: () => "description",
    actions: () => "actions"
  }
);

void vnode;

const invalidType: AlertProps = {
  // @ts-expect-error invalid alert type should be rejected
  type: "danger"
};

void invalidType;

const invalidEffect: AlertProps = {
  // @ts-expect-error invalid alert effect should be rejected
  effect: "plain"
};

void invalidEffect;

const invalidVariant: AlertProps = {
  // @ts-expect-error invalid alert variant should be rejected
  variant: "solid"
};

void invalidVariant;

const invalidCloseText: AlertProps = {
  // @ts-expect-error closeText should be a string
  closeText: 1
};

void invalidCloseText;

const invalidDuration: AlertProps = {
  // @ts-expect-error duration should be a number
  duration: "3000"
};

void invalidDuration;

const invalidSize: AlertProps = {
  // @ts-expect-error invalid size should be rejected
  size: "xl"
};

void invalidSize;

const invalidPauseOnHover: AlertProps = {
  // @ts-expect-error pauseOnHover should be a boolean
  pauseOnHover: "true"
};

void invalidPauseOnHover;

const invalidServiceOptions: AlertServiceOptions = {
  // @ts-expect-error service options should not accept modelValue
  modelValue: true
};

void invalidServiceOptions;

const invalidServiceGroupKey: AlertServiceOptions = {
  // @ts-expect-error groupKey should be a string
  groupKey: 1
};

void invalidServiceGroupKey;

const invalidServiceAppendTo: AlertServiceOptions = {
  // @ts-expect-error appendTo should be a string or HTMLElement
  appendTo: 1
};

void invalidServiceAppendTo;

const invalidOverflowStrategy: AlertServiceOptions = {
  // @ts-expect-error overflowStrategy should be a supported strategy
  overflowStrategy: "replace-current"
};

void invalidOverflowStrategy;

const invalidPauseOnFocus: AlertProps = {
  // @ts-expect-error pauseOnFocus should be a boolean
  pauseOnFocus: "true"
};

void invalidPauseOnFocus;

const invalidPauseOnPageHidden: AlertProps = {
  // @ts-expect-error pauseOnPageHidden should be a boolean
  pauseOnPageHidden: "true"
};

void invalidPauseOnPageHidden;

const invalidLineClamp: AlertProps = {
  // @ts-expect-error lineClamp should be a number
  lineClamp: "2"
};

void invalidLineClamp;

const invalidExpandText: AlertProps = {
  // @ts-expect-error expandText should be a string
  expandText: 1
};

void invalidExpandText;

const invalidCollapseText: AlertProps = {
  // @ts-expect-error collapseText should be a string
  collapseText: 1
};

void invalidCollapseText;

const invalidMaxQueue: AlertServiceOptions = {
  // @ts-expect-error maxQueue should be a number
  maxQueue: "3"
};

void invalidMaxQueue;

const invalidOnClosed: AlertServiceOptions = {
  // @ts-expect-error onClosed should be a function
  onClosed: "closed"
};

void invalidOnClosed;
